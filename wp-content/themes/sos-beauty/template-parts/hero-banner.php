<?php
/**
 * Full-bleed hero banner under the header.
 */

defined( 'ABSPATH' ) || exit;

$banner = get_stylesheet_directory_uri() . '/assets/images/banner.png';
$path   = get_stylesheet_directory() . '/assets/images/banner.png';
if ( ! file_exists( $path ) ) {
	return;
}

$shop_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
?>

<section class="beauty-hero-banner" aria-label="<?php esc_attr_e( 'Banner giới thiệu', 'sos-beauty' ); ?>">
	<a class="beauty-hero-banner__link" href="<?php echo esc_url( $shop_url ); ?>">
		<img
			class="beauty-hero-banner__img"
			src="<?php echo esc_url( $banner ); ?>"
			alt="<?php echo esc_attr__( 'JP Bùi Đặng — Sức khỏe và sắc đẹp từ Nhật Bản', 'sos-beauty' ); ?>"
			width="1983"
			height="793"
			decoding="async"
			fetchpriority="high"
		/>
	</a>
</section>
