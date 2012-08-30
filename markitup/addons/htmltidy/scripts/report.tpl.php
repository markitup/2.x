<html>
<head>
	<link rel="stylesheet" type="text/css" href="~/addons/htmlTidy/scripts/styles.css">
</head>
<body>
	<table>
		<col width="50"></col>
		<col width="50"></col>
		<col width="100"></col>
		<col></col>
	<thead>
		<tr>
			<th>Line</th>
			<th>Col</th>
			<th>Type</th>
			<th>Message</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="4"><?php echo $count ?></td>
		</tr> 
	</tfoot>
	<tbody>
	<?php if (count($rows) === 0) : ?>
		<tr>
			<td colspan="4">No error or warning</td>
		</tr>
	<?php else : ?>
	<?php foreach($rows as $row) : ?>
		<tr>
			<td class="lines"><?php echo $row["line"] ?></td>
			<td class="cols"><?php echo $row["col"] ?></td>
			<td><?php echo $row["type"] ?></td>
			<td><?php echo $row["message"] ?></td>
		</tr>
	<? endforeach ?>
	<?php endif ?>
	</tbody>
	</table>
</body>
</html>