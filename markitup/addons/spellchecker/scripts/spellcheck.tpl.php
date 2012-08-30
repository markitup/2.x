<html>
<head>
	<link rel="stylesheet" type="text/css" href="~/addons/spellChecker/scripts/styles.css">
</head>
<body>
	<?php foreach($results as $result) : ?>
	<dl>
		<dt class="clearfix" start="<?php echo $result['start'] ?>" len="<?php echo $result['len'] ?>">Word: "<span class="word"><?php echo $result['word'] ?></span>"</dt>
		<dd class="select">reveal in text</dd>
		<?php foreach($result['suggestions'] as $suggestion) : ?>
		<dd><?php echo $suggestion ?></dd>
		<?php endforeach; ?>
		<dd class="ignore">Ignore</dd>
	</dl>
	<?php endforeach; ?>
</body>
</html>

