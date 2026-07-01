#!/usr/bin/env bash
# Sync WordPress siteurl/home with WORDPRESS_URL from .env (local vs tunnel).
set -euo pipefail

URL="${WORDPRESS_URL:-http://localhost:8080}"
WP_FLAGS="--allow-root --skip-plugins --skip-themes"

echo "[wp-url] Setting siteurl + home → $URL"
docker compose --profile cli run --rm --entrypoint bash wpcli -c \
  "wp $WP_FLAGS option update siteurl '$URL' && wp $WP_FLAGS option update home '$URL'"

echo "[wp-url] Done. Restart wordpress if you changed docker-compose:"
echo "  docker compose up -d wordpress"
