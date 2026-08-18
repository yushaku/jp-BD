# Phase 0 — Chuẩn bị hosting

> **Nơi thực hiện:** Plesk UI (browser)
> **Thời gian:** ~10 phút
> **Bắt buộc:** ✅

---

## 0.1 Đăng nhập Plesk

- [ ] Mở `https://s88d44.cloudnetwork.vn:8443/`
- [ ] Login (tài khoản từ id.matbao.net → Cloud Hosting → Bảng điều khiển)

**Verify:** Thấy dashboard, có domain `jpbuidang.vn` trong list.

---

## 0.2 Lấy thông tin SSH

- [ ] Plesk → **Websites & Domains** → `jpbuidang.vn`
- [ ] Click **Connection Info** (hoặc **Web Hosting Access**)
- [ ] Ghi lại:

| Mục | Giá trị |
|-----|---------|
| System user | `________________` |
| SSH host | `s88d44.cloudnetwork.vn` |
| SSH port | `22` (hoặc port riêng) |
| Password | `________________` |

**Verify từ Mac:**
```bash
ssh <system_user>@s88d44.cloudnetwork.vn
# Nhập password → vào được shell
```

**Nếu fail:** Plesk → **Web Hosting Access** → Access to the server over SSH → chọn `/bin/bash` (hoặc `chrootsh`)

---

## 0.3 Đổi PHP 7.4 → 8.2

- [ ] Plesk → `jpbuidang.vn` → **PHP Settings** (hoặc **Hosting Settings**)
- [ ] PHP version → chọn **8.2.x**
- [ ] `memory_limit` → **256M**
- [ ] `upload_max_filesize` → **64M**
- [ ] `post_max_size` → **64M**
- [ ] `max_execution_time` → **300**
- [ ] Click **OK / Apply**

**Verify qua SSH:**
```bash
php -v
# → PHP 8.2.x

/opt/plesk/php/8.2/bin/php -v
# → PHP 8.2.x
```

**Rollback:** Đổi lại 7.4 nếu site cũ vỡ (nhưng WP mới cần 8.x).

---

## 0.4 Kiểm tra wp-cli

**Qua SSH:**
```bash
which wp
# → /usr/local/bin/wp (hoặc path khác)

/opt/plesk/php/8.2/bin/php /usr/local/bin/wp --info
# → hiện version wp-cli
```

**Nếu wp-cli chưa có:**
```bash
cd ~
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mkdir -p ~/bin
mv wp-cli.phar ~/bin/wp
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
wp --info
```

**Ghi lại paths để dùng cho scripts:**
```bash
export PHP_BIN=/opt/plesk/php/8.2/bin/php
export WP_BIN=/usr/local/bin/wp   # hoặc ~/bin/wp
```

---

## 0.5 Tạo Database

- [ ] Plesk → **Databases** → **Add Database**
- [ ] Database name: `jpbuidang_wp`
- [ ] Related site: `jpbuidang.vn`
- [ ] Tạo user mới:

| Mục | Giá trị |
|-----|---------|
| DB name | `jpbuidang_wp` |
| DB user | `________________` |
| DB password | `________________` (lưu vào password manager) |
| DB host | `localhost` |

**Verify:**
```bash
mysql -u <db_user> -p<db_pass> -e "SHOW DATABASES;" | grep jpbuidang
```

> ⚠️ Nếu dùng Plesk WordPress Toolkit để install WP (Phase 1), nó tự tạo DB — có thể skip step này.

---

## 0.6 Kiểm tra DNS

**Từ Mac:**
```bash
dig +short jpbuidang.vn
# → 103.138.88.44

dig +short www.jpbuidang.vn
# → 103.138.88.44
```

**Nếu sai IP:**
- [ ] Plesk → **DNS Settings** → sửa A record `@` và `www` → `103.138.88.44`
- [ ] Hoặc sửa tại nhà cung cấp domain
- [ ] Chờ propagate 5–30 phút

---

## ✅ Checklist Phase 0

- [ ] SSH vào được hosting
- [ ] PHP 8.2 active (cả CLI và web)
- [ ] wp-cli chạy được
- [ ] Database đã tạo (hoặc sẽ tạo tự động ở Phase 1)
- [ ] DNS trỏ đúng IP `103.138.88.44`

**→ Tiếp:** [Phase 1 — Install WordPress](./phase-1-wordpress.md)
