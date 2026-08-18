<?php
/**
 * Shop sidebar — product category tree (replaces default widgets).
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'sos_beauty_show_shop_sidebar' ) || ! sos_beauty_show_shop_sidebar() ) {
	return;
}
?>

<div id="secondary" class="widget-area" role="complementary">
	<?php sos_beauty_category_nav(); ?>
</div><!-- #secondary -->
