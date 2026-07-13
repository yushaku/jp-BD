<?php
/**
 * Single product title — show brand line for cosmetics.
 */

defined( 'ABSPATH' ) || exit;

global $product;

$brand = $product->get_attribute( 'pa_thuong-hieu' );
if ( ! $brand ) {
	$brand = $product->get_attribute( 'thuong-hieu' );
}
?>

<?php if ( $brand ) : ?>
	<p class="beauty-product-brand"><?php echo esc_html( $brand ); ?></p>
<?php endif; ?>

<h1 class="product_title entry-title"><?php the_title(); ?></h1>
