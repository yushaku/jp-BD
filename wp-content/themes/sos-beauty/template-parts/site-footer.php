<?php
/**
 * Site footer — company info, legal links, newsletter, payments.
 */

defined( 'ABSPATH' ) || exit;

$site_name = get_bloginfo( 'name' );
$address   = get_theme_mod( 'sos_beauty_footer_address', '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' );
$hotline   = get_theme_mod( 'sos_beauty_footer_hotline', '0901 234 567' );
$email     = get_theme_mod( 'sos_beauty_footer_email', 'support@jpbuydang.vn' );
$bct_url   = get_theme_mod( 'sos_beauty_footer_bct_url', 'http://online.gov.vn' );

$hotline_tel = preg_replace( '/\s+/', '', $hotline );

$quick_links = array(
	array(
		'slug'  => 'chinh-sach-doi-tra',
		'label' => __( 'Chính sách đổi trả', 'sos-beauty' ),
	),
	array(
		'slug'  => 'chinh-sach-bao-mat',
		'label' => __( 'Chính sách bảo mật', 'sos-beauty' ),
	),
	array(
		'slug'  => 'huong-dan-mua-hang',
		'label' => __( 'Hướng dẫn mua hàng', 'sos-beauty' ),
	),
);
?>

<div class="beauty-site-footer col-full">
	<div class="beauty-site-footer__grid">

		<div class="beauty-site-footer__col beauty-site-footer__col--brand">
			<div class="beauty-site-footer__logo">
				<?php
				if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) {
					the_custom_logo();
				} else {
					echo '<a class="beauty-site-footer__site-name" href="' . esc_url( home_url( '/' ) ) . '">' . esc_html( $site_name ) . '</a>';
				}
				?>
			</div>
			<?php if ( $address ) : ?>
				<p class="beauty-site-footer__address"><?php echo esc_html( $address ); ?></p>
			<?php endif; ?>
			<ul class="beauty-site-footer__contact">
				<?php if ( $hotline ) : ?>
					<li>
						<span class="beauty-site-footer__label"><?php esc_html_e( 'Hotline', 'sos-beauty' ); ?></span>
						<a href="<?php echo esc_url( 'tel:' . $hotline_tel ); ?>"><?php echo esc_html( $hotline ); ?></a>
					</li>
				<?php endif; ?>
				<?php if ( $email ) : ?>
					<li>
						<span class="beauty-site-footer__label"><?php esc_html_e( 'Email', 'sos-beauty' ); ?></span>
						<a href="<?php echo esc_url( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a>
					</li>
				<?php endif; ?>
			</ul>
		</div>

		<div class="beauty-site-footer__col beauty-site-footer__col--links">
			<h3 class="beauty-site-footer__title"><?php esc_html_e( 'Liên kết nhanh', 'sos-beauty' ); ?></h3>
			<ul class="beauty-site-footer__nav">
				<?php foreach ( $quick_links as $link ) : ?>
					<?php
					$page = get_page_by_path( $link['slug'] );
					$url  = $page ? get_permalink( $page ) : home_url( '/' . $link['slug'] . '/' );
					?>
					<li><a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $link['label'] ); ?></a></li>
				<?php endforeach; ?>
			</ul>
		</div>

		<div class="beauty-site-footer__col beauty-site-footer__col--newsletter">
			<h3 class="beauty-site-footer__title"><?php esc_html_e( 'Nhận bản tin khuyến mãi', 'sos-beauty' ); ?></h3>
			<p class="beauty-site-footer__desc"><?php esc_html_e( 'Đăng ký để nhận ưu đãi & deal Nhật Bản mới nhất.', 'sos-beauty' ); ?></p>
			<form class="beauty-newsletter" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="sos_beauty_newsletter" />
				<?php wp_nonce_field( 'sos_beauty_newsletter', 'sos_beauty_newsletter_nonce' ); ?>
				<label class="screen-reader-text" for="beauty-newsletter-email"><?php esc_html_e( 'Email của bạn', 'sos-beauty' ); ?></label>
				<div class="beauty-newsletter__row">
					<input
						id="beauty-newsletter-email"
						type="email"
						name="newsletter_email"
						required
						placeholder="<?php esc_attr_e( 'Email của bạn', 'sos-beauty' ); ?>"
						autocomplete="email"
					/>
					<button type="submit"><?php esc_html_e( 'Đăng ký', 'sos-beauty' ); ?></button>
				</div>
			</form>
			<?php if ( isset( $_GET['newsletter'] ) && 'ok' === $_GET['newsletter'] ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
				<p class="beauty-newsletter__notice" role="status"><?php esc_html_e( 'Cảm ơn bạn đã đăng ký!', 'sos-beauty' ); ?></p>
			<?php endif; ?>
		</div>

		<div class="beauty-site-footer__col beauty-site-footer__col--payments">
			<h3 class="beauty-site-footer__title"><?php esc_html_e( 'Thanh toán hỗ trợ', 'sos-beauty' ); ?></h3>
			<ul class="beauty-payments" aria-label="<?php esc_attr_e( 'Phương thức thanh toán', 'sos-beauty' ); ?>">
				<li class="beauty-payments__item beauty-payments__item--visa" title="Visa">
					<svg width="48" height="28" viewBox="0 0 48 28" aria-hidden="true" focusable="false">
						<rect width="48" height="28" rx="4" fill="#fff"/>
						<path fill="#1A1F71" d="M19.4 19.2h-2.9l1.8-11h2.9l-1.8 11zm11.4-10.7c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.8 0 1.6 1.5 2.6 2.6 3.1 1.2.6 1.6.9 1.6 1.4 0 .8-.9 1.1-1.8 1.1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.1 0 5.1-1.5 5.1-3.9 0-1.3-.8-2.3-2.5-3.1-1-.5-1.7-.9-1.7-1.4 0-.5.5-.9 1.7-.9 1 0 1.7.2 2.2.4l.3.1.4-2.4zm7.9-.3h-2.2c-.7 0-1.2.2-1.5.9l-4.3 10.1h3l.6-1.7h3.7c.1.4.3 1.7.3 1.7h2.7l-2.3-11zm-3.4 7.1.2-.6.9-2.5c0 .1 1.3 3.4 1.3 3.4h-2.4v-.3zm-17.2-7.1-2.9 7.8-.3-1.6c-.5-1.8-2.2-3.7-4-4.7l2.7 9.5h3.1l4.5-11h-3.1z"/>
						<path fill="#F7A600" d="M9.8 8.2H7.1l-.1.2C11.7 9.5 14 11.6 15 14.1l-1.2-5.6c-.2-.7-.7-.9-1.1-.9z"/>
					</svg>
					<span class="screen-reader-text">Visa</span>
				</li>
				<li class="beauty-payments__item beauty-payments__item--momo" title="MoMo">
					<span class="beauty-payments__badge beauty-payments__badge--momo">MoMo</span>
				</li>
				<li class="beauty-payments__item beauty-payments__item--vnpay" title="VNPay">
					<span class="beauty-payments__badge beauty-payments__badge--vnpay">VNPay</span>
				</li>
			</ul>
			<a class="beauty-bct" href="<?php echo esc_url( $bct_url ); ?>" target="_blank" rel="noopener noreferrer">
				<span class="beauty-bct__mark" aria-hidden="true">
					<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
						<circle cx="18" cy="18" r="17" stroke="#d4cfc7" stroke-width="1.5"/>
						<path d="M18 8l2.5 5.2 5.5.5-4.2 3.8 1.3 5.3L18 19.9l-4.9 2.9 1.3-5.3-4.2-3.8 5.5-.5L18 8z" fill="#d4cfc7"/>
					</svg>
				</span>
				<span class="beauty-bct__text">
					<strong><?php esc_html_e( 'Đã thông báo', 'sos-beauty' ); ?></strong>
					<span><?php esc_html_e( 'Bộ Công Thương', 'sos-beauty' ); ?></span>
				</span>
			</a>
		</div>

	</div>
</div>
