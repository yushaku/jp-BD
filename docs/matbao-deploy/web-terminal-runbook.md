# Runbook — Plesk Web Terminal (không cần SSH)

> **Cách dùng:** Mở Plesk Web Terminal, copy từng **BLOCK** bên dưới, paste, Enter.
> Chạy đúng thứ tự. Sau mỗi block có phần **Kỳ vọng** — đối chiếu output.
> Nếu lệch → dừng lại, báo lại output.

**Host:** `s88d44.cloudnetwork.vn` · **User:** `jpb36793` · **Domain:** `jpbuidang.vn`

---

## Mở Web Terminal

1. Login `https://s88d44.cloudnetwork.vn:8443/`
2. **Websites & Domains** → `jpbuidang.vn`
3. Tìm **SSH Terminal** (hoặc **Web SSH**)

---

## BLOCK 0 — Khởi tạo môi trường

Chạy **đầu tiên mỗi lần** mở terminal mới (alias `wp` không tự load):

```bash
source ~/.bashrc 2>/dev/null; export PATH="$HOME/bin:$PATH"; wp() { /opt/plesk/php/8.2/bin/php /usr/local/bin/wp "$@"; }; cd ~/httpdocs && pwd && wp --info | head -3
```

**Kỳ vọng:**

```
/var/www/vhosts/jpbuidang.vn/httpdocs
WP-CLI 2.x.x
PHP version: 8.2.x
```

> ⚠️ Nếu `wp: command not found` → chạy BLOCK 0b.

### BLOCK 0b — Cài wp-cli (chỉ khi BLOCK 0 fail)

```bash
cd ~ && curl -sO https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && mkdir -p ~/bin && mv wp-cli.phar ~/bin/wp && chmod +x ~/bin/wp && echo 'wp() { /opt/plesk/php/8.2/bin/php $HOME/bin/wp "$@"; }' >> ~/.bashrc && source ~/.bashrc && wp --info | head -3
```

---

## BLOCK 1 — Kiểm tra hiện trạng (chưa thay đổi gì)

```bash
echo "=== WP ==="; wp core version; wp option get siteurl; wp option get home; echo "=== THEME ==="; wp theme list; echo "=== PLUGIN ==="; wp plugin list --status=active --fields=name,version
```

**Kỳ vọng (theo docs cũ):**

```
=== WP ===
6.x.x  (hoặc version khác)
https://jpbuidang.vn
https://jpbuidang.vn
=== THEME ===
storefront        active
sos-beauty        (chưa có)
=== PLUGIN ===
woocommerce       11.0.1
wordpress-seo     28.2
contact-form-7    6.1.6
payment-gateway-mo-mo-for-woocommerce  1.0.1
```

📋 **Ghi lại output này** — cần để biết còn thiếu gì.

```
[jpb36793@s88d44 httpdocs]$ echo "=== WP ==="; wp core version; wp option get siteurl; wp option get home; echo "=== THEME ==="; wp theme list; echo "=== PLUGIN ==="; wp plugin list --status=active --fields=name,version
=== WP ===
7.0.4

https://jpbuidang.vn
https://jpbuidang.vn
=== THEME ===
+-------------------+----------+--------+---------+----------------+-------------+
| name              | status   | update | version | update_version | auto_update |
+-------------------+----------+--------+---------+----------------+-------------+
| storefront        | active   | none   | 4.6.2   |                | off         |
| twentytwentyfive  | inactive | none   | 1.5     |                | off         |
| twentytwentyfour  | inactive | none   | 1.5     |                | off         |
| twentytwentythree | inactive | none   | 1.6     |                | off         |
+-------------------+----------+--------+---------+----------------+-------------+
=== PLUGIN ===
+---------------------------------------+---------+
| name                                  | version |
+---------------------------------------+---------+
| contact-form-7                        | 6.1.6   |
| payment-gateway-mo-mo-for-woocommerce | 1.0.1   |
| woocommerce                           | 11.0.1  |
| wordpress-seo                         | 28.2    |
+---------------------------------------+---------+
```

```bash
echo "=== PRODUCTS ==="; wp post list --post_type=product --format=count; echo "=== PAGES ==="; wp post list --post_type=page --fields=post_title,post_name --format=csv; echo "=== CURRENCY ==="; wp option get woocommerce_currency; echo "=== PHP ==="; /opt/plesk/php/8.2/bin/php -v | head -1
```

**Kỳ vọng:** số products hiện tại, list pages, `VND` (hoặc `USD` nếu chưa config), PHP 8.2.x

---

## BLOCK 2 — Backup trước khi làm gì

```bash
mkdir -p ~/backups && cd ~/httpdocs && wp db export ~/backups/pre-deploy-$(date +%Y%m%d-%H%M).sql && ls -lh ~/backups/
```

**Kỳ vọng:** file `.sql` vài MB.

> 🔒 Không bỏ qua block này.

---

## BLOCK 3 — Upload bundle (Plesk File Manager, không dùng terminal)

**Trên Mac:**

```bash
cd ~/work/jp-hadang
bash scripts/pack-matbao.sh
open dist/
```

→ có `dist/matbao-seed.zip` (~62MB)

**Trên Plesk:**

1. **Files** → điều hướng lên **home** (thư mục chứa `httpdocs`, không vào trong `httpdocs`)
2. **Upload** → chọn `matbao-seed.zip`
3. Chờ upload xong
4. Click phải file → **Extract Files** → extract tại chỗ

**Verify trong terminal:**

```bash
cd ~ && ls -la matbao-seed.zip matbao-seed/ && ls matbao-seed/products/ | wc -l
```

**Kỳ vọng:**

```   
matbao-seed.zip   (~62M)
matbao-seed/      RUN.txt  setup-matbao.sh  seed-products-from-folder.sh  wp-content/  products/
```

> ⚠️ Upload 62MB có thể timeout. Nếu fail → xem [Phương án B](#phương-án-b--upload-nhẹ-không-kèm-ảnh) ở cuối.

---

## BLOCK 4 — Đặt file vào đúng chỗ

```bash
cd ~ && mkdir -p ~/httpdocs/wp-content/themes/sos-beauty && cp -a matbao-seed/wp-content/themes/sos-beauty/. ~/httpdocs/wp-content/themes/sos-beauty/ && cp matbao-seed/setup-matbao.sh matbao-seed/seed-products-from-folder.sh ~/ && chmod +x ~/setup-matbao.sh ~/seed-products-from-folder.sh && mkdir -p ~/products && cp -a matbao-seed/products/. ~/products/ && echo "--- DONE ---" && ls ~/httpdocs/wp-content/themes/sos-beauty/style.css && ls ~/products/ | wc -l
```

**Kỳ vọng:**

```
--- DONE ---
/var/www/vhosts/jpbuidang.vn/httpdocs/wp-content/themes/sos-beauty/style.css
43
```

### BLOCK 4b — Permissions

```bash
find ~/httpdocs/wp-content/themes/sos-beauty -type d -exec chmod 755 {} \; && find ~/httpdocs/wp-content/themes/sos-beauty -type f -exec chmod 644 {} \; && mkdir -p ~/httpdocs/wp-content/uploads && chmod 755 ~/httpdocs/wp-content/uploads && echo "perms OK"
```

---

## BLOCK 5 — Activate theme

```bash
cd ~/httpdocs && wp theme activate sos-beauty && wp theme list --status=active
```

**Kỳ vọng:**

```
Success: Switched to 'JP Bùi Đặng' theme.
sos-beauty   active
```

> ⚠️ Woo 11 in ra `PHP Warning: Object of class WP_Error ... ProductFilterAttribute.php`. **Ignore.** Warning ≠ fail. Chỉ cần thấy dòng `Success:` + `sos-beauty active`.
>
> Nếu không thấy `Success:` → chạy verify:
> ```bash
> cd ~/httpdocs && wp theme list --status=active --fields=name,status
> ```

**Nếu lỗi "parent theme missing":**

```bash
wp theme install storefront && wp theme activate sos-beauty && wp theme list
```

**Verify frontend:** mở `https://jpbuidang.vn` — layout đổi (dù chưa có data).

---

## BLOCK 6 — Chạy setup script

```bash
cd ~/httpdocs && bash ~/setup-matbao.sh 2>&1 | tail -40
```

**Kỳ vọng (cuối output):**

```
[matbao-setup] DONE → https://jpbuidang.vn
[matbao-setup] Theme: sos-beauty
[matbao-setup] Products: 43
```

Script này làm: config VND → shipping zone VN → category tree → pages → menu → seed products.

⏱️ Mất 5–15 phút (import ảnh). Nếu terminal web timeout → xem BLOCK 6b.

### BLOCK 6b — Chạy nền (nếu web terminal timeout)

```bash
cd ~/httpdocs && nohup bash ~/setup-matbao.sh > ~/setup.log 2>&1 & echo "PID $!"
```

Theo dõi:

```bash
tail -30 ~/setup.log
```

---

## BLOCK 5.5 — Fix permalink 404 (`/error_docs/not_found.html`)

Setup bật `/%postname%/`. Plesk nginx + **Custom error documents** bắt 404 trước WP → mọi URL trừ trang chủ ra `error_docs/not_found.html`.

**Terminal — ghi `.htaccess` + flush:**

```bash
cd ~/httpdocs && cat > .htaccess << 'EOF'
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
EOF
chmod 644 .htaccess && wp rewrite structure '/%postname%/' --hard && wp rewrite flush --hard && echo "---" && ls -la .htaccess && wp option get permalink_structure
```

**Test:** `https://jpbuidang.vn/?pagename=gioi-thieu` — nếu cái này vào được mà `/gioi-thieu/` vẫn 404 → rewrite chưa tới WP.

**Plesk UI (nếu `/gioi-thieu/` vẫn error_docs):**

1. **Websites & Domains** → `jpbuidang.vn` → **Hosting & DNS** → **Apache & nginx Settings**
2. Bỏ tick **Custom error documents** → Apply
3. Nếu PHP = *FPM served by nginx*: thêm **Additional nginx directives**:

```
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

Hoặc đổi PHP handler → **FPM application served by Apache** → OK. Rồi chạy lại lệnh `.htaccess` ở trên.

---

## BLOCK 7 — Seed products riêng (nếu BLOCK 6 chưa seed)

> ⚠️ Product **đã tạo** → seed cũ `SKIP exists` → **không nhân đôi**, cũng **không gắn ảnh**.
> `setup-matbao.sh` chạy lại: an toàn (page/cat/menu idempotent) nhưng **ảnh vẫn thiếu**.
> Setup tạo thêm ~9 product demo (matcha/miso/…) **không có folder ảnh** — `NO IMG` những cái đó bình thường.

```bash
cd ~/httpdocs && PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh 2>&1 | tail -30
```

**Kỳ vọng:**

```
[seed] OK #xxx Serum cam (serum) imgs=3
...
[seed] Done. Total products: 43
```

Chạy nền nếu timeout:

```bash
cd ~/httpdocs && nohup env PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh > ~/seed.log 2>&1 & echo "PID $!"
```

```bash
tail -30 ~/seed.log
```

### BLOCK 7c — Gắn ảnh vào product đã có (thiếu thumbnail)

1. List thiếu:

```bash
cd ~/httpdocs && MISSING=0; for id in $(wp post list --post_type=product --format=ids); do t=$(wp post meta get $id _thumbnail_id 2>/dev/null); [ -z "$t" ] && { echo "NO IMG: #$id $(wp post get $id --field=post_title)"; MISSING=$((MISSING+1)); }; done; echo "Missing images: $MISSING"
```

2. Perms + attach (nền — import ảnh lâu):

```bash
cd ~/httpdocs && chmod 755 ~/httpdocs/wp-content/uploads && nohup bash -c 'wp() { /opt/plesk/php/8.2/bin/php /usr/local/bin/wp "$@"; }; cd ~/httpdocs; shopt -s nullglob; PRODUCTS=~/products; for id in $(wp post list --post_type=product --format=ids); do t=$(wp post meta get $id _thumbnail_id 2>/dev/null || true); [ -n "$t" ] && [ "$t" != "0" ] && continue; title=$(wp post get $id --field=post_title); folder="$PRODUCTS/$title"; if [ ! -d "$folder" ]; then echo "NO FOLDER: #$id $title"; continue; fi; first=""; gallery=""; i=0; for img in "$folder"/*.jpg "$folder"/*.JPG "$folder"/*.jpeg "$folder"/*.JPEG "$folder"/*.png "$folder"/*.PNG "$folder"/*.webp; do [ -f "$img" ] || continue; i=$((i+1)); [ "$i" -gt 3 ] && break; aid=$(wp media import "$img" --title="$title — ảnh $i" --porcelain 2>/dev/null || true); [ -z "$aid" ] && continue; if [ -z "$first" ]; then first="$aid"; else gallery="${gallery:+$gallery,}$aid"; fi; done; [ -n "$first" ] && wp post meta update $id _thumbnail_id "$first" >/dev/null; [ -n "$gallery" ] && wp post meta update $id _product_image_gallery "$gallery" >/dev/null; echo "ATTACH #$id $title imgs=$i thumb=$first"; done; echo DONE' > ~/attach-img.log 2>&1 & echo "PID $!"
```

Theo dõi:

```bash
tail -20 ~/attach-img.log
```

**Kỳ vọng:** `ATTACH #… imgs=1..3` rồi `DONE`. Dòng `NO FOLDER` = product demo (matcha/miso/…) — bỏ qua.

---

## BLOCK 8 — Verify

```bash
cd ~/httpdocs && echo "=== THEME ==="; wp theme list --status=active --field=name; echo "=== PRODUCTS ==="; wp post list --post_type=product --format=count; echo "=== CURRENCY ==="; wp option get woocommerce_currency; wp option get woocommerce_price_num_decimals; echo "=== CATS ==="; wp term list product_cat --fields=name,count --format=csv | head -20
```

**Kỳ vọng:**

```
=== THEME ===
sos-beauty
=== PRODUCTS ===
43
=== CURRENCY ===
VND
0
=== CATS ===
name,count
Mỹ phẩm,23
Serum,4
Chăm sóc răng miệng,8
...
```

### Kiểm tra ảnh

```bash
cd ~/httpdocs && MISSING=0; for id in $(wp post list --post_type=product --format=ids); do t=$(wp post meta get $id _thumbnail_id 2>/dev/null); [ -z "$t" ] && { echo "NO IMG: #$id $(wp post get $id --field=post_title)"; MISSING=$((MISSING+1)); }; done; echo "Missing images: $MISSING"
```

**Kỳ vọng:** `Missing images: 0` (hoặc chỉ còn ~9 product demo không có folder — tên matcha/miso/senbei/serum-vitamin-c/kem-duong-am/son-kem-li/collagen-nhat/vitamin-c-vien/omega-3). Folder products phải có ảnh. Nếu folder products vẫn `NO IMG` → BLOCK 7c.

### Flush cache

```bash
cd ~/httpdocs && wp rewrite flush --hard && wp cache flush && echo "flushed"
```

---

## BLOCK 9 — Dọn dẹp

```bash
cd ~ && rm -f matbao-seed.zip && rm -rf matbao-seed && df -h ~ | tail -1 && du -sh ~/httpdocs ~/products ~/backups
```

> Giữ lại `~/products/`, `~/setup-matbao.sh`, `~/seed-products-from-folder.sh` để seed thêm sau.

---

## Phương án B — Upload nhẹ (không kèm ảnh)

Nếu upload 62MB fail:

**Mac:**

```bash
cd ~/work/jp-hadang && SKIP_PRODUCTS=1 bash scripts/pack-matbao.sh && ls -lh dist/matbao-seed.zip
```

→ ~500KB, upload nhanh.

Rồi upload riêng `products/` bằng **FTP/SFTP (FileZilla)** vào `~/products/`:

| Mục         | Giá trị                           |
| ----------- | --------------------------------- |
| Host        | `s88d44.cloudnetwork.vn`          |
| Protocol    | FTP (hoặc SFTP nếu port mở)       |
| User        | `jpb36793`                        |
| Password    | _password Plesk_                  |
| Remote path | `/products` (cùng cấp `httpdocs`) |

Hoặc bỏ ảnh: seed products không ảnh, rồi upload ảnh qua WP Admin → Media sau.

---

## Xử lý sự cố

| Triệu chứng                                                | Xử lý                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `wp: command not found`                                    | Chạy lại BLOCK 0, hoặc BLOCK 0b                                                                       |
| `Error: This does not seem to be a WordPress installation` | Sai thư mục → `cd ~/httpdocs`                                                                         |
| Terminal ngắt giữa lệnh dài                                | Dùng biến thể `nohup ... &` rồi `tail -f log`                                                         |
| `rsync: command not found`                                 | Plesk web terminal không có `rsync`. BLOCK 4 dùng `cp -a` — paste lại block đó |
| `PHP Warning: ... ProductFilterAttribute.php`              | Woo 11 bug khi shop chưa có attribute. Ignore. Verify: `wp theme list --status=active` |
| Import ảnh fail / product đã có, thiếu ảnh                 | **Không** chạy lại setup. BLOCK 7c (gắn ảnh). Seed cũ SKIP exists → không fill. Demo product (matcha/miso/…) không có folder → bỏ qua |
| Site trắng sau activate theme                              | `wp theme activate storefront` → xem `~/logs/error_log`                                               |
| Mọi page → `/error_docs/not_found.html`                    | Permalink Plesk. BLOCK 5.5: ghi `.htaccess` + tắt Custom error documents. Homepage `/?p=` vẫn vào được |
| Giá hiện `$`                                               | `wp option update woocommerce_currency VND`                                                           |

---

## Rollback

```bash
cd ~/httpdocs && wp theme activate storefront && wp post list --post_type=product --format=ids | xargs -r wp post delete --force && echo "rolled back"
```

Restore DB:

```bash
cd ~/httpdocs && ls ~/backups/ && wp db import ~/backups/pre-deploy-YYYYMMDD-HHMM.sql
```

---

## Tiến độ

- [ ] BLOCK 0 — môi trường OK
- [ ] BLOCK 1 — ghi lại hiện trạng
- [ ] BLOCK 2 — backup
- [ ] BLOCK 3 — upload + extract zip
- [ ] BLOCK 4 — đặt file + permissions
- [ ] BLOCK 5 — activate theme
- [ ] BLOCK 6 — setup script
- [ ] BLOCK 7 — seed products
- [ ] BLOCK 8 — verify
- [ ] BLOCK 9 — dọn dẹp
