# Phase 6 — SSL + Verify

> **Nơi thực hiện:** Plesk UI + Browser + SSH
> **Thời gian:** ~15 phút
> **Bắt buộc:** ✅

---

## 6.1 Cài SSL (Let's Encrypt)

- [ ] Plesk → `jpbuidang.vn` → **SSL/TLS Certificates**
- [ ] Click **Get it free** (Let's Encrypt)
- [ ] Tick:
  - [x] Secure the domain name
  - [x] Include `www.jpbuidang.vn`
  - [x] Assign the certificate to mail domain (optional)
- [ ] Email: `________________`
- [ ] Click **Get it free**

**Verify:**

```bash
curl -I https://jpbuidang.vn
# → HTTP/2 200 (không lỗi cert)

openssl s_client -connect jpbuidang.vn:443 -servername jpbuidang.vn < /dev/null 2>/dev/null | grep -E "subject=|issuer="
```

---

## 6.2 Force HTTPS

### Cách A — Plesk

- [ ] Plesk → `jpbuidang.vn` → **Hosting Settings**
- [ ] Tick **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
- [ ] Apply

### Cách B — wp-config + .htaccess

```bash
cd ~/httpdocs

# WP force SSL admin
wp config set FORCE_SSL_ADMIN true --raw

# Update URLs
wp option update siteurl 'https://jpbuidang.vn'
wp option update home 'https://jpbuidang.vn'

# Search-replace URL cũ trong content
wp search-replace 'http://jpbuidang.vn' 'https://jpbuidang.vn' --all-tables --precise
```

**Verify:**

```bash
curl -sI http://jpbuidang.vn | grep -i location
# → Location: https://jpbuidang.vn/
```

---

## 6.3 Verify frontend (browser)

### Desktop

| Trang          | URL                             | Check                                                                 |
| -------------- | ------------------------------- | --------------------------------------------------------------------- |
| Trang chủ      | `https://jpbuidang.vn`          | Hero + promo sections + products                                      |
| Shop           | `/shop`                         | Grid products có ảnh + giá VND                                        |
| Product detail | `/product/serum-cam`            | Layout PDP mới: ảnh gallery, giá, nút thêm giỏ, trust badges, related |
| Danh mục       | `/product-category/serum`       | Filter đúng                                                           |
| Blog           | `/blog` hoặc `/?post_type=post` | List posts                                                            |
| Blog detail    | `/<slug-bai-viet>`              | Featured image lớn, typography, author bio, related posts             |
| Giới thiệu     | `/gioi-thieu`                   | Content page                                                          |
| Liên hệ        | `/lien-he`                      | Form + info                                                           |
| Cart           | `/cart`                         | Empty state OK                                                        |
| Checkout       | `/checkout`                     | Form VND, COD + Bank transfer                                         |

### Mobile (DevTools responsive hoặc điện thoại thật)

- [ ] 375px (iPhone SE) — menu hamburger, product grid 1–2 cột
- [ ] 768px (iPad) — grid 2–3 cột
- [ ] Product detail — ảnh full width, sticky add-to-cart

### Test flow mua hàng

- [ ] Thêm 1 product vào giỏ
- [ ] Vào `/cart` → thấy đúng SP + giá
- [ ] Vào `/checkout` → điền form → chọn COD
- [ ] Đặt hàng test → nhận order
- [ ] Admin → WooCommerce → Orders → thấy order

---

## 6.4 Verify technical

```bash
cd ~/httpdocs

# WP health
wp core verify-checksums
wp plugin list --status=active
wp theme list --status=active

# Không có PHP error
tail -50 ~/logs/error_log 2>/dev/null || tail -50 /var/www/vhosts/jpbuidang.vn/logs/error_log

# DB size
wp db size --human-readable

# Rewrite rules OK
wp rewrite list --format=count
```

### Kiểm tra tốc độ

```bash
# TTFB
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://jpbuidang.vn

# Nếu chậm (>2s) → xem Phase 7 (caching)
```

### SEO cơ bản

```bash
# Sitemap
curl -s https://jpbuidang.vn/wp-sitemap.xml | head -20

# robots.txt
curl -s https://jpbuidang.vn/robots.txt

# Không noindex
curl -s https://jpbuidang.vn | grep -i "noindex" && echo "⚠️ CÓ NOINDEX" || echo "OK không noindex"
```

- [ ] Plesk/WP → Settings → Reading → **bỏ tick** "Discourage search engines"

```bash
wp option update blog_public 1
```

---

## 6.5 Dọn dẹp

```bash
# Xóa file tạm
rm -f ~/matbao-seed.zip
rm -rf ~/matbao-seed

# Xóa scripts (optional — giữ lại nếu cần seed thêm)
# rm -f ~/setup-matbao.sh ~/seed-products-from-folder.sh

# Products folder — giữ lại nếu cần seed thêm, hoặc xóa để tiết kiệm disk
# rm -rf ~/products

# Check disk
df -h ~
du -sh ~/httpdocs
```

---

## ✅ Checklist Phase 6 (Definition of Done)

### Kỹ thuật

- [ ] HTTPS xanh, không mixed content warning
- [ ] HTTP → HTTPS redirect 301
- [ ] `wp core verify-checksums` pass
- [ ] Không PHP fatal error trong log
- [ ] Sitemap accessible
- [ ] `blog_public = 1` (cho phép index)

### Nội dung

- [ ] Trang chủ load đủ sections
- [ ] Shop hiện ≥40 products có ảnh
- [ ] Product detail UI mới hoạt động
- [ ] Blog detail UI mới hoạt động
- [ ] Menu chính đủ links
- [ ] Pages Giới thiệu / Liên hệ có content

### E-commerce

- [ ] Giá hiển thị `1.000 ₫` (VND, 0 decimal)
- [ ] Add to cart hoạt động
- [ ] Checkout form OK
- [ ] COD + Bank transfer available
- [ ] Test order thành công

### Responsive

- [ ] Mobile 375px OK
- [ ] Tablet 768px OK
- [ ] Desktop 1440px OK

**→ Tiếp:** [Phase 7 — Backup](./phase-7-backup.md)
