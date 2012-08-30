<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="~/templates/styles.css">
</head>

<body>
<?php
	if (isset($_POST['data'])) {
		$data = stripslashes($_POST['data']);
		/*
			Do wathever you want with the posted data here.
			Ex. $data = myParser($data);
		*/
		echo $data;
	}
?>
</body>
</html>
