(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon:			"Escape code",
		escapeEntities: "Escape entities",
		codeBlock:		"Code block"
	}
	// ---------------------------------------------------------------

	$.markItUp.command.add('escapeEntities', {
		snippet:function(miu) {
			return $('<p>').text(miu.selection()).html();
		}
	});
	
	$.markItUp.command.add('codeBlock', {
		snippet:function(miu) {
			var content = $('<p>').text(miu.selection()).html();
			return '<pre{E} class="{E}html{O/}css{O/}javascript{O/}php{/E}"{/E}>\n'
				 + $.trim(content)+ '\n'
				 + '</pre>';
		},
		altSnippet:function(miu) {
			return '<code>'+ $('<p>').text(miu.selection()).html() +'</code>';
		}
	});
	
	$.markItUp.button.add('codeBlock', {
		styles:	[ 'styles.css' ],
		name: i18n.addon, 
		classname:'markItUpCodeBlock', 
		command: $.markItUp.command.codeBlock,
		menu: [
			{	name: i18n.codeBlock, 
				classname:'markItUpCodeBlock', 
				command: $.markItUp.command.codeBlock
			},
			{	name: i18n.escapeEntities, 
				classname:'markItUpEscapeEntities', 
				command: $.markItUp.command.escapeEntities
			}
		]
	});
})(jQuery);