<?php
/**
 * Related posts template.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

$post_id = get_the_ID();

// Get categories of current post
$categories = get_the_category( $post_id );
$cat_ids    = array();
if ( $categories ) {
	foreach ( $categories as $cat ) {
		$cat_ids[] = $cat->term_id;
	}
}

// Query related posts
$related_args = array(
	'category__in'   => $cat_ids,
	'post__not_in'   => array( $post_id ),
	'posts_per_page' => 3,
	'orderby'        => 'rand',
	'post_status'    => 'publish',
);

$related_query = new WP_Query( $related_args );

if ( ! $related_query->have_posts() ) {
	// Fallback: latest posts
	$related_query = new WP_Query(
		array(
			'post__not_in'   => array( $post_id ),
			'posts_per_page' => 3,
			'orderby'        => 'date',
			'post_status'    => 'publish',
		)
	);
}

if ( ! $related_query->have_posts() ) {
	return;
}
?>

<section class="beauty-related" aria-label="<?php esc_attr_e( 'Bài viết liên quan', 'sos-beauty' ); ?>">
	<h2 class="beauty-related__title"><?php esc_html_e( 'Bài viết liên quan', 'sos-beauty' ); ?></h2>
	<div class="beauty-related__grid">

		<?php
		while ( $related_query->have_posts() ) :
			$related_query->the_post();

			$related_id    = get_the_ID();
			$related_title = get_the_title();
			$related_date  = get_the_date( 'd/m/Y' );
			$related_excerpt = wp_strip_all_tags( get_the_excerpt() );
			$fallback      = get_stylesheet_directory_uri() . '/assets/images/category-collection.jpg';
			?>

			<article class="beauty-related__card">
				<a class="beauty-related__link" href="<?php echo esc_url( get_permalink() ); ?>">
					<span class="beauty-related__media">
						<?php if ( has_post_thumbnail() ) : ?>
							<?php
							the_post_thumbnail(
								'medium_large',
								array(
									'alt'      => '',
									'loading'  => 'lazy',
									'decoding' => 'async',
								)
							);
							?>
						<?php else : ?>
							<img src="<?php echo esc_url( $fallback ); ?>" alt="" loading="lazy" decoding="async" width="768" height="480" />
						<?php endif; ?>
					</span>
					<h3 class="beauty-related__card-title"><?php echo esc_html( $related_title ); ?></h3>
					<span class="beauty-related__meta">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
						<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( $related_date ); ?></time>
					</span>
					<?php if ( $related_excerpt ) : ?>
						<span class="beauty-related__excerpt"><?php echo esc_html( $related_excerpt ); ?></span>
					<?php endif; ?>
				</a>
			</article>

		<?php endwhile; ?>

	</div>
</section>

<?php
wp_reset_postdata();