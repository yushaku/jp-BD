<?php
/**
 * Product card in loop — brand line before title.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

global $product;

if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}
?>
<li <?php wc_product_class( '', $product ); ?>>
	<?php
	do_action( 'woocommerce_before_shop_loop_item' );
	do_action( 'woocommerce_before_shop_loop_item_title' );

	$brand = $product->get_attribute( 'pa_thuong-hieu' );
	if ( ! $brand ) {
		$brand = $product->get_attribute( 'thuong-hieu' );
	}
	if ( $brand ) {
		echo '<span class="beauty-product-brand beauty-product-brand--loop">' . esc_html( $brand ) . '</span>';
	}

	$rating = (float) $product->get_average_rating();
	$filled = $rating > 0 ? (int) round( $rating ) : 5;
	echo '<span class="beauty-stars" aria-hidden="true">';
	for ( $i = 1; $i <= 5; $i++ ) {
		echo '<span class="beauty-stars__star' . ( $i <= $filled ? ' is-filled' : '' ) . '">&#9733;</span>';
	}
	echo '</span>';

	do_action( 'woocommerce_shop_loop_item_title' );
	do_action( 'woocommerce_after_shop_loop_item_title' );
	do_action( 'woocommerce_after_shop_loop_item' );
	?>
</li>
