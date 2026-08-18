<?php
/**
 * Product card — soft media + title/price + circular CTA (reference card UI).
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

global $product;

if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}

$permalink = get_permalink( $product->get_id() );
?>
<li <?php wc_product_class( 'beauty-card', $product ); ?>>
	<div class="beauty-card__media">
		<?php woocommerce_show_product_loop_sale_flash(); ?>
		<a class="beauty-card__media-link" href="<?php echo esc_url( $permalink ); ?>" aria-hidden="true" tabindex="-1">
			<?php echo $product->get_image( 'woocommerce_thumbnail' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WC image HTML ?>
		</a>
	</div>

	<div class="beauty-card__body">
		<div class="beauty-card__info">
			<a class="beauty-card__title" href="<?php echo esc_url( $permalink ); ?>">
				<?php echo esc_html( get_the_title( $product->get_id() ) ); ?>
			</a>
			<?php woocommerce_template_loop_price(); ?>
		</div>
		<?php woocommerce_template_loop_add_to_cart(); ?>
	</div>
</li>
