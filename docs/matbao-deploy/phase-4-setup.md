# Phase 4 — Setup site (theme + plugins + config)

> **Nơi thực hiện:** Hosting SSH
> **Thời gian:** ~10 phút
> **Bắt buộc:** ✅

---

## 4.1 Backup trước khi setup

```bash
ssh $MB_USER@$MB_HOST
cd ~/httpdocs

# Backup DB
wp db export ~/backup-pre-setup-$(date +%Y%m%d-%H%M).sql

# Verify
ls -lh ~/backup-pre-setup-*.sql
```

---

## 4.2 Chạy setup script

```bash
cd ~/httpdocs

# Nếu wp-cli ở path khác, set trước:
# export PHP_BIN=/opt/plesk/php/8.2/bin/php
# export WP_BIN=/usr/local/bin/wp

bash ~/setup-matbao.sh
```

### Script làm gì

| Bước | Nội dung |
|------|----------|
| `sync_urls` | Set `siteurl` + `home` = `https://jpbuidang.vn` |
| `install_plugins_and_theme` | Install + activate WooCommerce, MoMo gateway, VNPay (nếu có zip), activate theme `sos-beauty` |
| `configure_woocommerce` | Currency VND, địa chỉ Hà Nội, format giá `1.000 ₫`, 0 decimal, tắt tax, bật COD + BACS |
| `configure_shipping_zone` | Tạo shipping zone Việt Nam, flat rate |
| `ensure_product_category_tree` | Tạo cây danh mục: Mỹ phẩm > Chăm sóc da > Serum/Kem dưỡng/Mặt nạ/Rửa mặt/Toner, Chăm sóc tóc > Dầu gội, Cơ thể > Sữa tắm/Xà phòng/Răng miệng, Hàng tiêu dùng > TPCN, Thực phẩm |
| `create_pages` | Trang chủ, Giới thiệu, Liên hệ, Shop, Cart, Checkout, My Account |
| `create_menu` | Menu chính với các trang + Shop |
| `create_demo_products` | Tạo vài product demo (sẽ bị seed thật ghi đè/bổ sung) |
| `seed_from_folder_if_present` | Tự động gọi `seed-products-from-folder.sh` nếu tìm thấy `~/products/` |
| `apply_brand_logo` | Set logo nếu có file |
| `finalize` | Flush rewrite + cache, in tổng kết |

**Output mong đợi:**
```
[matbao-setup] Sync URLs → https://jpbuidang.vn
[matbao-setup] Install plugins + theme...
[matbao-setup] WooCommerce config (VND)...
[matbao-setup] Shipping zone Việt Nam...
[matbao-setup] Product category tree...
[matbao-setup] Pages...
[matbao-setup] Menu...
[matbao-setup] Seed products from /home/<user>/products ...
[seed] OK #123 Serum cam (serum) imgs=3
...
[matbao-setup] DONE → https://jpbuidang.vn
[matbao-setup] Theme: sos-beauty
[matbao-setup] Products: 43
```

---

## 4.3 Verify từng phần

### Theme

```bash
wp theme list
# → sos-beauty | active
```

### Plugins

```bash
wp plugin list --status=active
# → woocommerce, (momo), (vnpay)
```

### WooCommerce config

```bash
wp option get woocommerce_currency          # → VND
wp option get woocommerce_price_num_decimals # → 0
wp option get woocommerce_default_country    # → VN:HN
wp option get woocommerce_currency_pos       # → right_space
```

### Categories

```bash
wp term list product_cat --fields=name,slug,parent,count --format=table
```

### Pages

```bash
wp post list --post_type=page --fields=ID,post_title,post_name --format=table
# → Trang chủ, Giới thiệu, Liên hệ, Shop, Giỏ hàng, Thanh toán, Tài khoản
```

### Menu

```bash
wp menu list
wp menu item list primary --format=table
```

---

## 4.4 Fix nếu thiếu

### Theme không activate

```bash
wp theme activate sos-beauty
# Nếu lỗi "not found" → check path
ls ~/httpdocs/wp-content/themes/
```

### WooCommerce install fail (network/timeout)

```bash
# Download thủ công
cd ~/httpdocs/wp-content/plugins
wget https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip
unzip -o woocommerce.latest-stable.zip
rm woocommerce.latest-stable.zip
cd ~/httpdocs
wp plugin activate woocommerce
```

### Front page chưa set

```bash
HOME_ID=$(wp post list --post_type=page --name=trang-chu --field=ID)
wp option update show_on_front page
wp option update page_on_front $HOME_ID
```

### Seed pages riêng (giới thiệu)

```bash
bash ~/seed-gioi-thieu.sh
# (nếu đã upload script này)
```

---

## ✅ Checklist Phase 4

- [ ] Theme `sos-beauty` active
- [ ] WooCommerce active
- [ ] Currency = VND, 0 decimal
- [ ] Shipping zone Việt Nam có
- [ ] Category tree đầy đủ
- [ ] Pages: Trang chủ / Giới thiệu / Liên hệ / Shop / Cart / Checkout / Account
- [ ] Menu chính hoạt động
- [ ] Front page = Trang chủ

**Rollback:**
```bash
wp theme activate storefront
wp plugin deactivate woocommerce
wp db import ~/backup-pre-setup-*.sql
```

**→ Tiếp:** [Phase 5 — Seed products](./phase-5-seed.md)
