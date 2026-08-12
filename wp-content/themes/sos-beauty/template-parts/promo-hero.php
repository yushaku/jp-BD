<?php
/**
 * Promo hero grid — Customizer-driven tiles.
 */

defined( 'ABSPATH' ) || exit;

$feature = array(
	'title'    => get_theme_mod( 'sos_beauty_promo_feature_title', 'Giảm đến 25% mỹ phẩm & TPCN Nhật' ),
	'subtitle' => get_theme_mod( 'sos_beauty_promo_feature_subtitle', 'Deal tốt cho skincare, vitamin và đặc sản Nhật Bản.' ),
	'cta'      => get_theme_mod( 'sos_beauty_promo_feature_cta', 'Mua ngay' ),
	'href'     => sos_beauty_promo_url( get_theme_mod( 'sos_beauty_promo_feature_href', '/category/my-pham-nhat' ) ),
	'image'    => sos_beauty_promo_image_url( get_theme_mod( 'sos_beauty_promo_feature_image', 0 ) ),
	'alt'      => get_theme_mod( 'sos_beauty_promo_feature_alt', 'Mỹ phẩm Nhật Bản chính hãng' ),
);

$countdown = array(
	'title'    => get_theme_mod( 'sos_beauty_promo_countdown_title', 'Mỹ phẩm J-Beauty' ),
	'end'      => get_theme_mod( 'sos_beauty_promo_countdown_end', '2026-09-30T23:59:59+07:00' ),
	'cta'      => get_theme_mod( 'sos_beauty_promo_countdown_cta', 'Mua ngay' ),
	'href'     => sos_beauty_promo_url( get_theme_mod( 'sos_beauty_promo_countdown_href', '/category/my-pham-nhat' ) ),
	'image'    => sos_beauty_promo_image_url( get_theme_mod( 'sos_beauty_promo_countdown_image', 0 ) ),
	'alt'      => get_theme_mod( 'sos_beauty_promo_countdown_alt', 'Ưu đãi mỹ phẩm Nhật Bản' ),
);

$sides = array();
for ( $i = 1; $i <= 2; $i++ ) {
	$prefix   = 'sos_beauty_promo_side_' . $i . '_';
	$defaults = array(
		1 => array(
			'title'    => 'TPCN Nhật Bản',
			'subtitle' => 'Vitamin & collagen',
			'cta'      => 'Xem chi tiết',
			'href'     => '/category/tpcn',
			'alt'      => 'Thực phẩm chức năng Nhật Bản',
		),
		2 => array(
			'title'    => 'Thực phẩm Nhật',
			'subtitle' => 'Matcha, miso & đặc sản',
			'cta'      => 'Xem chi tiết',
			'href'     => '/category/thuc-pham-nhat',
			'alt'      => 'Thực phẩm Nhật Bản',
		),
	);
	$sides[] = array(
		'title'    => get_theme_mod( $prefix . 'title', $defaults[ $i ]['title'] ),
		'subtitle' => get_theme_mod( $prefix . 'subtitle', $defaults[ $i ]['subtitle'] ),
		'cta'      => get_theme_mod( $prefix . 'cta', $defaults[ $i ]['cta'] ),
		'href'     => sos_beauty_promo_url( get_theme_mod( $prefix . 'href', $defaults[ $i ]['href'] ) ),
		'image'    => sos_beauty_promo_image_url( get_theme_mod( $prefix . 'image', 0 ) ),
		'alt'      => get_theme_mod( $prefix . 'alt', $defaults[ $i ]['alt'] ),
	);
}
?>

<section class="beauty-promo" aria-label="<? esc_attr_e( 'Ưu đãi nổi bật', 'sos-beauty' ); ?>">
	<a class="beauty-promo__tile beauty-promo__feature" href="<?php echo esc_url( $feature['href'] ); ?>"<?php echo $feature['image'] ? ' style="background-image:url(' . esc_url( $feature['image'] ) . ')"' : ''; ?>>
		<span class="beauty-promo__overlay" aria-hidden="true"></span>
		<span class="beauty-promo__content">
			<span class="beauty-promo__title"><?php echo esc_html( $feature['title'] ); ?></span>
			<span class="beauty-promo__subtitle"><?php echo esc_html( $feature['subtitle'] ); ?></span>
			<span class="beauty-promo__cta"><?php echo esc_html( $feature['cta'] ); ?></span>
		</span>
		<span class="screen-reader-text"><?php echo esc_html( $feature['alt'] ); ?></span>
	</a>

	<a class="beauty-promo__tile beauty-promo__countdown" href="<?php echo esc_url( $countdown['href'] ); ?>" data-countdown-end="<?php echo esc_attr( $countdown['end'] ); ?>"<?php echo $countdown['image'] ? ' style="background-image:url(' . esc_url( $countdown['image'] ) . ')"' : ''; ?>>
		<span class="beauty-promo__content">
			<span class="beauty-promo__title"><?php echo esc_html( $countdown['title'] ); ?></span>
			<span class="beauty-promo__timer" aria-live="polite">
				<span class="beauty-promo__timer-unit"><span class="beauty-promo__timer-value" data-unit="days">00</span><span class="beauty-promo__timer-label"><? esc_html_e( 'Ngày', 'sos-beauty' ); ?></span></span>
				<span class="beauty-promo__timer-unit"><span class="beauty-promo__timer-value" data-unit="hours">00</span><span class="beauty-promo__timer-label"><? esc_html_e( 'Giờ', 'sos-beauty' ); ?></span></span>
				<span class="beauty-promo__timer-unit"><span class="beauty-promo__timer-value" data-unit="mins">00</span><span class="beauty-promo__timer-label"><? esc_html_e( 'Phút', 'sos-beauty' ); ?></span></span>
				<span class="beauty-promo__timer-unit"><span class="beauty-promo__timer-value" data-unit="secs">00</span><span class="beauty-promo__timer-label"><? esc_html_e( 'Giây', 'sos-beauty' ); ?></span></span>
			</span>
			<span class="beauty-promo__cta"><?php echo esc_html( $countdown['cta'] ); ?></span>
		</span>
		<span class="screen-reader-text"><?php echo esc_html( $countdown['alt'] ); ?></span>
	</a>

	<?php foreach ( $sides as $side ) : ?>
		<a class="beauty-promo__tile beauty-promo__side" href="<?php echo esc_url( $side['href'] ); ?>"<?php echo $side['image'] ? ' style="background-image:url(' . esc_url( $side['image'] ) . ')"' : ''; ?>>
			<span class="beauty-promo__overlay" aria-hidden="true"></span>
			<span class="beauty-promo__content">
				<span class="beauty-promo__title"><?php echo esc_html( $side['title'] ); ?></span>
				<span class="beauty-promo__subtitle"><?php echo esc_html( $side['subtitle'] ); ?></span>
				<span class="beauty-promo__cta"><?php echo esc_html( $side['cta'] ); ?></span>
			</span>
			<span class="screen-reader-text"><?php echo esc_html( $side['alt'] ); ?></span>
		</a>
	<?php endforeach; ?>
</section>
