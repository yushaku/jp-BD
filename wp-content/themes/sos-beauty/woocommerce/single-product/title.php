<?php
/**
 * Single product title — show brand line for cosmetics.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

global $product;

$brand = $product->get_attribute( 'pa_thuong-hieu' );
if ( ! $brand ) {
	$brand = $product->get_attribute( 'thuong-hieu' );
}
?>

<?php if ( $brand ) : ?>
	<span class="beauty-pdp__brand"><?php echo esc_html( $brand ); ?></span>
<?php endif; ?>

<h1 class="beauty-pdp__title"><?php the_title(); ?></h1>