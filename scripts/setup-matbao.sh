#!/usr/bin/env bash
# Seed Mat Bao / Plesk to match local Docker demo (CLI only — no wp-admin clicks).
# Prerequisites: WP installed, Storefront available or installable, PHP 8.2 via wp wrapper.
#
# Usage on host:
#   source ~/.bashrc
#   cd ~/httpdocs
#   bash ~/setup-matbao.sh
#   # or: bash ~/httpdocs/wp-content/../setup-matbao.sh after unpack
#
# Env (optional):
#   WORDPRESS_URL=https://jpbuidang.vn
#   WP_ADMIN_USER=admin   # login name for wc --user=

set -euo pipefail

PHP_BIN="${PHP_BIN:-/opt/plesk/php/8.2/bin/php}"
WP_BIN="${WP_BIN:-/usr/local/bin/wp}"

if [ -x "$PHP_BIN" ] && [ -f "$WP_BIN" ]; then
  WP="$PHP_BIN $WP_BIN"
elif command -v wp >/dev/null 2>&1; then
  WP="wp"
else
  echo "wp-cli not found. Set WP_BIN / PHP_BIN." >&2
  exit 1
fi

# Resolve httpdocs: cwd, or ~/httpdocs
if [ -f ./wp-config.php ]; then
  ROOT="$(pwd)"
elif [ -f "$HOME/httpdocs/wp-config.php" ]; then
  ROOT="$HOME/httpdocs"
  cd "$ROOT"
else
  echo "Run from httpdocs (wp-config.php missing)." >&2
  exit 1
fi

URL="${WORDPRESS_URL:-https://jpbuidang.vn}"
SITE_TITLE="${WP_SITE_TITLE:-JP Bùi Đặng}"
ADMIN_USER="${WP_ADMIN_USER:-}"

if [ -z "$ADMIN_USER" ]; then
  ADMIN_USER="$($WP user list --role=administrator --field=user_login 2>/dev/null | head -1 || true)"
fi
if [ -z "$ADMIN_USER" ]; then
  ADMIN_USER="1"
fi

log() { echo "[matbao-setup] $*"; }

require_wp() {
  if ! $WP core is-installed >/dev/null 2>&1; then
    echo "WordPress not installed — install via Toolkit first, then re-run." >&2
    exit 1
  fi
  log "WP $($WP core version) · user=$ADMIN_USER · url=$URL · root=$ROOT"
}

sync_urls() {
  log "siteurl/home → $URL"
  $WP option update siteurl "$URL"
  $WP option update home "$URL"
  $WP option update blogname "$SITE_TITLE"
  $WP rewrite structure '/%postname%/' --hard 2>/dev/null || $WP rewrite structure '/%postname%/'
  $WP language core install vi --activate 2>/dev/null || $WP site switch-language vi 2>/dev/null || true
}

install_plugins_and_theme() {
  log "Plugins + themes..."
  $WP plugin install woocommerce --activate 2>/dev/null || $WP plugin activate woocommerce || true
  $WP plugin install wordpress-seo --activate 2>/dev/null || $WP plugin activate wordpress-seo || true
  $WP plugin install contact-form-7 --activate 2>/dev/null || $WP plugin activate contact-form-7 || true
  $WP plugin install payment-gateway-mo-mo-for-woocommerce --activate 2>/dev/null \
    || $WP plugin activate payment-gateway-mo-mo-for-woocommerce 2>/dev/null || true

  $WP plugin delete hello akismet 2>/dev/null || true

  local vnpay=""
  for c in "$ROOT/../vnpay-woocommerce.zip" "$HOME/vnpay-woocommerce.zip" "$ROOT/vnpay-woocommerce.zip"; do
    [ -f "$c" ] && vnpay="$c" && break
  done
  if [ -n "$vnpay" ]; then
    $WP plugin install "$vnpay" --activate || log "VNPay install failed"
  fi

  $WP theme install storefront --activate 2>/dev/null || $WP theme activate storefront || true

  if [ -f "$ROOT/wp-content/themes/sos-beauty/style.css" ]; then
    $WP theme activate sos-beauty
    log "Activated sos-beauty"
  else
    log "WARN: sos-beauty missing at wp-content/themes/sos-beauty — upload theme zip first"
  fi
}

configure_woocommerce() {
  log "WooCommerce VN (HN)..."
  $WP wc tool run install_pages --user="$ADMIN_USER" 2>/dev/null || true

  $WP option update timezone_string 'Asia/Ho_Chi_Minh'
  $WP option update start_of_week 1
  $WP option update woocommerce_store_address 'Tầng 1, CT2, Mễ Trì Thượng'
  $WP option update woocommerce_store_city 'Hà Nội'
  $WP option update woocommerce_default_country 'VN:HN'
  $WP option update woocommerce_store_postcode '100000'
  $WP option update woocommerce_currency 'VND'
  $WP option update woocommerce_currency_pos 'right_space'
  $WP option update woocommerce_price_thousand_sep '.'
  $WP option update woocommerce_price_decimal_sep ','
  $WP option update woocommerce_price_num_decimals '0'
  $WP option update woocommerce_weight_unit 'kg'
  $WP option update woocommerce_dimension_unit 'cm'
  $WP option update woocommerce_calc_taxes 'no'
  $WP option update woocommerce_coming_soon 'no'
  $WP option update woocommerce_store_pages_only 'no'

  $WP option update woocommerce_cod_settings \
    '{"enabled":"yes","title":"Thanh toán khi nhận hàng (COD)","description":"Thanh toán tiền mặt khi nhận hàng.","instructions":"Vui lòng chuẩn bị đúng số tiền khi nhận hàng.","enable_for_methods":"","enable_for_virtual":"no"}' \
    --format=json

  $WP option update woocommerce_bacs_settings \
    '{"enabled":"yes","title":"Chuyển khoản ngân hàng","description":"Chuyển khoản trực tiếp vào tài khoản ngân hàng của chúng tôi.","instructions":"Vui lòng chuyển khoản theo thông tin bên dưới và ghi nội dung đơn hàng.","account_details":[{"account_name":"JP Bùi Đặng","account_number":"0123456789","bank_name":"Vietcombank","sort_code":"","iban":"","bic":""}]}' \
    --format=json

  configure_shipping_zone
}

configure_shipping_zone() {
  log "Shipping zone Vietnam..."
  local zone_id=""
  zone_id=$($WP wc shipping_zone list --format=csv --user="$ADMIN_USER" 2>/dev/null | awk -F, 'NR>1 && $2 ~ /Vietnam/ {gsub(/"/,"",$1); print $1; exit}' || true)
  if [ -z "$zone_id" ]; then
    zone_id=$($WP wc shipping_zone create --name="Vietnam" --order=0 --user="$ADMIN_USER" --porcelain 2>/dev/null || echo "")
  fi
  if [ -n "$zone_id" ]; then
    $WP wc shipping_zone_location create "$zone_id" --type=country --code=VN --user="$ADMIN_USER" 2>/dev/null || true
    $WP wc shipping_zone_method create "$zone_id" flat_rate --user="$ADMIN_USER" 2>/dev/null || true
    $WP wc shipping_zone_method create "$zone_id" free_shipping --user="$ADMIN_USER" 2>/dev/null || true
  fi
}

ensure_term() {
  local name="$1" slug="$2" parent_id="${3:-0}"
  local id
  id=$($WP term list product_cat --slug="$slug" --field=term_id 2>/dev/null | head -1)
  if [ -z "$id" ]; then
    if [ -n "$parent_id" ] && [ "$parent_id" != "0" ]; then
      id=$($WP term create product_cat "$name" --slug="$slug" --parent="$parent_id" --porcelain)
    else
      id=$($WP term create product_cat "$name" --slug="$slug" --porcelain)
    fi
  else
    $WP term update product_cat "$id" --name="$name" >/dev/null 2>&1 || true
    if [ -n "$parent_id" ] && [ "$parent_id" != "0" ]; then
      $WP term update product_cat "$id" --parent="$parent_id" >/dev/null 2>&1 || true
    elif [ "$parent_id" = "0" ]; then
      $WP term update product_cat "$id" --parent=0 >/dev/null 2>&1 || true
    fi
  fi
  echo "$id"
}

ensure_product_category_tree() {
  log "Product category tree..."
  local cat_beauty cat_goods cat_food cat_tpcn cat_skin cat_hair cat_body
  cat_beauty=$(ensure_term 'Mỹ phẩm' 'my-pham-nhat' 0)
  cat_goods=$(ensure_term 'Hàng tiêu dùng' 'hang-tieu-dung' 0)
  cat_food=$(ensure_term 'Thực phẩm' 'thuc-pham-nhat' 0)
  cat_tpcn=$(ensure_term 'TPCN' 'tpcn' "$cat_goods")
  cat_skin=$(ensure_term 'Chăm sóc da' 'cham-soc-da' "$cat_beauty")
  ensure_term 'Toner, nước hoa hồng' 'toner' "$cat_skin" >/dev/null
  ensure_term 'Serum' 'serum' "$cat_skin" >/dev/null
  ensure_term 'Kem dưỡng' 'kem-duong' "$cat_skin" >/dev/null
  ensure_term 'Mặt nạ' 'mat-na' "$cat_skin" >/dev/null
  ensure_term 'Rửa mặt' 'rua-mat' "$cat_skin" >/dev/null
  ensure_term 'Tẩy trang' 'tay-trang' "$cat_skin" >/dev/null
  cat_hair=$(ensure_term 'Chăm sóc tóc' 'cham-soc-toc' "$cat_beauty")
  ensure_term 'Dầu gội' 'dau-goi' "$cat_hair" >/dev/null
  ensure_term 'Dầu xả' 'dau-xa' "$cat_hair" >/dev/null
  cat_body=$(ensure_term 'Cơ thể' 'cham-soc-co-the' "$cat_beauty")
  ensure_term 'Sữa tắm' 'sua-tam' "$cat_body" >/dev/null
  ensure_term 'Xà phòng' 'xa-phong' "$cat_body" >/dev/null
  ensure_term 'Chăm sóc răng miệng' 'cham-soc-rang-mieng' "$cat_body" >/dev/null
  log "Categories OK (beauty=$cat_beauty goods=$cat_goods food=$cat_food tpcn=$cat_tpcn)"
}

ABOUT_CONTENT='Công ty TNHH JP Bùi Đặng là doanh nghiệp chuyên nhập khẩu và phân phối các sản phẩm chính hãng từ Nhật Bản tại thị trường Việt Nam. Với hơn 15 năm kinh nghiệm trong ngành nhập khẩu và phân phối, đồng hành cùng các thương hiệu Nhật Bản trong các lĩnh vực mỹ phẩm, chăm sóc sức khỏe, làm đẹp và hàng tiêu dùng. Với cam kết mang đến sản phẩm chính hãng, chất lượng cao, JP Bùi Đặng không ngừng kết nối người tiêu dùng Việt Nam với tinh hoa tiêu dùng từ Nhật Bản.

<!-- wp:heading {"level":3} -->
<h3>Ý kiến khách hàng</h3>
<!-- /wp:heading -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Mình biết đến JP Bùi Đặng qua một người bạn giới thiệu và đến nay đã sử dụng sản phẩm của công ty hơn một năm. Điều khiến mình hài lòng nhất là sản phẩm luôn có nguồn gốc rõ ràng, chất lượng ổn định và đúng như mô tả.</p><cite>Khách hàng — Người tiêu dùng</cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Là người yêu thích mỹ phẩm nội địa Nhật, mình khá kỹ tính khi lựa chọn nơi mua hàng. Sau nhiều lần trải nghiệm, JP Bùi Đặng là đơn vị khiến mình tin tưởng nhất.</p><cite>Khách hàng — Người yêu mỹ phẩm Nhật</cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Chúng tôi đã hợp tác với JP Bùi Đặng trong nhiều năm và đánh giá rất cao sự chuyên nghiệp của đội ngũ. Nguồn hàng luôn ổn định, chính sách hợp tác minh bạch.</p><cite>Đại lý phân phối</cite></blockquote>
<!-- /wp:quote -->'

CONTACT_CONTENT='<!-- wp:paragraph -->
<p><strong>CÔNG TY TNHH JP- BÙI ĐẶNG</strong></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Địa chỉ: Tầng 1, CT2, Mễ Trì Thượng, Nam Từ Liêm, Hà Nội</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Fanpage: <a href="https://web.facebook.com/hangnhatchomoinha.vn">facebook.com/hangnhatchomoinha.vn</a></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Liên hệ: 098 5561862 — 0965180859</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Email: <a href="mailto:jpbuidangco.ltd@gmail.com">jpbuidangco.ltd@gmail.com</a></p>
<!-- /wp:paragraph -->'

ensure_page() {
  local title="$1" slug="$2" content="${3:-}"
  local id
  id=$($WP post list --post_type=page --name="$slug" --field=ID 2>/dev/null | head -1)
  if [ -z "$id" ]; then
    if [ -n "$content" ]; then
      id=$($WP post create --post_type=page --post_title="$title" --post_name="$slug" \
        --post_status=publish --post_content="$content" --porcelain)
    else
      id=$($WP post create --post_type=page --post_title="$title" --post_name="$slug" \
        --post_status=publish --porcelain)
    fi
    log "Created page: $title (#$id)"
  else
    if [ -n "$content" ]; then
      $WP post update "$id" --post_content="$content" >/dev/null
    fi
    log "Page exists: $title (#$id)"
  fi
  echo "$id"
}

create_pages() {
  log "Pages..."
  ensure_page 'Giới thiệu' 'gioi-thieu' "$ABOUT_CONTENT" >/dev/null
  ensure_page 'Liên hệ' 'lien-he' "$CONTACT_CONTENT" >/dev/null
  ensure_page 'Chính sách đổi trả' 'chinh-sach-doi-tra' \
    'Khách hàng có thể đổi/trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem, nhãn và chưa qua sử dụng.' >/dev/null
  ensure_page 'Chính sách giao hàng' 'chinh-sach-giao-hang' \
    'Giao hàng toàn quốc. Nội thành HN/HCM: 2-3 ngày. Tỉnh khác: 3-7 ngày làm việc.' >/dev/null
  ensure_page 'Chính sách bảo mật' 'chinh-sach-bao-mat' \
    'Chúng tôi cam kết bảo mật thông tin cá nhân khách hàng. Dữ liệu chỉ dùng để xử lý đơn hàng và chăm sóc khách hàng, không bán cho bên thứ ba.' >/dev/null
  ensure_page 'Hướng dẫn mua hàng' 'huong-dan-mua-hang' \
    '1. Chọn sản phẩm và thêm vào giỏ. 2. Kiểm tra giỏ hàng. 3. Điền thông tin giao hàng. 4. Chọn phương thức thanh toán (COD / chuyển khoản / MoMo). 5. Xác nhận đơn.' >/dev/null

  local blog_id front_id
  blog_id=$($WP post list --post_type=page --name=tin-tuc --field=ID 2>/dev/null | head -1)
  if [ -z "$blog_id" ]; then
    blog_id=$($WP post create --post_type=page --post_title='Tin tức' --post_name=tin-tuc --post_status=publish --porcelain)
  fi
  $WP option update page_for_posts "$blog_id"

  if [ -z "$($WP post list --post_type=post --name=jp-bui-dang-chinh-hang --field=ID 2>/dev/null | head -1)" ]; then
    $WP post create --post_type=post --post_title='JP Bùi Đặng đồng hành cùng sản phẩm Nhật chính hãng' \
      --post_name=jp-bui-dang-chinh-hang --post_status=publish \
      --post_content='Nội dung demo tin tức — cập nhật sau.' >/dev/null
  fi
  if [ -z "$($WP post list --post_type=post --name=xu-huong-cham-soc-da-nhat --field=ID 2>/dev/null | head -1)" ]; then
    $WP post create --post_type=post --post_title='Xu hướng chăm sóc da chuẩn Nhật' \
      --post_name=xu-huong-cham-soc-da-nhat --post_status=publish \
      --post_content='Nội dung demo tin tức — cập nhật sau.' >/dev/null
  fi

  # Delete Hello World / Sample Page
  local hw sp
  hw=$($WP post list --post_type=post --name=hello-world --field=ID 2>/dev/null | head -1 || true)
  [ -n "$hw" ] && $WP post delete "$hw" --force 2>/dev/null || true
  sp=$($WP post list --post_type=page --name=sample-page --field=ID 2>/dev/null | head -1 || true)
  [ -n "$sp" ] && $WP post delete "$sp" --force 2>/dev/null || true

  front_id=$($WP post list --post_type=page --name=trang-chu --field=ID 2>/dev/null | head -1)
  if [ -z "$front_id" ]; then
    front_id=$($WP post create --post_type=page --post_title='Trang chủ' --post_name=trang-chu --post_status=publish --porcelain)
  fi
  $WP option update show_on_front page
  $WP option update page_on_front "$front_id"
}

create_menu() {
  log "Menu (đề xuất: Trang chủ · Giới thiệu · Sản phẩm · Tin tức · Liên hệ)..."
  ensure_product_category_tree

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
  fi

  local front_id shop_id about_id blog_id contact_id
  front_id=$($WP option get page_on_front 2>/dev/null || echo "")
  shop_id=$($WP option get woocommerce_shop_page_id 2>/dev/null || echo "")
  about_id=$($WP post list --post_type=page --name=gioi-thieu --field=ID 2>/dev/null | head -1)
  blog_id=$($WP post list --post_type=page --name=tin-tuc --field=ID 2>/dev/null | head -1)
  contact_id=$($WP post list --post_type=page --name=lien-he --field=ID 2>/dev/null | head -1)

  [ -n "$front_id" ] && $WP menu item add-post "$menu_id" "$front_id" --title='Trang chủ' 2>/dev/null || true
  [ -n "$about_id" ] && $WP menu item add-post "$menu_id" "$about_id" --title='Giới thiệu' 2>/dev/null || true
  [ -n "$shop_id" ] && $WP menu item add-post "$menu_id" "$shop_id" --title='Sản phẩm' 2>/dev/null || true
  [ -n "$blog_id" ] && $WP menu item add-post "$menu_id" "$blog_id" --title='Tin tức' 2>/dev/null || true
  [ -n "$contact_id" ] && $WP menu item add-post "$menu_id" "$contact_id" --title='Liên hệ' 2>/dev/null || true

  $WP menu location assign "$menu_id" primary 2>/dev/null || true
  $WP menu location assign "$menu_id" handheld 2>/dev/null || true
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
    $WP post meta update "$product_id" _sos_ingredients "Thành phần tự nhiên, nhập khẩu từ Nhật Bản." 2>/dev/null || true
    $WP post meta update "$product_id" _sos_how_to_use "Sử dụng theo hướng dẫn trên bao bì." 2>/dev/null || true
    log "Product: $name (#$product_id)"
  else
    log "FAIL product: $name"
  fi
}

create_demo_products() {
  log "Demo products (same as local setup.sh)..."
  ensure_product_category_tree
  local cat_food cat_beauty cat_tpcn cat_serum cat_kem
  cat_food=$($WP term list product_cat --slug=thuc-pham-nhat --field=term_id 2>/dev/null | head -1)
  cat_beauty=$($WP term list product_cat --slug=my-pham-nhat --field=term_id 2>/dev/null | head -1)
  cat_tpcn=$($WP term list product_cat --slug=tpcn --field=term_id 2>/dev/null | head -1)
  cat_serum=$($WP term list product_cat --slug=serum --field=term_id 2>/dev/null | head -1)
  cat_kem=$($WP term list product_cat --slug=kem-duong --field=term_id 2>/dev/null | head -1)

  create_beauty_product "bot-matcha-uji" "Bột matcha Uji Kyoto" 320000 45 "$cat_food"
  create_beauty_product "miso-vang" "Miso tương vàng Hokkaido" 185000 60 "$cat_food"
  create_beauty_product "banh-gao-senbei" "Bánh gạo senbei mix vị" 95000 80 "$cat_food"
  create_beauty_product "serum-vitamin-c" "Serum Vitamin C 20%" 450000 40 "${cat_serum:-$cat_beauty}"
  create_beauty_product "kem-duong-am" "Kem dưỡng ẩm Hyaluronic" 380000 55 "${cat_kem:-$cat_beauty}"
  create_beauty_product "son-kem-li" "Son kem lì Velvet Rose" 290000 35 "$cat_beauty"
  create_beauty_product "collagen-nhat" "Collagen peptide Nhật Bản" 680000 30 "$cat_tpcn"
  create_beauty_product "vitamin-c-vien" "Vitamin C 1000mg" 420000 50 "$cat_tpcn"
  create_beauty_product "omega-3-dha" "Omega-3 DHA EPA" 550000 25 "$cat_tpcn"
}

apply_brand_logo() {
  local logo="$ROOT/wp-content/themes/sos-beauty/assets/images/logo.jpg"
  if [ ! -f "$logo" ]; then
    log "Logo skip (no $logo)"
    return
  fi
  local logo_id
  logo_id=$($WP post list --post_type=attachment --name=logo --field=ID 2>/dev/null | head -1)
  if [ -z "$logo_id" ]; then
    logo_id=$($WP media import "$logo" --porcelain 2>/dev/null | head -1)
  fi
  if [ -n "$logo_id" ]; then
    $WP theme mod set custom_logo "$logo_id"
    $WP option update site_icon "$logo_id"
    log "Logo #$logo_id"
  fi
}

seed_from_folder_if_present() {
  local seed="" products_dir="${PRODUCTS_DIR:-}" cand d
  local here
  here="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || true)"

  for cand in \
    "${here:+$here/seed-products-from-folder.sh}" \
    "$HOME/seed-products-from-folder.sh" \
    "$ROOT/seed-products-from-folder.sh"
  do
    [ -n "$cand" ] && [ -f "$cand" ] && seed="$cand" && break
  done

  if [ -z "$products_dir" ]; then
    for d in "$HOME/products" "$ROOT/products" "$HOME/httpdocs/products"; do
      [ -d "$d" ] && products_dir="$d" && break
    done
  fi

  if [ -z "$seed" ] || [ -z "$products_dir" ]; then
    log "Skip folder seed (need seed-products-from-folder.sh + products/)"
    return 0
  fi

  log "Seed products from $products_dir ..."
  PRODUCTS_DIR="$products_dir" bash "$seed" || log "WARN: folder seed failed"
}

finalize() {
  $WP rewrite flush --hard 2>/dev/null || $WP rewrite flush
  $WP cache flush 2>/dev/null || true
  log "DONE → $URL"
  log "Theme: $($WP theme list --status=active --field=name | head -1)"
  log "Products: $($WP post list --post_type=product --format=count)"
}

main() {
  require_wp
  sync_urls
  install_plugins_and_theme
  configure_woocommerce
  create_pages
  create_menu
  create_demo_products
  seed_from_folder_if_present
  apply_brand_logo
  finalize
}

main "$@"
