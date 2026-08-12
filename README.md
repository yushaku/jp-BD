# JP Bùi Đặng — WordPress + WooCommerce (Docker)

Môi trường dev local cho cửa hàng ecommerce thị trường Việt Nam: VND, tiếng Việt, COD, chuyển khoản, MoMo, giao hàng nội địa.

## Yêu cầu

- Docker Desktop (hoặc Docker Engine + Compose v2)
- 4GB RAM trở lên

## Chạy lần đầu

```bash
cp .env.example .env
# Chỉnh mật khẩu trong .env trước khi chạy production-like

docker compose up -d
docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/setup.sh
```

Truy cập:

| Dịch vụ    | URL                            |
| ---------- | ------------------------------ |
| Cửa hàng   | http://localhost:8080          |
| wp-admin   | http://localhost:8080/wp-admin |
| phpMyAdmin | http://localhost:8081          |

**Đăng nhập admin mặc định** (đổi ngay sau lần đăng nhập đầu):

- User: `admin` (hoặc giá trị `WP_ADMIN_USER` trong `.env`)
- Password: `admin123_change_me` (hoặc `WP_ADMIN_PASSWORD` trong `.env`)

## Kiến trúc

```
wordpress:8080  →  MySQL (volume db_data)
phpmyadmin:8081 →  MySQL
wpcli (profile) →  one-shot setup / maintenance
```

Dữ liệu WordPress lưu trong Docker volume `wordpress_data` — không commit vào git.

## Đã cấu hình sẵn

- WordPress tiếng Việt (`vi`)
- WooCommerce: quốc gia VN, tiền tệ **VND** (0 số thập phân)
- Thanh toán: **COD**, **chuyển khoản ngân hàng (BACS)**
- Vận chuyển: zone **Vietnam** (flat rate + free shipping)
- Theme: **Storefront** + child **JP Bùi Đặng** (Washi & Matcha, Lora + Be Vietnam Pro)
- Plugin: WooCommerce, Yoast SEO, Contact Form 7, MoMo
- 5 sản phẩm demo, menu, trang chính sách

## Thanh toán VNPay (sandbox)

Plugin VNPay không có trên WordPress.org (bản cũ đã đóng). Tải plugin chính thức từ VNPay:

1. Đăng ký sandbox: http://sandbox.vnpayment.vn/devreg/
2. Tải plugin: https://sandbox.vnpayment.vn/apis/docs/open/woocommerce/
3. Lưu file zip tại `scripts/plugins/vnpay-woocommerce.zip`
4. Chạy lại setup:

```bash
docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/setup.sh
```

5. Cấu hình trong **WooCommerce → Cài đặt → Thanh toán → VNPAY**:

| Trường      | Giá trị sandbox (ví dụ)                              |
| ----------- | ---------------------------------------------------- |
| Terminal ID | `VNPAY_TMN_CODE` trong `.env`                        |
| Secret Key  | `VNPAY_HASH_SECRET` trong `.env`                     |
| Url Pay     | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| Locale      | `vn`                                                 |

## Thanh toán MoMo (sandbox)

Plugin `payment-gateway-mo-mo-for-woocommerce` đã được cài tự động.

1. Đăng ký tài khoản doanh nghiệp: https://momo.vn/
2. Lấy Partner Code, Access Key, Secret Key từ MoMo sandbox
3. Điền vào `.env`:

```env
MOMO_PARTNER_CODE=...
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...
```

4. Cấu hình trong **WooCommerce → Cài đặt → Thanh toán → MoMo Gateway**

Endpoint sandbox mặc định: `https://test-payment.momo.vn/v2/gateway/api/create`

## Verify checkout COD (end-to-end)

1. Mở http://localhost:8080/shop/
2. Thêm sản phẩm vào giỏ → **Thanh toán**
3. Điền thông tin giao hàng (tỉnh/thành VN)
4. Chọn **Thanh toán khi nhận hàng (COD)** → **Đặt hàng**
5. Kiểm tra đơn trong **wp-admin → WooCommerce → Đơn hàng**

## Lệnh hữu ích

```bash
# Xem logs
docker compose logs -f wordpress

# Backup database
docker compose exec db mysqldump -u wp -p wordpress > backup.sql

# WP-CLI tùy ý
docker compose --profile cli run --rm --entrypoint wp wpcli --allow-root plugin list

# Dừng stack (giữ data)
docker compose down

# Reset toàn bộ (xóa data)
docker compose down -v
```

## Tùy chỉnh theme mỹ phẩm

Child theme nằm tại `wp-content/themes/sos-beauty/` (mount vào container).

| File                                   | Vai trò                                            |
| -------------------------------------- | -------------------------------------------------- |
| `style.css`                            | Palette Washi & Matcha, font Lora + Be Vietnam Pro |
| `front-page.php`                       | Promo grid, danh mục, sản phẩm, trust strip        |
| `template-parts/promo-hero.php`        | Lưới ưu đãi (feature + countdown + 2 tile)         |
| `functions.php`                        | Tab sản phẩm, Customizer, hooks WooCommerce        |
| `woocommerce/content-product.php`      | Thẻ sản phẩm — thương hiệu trên archive            |
| `woocommerce/single-product/title.php` | Hiển thị thương hiệu PDP                           |

**Palette:** `--jp-matcha` (accent), `--jp-matcha-text` / `--jp-gold` / `--jp-vermillion` (text+CTA, WCAG AA vs cream), `--jp-indigo` (footer bg). Text on footer: `--jp-footer-text` / `--jp-footer-muted` — no low-opacity body copy.

Chỉnh promo trang chủ: **Giao diện → Tùy chỉnh → JP Bùi Đặng Promo Hero** (ảnh, tiêu đề, CTA, countdown ISO 8601).

Footer (địa chỉ, hotline, email, link BCT): **Giao diện → Tùy chỉnh → JP Bùi Đặng Footer**.

Mục **JP Bùi Đặng Hero** (text) giữ cho tương thích — không còn hiển thị trên trang chủ.

Kích hoạt lại theme:

```bash
docker compose --profile cli run --rm --entrypoint wp wpcli --allow-root theme activate sos-beauty
```

## Cấu trúc repo

```
├── docker-compose.yml
├── .env.example
├── wp-content/themes/sos-beauty/   # Child theme mỹ phẩm (commit được)
│   ├── style.css
│   ├── functions.php
│   ├── front-page.php
│   └── woocommerce/
├── scripts/
│   ├── setup.sh              # Khởi tạo WP + WooCommerce
│   └── plugins/
│       └── vnpay-woocommerce.zip   # (tự thêm) plugin VNPay
└── README.md
```

## Mở rộng sau này

- Tích hợp GHTK / GHN / Viettel Post (API vận chuyển)
- Deploy production (nginx, SSL, backup tự động)
- Theme trả phí (Kadence, Flatsome) hoặc custom theme
