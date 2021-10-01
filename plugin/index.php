<?php
/**
 * Plugin Name:       WP Input Scanner
 * Plugin URI:        https://github.com/aigenseer/wp-input-scanner
 * Description:       Wordpress input scanner for QR and barcodes
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Viktor Aigenseer
 * Author URI:        https://github.com/aigenseer/
 * License:           GPL v3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.de.html
 */


define('WPIS_PREFIX', 'wpinputscanner');
define('WPIS_NAME', 'WP-Input-Scanner');
define('WPIS_PLUGIN_FILE_URL', dirname( __FILE__ , 1 ));

include "class/tabs.class.php";
$wpis_tabs = new WPIS_Tabs(WPIS_PREFIX, WPIS_NAME, [
    'settings' => (object)[
        'title' => 'Settings'
    ],
    'language' => (object)[
        'title' => 'Language'
    ]
]);
$wpis_tabs->addScripts();

include "sql/pluginsettings.class.php";
$wpis_pluginsettings = new WPIS_PluginSettings(WPIS_PREFIX, (object)[
    'settings' => (object)[
        'customTags' => (object)[
            'title' => 'Custom HTML queryselectors',
            'style' => 'width: 80%; min-height: 500px;',
            'type' => 'long-string',
            'defaultvalue' => '.wp-input-custom-open',
            'description' => 'Add own queryselector (ids, classes) to open the scanner. With one click the element opens and the scanner opens.'
        ],
        'customInputTags' => (object)[
            'title' => 'Custom HTML queryselectors to add the input labels',
            'style' => 'width: 80%; min-height: 500px;',
            'type' => 'long-string',
            'defaultvalue' => '.wp-input-custom-label-open',
            'description' => 'Add own queryselector (ids, classes) to add the input label and open the scanner.'
        ],
    ],
    'language' => (object)[
        'dialogTitle' => (object)[
            'title' => 'DialogTitle',
            'type' => 'string',
            'defaultvalue' => 'Input-Scanner'
        ],
        'msgSuccessTitle' => (object)[
            'title' => 'Success title message',
            'type' => 'string',
            'defaultvalue' => 'Success'
        ],
        'msgSuccessBody' => (object)[
            'title' => 'Success body message',
            'type' => 'string',
            'defaultvalue' => 'Code found.'
        ],
        'msgFailedTitle' => (object)[
            'title' => 'Failed title message',
            'type' => 'string',
            'defaultvalue' => 'Failed to scan'
        ],
        'msgFailedBody' => (object)[
            'title' => 'Failed body message',
            'type' => 'string',
            'defaultvalue' => 'No Code found.'
        ],
        'noPermissionTitle' => (object)[
            'title' => 'Failed permission camera access title',
            'type' => 'string',
            'defaultvalue' => 'You have no Permission'
        ],
        'noPermissionBody' => (object)[
            'title' => 'Failed permission camera access body',
            'type' => 'string',
            'defaultvalue' => 'Your browser has no rights to the camera.'
        ]
    ]
]);
$wpis_pluginsettings->createTable();


add_action("admin_menu", function(){
    add_menu_page(WPIS_NAME, WPIS_NAME, "manage_options", WPIS_PREFIX, function(){
        global $wpis_tabs;
        $wpis_tabs->display(WPIS_PLUGIN_FILE_URL . "/include/settings.php");
    });
});

add_action('admin_enqueue_scripts', function(){
    wp_enqueue_script( 'wp-input-scanner-script', plugins_url( 'assets/scanner.js', __FILE__ ), [], false, true);
});

add_action('admin_init', function (){
    wp_enqueue_style( 'wp-input-scanner-style', plugins_url( 'assets/scanner.css', __FILE__ ));
});

add_action('wp_enqueue_scripts', function (){
    wp_enqueue_script( 'wp-input-scanner-script', plugins_url( 'assets/scanner.js', __FILE__ ), [], false, true);
});

add_action('wp_enqueue_scripts', function (){
    wp_enqueue_style( 'wp-input-scanner-style', plugins_url( 'assets/scanner.css', __FILE__ ));
});

function wpis_add_script_footer(){
    global $wpis_pluginsettings;
    $settings = $wpis_pluginsettings->getAll('settings', true);
    $customTags = json_encode(array_map('trim', explode(',', $settings->customTags)));
    $customInputTags = json_encode(array_map('trim', explode(',', $settings->customInputTags)));
    $language = json_encode($wpis_pluginsettings->getAll('language', true));

print <<<HTML
    <script type="text/javascript" >
     document.addEventListener("DOMContentLoaded", function(event) {
        WPScanner.initInstance($language);
        WPScanner.addEventListenerByQuerySelector($customTags);
        WPScanner.addInputLabelByQuerySelector($customInputTags);
      });
    </script>
HTML;
}

add_action('wp_footer', 'wpis_add_script_footer');
add_action('admin_footer', 'wpis_add_script_footer');