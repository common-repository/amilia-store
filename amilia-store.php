<?php
/*
Plugin Name: Amilia Store
Plugin URI: http://www.amilia.com/
Description: Embeds your Amilia Store inside a page or post.
Author: Martin Drapeau <martin.drapeau@amilia.com>
Copyright: 2014-2018 Amilia
Version: 2.9.8
Author URI: http://www.amilia.com/
License: Apache License 2.0
License URI: http://www.apache.org/licenses/LICENSE-2.0.html
Text Domain: amilia-store
*/

define('AMILIA_STORE_PLUGIN_VERSION', '2.9.8');

// Localization and JS bootstrap
function amilia_store_load_plugin_textdomain() {
    load_plugin_textdomain( 'amilia_store' );
}
add_action( 'plugins_loaded', 'amilia_store_load_plugin_textdomain' );
function amilia_store_bootstrap_javascript() {
    global $current_screen;

    if (is_admin() && ($current_screen->post_type == 'post' ||
            $current_screen->post_type == 'page' ||
            $current_screen->id == 'toplevel_page_amilia-store/amilia-store')) {
        $dict = array(
            "lang" => __("en", 'amilia-store'),
            "amilia-store" => __("Amilia Store", 'amilia-store'),
            "url-label" => __("Store URL", 'amilia-store'),
            "insert" => __("Insert", 'amilia-store'),
            "update" => __("Update", 'amilia-store'),
            "delete" => __("Remove", 'amilia-store'),
            "close" => __("Close", 'amilia-store'),
            "store" => __("Your Amilia Store", 'amilia-store'),
            "color" => __("Theme color", 'amilia-store'),
            "g" => __("Green", 'amilia-store'),
            "dg" => __("Dark Green", 'amilia-store'),
            "b" => __("Blue", 'amilia-store'),
            "db" => __("Dark Blue", 'amilia-store'),
            "o" => __("Orange", 'amilia-store'),
            "r" => __("Red", 'amilia-store'),
            "y" => __("Yellow", 'amilia-store'),
            "steel" => __("Steel", 'amilia-store'),
            "please-wait" => __("Please wait...", 'amilia-store'),
            "show" => __("Show", 'amilia-store'),
            "store-valid-url" => __("Store URL is valid.", 'amilia-store'),
            "error-unexpected" => __("Unexpected error", 'amilia-store'),
            "error-invalid-url" => __("Please enter a valid URL", 'amilia-store'),
            "error-invalid-amilia-url" => __("Not an Amilia URL. Must be similar to 'https://www.amilia.com/store/en/usa-amilia-group/...'", 'amilia-store'),
            "error-invalid-url-permission-denied" => __("Permission denied to embed this store. Ensure you have configured your Amilia Store to use the domain of this WordPress site.", 'amilia-store'),
            "error-no-tags" => __("Oh no! You haven't set up tags yet. Checkout <a href='https://support.amilia.com/hc/en-us/articles/216528783-How-to-create-your-first-tag-' target='_blank'>this how to article</a>", 'amilia-store'),
            "error-no-programs" => __("No programs found.", 'amilia-store'),
            "error-no-sub-categories" => __("No sub-categories found.", 'amilia-store'),
            "help" => __("Help", 'amilia-store'),
            "instructions" => __("Instructions", 'amilia-store'),
            "instructions-p1" => __("Navigate to the page of your store you wish to use. Copie the URL from the address bar, and paste in the field URL.", 'amilia-store'),

            "iframe-title" => __("Embedding your Amilia Store inside your website using an iframe", 'amilia-store'),
            "instructions-p2" => __('Choose the color then insert it on your page. Open a preview to see your store. <em>If you do not see the store, it is possible that your website domain is not set in Amilia. <a href="https://support.amilia.com/hc/en-us/articles/698235-How-do-I-link-Amilia-to-my-site-" target="_blank">This document tells you how to do that.</a></em>', 'amilia-store'),
            "instructions-p3" => __("You can modify or remove it later, by positioning the cursor on the Amilia button. Click again on the Amilia tool icon.", 'amilia-store'),
            "instructions-p4" => __("You can also modify the iframe URL by passing a query parameter 'amilia_url'. For example: 'http://www.example.com/?amilia_url=https%3A%2F%2Fwww.amilia.com%2Fstore%2Fen%2Fusa-amilia-group%2Fshop%2Fprograms%2F9173%3FsubCategoryIds%3D630185' would override the URL and drive the iframe to that page.", 'amilia-store'),
            "block-info" => __("Configure in side panel. Preview or update to see it live.", 'amilia-store'),
            "custom-css" => __("Custom CSS", 'amilia-store'),

            "calendar-title" => __("Activity calendar from your Amilia store", 'amilia-store'),
            "start-view" => __("Start view", 'amilia-store'),
            "start-date" => __("Start date (YYYY-MM-DD or leave blank for today)", 'amilia-store'),
            "start-time" => __("Start time", 'amilia-store'),
            "this-hour" => __("This hour", 'amilia-store'),
            "day" => __("Day", 'amilia-store'),
            "week" => __("Week", 'amilia-store'),
            "month" => __("Month", 'amilia-store'),
            "day-list" => __("List Day", 'amilia-store'),
            "calendar-instructions-p2" => __("Choose the start view of your calendar. For Day or Week views, specify the start time to display.", 'amilia-store'),
            "calendar-instructions-p3" => __("You can optionally filter activities shown by tags and or by facilities. If you choose facilities or tags, you can also show them as filters above the calendar.", 'amilia-store'),
            "calendar-instructions-p4" => __("If you have selected facilities, the Day view will show one column per facility.", 'amilia-store'),
            "facility-label" => __("Facility", 'amilia-store'),
            "facilities-label" => __("Facilities", 'amilia-store'),
            "error-no-facilities" => __("Oh no! You haven't set up facilities yet. Checkout <a href='https://support.amilia.com/hc/en-us/articles/211559243-How-to-create-a-new-facility' target='_blank'>this how to article</a> "),
            "show-for-tags" => __("Only show activities who have selected tags", 'amilia-store'),
            "show-for-facilities" => __("Only show activities happening in selected facilities", 'amilia-store'),
            "show-tags-filter" => __("Show a tags filter above the calendar (only if 2 or more tags are selected)", 'amilia-store'),
            "show-facilities-filter" => __("Show a facilities filter above the calendar (only if 2 or more facilities are selected)", 'amilia-store'),
            "any-tag" => __("Any tag", 'amilia-store'),
            "any-facility" => __("Any facility", 'amilia-store'),
            "invalid-date" => __("Invalid date. Must be formatted as YYYY-MM-DD.", 'amilia-store'),

            "table-title" => __("Insert a table of activities from your Amilia Store", 'amilia-store'),
            "tag-label" => __("Tag", 'amilia-store'),
            "tags-label" => __("Tags", 'amilia-store'),
            "table-instructions-p2" => __("Choose the tag that identifies the activites you want to show. Open a preview to see the table in your website.", 'amilia-store'),
            "columns" => __("Columns", 'amilia-store'),
            "reset-to-defaults" => __("Reset to defaults", 'amilia-store'),
            "col-Name" => __("Activity", 'amilia-store'),
            "col-Description" => __("Description", 'amilia-store'),
            "col-ShortScheduleString" => __("When", 'amilia-store'),
            "col-LegacyLocation" => __("Location", 'amilia-store'),
            "col-Price" => __("Price", 'amilia-store'),
            "col-SpotsRemaining" => __("Spots", 'amilia-store'),
            "col-Register" => __("Register", 'amilia-store'),
            "col-AgeSummary" => __("Age", 'amilia-store'),
            "col-ProgramName" => __("Program", 'amilia-store'),
            "col-CategoryName" => __("Category", 'amilia-store'),
            "col-SubCategoryName" => __("Sub-category", 'amilia-store'),

            "standings-title" => __("Team Standings and Game Schedules (experimental)", 'amilia-store'),
            "team-standings" => __("Team standings", 'amilia-store'),
            "game-schedule" => __("Game schedule", 'amilia-store'),
            "standings-instructions-p1" => __("This is an experimental feature and works in conjunction with score and attendance tracking (https://lab.amilia.com/attendance).", 'amilia-store'),
            "standings-instructions-p2" => __("Choose the program and sub-category in which you have activities representing teams and the league (1 activity = 1 team, 1 sub-category = 1 league).", 'amilia-store'),
            "standings-instructions-p3" => __("You can optionally filter activities shown by tags allowing you to exclude activities which are not teams.", 'amilia-store'),
            "standings-instructions-p4" => __("The sport you choose determines how to count and display score and standings.", 'amilia-store'),
            "select-program" => __("Select a program", 'amilia-store'),
            "select-sub-category" => __("Select a sub-category (optional)", 'amilia-store'),
            "show-hidden-activities" => __("Show hidden activities", 'amilia-store'),
            "show-staff" => __("Show staff", 'amilia-store'),
            "select-sport" => __("Select a sport", 'amilia-store'),
            "soccer" => __("Soccer", 'amilia-store'),
            "football" => __("Football", 'amilia-store'),

            "button-title" => __("Insert a styled button link your Amilia Store", 'amilia-store'),
            "button-text-value" => __("Register", 'amilia-store'),
            "error-invalid-button-text" => __("Button text cannot be empty", 'amilia-store'),
            "try-again" => __("Try again", 'amilia-store')
        );
        ?>
        <script type="text/javascript">
            window.Amilia = {
                PLUGIN_NAME: 'amilia_store',
                pluginVersion: '<?php echo AMILIA_STORE_PLUGIN_VERSION; ?>',
                pluginUrl: '<?php echo plugin_dir_url( __FILE__ ); ?>',
                objectL10n: <?php echo json_encode($dict); ?>,
                storeUrl: '<?php echo get_option('amilia_store_url', ''); ?>'
            };
        </script>
        <?php
        wp_enqueue_style('amilia_store_css', plugins_url('amilia-store.css', __FILE__), array(), AMILIA_STORE_PLUGIN_VERSION);
        wp_enqueue_script('amilia_store_js', plugins_url('amilia-store.js', __FILE__), array(), AMILIA_STORE_PLUGIN_VERSION);
    }
}
add_action('admin_head', 'amilia_store_bootstrap_javascript');


// Settings
function register_amilia_store_settings() {
    register_setting('amilia-store-settings-group', 'amilia_store_url');
    register_setting('amilia-store-settings-group', 'amilia_store_version', array('type' => 'string', 'default' => AMILIA_STORE_PLUGIN_VERSION));
}
function amilia_store_create_menu() {
    add_menu_page(__("Amilia Store", 'amilia-store'), 'Amilia', 'administrator', __FILE__, 'amilia_store_settings_page' , plugins_url('/images/settings-a.svg', __FILE__) );
    add_action( 'admin_init', 'register_amilia_store_settings' );
}
add_action('admin_menu', 'amilia_store_create_menu');
function amilia_store_settings_page() {
    wp_enqueue_script('amilia_store_settings_js', plugins_url('amilia-store-settings.js', __FILE__), array(), AMILIA_STORE_PLUGIN_VERSION);
    ?>
    <div class="wrap">
    <h1><?php echo __("Amlia Store", 'amilia-store')?></h1>
    <p><?php echo __("Save your Amilia Store URL here. You won't have to type it in again.", 'amilia-store'); ?></p>
    <p><?php echo __("Your Amilia Store URL can be obtained by navigating to your Store, and copying the URL from the Address bar in your Browser. The URL should be similar to 'https://www.amilia.com/en/store/usa-amilia-group/shop'.", 'amilia-store'); ?></p>
    <form method="post" action="options.php">
        <?php settings_fields( 'amilia-store-settings-group' ); ?>
        <?php do_settings_sections( 'amilia-store-settings-group' ); ?>
        <table class="form-table">
            <tr valign="top">
            <th scope="row"><?php echo __("Store URL", 'amilia-store')?></th>
            <td>
                <textarea type="text" name="amilia_store_url" class="regular-text code"><?php echo esc_attr( get_option('amilia_store_url', '') ); ?></textarea>
                <br/>
                <span class="input-helper store-url"></span>
            </td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
    </div>
    <?php
}


// Editor buttons
function amilia_store_add_tinymce_plugins($plugin_array) {
    $plugin_array['amilia_store_iframe'] = plugins_url('shortcodes/amilia-store-iframe.js', __FILE__).'?v='.AMILIA_STORE_PLUGIN_VERSION;
    $plugin_array['amilia_store_table'] = plugins_url('shortcodes/amilia-store-table.js', __FILE__).'?v='.AMILIA_STORE_PLUGIN_VERSION;
    $plugin_array['amilia_store_button'] = plugins_url('shortcodes/amilia-store-button.js', __FILE__).'?v='.AMILIA_STORE_PLUGIN_VERSION;
    $plugin_array['amilia_store_calendar'] = plugins_url('shortcodes/amilia-store-calendar.js', __FILE__).'?v='.AMILIA_STORE_PLUGIN_VERSION;
    $plugin_array['amilia_store_standings'] = plugins_url('shortcodes/amilia-store-standings.js', __FILE__).'?v='.AMILIA_STORE_PLUGIN_VERSION;
    return $plugin_array;
}
function amilia_store_register_mce_buttons($buttons) {
    array_push($buttons, 'amilia_store_iframe');
    array_push($buttons, 'amilia_store_table');
    array_push($buttons, 'amilia_store_button');
    array_push($buttons, 'amilia_store_calendar');
    array_push($buttons, 'amilia_store_standings');
    return $buttons;
}
function amilia_store_add_mce_buttons() {
    if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) return;
    if (get_user_option('rich_editing') == 'true') {
        add_filter('mce_external_plugins', 'amilia_store_add_tinymce_plugins');
        add_filter('mce_buttons', 'amilia_store_register_mce_buttons');
    }
}
add_action('admin_head', 'amilia_store_add_mce_buttons');


// Shortcodes
include "shortcodes/amilia-store-iframe.php";
include "shortcodes/amilia-store-table.php";
include "shortcodes/amilia-store-calendar.php";
include "shortcodes/amilia-store-standings.php";

// Gutenberg blocks
include "blocks/amilia-store-iframe.php";
include "blocks/amilia-store-calendar.php";
include "blocks/amilia-store-standings.php";

?>