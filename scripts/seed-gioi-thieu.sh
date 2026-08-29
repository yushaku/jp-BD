#!/usr/bin/env bash
# Create / update WordPress page "Giới thiệu" (slug: gioi-thieu).
# Layout from page-gioi-thieu.php. Title / excerpt / content / featured image + metabox
# are editable in WP admin → Pages → Giới thiệu.
#
# Local Docker:
#   docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/seed-gioi-thieu.sh
#
# Mat Bao / Plesk (from httpdocs):
#   bash ~/seed-gioi-thieu.sh
#   # or: bash scripts/seed-gioi-thieu.sh
#
# Env:
#   WP_ADMIN_USER  (default: first administrator)
#   PHP_BIN / WP_BIN  Plesk paths (same as setup-matbao.sh)

set -eu

log() { echo "[gioi-thieu] $*" >&2; }

resolve_wp() {
  local PHP_BIN="${PHP_BIN:-/opt/plesk/php/8.2/bin/php}"
  local WP_BIN="${WP_BIN:-/usr/local/bin/wp}"

  if [ -n "${WP:-}" ]; then
    return
  fi

  if [ -f /var/www/html/wp-config.php ] && command -v wp >/dev/null 2>&1; then
    if wp --info 2>/dev/null | grep -qi allow-root || [ "$(id -u)" = "0" ] || [ "$(id -u)" = "33" ]; then
      WP="wp --allow-root"
    else
      WP="wp"
    fi
    return
  fi

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

# SEO body (Yoast / search). Visible layout comes from page-gioi-thieu.php.
ABOUT_EXCERPT='Công ty TNHH JP Bùi Đặng — hơn 15 năm nhập khẩu và phân phối mỹ phẩm, TPCN và thực phẩm chính hãng Nhật Bản tại Việt Nam.'

ABOUT_CONTENT='Công ty TNHH JP Bùi Đặng là doanh nghiệp chuyên nhập khẩu và phân phối các sản phẩm chính hãng từ Nhật Bản tại thị trường Việt Nam. Với hơn 15 năm kinh nghiệm trong ngành nhập khẩu và phân phối, đồng hành cùng các thương hiệu Nhật Bản trong các lĩnh vực mỹ phẩm, chăm sóc sức khỏe, làm đẹp và hàng tiêu dùng.

Cam kết mang đến sản phẩm chính hãng, chất lượng cao — kết nối người tiêu dùng Việt Nam với tinh hoa tiêu dùng từ Nhật Bản.

Địa chỉ: Tầng 1, CT2, Mễ Trì Thượng, Nam Từ Liêm, Hà Nội
Điện thoại: 098 5561862 — 0965180859
Email: jpbuidangco.ltd@gmail.com'

ensure_page() {
  local id
  id=$($WP post list --post_type=page --name=gioi-thieu --field=ID 2>/dev/null | head -1 || true)
  if [ -z "$id" ]; then
    id=$($WP post create \
      --post_type=page \
      --post_title='Giới thiệu' \
      --post_name=gioi-thieu \
      --post_status=publish \
      --post_excerpt="$ABOUT_EXCERPT" \
      --post_content="$ABOUT_CONTENT" \
      --porcelain)
    log "Created page Giới thiệu (#$id)"
  else
    $WP post update "$id" \
      --post_title='Giới thiệu' \
      --post_status=publish \
      --post_excerpt="$ABOUT_EXCERPT" \
      --post_content="$ABOUT_CONTENT" >/dev/null
    log "Updated page Giới thiệu (#$id)"
  fi
  echo "$id"
}

ensure_menu_item() {
  local page_id="$1"
  local menu_id
  menu_id=$($WP menu list --format=csv 2>/dev/null | awk -F, 'NR>1 && $2 ~ /Main Menu/ {gsub(/"/,"",$1); print $1; exit}')
  if [ -z "$menu_id" ]; then
    menu_id=$($WP menu list --fields=term_id --format=csv 2>/dev/null | awk -F, 'NR==2 {gsub(/"/,""); print $1; exit}')
  fi
  if [ -z "$menu_id" ]; then
    log "No menu found — skip menu item."
    return
  fi

  if $WP menu item list "$menu_id" --fields=object_id,title --format=csv 2>/dev/null | awk -F, -v id="$page_id" 'NR>1 {gsub(/"/,""); if ($1==id) found=1} END {exit found?0:1}'; then
    log "Menu already has Giới thiệu"
    return
  fi

  $WP menu item add-post "$menu_id" "$page_id" --title='Giới thiệu' >/dev/null
  log "Added Giới thiệu to menu #$menu_id"
}

main() {
  resolve_wp
  resolve_root

  if ! $WP core is-installed >/dev/null 2>&1; then
    echo "WordPress not installed." >&2
    exit 1
  fi

  local page_id url
  page_id=$(ensure_page)
  ensure_menu_item "$page_id"
  url=$($WP post get "$page_id" --field=url 2>/dev/null || echo "")
  log "OK → ${url:-/gioi-thieu/}"
}

main "$@"
