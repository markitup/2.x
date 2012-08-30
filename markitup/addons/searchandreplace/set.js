/* Search And Replace - A Search and Replace dialogbox
 * V0.1 - By Jay Salvat
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 			"Search and replace",
		search:			"Search",
		replace:		"Replace",
		replaceAll:		"Replace all",
		regExp:			"Regular exp.",
		regExpLegend:	"Use regular expression"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.dialog.add('searchAndReplace', {
		title: i18n.addon,
		insertButton:false,
		rows: [
			{ label: i18n.search, name:'search', classname:"large"},
			{ label: i18n.replace, name:'replace', classname:"large"},
			{ label: i18n.regExp, name:'regexp', value:true, legend: i18n.regExpLegend, checkbox:true }
		],
		buttons: [
			{	name: i18n.search, 
				onClick:function(miu) {
					var word = miu.dialog.vars('search'),
						matches = [],
						content	= miu.textarea.value,
						regex;
						
					if (!miu.dialog.vars('regexp')) {
						word = word.replace(/([\.\*\+\?\|\(\)\[\]\{\}])/g, "\\$1");
					}
					regex = new RegExp(word, 'gi');
	
					if (word.length > 0) {
						while(regex.test(content)) {
							matches.push(regex.lastIndex - word.length);
						}
	
						if (miu.index === null) {
							for(i = 0; i < matches.length; i++) {
								if (matches[i] >= miu.caret()) {
									miu.index = i;
									break;
								}
							}
						}
						
						if (miu.index >= matches.length) {
							miu.index = 0;
						}
	
						var pos = matches[miu.index++];
	
						if (pos !== false) {
							miu.selection(miu.start(pos), word.length);	
							miu.selected = miu.start(pos); 
						}
						
					}
					$(miu.button).val(i18n.search +' (' + matches.length + ')');
				}	
			},
			{	name: i18n.replace, 
				onClick:function(miu) {
					word = miu.dialog.vars('search');
					replacement = miu.dialog.vars('replace');
						
					if (miu.selected) {
						miu.selection(miu.selected, word.length);
					}
	
					if (miu.selection().toLowerCase() == word.toLowerCase()) {
						miu.selection(replacement);
					}
					
					$(miu.button).prev().trigger('click');
				}
			},
			{	name: i18n.replaceAll, 
				onClick:function(miu) {
					var word = miu.dialog.vars('search'),
						replacement = miu.dialog.vars('replace'),
						matches	= [],
						regex;
	
					if (!miu.dialog.vars('regexp')) {
						word = word.replace(/([\.\*\+\?\|\(\)\[\]\{\}])/g, "\\$1");
					}
					regex = new RegExp(word, 'gi');
						
					while(regex.test(miu.textarea.value)) {
						matches.push(1);
					}
					miu.textarea.value = miu.textarea.value.replace(regex, replacement);
	
					$(miu.button).val(i18n.replaceAll +' (' + matches.length + ')');
				}
			}
		],
		onInit:function(miu) {
			miu.index = null;
			$('input[name=search]', miu.dialog).val(miu.selection());
		}
	});
	
	$.markItUp.command.add('searchAndReplace', {
		styles:[ 'styles.css' ],
		dialog: $.markItUp.dialog.searchAndReplace
	});
	
	$.markItUp.button.add('searchAndReplace', {
		name: i18n.addon,
		classname:'markItUpSearchAndReplace',
		command: $.markItUp.command.searchAndReplace
	});
})(jQuery);