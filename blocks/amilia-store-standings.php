<?php

function amilia_store_standings_block_init() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = dirname( __FILE__ );

	$index_js = 'amilia-store-standings.js';
	wp_register_script(
		'amilia-store-standings-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);

	register_block_type( 'amilia-store/amilia-store-standings', array(
		'editor_script' => 'amilia-store-standings-block-editor',
		'attributes' => array(
			'url' => array('type' => 'string'),
			'api' => array('type' => 'string'),
			'sport' => array('type' => 'string'),
			'show' => array('type' => 'string'),
			'program' => array('type' => 'string'),
			'show-hidden' => array('type' => 'string'),
			'tags' => array('type' => 'string')
		),
		'render_callback' => 'amilia_store_standings_shortcode_handler'
	) );
}
add_action( 'init', 'amilia_store_standings_block_init' );
