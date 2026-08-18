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
import unicodedata
from pathlib import Path

src, dest = Path(sys.argv[1]), Path(sys.argv[2])
needles = [
    "pure beau", "serum kracie", "170g", "130g", "srm trà xanh", "srm tra xanh",
    "posh kosh", "keana", "white serum", "meishoku", "sunbears", "skin aqua",
    "tsubaki", "manis", "600ml", "white and white", "ora2", "nmn", "13000",
    "genpi", "dhc",
]

def fold(s: str) -> str:
    s = unicodedata.normalize("NFKC", s)
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return s.casefold()

exts = {".jpg", ".jpeg", ".png", ".webp"}
copied = 0
for d in sorted(src.iterdir()):
    if not d.is_dir():
        continue
    name = fold(d.name)
    if not any(n in name for n in needles):
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

1. Plesk Files → upload matbao-seed.zip vào home (vd. ~/ )

2. SSH Terminal:

   source ~/.bashrc
   cd ~
   unzip -o matbao-seed.zip -d matbao-seed

   # theme
   rsync -a matbao-seed/wp-content/themes/sos-beauty/ ~/httpdocs/wp-content/themes/sos-beauty/

   # scripts
   cp matbao-seed/setup-matbao.sh ~/
   cp matbao-seed/seed-products-from-folder.sh ~/
   chmod +x ~/setup-matbao.sh ~/seed-products-from-folder.sh

   # ảnh sản phẩm (nếu có trong zip)
   mkdir -p ~/products
   rsync -a matbao-seed/products/ ~/products/ 2>/dev/null || true

3. Setup site (theme + Woo + menu + categories):

   cd ~/httpdocs
   bash ~/setup-matbao.sh

4. Seed ~20 SP từ folder ảnh (idempotent — chạy lại an toàn):

   cd ~/httpdocs
   PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh

   # hoặc đặt products vào ~/httpdocs/products rồi:
   # bash ~/seed-products-from-folder.sh

5. Mở https://jpbuidang.vn — shop có sản phẩm + ảnh.

Ghi chú:
- Cần WooCommerce active (setup-matbao.sh làm giúp).
- Re-run seed = bỏ qua slug/title đã có.
- Full folder products/ (~700MB) không bắt buộc; zip chỉ kèm bản slim (~các SP seed).
EOF

cd "$OUT"
rm -f matbao-seed.zip
zip -r -q matbao-seed.zip matbao-seed
log "Created $ZIP ($(du -h "$ZIP" | awk '{print $1}'))"
log "Upload $ZIP → Plesk, follow matbao-seed/RUN.txt"
