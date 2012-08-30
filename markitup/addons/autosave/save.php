<?php
	/* 
	 * markItUp! 2.0 - AutoSave plugin 0.1
	 * By Jay Salvat - http://markItUp.jaysalvat.com
	 *
	 * This script saves the textarea content sended by AutoSave plugin.
	 * The scripts expects the id (id) of the entry to update
	 * and the content of the editor (textarea).
	 * If an id is provided, the script updates the entry, 
	 * Otherwise, it inserts a new entry and print the new id.
	 *
	 * Edit it to your needs 
	 */
	define('DSN', 		'mysql:dbname=...;host=...');
	define('USERNAME', 	'...');
	define('PASSWORD', 	'...');	
	define('TABLE', 	'posts');		// Table name
	define('FIELD_TXT', 'text');		// Field where to store the textarea content
	define('FIELD_ID', 	'id');			// Id field of the entry to update
		
	$Pdo = new PDO(DSN, USERNAME, PASSWORD);

	if (isset($_POST)) {
		// If "id" is posted, update
		if ($_POST['id']) {
			$data = array(
				':textarea'	=> $_POST['textarea'], 
				':id' 		=> $_POST['id']
			);
			$sql = 'UPDATE '.TABLE.' SET '.FIELD_TXT.'=:textarea WHERE '.FIELD_ID.'=:id';			
			$sth = $Pdo->prepare($sql);
			$sth->execute($data);
		// If no "id", insert
		} else {
			$data = array(
				':textarea' => $_POST['textarea']
			);
			$sql = 'INSERT INTO '.TABLE.' ('.FIELD_TXT.') VALUES (:textarea)';
			$sth = $Pdo->prepare($sql);
			$sth->execute($data);
			// and return the id
			echo $Pdo->lastInsertId();
		}
	}
?>