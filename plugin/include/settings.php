<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
global $inputScanner_pluginSettings;
$inputScanner_pluginSettings->fetchPost($active_tab);
$inputScanner_formValues = $inputScanner_pluginSettings->getAll($active_tab);

require 'httpsWarning.php';
require 'pluginsettingsform.php';
 ?>
