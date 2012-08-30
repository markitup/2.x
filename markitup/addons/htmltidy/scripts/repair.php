<?php
	// ----------------------------------------------------------------------------
	// markItUp! Universal MarkUp Engine, JQuery plugin
	// Add-on Html Tidy repair
	// Dual licensed under the MIT and GPL licenses.
	// ----------------------------------------------------------------------------
	// Copyright (C) 2009 Jay Salvat
	// http://markitup.jaysalvat.com/
	// ----------------------------------------------------------------------------
	
	include "config.php";

	if (!class_exists("tidy")) {
		echo "markItUp! add-on error: HTML Tidy is not installed.";
		exit;
	}

	if (isset($_REQUEST["selection"])) {
		$config["enclose-block-text"] = false;
		$html = stripslashes($_REQUEST["selection"]);
	}

	if (isset($_REQUEST["data"])) {
		$html = stripslashes($_REQUEST["data"]);
	}

	if(isset($html)) {
		$tidy = new tidy;
		$tidy->parseString($html, $config, 'raw');
		$tidy->cleanRepair();
		echo trim($tidy);
	} 
?>
