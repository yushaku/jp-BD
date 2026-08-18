<?php
/**
 * Single post content template.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

$post_id    = get_the_ID();
$title      = get_the_title();
$date       = get_the_date( 'd/m/Y' );
$date_w3c   = get_the_date( DATE_W3C );
$author     = get_the_author();
$categories = get_the_category();
$tags       = get_the_tag_list( '', ', ' );
$reading_time = sos_beauty_estimate_reading_time( get_the_content() );
?>

<article id="post-<?php echo esc_attr( $post_id ); ?>" <?php post_class( 'beauty-single' ); ?>>

	<!-- Featured Image -->
	<?php if ( has_post_thumbnail() ) : ?>
		<div class="beauty-single__media">
			<?php
			the_post_thumbnail(
				'large',
				array(
					'alt'      => esc_attr( $title ),
					'loading'  => 'eager',
					'decoding' => 'async',
				)
			);
			?>
		</div>
	<?php endif; ?>

	<!-- Header -->
	<header class="beauty-single__header">

		<?php if ( $categories ) : ?>
			<div class="beauty-single__cats">
				<?php foreach ( $categories as $cat ) : ?>
					<a class="beauty-single__cat" href="<?php echo esc_url( get_category_link( $cat ) ); ?>">
						<?php echo esc_html( $cat->name ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<h1 class="beauty-single__title"><?php echo esc_html( $title ); ?></h1>

		<div class="beauty-single__meta">
			<span class="beauty-single__author">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
				<?php echo esc_html( $author ); ?>
			</span>
			<span class="beauty-single__date">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
				<time datetime="<?php echo esc_attr( $date_w3c ); ?>"><?php echo esc_html( $date ); ?></time>
			</span>
			<span class="beauty-single__reading">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
				<?php
				/* translators: %d = minutes */
				echo esc_html( sprintf( __( '%d phút đọc', 'sos-beauty' ), $reading_time ) );
				?>
			</span>
		</div>

	</header>

	<!-- Content -->
	<div class="beauty-single__content">
		<?php
		the_content();

		wp_link_pages(
			array(
				'before' => '<div class="beauty-single__pages">' . esc_html__( 'Trang:', 'sos-beauty' ),
				'after'  => '</div>',
			)
		);
		?>
	</div>

	<!-- Footer -->
	<footer class="beauty-single__footer">

		<?php if ( $tags ) : ?>
			<div class="beauty-single__tags">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
				<?php echo $tags; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag list is safe ?>
			</div>
		<?php endif; ?>

		<!-- Share buttons -->
		<div class="beauty-single__share">
			<span class="beauty-single__share-label"><?php esc_html_e( 'Chia sẻ:', 'sos-beauty' ); ?></span>
			<a class="beauty-single__share-btn beauty-single__share-btn--facebook" href="<?php echo esc_url( 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode( get_permalink() ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'Chia sẻ lên Facebook', 'sos-beauty' ); ?>">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>
			</a>
			<a class="beauty-single__share-btn beauty-single__share-btn--twitter" href="<?php echo esc_url( 'https://twitter.com/intent/tweet?url=' . urlencode( get_permalink() ) . '&text=' . urlencode( $title ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'Chia sẻ lên Twitter', 'sos-beauty' ); ?>">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
			</a>
			<a class="beauty-single__share-btn beauty-single__share-btn--copy" href="#" data-url="<?php echo esc_url( get_permalink() ); ?>" aria-label="<?php esc_attr_e( 'Sao chép liên kết', 'sos-beauty' ); ?>">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
			</a>
		</div>

	</footer>

</article>