#!/usr/bin/env bash
set -euo pipefail

WP="wp --allow-root"
URL="${WORDPRESS_URL:-http://localhost:8080}"
ADMIN_USER="${WP_ADMIN_USER:-admin}"
ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-admin123_change_me}"
ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"
SITE_TITLE="${WP_SITE_TITLE:-JP Bùi Đặng}"

log() { echo "[setup] $*"; }

wait_for_wp() {
  local retries=30
  until $WP core version >/dev/null 2>&1; do
    retries=$((retries - 1))
    if [ "$retries" -le 0 ]; then
      echo "WordPress files not ready. Is the wordpress container running?"
      exit 1
    fi
    log "Waiting for WordPress files..."
    sleep 3
  done
}

install_wordpress() {
  if $WP core is-installed 2>/dev/null; then
    log "WordPress already installed."
    $WP core update 2>/dev/null || true
    $WP core update-db 2>/dev/null || true
    return
  fi

  log "Installing WordPress..."
  $WP core install \
    --url="$URL" \
    --title="$SITE_TITLE" \
    --admin_user="$ADMIN_USER" \
    --admin_password="$ADMIN_PASSWORD" \
    --admin_email="$ADMIN_EMAIL" \
    --skip-email

  $WP language core install vi --activate || $WP site switch-language vi
  $WP rewrite structure '/%postname%/' --hard
}

install_plugins_and_theme() {
  log "Installing plugins and theme..."
  $WP plugin install woocommerce --activate || log "WooCommerce install failed."
  $WP plugin install wordpress-seo --activate || log "Yoast SEO install failed."
  $WP plugin install contact-form-7 --activate || log "Contact Form 7 install failed."

  if $WP plugin is-installed payment-gateway-mo-mo-for-woocommerce 2>/dev/null; then
    $WP plugin activate payment-gateway-mo-mo-for-woocommerce || true
  else
    $WP plugin install payment-gateway-mo-mo-for-woocommerce --activate || log "MoMo plugin install failed — configure manually."
  fi

  if [ -f /scripts/plugins/vnpay-woocommerce.zip ]; then
    log "Installing VNPay plugin from bundled zip..."
    $WP plugin install /scripts/plugins/vnpay-woocommerce.zip --activate || log "VNPay plugin activation failed — configure in wp-admin."
  else
    log "VNPay zip not found at scripts/plugins/vnpay-woocommerce.zip — download from https://sandbox.vnpayment.vn/apis/docs/open/woocommerce/ and re-run setup."
  fi

  $WP theme install storefront --activate
  if $WP theme is-installed sos-beauty 2>/dev/null; then
    $WP theme activate sos-beauty
    log "Activated SOS Beauty child theme."
  else
    log "Theme sos-beauty not found — mount wp-content/themes/sos-beauty and re-run setup."
  fi
}

configure_woocommerce() {
  log "Configuring WooCommerce for Vietnam..."
  $WP wc tool run install_pages --user="$ADMIN_USER" 2>/dev/null || true

  $WP option update blogname "$SITE_TITLE"
  $WP option update timezone_string 'Asia/Ho_Chi_Minh'
  $WP option update start_of_week 1

  $WP option update woocommerce_store_address '123 Nguyen Hue'
  $WP option update woocommerce_store_city 'Ho Chi Minh'
  $WP option update woocommerce_default_country 'VN:SG'
  $WP option update woocommerce_store_postcode '700000'
  $WP option update woocommerce_currency 'VND'
  $WP option update woocommerce_currency_pos 'right_space'
  $WP option update woocommerce_price_thousand_sep '.'
  $WP option update woocommerce_price_decimal_sep ','
  $WP option update woocommerce_price_num_decimals '0'
  $WP option update woocommerce_weight_unit 'kg'
  $WP option update woocommerce_dimension_unit 'cm'
  $WP option update woocommerce_calc_taxes 'no'

  $WP option update woocommerce_cod_settings '{"enabled":"yes","title":"Thanh toán khi nhận hàng (COD)","description":"Thanh toán tiền mặt khi nhận hàng.","instructions":"Vui lòng chuẩn bị đúng số tiền khi nhận hàng.","enable_for_methods":"","enable_for_virtual":"no"}' --format=json

  $WP option update woocommerce_bacs_settings '{"enabled":"yes","title":"Chuyển khoản ngân hàng","description":"Chuyển khoản trực tiếp vào tài khoản ngân hàng của chúng tôi.","instructions":"Vui lòng chuyển khoản theo thông tin bên dưới và ghi nội dung đơn hàng.","account_details":[{"account_name":"JP Bùi Đặng","account_number":"0123456789","bank_name":"Vietcombank","sort_code":"","iban":"","bic":""}]}' --format=json

  configure_shipping_zone
}

configure_shipping_zone() {
  log "Setting up Vietnam shipping zone..."
  local zone_id=""
  zone_id=$($WP wc shipping_zone list --format=csv --user="$ADMIN_USER" 2>/dev/null | awk -F, 'NR>1 && $2 ~ /Vietnam/ {gsub(/"/,"",$1); print $1; exit}' || true)

  if [ -z "$zone_id" ]; then
    zone_id=$($WP wc shipping_zone create --name="Vietnam" --order=0 --user="$ADMIN_USER" --porcelain 2>/dev/null || echo "")
  fi

  if [ -n "$zone_id" ]; then
    $WP wc shipping_zone_location create "$zone_id" --type=country --code=VN --user="$ADMIN_USER" 2>/dev/null || true
    $WP wc shipping_zone_method create "$zone_id" flat_rate --user="$ADMIN_USER" 2>/dev/null || true
    $WP wc shipping_zone_method create "$zone_id" free_shipping --user="$ADMIN_USER" 2>/dev/null || true
  else
    log "Could not create shipping zone via CLI — configure manually in WooCommerce > Settings > Shipping."
  fi
}

create_pages() {
  log "Creating pages..."
  local about_id contact_id policy_return_id policy_ship_id

  about_id=$($WP post list --post_type=page --name=gioi-thieu --field=ID 2>/dev/null | head -1)
  if [ -z "$about_id" ]; then
    about_id=$($WP post create --post_type=page --post_title='Giới thiệu' --post_name=gioi-thieu --post_status=publish --porcelain)
  fi

  policy_return_id=$($WP post list --post_type=page --name=chinh-sach-doi-tra --field=ID 2>/dev/null | head -1)
  if [ -z "$policy_return_id" ]; then
    policy_return_id=$($WP post create --post_type=page \
      --post_title='Chính sách đổi trả' \
      --post_name=chinh-sach-doi-tra \
      --post_status=publish \
      --post_content='Khách hàng có thể đổi/trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem, nhãn và chưa qua sử dụng.' \
      --porcelain)
  fi

  policy_ship_id=$($WP post list --post_type=page --name=chinh-sach-giao-hang --field=ID 2>/dev/null | head -1)
  if [ -z "$policy_ship_id" ]; then
    policy_ship_id=$($WP post create --post_type=page \
      --post_title='Chính sách giao hàng' \
      --post_name=chinh-sach-giao-hang \
      --post_status=publish \
      --post_content='Giao hàng toàn quốc. Nội thành HCM/HN: 2-3 ngày. Tỉnh khác: 3-7 ngày làm việc.' \
      --porcelain)
  fi

  contact_id=$($WP post list --post_type=page --name=lien-he --field=ID 2>/dev/null | head -1)
  if [ -z "$contact_id" ]; then
    contact_id=$($WP post create --post_type=page \
      --post_title='Liên hệ' \
      --post_name=lien-he \
      --post_status=publish \
      --post_content='Hotline: 0901 234 567 | Email: support@example.com' \
      --porcelain)
  fi

  local shop_id cart_id checkout_id account_id front_id
  shop_id=$($WP option get woocommerce_shop_page_id 2>/dev/null || echo "")
  cart_id=$($WP option get woocommerce_cart_page_id 2>/dev/null || echo "")
  checkout_id=$($WP option get woocommerce_checkout_page_id 2>/dev/null || echo "")
  account_id=$($WP option get woocommerce_myaccount_page_id 2>/dev/null || echo "")
  front_id=$($WP option get page_on_front 2>/dev/null || echo "")

  if [ -z "$front_id" ] || [ "$front_id" = "0" ]; then
    front_id=$($WP post list --post_type=page --name=trang-chu --field=ID 2>/dev/null | head -1)
    if [ -z "$front_id" ]; then
      front_id=$($WP post create --post_type=page \
        --post_title='Trang chủ' \
        --post_name=trang-chu \
        --post_status=publish \
        --post_content='' \
        --porcelain)
    fi
    $WP option update show_on_front page
    $WP option update page_on_front "$front_id"
  fi
}

create_menu() {
  log "Creating navigation menu..."
  local menu_id
  menu_id=$($WP menu list --format=csv 2>/dev/null | awk -F, 'NR>1 && $2 ~ /Main Menu/ {gsub(/"/,"",$1); print $1; exit}')

  if [ -z "$menu_id" ]; then
    menu_id=$($WP menu create 'Main Menu' --porcelain)
  fi

  local existing_items
  existing_items=$($WP menu item list "$menu_id" --format=ids 2>/dev/null || echo "")
  if [ -n "$existing_items" ]; then
    # shellcheck disable=SC2086
    $WP menu item delete $existing_items 2>/dev/null || true
    log "Cleared existing menu items."
  fi

  local front_id shop_id about_id contact_id cat_food cat_beauty cat_tpcn
  front_id=$($WP option get page_on_front 2>/dev/null || echo "")
  shop_id=$($WP option get woocommerce_shop_page_id 2>/dev/null || echo "")
  about_id=$($WP post list --post_type=page --name=gioi-thieu --field=ID 2>/dev/null | head -1)
  contact_id=$($WP post list --post_type=page --name=lien-he --field=ID 2>/dev/null | head -1)
  cat_food=$($WP term list product_cat --slug=thuc-pham-nhat --field=term_id 2>/dev/null | head -1)
  cat_beauty=$($WP term list product_cat --slug=my-pham-nhat --field=term_id 2>/dev/null | head -1)
  cat_tpcn=$($WP term list product_cat --slug=tpcn --field=term_id 2>/dev/null | head -1)

  [ -n "$front_id" ] && $WP menu item add-post "$menu_id" "$front_id" 2>/dev/null || true
  [ -n "$shop_id" ] && $WP menu item add-post "$menu_id" "$shop_id" 2>/dev/null || true
  [ -n "$cat_food" ] && $WP menu item add-term "$menu_id" product_cat "$cat_food" 2>/dev/null || true
  [ -n "$cat_beauty" ] && $WP menu item add-term "$menu_id" product_cat "$cat_beauty" 2>/dev/null || true
  [ -n "$cat_tpcn" ] && $WP menu item add-term "$menu_id" product_cat "$cat_tpcn" 2>/dev/null || true
  [ -n "$about_id" ] && $WP menu item add-post "$menu_id" "$about_id" 2>/dev/null || true
  [ -n "$contact_id" ] && $WP menu item add-post "$menu_id" "$contact_id" 2>/dev/null || true

  $WP menu location assign "$menu_id" primary 2>/dev/null || true
  $WP menu location assign "$menu_id" handheld 2>/dev/null || true
}

create_demo_products() {
  log "Creating demo products (food, beauty, TPCN)..."
  local cat_food cat_beauty cat_tpcn

  cat_food=$($WP term list product_cat --slug=thuc-pham-nhat --field=term_id 2>/dev/null | head -1)
  if [ -z "$cat_food" ]; then
    cat_food=$($WP term create product_cat 'Thực phẩm Nhật' --slug=thuc-pham-nhat --porcelain)
  fi

  cat_beauty=$($WP term list product_cat --slug=my-pham-nhat --field=term_id 2>/dev/null | head -1)
  if [ -z "$cat_beauty" ]; then
    cat_beauty=$($WP term create product_cat 'Mỹ phẩm Nhật' --slug=my-pham-nhat --porcelain)
  fi

  cat_tpcn=$($WP term list product_cat --slug=tpcn --field=term_id 2>/dev/null | head -1)
  if [ -z "$cat_tpcn" ]; then
    cat_tpcn=$($WP term create product_cat 'TPCN' --slug=tpcn --porcelain)
  fi

  create_beauty_product "bot-matcha-uji" "Bột matcha Uji Kyoto" 320000 45 "$cat_food"
  create_beauty_product "miso-vang" "Miso tương vàng Hokkaido" 185000 60 "$cat_food"
  create_beauty_product "banh-gao-senbei" "Bánh gạo senbei mix vị" 95000 80 "$cat_food"

  create_beauty_product "serum-vitamin-c" "Serum Vitamin C 20%" 450000 40 "$cat_beauty"
  create_beauty_product "kem-duong-am" "Kem dưỡng ẩm Hyaluronic" 380000 55 "$cat_beauty"
  create_beauty_product "son-kem-li" "Son kem lì Velvet Rose" 290000 35 "$cat_beauty"

  create_beauty_product "collagen-nhat" "Collagen peptide Nhật Bản" 680000 30 "$cat_tpcn"
  create_beauty_product "vitamin-c-vien" "Vitamin C 1000mg" 420000 50 "$cat_tpcn"
  create_beauty_product "omega-3-dha" "Omega-3 DHA EPA" 550000 25 "$cat_tpcn"
}

create_beauty_product() {
  local slug="$1" name="$2" price="$3" stock="$4" cat_id="$5"
  local existing
  existing=$($WP post list --post_type=product --name="$slug" --field=ID 2>/dev/null | head -1)
  if [ -n "$existing" ]; then
    return
  fi

  local product_id
  product_id=$($WP wc product create \
    --name="$name" \
    --slug="$slug" \
    --regular_price="$price" \
    --manage_stock=true \
    --stock_quantity="$stock" \
    --categories="[{\"id\":$cat_id}]" \
    --user="$ADMIN_USER" \
    --porcelain 2>/dev/null || echo "")

  if [ -n "$product_id" ]; then
    $WP post meta update "$product_id" _sos_ingredients "Thành phần tự nhiên, nhập khẩu từ Nhật Bản. Xem nhãn sản phẩm để biết chi tiết." 2>/dev/null || true
    $WP post meta update "$product_id" _sos_how_to_use "Sử dụng theo hướng dẫn trên bao bì. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp." 2>/dev/null || true
    log "Created product: $name (ID $product_id)"
  else
    log "Failed to create product: $name"
  fi
}

finalize() {
  $WP rewrite flush --hard
  $WP cache flush 2>/dev/null || true
  log "Setup complete."
  log "Store: $URL"
  log "Admin: $URL/wp-admin (user: $ADMIN_USER)"
}

main() {
  wait_for_wp
  install_wordpress
  install_plugins_and_theme
  configure_woocommerce
  create_pages
  create_menu
  create_demo_products
  finalize
}

main "$@"
