/* Library - Use SimpleModal to display a image library
 * V0.1 - By Jay Salvat
 *
 * Use simpleModal - By Eric Marin
 * http://www.ericmmartin.com/projects/simplemodal/
 */
(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		path: 'library/index.html',
		root: 'library/'	
	}
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 		"Image",
		source: 	"Source",
		altText:	"Alt text",
		placement:	"Placement",
		none:		"None",
		left:		"Left",
		right:		"Right"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.dialog.add('pictures', {
		title: i18n.addon,
		width:480,
		rows: [
			{ iframe: settings.path },
			{ label: i18n.source, 	 name:"src", value:'http://', legend:'Click a picture above'},
			{ label: i18n.altText,  name:"alt" },
			{ label: i18n.placement, name:'placement', value:'none', values:[
				{ label: i18n.none,  value:''},
				{ label: i18n.left,  value:'float:left' },
				{ label: i18n.right, value:'float:right' }
			]},
		],
		onOpen:function(miu) {
			var iframe = $('iframe', miu.dialog);
			iframe.load(function() {
				$(iframe).contents().find('img').click(function() {
					$('input:text').eq(0).val(settings.root + $(this).attr('src'));
					$('input:text').eq(1).val(
						$(this).parent().attr('title') || $.markItUp.helper.humanizeUrl( $(this).attr('src') )
					);
					return false;
				});
			});
		}	
	});
	
	$.markItUp.command.add('pictures', {
		snippet: '<img src="{V src/}" alt="{V alt/}"{E}{IF placement} style="{V placement/};"{/IF} />', 
		dialog: $.markItUp.dialog.pictures
	});
	
	$.markItUp.button.add('pictures', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpPictures',
		command: $.markItUp.command.pictures
	});
})(jQuery);