<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
global $wpis_pluginsettings;
$wpis_pluginsettings->fetchPost($active_tab);
$formvalues = $wpis_pluginsettings->getAll($active_tab);

require 'httpsWarning.php';
require 'pluginsettingsform.php';
 ?>
