<?php
/**
 * Contact page — Liên hệ.
 *
 * Auto-applied to page slug `lien-he`.
 */

defined( 'ABSPATH' ) || exit;

get_header();

$company   = sos_beauty_company();
$hotline   = $company['hotline'];
$email     = $company['email'];
$address   = $company['address'];
$facebook  = $company['facebook'];
$site_name = $company['legal_name'];

$phone_tel = sos_beauty_phone_intl( $hotline );

$zalo = get_theme_mod( 'sos_beauty_float_zalo', '' );
if ( ! $zalo && $phone_tel ) {
	$zalo = 'https://zalo.me/' . $phone_tel;
}

$channels = array(
	array(
		'key'   => 'phone',
		'label' => __( 'Hotline', 'sos-beauty' ),
		'value' => $company['phones_display'],
		'href'  => sos_beauty_tel_href( $hotline ),
		'desc'  => __( 'Gọi điện để được tư vấn sản phẩm Nhật Bản chính hãng.', 'sos-beauty' ),
		'icon'  => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>',
	),
	array(
		'key'   => 'zalo',
		'label' => __( 'Zalo', 'sos-beauty' ),
		'value' => $hotline,
		'href'  => $zalo,
		'desc'  => __( 'Phù hợp khi cần gửi ảnh sản phẩm hoặc đơn hàng.', 'sos-beauty' ),
		'icon'  => '<svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24.1 6C13.5 6 5 13.6 5 23c0 5.1 2.5 9.7 6.5 12.8-.2.9-.8 3.4-1 4.1-.2.9.3 1.1 1.1.7.6-.3 3.5-2.1 4.9-3 1.5.4 3.1.6 4.7.6 10.6 0 19.1-7.6 19.1-17S34.7 6 24.1 6zm-6.9 18.6c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-6.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v6.6zm4.7 0c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-6.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v6.6zm6.8 1.3c-.7 0-1.3-.6-1.3-1.3v-3.4l-3.5 4.2c-.2.2-.5.4-.8.4h-.2c-.7 0-1.3-.6-1.3-1.3v-6.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v3.4l3.5-4.2c.2-.2.5-.4.8-.4h.2c.7 0 1.3.6 1.3 1.3v6.6c0 .7-.6 1.3-1.3 1.3zm6.2-1.7c0 .9-.7 1.7-1.7 1.7h-2.6c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h1.3v-1.1h-1.3c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h1.3v-1.1h-1.3c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h2.6c.9 0 1.7.7 1.7 1.7v6.6z"/></svg>',
	),
	array(
		'key'   => 'facebook',
		'label' => __( 'Fanpage', 'sos-beauty' ),
		'value' => __( 'hangnhatchomoinha.vn', 'sos-beauty' ),
		'href'  => $facebook,
		'desc'  => __( 'Theo dõi tin tức và sản phẩm Nhật Bản chính hãng.', 'sos-beauty' ),
		'icon'  => '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
	),
	array(
		'key'   => 'email',
		'label' => __( 'Email', 'sos-beauty' ),
		'value' => $email,
		'href'  => $email ? 'mailto:' . $email : '',
		'desc'  => __( 'Tiếp nhận hợp tác, tư vấn và hỗ trợ sau bán.', 'sos-beauty' ),
		'icon'  => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
	),
);

$store_rows = array(
	array(
		'label' => __( 'Công ty', 'sos-beauty' ),
		'value' => $site_name,
	),
	array(
		'label' => __( 'Khu vực', 'sos-beauty' ),
		'value' => $company['region'],
	),
	array(
		'label' => __( 'Giờ hỗ trợ', 'sos-beauty' ),
		'value' => __( '08:30 – 21:30 hằng ngày', 'sos-beauty' ),
	),
	array(
		'label' => __( 'Nhóm sản phẩm', 'sos-beauty' ),
		'value' => __( 'Thực phẩm, mỹ phẩm, TPCN Nhật', 'sos-beauty' ),
	),
);
?>

<main id="primary" class="beauty-contact">
	<div class="beauty-contact__layout">

		<section class="beauty-contact__panel beauty-contact__panel--main" aria-labelledby="beauty-contact-heading">
			<header class="beauty-contact__header">
				<p class="beauty-contact__eyebrow"><?php esc_html_e( 'Kênh liên hệ chính', 'sos-beauty' ); ?></p>
				<h1 id="beauty-contact-heading" class="beauty-contact__title"><?php esc_html_e( 'Chúng tôi sẵn sàng hỗ trợ', 'sos-beauty' ); ?></h1>
				<p class="beauty-contact__lead">
					<?php esc_html_e( 'Gửi thông tin sản phẩm bạn quan tâm hoặc nhu cầu sử dụng, JP Bùi Đặng sẽ tư vấn chọn thực phẩm, mỹ phẩm và TPCN Nhật Bản phù hợp.', 'sos-beauty' ); ?>
				</p>
			</header>

			<ul class="beauty-contact__channels">
				<?php foreach ( $channels as $channel ) : ?>
					<?php if ( empty( $channel['value'] ) ) { continue; } ?>
					<li class="beauty-contact__channel">
						<span class="beauty-contact__channel-icon" aria-hidden="true"><?php echo $channel['icon']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inline SVG ?></span>
						<span class="beauty-contact__channel-label"><?php echo esc_html( $channel['label'] ); ?></span>
						<?php if ( ! empty( $channel['href'] ) ) : ?>
							<a class="beauty-contact__channel-value" href="<?php echo esc_url( $channel['href'] ); ?>"<?php echo in_array( $channel['key'], array( 'zalo', 'facebook' ), true ) ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
								<?php echo esc_html( $channel['value'] ); ?>
							</a>
						<?php else : ?>
							<span class="beauty-contact__channel-value"><?php echo esc_html( $channel['value'] ); ?></span>
						<?php endif; ?>
						<span class="beauty-contact__channel-desc"><?php echo esc_html( $channel['desc'] ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</section>

		<aside class="beauty-contact__panel beauty-contact__panel--side" aria-label="<?php esc_attr_e( 'Thông tin cửa hàng', 'sos-beauty' ); ?>">
			<div class="beauty-contact__store">
				<p class="beauty-contact__eyebrow"><?php esc_html_e( 'Thông tin cửa hàng', 'sos-beauty' ); ?></p>
				<dl class="beauty-contact__meta">
					<?php foreach ( $store_rows as $row ) : ?>
						<div class="beauty-contact__meta-row">
							<dt><?php echo esc_html( $row['label'] ); ?></dt>
							<dd><?php echo esc_html( $row['value'] ); ?></dd>
						</div>
					<?php endforeach; ?>
					<?php if ( $address ) : ?>
						<div class="beauty-contact__meta-row">
							<dt><?php esc_html_e( 'Địa chỉ', 'sos-beauty' ); ?></dt>
							<dd><?php echo esc_html( $address ); ?></dd>
						</div>
					<?php endif; ?>
				</dl>
			</div>

			<?php if ( $zalo ) : ?>
				<div class="beauty-contact__cta">
					<h2 class="beauty-contact__cta-title"><?php esc_html_e( 'Cần tư vấn chọn quà hoặc sản phẩm?', 'sos-beauty' ); ?></h2>
					<p class="beauty-contact__cta-text"><?php esc_html_e( 'Gửi ngân sách, gu dùng và mục đích qua Zalo để nhận gợi ý nhanh.', 'sos-beauty' ); ?></p>
					<a class="beauty-contact__cta-btn" href="<?php echo esc_url( $zalo ); ?>" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e( 'Nhắn Zalo', 'sos-beauty' ); ?>
					</a>
				</div>
			<?php endif; ?>
		</aside>

	</div>

	<section class="beauty-contact__map" aria-label="<?php esc_attr_e( 'Bản đồ cửa hàng', 'sos-beauty' ); ?>">
		<p class="beauty-contact__eyebrow"><?php esc_html_e( 'Vị trí', 'sos-beauty' ); ?></p>
		<h2 class="beauty-contact__map-title"><?php esc_html_e( 'Tìm chúng tôi trên bản đồ', 'sos-beauty' ); ?></h2>
		<div class="beauty-contact__map-frame">
			<iframe
				src="<?php echo esc_url( $company['map_embed'] ); ?>"
				title="<?php esc_attr_e( 'Bản đồ Google — vị trí cửa hàng', 'sos-beauty' ); ?>"
				loading="lazy"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>
	</section>
</main>

<?php
get_footer();
