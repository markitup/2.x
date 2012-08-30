(function($) {
	// ---------------------------------------------------------------	
	var i18n = {
		addon:		"Email Content",
		email: 		"Email",
		subject: 	"Subject",
		send:		"Send"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.command.add('emailContent', {
		dialog:{
			title: i18n.addon,
			insertButton:false,
			rows:[
				{ label: i18n.email, name:'email' },
				{ label: i18n.subject, name:'subject' }
			],
			buttons:[
				{ name: i18n.send, onClick:function(miu) {
					document.location = "mailto:"+ miu.dialog.vars('email') 
									  + "?subject="+ escape(miu.dialog.vars('subject'))
									  + "&body="+ escape(miu.selection() || miu.textarea.value );
					miu.dialog.close();
					}
				}
			]
		}
	});
	
	$.markItUp.button.add('emailContent', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpEmailContent',
		command: $.markItUp.command.emailContent
	});
})(jQuery);