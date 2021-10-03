<?php
/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
global $is_pluginsettings;
$is_pluginsettings->fetchPost($active_tab);
$formvalues = $is_pluginsettings->getAll($active_tab);

require 'httpsWarning.php';
require 'pluginsettingsform.php';
 ?>
