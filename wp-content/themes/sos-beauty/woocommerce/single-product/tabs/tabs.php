<?php
/**
 * Product data tabs — headings in each panel for mobile stacked layout.
 *
 * @see woocommerce/templates/single-product/tabs/tabs.php
 * @package sos-beauty
 * @version 9.8.0
 */

defined( 'ABSPATH' ) || exit;

$product_tabs = apply_filters( 'woocommerce_product_tabs', array() );

if ( empty( $product_tabs ) ) {
	return;
}
?>

<div class="woocommerce-tabs wc-tabs-wrapper">
	<ul class="tabs wc-tabs" role="tablist">
		<?php foreach ( $product_tabs as $key => $product_tab ) : ?>
			<li role="presentation" class="<?php echo esc_attr( $key ); ?>_tab" id="tab-title-<?php echo esc_attr( $key ); ?>">
				<a href="#tab-<?php echo esc_attr( $key ); ?>" role="tab" aria-controls="tab-<?php echo esc_attr( $key ); ?>">
					<?php echo wp_kses_post( apply_filters( 'woocommerce_product_' . $key . '_tab_title', $product_tab['title'], $key ) ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php foreach ( $product_tabs as $key => $product_tab ) : ?>
		<div
			class="woocommerce-Tabs-panel woocommerce-Tabs-panel--<?php echo esc_attr( $key ); ?> panel entry-content wc-tab"
			id="tab-<?php echo esc_attr( $key ); ?>"
			role="tabpanel"
			aria-labelledby="tab-title-<?php echo esc_attr( $key ); ?>"
		>
			<h2 class="beauty-pdp-tab-heading">
				<?php echo wp_kses_post( apply_filters( 'woocommerce_product_' . $key . '_tab_title', $product_tab['title'], $key ) ); ?>
			</h2>
			<?php
			if ( isset( $product_tab['callback'] ) ) {
				call_user_func( $product_tab['callback'], $key, $product_tab );
			}
			?>
		</div>
	<?php endforeach; ?>

	<?php do_action( 'woocommerce_product_after_tabs' ); ?>
</div>
