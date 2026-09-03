<?php
/**
 * Header main row — logo | search | customer care.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

$hotline = sos_beauty_company( 'hotline' );
$tel     = preg_replace( '/\D+/', '', $hotline );
?>
<div class="beauty-header-main">
	<div class="beauty-header-main__brand">
		<?php storefront_site_branding(); ?>
	</div>

	<div class="beauty-header-main__search">
		<?php
		if ( function_exists( 'storefront_product_search' ) ) {
			storefront_product_search();
		}
		?>
	</div>

	<div class="beauty-header-main__aside">
		<?php if ( $hotline ) : ?>
			<a class="beauty-header-care" href="<?php echo esc_url( 'tel:' . $tel ); ?>">
				<span class="beauty-header-care__icon" aria-hidden="true">
					<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
				</span>
				<span class="beauty-header-care__text">
					<span class="beauty-header-care__label"><?php esc_html_e( 'Chăm sóc khách hàng', 'sos-beauty' ); ?></span>
					<span class="beauty-header-care__phone"><?php echo esc_html( $hotline ); ?></span>
				</span>
			</a>
		<?php endif; ?>
		<?php
		if ( function_exists( 'sos_beauty_header_cart' ) ) {
			sos_beauty_header_cart();
		}
		?>
	</div>
</div>
