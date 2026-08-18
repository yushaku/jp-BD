# Phase 7 — Backup + Maintenance

> **Nơi thực hiện:** Plesk UI + SSH
> **Thời gian:** ~10 phút setup
> **Bắt buộc:** ⭕ Optional nhưng **rất nên làm**

---

## 7.1 Backup thủ công ngay sau deploy

```bash
ssh $MB_USER@$MB_HOST
cd ~/httpdocs

STAMP=$(date +%Y%m%d-%H%M)

# DB
wp db export ~/backups/db-$STAMP.sql
gzip ~/backups/db-$STAMP.sql

# Files (theme + uploads)
mkdir -p ~/backups
tar czf ~/backups/theme-$STAMP.tar.gz -C ~/httpdocs/wp-content/themes sos-beauty
tar czf ~/backups/uploads-$STAMP.tar.gz -C ~/httpdocs/wp-content uploads

ls -lh ~/backups/
```

**Download về Mac:**
```bash
mkdir -p ~/work/jp-hadang/backups
scp $MB_USER@$MB_HOST:~/backups/*.gz ~/work/jp-hadang/backups/
scp $MB_USER@$MB_HOST:~/backups/*.tar.gz ~/work/jp-hadang/backups/
```

> ⚠️ Thêm `backups/` vào `.gitignore` — không commit DB dump.

---

## 7.2 Plesk Backup Manager (tự động)

- [ ] Plesk → **Tools & Settings** → **Backup Manager**
- [ ] Click **Schedule**
- [ ] Cấu hình:

| Mục | Giá trị |
|-----|---------|
| Run | Daily |
| Time | `03:00` |
| Backup type | Incremental (hoặc Full nếu disk cho phép) |
| Keep backups | 7 |
| Store in | Server storage (hoặc FTP/Cloud nếu có) |
| Email notification | On error |

- [ ] Tick **Activate**

**Verify:** Chờ 1 ngày → Backup Manager thấy backup mới.

---

## 7.3 Script backup nhanh (tự viết)

Tạo `~/backup.sh` trên hosting:

```bash
cat > ~/backup.sh << 'EOF'
#!/usr/bin/env bash
set -eu
cd ~/httpdocs
STAMP=$(date +%Y%m%d-%H%M)
DIR=~/backups
mkdir -p "$DIR"

wp db export "$DIR/db-$STAMP.sql" --quiet
gzip -f "$DIR/db-$STAMP.sql"

tar czf "$DIR/uploads-$STAMP.tar.gz" -C ~/httpdocs/wp-content uploads 2>/dev/null

# Giữ 7 bản gần nhất
ls -t "$DIR"/db-*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f
ls -t "$DIR"/uploads-*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm -f

echo "[backup] Done: $STAMP"
du -sh "$DIR"
EOF

chmod +x ~/backup.sh
bash ~/backup.sh
```

### Cron (Plesk)

- [ ] Plesk → **Scheduled Tasks** → **Add Task**
- [ ] Task type: **Run a command**
- [ ] Command: `bash /home/<system_user>/backup.sh`
- [ ] Run: Daily at `03:00`
- [ ] Notify: on errors

---

## 7.4 Caching (tăng tốc)

### Plugin cache

```bash
cd ~/httpdocs

# Option 1: LiteSpeed Cache (nếu server dùng LiteSpeed)
wp plugin install litespeed-cache --activate

# Option 2: WP Super Cache
wp plugin install wp-super-cache --activate
wp option update wp_cache_enabled 1
```

### Object cache (nếu có Redis/Memcached)

```bash
# Check
php -m | grep -E "redis|memcached"

# Nếu có Redis
wp plugin install redis-cache --activate
wp redis enable
wp redis status
```

### Verify tốc độ sau cache

```bash
# Trước
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://jpbuidang.vn

# Sau (chạy 2 lần, lần 2 nên nhanh hơn)
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://jpbuidang.vn
```

---

## 7.5 Monitoring

### Uptime

- [ ] Tạo monitor tại [UptimeRobot](https://uptimerobot.com) (free 50 monitors)
- [ ] URL: `https://jpbuidang.vn`
- [ ] Interval: 5 phút
- [ ] Alert: email/Telegram

### Error log

```bash
# Xem log
tail -f ~/logs/error_log

# Hoặc bật WP debug log (chỉ khi cần debug)
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw
wp config set WP_DEBUG_DISPLAY false --raw
# → log ở wp-content/debug.log
# Nhớ tắt sau khi xong!
```

---

## 7.6 Update strategy

```bash
cd ~/httpdocs

# Check updates
wp core check-update
wp plugin list --update=available
wp theme list --update=available

# Update (sau khi backup!)
bash ~/backup.sh
wp core update
wp plugin update --all
wp language core update
wp db optimize
```

**Quy tắc:**
1. **Luôn backup trước update**
2. Update plugin từng cái, verify sau mỗi cái (nếu site quan trọng)
3. Theme `sos-beauty` là custom → update qua deploy lại từ Mac (Phase 2–3)

---

## 7.7 Deploy lại theme (khi có thay đổi)

```bash
# Từ Mac
cd ~/work/jp-hadang

# Chỉ theme, không ảnh
SKIP_PRODUCTS=1 bash scripts/pack-matbao.sh

# rsync trực tiếp (nhanh nhất)
rsync -avz --delete \
  --exclude '.DS_Store' \
  wp-content/themes/sos-beauty/ \
  $MB_USER@$MB_HOST:~/httpdocs/wp-content/themes/sos-beauty/

# Flush cache
ssh $MB_USER@$MB_HOST "cd ~/httpdocs && wp cache flush && wp rewrite flush --hard"
```

---

## ✅ Checklist Phase 7

- [ ] Backup thủ công đã tạo + download về Mac
- [ ] Plesk Backup Manager schedule daily
- [ ] `~/backup.sh` tạo + cron daily 03:00
- [ ] Cache plugin active
- [ ] TTFB < 1.5s
- [ ] UptimeRobot monitor active
- [ ] Biết cách deploy lại theme (rsync)

---

## 📋 Maintenance checklist định kỳ

### Hàng tuần
- [ ] Check uptime report
- [ ] Check error log
- [ ] Verify backup mới nhất tồn tại

### Hàng tháng
- [ ] Update WP core + plugins (sau backup)
- [ ] `wp db optimize`
- [ ] Check disk usage
- [ ] Review orders (nếu có bán thật)

### Hàng quý
- [ ] Test restore từ backup (quan trọng!)
- [ ] Review security (password, user list)
- [ ] Check SSL expiry (Let's Encrypt auto-renew nhưng nên verify)
