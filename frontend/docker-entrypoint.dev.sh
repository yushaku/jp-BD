#!/bin/sh
set -e

cd /app

# Seed node_modules volume from image on first run (bind mount hides image layers).
if [ ! -d node_modules/next ] && [ -d /opt/node_modules ]; then
  echo "[dev] Seeding node_modules from image..."
  mkdir -p node_modules
  cp -a /opt/node_modules/. node_modules/
fi

# Install only when lockfile changed or deps missing.
if [ ! -d node_modules/next ] || [ package.json -nt node_modules/.deps-stamp ] || [ pnpm-lock.yaml -nt node_modules/.deps-stamp ]; then
  echo "[dev] Installing dependencies..."
  pnpm install --frozen-lockfile --ignore-scripts
  touch node_modules/.deps-stamp
fi

echo "[dev] Starting Next.js on 0.0.0.0:3000..."
exec pnpm exec next dev --hostname 0.0.0.0 --port 3000
