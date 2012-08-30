(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 			"Print content",
		printEditor: 	"Print editor content",
		printPreview: 	"Print preview content"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.command.add('printEditor', {
		onInit:function(miu) {
			var content,
				iframe = $('<iframe>').css({
					width:0, height:0,
					position:'absolute',
					left:'-9999px', top:'-9999px',
					fontFamily:'Courier'
				}).appendTo('body')
				.get(0),
				
			content  = '<div style="font:11px Courier">'
					 + $('<p>').text(miu.selection()||miu.textarea.value).html()
					 + '</div">';
					 
			doc = iframe.contentWindow.document;
			doc.write(content.replace(/\n/g, '<br>'));
			doc.close();
			iframe.contentWindow.focus();
			iframe.contentWindow.print();
		}
	});
	
	$.markItUp.command.add('printPreview', {
		onInit:function(miu) {
			miu.preview.open();
			var iframe;
			iframe = $('iframe', this).get(0);
			iframe.contentWindow.focus();
			iframe.contentWindow.print();
		}
	});
	
	$.markItUp.button.add('printContent', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpPrintContent',
		command: $.markItUp.command.printEditor,
		menu:[
			{	name: i18n.printEditor,
				command: $.markItUp.command.printEditor
			},
			{	name: i18n.printPreview,
				command: $.markItUp.command.printPreview
			}
		]
	});
})(jQuery);