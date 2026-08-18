#!/usr/bin/env bash
# Build upload bundle for Mat Bao: theme + setup + product seed script + slim products/
# Run on Mac from repo root:
#   bash scripts/pack-matbao.sh
# → dist/matbao-seed.zip
#
# Optional: SKIP_PRODUCTS=1 bash scripts/pack-matbao.sh  (theme+scripts only)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist"
STAGE="$OUT/matbao-seed"
ZIP="$OUT/matbao-seed.zip"
SKIP_PRODUCTS="${SKIP_PRODUCTS:-0}"

rm -rf "$STAGE" "$ZIP"
mkdir -p "$STAGE/wp-content/themes"

log() { echo "[pack] $*"; }

log "Copy sos-beauty..."
rsync -a --delete \
  --exclude '.DS_Store' \
  --exclude '.git' \
  "$ROOT/wp-content/themes/sos-beauty/" \
  "$STAGE/wp-content/themes/sos-beauty/"

cp "$ROOT/scripts/setup-matbao.sh" "$STAGE/setup-matbao.sh"
cp "$ROOT/scripts/seed-products-from-folder.sh" "$STAGE/seed-products-from-folder.sh"
chmod +x "$STAGE/setup-matbao.sh" "$STAGE/seed-products-from-folder.sh"

# Optional VNPay if present
if [ -f "$ROOT/scripts/plugins/vnpay-woocommerce.zip" ]; then
  cp "$ROOT/scripts/plugins/vnpay-woocommerce.zip" "$STAGE/"
  log "Included vnpay-woocommerce.zip"
fi

# Slim products: only folders used by seed script, max 3 images each
pack_products() {
  local src="$ROOT/products" dest="$STAGE/products"
  [ -d "$src" ] || { log "No products/ — skip"; return; }

  mkdir -p "$dest"
  python3 - "$src" "$dest" <<'PY'
import shutil
import sys
from pathlib import Path

src, dest = Path(sys.argv[1]), Path(sys.argv[2])

exts = {".jpg", ".jpeg", ".png", ".webp"}
copied = 0
for d in sorted(src.iterdir()):
    if not d.is_dir():
        continue
    imgs = sorted(
        [p for p in d.iterdir() if p.is_file() and p.suffix.lower() in exts],
        key=lambda p: p.name.lower(),
    )[:3]
    if not imgs:
        continue
    out = dest / d.name
    out.mkdir(parents=True, exist_ok=True)
    for img in imgs:
        shutil.copy2(img, out / img.name)
    copied += 1
    print(f"  + {d.name} ({len(imgs)} imgs)")
print(f"packed {copied} folders")
PY
}

if [ "$SKIP_PRODUCTS" != "1" ]; then
  log "Pack slim products (≤3 imgs / folder)..."
  pack_products
  log "products size: $(du -sh "$STAGE/products" 2>/dev/null | awk '{print $1}')"
fi

cat > "$STAGE/RUN.txt" << 'EOF'
Mat Bao seed — CLI only
=======================

Plan chi tiết: docs/matbao-deploy-plan.md

1. Plesk Files → upload matbao-seed.zip vào home (vd. ~/ )
   Hoặc: scp dist/matbao-seed.zip <user>@s88d44.cloudnetwork.vn:~/

2. SSH Terminal:

   source ~/.bashrc
   cd ~
   unzip -o matbao-seed.zip -d .

   # theme
   mkdir -p ~/httpdocs/wp-content/themes/sos-beauty
   rsync -a matbao-seed/wp-content/themes/sos-beauty/ ~/httpdocs/wp-content/themes/sos-beauty/

   # scripts
   cp matbao-seed/setup-matbao.sh ~/
   cp matbao-seed/seed-products-from-folder.sh ~/
   chmod +x ~/setup-matbao.sh ~/seed-products-from-folder.sh

   # ảnh sản phẩm
   mkdir -p ~/products
   rsync -a matbao-seed/products/ ~/products/

3. Backup trước khi setup:

   cd ~/httpdocs
   wp db export ~/backup-pre-setup-$(date +%Y%m%d-%H%M).sql

4. Setup site (theme + Woo + menu + categories + seed):

   cd ~/httpdocs
   bash ~/setup-matbao.sh

5. (Nếu cần) Seed lại products riêng:

   cd ~/httpdocs
   PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh

6. Verify:

   wp theme list --status=active     # → sos-beauty
   wp post list --post_type=product --format=count   # → 43
   wp option get woocommerce_currency                 # → VND

7. Mở https://jpbuidang.vn — shop có 43 sản phẩm + ảnh.

Ghi chú:
- Cần PHP 8.2 (Plesk → PHP Settings).
- Cần WooCommerce active (setup-matbao.sh làm giúp).
- Scripts idempotent: chạy lại bỏ qua slug/title đã có.
- seed script tự scan mọi folder trong products/ (auto category + brand + giá).
- Zip chỉ kèm ≤3 ảnh/SP (~60MB). Full products/ ~700MB không cần upload.
EOF

cd "$OUT"
rm -f matbao-seed.zip
zip -r -q matbao-seed.zip matbao-seed
log "Created $ZIP ($(du -h "$ZIP" | awk '{print $1}'))"
log "Upload $ZIP → Plesk, follow matbao-seed/RUN.txt"
