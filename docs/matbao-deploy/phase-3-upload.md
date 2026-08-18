# Phase 3 — Upload lên hosting

> **Nơi thực hiện:** Mac → Hosting
> **Thời gian:** ~10–20 phút (tùy tốc độ mạng)
> **Bắt buộc:** ✅

---

## Cách A — SCP/rsync qua SSH (nhanh, khuyến nghị)

### 3.1 Upload zip

```bash
cd ~/work/jp-hadang

# Set biến cho gọn
export MB_USER=<system_user>
export MB_HOST=s88d44.cloudnetwork.vn

# Upload
scp dist/matbao-seed.zip $MB_USER@$MB_HOST:~/
```

**Verify:**
```bash
ssh $MB_USER@$MB_HOST "ls -lh ~/matbao-seed.zip"
```

### 3.2 (Alternative) rsync trực tiếp không cần zip

```bash
# Theme
rsync -avz --delete \
  --exclude '.DS_Store' \
  wp-content/themes/sos-beauty/ \
  $MB_USER@$MB_HOST:~/httpdocs/wp-content/themes/sos-beauty/

# Scripts
rsync -avz \
  scripts/setup-matbao.sh \
  scripts/seed-products-from-folder.sh \
  $MB_USER@$MB_HOST:~/

# Products (chỉ ảnh, giới hạn 3/folder — dùng zip thay vì rsync full 700MB)
rsync -avz dist/matbao-seed/products/ \
  $MB_USER@$MB_HOST:~/products/
```

> 💡 rsync nhanh hơn khi deploy lại (chỉ sync file thay đổi).

---

## Cách B — Plesk File Manager (nếu SSH bị chặn)

### 3.1 Upload zip

- [ ] Plesk → **Files** → điều hướng tới home directory (`/`)
- [ ] Click **Upload** → chọn `dist/matbao-seed.zip`
- [ ] Chờ upload xong (~55MB)

### 3.2 Extract

- [ ] Click phải vào `matbao-seed.zip` → **Extract Files**
- [ ] Extract vào `matbao-seed/`

**Verify:** Thấy folder `matbao-seed/` với `RUN.txt`, `setup-matbao.sh`, `wp-content/`, `products/`

---

## 3.3 Giải nén + đặt file đúng chỗ (SSH)

```bash
ssh $MB_USER@$MB_HOST

source ~/.bashrc
cd ~

# Giải nén (nếu chưa)
unzip -o matbao-seed.zip -d .

# Theme
mkdir -p ~/httpdocs/wp-content/themes/sos-beauty
rsync -a matbao-seed/wp-content/themes/sos-beauty/ \
  ~/httpdocs/wp-content/themes/sos-beauty/

# Scripts về home
cp matbao-seed/setup-matbao.sh ~/
cp matbao-seed/seed-products-from-folder.sh ~/
chmod +x ~/setup-matbao.sh ~/seed-products-from-folder.sh

# Products
mkdir -p ~/products
rsync -a matbao-seed/products/ ~/products/

# VNPay plugin (nếu có)
[ -f matbao-seed/vnpay-woocommerce.zip ] && cp matbao-seed/vnpay-woocommerce.zip ~/
```

**Verify:**
```bash
ls ~/httpdocs/wp-content/themes/sos-beauty/style.css   # → tồn tại
ls ~/setup-matbao.sh ~/seed-products-from-folder.sh    # → tồn tại, executable
ls ~/products/ | wc -l                                  # → 43
du -sh ~/products/                                      # → ~52M
```

---

## 3.4 Fix permissions

```bash
# Theme files
find ~/httpdocs/wp-content/themes/sos-beauty -type d -exec chmod 755 {} \;
find ~/httpdocs/wp-content/themes/sos-beauty -type f -exec chmod 644 {} \;

# Uploads writable
chmod -R 755 ~/httpdocs/wp-content/uploads 2>/dev/null || \
  mkdir -p ~/httpdocs/wp-content/uploads && chmod 755 ~/httpdocs/wp-content/uploads
```

---

## 3.5 Dọn file tạm (sau khi xong)

```bash
# Chờ đến Phase 6 verify OK rồi mới xóa
rm -f ~/matbao-seed.zip
rm -rf ~/matbao-seed
```

---

## ✅ Checklist Phase 3

- [ ] `~/httpdocs/wp-content/themes/sos-beauty/` có đủ file
- [ ] `~/setup-matbao.sh` executable
- [ ] `~/seed-products-from-folder.sh` executable
- [ ] `~/products/` có 43 folders với ảnh
- [ ] Permissions đúng (755 dir / 644 file)

**Rollback:**
```bash
rm -rf ~/httpdocs/wp-content/themes/sos-beauty
rm -f ~/setup-matbao.sh ~/seed-products-from-folder.sh
rm -rf ~/products
```

**→ Tiếp:** [Phase 4 — Setup site](./phase-4-setup.md)
