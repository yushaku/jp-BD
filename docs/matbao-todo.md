# Hosting Express — TODO

Thông tin: [matbao-hosting.md](./matbao-hosting.md)

**Setup đúng (chuỗi):**

```
id.matbao → gói hosting → Bảng điều khiển (Plesk)
         → domain gắn gói đó
         → DNS A = IP trong Hosting Settings
         → rồi mới Install WordPress
```

**Setup đang sai:**

| Domain | Sai chỗ |
|--------|---------|
| `jpbuidang.vn` | A → `103.110.128.71` (parking/DNS redirect). Panel `s88d44` = `103.138.88.44`. Domain ≠ máy hosting. |
| `hangnhatchomoinha.vn` | File WP có, nhưng LiteSpeed vhost không serve `httpdocs` (lỗi phía host). |

---

## 🎯 Setup `jpbuidang.vn` (làm theo thứ tự)

### 0. Khoanh trước khi cài WP (**bắt buộc**)

**DNS hiện tại (check Mac 2026-08-16):**

| Nguồn | IP / kết quả |
|-------|----------------|
| DNS `jpbuidang.vn` | **`103.138.88.44`** ✅ (đã sửa A `@` + `www`) |
| Plesk IP | **`103.138.88.44`** |
| Panel `s88d44` | `103.138.88.44` (khớp) |

→ DNS OK. Chờ propagate nếu browser còn cache. Tiếp: PHP 8.2 + Install WP.

Plesk → domain `jpbuidang.vn`:

| Check | Làm |
|-------|-----|
| Hosting Settings → **IP addresses** | ghi IP (khả năng ~`103.138.88.44` hoặc IP trong panel) |
| id.matbao / DNS domain | A `@` + `www` = **IP Plesk** (không dùng `103.110.128.71`) |
| Document root | `httpdocs` |
| PHP | **8.2** (đang 7.4 outdated) |

Chờ DNS (5–60 phút). Test:

```bash
# Mac
host jpbuidang.vn
# phải = IP Plesk, không còn 103.110.128.71
```

Terminal Plesk:

```bash
ls -la ~/httpdocs | head
curl -sI -H "Host: jpbuidang.vn" http://127.0.0.1/ | head -15
```

DNS đúng + `/` không còn “DNS REDIRECT” → mới sang bước 1.

---

### 1. Cài WordPress (Toolkit — dễ nhất)

1. Sidebar → **WordPress** / Dashboard → **Install** (hoặc Installer By MatBao)
2. Domain: `jpbuidang.vn` · path: `/` (httpdocs)
3. Site title: `JP Bùi Đặng`
4. Admin user/pass/email: tự đặt (lưu pass)
5. Plugin set: bỏ preinstall rác nếu có; sau cài Woo tay

Xong → Toolkit → **Log in** → vào admin.

Test browser:

- `http://jpbuidang.vn/` = site WP (không trang Plesk default)
- `http://jpbuidang.vn/wp-login.php` = form login

Fail cả hai dù Toolkit OK → vhost lại hỏng → ticket + IP.

---

### 2. PHP + SSL

1. Dev Tools → **PHP** → **8.2** (+ FPM/Apache nếu có)
2. SSL/TLS → **Let's Encrypt** → bật HTTPS redirect
3. `wp option` / Settings → siteurl + home = `https://jpbuidang.vn`

---

### 3. Plugin + theme (terminal hoặc Toolkit)

```bash
source ~/.bashrc 2>/dev/null
cd ~/httpdocs
# nếu chưa có wp-cli — cài theo matbao-hosting.md

wp plugin install woocommerce wordpress-seo contact-form-7 payment-gateway-mo-mo-for-woocommerce --activate
wp theme install storefront --activate
```

Upload theme child:

```bash
# từ Mac: zip sos-beauty → Files upload → httpdocs/wp-content/themes/
cd ~/httpdocs/wp-content/themes
unzip -o ~/sos-beauty-theme.zip   # hoặc path upload
cd ~/httpdocs
wp theme activate sos-beauty
```

---

### 4. WooCommerce VN

```bash
cd ~/httpdocs
wp wc tool run install_pages --user=1
wp option update woocommerce_default_country 'VN:HN'
wp option update woocommerce_currency 'VND'
wp option update woocommerce_currency_pos 'right_space'
wp option update woocommerce_price_thousand_sep '.'
wp option update woocommerce_price_decimal_sep ','
wp option update woocommerce_price_num_decimals '0'
wp option update woocommerce_coming_soon 'no'
wp option update blogname 'JP Bùi Đặng'
wp option update timezone_string 'Asia/Ho_Chi_Minh'
```

---

### 5. Demo nội dung — **CLI seed (khuyên dùng)**

Không click wp-admin. Pack trên Mac → upload zip → 1 lệnh trên Plesk terminal.

**Guide:** [matbao-demo-setup.md](./matbao-demo-setup.md) · đề xuất: [Đề xuất…](./Đề%20xuất%20bản%20demo%20website%20JPBuiDang.md)

```bash
# Mac
cd /Users/nami/work/jp-hadang
bash scripts/pack-matbao.sh
# → dist/matbao-seed.zip
```

Plesk Files: upload `matbao-seed.zip` → home user. Terminal:

```bash
source ~/.bashrc
cd ~
unzip -o matbao-seed.zip -d matbao-seed
rsync -a matbao-seed/wp-content/themes/sos-beauty/ ~/httpdocs/wp-content/themes/sos-beauty/
cp matbao-seed/setup-matbao.sh matbao-seed/seed-products-from-folder.sh ~/
chmod +x ~/setup-matbao.sh ~/seed-products-from-folder.sh
mkdir -p ~/products && rsync -a matbao-seed/products/ ~/products/ 2>/dev/null || true
cd ~/httpdocs && bash ~/setup-matbao.sh
# setup tự gọi seed nếu có ~/products; hoặc chạy tay:
# PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh
```

Zip gồm: theme `sos-beauty`, `setup-matbao.sh`, `seed-products-from-folder.sh`, slim `products/` (~20 SP + ảnh).  
`setup-matbao.sh`: Woo VN/HN, danh mục, trang, menu, SP demo + seed folder nếu có ảnh.

- [x] SSL / siteurl HTTPS
- [ ] Upload + chạy `setup-matbao.sh` (+ seed folder)
- [ ] MoMo keys
- [ ] Backup

---

## hangnhatchomoinha.vn (paused)

Vhost LiteSpeed không gắn httpdocs dù file WP đủ. Ticket mẫu cũ vẫn trong git history / chat nếu cần.