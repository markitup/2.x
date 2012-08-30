(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Lorem Ipsum"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.command.add('loremIpsum', {
		snippet:function() { 
			return 'Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet.';
		}
	});
	
	$.markItUp.button.add('loremIpsum', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpLoremIpsum',
		command: $.markItUp.command.loremIpsum
	});
})(jQuery);