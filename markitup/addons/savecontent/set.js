(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		path: 		$.markItUp.root + 'addons/saveContent/save.php', 	// Path to the PHP script
		idField:	'input[name=id]' 									// Ex. <input type="hidden" name="id" value="">
	}
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Save content"
	}
	// ---------------------------------------------------------------
		
	$.markItUp.button.add('saveContent', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpSaveContent',
		onClick:function(miu) {
			miu.processing.show();
			var entryId = $(settings.idField).val() || '';
				
			$.post(settings.path, {
				textarea: miu.textarea.value,
				id: entryId
			}, function(lastId) {
				miu.processing.hide();
				if (lastId) {
					$(settings.idField).val(lastId); 
				}
			});
		}
	});
})(jQuery);