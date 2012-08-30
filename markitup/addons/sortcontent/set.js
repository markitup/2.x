(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Sort content"
	}
	// ---------------------------------------------------------------
	$.markItUp.command.add('sortContent', {
		snippet:function(miu) {
			var sel = miu.selection().replace(/\r/g, '');;
			var lines = sel.split(/\n/);
			if (miu.button.hasClass('sortContent-desc')) {
				miu.button.removeClass('sortContent-desc');
				return lines.reverse().join("\n");;
			} else {
				miu.button.addClass('sortContent-desc');
				return lines.sort().join("\n");
			}
		}, selected:true
	});
	
	$.markItUp.button.add('sortContent', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpSortContent-asc',
		command: $.markItUp.command.sortContent
	});
})(jQuery);