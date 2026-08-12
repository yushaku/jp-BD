<?php
/**
 * Floating contact dock — Zalo, Facebook, phone.
 */

defined( 'ABSPATH' ) || exit;

$phone_raw = get_theme_mod( 'sos_beauty_footer_hotline', '0901 234 567' );
$phone_tel = preg_replace( '/\D+/', '', $phone_raw );
if ( strlen( $phone_tel ) === 10 && '0' === $phone_tel[0] ) {
	$phone_tel = '84' . substr( $phone_tel, 1 );
}

$zalo = get_theme_mod( 'sos_beauty_float_zalo', '' );
if ( ! $zalo && $phone_tel ) {
	$zalo = 'https://zalo.me/' . $phone_tel;
}

$facebook = get_theme_mod( 'sos_beauty_float_facebook', 'https://www.facebook.com/' );
$phone_href = $phone_tel ? 'tel:+' . $phone_tel : '';

$items = array();

if ( $zalo ) {
	$items[] = array(
		'key'   => 'zalo',
		'href'  => $zalo,
		'label' => __( 'Chat Zalo', 'sos-beauty' ),
		'icon'  => '<svg width="30" height="30" viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24.1 6C13.5 6 5 13.6 5 23c0 5.1 2.5 9.7 6.5 12.8-.2.9-.8 3.4-1 4.1-.2.9.3 1.1 1.1.7.6-.3 3.5-2.1 4.9-3 1.5.4 3.1.6 4.7.6 10.6 0 19.1-7.6 19.1-17S34.7 6 24.1 6zm-6.9 18.6c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-6.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v6.6zm4.7 0c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-6.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v6.6zm6.8 1.3c-.7 0-1.3-.6-1.3-1.3v-3.4l-3.5 4.2c-.2.2-.5.4-.8.4h-.2c-.7 0-1.3-.6-1.3-1.3v-6.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v3.4l3.5-4.2c.2-.2.5-.4.8-.4h.2c.7 0 1.3.6 1.3 1.3v6.6c0 .7-.6 1.3-1.3 1.3zm6.2-1.7c0 .9-.7 1.7-1.7 1.7h-2.6c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h1.3v-1.1h-1.3c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h1.3v-1.1h-1.3c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3h2.6c.9 0 1.7.7 1.7 1.7v6.6z"/></svg>',
	);
}

if ( $facebook ) {
	$items[] = array(
		'key'   => 'facebook',
		'href'  => $facebook,
		'label' => __( 'Facebook', 'sos-beauty' ),
		'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
	);
}

if ( $phone_href ) {
	$items[] = array(
		'key'   => 'phone',
		'href'  => $phone_href,
		'label' => sprintf( __( 'Gọi %s', 'sos-beauty' ), $phone_raw ),
		'icon'  => '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>',
	);
}

if ( empty( $items ) ) {
	return;
}
?>

<nav class="beauty-float-contact" aria-label="<?php esc_attr_e( 'Liên hệ nhanh', 'sos-beauty' ); ?>">
	<?php foreach ( $items as $item ) : ?>
		<a
			class="beauty-float-contact__btn beauty-float-contact__btn--<?php echo esc_attr( $item['key'] ); ?>"
			href="<?php echo esc_url( $item['href'] ); ?>"
			<?php echo in_array( $item['key'], array( 'zalo', 'facebook' ), true ) ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>
			aria-label="<?php echo esc_attr( $item['label'] ); ?>"
			title="<?php echo esc_attr( $item['label'] ); ?>"
		>
			<span class="beauty-float-contact__icon"><?php echo $item['icon']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inline SVG ?></span>
			<span class="beauty-float-contact__tip"><?php echo esc_html( $item['label'] ); ?></span>
		</a>
	<?php endforeach; ?>
</nav>
