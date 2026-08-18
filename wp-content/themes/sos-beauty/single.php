<?php
/**
 * Single post template — editorial blog detail.
 *
 * @package sos-beauty
 */

get_header();

/**
 * Hook: storefront_before_content.
 */
do_action( 'storefront_before_content' );
?>

<div class="beauty-single-post">
	<div class="beauty-single-post__container">

		<?php
		/**
		 * Hook: storefront_before_main_content.
		 */
		do_action( 'storefront_before_main_content' );
		?>

		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">

				<?php
				// Breadcrumb
				if ( function_exists( 'woocommerce_breadcrumb' ) ) {
					woocommerce_breadcrumb();
				}

				// Post content
				while ( have_posts() ) :
					the_post();

					get_template_part( 'template-parts/content', 'single' );

					// Author bio
					get_template_part( 'template-parts/author', 'bio' );

					// Related posts
					get_template_part( 'template-parts/related', 'posts' );

					// Comments
					if ( comments_open() || get_comments_number() ) :
						comments_template();
					endif;

				endwhile;
				?>

			</main><!-- #main -->
		</div><!-- #primary -->

	</div><!-- .beauty-single-post__container -->
</div><!-- .beauty-single-post -->

<?php
get_footer();