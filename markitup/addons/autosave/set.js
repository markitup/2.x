(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		path: 		$.markItUp.root + 'addons/autoSave/save.php', 	// Path to the PHP script
		delay: 		1000*60*5, 										// Delay in seconds
		idField:	'input[name=id]' 								// Ex. <input type="hidden" name="id" value="">
	}
	// ---------------------------------------------------------------

	$.markItUp.plugin.add('autoSave', {
		onInit:function(miu) {
			var entryId = $(settings.idField).val() || '';
			setInterval(function() {
				miu.processing.show();
				$.post(settings.path, {
					textarea: miu.textarea.value,
					id: entryId
				}, function(lastId) {
					if (lastId) {
						$(settings.idField).val(lastId); 
					}
					miu.processing.hide();
				});
			}, settings.delay);
		}
	});
})(jQuery);