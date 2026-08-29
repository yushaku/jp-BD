<?php
/**
 * Front page — thực phẩm, mỹ phẩm & TPCN Nhật Bản.
 */

get_header();
?>

<?php get_template_part( 'template-parts/hero-banner' ); ?>

<?php
$shop_url = wc_get_page_permalink( 'shop' );

$categories = array(
	array(
		'slug'  => 'my-pham-nhat',
		'kanji' => '美',
		'label' => 'Mỹ phẩm',
		'desc'  => 'Skincare, tóc, body',
		'class' => 'beauty-categories__item--beauty',
		'image' => sos_beauty_home_image_url( 'sos_beauty_category_beauty_image', 'category-collection.jpg' ),
	),
	array(
		'slug'  => 'hang-tieu-dung',
		'kanji' => '品',
		'label' => 'Hàng tiêu dùng',
		'desc'  => 'TPCN & daily care',
		'class' => 'beauty-categories__item--supplement',
		'image' => sos_beauty_home_image_url( 'sos_beauty_category_supplement_image', 'category-collagen.jpg' ),
	),
	array(
		'slug'  => 'thuc-pham-nhat',
		'kanji' => '食',
		'label' => 'Thực phẩm',
		'desc'  => 'Matcha, miso, snack',
		'class' => 'beauty-categories__item--food',
		'image' => sos_beauty_home_image_url( 'sos_beauty_category_food_image', 'promo-drinks.jpg' ),
	),
);

$sections = array(
	array(
		'class'       => '',
		'eyebrow'     => __( 'Bán chạy nhất', 'sos-beauty' ),
		'title'       => __( 'Sản phẩm nổi bật', 'sos-beauty' ),
		'desc'        => __( 'Được khách hàng tin chọn', 'sos-beauty' ),
		'more_url'    => $shop_url,
		'shortcode'   => '[products limit="8" columns="4" orderby="popularity"]',
	),
	array(
		'class'       => 'beauty-section--beauty',
		'eyebrow'     => __( 'J-Beauty', 'sos-beauty' ),
		'title'       => __( 'Mỹ phẩm', 'sos-beauty' ),
		'desc'        => __( 'Skincare, tóc & chăm sóc cơ thể', 'sos-beauty' ),
		'more_url'    => sos_beauty_category_link( 'my-pham-nhat' ),
		'shortcode'   => '[product_category category="my-pham-nhat" limit="8" columns="4"]',
	),
	array(
		'class'       => 'beauty-section--supplement',
		'eyebrow'     => __( 'Daily care', 'sos-beauty' ),
		'title'       => __( 'Hàng tiêu dùng', 'sos-beauty' ),
		'desc'        => __( 'TPCN & sản phẩm dùng hàng ngày', 'sos-beauty' ),
		'more_url'    => sos_beauty_category_link( 'hang-tieu-dung' ),
		'shortcode'   => '[product_category category="hang-tieu-dung" limit="8" columns="4"]',
	),
	array(
		'class'       => 'beauty-section--food',
		'eyebrow'     => __( 'Ẩm thực Nhật', 'sos-beauty' ),
		'title'       => __( 'Thực phẩm', 'sos-beauty' ),
		'desc'        => __( 'Matcha, miso, gạo & đặc sản', 'sos-beauty' ),
		'more_url'    => sos_beauty_category_link( 'thuc-pham-nhat' ),
		'shortcode'   => '[product_category category="thuc-pham-nhat" limit="8" columns="4"]',
	),
);

$trust_items = array(
	array(
		'icon' => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18h18"/><path d="M5 18V8l7-4 7 4v10"/><path d="M9 18v-4h6v4"/><circle cx="12" cy="10" r="1.25"/></svg>',
		'title' => __( 'Nhập khẩu Nhật Bản', 'sos-beauty' ),
		'desc'  => __( 'Nguồn gốc rõ ràng, tem phủ đầy đủ', 'sos-beauty' ),
	),
	array(
		'icon' => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
		'title' => __( '100% chính hãng', 'sos-beauty' ),
		'desc'  => __( 'Cam kết hàng authentic', 'sos-beauty' ),
	),
	array(
		'icon' => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
		'title' => __( 'Tư vấn tận tâm', 'sos-beauty' ),
		'desc'  => __( 'Hỗ trợ chọn sản phẩm phù hợp', 'sos-beauty' ),
	),
	array(
		'icon' => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 17h2.5"/><path d="M14 17h6l-1.5-4.5H14V7h3l3 5.5V17"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/><path d="M1 12V7h10v10H8.5"/></svg>',
		'title' => __( 'Giao nhanh toàn quốc', 'sos-beauty' ),
		'desc'  => __( 'HCM/HN 2–3 ngày', 'sos-beauty' ),
	),
);
?>

<?php get_template_part( 'template-parts/promo-hero' ); ?>

<nav class="beauty-categories" aria-label="<? esc_attr_e( 'Danh mục sản phẩm', 'sos-beauty' ); ?>">
	<?php foreach ( $categories as $cat ) : ?>
		<a class="beauty-categories__item <?php echo esc_attr( $cat['class'] ); ?>" href="<?php echo esc_url( sos_beauty_category_link( $cat['slug'] ) ); ?>">
			<span class="beauty-categories__bg" aria-hidden="true"<?php echo $cat['image'] ? ' style="background-image:url(' . esc_url( $cat['image'] ) . ')"' : ''; ?>></span>
			<span class="beauty-categories__kanji" aria-hidden="true"><?php echo esc_html( $cat['kanji'] ); ?></span>
			<span class="beauty-categories__content">
				<span class="beauty-categories__label"><?php echo esc_html( $cat['label'] ); ?></span>
				<span class="beauty-categories__desc"><?php echo esc_html( $cat['desc'] ); ?></span>
			</span>
		</a>
	<?php endforeach; ?>
</nav>

<?php
$exclusive_has_products = (bool) get_posts(
	array(
		'post_type'      => 'product',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_key'       => '_sos_exclusive',
		'meta_value'     => 'yes',
	)
);
$exclusive_banner_on = (bool) get_theme_mod( 'sos_beauty_exclusive_banner_show', true );
?>

<?php if ( $exclusive_banner_on || $exclusive_has_products ) : ?>
	<section id="beauty-exclusive" class="beauty-section beauty-section--exclusive">
		<header class="beauty-section__header">
			<div class="beauty-section__heading">
				<p class="beauty-section__eyebrow"><?php esc_html_e( 'Chỉ có tại JP', 'sos-beauty' ); ?></p>
				<h2 class="beauty-section__title"><?php esc_html_e( 'Sản phẩm độc quyền', 'sos-beauty' ); ?></h2>
			</div>
			<?php if ( $exclusive_has_products ) : ?>
				<a class="beauty-section__more" href="<?php echo esc_url( $shop_url ); ?>"><?php esc_html_e( 'Xem tất cả', 'sos-beauty' ); ?></a>
			<?php endif; ?>
		</header>

		<?php get_template_part( 'template-parts/exclusive-banner' ); ?>

		<?php if ( $exclusive_has_products ) : ?>
			<div class="beauty-section__body">
				<div class="beauty-section__products">
					<?php echo do_shortcode( '[products limit="8" columns="4" exclusive="yes" orderby="date"]' ); ?>
				</div>
			</div>
		<?php endif; ?>
	</section>
<?php endif; ?>

<?php foreach ( $sections as $section ) : ?>
	<section class="beauty-section <?php echo esc_attr( $section['class'] ); ?>">
		<header class="beauty-section__header">
			<div class="beauty-section__heading">
				<p class="beauty-section__eyebrow"><?php echo esc_html( $section['eyebrow'] ); ?></p>
				<h2 class="beauty-section__title"><?php echo esc_html( $section['title'] ); ?></h2>
			</div>
			<a class="beauty-section__more" href="<?php echo esc_url( $section['more_url'] ); ?>"><? esc_html_e( 'Xem tất cả', 'sos-beauty' ); ?></a>
		</header>
		<div class="beauty-section__body">
			<div class="beauty-section__products">
				<?php echo do_shortcode( $section['shortcode'] ); ?>
			</div>
		</div>
	</section>
<?php endforeach; ?>

<section class="beauty-trust" aria-labelledby="beauty-trust-heading">
	<header class="beauty-trust__header">
		<p class="beauty-trust__eyebrow"><?php esc_html_e( 'Vì sao chọn chúng tôi', 'sos-beauty' ); ?></p>
		<h2 id="beauty-trust-heading" class="beauty-trust__heading"><?php esc_html_e( 'Mua an tâm từ Nhật Bản', 'sos-beauty' ); ?></h2>
	</header>
	<ul class="beauty-trust__grid">
		<?php foreach ( $trust_items as $index => $item ) : ?>
			<li class="beauty-trust__item" style="--trust-i: <?php echo (int) $index; ?>">
				<span class="beauty-trust__icon" aria-hidden="true"><?php echo $item['icon']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inline SVG ?></span>
				<strong class="beauty-trust__title"><?php echo esc_html( $item['title'] ); ?></strong>
				<span class="beauty-trust__desc"><?php echo esc_html( $item['desc'] ); ?></span>
			</li>
		<?php endforeach; ?>
	</ul>
</section>

<?php
$news_query = new WP_Query(
	array(
		'post_type'           => 'post',
		'posts_per_page'      => 3,
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	)
);
$blog_id  = (int) get_option( 'page_for_posts' );
$news_url = $blog_id ? get_permalink( $blog_id ) : home_url( '/tin-tuc/' );
if ( $news_query->have_posts() ) :
	?>
<section class="beauty-home-news" aria-labelledby="beauty-home-news-heading">
	<header class="beauty-section__header">
		<div class="beauty-section__heading">
			<p class="beauty-section__eyebrow"><?php esc_html_e( 'Tin tức', 'sos-beauty' ); ?></p>
			<h2 id="beauty-home-news-heading" class="beauty-section__title"><?php esc_html_e( 'Bài viết', 'sos-beauty' ); ?></h2>
		</div>
		<a class="beauty-section__more" href="<?php echo esc_url( $news_url ); ?>"><?php esc_html_e( 'Xem tất cả', 'sos-beauty' ); ?></a>
	</header>
	<div class="beauty-news-grid">
		<?php
		while ( $news_query->have_posts() ) :
			$news_query->the_post();
			get_template_part( 'content' );
		endwhile;
		wp_reset_postdata();
		?>
	</div>
</section>
	<?php
endif;
?>

<?php
get_footer();
