/* TinyUrl Content - Extract the URL from the editor and replace them by TinyUrls
 * V0.1 - By Jay Salvat
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 				"Tiny Url",
		url:				"Url",
		title:				"Title",
		shortenUrl: 		"Shorten Url",
		shortenUrlContent: 	"Shorten Url in content"
	}
	// ---------------------------------------------------------------

	$.markItUp.command.add('tinyUrlContent', {
		onInit:function(miu) {
			var content = miu.selection() || miu.textarea.value,
				regex = /(\b(https?|^http:\/\/tinyurl):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
				urls = [],
				matches = content.match(regex),
				getTinyUrl = function(url) {
					// Display the Processing indicator			
					miu.processing.show();
					// Get a TinyUrl from the appspot.com API
					$.ajax({
						url: 'http://json-tinyurl.appspot.com/?url=' + encodeURIComponent(matches[i]), 
						dataType:'jsonp',
						success: function(data) { 
							urls.push( {url:url, tiny:data.tinyurl});
							if (urls.length == matches.length) {
								for (var j = 0; j < urls.length; j++) {
									content = content.replace(new RegExp(urls[j].url, 'g'), urls[j].tiny); 
								};
								if(miu.selection()) {
									// Replace selection with new content and select it back
									miu.replace(content, true);
								} else {
									// Replace all the textarea content by the new content
									miu.textarea.value = content;
								}
							}
						},
						complete: function() {
							// Hide the processing indicator
							miu.processing.hide();
						}
					});
				}
			for (var i = 0; i < matches.length; i++) {
				getTinyUrl(matches[i]);
			};
		}
	});
	
	$.markItUp.dialog.add('tinyUrlLink', {
		title:"Link",
		classname:'markItUpTinyUrlLinkDialog',
		rows: [
			{ label: i18n.url, name:"href", value:'http://' },
			{ label: i18n.title, name:"title", value:'' }
		],
		onOpen:function(miu) {
			var input = $('input[name=href]', miu.dialog),
				shortenUrl = $('<a class="markItUpTinyUrlLink" href="#">Shorten url</a>');
				
			shortenUrl.click(function(e) {
				var regex = /(\b(https?|^http:\/\/tinyurl):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
					url = $.trim(input.val());
				if (!regex.test(url)) {
					return false;
				}
				// Show the processing indicator
				miu.processing.show();
				// Get a TinyUrl from the appspot.com API
				$.ajax({
					url: 'http://json-tinyurl.appspot.com/?url=' + encodeURIComponent(url) + '&callback=?', 
					dataType:'json',
					success: function(data) {
						// Replace the original Url by the TinyUrl
						input.val(data.tinyurl);
					},
					complete: function() {
						// Hide the processing indicator
						miu.processing.hide();
					}
				});
			});
			input.after(shortenUrl);
		}
	});
	
	$.markItUp.command.add('tinyUrlLink', {
		snippet:'<a href="{V href/}"{IF title} title="{V title/}"{/IF}>{S/}</a>',
		dialog: $.markItUp.dialog.tinyUrlLink
	});
	
	$.markItUp.button.add('tinyUrl', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpTinyUrl',
		command: $.markItUp.command.tinyUrlLink,
		menu:[
			{	name: i18n.shortenUrl,
				classname:'markItUpTinyUrlLink',
				command: $.markItUp.command.tinyUrlLink
			},
			{	name: i18n.shortenUrlContent,
				classname:'markItUpTinyUrlContent',
				command: $.markItUp.command.tinyUrlContent
			}
		]
	});
})(jQuery);