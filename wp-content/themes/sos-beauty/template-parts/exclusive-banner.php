<?php
/**
 * Exclusive products banner — Customizer-driven.
 * Appearance → Customize → JP Bùi Đặng — Banner độc quyền
 */

defined( 'ABSPATH' ) || exit;

if ( ! get_theme_mod( 'sos_beauty_exclusive_banner_show', true ) ) {
	return;
}

$image = sos_beauty_home_image_url( 'sos_beauty_exclusive_banner_image', 'exclusive-banner.jpg' );
if ( ! $image ) {
	return;
}

$eyebrow  = get_theme_mod( 'sos_beauty_exclusive_banner_eyebrow', 'Độc quyền tại JP' );
$title    = get_theme_mod( 'sos_beauty_exclusive_banner_title', 'fractional CC' );
$subtitle = get_theme_mod( 'sos_beauty_exclusive_banner_subtitle', 'Skincare Nhật Bản — chỉ có tại JP Bùi Đặng' );
$href_raw = get_theme_mod( 'sos_beauty_exclusive_banner_href', '#beauty-exclusive' );
$alt      = get_theme_mod( 'sos_beauty_exclusive_banner_alt', 'Sản phẩm độc quyền fractional CC' );

if ( 0 === strpos( $href_raw, '#' ) ) {
	$href = $href_raw;
} else {
	$href = sos_beauty_promo_url( $href_raw );
}

$has_copy = ( $eyebrow || $title || $subtitle );
?>

<section class="beauty-exclusive-banner" aria-label="<?php esc_attr_e( 'Banner sản phẩm độc quyền', 'sos-beauty' ); ?>">
	<a class="beauty-exclusive-banner__link" href="<?php echo esc_url( $href ); ?>">
		<img
			class="beauty-exclusive-banner__img"
			src="<?php echo esc_url( $image ); ?>"
			alt="<?php echo esc_attr( $alt ); ?>"
			width="1920"
			height="1369"
			decoding="async"
			loading="lazy"
		/>
		<?php if ( $has_copy ) : ?>
			<span class="beauty-exclusive-banner__overlay" aria-hidden="true"></span>
			<span class="beauty-exclusive-banner__content">
				<?php if ( $eyebrow ) : ?>
					<span class="beauty-exclusive-banner__eyebrow"><?php echo esc_html( $eyebrow ); ?></span>
				<?php endif; ?>
				<?php if ( $title ) : ?>
					<span class="beauty-exclusive-banner__title"><?php echo esc_html( $title ); ?></span>
				<?php endif; ?>
				<?php if ( $subtitle ) : ?>
					<span class="beauty-exclusive-banner__subtitle"><?php echo esc_html( $subtitle ); ?></span>
				<?php endif; ?>
			</span>
		<?php endif; ?>
	</a>
</section>
