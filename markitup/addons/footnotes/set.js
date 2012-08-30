(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 			"Footnotes",
		footnotes: 		"Footnotes",
		placeHolder:	"Text to link...",
		noFootnote:		"- No footnote found -",
		insertFootnote:	"- Select a footnote -",
		title:			"Title",
		name:			"Name",
		url:			"Url",
		linkFootnote:	"Link from footnotes",
		addFootnote:	"Add a new footnote"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.dialog.add('footNoteLink', {
		title: i18n.addon,
		rows:[
			{ label: i18n.footnote, name:'footNotes', values:function(miu) {
				var content = miu.textarea.value,
					regexp = /\[(.*?)\]:\s?(.*?)\s/gi,
					opts = [];
				while((m = regexp.exec(content)) != null) {
					opts.push( { label: m[2]+' ['+m[1]+']' , value:m[1] } );
				};
				if (opts.length === 0) {
					 opts.unshift( {label: i18n.noFootnote} );
				} else {
					 opts.unshift( {label: i18n.insertFootnote} );
				}
				return opts;
			}},
			{ label: i18n.title, name:'title' }
		]
	});
	
	$.markItUp.command.add('footNoteLink', { 
		snippet: '[{S}'+ i18n.placeHolder +'{/S}]({V footNote/}{IF title} "{V title/}"{/IF})',
		dialog: $.markItUp.dialog.footNoteLink
	});
	
	$.markItUp.dialog.add('footNoteAdd', {
		title:'Add footNote',
		rows:[
			{ label: i18n.name, name:'name' },
			{ label: i18n.url, name:'url' }
		],
		onBeforeClose:function(miu){
			if (miu.vars('name') && miu.vars('url')) {
				var caret = miu.caret();
				miu.textarea.value = miu.textarea.value.replace(/\n*$/g, '') 
								  + '\n['+miu.vars('name')+']: '
								  + miu.vars('url')+' ';
				miu.caret(caret);
				miu.vars('footNote', miu.vars('name'));
				return false;
			}
		}
	});
	
	$.markItUp.command.add('footNoteAdd', { 
		dialog: $.markItUp.dialog.footNoteAdd
	});
	
	$.markItUp.button.add('footNotes', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpFootNote',
		command: $.markItUp.command.footNoteLink,
		menu:[
			{	name: i18n.linkFootnote,
				classname:'markItUpFootNote',
				command: $.markItUp.command.footNoteLink
			},
			{	name: i18n.addFootnote,
				classname:'markItUpFootNote-plus',
				command: $.markItUp.command.footNoteAdd
			}
		]
	});
})(jQuery);