<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="~/templates/styles.css">
</head>

<body>
<?php
	$data = stripslashes($_POST['data']);
	$data = strip_tags($data);
	/*
		Do wathever you want with the posted data here.
		Ex. $data = myParser($data);
	*/
	echo $data;
?>
</body>
</html>
