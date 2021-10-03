<?php
/**
 * Plugin Name:       Input Scanner
 * Plugin URI:        https://github.com/aigenseer/input-scanner
 * Description:       Input scanner for QR and barcodes
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Viktor Aigenseer
 * Author URI:        https://github.com/aigenseer/
 * License:           GPL v3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.de.html
 */


define('IS_PREFIX', 'inputscanner');
define('IS_NAME', 'Input-Scanner');
define('IS_PLUGIN_FILE_URL', dirname( __FILE__ , 1 ));

include "class/tabs.class.php";
$is_tabs = new IS_Tabs(IS_PREFIX, IS_NAME, [
    'settings' => (object)[
        'title' => 'Settings'
    ],
    'language' => (object)[
        'title' => 'Language'
    ]
]);
$is_tabs->addScripts();

include "sql/pluginsettings.class.php";
$is_pluginsettings = new IS_PluginSettings(IS_PREFIX, (object)[
    'settings' => (object)[
        'customTags' => (object)[
            'title' => 'Custom HTML queryselectors',
            'style' => 'width: 80%; min-height: 500px;',
            'type' => 'long-string',
            'defaultvalue' => '.input-custom-open',
            'description' => 'Add own queryselector (ids, classes) to open the scanner. With one click the element opens and the scanner opens.'
        ],
        'customInputTags' => (object)[
            'title' => 'Custom HTML queryselectors to add the input labels',
            'style' => 'width: 80%; min-height: 500px;',
            'type' => 'long-string',
            'defaultvalue' => '.input-custom-label-open',
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
$is_pluginsettings->createTable();


add_action("admin_menu", function(){
    add_menu_page(IS_NAME, IS_NAME, "manage_options", IS_PREFIX, function(){
        global $is_tabs;
        $is_tabs->display(IS_PLUGIN_FILE_URL . "/include/settings.php");
    });
});

add_action('admin_enqueue_scripts', function(){
    wp_enqueue_script( 'input-scanner-script', plugins_url( 'assets/scanner.js', __FILE__ ), [], false, true);
});

add_action('admin_init', function (){
    wp_enqueue_style( 'input-scanner-style', plugins_url( 'assets/scanner.css', __FILE__ ));
});

add_action('wp_enqueue_scripts', function (){
    wp_enqueue_script( 'input-scanner-script', plugins_url( 'assets/scanner.js', __FILE__ ), [], false, true);
});

add_action('wp_enqueue_scripts', function (){
    wp_enqueue_style( 'input-scanner-style', plugins_url( 'assets/scanner.css', __FILE__ ));
});

function is_add_script_footer(){
    global $is_pluginsettings;
    $settings = $is_pluginsettings->getAll('settings', true);
    $customTags = json_encode(array_map('trim', explode(',', $settings->customTags)));
    $customInputTags = json_encode(array_map('trim', explode(',', $settings->customInputTags)));
    $language = json_encode($is_pluginsettings->getAll('language', true));

print <<<HTML
    <script type="text/javascript" >
     document.addEventListener("DOMContentLoaded", function(event) {
        InputScanner.initInstance($language);
        InputScanner.addEventListenerByQuerySelector($customTags);
        InputScanner.addInputLabelByQuerySelector($customInputTags);
      });
    </script>
HTML;
}

add_action('wp_footer', 'is_add_script_footer');
add_action('admin_footer', 'is_add_script_footer');