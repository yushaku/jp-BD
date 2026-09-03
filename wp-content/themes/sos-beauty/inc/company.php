<?php
/**
 * Shared company contact — source of truth from demo brief.
 *
 * CÔNG TY TNHH JP- BÙI ĐẶNG
 * Địa chỉ: Tầng 1, CT2, Mễ Trì Thượng, Nam Từ Liêm, Hà Nội
 * Fanpage: https://web.facebook.com/hangnhatchomoinha.vn
 * Liên hệ: 098 5561862 - 0965180859
 * Email: jpbuidangco.ltd@gmail.com
 */

defined( 'ABSPATH' ) || exit;

const SOS_BEAUTY_COMPANY = array(
	'legal_name' => 'CÔNG TY TNHH JP- BÙI ĐẶNG',
	'address'    => 'Tầng 1, CT2, Mễ Trì Thượng, Nam Từ Liêm, Hà Nội',
	'region'     => 'Hà Nội, Việt Nam',
	'email'      => 'jpbuidangco.ltd@gmail.com',
	'phone_1'    => '098 556 1862',
	'phone_2'    => '096 518 0859',
	'facebook'   => 'https://web.facebook.com/hangnhatchomoinha.vn',
	'bct_url'    => 'http://online.gov.vn',
	'map_embed'  => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7449.122745785829!2d105.77467889861713!3d21.010212617613583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453518a98ca49%3A0x620fc4da720c399c!2zQ1QzQSBN4buFIFRyw6wgVGjGsOG7o25n!5e0!3m2!1svi!2s!4v1788453894840!5m2!1svi!2s',
);

/**
 * Company field. Theme Customizer overrides defaults when set.
 *
 * @param string|null $key Field name or null for full array.
 * @return mixed
 */
function sos_beauty_company( $key = null ) {
	static $resolved = null;

	if ( null === $resolved ) {
		$d        = SOS_BEAUTY_COMPANY;
		$phone_1  = get_theme_mod( 'sos_beauty_footer_hotline', $d['phone_1'] );
		$phone_2  = get_theme_mod( 'sos_beauty_footer_phone_2', $d['phone_2'] );
		$phones   = array_values( array_filter( array( $phone_1, $phone_2 ) ) );
		$facebook = get_theme_mod( 'sos_beauty_float_facebook', $d['facebook'] );

		$resolved = array(
			'legal_name'    => $d['legal_name'],
			'address'       => get_theme_mod( 'sos_beauty_footer_address', $d['address'] ),
			'region'        => $d['region'],
			'email'         => get_theme_mod( 'sos_beauty_footer_email', $d['email'] ),
			'phone_1'       => $phone_1,
			'phone_2'       => $phone_2,
			'phones'        => $phones,
			'phones_display'=> implode( ' - ', $phones ),
			'hotline'       => $phone_1,
			'facebook'      => $facebook,
			'bct_url'       => get_theme_mod( 'sos_beauty_footer_bct_url', $d['bct_url'] ),
			'map_embed'     => $d['map_embed'],
		);
	}

	if ( null === $key ) {
		return $resolved;
	}

	return isset( $resolved[ $key ] ) ? $resolved[ $key ] : '';
}

/**
 * tel: href from a display phone number.
 *
 * @param string $phone Display phone.
 * @return string
 */
function sos_beauty_tel_href( $phone ) {
	$digits = preg_replace( '/\D+/', '', (string) $phone );
	return $digits ? 'tel:' . $digits : '';
}

/**
 * International digits for Zalo (84…).
 *
 * @param string $phone Display phone.
 * @return string
 */
function sos_beauty_phone_intl( $phone ) {
	$digits = preg_replace( '/\D+/', '', (string) $phone );
	if ( strlen( $digits ) === 10 && '0' === $digits[0] ) {
		return '84' . substr( $digits, 1 );
	}
	return $digits;
}
