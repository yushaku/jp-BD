<?php
/**
 * Single Product — Beauty PDP layout.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' );

/**
 * Hook: woocommerce_before_single_product.
 *
 * @hooked woocommerce_output_all_notices - 10
 */
do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	return;
}
?>

<div class="beauty-pdp">
	<div class="beauty-pdp__grid">

		<div class="beauty-pdp__gallery">
			<?php
			/**
			 * Hook: woocommerce_before_single_product_summary.
			 *
			 * @hooked woocommerce_show_product_sale_flash - 10
			 * @hooked woocommerce_show_product_images - 20
			 */
			do_action( 'woocommerce_before_single_product_summary' );
			?>
		</div>

		<div class="beauty-pdp__summary">
			<?php
			/**
			 * Hook: woocommerce_single_product_summary.
			 *
			 * @hooked woocommerce_template_single_title - 5
			 * @hooked woocommerce_template_single_rating - 10
			 * @hooked woocommerce_template_single_price - 10
			 * @hooked woocommerce_template_single_excerpt - 20
			 * @hooked woocommerce_template_single_add_to_cart - 30
			 * @hooked woocommerce_template_single_meta - 40
			 * @hooked woocommerce_template_single_sharing - 50
			 */
			do_action( 'woocommerce_single_product_summary' );
			?>
		</div>

	</div>

	<div class="beauty-pdp__tabs">
		<?php
		/**
		 * Hook: woocommerce_after_single_product_summary.
		 *
		 * @hooked woocommerce_output_product_data_tabs - 10
		 * @hooked woocommerce_upsell_display - 15
		 * @hooked woocommerce_output_related_products - 20
		 */
		do_action( 'woocommerce_after_single_product_summary' );
		?>
	</div>

	<?php
	/**
	 * Related products — custom wrapper for styling.
	 */
	$related_products = wc_get_related_products( get_the_ID(), 4 );
	if ( $related_products ) :
		?>
		<section class="beauty-pdp__related">
			<h2 class="beauty-pdp__related-title"><?php esc_html_e( 'Sản phẩm liên quan', 'sos-beauty' ); ?></h2>
			<?php
			woocommerce_product_loop_start();
			foreach ( $related_products as $related_product ) {
				$post_object = get_post( $related_product );
				setup_postdata( $GLOBALS['post'] =& $post_object ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
				wc_get_template_part( 'content', 'product' );
			}
			woocommerce_product_loop_end();
			wp_reset_postdata();
			?>
		</section>
	<?php endif; ?>
</div>

<?php
get_footer( 'shop' );