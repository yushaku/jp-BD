# Phase 1 — Install WordPress

> **Nơi thực hiện:** Plesk UI hoặc SSH
> **Thời gian:** ~10 phút
> **Bắt buộc:** ✅

---

## Cách A — Plesk WordPress Toolkit (khuyến nghị)

### 1.1 Install qua Toolkit

- [ ] Plesk → **WordPress** (sidebar) → **Install**
- [ ] Cấu hình:

| Mục | Giá trị |
|-----|---------|
| Installation path | `jpbuidang.vn` (root, **không** subfolder) |
| Website title | `JPBuiDang — Hàng Nhật chính hãng` |
| Plugin/theme set | **None** (sẽ cài thủ công) |
| Admin username | `jpadmin` (không dùng `admin`) |
| Admin password | _mật khẩu mạnh, lưu password manager_ |
| Admin email | `________________` |
| Language | `Tiếng Việt` |
| Database name | `jpbuidang_wp` |
| Auto-update | Minor only |

- [ ] Click **Install**
- [ ] Chờ ~2 phút

**Verify:**
```bash
# SSH
cd ~/httpdocs
ls -la wp-config.php wp-content wp-admin
wp core version
# → 6.x.x
```

Mở `http://jpbuidang.vn` → thấy WP default theme.

---

## Cách B — SSH thủ công

### 1.1 Download WordPress

```bash
cd ~/httpdocs

# Xóa file mặc định của Plesk (nếu có)
rm -f index.html index.php

# Download WP
wp core download --locale=vi --force
```

### 1.2 Tạo wp-config.php

```bash
wp config create \
  --dbname=jpbuidang_wp \
  --dbuser=<db_user> \
  --dbpass=<db_pass> \
  --dbhost=localhost \
  --dbprefix=jpwp_ \
  --locale=vi
```

### 1.3 Install core

```bash
wp core install \
  --url=https://jpbuidang.vn \
  --title="JPBuiDang — Hàng Nhật chính hãng" \
  --admin_user=jpadmin \
  --admin_password='<strong_password>' \
  --admin_email=<your_email>
```

**Verify:**
```bash
wp core is-installed && echo "OK"
wp option get siteurl
# → https://jpbuidang.vn
```

---

## 1.2 Cấu hình cơ bản

```bash
cd ~/httpdocs

# Timezone
wp option update timezone_string 'Asia/Ho_Chi_Minh'

# Permalink structure (SEO friendly)
wp rewrite structure '/%postname%/' --hard
wp rewrite flush --hard

# Tắt comment mặc định
wp option update default_comment_status closed
wp option update default_ping_status closed

# Ngôn ngữ
wp language core install vi --activate

# Xóa content mặc định
wp post delete 1 --force 2>/dev/null || true   # Hello World
wp post delete 2 --force 2>/dev/null || true   # Sample Page

# Xóa plugin/theme mặc định không dùng
wp plugin delete hello akismet 2>/dev/null || true
wp theme delete twentytwentythree twentytwentytwo 2>/dev/null || true
```

**Verify:**
```bash
wp option get timezone_string   # → Asia/Ho_Chi_Minh
wp option get permalink_structure   # → /%postname%/
wp post list --format=count   # → 0
```

---

## 1.3 Bảo mật cơ bản

```bash
# Tắt file editor trong admin
wp config set DISALLOW_FILE_EDIT true --raw

# Giới hạn revision
wp config set WP_POST_REVISIONS 5 --raw

# Tắt debug (production)
wp config set WP_DEBUG false --raw
wp config set WP_DEBUG_DISPLAY false --raw

# Permissions
find ~/httpdocs -type d -exec chmod 755 {} \;
find ~/httpdocs -type f -exec chmod 644 {} \;
chmod 600 ~/httpdocs/wp-config.php
```

---

## ✅ Checklist Phase 1

- [ ] WordPress installed, `wp core is-installed` OK
- [ ] Login được `https://jpbuidang.vn/wp-admin`
- [ ] Timezone = `Asia/Ho_Chi_Minh`
- [ ] Permalink = `/%postname%/`
- [ ] Content mặc định đã xóa
- [ ] `wp-config.php` chmod 600

**Rollback:**
```bash
# Xóa hết WP, cài lại
cd ~/httpdocs
rm -rf * .htaccess
# Rồi làm lại Phase 1
```

**→ Tiếp:** [Phase 2 — Pack bundle](./phase-2-pack.md)
