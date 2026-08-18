<?php
/**
 * Author bio template.
 *
 * @package sos-beauty
 */

defined( 'ABSPATH' ) || exit;

if ( ! get_the_author_meta( 'description' ) ) {
	return;
}

$author_id   = get_the_author_meta( 'ID' );
$author_name = get_the_author();
$author_url  = get_author_posts_url( $author_id );
$avatar      = get_avatar( $author_id, 72, '', esc_attr( $author_name ), array( 'class' => 'beauty-author__avatar-img' ) );
$description = get_the_author_meta( 'description' );
?>

<div class="beauty-author" itemscope itemtype="https://schema.org/Person">
	<div class="beauty-author__avatar">
		<?php echo $avatar; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped - avatar HTML is safe ?>
	</div>
	<div class="beauty-author__body">
		<h3 class="beauty-author__name">
			<a href="<?php echo esc_url( $author_url ); ?>" rel="author" itemprop="url">
				<span itemprop="name"><?php echo esc_html( $author_name ); ?></span>
			</a>
		</h3>
		<p class="beauty-author__bio" itemprop="description"><?php echo esc_html( $description ); ?></p>
		<a class="beauty-author__link" href="<?php echo esc_url( $author_url ); ?>">
			<?php
			/* translators: %s = author name */
			echo esc_html( sprintf( __( 'Xem tất cả bài của %s', 'sos-beauty' ), $author_name ) );
			?>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
		</a>
	</div>
</div>