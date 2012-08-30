(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Terminal"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.command.add('terminal', {
		onInit:function(miu) {
			var command = miu.word();
			
			miu.processing.show();
			$.ajax({
				async:   false,
				type:    'POST',
				url:     $.markItUp.root + 'addons/terminal/scripts/terminal.php',
				data:    'command='+ encodeURIComponent(command),
				success:function(content) {
					miu.selection(miu.caret() - command.length, command.length);
					miu.snippet(content);
				}, complete: function() {
					miu.processing.hide();
				}
			});
		}
	});
	
	$.markItUp.button.add('terminal', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpTerminal',
		key:'T',
		command: $.markItUp.command.terminal
	});
})(jQuery);