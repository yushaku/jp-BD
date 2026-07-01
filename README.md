# JP Bùi Đặng — Headless WordPress + WooCommerce + Next.js

Môi trường dev local cho cửa hàng ecommerce thị trường Việt Nam: VND, tiếng Việt, COD, chuyển khoản, MoMo, giao hàng nội địa.

**Kiến trúc headless:** Next.js storefront → WooCommerce REST / Store API → WordPress + WooCommerce backend. Checkout hybrid redirect sang WP cho payment gateway.

## Yêu cầu

- Docker Desktop (hoặc Docker Engine + Compose v2)
- Node.js 20+ và pnpm (chỉ khi chạy frontend ngoài Docker)
- 4GB RAM trở lên

## Chạy lần đầu

```bash
cp .env.example .env
# Chỉnh mật khẩu trong .env trước khi chạy production-like

docker compose up -d
docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/setup.sh
```

Setup script sẽ in `WC_CONSUMER_KEY` và `WC_CONSUMER_SECRET` — copy vào `.env`:

```env
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
```

Khởi động Next.js (Docker, hot reload):

```bash
docker compose up -d nextjs
docker compose logs -f nextjs
```

Source `frontend/` được mount vào container — sửa code → tự reload. Production image: `frontend/Dockerfile`.

Hoặc dev local:

```bash
cp frontend/.env.local.example frontend/.env.local
# Điền WC_CONSUMER_KEY / WC_CONSUMER_SECRET
cd frontend && pnpm install && pnpm dev
```

Truy cập (mode `ports` — mặc định khi chưa dùng nginx):

| Dịch vụ                    | URL                            |
| -------------------------- | ------------------------------ |
| **Storefront (Next.js)**   | http://localhost:3000          |
| WordPress (checkout/admin) | http://localhost:8080          |
| wp-admin                   | http://localhost:8080/wp-admin |
| phpMyAdmin                 | http://localhost:8081          |

## Chuyển mode: localhost ↔ Cloudflare tunnel

Script `scripts/mode.sh` cập nhật `.env`, WordPress `home`/`siteurl`, và khởi động đúng stack:

```bash
chmod +x scripts/mode.sh

# Local — một domain qua nginx :80
./scripts/mode.sh local
# → http://localhost          (storefront)
# → http://localhost/wp-admin (admin)

# Local — truy cập trực tiếp từng port (không nginx)
./scripts/mode.sh ports
# → http://localhost:3000       (Next.js)
# → http://localhost:8080/wp-admin

# Tunnel — public qua Cloudflare
./scripts/mode.sh tunnel
cloudflared tunnel run yuchi-local
# → https://shop.yuchi-education.com
# → https://shop.yuchi-education.com/wp-admin

./scripts/mode.sh status   # xem mode hiện tại
```

| Mode    | Storefront              | wp-admin                         | nginx |
| ------- | ----------------------- | -------------------------------- | ----- |
| `local` | http://localhost        | http://localhost/wp-admin        | ✓     |
| `ports` | http://localhost:3000   | http://localhost:8080/wp-admin   | ✗     |
| `tunnel`| https://shop.yuchi-education.com | same domain + `/wp-admin` | ✓ + cloudflared |

Đổi tunnel hostname trong `.env`: `TUNNEL_HOSTNAME=your.domain.com`

**Đăng nhập admin mặc định** (đổi ngay sau lần đăng nhập đầu):

- User: `admin` (hoặc giá trị `WP_ADMIN_USER` trong `.env`)
- Password: `admin123_change_me` (hoặc `WP_ADMIN_PASSWORD` trong `.env`)

## Kiến trúc

```
Next.js :3000          →  WooCommerce REST API (wc/v3) — products, categories
                       →  WooCommerce Store API — cart
                       →  SOS Headless API — hero, menu, checkout handoff

WordPress :8080        →  MySQL (volume db_data)
                       →  wp-admin CMS, checkout, payment (COD/MoMo/VNPay)

phpmyadmin :8081       →  MySQL
wpcli (profile)        →  one-shot setup / maintenance
```

**Luồng checkout hybrid:**

1. Khách browse + thêm giỏ trên Next.js (Store API + `Cart-Token`)
2. Bấm **Thanh toán** → `POST /wp-json/sos/v1/checkout-handoff`
3. Redirect sang `http://localhost:8080/checkout/` (WP session cart)
4. Chọn COD / MoMo / VNPay trên WooCommerce checkout

Dữ liệu WordPress lưu trong Docker volume `wordpress_data` — không commit vào git.

## Đã cấu hình sẵn

- WordPress tiếng Việt (`vi`)
- WooCommerce: quốc gia VN, tiền tệ **VND** (0 số thập phân)
- Thanh toán: **COD**, **chuyển khoản ngân hàng (BACS)**
- Vận chuyển: zone **Vietnam** (flat rate + free shipping)
- Plugin **SOS Headless**: CORS, REST meta, hero/menu API, cart handoff
- Theme **Storefront** + child **JP Bùi Đặng** (checkout/account skin)
- Frontend **Next.js** port UI từ `front-page.php`
- 9 sản phẩm demo, menu, trang chính sách

## Thanh toán VNPay (sandbox)

Plugin VNPay không có trên WordPress.org (bản cũ đã đóng). Tải plugin chính thức từ VNPay:

1. Đăng ký sandbox: http://sandbox.vnpayment.vn/devreg/
2. Tải plugin: https://sandbox.vnpayment.vn/apis/docs/open/woocommerce/
3. Lưu file zip tại `scripts/plugins/vnpay-woocommerce.zip`
4. Chạy lại setup:

```bash
docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/setup.sh
```

5. Cấu hình trong **WooCommerce → Cài đặt → Thanh toán → VNPAY**

## Thanh toán MoMo (sandbox)

Plugin `payment-gateway-mo-mo-for-woocommerce` đã được cài tự động. Cấu hình trong **WooCommerce → Cài đặt → Thanh toán → MoMo Gateway**.

## Verify checkout COD (end-to-end headless)

1. Mở http://localhost:3000/shop/
2. Thêm sản phẩm vào giỏ → **Giỏ hàng** → **Thanh toán**
3. Redirect sang WP checkout → điền thông tin giao hàng (tỉnh/thành VN)
4. Chọn **Thanh toán khi nhận hàng (COD)** → **Đặt hàng**
5. Kiểm tra đơn trong **wp-admin → WooCommerce → Đơn hàng**

## Lệnh hữu ích

```bash
# Xem logs
docker compose logs -f wordpress
docker compose logs -f nextjs

# Rebuild frontend dev image (sau khi đổi package.json)
docker compose build nextjs && docker compose up -d nextjs

# Backup database
docker compose exec db mysqldump -u wp -p wordpress > backup.sql

# WP-CLI tùy ý
docker compose --profile cli run --rm --entrypoint wp wpcli --allow-root plugin list

# Dừng stack (giữ data)
docker compose down

# Reset toàn bộ (xóa data)
docker compose down -v
```

## Frontend Next.js

| Route              | Mô tả                                               |
| ------------------ | --------------------------------------------------- |
| `/`                | Home — hero, categories, featured products          |
| `/shop`            | Tất cả sản phẩm                                     |
| `/category/[slug]` | Danh mục (thuc-pham-nhat, my-pham-nhat, tpcn)       |
| `/product/[slug]`  | Chi tiết + tabs Thành phần / Cách dùng / Lưu ý TPCN |
| `/cart`            | Giỏ hàng (Store API)                                |
| `/checkout`        | Handoff → WP checkout                               |
| `/account`         | Redirect → WP my-account                            |

API clients: `frontend/lib/woocommerce.ts`, `store-api.ts`, `sos-api.ts`

## WordPress backend

| Thành phần                         | Vai trò                                |
| ---------------------------------- | -------------------------------------- |
| `wp-content/plugins/sos-headless/` | CORS, REST endpoints, cart handoff     |
| `wp-content/themes/sos-beauty/`    | Checkout/account skin, hero customizer |

**REST endpoints:**

- `GET /wp-json/sos/v1/hero` — hero text từ Customizer
- `GET /wp-json/sos/v1/menus/primary` — navigation
- `POST /wp-json/sos/v1/checkout-handoff` — sync cart → WP session

Đổi text hero: **Giao diện → Tùy chỉnh → JP Bùi Đặng Hero**

## Production routing (nginx)

Cấu hình sẵn trong `nginx/conf.d/sos.conf`. Dùng `./scripts/mode.sh local` hoặc `tunnel` — script tự bật nginx.

| Path                          | Backend                      |
| ----------------------------- | ---------------------------- |
| `/*` (mặc định)               | Next.js storefront           |
| `/checkout`, `/my-account`    | WordPress (WooCommerce)      |
| `/wp-admin`, `/wp-login.php`  | WordPress admin              |
| `/wp-json/*`, `/wp-content/*` | WordPress REST & assets      |
| `/?wc-ajax=*`                 | WooCommerce AJAX → WordPress |

**Bare metal** (Next :3000, WP :8080): copy `nginx/conf.d/sos.local.conf.example` → `sos.local.conf`.

`sos.conf` dùng Docker DNS (`resolver 127.0.0.11` + `resolve` trên upstream) để sau khi restart WordPress/Next.js, `/wp-content/*` không còn 404 qua nginx :80.

## Cấu trúc repo

```
├── docker-compose.yml
├── .env.example
├── frontend/                       # Next.js storefront
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── Dockerfile
├── wp-content/
│   ├── themes/sos-beauty/
│   └── plugins/sos-headless/
├── scripts/
│   ├── setup.sh
│   └── plugins/
└── README.md
```

## Mở rộng sau này

- Tích hợp GHTK / GHN / Viettel Post (API vận chuyển)
- Webhook revalidation cho Next.js ISR
- Customer login trong Next.js (hiện redirect WP)
- Deploy production (nginx, SSL, backup tự động)

## Publish qua Cloudflare tunnel

Config tunnel: `~/.cloudflared/config.yml`

```yaml
ingress:
  - hostname: shop.yuchi-education.com
    service: http://localhost:80
  - service: http_status:404
```

```bash
./scripts/mode.sh tunnel
cloudflared tunnel run yuchi-local
```
