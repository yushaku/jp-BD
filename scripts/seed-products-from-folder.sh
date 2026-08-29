#!/usr/bin/env bash
# Seed ~20 WooCommerce products from a products/ folder (name + images; fake price/meta).
#
# Local Docker:
#   docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/seed-products-from-folder.sh
#
# Mat Bao / Plesk (SSH, from httpdocs):
#   PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh
#   # or place folder at ~/httpdocs/products or ~/products
#
# Env:
#   PRODUCTS_DIR   path to product folders (default: auto)
#   WP_ADMIN_USER  WC --user= (default: first administrator)
#   PHP_BIN / WP_BIN  Plesk paths (same as setup-matbao.sh)
#
set -eu
# note: avoid pipefail — `wp | head` SIGPIPE breaks under pipefail

log() { echo "[seed] $*"; }

resolve_wp() {
  local PHP_BIN="${PHP_BIN:-/opt/plesk/php/8.2/bin/php}"
  local WP_BIN="${WP_BIN:-/usr/local/bin/wp}"

  if [ -n "${WP:-}" ]; then
    return
  fi

  # Docker wpcli image (wordpress:cli)
  if [ -f /var/www/html/wp-config.php ] && command -v wp >/dev/null 2>&1; then
    if wp --info 2>/dev/null | grep -qi allow-root || [ "$(id -u)" = "0" ] || [ "$(id -u)" = "33" ]; then
      WP="wp --allow-root"
    else
      WP="wp"
    fi
    return
  fi

  # Mat Bao / Plesk
  if [ -x "$PHP_BIN" ] && [ -f "$WP_BIN" ]; then
    WP="$PHP_BIN $WP_BIN"
  elif command -v wp >/dev/null 2>&1; then
    WP="wp"
  else
    echo "wp-cli not found. Set WP_BIN / PHP_BIN." >&2
    exit 1
  fi
}

resolve_root() {
  if [ -f ./wp-config.php ]; then
    ROOT="$(pwd)"
  elif [ -f /var/www/html/wp-config.php ]; then
    ROOT="/var/www/html"
    cd "$ROOT"
  elif [ -f "$HOME/httpdocs/wp-config.php" ]; then
    ROOT="$HOME/httpdocs"
    cd "$ROOT"
  else
    echo "Run from WordPress root (wp-config.php missing)." >&2
    exit 1
  fi
}

resolve_admin() {
  ADMIN="${WP_ADMIN_USER:-}"
  if [ -z "$ADMIN" ]; then
    ADMIN="$($WP user list --role=administrator --field=user_login 2>/dev/null | head -1 || true)"
  fi
  if [ -z "$ADMIN" ]; then
    ADMIN="admin"
  fi
}

resolve_products_dir() {
  if [ -n "${PRODUCTS_DIR:-}" ] && [ -d "$PRODUCTS_DIR" ]; then
    return
  fi
  local cand
  for cand in \
    "${PRODUCTS_DIR:-}" \
    "/products" \
    "$ROOT/products" \
    "$HOME/products" \
    "$HOME/httpdocs/products" \
    "$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/products"
  do
    if [ -n "$cand" ] && [ -d "$cand" ]; then
      PRODUCTS_DIR="$cand"
      return
    fi
  done
  echo "Missing products folder. Set PRODUCTS_DIR=/path/to/products" >&2
  exit 1
}

resolve_wp
resolve_root
resolve_admin
resolve_products_dir

log "root=$ROOT · products=$PRODUCTS_DIR · user=$ADMIN"

ensure_term() {
  local name="$1" slug="$2" parent_slug="${3:-}"
  local id parent=0
  id=$($WP term list product_cat --slug="$slug" --field=term_id 2>/dev/null | head -1 || true)
  if [ -n "$id" ]; then
    echo "$id"
    return
  fi
  if [ -n "$parent_slug" ]; then
    parent=$($WP term list product_cat --slug="$parent_slug" --field=term_id 2>/dev/null | head -1 || true)
    parent=${parent:-0}
  fi
  if [ -n "$parent" ] && [ "$parent" != "0" ]; then
    $WP term create product_cat "$name" --slug="$slug" --parent="$parent" --porcelain
  else
    $WP term create product_cat "$name" --slug="$slug" --porcelain
  fi
}

ensure_tree() {
  log "Category tree..."
  ensure_term 'Mỹ phẩm' 'my-pham-nhat' >/dev/null
  ensure_term 'Hàng tiêu dùng' 'hang-tieu-dung' >/dev/null
  ensure_term 'Thực phẩm' 'thuc-pham-nhat' >/dev/null
  ensure_term 'TPCN' 'tpcn' 'hang-tieu-dung' >/dev/null
  ensure_term 'Chăm sóc da' 'cham-soc-da' 'my-pham-nhat' >/dev/null
  ensure_term 'Serum' 'serum' 'cham-soc-da' >/dev/null
  ensure_term 'Kem dưỡng' 'kem-duong' 'cham-soc-da' >/dev/null
  ensure_term 'Mặt nạ' 'mat-na' 'cham-soc-da' >/dev/null
  ensure_term 'Rửa mặt' 'rua-mat' 'cham-soc-da' >/dev/null
  ensure_term 'Toner, nước hoa hồng' 'toner' 'cham-soc-da' >/dev/null
  ensure_term 'Chăm sóc tóc' 'cham-soc-toc' 'my-pham-nhat' >/dev/null
  ensure_term 'Dầu gội' 'dau-goi' 'cham-soc-toc' >/dev/null
  ensure_term 'Cơ thể' 'cham-soc-co-the' 'my-pham-nhat' >/dev/null
  ensure_term 'Sữa tắm' 'sua-tam' 'cham-soc-co-the' >/dev/null
  ensure_term 'Xà phòng' 'xa-phong' 'cham-soc-co-the' >/dev/null
  ensure_term 'Chăm sóc răng miệng' 'cham-soc-rang-mieng' 'cham-soc-co-the' >/dev/null
}

find_folder() {
  local needle="$1" d
  shopt -s nullglob
  for d in "$PRODUCTS_DIR"/*/; do
    local base
    base=$(basename "$d")
    if echo "$base" | grep -Eiq -- "$needle"; then
      local imgs=("$d"*.jpg "$d"*.JPG "$d"*.jpeg "$d"*.JPEG "$d"*.png "$d"*.PNG "$d"*.webp)
      if [ ${#imgs[@]} -gt 0 ] && [ -f "${imgs[0]}" ]; then
        echo "${d%/}"
        return 0
      fi
    fi
  done
  return 1
}

first_images() {
  local dir="$1" limit="${2:-3}"
  local -a files=()
  local f
  shopt -s nullglob
  for f in "$dir"/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp}; do
    [ -f "$f" ] && files+=("$f")
  done
  if [ ${#files[@]} -eq 0 ]; then
    return 1
  fi
  printf '%s\n' "${files[@]}" | LC_ALL=C sort | head -n "$limit"
}

slugify() {
  echo "$1" \
    | sed 'y/áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ/aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD/' \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g' \
    | cut -c1-80
}

title_exists() {
  local name="$1" t
  while IFS= read -r t; do
    [ "$t" = "$name" ] && return 0
  done < <($WP post list --post_type=product --fields=post_title --format=csv 2>/dev/null | tail -n +2 | sed 's/^"//;s/"$//')
  return 1
}

# Import ≤3 images from folder → featured + gallery. Echo count.
attach_folder_images() {
  local pid="$1" folder="$2" name="$3"
  local -a img_ids=()
  local img aid i=0
  while IFS= read -r img; do
    i=$((i + 1))
    aid=$($WP media import "$img" --title="${name} — ảnh ${i}" --porcelain 2>/dev/null || true)
    if [ -n "$aid" ]; then
      img_ids+=("$aid")
    fi
  done < <(first_images "$folder" 3 || true)

  if [ ${#img_ids[@]} -eq 0 ]; then
    echo 0
    return
  fi
  $WP post meta update "$pid" _thumbnail_id "${img_ids[0]}" >/dev/null 2>&1 || true
  if [ ${#img_ids[@]} -gt 1 ]; then
    local gallery
    gallery=$(IFS=,; echo "${img_ids[*]:1}")
    $WP post meta update "$pid" _product_image_gallery "$gallery" >/dev/null 2>&1 || true
  fi
  echo "${#img_ids[@]}"
}

create_one() {
  local needle="$1" name="$2" cat_slug="$3" brand="$4" price="$5" stock="$6" sale="${7:-}" slug_fixed="${8:-}"
  local folder slug existing cat_id pid short desc thumb nimg
  if [ -d "$needle" ]; then
    folder="${needle%/}"
  else
    folder=$(find_folder "$needle" || true)
  fi
  if [ -z "$folder" ]; then
    log "SKIP no folder: $needle"
    return
  fi

  if [ -n "$slug_fixed" ]; then
    slug="$slug_fixed"
  else
    slug=$(slugify "$name")
  fi
  [ -n "$slug" ] || slug="product-$(echo "$name" | md5sum | cut -c1-8)"

  existing=$($WP post list --post_type=product --name="$slug" --field=ID 2>/dev/null | head -1 || true)
  if [ -n "$existing" ]; then
    thumb=$($WP post meta get "$existing" _thumbnail_id 2>/dev/null || true)
    if [ -n "$thumb" ] && [ "$thumb" != "0" ]; then
      log "SKIP exists: $name (#$existing)"
      return
    fi
    nimg=$(attach_folder_images "$existing" "$folder" "$name")
    log "FILL #$existing $name imgs=$nimg"
    return
  fi
  if title_exists "$name"; then
    log "SKIP title exists: $name"
    return
  fi

  cat_id=$($WP term list product_cat --slug="$cat_slug" --field=term_id 2>/dev/null | head -1 || true)
  if [ -z "$cat_id" ]; then
    cat_id=$($WP term list product_cat --slug=my-pham-nhat --field=term_id 2>/dev/null | head -1 || true)
  fi

  short="${name} chính hãng Nhật Bản — nhập khẩu JPBuiDang. Thương hiệu ${brand}."
  desc="<p><strong>${name}</strong> của ${brand}, nguồn gốc Nhật Bản.</p><ul><li>Tem phụ tiếng Việt</li><li>Dùng hàng ngày</li><li>Bảo quản khô ráo, tránh nắng</li></ul><p><em>Demo — đối chiếu nhãn thật trước khi dùng.</em></p>"

  local args=(
    wc product create
    --name="$name"
    --slug="$slug"
    --type=simple
    --regular_price="$price"
    --manage_stock=1
    --stock_quantity="$stock"
    --sku="JP-${slug}"
    --short_description="$short"
    --description="$desc"
    --user="$ADMIN"
    --porcelain
  )
  if [ -n "$sale" ]; then
    args+=(--sale_price="$sale")
  fi
  if [ -n "$cat_id" ]; then
    args+=(--categories="[{\"id\":$cat_id}]")
  fi

  pid=$($WP "${args[@]}" 2>/dev/null || true)
  if [ -z "$pid" ]; then
    log "FAIL create: $name"
    return
  fi

  $WP post meta update "$pid" _sos_ingredients "Thành phần theo nhãn ${brand}. Xem chi tiết trên bao bì." >/dev/null 2>&1 || true
  $WP post meta update "$pid" _sos_how_to_use "Làm sạch vùng dùng, lấy lượng vừa đủ, thoa đều. 1–2 lần/ngày hoặc theo bao bì." >/dev/null 2>&1 || true
  $WP post meta update "$pid" _sos_brand "$brand" >/dev/null 2>&1 || true

  nimg=$(attach_folder_images "$pid" "$folder" "$name")
  log "OK #$pid $name ($cat_slug) imgs=$nimg"
}

guess_cat() {
  local n="$1"
  case "$n" in
    *[Ss]erum*|*[Ee]ssence*) echo 'serum' ;;
    *"ặt nạ"*) echo 'mat-na' ;;
    *SRM*|*[Ss]rm*|*"ửa mặt"*|*"ẩy trang"*) echo 'rua-mat' ;;
    *[Tt]oner*|*"ước hoa hồng"*) echo 'toner' ;;
    *[Gg]ội*|*[Ii]chikami*|*[Tt]subaki*|*salonlink*) echo 'dau-goi' ;;
    *"ánh răng"*|*"ơm miệng"*|*Ora2*) echo 'cham-soc-rang-mieng' ;;
    *"ữa tắm"*|*"ắm Hato"*) echo 'sua-tam' ;;
    *[Cc]ollagen*|*NMN*|*"ên uống"*|*"Trà "*|*"trà "*) echo 'tpcn' ;;
    *"ưỡng thể"*|*"ưỡng Da"*|*"em mắt"*|*"môi DHC"*|*"ống nắng"*) echo 'kem-duong' ;;
    *"ệ sinh"*|*"ửa bát"*|*"ước giặt"*|*"ỚC GIẶT"*|*"ộp Hút"*|*"ói sưởi"*|*"uổi Muỗi"*|*[Ff]umakilla*) echo 'hang-tieu-dung' ;;
    *"ượu"*|*"ánh gạo"*|*[Mm]iso*|*[Mm]atcha*) echo 'thuc-pham-nhat' ;;
    *) echo 'my-pham-nhat' ;;
  esac
}

guess_brand() {
  local n="$1"
  case "$n" in
    *[Hh]atomugi*) echo 'Hatomugi' ;;
    *[Ii]chikami*) echo 'Kracie' ;;
    *[Tt]subaki*) echo 'Shiseido' ;;
    *[Mm]eishoku*) echo 'Meishoku' ;;
    *Ora2*) echo 'Sunstar' ;;
    *[Kk]ao*) echo 'Kao' ;;
    *[Ll]aurie*) echo 'Laurier' ;;
    *[Ff]umakilla*) echo 'Fumakilla' ;;
    *[Mm]anis*) echo 'Manis' ;;
    *[Oo]rihiro*) echo 'Orihiro' ;;
    *[Ii]ris\ [Oo]hyama*) echo 'Iris Ohyama' ;;
    *[Hh]akugen*) echo 'Hakugen' ;;
    *[Ll]ingerie*|*LINGERIE*) echo 'Lingerie' ;;
    *[Ss]alonlink*) echo 'Salon Link' ;;
    *[Ww]hite\ and\ [Ww]hite*) echo 'Lion' ;;
    *) echo 'Japan' ;;
  esac
}

rand_price() {
  local base=$((RANDOM % 400 + 80))
  echo $((base * 1000))
}

seed_all_folders() {
  local d base cat brand price stock sale
  shopt -s nullglob
  for d in "$PRODUCTS_DIR"/*/; do
    base=$(basename "$d")
    # Skip folders with no direct images (category-only folders)
    local imgs=("$d"*.jpg "$d"*.JPG "$d"*.jpeg "$d"*.JPEG "$d"*.png "$d"*.PNG "$d"*.webp)
    if [ ${#imgs[@]} -eq 0 ]; then
      log "SKIP category folder (no images): $base"
      continue
    fi
    cat=$(guess_cat "$base")
    brand=$(guess_brand "$base")
    price=$(rand_price)
    stock=$((RANDOM % 60 + 20))
    sale=''
    if [ $((RANDOM % 4)) -eq 0 ]; then
      sale=$((price * 85 / 100))
    fi
    create_one "$d" "$base" "$cat" "$brand" "$price" "$stock" "$sale" ''
  done
}

main() {
  if ! $WP core is-installed >/dev/null 2>&1; then
    echo "WordPress not installed." >&2
    exit 1
  fi
  if ! $WP plugin is-active woocommerce >/dev/null 2>&1; then
    echo "WooCommerce not active — activate first (setup-matbao.sh)." >&2
    exit 1
  fi

  ensure_tree

  seed_all_folders

  local count
  count=$($WP post list --post_type=product --format=count 2>/dev/null || echo '?')
  $WP cache flush >/dev/null 2>&1 || true
  log "Done. Total products: $count"
}

main "$@"
