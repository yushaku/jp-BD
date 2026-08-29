# Deploy Plan — JPBuiDang lên Mắt Bão (Plesk)

> Kế hoạch deploy theme + seed data lên hosting Mắt Bão.
> Thông tin hosting: [matbao-hosting.md](./matbao-hosting.md) · TODO: [matbao-todo.md](./matbao-todo.md)

---

## 📌 Thông tin

| Mục           | Giá trị                                |
| ------------- | -------------------------------------- |
| Domain        | `jpbuidang.vn`                         |
| Panel         | `https://s88d44.cloudnetwork.vn:8443/` |
| IP            | `103.138.88.44` (DNS đã OK ✅)         |
| Document root | `httpdocs`                             |
| PHP hiện tại  | 7.4.33 → **cần đổi 8.2**               |
| System user   | _lấy từ Plesk → Connection Info_       |

---

## 🗺️ Tổng quan flow

```
PHASE 0: Chuẩn bị hosting (Plesk UI)
   ↓
PHASE 1: Install WordPress (Plesk UI)
   ↓
PHASE 2: Pack bundle trên Mac
   ↓
PHASE 3: Upload lên hosting
   ↓
PHASE 4: Chạy setup script (SSH)
   ↓
PHASE 5: Seed products (SSH)
   ↓
PHASE 6: SSL + Verify
   ↓
PHASE 7: Backup
```

**Thời gian dự kiến:** 60–90 phút (lần đầu)

---

## 📂 Chi tiết từng phase

| Phase                | File                                            | Bắt buộc    |
| -------------------- | ----------------------------------------------- | ----------- |
| 0. Chuẩn bị hosting  | [phase-0](./matbao-deploy/phase-0-hosting.md)   | ✅          |
| 1. Install WordPress | [phase-1](./matbao-deploy/phase-1-wordpress.md) | ✅          |
| 2. Pack bundle       | [phase-2](./matbao-deploy/phase-2-pack.md)      | ✅          |
| 3. Upload            | [phase-3](./matbao-deploy/phase-3-upload.md)    | ✅          |
| 4. Setup site        | [phase-4](./matbao-deploy/phase-4-setup.md)     | ✅          |
| 5. Seed products     | [phase-5](./matbao-deploy/phase-5-seed.md)      | ✅          |
| 6. SSL + Verify      | [phase-6](./matbao-deploy/phase-6-verify.md)    | ✅          |
| 7. Backup            | [phase-7](./matbao-deploy/phase-7-backup.md)    | ⭕ Optional |

---

## ⚡ Không có SSH? → Dùng Web Terminal

SSH port 22/2222 của Mắt Bão **đang đóng** (đã test 2026-08-18).
👉 **[Runbook Plesk Web Terminal](./matbao-deploy/web-terminal-runbook.md)** — 10 BLOCK copy-paste, không cần SSH.

Muốn có SSH thật? Mở ticket tại `id.matbao.net` → Hỗ trợ, xin mở port 22 + whitelist IP.

---

## 🛠️ Scripts liên quan

| Script                                 | Chạy ở đâu      | Làm gì                                                                    |
| -------------------------------------- | --------------- | ------------------------------------------------------------------------- |
| `scripts/pack-matbao.sh`               | **Mac**         | Đóng gói theme + scripts + ảnh (slim ≤3 ảnh/SP) → `dist/matbao-seed.zip`  |
| `scripts/setup-matbao.sh`              | **Hosting SSH** | Install Woo + activate theme + config VND + tạo pages + menu + categories |
| `scripts/seed-products-from-folder.sh` | **Hosting SSH** | Scan `products/` → tạo WooCommerce products + import ảnh                  |

---

## ⚠️ Lưu ý quan trọng

1. **PHP 8.2 bắt buộc** — theme dùng syntax mới, WP 6.x + Woo 9.x cần PHP ≥ 8.0
2. **wp-cli path trên Plesk**: `/opt/plesk/php/8.2/bin/php /usr/local/bin/wp`
3. **Scripts idempotent** — chạy lại an toàn, skip cái đã tồn tại
4. **Ảnh products**: full folder ~700MB → chỉ pack slim (≤3 ảnh/SP, ~50MB)
5. **Chroot shell** — Plesk dùng `chrootsh`, một số command bị giới hạn
6. **Backup trước khi deploy lại** — nếu site đã có data thật

---

## 🚨 Rollback nhanh

```bash
# SSH vào hosting
cd ~/httpdocs

# Rollback theme
wp theme activate storefront

# Xóa hết products (nếu seed sai)
wp post list --post_type=product --format=ids | xargs -r wp post delete --force

# Restore DB từ backup
wp db import ~/backup-YYYYMMDD.sql
```

---

## ✅ Definition of Done

- [x] `https://jpbuidang.vn` load được, HTTPS xanh
- [ ] Theme `sos-beauty` active
- [ ] WooCommerce active, currency VND
- [ ] ≥40 products có ảnh
- [ ] Categories tree đúng (Mỹ phẩm / Hàng tiêu dùng / Thực phẩm)
- [ ] Menu chính hoạt động
- [ ] Pages: Trang chủ, Giới thiệu, Liên hệ, Shop
- [ ] Single product page UI mới
- [ ] Blog detail UI mới
- [ ] Mobile responsive OK
- [ ] Backup đã tạo
