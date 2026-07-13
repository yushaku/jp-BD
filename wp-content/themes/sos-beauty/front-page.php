<?php
/**
 * Front page — thực phẩm, mỹ phẩm & TPCN Nhật Bản.
 */

get_header();

$eyebrow  = get_theme_mod( 'sos_beauty_hero_eyebrow', 'JP Bùi Đặng' );
$title    = get_theme_mod( 'sos_beauty_hero_title', 'Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản' );
$subtitle = get_theme_mod( 'sos_beauty_hero_subtitle', 'Nguồn hàng Nhật Bản uy tín — thực phẩm tươi lành, J-Beauty và thực phẩm bổ sung an toàn.' );
$cta      = get_theme_mod( 'sos_beauty_hero_cta', 'Khám phá ngay' );
$shop_url = wc_get_page_permalink( 'shop' );

$categories = array(
	array(
		'slug'  => 'thuc-pham-nhat',
		'kanji' => '食',
		'label' => 'Thực phẩm Nhật',
		'desc'  => 'Matcha, miso, snack',
		'class' => 'beauty-categories__item--food',
	),
	array(
		'slug'  => 'my-pham-nhat',
		'kanji' => '美',
		'label' => 'Mỹ phẩm',
		'desc'  => 'Skincare, makeup',
		'class' => 'beauty-categories__item--beauty',
	),
	array(
		'slug'  => 'tpcn',
		'kanji' => '健',
		'label' => 'TPCN',
		'desc'  => 'Vitamin, collagen',
		'class' => 'beauty-categories__item--supplement',
	),
);
?>

<section class="beauty-hero">
	<p class="beauty-hero__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
	<h1 class="beauty-hero__title"><?php echo esc_html( $title ); ?></h1>
	<p class="beauty-hero__subtitle"><?php echo esc_html( $subtitle ); ?></p>
	<a class="beauty-hero__cta" href="<?php echo esc_url( $shop_url ); ?>"><?php echo esc_html( $cta ); ?></a>
	<span class="beauty-hero__badge"><? esc_html_e( 'Chính hãng · Nhập khẩu Nhật Bản', 'sos-beauty' ); ?></span>
</section>

<nav class="beauty-categories" aria-label="<? esc_attr_e( 'Danh mục sản phẩm', 'sos-beauty' ); ?>">
	<?php foreach ( $categories as $cat ) : ?>
		<a class="beauty-categories__item <?php echo esc_attr( $cat['class'] ); ?>" href="<?php echo esc_url( sos_beauty_category_link( $cat['slug'] ) ); ?>">
			<span class="beauty-categories__kanji" aria-hidden="true"><?php echo esc_html( $cat['kanji'] ); ?></span>
			<span class="beauty-categories__label"><?php echo esc_html( $cat['label'] ); ?></span>
			<span class="beauty-categories__desc"><?php echo esc_html( $cat['desc'] ); ?></span>
		</a>
	<?php endforeach; ?>
</nav>

<section class="beauty-section">
	<header class="beauty-section__header">
		<h2 class="beauty-section__title"><? esc_html_e( 'Sản phẩm nổi bật', 'sos-beauty' ); ?></h2>
		<p class="beauty-section__desc"><? esc_html_e( 'Được khách hàng tin chọn', 'sos-beauty' ); ?></p>
	</header>
	<?php echo do_shortcode( '[products limit="8" columns="4" orderby="popularity"]' ); ?>
</section>

<section class="beauty-section beauty-section--food">
	<header class="beauty-section__header">
		<h2 class="beauty-section__title"><? esc_html_e( 'Thực phẩm Nhật', 'sos-beauty' ); ?></h2>
		<p class="beauty-section__desc"><? esc_html_e( 'Matcha, miso, gạo & đặc sản', 'sos-beauty' ); ?></p>
	</header>
	<?php echo do_shortcode( '[product_category category="thuc-pham-nhat" limit="4" columns="4"]' ); ?>
</section>

<section class="beauty-section beauty-section--beauty">
	<header class="beauty-section__header">
		<h2 class="beauty-section__title"><? esc_html_e( 'Mỹ phẩm Nhật', 'sos-beauty' ); ?></h2>
		<p class="beauty-section__desc"><? esc_html_e( 'Skincare & trang điểm J-Beauty', 'sos-beauty' ); ?></p>
	</header>
	<?php echo do_shortcode( '[product_category category="my-pham-nhat" limit="4" columns="4"]' ); ?>
</section>

<section class="beauty-section beauty-section--supplement">
	<header class="beauty-section__header">
		<h2 class="beauty-section__title"><? esc_html_e( 'Thực phẩm chức năng', 'sos-beauty' ); ?></h2>
		<p class="beauty-section__desc"><? esc_html_e( 'Vitamin, collagen & bổ sung dinh dưỡng', 'sos-beauty' ); ?></p>
	</header>
	<?php echo do_shortcode( '[product_category category="tpcn" limit="4" columns="4"]' ); ?>
</section>

<section class="beauty-trust">
	<div class="beauty-trust__item">
		<strong><? esc_html_e( 'Nhập khẩu Nhật Bản', 'sos-beauty' ); ?></strong>
		<span><? esc_html_e( 'Nguồn gốc rõ ràng, tem phủ đầy đủ', 'sos-beauty' ); ?></span>
	</div>
	<div class="beauty-trust__item">
		<strong><? esc_html_e( '100% chính hãng', 'sos-beauty' ); ?></strong>
		<span><? esc_html_e( 'Cam kết hàng authentic', 'sos-beauty' ); ?></span>
	</div>
	<div class="beauty-trust__item">
		<strong><? esc_html_e( 'Tư vấn tận tâm', 'sos-beauty' ); ?></strong>
		<span><? esc_html_e( 'Hỗ trợ chọn sản phẩm phù hợp', 'sos-beauty' ); ?></span>
	</div>
	<div class="beauty-trust__item">
		<strong><? esc_html_e( 'Giao nhanh toàn quốc', 'sos-beauty' ); ?></strong>
		<span><? esc_html_e( 'HCM/HN 2–3 ngày', 'sos-beauty' ); ?></span>
	</div>
</section>

<p class="beauty-disclaimer">
	<? esc_html_e( 'Thực phẩm chức năng không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh. Đọc kỹ hướng dẫn trước khi sử dụng.', 'sos-beauty' ); ?>
</p>

<?php
get_footer();
