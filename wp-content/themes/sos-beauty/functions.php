<?php
/**
 * JP Bùi Đặng — child theme functions.
 */

defined( 'ABSPATH' ) || exit;

define( 'SOS_BEAUTY_VERSION', '1.6.3' );

/**
 * Brand logo / favicon paths (theme assets).
 * logo.jpg = header/footer + site icon; favicon.ico = tab icon.
 */
function sos_beauty_logo_path() {
	return get_stylesheet_directory() . '/assets/images/logo.jpg';
}

function sos_beauty_logo_uri() {
	return get_stylesheet_directory_uri() . '/assets/images/logo.jpg';
}

function sos_beauty_favicon_uri() {
	return get_stylesheet_directory_uri() . '/assets/images/favicon.ico';
}

/**
 * Favicon: theme .ico always; WP site_icon still wins for apple-touch when set.
 */
function sos_beauty_favicon_links() {
	$ico = sos_beauty_favicon_uri();
	echo '<link rel="icon" href="' . esc_url( $ico ) . '" sizes="any">' . "\n";
	echo '<link rel="shortcut icon" href="' . esc_url( $ico ) . '">' . "\n";
}
add_action( 'wp_head', 'sos_beauty_favicon_links', 1 );
add_action( 'admin_head', 'sos_beauty_favicon_links', 1 );
add_action( 'login_head', 'sos_beauty_favicon_links', 1 );

/**
 * Custom logo + brand wordmark "JPBuiDang".
 */
function sos_beauty_custom_logo( $html ) {
	if ( ! $html ) {
		if ( ! file_exists( sos_beauty_logo_path() ) ) {
			return $html;
		}
		$alt = get_bloginfo( 'name', 'display' );
		$html = sprintf(
			'<a href="%1$s" class="custom-logo-link" rel="home"><img src="%2$s" class="custom-logo" alt="%3$s" width="1000" height="1000" decoding="async" /></a>',
			esc_url( home_url( '/' ) ),
			esc_url( sos_beauty_logo_uri() ),
			esc_attr( $alt )
		);
	}

	if ( false !== strpos( $html, 'beauty-brand__name' ) ) {
		return $html;
	}

	$html = str_replace( 'class="custom-logo-link"', 'class="custom-logo-link beauty-brand"', $html );
	$html = preg_replace(
		'#</a>#',
		'<span class="beauty-brand__name">' . esc_html( 'JPBuiDang' ) . '</span></a>',
		$html,
		1
	);

	return $html;
}
add_filter( 'get_custom_logo', 'sos_beauty_custom_logo' );

/**
 * Hide Storefront header cart (price + item count in primary nav).
 */
function sos_beauty_remove_header_cart() {
	remove_action( 'storefront_header', 'storefront_header_cart', 60 );
}
add_action( 'init', 'sos_beauty_remove_header_cart' );

/**
 * Logo + primary menu on one header row (search removed).
 */
function sos_beauty_header_one_line() {
	remove_action( 'storefront_header', 'storefront_site_branding', 20 );
	remove_action( 'storefront_header', 'storefront_product_search', 40 );
	add_action( 'storefront_header', 'storefront_site_branding', 45 );
}
add_action( 'init', 'sos_beauty_header_one_line' );

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
 * Skip link for keyboard users.
 */
function sos_beauty_skip_link() {
	echo '<a class="beauty-skip-link screen-reader-text" href="#primary">' . esc_html__( 'Chuyển tới nội dung', 'sos-beauty' ) . '</a>';
}
add_action( 'wp_body_open', 'sos_beauty_skip_link', 5 );

/**
 * Enqueue theme scripts.
 */
function sos_beauty_enqueue_scripts() {
	$uri = get_stylesheet_directory_uri();

	wp_enqueue_script(
		'sos-beauty-header-scroll',
		$uri . '/assets/js/header-scroll.js',
		array(),
		SOS_BEAUTY_VERSION,
		true
	);

	wp_enqueue_script(
		'sos-beauty-back-to-top',
		$uri . '/assets/js/back-to-top.js',
		array(),
		SOS_BEAUTY_VERSION,
		true
	);

	if ( is_front_page() ) {
		wp_enqueue_script(
			'sos-beauty-promo-countdown',
			$uri . '/assets/js/promo-countdown.js',
			array(),
			SOS_BEAUTY_VERSION,
			true
		);
	}

	if ( is_product() ) {
		wp_enqueue_script(
			'sos-beauty-sticky-atc',
			$uri . '/assets/js/sticky-atc.js',
			array(),
			SOS_BEAUTY_VERSION,
			true
		);
	}
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
			'title'    => '⚠ ' . __( 'Lưu ý TPCN', 'sos-beauty' ),
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

/**
 * Resolve promo tile href (category path or site URL).
 */
function sos_beauty_promo_url( $href ) {
	if ( empty( $href ) ) {
		return wc_get_page_permalink( 'shop' );
	}
	if ( preg_match( '#/category/([^/]+)/?$#', $href, $matches ) ) {
		return sos_beauty_category_link( $matches[1] );
	}
	if ( preg_match( '#^https?://#i', $href ) ) {
		return esc_url( $href );
	}
	return esc_url( home_url( $href ) );
}

/**
 * Attachment URL for promo background images.
 */
function sos_beauty_promo_image_url( $attachment_id ) {
	if ( ! $attachment_id ) {
		return '';
	}
	$url = wp_get_attachment_image_url( (int) $attachment_id, 'large' );
	return $url ? $url : '';
}

/**
 * Sale badge shows percentage when possible.
 */
function sos_beauty_sale_flash( $html, $post, $product ) {
	if ( ! $product || ! $product->is_on_sale() ) {
		return $html;
	}
	$regular = (float) $product->get_regular_price();
	$sale    = (float) $product->get_sale_price();
	if ( $regular > 0 && $sale > 0 && $sale < $regular ) {
		$pct = round( ( ( $regular - $sale ) / $regular ) * 100 );
		return '<span class="onsale">-' . esc_html( $pct ) . '%</span>';
	}
	return $html;
}
add_filter( 'woocommerce_sale_flash', 'sos_beauty_sale_flash', 10, 3 );

/**
 * Loop add-to-cart button: cart icon with accessible label.
 */
function sos_beauty_loop_atc_icon( $html, $product, $args ) {
	$icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.5 3h2l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h9.9a1.5 1.5 0 0 0 1.5-1.2L21.5 8H6"/></svg>';

	$attributes = isset( $args['attributes'] ) ? $args['attributes'] : array();
	if ( empty( $attributes['aria-label'] ) ) {
		$attributes['aria-label'] = $product->add_to_cart_text();
	}
	$attributes['title'] = $product->add_to_cart_text();

	return sprintf(
		'<a href="%s" data-quantity="%s" class="%s" %s>%s</a>',
		esc_url( $product->add_to_cart_url() ),
		esc_attr( isset( $args['quantity'] ) ? $args['quantity'] : 1 ),
		esc_attr( isset( $args['class'] ) ? $args['class'] : 'button' ),
		wc_implode_html_attributes( $attributes ),
		$icon
	);
}
add_filter( 'woocommerce_loop_add_to_cart_link', 'sos_beauty_loop_atc_icon', 10, 3 );

/**
 * Category filter chips on shop archive (top-level + context children).
 */
function sos_beauty_shop_filters() {
	if ( ! is_shop() && ! is_product_category() ) {
		return;
	}
	if ( sos_beauty_shop_filters_once() ) {
		return;
	}

	$shop_url = wc_get_page_permalink( 'shop' );
	$top      = array(
		'my-pham-nhat'    => __( 'Mỹ phẩm', 'sos-beauty' ),
		'hang-tieu-dung'  => __( 'Hàng tiêu dùng', 'sos-beauty' ),
		'thuc-pham-nhat'  => __( 'Thực phẩm', 'sos-beauty' ),
	);

	$current = is_product_category() ? get_queried_object() : null;

	echo '<nav class="beauty-shop-filters" aria-label="' . esc_attr__( 'Lọc danh mục', 'sos-beauty' ) . '">';
	printf(
		'<a class="beauty-shop-filters__link%s" href="%s">%s</a>',
		esc_attr( is_shop() ? ' beauty-shop-filters__link--active' : '' ),
		esc_url( $shop_url ),
		esc_html__( 'Tất cả', 'sos-beauty' )
	);

	foreach ( $top as $slug => $label ) {
		$url    = sos_beauty_category_link( $slug );
		$active = sos_beauty_is_cat_context( $slug, $current ) ? ' beauty-shop-filters__link--active' : '';
		printf(
			'<a class="beauty-shop-filters__link%s" href="%s">%s</a>',
			esc_attr( $active ),
			esc_url( $url ),
			esc_html( $label )
		);
	}
	echo '</nav>';

	$sub = sos_beauty_shop_subchips( $current );
	if ( empty( $sub ) ) {
		return;
	}

	echo '<nav class="beauty-shop-filters beauty-shop-filters--sub" aria-label="' . esc_attr__( 'Danh mục con', 'sos-beauty' ) . '">';
	foreach ( $sub as $term ) {
		$active = ( $current && (int) $current->term_id === (int) $term->term_id )
			? ' beauty-shop-filters__link--active'
			: '';
		printf(
			'<a class="beauty-shop-filters__link%s" href="%s">%s</a>',
			esc_attr( $active ),
			esc_url( get_term_link( $term ) ),
			esc_html( $term->name )
		);
	}
	echo '</nav>';
}
add_action( 'woocommerce_archive_description', 'sos_beauty_shop_filters', 25 );
add_action( 'woocommerce_before_shop_loop', 'sos_beauty_shop_filters', 15 );
add_action( 'woocommerce_no_products_found', 'sos_beauty_shop_filters', 5 );

/**
 * Prevent double-render when multiple WC archive hooks fire.
 *
 * @return bool True if already rendered.
 */
function sos_beauty_shop_filters_once() {
	static $done = false;
	if ( $done ) {
		return true;
	}
	$done = true;
	return false;
}

/**
 * Whether current archive is this category or a descendant.
 */
function sos_beauty_is_cat_context( $slug, $current = null ) {
	$term = get_term_by( 'slug', $slug, 'product_cat' );
	if ( ! $term || is_wp_error( $term ) ) {
		return false;
	}
	if ( ! $current || empty( $current->term_id ) ) {
		return false;
	}
	if ( (int) $current->term_id === (int) $term->term_id ) {
		return true;
	}
	return term_is_ancestor_of( $term, $current, 'product_cat' );
}

/**
 * Sub-chip terms for current beauty / goods context.
 *
 * @param WP_Term|null $current Current product_cat term.
 * @return WP_Term[]
 */
function sos_beauty_shop_subchips( $current ) {
	if ( ! $current || empty( $current->term_id ) ) {
		return array();
	}

	$beauty = get_term_by( 'slug', 'my-pham-nhat', 'product_cat' );
	$goods  = get_term_by( 'slug', 'hang-tieu-dung', 'product_cat' );

	$parent_for_children = null;

	if ( $beauty && ! is_wp_error( $beauty ) && sos_beauty_is_cat_context( 'my-pham-nhat', $current ) ) {
		// On Mỹ phẩm root → mid groups; on mid group → leaves; on leaf → siblings.
		if ( (int) $current->term_id === (int) $beauty->term_id ) {
			$parent_for_children = (int) $beauty->term_id;
		} elseif ( (int) $current->parent === (int) $beauty->term_id ) {
			$parent_for_children = (int) $current->term_id;
		} else {
			$parent_for_children = (int) $current->parent;
		}
	} elseif ( $goods && ! is_wp_error( $goods ) && sos_beauty_is_cat_context( 'hang-tieu-dung', $current ) ) {
		if ( (int) $current->term_id === (int) $goods->term_id ) {
			$parent_for_children = (int) $goods->term_id;
		} else {
			$parent_for_children = (int) $current->parent;
		}
	}

	if ( ! $parent_for_children ) {
		return array();
	}

	$children = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'parent'     => $parent_for_children,
			'hide_empty' => false,
			'orderby'    => 'name',
			'order'      => 'ASC',
		)
	);

	return ( ! is_wp_error( $children ) && $children ) ? $children : array();
}

/**
 * Trust micro-copy below add-to-cart on PDP.
 */
function sos_beauty_pdp_trust() {
	echo '<p class="beauty-pdp-trust">' . esc_html__( 'Giao 2–3 ngày · Đổi trả 7 ngày', 'sos-beauty' ) . '</p>';
}
add_action( 'woocommerce_after_add_to_cart_button', 'sos_beauty_pdp_trust' );

/**
 * Free-shipping progress bar in cart.
 */
function sos_beauty_free_shipping_minimum() {
	if ( ! class_exists( 'WC_Shipping_Zones' ) ) {
		return 0;
	}
	$zones = WC_Shipping_Zones::get_zones();
	foreach ( $zones as $zone ) {
		foreach ( $zone['shipping_methods'] as $method ) {
			if ( 'free_shipping' === $method->id && $method->is_enabled() ) {
				$min = $method->get_option( 'min_amount' );
				if ( $min ) {
					return (float) $min;
				}
			}
		}
	}
	$zone = new WC_Shipping_Zone( 0 );
	foreach ( $zone->get_shipping_methods() as $method ) {
		if ( 'free_shipping' === $method->id && $method->is_enabled() ) {
			$min = $method->get_option( 'min_amount' );
			if ( $min ) {
				return (float) $min;
			}
		}
	}
	return 0;
}

function sos_beauty_free_shipping_bar() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return;
	}
	$min = sos_beauty_free_shipping_minimum();
	if ( $min <= 0 ) {
		return;
	}
	$subtotal = (float) WC()->cart->get_displayed_subtotal();
	$pct      = min( 100, round( ( $subtotal / $min ) * 100 ) );
	$remain   = max( 0, $min - $subtotal );
	echo '<div class="beauty-shipping-bar" role="progressbar" aria-valuenow="' . esc_attr( $pct ) . '" aria-valuemin="0" aria-valuemax="100">';
	if ( $remain > 0 ) {
		echo '<p class="beauty-shipping-bar__text">' . esc_html( sprintf( __( 'Còn %s để được freeship', 'sos-beauty' ), wc_price( $remain ) ) ) . '</p>';
	} else {
		echo '<p class="beauty-shipping-bar__text">' . esc_html__( 'Bạn đã được miễn phí vận chuyển!', 'sos-beauty' ) . '</p>';
	}
	echo '<span class="beauty-shipping-bar__track"><span class="beauty-shipping-bar__fill" style="width:' . esc_attr( $pct ) . '%"></span></span>';
	echo '</div>';
}
add_action( 'woocommerce_before_cart_totals', 'sos_beauty_free_shipping_bar' );

/**
 * Customizer: footer contact + BCT link.
 */
function sos_beauty_footer_customize( $wp_customize ) {
	$wp_customize->add_section(
		'sos_beauty_footer',
		array(
			'title'    => __( 'JP Bùi Đặng Footer', 'sos-beauty' ),
			'priority' => 32,
		)
	);

	$fields = array(
		'sos_beauty_footer_address' => array(
			'default' => '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
			'label'   => 'Địa chỉ công ty',
		),
		'sos_beauty_footer_hotline' => array(
			'default' => '0901 234 567',
			'label'   => 'Hotline (float phone + Zalo mặc định)',
		),
		'sos_beauty_footer_email'   => array(
			'default' => 'support@jpbuydang.vn',
			'label'   => 'Email',
		),
		'sos_beauty_footer_bct_url' => array(
			'default' => 'http://online.gov.vn',
			'label'   => 'Link Bộ Công Thương',
		),
		'sos_beauty_float_zalo'     => array(
			'default' => '',
			'label'   => 'Zalo URL (để trống = zalo.me/hotline)',
		),
		'sos_beauty_float_facebook' => array(
			'default' => 'https://www.facebook.com/',
			'label'   => 'Facebook / Messenger URL',
		),
	);

	foreach ( $fields as $id => $field ) {
		$sanitize = ( false !== strpos( $id, '_url' ) || false !== strpos( $id, '_zalo' ) || false !== strpos( $id, '_facebook' ) )
			? 'esc_url_raw'
			: 'sanitize_text_field';
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $field['default'],
				'sanitize_callback' => $sanitize,
			)
		);
		$wp_customize->add_control(
			$id,
			array(
				'label'   => $field['label'],
				'section' => 'sos_beauty_footer',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', 'sos_beauty_footer_customize' );

/**
 * Floating contact dock (Zalo / Facebook / phone).
 */
function sos_beauty_render_float_contact() {
	get_template_part( 'template-parts/float-contact' );
}
add_action( 'wp_footer', 'sos_beauty_render_float_contact', 20 );

/**
 * Contact page: drop Storefront breadcrumb (custom layout has own hierarchy).
 */
function sos_beauty_contact_page_cleanup() {
	if ( ! is_page( 'lien-he' ) ) {
		return;
	}
	remove_action( 'storefront_before_content', 'woocommerce_breadcrumb', 10 );
	remove_action( 'storefront_before_content', 'storefront_breadcrumb', 10 );
}
add_action( 'wp', 'sos_beauty_contact_page_cleanup' );

/**
 * Body class for contact page styling hooks.
 */
function sos_beauty_contact_body_class( $classes ) {
	if ( is_page( 'lien-he' ) ) {
		$classes[] = 'beauty-page-contact';
	}
	return $classes;
}
add_filter( 'body_class', 'sos_beauty_contact_body_class' );

/**
 * Replace default Storefront footer widgets with structured site footer.
 */
function sos_beauty_remove_default_footer_widgets() {
	remove_action( 'storefront_footer', 'storefront_footer_widgets', 10 );
}
add_action( 'init', 'sos_beauty_remove_default_footer_widgets' );

function sos_beauty_render_site_footer() {
	get_template_part( 'template-parts/site-footer' );
}
add_action( 'storefront_footer', 'sos_beauty_render_site_footer', 10 );

/**
 * Newsletter signup — stores email as post meta list option; emails admin.
 */
function sos_beauty_handle_newsletter() {
	if ( ! isset( $_POST['sos_beauty_newsletter_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['sos_beauty_newsletter_nonce'] ) ), 'sos_beauty_newsletter' ) ) {
		wp_safe_redirect( home_url( '/' ) );
		exit;
	}

	$email = isset( $_POST['newsletter_email'] ) ? sanitize_email( wp_unslash( $_POST['newsletter_email'] ) ) : '';
	if ( ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'newsletter', 'invalid', wp_get_referer() ? wp_get_referer() : home_url( '/' ) ) );
		exit;
	}

	$list = get_option( 'sos_beauty_newsletter_emails', array() );
	if ( ! is_array( $list ) ) {
		$list = array();
	}
	if ( ! in_array( $email, $list, true ) ) {
		$list[] = $email;
		update_option( 'sos_beauty_newsletter_emails', $list, false );
		wp_mail(
			get_option( 'admin_email' ),
			sprintf( '[%s] Đăng ký nhận tin', get_bloginfo( 'name' ) ),
			sprintf( "Email mới đăng ký nhận bản tin: %s", $email )
		);
	}

	$redirect = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	wp_safe_redirect( add_query_arg( 'newsletter', 'ok', $redirect ) );
	exit;
}
add_action( 'admin_post_nopriv_sos_beauty_newsletter', 'sos_beauty_handle_newsletter' );
add_action( 'admin_post_sos_beauty_newsletter', 'sos_beauty_handle_newsletter' );
