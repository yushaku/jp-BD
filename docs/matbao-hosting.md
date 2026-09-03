# Hosting Express Mắt Bão — thông tin

Reference production: **Plesk Obsidian**.
Xem việc còn lại: [matbao-todo.md](./matbao-todo.md)

---

## Tài khoản & path

### Active — `jpbuidang.vn` (setup mới)

| Mục           | Giá trị                                 |
| ------------- | --------------------------------------- |
| Domain        | `jpbuidang.vn`                          |
| Panel         | `https://s88d44.cloudnetwork.vn:8443/`  |
| Document root | `httpdocs`                              |
| Disk (fresh)  | ~0.3 MB — chưa có WP                    |
| PHP panel     | đang **7.4.33** → đổi **8.2**           |
| System user   | _điền từ Connection Info / SSH_         |
| DNS A / IP    | **`103.138.88.44`** ✅ (DNS live + Let's Encrypt OK) |

### Paused — `hangnhatchomoinha.vn` (vhost hỏng)

| Mục         | Giá trị                                 |
| ----------- | --------------------------------------- |
| Domain      | `hangnhatchomoinha.vn`                  |
| Panel       | `https://sg-pl10.cloudnetwork.vn:8443/` |
| System user | `han01938`                              |
| DNS A       | `112.78.2.14`                           |
| WP          | 7.0.4 trong httpdocs — public 404       |

id.matbao.net → Cloud Hosting → **Bảng điều khiển**.

Docs Mắt Bão:

- [Control panel](https://wiki.matbao.net/kb/huong-dan-truy-cap-vao-control-panel-tren-trang-quan-ly-dich-vu-khach-hang/)
- [Upload site](https://wiki.matbao.net/kb/huong-dan-upload-va-cau-hinh-website-len-cloud-linux-hosting/)

## Shell

### Terminal web Plesk

`https://sg-pl10.cloudnetwork.vn:8443/modules/ssh-terminal/?dom_id=…&site_id=…`

- Shell trong browser; Cursor **không** gắn được
- Shell type: chroot (`chrootsh`)

### SSH từ Mac

- User: `han01938@sg-pl10.cloudnetwork.vn`
- Port 22 (và 2222): Mac **treo ở Connecting** → port SSH ngoài có vẻ **đóng**; cần ticket Mắt Bão mở SSH
- Key Mac sẵn: `~/.ssh/id_ed25519.pub` — sau khi mở port, thêm vào `~/.ssh/authorized_keys` trên host

```bash
# Mac — test
ssh -v han01938@sg-pl10.cloudnetwork.vn
# hoặc IP Plesk nếu hostname khác
```

## PHP & WP-CLI (jpbuidang / s88d44)

| Mục        | Giá trị |
| ---------- | ------- |
| System user | `jpb36793` |
| Default `php` shell | ~7.2 — **không dùng** |
| PHP dùng   | `/opt/plesk/php/8.2/bin/php` |
| WP-CLI     | `~/httpdocs/wp-cli.phar` (không dùng `/usr/local/bin/wp` — WP Toolkit gãy) |
| `~/.bashrc` | `wp() { /opt/plesk/php/8.2/bin/php "$HOME/httpdocs/wp-cli.phar" "$@"; }` |

```bash
source ~/.bashrc
cd ~/httpdocs
wp core version
```

Nếu chưa có phar:

```bash
curl -sL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o ~/httpdocs/wp-cli.phar
chmod +x ~/httpdocs/wp-cli.phar
echo 'wp() { /opt/plesk/php/8.2/bin/php "$HOME/httpdocs/wp-cli.phar" "$@"; }' >> ~/.bashrc
source ~/.bashrc
```

---

## PHP & WP-CLI (hangnhatchomoinha / sg-pl10 — paused)

---

## Stack hiện tại trên host

### Plugin

| Plugin                                | Status   | Version      |
| ------------------------------------- | -------- | ------------ |
| woocommerce                           | active   | 11.0.1       |
| wordpress-seo                         | active   | 28.2         |
| contact-form-7                        | active   | 6.1.6        |
| payment-gateway-mo-mo-for-woocommerce | active   | 1.0.1        |
| akismet                               | inactive | 5.7          |
| hello                                 | đã xóa   | —            |
| VNPay                                 | chưa     | zip thủ công |

### Theme

| Theme      | Status             |
| ---------- | ------------------ |
| storefront | active 4.6.2       |
| sos-beauty | **chưa upload**    |
| twenty\*   | inactive (default) |

Parent cần: **Storefront**. Child: zip local `sos-beauty-theme.zip` (repo root khi build).

---

## Plugin ecommerce (tham chiếu)

### Bắt buộc (setup.sh)

| Plugin         | Slug / nguồn                                                          |
| -------------- | --------------------------------------------------------------------- |
| WooCommerce    | `woocommerce`                                                         |
| Yoast SEO      | `wordpress-seo`                                                       |
| Contact Form 7 | `contact-form-7`                                                      |
| MoMo           | `payment-gateway-mo-mo-for-woocommerce`                               |
| VNPay          | [zip VNPay](https://sandbox.vnpayment.vn/apis/docs/open/woocommerce/) |

Built-in Woo: **COD**, **BACS** (chuyển khoản).

### Nên có production VN

Địa chỉ VN checkout · GHTK/GHN/Viettel · WP Mail SMTP · Wordfence · LiteSpeed Cache · Imagify/ShortPixel · UpdraftPlus

### Tùy chọn sau demo

Email marketing · Reviews · Polylang/WPML · Chat · Wholesale B2B

---

## Agent / Cursor

| Cách                | Agent?                    |
| ------------------- | ------------------------- |
| SSH + WP-CLI        | Có — khi port 22 mở + key |
| Plesk terminal web  | Không — user paste lệnh   |
| SFTP / File Manager | Upload tay                |
| `scripts/setup.sh`  | Chỉ Docker local          |

---

## Local vs production

| Local               | Production                     |
| ------------------- | ------------------------------ |
| `docker compose up` | Plesk + WP Toolkit / wp-cli    |
| `setup.sh`          | Lệnh WP-CLI từng phần          |
| `localhost:8080`    | `https://hangnhatchomoinha.vn` |

Chi tiết Docker: [README.md](../README.md)
