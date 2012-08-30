<?php
	// ----------------------------------------------------------------------------
	// markItUp! Universal MarkUp Engine, JQuery plugin
	// Add-on Html Tidy Report
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

	if (isset($_REQUEST["data"])) {
		$html = stripslashes($_REQUEST["data"]);
	}
	
	if(isset($html)) {
		$tidy = new tidy;
		$tidy->parseString($html, $config);
		$tidy->cleanRepair();

		// RegExp by David Tulloh
		preg_match_all('/^(?:line (\d+) column (\d+) - )?(\S+): (?:\[((?:\d+\.?){4})]:)?(.*?)$/m', $tidy->errorBuffer, $warnings, PREG_SET_ORDER);
	
		$x = 0;
		$rows = array();
		foreach($warnings as $warning) {
			if (!in_array(trim($warning[5]) , $excludedWarnings)) {
				$rows[$x]["line"] 		= $warning[1];
				$rows[$x]["col"] 		= $warning[2];
				$rows[$x]["type"] 		= $warning[3];
				$rows[$x]["message"] 	= htmlspecialchars($warning[5]);
				$x++;
			}
		}
		$count = ($x > 1) ? $x." warnings/errors" : $x." warning/error";
	
		include "report.tpl.php";
	} 
?>