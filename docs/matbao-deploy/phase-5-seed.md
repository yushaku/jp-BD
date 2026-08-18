# Phase 5 — Seed products

> **Nơi thực hiện:** Hosting SSH
> **Thời gian:** ~10–15 phút (43 products × 1–3 ảnh)
> **Bắt buộc:** ✅

---

> ℹ️ Nếu Phase 4 đã tự động seed (script `setup-matbao.sh` gọi `seed_from_folder_if_present`),
> phase này chỉ để **verify** hoặc **seed lại** khi cần.

---

## 5.1 Kiểm tra trước khi seed

```bash
ssh $MB_USER@$MB_HOST
cd ~/httpdocs

# WooCommerce active?
wp plugin is-active woocommerce && echo "Woo OK"

# Products folder có?
ls ~/products/ | wc -l   # → 43
du -sh ~/products/       # → ~52M

# Products hiện tại
wp post list --post_type=product --format=count
```

---

## 5.2 Chạy seed script

```bash
cd ~/httpdocs
PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh
```

### Script làm gì

| Bước | Nội dung |
|------|----------|
| `ensure_tree` | Đảm bảo cây danh mục tồn tại |
| `seed_all_folders` | Scan mọi folder trong `products/` |
| `guess_cat` | Đoán danh mục từ tên folder (Serum → `serum`, Ora2 → `cham-soc-rang-mieng`, ...) |
| `guess_brand` | Đoán brand (Hatomugi, Kracie, Sunstar, Kao, Laurier, Fumakilla, ...) |
| `rand_price` | Giá random 80.000–480.000 ₫, 25% có giá sale (-15%) |
| `create_one` | Tạo product + import ≤3 ảnh (ảnh đầu = thumbnail, còn lại = gallery) |

**Output mong đợi:**
```
[seed] root=/home/<user>/httpdocs · products=/home/<user>/products · user=jpadmin
[seed] Category tree...
[seed] OK #464 Băng vệ sinh Laurie Nhật ( Ban ngày có cánh) (hang-tieu-dung) imgs=1
[seed] OK #472 Bộ Gội Xả Ichikami (dau-goi) imgs=3
[seed] OK #530 Serum cam (serum) imgs=3
[seed] OK #564 Xịt thơm miệng Ora2 Bạc hà mát lạnh (cham-soc-rang-mieng) imgs=2
[seed] SKIP category folder (no images): NHÀ CỬA, ĐỜI SỐNG
...
[seed] Done. Total products: 43
```

**Đặc điểm script:**
- ✅ **Idempotent** — chạy lại bỏ qua slug/title đã có
- ✅ Skip folder không có ảnh trực tiếp (folder danh mục)
- ✅ SKU = `JP-<full-slug>` (không collision)

---

## 5.3 Verify

### Đếm products

```bash
wp post list --post_type=product --format=count
# → 43
```

### List products + danh mục

```bash
wp post list --post_type=product --fields=ID,post_title --format=table | head -50
```

### Kiểm tra ảnh

```bash
# Products có thumbnail
wp post list --post_type=product --format=ids | while read id; do
  thumb=$(wp post meta get $id _thumbnail_id 2>/dev/null)
  [ -z "$thumb" ] && echo "NO IMAGE: #$id $(wp post get $id --field=post_title)"
done
# → không output = tất cả đều có ảnh
```

### Kiểm tra giá

```bash
wp post list --post_type=product --format=ids | head -5 | while read id; do
  echo "#$id: $(wp post meta get $id _regular_price) / sale: $(wp post meta get $id _sale_price 2>/dev/null)"
done
```

### Kiểm tra phân loại

```bash
wp term list product_cat --fields=name,slug,count --format=table
```

Mong đợi:
| Danh mục | Số lượng |
|----------|----------|
| Chăm sóc răng miệng | ~8 |
| Serum | ~4 |
| Dầu gội | ~2 |
| TPCN | ~2 |
| Rửa mặt | ~2 |
| Kem dưỡng | ~1 |
| Hàng tiêu dùng | ~1 |
| Mỹ phẩm (khác) | ~23 |

---

## 5.4 Regenerate thumbnails (nếu ảnh hiển thị sai size)

```bash
wp plugin install regenerate-thumbnails --activate
wp media regenerate --yes
wp plugin deactivate regenerate-thumbnails
```

---

## 5.5 Seed lại từ đầu (nếu cần)

```bash
cd ~/httpdocs

# Backup trước
wp db export ~/backup-pre-reseed-$(date +%Y%m%d-%H%M).sql

# Xóa hết products
wp post list --post_type=product --format=ids | xargs -r wp post delete --force

# Xóa media orphan (optional, cẩn thận)
# wp post list --post_type=attachment --format=ids | xargs -r wp post delete --force

# Seed lại
PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh
```

---

## 5.6 Sửa danh mục thủ công (nếu `guess_cat` đoán sai)

```bash
# Ví dụ: chuyển "Băng vệ sinh Laurie" sang hàng tiêu dùng
PID=$(wp post list --post_type=product --name=bang-ve-sinh-laurie-nhat-ban-ngay-co-canh --field=ID)
CAT=$(wp term list product_cat --slug=hang-tieu-dung --field=term_id)
wp post term set $PID product_cat $CAT
```

Hoặc sửa `guess_cat()` trong script rồi seed lại.

---

## ✅ Checklist Phase 5

- [ ] ≥40 products tồn tại
- [ ] Tất cả products có thumbnail
- [ ] Giá VND hợp lý (80k–480k)
- [ ] Một số có giá sale
- [ ] Categories phân bổ hợp lý
- [ ] Không có product trùng lặp
- [ ] Shop page `https://jpbuidang.vn/shop` hiện đủ products

**→ Tiếp:** [Phase 6 — SSL + Verify](./phase-6-verify.md)
