<?php
/**
 * Promo hero grid — Customizer-driven tiles.
 * Layout: feature (tall left) + 2 side tiles stacked vertically (right).
 */

defined( 'ABSPATH' ) || exit;

$feature = array(
	'title'    => get_theme_mod( 'sos_beauty_promo_feature_title', 'Giảm đến 25% mỹ phẩm & TPCN Nhật' ),
	'subtitle' => get_theme_mod( 'sos_beauty_promo_feature_subtitle', 'Deal tốt cho skincare, vitamin và đặc sản Nhật Bản.' ),
	'href'     => sos_beauty_promo_url( get_theme_mod( 'sos_beauty_promo_feature_href', '/category/my-pham-nhat' ) ),
	'image'    => sos_beauty_home_image_url( 'sos_beauty_promo_feature_image', 'promo-body-care.jpg' ),
	'alt'      => get_theme_mod( 'sos_beauty_promo_feature_alt', 'Mỹ phẩm Nhật Bản chính hãng' ),
);

$sides = array();
for ( $i = 1; $i <= 2; $i++ ) {
	$prefix   = 'sos_beauty_promo_side_' . $i . '_';
	$defaults = array(
		1 => array(
			'title'    => 'TPCN Nhật Bản',
			'subtitle' => 'Vitamin & collagen',
			'href'     => '/category/tpcn',
			'alt'      => 'Thực phẩm chức năng Nhật Bản',
		),
		2 => array(
			'title'    => 'Thực phẩm Nhật',
			'subtitle' => 'Matcha, miso & đặc sản',
			'href'     => '/category/thuc-pham-nhat',
			'alt'      => 'Thực phẩm Nhật Bản',
		),
	);
	$sides[] = array(
		'title'    => get_theme_mod( $prefix . 'title', $defaults[ $i ]['title'] ),
		'subtitle' => get_theme_mod( $prefix . 'subtitle', $defaults[ $i ]['subtitle'] ),
		'href'     => sos_beauty_promo_url( get_theme_mod( $prefix . 'href', $defaults[ $i ]['href'] ) ),
		'image'    => sos_beauty_home_image_url( $prefix . 'image', 1 === $i ? 'promo-hatomugi.jpg' : 'promo-drinks.jpg' ),
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
		</span>
		<span class="screen-reader-text"><?php echo esc_html( $feature['alt'] ); ?></span>
	</a>

	<?php foreach ( $sides as $side ) : ?>
		<a class="beauty-promo__tile beauty-promo__side" href="<?php echo esc_url( $side['href'] ); ?>"<?php echo $side['image'] ? ' style="background-image:url(' . esc_url( $side['image'] ) . ')"' : ''; ?>>
			<span class="beauty-promo__overlay" aria-hidden="true"></span>
			<span class="beauty-promo__content">
				<span class="beauty-promo__title"><?php echo esc_html( $side['title'] ); ?></span>
				<span class="beauty-promo__subtitle"><?php echo esc_html( $side['subtitle'] ); ?></span>
			</span>
			<span class="screen-reader-text"><?php echo esc_html( $side['alt'] ); ?></span>
		</a>
	<?php endforeach; ?>
</section>
