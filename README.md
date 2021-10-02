# WP Input Scanner
This WordPress plugin contains a web barcode and a QR scanner for HTML input elements. With predefined query classes and the option to integrate your own query classes, it is possible to use the scanner in the admin interface or on the website.
With the user-friendly administrator interface, further settings such as the texts of this plugin can be made.

### Demo & Documentation
[Demo](https://aigenseer.github.io/wp-input-scanner/)

### Using
Add the class .wp-scanner to use the scanner with a click on the input element.
or
add the class .wp-scanner-open-label to use the scanner-open-label to open the scanner.


#### Alternative start the plugin
You can also start the scanner with the function `window.WPScanner.start(elm: HTMLInputElement)`.

### Supported Platforms
* PC: Safari, Opera, Edge, Chrome, Firefox
* Android/IOS: Safari, Opera, Edge, Chrome, Firefox

## Installation

#### Steps
1. Upload the folder `wp-input-scanner/plugin` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

## Update Javascript-File
1. Go to the folder `wp-input-scanner/scanner-js-src`
2. Run `npm install` & make your changes
3. Build the new file with `npm run build`

### License
[GNU GPLv3](https://github.com/aigenseer/wp-input-scanner/blob/master/LICENSE "GNU GPLv3")
