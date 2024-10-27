<?php

function amilia_store_iframe_block_init() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = dirname( __FILE__ );

	$index_js = 'amilia-store-iframe.js';
	wp_register_script(
		'amilia-store-iframe-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);

	register_block_type( 'amilia-store/amilia-store-iframe', array(
		'editor_script' => 'amilia-store-iframe-block-editor',
		'attributes' => array(
			'url' => array('type' => 'string'),
			'color' => array('type' => 'string')
		),
		'render_callback' => 'amilia_store_iframe_shortcode_handler'
	) );
}
add_action( 'init', 'amilia_store_iframe_block_init' );
