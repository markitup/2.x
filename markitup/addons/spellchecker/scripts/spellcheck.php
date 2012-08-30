<?php
	// ----------------------------------------------------------------------------
	// markItUp! Universal MarkUp Engine, JQuery plugin
	// Add-on SpellChecker
	// Dual licensed under the MIT and GPL licenses.
	// ----------------------------------------------------------------------------
	// Copyright (C) 2009 Jay Salvat
	// http://markitup.jaysalvat.com/
	// ----------------------------------------------------------------------------
	
	$lang 			= isset($_GET['lang']) ? $_GET['lang'] : 'en';
	$text 			= isset($_GET['text']) ? urldecode(stripslashes($_GET['text'])) : '';
	$ignoredigits 	= isset($_GET['ignoredigits']) ? $_GET['ignoredigits'] : '1';
	$ignoreallcaps 	= isset($_GET['ignoreallcaps']) ? $_GET['ignoreallcaps'] : '1';
	$url 			= "https://www.google.com/tbproxy/spell?lang=" . $lang;
	
	$body  = '<?xml version="1.0" encoding="UTF-8" ?>';
	$body .= '<spellrequest textalreadyclipped="0" ignoredups="1" ignoredigits="'.$ignoredigits.'" ignoreallcaps="'.$ignoreallcaps.'">';
	$body .= '<text>'.htmlspecialchars($text).'</text>';
	$body .= '</spellrequest>';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	$contents = curl_exec ($ch);
	curl_close($ch); 

	$results 	= array();	
	$xml 		= simplexml_load_string($contents);
		
	foreach($xml->c as $result) {
		$start 	= $result['o'];
		$len 	= $result['l'];
		$word 	= substr($text, $start, $len);
		$results[] = array(
			'start'			=> (int)$start,
			'len'			=> (int)$len,
			'word'			=> $word,
			'suggestions' 	=> split('	', $result)
		);
	}
	
	include "spellcheck.tpl.php";
?>
