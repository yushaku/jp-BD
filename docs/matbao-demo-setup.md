# Setup demo website JP Bùi Đặng (`jpbuidang.vn`)

Theo [Đề xuất bản demo website JPBuiDang.md](./Đề%20xuất%20bản%20demo%20website%20JPBuiDang.md).  
Host: [matbao-hosting.md](./matbao-hosting.md).

## Cách khuyên dùng: seed CLI (giống local)

Không click wp-admin. Pack Mac → 1 upload → 1 lệnh terminal.

```bash
# Mac
cd /Users/nami/work/jp-hadang
bash scripts/pack-matbao.sh
# → dist/matbao-seed.zip  (theme + setup + seed-products + slim products/)
# SKIP_PRODUCTS=1 bash scripts/pack-matbao.sh  # chỉ theme+scripts
```

Plesk **Files**: upload `dist/matbao-seed.zip` vào home (`~` / vhost root).

SSH Terminal:

```bash
source ~/.bashrc
cd ~
unzip -o matbao-seed.zip -d matbao-seed
rsync -a matbao-seed/wp-content/themes/sos-beauty/ ~/httpdocs/wp-content/themes/sos-beauty/
cp matbao-seed/setup-matbao.sh matbao-seed/seed-products-from-folder.sh ~/
chmod +x ~/setup-matbao.sh ~/seed-products-from-folder.sh
mkdir -p ~/products
rsync -a matbao-seed/products/ ~/products/ 2>/dev/null || true
cd ~/httpdocs && bash ~/setup-matbao.sh
```

`setup-matbao.sh` (idempotent): activate `sos-beauty`, Woo VN/HN, category tree, trang+menu, SP demo, logo — rồi **tự seed ~20 SP từ `~/products`** nếu có folder + script.

Chạy seed riêng (sau khi đã setup, hoặc re-run an toàn):

```bash
cd ~/httpdocs
PRODUCTS_DIR=~/products bash ~/seed-products-from-folder.sh
```

Cùng script dùng local Docker:

```bash
docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/seed-products-from-folder.sh
```

Chi tiết từng mục thủ công (nếu cần) bên dưới — **ưu tiên seed trước**.

---

**Mỗi lần SSH Terminal mới:**

```bash
source ~/.bashrc
cd ~/httpdocs
wp core version   # phải 7.0.4, không báo PHP 7.2
```

Nếu lỗi PHP 7.2:

```bash
wp() { /opt/plesk/php/8.2/bin/php /usr/local/bin/wp "$@"; }
```

---

## Trạng thái đã xong (2026-08-16)

- [x] DNS `jpbuidang.vn` → `103.138.88.44`
- [x] PHP 8.2 (web)
- [x] WordPress 7.0.4 + SSL Let's Encrypt + HTTP→HTTPS
- [x] `siteurl` / `home` = `https://jpbuidang.vn`
- [x] Plugin: WooCommerce, Yoast, CF7, MoMo
- [x] Theme parent: Storefront 4.6.2
- [ ] Theme child `sos-beauty` ← chạy `setup-matbao.sh`
- [ ] Danh mục / trang / menu / sản phẩm ← cùng script

---

## A. Theme `sos-beauty` (bắt buộc trước nội dung)

Theme child chứa homepage (hero, danh mục, sản phẩm nổi bật) khớp mockup.

### A1. Zip trên Mac

```bash
cd /Users/nami/work/jp-hadang
zip -r sos-beauty-theme.zip wp-content/themes/sos-beauty \
  -x "*.DS_Store" -x "*/.git/*"
```

### A2. Upload lên host

**Cách 1 — Plesk Files**

1. Plesk → **Files** → `httpdocs/wp-content/themes/`
2. Upload `sos-beauty-theme.zip`
3. Terminal:

```bash
cd ~/httpdocs/wp-content/themes
unzip -o sos-beauty-theme.zip
# nếu zip tạo thư mục lồng: đảm bảo path = .../themes/sos-beauty/style.css
ls sos-beauty/style.css
cd ~/httpdocs
wp theme activate sos-beauty
wp cache flush
```

**Cách 2 — chỉ upload folder** `sos-beauty` vào `wp-content/themes/` rồi `wp theme activate sos-beauty`.

### A3. Trang chủ dùng front-page theme

```bash
cd ~/httpdocs
# tạo trang trống nếu chưa có
wp post list --post_type=page --fields=ID,post_title,post_name

# nếu chưa có trang-chu:
wp post create --post_type=page --post_title='Trang chủ' --post_name=trang-chu --post_status=publish --porcelain
wp option update show_on_front page
wp option update page_on_front $(wp post list --post_type=page --name=trang-chu --field=ID | head -1)
```

Settings → Reading → “A static page” → Front = **Trang chủ**.

---

## B. Danh mục sản phẩm (cây theo đề xuất)

Đề xuất: Mỹ phẩm (da / tóc / cơ thể) + Hàng tiêu dùng + Thực phẩm.  
Slug khớp theme `front-page.php`: `my-pham-nhat`, `hang-tieu-dung`, `thuc-pham-nhat`.

```bash
cd ~/httpdocs

# Root
wp term create product_cat 'Mỹ phẩm' --slug=my-pham-nhat
wp term create product_cat 'Hàng tiêu dùng' --slug=hang-tieu-dung
wp term create product_cat 'Thực phẩm' --slug=thuc-pham-nhat

# Lấy ID parent Mỹ phẩm
BEAUTY=$(wp term list product_cat --slug=my-pham-nhat --field=term_id | head -1)
GOODS=$(wp term list product_cat --slug=hang-tieu-dung --field=term_id | head -1)

# Chăm sóc da
SKIN=$(wp term create product_cat 'Chăm sóc da' --slug=cham-soc-da --parent=$BEAUTY --porcelain)
wp term create product_cat 'Toner, nước hoa hồng' --slug=toner --parent=$SKIN
wp term create product_cat 'Serum' --slug=serum --parent=$SKIN
wp term create product_cat 'Kem dưỡng' --slug=kem-duong --parent=$SKIN
wp term create product_cat 'Mặt nạ' --slug=mat-na --parent=$SKIN
wp term create product_cat 'Rửa mặt' --slug=rua-mat --parent=$SKIN
wp term create product_cat 'Tẩy trang' --slug=tay-trang --parent=$SKIN

# Chăm sóc tóc
HAIR=$(wp term create product_cat 'Chăm sóc tóc' --slug=cham-soc-toc --parent=$BEAUTY --porcelain)
wp term create product_cat 'Dầu gội' --slug=dau-goi --parent=$HAIR
wp term create product_cat 'Dầu xả' --slug=dau-xa --parent=$HAIR

# Cơ thể
BODY=$(wp term create product_cat 'Cơ thể' --slug=cham-soc-co-the --parent=$BEAUTY --porcelain)
wp term create product_cat 'Sữa tắm' --slug=sua-tam --parent=$BODY
wp term create product_cat 'Xà phòng' --slug=xa-phong --parent=$BODY
wp term create product_cat 'Chăm sóc răng miệng' --slug=cham-soc-rang-mieng --parent=$BODY

# TPCN dưới Hàng tiêu dùng (theme/setup local)
wp term create product_cat 'TPCN' --slug=tpcn --parent=$GOODS

wp term list product_cat --fields=term_id,name,slug,parent
```

Trùng slug → bỏ qua lỗi “already exists”, dùng `wp term list` kiểm tra.

---

## C. Trang nội dung (menu đề xuất)

Header đề xuất: **Trang chủ · Giới thiệu · Sản phẩm · Tin tức · Liên hệ**

### C1. Giới thiệu

```bash
ABOUT=$(wp post create --post_type=page --post_title='Giới thiệu' --post_name=gioi-thieu --post_status=publish --porcelain)
```

Nội dung ngắn (đề xuất § về chúng tôi) — Admin → Pages → Giới thiệu, paste:

> Công ty TNHH JP Bùi Đặng là doanh nghiệp chuyên nhập khẩu và phân phối các sản phẩm chính hãng từ Nhật Bản tại thị trường Việt Nam. Với hơn 15 năm kinh nghiệm trong ngành nhập khẩu và phân phối, đồng hành cùng các thương hiệu Nhật Bản trong các lĩnh vực mỹ phẩm, chăm sóc sức khỏe, làm đẹp và hàng tiêu dùng. Với cam kết mang đến sản phẩm chính hãng, chất lượng cao, JP Bùi Đặng không ngừng kết nối người tiêu dùng Việt Nam với tinh hoa tiêu dùng từ Nhật Bản.

Chi tiết dài: lấy từ Google Doc trong đề xuất → paste thêm vào trang (hoặc block thêm).

### C2. Liên hệ

```bash
CONTACT=$(wp post create --post_type=page --post_title='Liên hệ' --post_name=lien-he --post_status=publish --porcelain)
```

Nội dung (đề xuất):

```
CÔNG TY TNHH JP- BÙI ĐẶNG
Địa chỉ: Tầng 1, CT2, Mễ Trì Thượng, Nam Từ Liêm, Hà Nội
Fanpage: https://web.facebook.com/hangnhatchomoinha.vn
Liên hệ: 098 5561862 - 0965180859
Email: jpbuidangco.ltd@gmail.com
```

CF7: Contact → tạo form → shortcode dán vào trang Liên hệ.

Theme có `page-lien-he.php` nếu template name khớp — kiểm tra Page Attributes nếu cần.

### C3. Tin tức (blog)

```bash
# trang blog listing
BLOG=$(wp post create --post_type=page --post_title='Tin tức' --post_name=tin-tuc --post_status=publish --porcelain)
wp option update page_for_posts $BLOG

# 2–3 bài mẫu
wp post create --post_type=post --post_title='JP Bùi Đặng đồng hành cùng sản phẩm Nhật chính hãng' --post_status=publish --post_content='Nội dung demo tin tức.'
wp post create --post_type=post --post_title='Xu hướng chăm sóc da chuẩn Nhật' --post_status=publish --post_content='Nội dung demo tin tức.'
```

### C4. Trang phụ (footer)

```bash
wp post create --post_type=page --post_title='Chính sách đổi trả' --post_name=chinh-sach-doi-tra --post_status=publish \
  --post_content='Khách hàng có thể đổi/trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem, nhãn và chưa qua sử dụng.'
wp post create --post_type=page --post_title='Chính sách giao hàng' --post_name=chinh-sach-giao-hang --post_status=publish \
  --post_content='Giao hàng toàn quốc. Nội thành HN/HCM: 2-3 ngày. Tỉnh khác: 3-7 ngày làm việc.'
wp post create --post_type=page --post_title='Chính sách bảo mật' --post_name=chinh-sach-bao-mat --post_status=publish \
  --post_content='Chúng tôi cam kết bảo mật thông tin cá nhân khách hàng.'
wp post create --post_type=page --post_title='Hướng dẫn mua hàng' --post_name=huong-dan-mua-hang --post_status=publish \
  --post_content='1. Chọn sản phẩm. 2. Giỏ hàng. 3. Thông tin giao hàng. 4. Thanh toán COD/CK/MoMo. 5. Xác nhận đơn.'
```

### C5. Menu chính

```bash
MENU=$(wp menu create 'Main Menu' --porcelain)
FRONT=$(wp post list --post_type=page --name=trang-chu --field=ID | head -1)
SHOP=$(wp option get woocommerce_shop_page_id)
ABOUT=$(wp post list --post_type=page --name=gioi-thieu --field=ID | head -1)
BLOG=$(wp post list --post_type=page --name=tin-tuc --field=ID | head -1)
CONTACT=$(wp post list --post_type=page --name=lien-he --field=ID | head -1)

wp menu item add-post $MENU $FRONT --title='Trang chủ'
wp menu item add-post $MENU $SHOP --title='Sản phẩm'
wp menu item add-post $MENU $ABOUT --title='Giới thiệu'
wp menu item add-post $MENU $BLOG --title='Tin tức'
wp menu item add-post $MENU $CONTACT --title='Liên hệ'

wp menu location assign $MENU primary
wp menu location assign $MENU handheld
```

Appearance → Menus: kiểm tra thứ tự khớp mockup.

---

## D. Sản phẩm nổi bật + ảnh

Nguồn ảnh đề xuất: [Google Drive folder](https://drive.google.com/drive/folders/1RWAw03saROUU2BIJGxEAf_JdsKSSgMOS).  
Local repo cũng có thư mục `products/` (JPG đã chụp).

### D1. Thuộc tính thương hiệu (optional, theme hiện brand)

```bash
wp wc product_attribute create --name='Thương hiệu' --slug=thuong-hieu --type=select --has_archives=true --user=1
```

### D2. Tạo SP (Admin nhanh hơn CLI cho ảnh)

WooCommerce → Products → Add:

1. Tên + giá VND (số nguyên, vd. `350000`)
2. Danh mục đúng nhánh (Serum, Mặt nạ, …)
3. Ảnh đại diện từ Drive / `products/…/final/`
4. Gắn 1–2 SP vào nhiều danh mục nếu cần hiện “nổi bật”
5. Published

**Tối thiểu demo:** ≥ 6 SP (3 mỹ phẩm + 2 tiêu dùng/TPCN + 1 thực phẩm) để homepage shortcode có hàng.

CLI mẫu (không ảnh):

```bash
wp wc product create --name='Serum demo Nhật' --type=simple --regular_price=450000 --user=1 --status=publish
# rồi Admin gán category + ảnh
```

### D3. Xóa nội dung mặc định

```bash
wp post delete $(wp post list --post_type=post --name=hello-world --field=ID) --force
wp post delete $(wp post list --post_type=page --name=sample-page --field=ID) --force 2>/dev/null
```

---

## E. Brand partners (mockup image-04)

Đề xuất logo + link:

| Brand | Link chính |
|-------|------------|
| Fractional CC | https://fractionalcc.jp/ |
| Fru:C | https://www.fru-c.com/vision.html |
| MAX | https://www.soapmax.co.jp |
| Kor Japan | https://www.kor-japan.co.jp/en/ |
| Japangals | https://japangals.jp/ |
| Kumano | https://www.kumanoyushi.co.jp/en/products/index.html |

Theme hiện tại **chưa** có block brand riêng trên `front-page.php`. Cách demo:

1. **Tạm:** trang Giới thiệu / block HTML logo + `<a href=…>`  
2. **Hoặc** thêm section brand vào theme (dev sau)

Logo: lấy từ site brand hoặc Drive — upload Media Library.

---

## F. Testimonials (mockup image-05)

3 đoạn trong đề xuất (khách lẻ / mỹ phẩm / đại lý).

Cách demo nhanh:

- Page Giới thiệu: Heading + 3 quote blocks  
- Hoặc Custom HTML trên trang chủ (widget / block)  

Nội dung copy nguyên từ đề xuất § Khách hàng 1–2 + Đại lý.

---

## G. WooCommerce vận hành VN

```bash
cd ~/httpdocs
wp wc tool run install_pages --user=1
wp option update woocommerce_default_country 'VN:HN'
wp option update woocommerce_store_address 'Tầng 1, CT2, Mễ Trì Thượng'
wp option update woocommerce_store_city 'Hà Nội'
wp option update woocommerce_currency 'VND'
wp option update woocommerce_currency_pos 'right_space'
wp option update woocommerce_price_thousand_sep '.'
wp option update woocommerce_price_decimal_sep ','
wp option update woocommerce_price_num_decimals '0'
wp option update woocommerce_coming_soon 'no'
wp option update timezone_string 'Asia/Ho_Chi_Minh'
wp option update blogname 'JP Bùi Đặng'
```

Admin → WooCommerce → Settings:

| Tab | Làm |
|-----|-----|
| General | Địa chỉ HN như trên |
| Products | Đơn vị kg/cm |
| Shipping | Zone Vietnam · flat + free |
| Payments | Bật **COD** + **BACS** (CK) · MoMo điền key sandbox/live |
| Accounts | Cho phép checkout khách |

MoMo: WooCommerce → Payments → MoMo → Partner/Access/Secret (lấy từ MoMo business).

VNPay (optional): zip từ VNPay → Plugins → Upload.

---

## H. Yoast / footer / liên hệ nhanh

1. Yoast → cấu hình wizard: tên **JP Bùi Đặng**, org  
2. Appearance → Customize: logo (nếu có), màu theo theme  
3. Footer: Appearance hoặc nội dung `site-footer` — SĐT / email / địa chỉ đề xuất  
4. Float contact (theme): kiểm tra số trong `template-parts/float-contact.php` khớp `098 5561862`

---

## I. Kiểm tra demo (checklist)

Mở `https://jpbuidang.vn` (ổ khóa SSL):

| # | Check | Mockup |
|---|--------|--------|
| 1 | Menu: Trang chủ, Giới thiệu, Sản phẩm, Tin tức, Liên hệ | image-01 |
| 2 | Hero / banner trang chủ | image-02 |
| 3 | Về chúng tôi / trust (theme có block trust) | image-03 |
| 4 | Sản phẩm nổi bật có ảnh + giá VND | Drive |
| 5 | Brand logos + link (nếu đã làm §E) | image-04 |
| 6 | Testimonials | image-05 |
| 7 | Trang Giới thiệu đủ nội dung | image-07 + Doc |
| 8 | Shop + cây danh mục Mỹ phẩm… | image-08 |
| 9 | Tin tức list bài | image-09 |
| 10 | Liên hệ đủ SĐT/địa chỉ/form | image-10 |
| 11 | Add to cart → Checkout COD | — |
| 12 | Mobile OK | — |

---

## J. Thứ tự làm thực tế (khuyến nghị)

1. **A** Upload + activate `sos-beauty`  
2. **B** Category tree  
3. **G** Woo VN options  
4. **C** Pages + menu  
5. **D** 6+ sản phẩm + ảnh  
6. **F** Testimonials trên Giới thiệu  
7. **E** Brands (HTML hoặc theme)  
8. **H** + **I** polish + test order  

---

## K. Backup trước khi sửa lớn

Plesk → Backup & Restore → backup domain.  
Hoặc:

```bash
wp db export ~/backup-$(date +%Y%m%d).sql
```
