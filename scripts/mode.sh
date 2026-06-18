#!/usr/bin/env bash
# Switch between local dev and Cloudflare tunnel without hand-editing .env / WP URLs.
#
# Usage:
#   ./scripts/mode.sh local    # http://localhost via nginx :80
#   ./scripts/mode.sh ports    # http://localhost:3000 + :8080 (no nginx)
#   ./scripts/mode.sh tunnel   # https://$TUNNEL_HOSTNAME via nginx + cloudflared
#   ./scripts/mode.sh status
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"
MODE_FILE="$ROOT/.env.mode"

log() { echo "[mode] $*"; }

ensure_env() {
  if [ ! -f "$ENV_FILE" ]; then
    cp "$ROOT/.env.example" "$ENV_FILE"
    log "Created $ENV_FILE from .env.example"
  fi
}

read_env_var() {
  grep -E "^${1}=" "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- || true
}

load_env() {
  TUNNEL_HOSTNAME="$(read_env_var TUNNEL_HOSTNAME)"
  NEXT_PUBLIC_SITE_URL="$(read_env_var NEXT_PUBLIC_SITE_URL)"
  NEXT_PUBLIC_WP_URL="$(read_env_var NEXT_PUBLIC_WP_URL)"
  WORDPRESS_URL="$(read_env_var WORDPRESS_URL)"
  SOS_MODE="$(read_env_var SOS_MODE)"
  NGINX_HTTP_PORT="$(read_env_var NGINX_HTTP_PORT)"
}

set_env_var() {
  local key="$1" val="$2"
  local tmp
  tmp="$(mktemp)"
  if [ -f "$ENV_FILE" ] && grep -q "^${key}=" "$ENV_FILE"; then
    sed "s|^${key}=.*|${key}=${val}|" "$ENV_FILE" >"$tmp"
  else
    [ -f "$ENV_FILE" ] && cp "$ENV_FILE" "$tmp" || : >"$tmp"
    echo "${key}=${val}" >>"$tmp"
  fi
  mv "$tmp" "$ENV_FILE"
}

sync_wp_urls() {
  local url="$1"
  log "WordPress home/siteurl → $url"
  docker compose --profile cli run --rm --entrypoint wp wpcli \
    option update home "$url" >/dev/null
  docker compose --profile cli run --rm --entrypoint wp wpcli \
    option update siteurl "$url" >/dev/null
}

restart_stack() {
  local profile="${1:-}"
  log "Restarting containers…"
  if [ "$profile" = "nginx" ]; then
    docker compose --profile nginx up -d nextjs wordpress nginx
  else
    docker compose up -d nextjs wordpress
    if docker compose ps nginx 2>/dev/null | grep -q '(running)'; then
      docker compose stop nginx >/dev/null 2>&1 || true
    fi
  fi
}

usage() {
  cat <<'EOF'
Usage: ./scripts/mode.sh <local|ports|tunnel|status>

  local   — http://localhost (nginx :80)
            Storefront + wp-admin on one origin.

  ports   — http://localhost:3000 (Next.js) + http://localhost:8080 (WordPress)
            No nginx. Fastest for frontend-only dev.

  tunnel  — https://<TUNNEL_HOSTNAME> (nginx :80 + cloudflared)
            Set TUNNEL_HOSTNAME in .env (default: shop.yuchi-education.com).
            After switching: cloudflared tunnel run <your-tunnel>

  status  — show active mode and public URLs
EOF
}

cmd_local() {
  local url="http://localhost"
  set_env_var WORDPRESS_URL "$url"
  set_env_var NEXT_PUBLIC_SITE_URL "$url"
  set_env_var NEXT_PUBLIC_WP_URL "$url"
  set_env_var SOS_MODE "local"
  echo "local" >"$MODE_FILE"
  sync_wp_urls "$url"
  restart_stack nginx
  log "Ready — storefront: $url  |  admin: $url/wp-admin"
}

cmd_ports() {
  local wp_url="http://localhost:8080"
  set_env_var WORDPRESS_URL "$wp_url"
  set_env_var NEXT_PUBLIC_SITE_URL "http://localhost:3000"
  set_env_var NEXT_PUBLIC_WP_URL "$wp_url"
  set_env_var SOS_MODE "ports"
  echo "ports" >"$MODE_FILE"
  sync_wp_urls "$wp_url"
  restart_stack ""
  log "Ready — storefront: http://localhost:3000  |  admin: $wp_url/wp-admin"
}

cmd_tunnel() {
  load_env
  local host="${TUNNEL_HOSTNAME:-shop.yuchi-education.com}"
  local url="https://${host}"
  set_env_var TUNNEL_HOSTNAME "$host"
  set_env_var WORDPRESS_URL "$url"
  set_env_var NEXT_PUBLIC_SITE_URL "$url"
  set_env_var NEXT_PUBLIC_WP_URL "$url"
  set_env_var SOS_MODE "tunnel"
  echo "tunnel" >"$MODE_FILE"
  sync_wp_urls "$url"
  restart_stack nginx
  log "Ready — storefront: $url  |  admin: $url/wp-admin"
  log "Start tunnel: cloudflared tunnel run yuchi-local"
}

cmd_status() {
  ensure_env
  load_env
  local mode="${SOS_MODE:-unknown}"
  [ -f "$MODE_FILE" ] && mode="$(cat "$MODE_FILE")"
  echo "Mode:              $mode"
  echo "Storefront:        ${NEXT_PUBLIC_SITE_URL:-—}"
  echo "WordPress public:  ${NEXT_PUBLIC_WP_URL:-—}"
  echo "WORDPRESS_URL:     ${WORDPRESS_URL:-—}"
  echo "Tunnel hostname:   ${TUNNEL_HOSTNAME:-—}"
  if docker compose ps nginx 2>/dev/null | grep -q '(running)'; then
    echo "nginx:             running (:${NGINX_HTTP_PORT:-80})"
  else
    echo "nginx:             stopped"
  fi
}

main() {
  cd "$ROOT"
  ensure_env

  case "${1:-}" in
    local)  cmd_local ;;
    ports)  cmd_ports ;;
    tunnel) cmd_tunnel ;;
    status) cmd_status ;;
    -h|--help|help|"") usage ;;
    *)
      echo "Unknown mode: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
}

main "$@"
