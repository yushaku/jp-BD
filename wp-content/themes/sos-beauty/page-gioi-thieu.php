<?php
/**
 * About page — Giới thiệu.
 *
 * Auto-applied to page slug `gioi-thieu`.
 * Editable: WP admin → Pages → Giới thiệu (title, excerpt, content, featured image + metabox).
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! have_posts() ) {
	get_footer();
	return;
}

the_post();

$post_id   = get_the_ID();
$site_name = get_bloginfo( 'name' );
$address   = get_theme_mod( 'sos_beauty_footer_address', 'Tầng 1, CT2, Mễ Trì Thượng, Nam Từ Liêm, Hà Nội' );
$email     = get_theme_mod( 'sos_beauty_footer_email', 'jpbuidangco.ltd@gmail.com' );
$hotline   = get_theme_mod( 'sos_beauty_footer_hotline', '098 556 1862' );
$shop_url  = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
$contact   = get_page_by_path( 'lien-he' );
$contact_url = $contact ? get_permalink( $contact ) : home_url( '/lien-he/' );

$fallback_photo = get_stylesheet_directory_uri() . '/assets/images/category-collection.jpg';
$logo           = function_exists( 'sos_beauty_logo_uri' ) ? sos_beauty_logo_uri() : get_stylesheet_directory_uri() . '/assets/images/logo.jpg';

$m = function ( $key, $default ) use ( $post_id ) {
	return sos_beauty_about_meta( $post_id, $key, $default );
};

$lead = has_excerpt()
	? wp_strip_all_tags( get_the_excerpt() )
	: __( 'Doanh nghiệp chuyên nhập khẩu và phân phối sản phẩm chính hãng từ Nhật Bản tại Việt Nam. Hơn 15 năm đồng hành cùng các thương hiệu Nhật trong mỹ phẩm, chăm sóc sức khỏe và hàng tiêu dùng — kết nối người Việt với tinh hoa tiêu dùng Nhật.', 'sos-beauty' );

$stats = array(
	array( $m( 'stat_1_value', '15+' ), $m( 'stat_1_label', __( 'năm nhập khẩu & phân phối', 'sos-beauty' ) ) ),
	array( $m( 'stat_2_value', 'JP' ), $m( 'stat_2_label', __( 'nguồn hàng chính hãng Nhật Bản', 'sos-beauty' ) ) ),
	array( $m( 'stat_3_value', '3' ), $m( 'stat_3_label', __( 'nhóm: mỹ phẩm, TPCN, thực phẩm', 'sos-beauty' ) ) ),
	array( $m( 'stat_4_value', 'VN' ), $m( 'stat_4_label', __( 'giao hàng toàn quốc', 'sos-beauty' ) ) ),
);

$value_icons = array(
	'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
	'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
	'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
);

$values = array(
	array(
		'title' => $m( 'value_1_title', __( 'Chính hãng, nguồn gốc rõ', 'sos-beauty' ) ),
		'text'  => $m( 'value_1_text', __( 'Mỗi sản phẩm đi kèm nguồn nhập minh bạch — đúng mô tả, ổn định theo lô, không đánh đổi chất lượng vì giá.', 'sos-beauty' ) ),
		'icon'  => $value_icons[0],
	),
	array(
		'title' => $m( 'value_2_title', __( 'Tư vấn am hiểu', 'sos-beauty' ) ),
		'text'  => $m( 'value_2_text', __( 'Đội ngũ theo sát J-Beauty và TPCN Nhật — gợi ý theo da, nhu cầu và ngân sách, không bán cho đủ đơn.', 'sos-beauty' ) ),
		'icon'  => $value_icons[1],
	),
	array(
		'title' => $m( 'value_3_title', __( 'Đồng hành lâu dài', 'sos-beauty' ) ),
		'text'  => $m( 'value_3_text', __( 'Chính sách đổi trả 7 ngày, giao 2–3 ngày nội thành, hỗ trợ đại lý minh bạch — giữ niềm tin qua từng đơn.', 'sos-beauty' ) ),
		'icon'  => $value_icons[2],
	),
);

$quotes = array(
	array(
		'text' => $m( 'quote_1_text', __( 'Mình biết đến JP Bùi Đặng qua một người bạn giới thiệu và đến nay đã sử dụng sản phẩm hơn một năm. Nguồn gốc rõ ràng, chất lượng ổn định, đúng như mô tả — từ serum, mặt nạ đến chăm sóc cá nhân.', 'sos-beauty' ) ),
		'role' => $m( 'quote_1_role', __( 'Người tiêu dùng', 'sos-beauty' ) ),
	),
	array(
		'text' => $m( 'quote_2_text', __( 'Mình khá kỹ tính khi chọn nơi mua hàng nội địa Nhật. Sau nhiều lần trải nghiệm, JP Bùi Đặng là đơn vị khiến mình tin tưởng nhất — sản phẩm chính hãng, tư vấn am hiểu, luôn gợi ý đúng nhu cầu.', 'sos-beauty' ) ),
		'role' => $m( 'quote_2_role', __( 'Người yêu mỹ phẩm Nhật', 'sos-beauty' ) ),
	),
	array(
		'text' => $m( 'quote_3_text', __( 'Chúng tôi hợp tác nhiều năm và đánh giá cao sự chuyên nghiệp. Nguồn hàng ổn định, chính sách minh bạch, xử lý đơn nhanh — giúp chủ động kinh doanh và giữ niềm tin với khách hàng.', 'sos-beauty' ) ),
		'role' => $m( 'quote_3_role', __( 'Đại lý phân phối', 'sos-beauty' ) ),
	),
);
?>

<main id="primary" class="beauty-about">

	<header class="beauty-about__hero">
		<p class="beauty-about__eyebrow"><?php echo esc_html( $m( 'eyebrow', sprintf( __( 'Công ty TNHH %s', 'sos-beauty' ), 'JP Bùi Đặng' ) ) ); ?></p>
		<h1 class="beauty-about__title"><?php the_title(); ?></h1>
		<?php if ( $lead ) : ?>
			<p class="beauty-about__lead"><?php echo esc_html( $lead ); ?></p>
		<?php endif; ?>
	</header>

	<ul class="beauty-about__stats" aria-label="<?php esc_attr_e( 'Dấu mốc', 'sos-beauty' ); ?>">
		<?php foreach ( $stats as $stat ) : ?>
			<li class="beauty-about__stat">
				<span class="beauty-about__stat-value"><?php echo esc_html( $stat[0] ); ?></span>
				<span class="beauty-about__stat-label"><?php echo esc_html( $stat[1] ); ?></span>
			</li>
		<?php endforeach; ?>
	</ul>

	<section class="beauty-about__story" aria-labelledby="beauty-about-story">
		<div class="beauty-about__copy">
			<h2 id="beauty-about-story" class="beauty-about__h2"><?php echo esc_html( $m( 'story_title', __( 'Cam kết của chúng tôi', 'sos-beauty' ) ) ); ?></h2>
			<div class="beauty-about__prose entry-content">
			<?php if ( get_the_content() ) : ?>
				<?php the_content(); ?>
			<?php else : ?>
				<p>
					<?php
					echo esc_html(
						sprintf(
							/* translators: %s: site name */
							__( '%s không chạy theo xu hướng ngắn hạn. Chúng tôi chọn nhà cung cấp, kiểm soát lô hàng và mô tả sản phẩm sao cho khách hàng nhận đúng những gì nhìn thấy trên website.', 'sos-beauty' ),
							$site_name
						)
					);
					?>
				</p>
				<p><?php esc_html_e( 'Từ J-Beauty chăm sóc da, tóc, cơ thể đến TPCN và thực phẩm Nhật, mỗi danh mục được sắp xếp để dễ chọn — và được đội ngũ tư vấn khi bạn cần người đồng hành, không chỉ một giỏ hàng.', 'sos-beauty' ); ?></p>
			<?php endif; ?>
			</div>
		</div>
		<figure class="beauty-about__figure">
			<?php if ( has_post_thumbnail() ) : ?>
				<?php
				the_post_thumbnail(
					'large',
					array(
						'alt'      => the_title_attribute( array( 'echo' => false ) ),
						'loading'  => 'lazy',
						'decoding' => 'async',
					)
				);
				?>
			<?php else : ?>
				<img src="<?php echo esc_url( $fallback_photo ); ?>" alt="<?php esc_attr_e( 'Bộ sưu tập sản phẩm Nhật Bản tại JP Bùi Đặng', 'sos-beauty' ); ?>" width="1200" height="800" loading="lazy" decoding="async" />
			<?php endif; ?>
		</figure>
	</section>

	<section class="beauty-about__values" aria-labelledby="beauty-about-values">
		<p class="beauty-about__eyebrow"><?php echo esc_html( $m( 'values_eyebrow', __( 'Vì sao chọn chúng tôi', 'sos-beauty' ) ) ); ?></p>
		<h2 id="beauty-about-values" class="beauty-about__h2"><?php echo esc_html( $m( 'values_title', __( 'Ba điều không đổi', 'sos-beauty' ) ) ); ?></h2>
		<ul class="beauty-about__value-grid">
			<?php foreach ( $values as $value ) : ?>
				<li class="beauty-about__value">
					<span class="beauty-about__value-icon" aria-hidden="true"><?php echo $value['icon']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inline SVG ?></span>
					<h3 class="beauty-about__value-title"><?php echo esc_html( $value['title'] ); ?></h3>
					<p class="beauty-about__value-text"><?php echo esc_html( $value['text'] ); ?></p>
				</li>
			<?php endforeach; ?>
		</ul>
	</section>

	<section class="beauty-about__quotes" aria-labelledby="beauty-about-quotes">
		<p class="beauty-about__eyebrow"><?php echo esc_html( $m( 'quotes_eyebrow', __( 'Ý kiến khách hàng', 'sos-beauty' ) ) ); ?></p>
		<h2 id="beauty-about-quotes" class="beauty-about__h2"><?php echo esc_html( $m( 'quotes_title', __( 'Niềm tin được kể lại', 'sos-beauty' ) ) ); ?></h2>
		<ul class="beauty-about__quote-grid">
			<?php foreach ( $quotes as $quote ) : ?>
				<li class="beauty-about__quote">
					<blockquote>
						<p><?php echo esc_html( $quote['text'] ); ?></p>
						<footer>
							<cite><?php echo esc_html( $quote['role'] ); ?></cite>
						</footer>
					</blockquote>
				</li>
			<?php endforeach; ?>
		</ul>
	</section>

	<section class="beauty-about__cta" aria-labelledby="beauty-about-cta">
		<div class="beauty-about__cta-brand">
			<img src="<?php echo esc_url( $logo ); ?>" alt="" width="72" height="72" decoding="async" />
			<div>
				<p class="beauty-about__eyebrow beauty-about__eyebrow--on-dark"><?php echo esc_html( $m( 'cta_eyebrow', __( 'Bắt đầu', 'sos-beauty' ) ) ); ?></p>
				<h2 id="beauty-about-cta" class="beauty-about__cta-title"><?php echo esc_html( $m( 'cta_title', __( 'Sẵn sàng chọn sản phẩm Nhật chính hãng?', 'sos-beauty' ) ) ); ?></h2>
			</div>
		</div>
		<p class="beauty-about__cta-text">
			<?php echo esc_html( $address ); ?>
			<?php if ( $email ) : ?>
				<span aria-hidden="true"> · </span>
				<a href="<?php echo esc_url( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a>
			<?php endif; ?>
			<?php if ( $hotline ) : ?>
				<span aria-hidden="true"> · </span>
				<a href="<?php echo esc_url( 'tel:' . preg_replace( '/\s+/', '', $hotline ) ); ?>"><?php echo esc_html( $hotline ); ?></a>
			<?php endif; ?>
		</p>
		<div class="beauty-about__cta-actions">
			<a class="beauty-about__btn beauty-about__btn--solid" href="<?php echo esc_url( $shop_url ); ?>"><?php esc_html_e( 'Xem sản phẩm', 'sos-beauty' ); ?></a>
			<a class="beauty-about__btn beauty-about__btn--ghost" href="<?php echo esc_url( $contact_url ); ?>"><?php esc_html_e( 'Liên hệ', 'sos-beauty' ); ?></a>
		</div>
	</section>

</main>

<?php
get_footer();
