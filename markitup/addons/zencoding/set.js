(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Zen Coding"
	}
	// ---------------------------------------------------------------

	$.markItUp.command.add('zenCoding', {
		scripts:['scripts/zencoding.js'],
		onInit:function(miu) {
			var start = miu.caret(),
				command = miu.line();

			if (command) {
				html = zenCoding.parse(command);
				if (html) {
					html = html
					.replace(/\t/g, '{I/}')
					.replace(/\+/g, '{E/}')
					.replace(/^\n/, '')
					.replace(/\n$/, '');
					miu.selection(start - command.length, command.length);
					miu.snippet(html);
				}
			}
		}
	});
	
	$.markItUp.button.add('zenCoding', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpZenCoding',
		key:'E',
		command: $.markItUp.command.zenCoding
	});

	$.markItUp.plugin.add('zenCoding', {
		scripts:['scripts/zencoding.js'],
		onInit:function(miu) {
			miu.settings({
				triggerMask:'[a-z0-9>#_.*$+:\-]',
				triggers: { 
					catchAll:function(miu) {
						// TODO: a intégrer au triggerMask
						if (/>$/.test(miu.trigger)) {
							return false;	
						}
						html = zenCoding.parse(miu.trigger);
						if (html) {
							html = html
							.replace(/\t/g, '{I/}')
							.replace(/\+/g, '{E/}')
							.replace(/^\n/, '')
							.replace(/^\n/, '')
							.replace(/\n$/, '');
							return { command: { snippet:html } };
						}
						return false;
					}
				}
			});
		}
	});
})(jQuery);