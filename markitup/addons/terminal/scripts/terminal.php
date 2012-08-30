<?php
$white = array('ls', 'cal', 'date', 'dir');

if (isset($_POST['command'])) {
	$command 	= trim($_POST['command']);
	$commands 	= split(';', $command);
	$clean		= array();
	$pattern 	= '/^'.implode('|', $white).'\b/';

	foreach($commands as $command) {
		if (preg_match($pattern, $command)) {
			$clean[] = $command;
		}
	}
	$command = implode(';', $clean);
	if ($command) {
		exec($command, $result);
		echo utf8_encode(trim(implode("\n", $result)));
	} else {
		echo $_POST['command'];
	}
}
?>
