<?php

function amilia_store_calendar_block_init() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = dirname( __FILE__ );

	$index_js = 'amilia-store-calendar.js';
	wp_register_script(
		'amilia-store-calendar-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);

	register_block_type( 'amilia-store/amilia-store-calendar', array(
		'editor_script' => 'amilia-store-calendar-block-editor',
		'attributes' => array(
			'url' => array('type' => 'string'),
			'view' => array('type' => 'string'),
			'date' => array('type' => 'string'),
			'time' => array('type' => 'string'),
			'tags' => array('type' => 'string'),
			'facilities' => array('type' => 'string'),
			'show-tags-filter' => array('type' => 'string'),
			'show-facilities-filter' => array('type' => 'string'),
			'show-hidden' => array('type' => 'string'),
			'api' => array('type' => 'string')
		),
		'render_callback' => 'amilia_store_calendar_shortcode_handler'
	) );
}
add_action( 'init', 'amilia_store_calendar_block_init' );
