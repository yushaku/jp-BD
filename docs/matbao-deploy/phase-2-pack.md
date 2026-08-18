# Phase 2 — Pack bundle trên Mac

> **Nơi thực hiện:** Mac (local)
> **Thời gian:** ~5 phút
> **Bắt buộc:** ✅

---

## 2.1 Kiểm tra trước khi pack

```bash
cd ~/work/jp-hadang

# Git status sạch?
git status --short

# Theme có đủ file?
ls wp-content/themes/sos-beauty/
# → style.css, functions.php, front-page.php, single.php, page-*.php,
#   template-parts/, woocommerce/, assets/

# Products có ảnh?
ls products/ | wc -l
# → 44 folders

# Scripts executable?
ls -la scripts/*.sh
```

**Verify syntax scripts:**
```bash
bash -n scripts/setup-matbao.sh && echo "setup OK"
bash -n scripts/seed-products-from-folder.sh && echo "seed OK"
bash -n scripts/pack-matbao.sh && echo "pack OK"
```

---

## 2.2 Pack bundle

### Full (theme + scripts + ảnh slim)

```bash
cd ~/work/jp-hadang
bash scripts/pack-matbao.sh
```

Output:
```
[pack] Copy sos-beauty...
[pack] Pack slim products (≤3 imgs / folder)...
  + Băng vệ sinh Laurie Nhật ( Ban ngày có cánh) (1 imgs)
  + Bộ Gội Xả Ichikami (3 imgs)
  ...
packed 43 folders
[pack] products size: 52M
[pack] Created dist/matbao-seed.zip (55M)
```

### Chỉ theme + scripts (không ảnh)

```bash
SKIP_PRODUCTS=1 bash scripts/pack-matbao.sh
# → dist/matbao-seed.zip (~500KB)
```

**Verify:**
```bash
ls -lh dist/matbao-seed.zip
unzip -l dist/matbao-seed.zip | head -20
```

---

## 2.3 Nội dung bundle

```
matbao-seed/
├── RUN.txt                          ← hướng dẫn ngắn
├── setup-matbao.sh                  ← setup site
├── seed-products-from-folder.sh     ← seed products
├── vnpay-woocommerce.zip            ← (nếu có)
├── wp-content/
│   └── themes/
│       └── sos-beauty/              ← theme đầy đủ
└── products/                        ← 43 folders, ≤3 ảnh/folder
    ├── Serum cam/
    ├── Bộ Gội Xả Ichikami/
    └── ...
```

---

## 2.4 (Optional) Export DB local để so sánh

```bash
# Dump DB local qua Docker
cd ~/work/jp-hadang
docker compose --profile cli run --rm --entrypoint bash wpcli \
  -c "wp db export /tmp/local.sql --allow-root" 

docker compose cp wpcli:/tmp/local.sql ./dist/local-reference.sql 2>/dev/null || \
  docker cp $(docker compose ps -q wordpress):/tmp/local.sql ./dist/local-reference.sql
```

> ⚠️ **Không** import DB local lên production — URL, prefix, user khác nhau.
> Dùng scripts để tạo lại data trên hosting.

---

## ✅ Checklist Phase 2

- [ ] `bash -n` pass cho cả 3 scripts
- [ ] `dist/matbao-seed.zip` đã tạo
- [ ] Size hợp lý (~55MB với ảnh, ~500KB không ảnh)
- [ ] Unzip thử, thấy đủ theme + scripts + products

**→ Tiếp:** [Phase 3 — Upload](./phase-3-upload.md)
