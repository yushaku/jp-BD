<?php
/**
 * JP Bùi Đặng — child theme functions.
 */

defined( 'ABSPATH' ) || exit;

define( 'SOS_BEAUTY_VERSION', '1.1.2' );

/**
 * Disable wp_page_menu fallback for handheld nav (prevents duplicate page list).
 */
function sos_beauty_nav_menu_args( $args ) {
	if ( isset( $args['theme_location'] ) && 'handheld' === $args['theme_location'] && empty( $args['fallback_cb'] ) ) {
		$args['fallback_cb'] = false;
	}
	if ( isset( $args['theme_location'] ) && 'handheld' === $args['theme_location'] && ! has_nav_menu( 'handheld' ) ) {
		$args['fallback_cb'] = false;
	}
	return $args;
}
add_filter( 'wp_nav_menu_args', 'sos_beauty_nav_menu_args' );

/**
 * Enqueue parent + child styles and fonts (Vietnamese).
 */
function sos_beauty_enqueue_styles() {
	$parent = 'storefront-style';
	$parent_ver = wp_get_theme( 'storefront' )->get( 'Version' );

	wp_enqueue_style( $parent, get_template_directory_uri() . '/style.css', array(), $parent_ver );
	wp_enqueue_style(
		'sos-beauty-fonts',
		'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Lora:wght@500;600&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'sos-beauty-style',
		get_stylesheet_uri(),
		array( $parent, 'sos-beauty-fonts' ),
		SOS_BEAUTY_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'sos_beauty_enqueue_styles', 20 );

/**
 * Header scroll behavior (hide on scroll down, show on scroll up).
 */
function sos_beauty_enqueue_scripts() {
	wp_enqueue_script(
		'sos-beauty-header-scroll',
		get_stylesheet_directory_uri() . '/assets/js/header-scroll.js',
		array(),
		SOS_BEAUTY_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'sos_beauty_enqueue_scripts' );

/**
 * WooCommerce: 4 columns on desktop, show result count.
 */
function sos_beauty_loop_columns() {
	return 4;
}
add_filter( 'loop_shop_columns', 'sos_beauty_loop_columns' );

function sos_beauty_products_per_page() {
	return 12;
}
add_filter( 'loop_shop_per_page', 'sos_beauty_products_per_page' );

/**
 * Add custom product tabs for cosmetics.
 */
function sos_beauty_product_tabs( $tabs ) {
	$tabs['ingredients'] = array(
		'title'    => __( 'Thành phần', 'sos-beauty' ),
		'priority' => 15,
		'callback' => 'sos_beauty_ingredients_tab',
	);

	$tabs['how_to_use'] = array(
		'title'    => __( 'Cách dùng', 'sos-beauty' ),
		'priority' => 20,
		'callback' => 'sos_beauty_how_to_use_tab',
	);

	if ( has_term( 'tpcn', 'product_cat', get_the_ID() ) ) {
		$tabs['supplement_note'] = array(
			'title'    => __( 'Lưu ý TPCN', 'sos-beauty' ),
			'priority' => 25,
			'callback' => 'sos_beauty_supplement_tab',
		);
	}

	return $tabs;
}
add_filter( 'woocommerce_product_tabs', 'sos_beauty_product_tabs' );

function sos_beauty_ingredients_tab() {
	$ingredients = get_post_meta( get_the_ID(), '_sos_ingredients', true );
	if ( $ingredients ) {
		echo '<div class="beauty-tab-content">' . wp_kses_post( wpautop( $ingredients ) ) . '</div>';
		return;
	}
	echo '<p>' . esc_html__( 'Sản phẩm chính hãng, thành phần an toàn cho da. Liên hệ shop để biết chi tiết INCI.', 'sos-beauty' ) . '</p>';
}

function sos_beauty_how_to_use_tab() {
	$usage = get_post_meta( get_the_ID(), '_sos_how_to_use', true );
	if ( $usage ) {
		echo '<div class="beauty-tab-content">' . wp_kses_post( wpautop( $usage ) ) . '</div>';
		return;
	}
	echo '<p>' . esc_html__( 'Làm sạch da trước khi dùng. Thoa lớp mỏng, massage nhẹ. Dùng sáng và/hoặc tối tùy loại sản phẩm.', 'sos-beauty' ) . '</p>';
}

function sos_beauty_supplement_tab() {
	$note = get_post_meta( get_the_ID(), '_sos_supplement_note', true );
	echo '<div class="beauty-tab-content beauty-tab-content--supplement">';
	if ( $note ) {
		echo wp_kses_post( wpautop( $note ) );
	} else {
		echo '<p>' . esc_html__( 'Thực phẩm chức năng không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh. Không dùng quá liều khuyến cáo. Bảo quản nơi khô ráo, thoáng mát.', 'sos-beauty' ) . '</p>';
	}
	echo '</div>';
}

/**
 * Show volume/size after product title on archive.
 */
function sos_beauty_show_volume() {
	global $product;
	$volume = $product->get_attribute( 'pa_dung-tich' );
	if ( ! $volume ) {
		$volume = $product->get_attribute( 'dung-tich' );
	}
	if ( $volume ) {
		echo '<span class="beauty-volume">' . esc_html( $volume ) . '</span>';
	}
}
add_action( 'woocommerce_after_shop_loop_item_title', 'sos_beauty_show_volume', 6 );

/**
 * Register product attribute for volume (used by setup script).
 */
function sos_beauty_register_attributes() {
	if ( ! function_exists( 'wc_create_attribute' ) ) {
		return;
	}

	$slug = 'pa_dung-tich';
	$exists = wc_get_attribute_taxonomies();
	foreach ( $exists as $attr ) {
		if ( 'dung-tich' === $attr->attribute_name ) {
			return;
		}
	}

	wc_create_attribute(
		array(
			'name'         => 'Dung tích',
			'slug'         => 'dung-tich',
			'type'         => 'select',
			'order_by'     => 'menu_order',
			'has_archives' => false,
		)
	);
}
add_action( 'init', 'sos_beauty_register_attributes', 20 );

/**
 * Footer widget area for beauty shop info.
 */
function sos_beauty_widgets() {
	register_sidebar(
		array(
			'name'          => __( 'JP Bùi Đặng Footer', 'sos-beauty' ),
			'id'            => 'beauty-footer',
			'description'   => __( 'Thông tin cửa hàng ở footer.', 'sos-beauty' ),
			'before_widget' => '<div class="beauty-footer-widget">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="widget-title">',
			'after_title'   => '</h4>',
		)
	);
}
add_action( 'widgets_init', 'sos_beauty_widgets' );

/**
 * Customizer: hero text.
 */
function sos_beauty_customize( $wp_customize ) {
	$wp_customize->add_section(
		'sos_beauty_hero',
		array(
			'title'    => __( 'JP Bùi Đặng Hero', 'sos-beauty' ),
			'priority' => 30,
		)
	);

	$fields = array(
		'sos_beauty_hero_eyebrow'  => array( 'default' => 'JP Bùi Đặng', 'label' => 'Hero eyebrow' ),
		'sos_beauty_hero_title'    => array( 'default' => 'Thực phẩm, mỹ phẩm & TPCN chính hãng từ Nhật Bản', 'label' => 'Hero title' ),
		'sos_beauty_hero_subtitle' => array( 'default' => 'Nguồn hàng Nhật Bản uy tín — thực phẩm tươi lành, J-Beauty và thực phẩm bổ sung an toàn.', 'label' => 'Hero subtitle' ),
		'sos_beauty_hero_cta'      => array( 'default' => 'Khám phá ngay', 'label' => 'Hero CTA text' ),
	);

	foreach ( $fields as $id => $field ) {
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $field['default'],
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			$id,
			array(
				'label'   => $field['label'],
				'section' => 'sos_beauty_hero',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', 'sos_beauty_customize' );

/**
 * Customizer: home promo hero grid (Next.js AnnouncementBar).
 */
function sos_beauty_promo_customize( $wp_customize ) {
	$wp_customize->add_section(
		'sos_beauty_promo_hero',
		array(
			'title'    => __( 'JP Bùi Đặng Promo Hero', 'sos-beauty' ),
			'priority' => 31,
		)
	);

	$feature_fields = array(
		'sos_beauty_promo_feature_title'    => array(
			'default' => 'Giảm đến 25% mỹ phẩm & TPCN Nhật',
			'label'   => 'Feature — tiêu đề',
		),
		'sos_beauty_promo_feature_subtitle' => array(
			'default' => 'Deal tốt cho skincare, vitamin và đặc sản Nhật Bản.',
			'label'   => 'Feature — mô tả',
		),
		'sos_beauty_promo_feature_cta'      => array(
			'default' => 'Mua ngay',
			'label'   => 'Feature — nút CTA',
		),
		'sos_beauty_promo_feature_href'     => array(
			'default' => '/category/my-pham-nhat',
			'label'   => 'Feature — link (vd. /category/my-pham-nhat)',
		),
		'sos_beauty_promo_feature_alt'      => array(
			'default' => 'Mỹ phẩm Nhật Bản chính hãng',
			'label'   => 'Feature — alt ảnh',
		),
	);

	foreach ( $feature_fields as $id => $field ) {
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $field['default'],
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			$id,
			array(
				'label'   => $field['label'],
				'section' => 'sos_beauty_promo_hero',
				'type'    => 'text',
			)
		);
	}

	$wp_customize->add_setting(
		'sos_beauty_promo_feature_image',
		array(
			'default'           => 0,
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Media_Control(
			$wp_customize,
			'sos_beauty_promo_feature_image',
			array(
				'label'     => 'Feature — ảnh nền',
				'section'   => 'sos_beauty_promo_hero',
				'mime_type' => 'image',
			)
		)
	);

	$countdown_fields = array(
		'sos_beauty_promo_countdown_title' => array(
			'default' => 'Mỹ phẩm J-Beauty',
			'label'   => 'Countdown — tiêu đề',
		),
		'sos_beauty_promo_countdown_end'   => array(
			'default' => '2026-09-30T23:59:59+07:00',
			'label'   => 'Countdown — kết thúc (ISO 8601)',
		),
		'sos_beauty_promo_countdown_cta'   => array(
			'default' => 'Mua ngay',
			'label'   => 'Countdown — nút CTA',
		),
		'sos_beauty_promo_countdown_href'  => array(
			'default' => '/category/my-pham-nhat',
			'label'   => 'Countdown — link',
		),
		'sos_beauty_promo_countdown_alt'   => array(
			'default' => 'Ưu đãi mỹ phẩm Nhật Bản',
			'label'   => 'Countdown — alt ảnh',
		),
	);

	foreach ( $countdown_fields as $id => $field ) {
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $field['default'],
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			$id,
			array(
				'label'   => $field['label'],
				'section' => 'sos_beauty_promo_hero',
				'type'    => 'text',
			)
		);
	}

	$wp_customize->add_setting(
		'sos_beauty_promo_countdown_image',
		array(
			'default'           => 0,
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Media_Control(
			$wp_customize,
			'sos_beauty_promo_countdown_image',
			array(
				'label'     => 'Countdown — ảnh nền',
				'section'   => 'sos_beauty_promo_hero',
				'mime_type' => 'image',
			)
		)
	);

	for ( $i = 1; $i <= 2; $i++ ) {
		$side_defaults = array(
			1 => array(
				'title'    => 'TPCN Nhật Bản',
				'subtitle' => 'Vitamin & collagen',
				'cta'      => 'Xem chi tiết',
				'href'     => '/category/tpcn',
				'alt'      => 'Thực phẩm chức năng Nhật Bản',
			),
			2 => array(
				'title'    => 'Thực phẩm Nhật',
				'subtitle' => 'Matcha, miso & đặc sản',
				'cta'      => 'Xem chi tiết',
				'href'     => '/category/thuc-pham-nhat',
				'alt'      => 'Thực phẩm Nhật Bản',
			),
		);

		$defaults = $side_defaults[ $i ];
		$prefix   = 'sos_beauty_promo_side_' . $i . '_';

		foreach ( $defaults as $key => $default ) {
			$id = $prefix . $key;
			$wp_customize->add_setting(
				$id,
				array(
					'default'           => $default,
					'sanitize_callback' => 'sanitize_text_field',
				)
			);
			$wp_customize->add_control(
				$id,
				array(
					'label'   => sprintf( 'Tile %d — %s', $i, $key ),
					'section' => 'sos_beauty_promo_hero',
					'type'    => 'text',
				)
			);
		}

		$wp_customize->add_setting(
			$prefix . 'image',
			array(
				'default'           => 0,
				'sanitize_callback' => 'absint',
			)
		);
		$wp_customize->add_control(
			new WP_Customize_Media_Control(
				$wp_customize,
				$prefix . 'image',
				array(
					'label'     => sprintf( 'Tile %d — ảnh nền', $i ),
					'section'   => 'sos_beauty_promo_hero',
					'mime_type' => 'image',
				)
			)
		);
	}
}
add_action( 'customize_register', 'sos_beauty_promo_customize' );

/**
 * Helper: get shop category link by slug.
 */
function sos_beauty_category_link( $slug ) {
	$term = get_term_by( 'slug', $slug, 'product_cat' );
	if ( $term && ! is_wp_error( $term ) ) {
		return get_term_link( $term );
	}
	return wc_get_page_permalink( 'shop' );
}
