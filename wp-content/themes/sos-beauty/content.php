<?php
/**
 * News card in the post loop (blog, archives, search).
 */

defined( 'ABSPATH' ) || exit;

$permalink = get_permalink();
$title     = get_the_title();
$excerpt   = wp_strip_all_tags( get_the_excerpt() );
$fallback  = get_stylesheet_directory_uri() . '/assets/images/category-collection.jpg';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'beauty-news-card' ); ?>>
	<a class="beauty-news-card__link" href="<?php echo esc_url( $permalink ); ?>">
		<span class="beauty-news-card__media">
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
		<h2 class="beauty-news-card__title"><?php echo esc_html( $title ); ?></h2>
		<span class="beauty-news-card__meta">
			<svg class="beauty-news-card__meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
			<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date( 'd/m/Y' ) ); ?></time>
		</span>
		<?php if ( $excerpt ) : ?>
			<span class="beauty-news-card__excerpt"><?php echo esc_html( $excerpt ); ?></span>
		<?php endif; ?>
	</a>
</article>
