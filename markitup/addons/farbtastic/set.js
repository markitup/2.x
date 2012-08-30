/* Farbtastic - Use Farbtastic jQuery plugin in a dialogbox
 * V0.1 - By Jay Salvat
 *
 * Use Farbastic - By Steven Wittens
 * http://acko.net/dev/farbtastic
 */
(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		defaultColor:'#3C769D'
	}
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Farbtastic Colorpicker"
	}
	// ---------------------------------------------------------------
		
	$.markItUp.command.add('farbtastic', {
		snippet: ' style="{E}color{O/}background{/E}:{V color/}"',
		altSnippet: '{V color/}',
		styles: [ 'styles.css', 'farbtastic/farbtastic.css' ],
		scripts: [ 'farbtastic/jquery.farbtastic.js' ],
		dialog: {
			title: i18n.addon,
			classname: 'markItUpFarbtasticDialog',
			rows: [
				{ html: '<div class="farbtasticPicker"></div><input type="text" class="farbtasticColor" name="color" value="'+ settings.defaultColor +'"/>' }
			],
			onInit: function(miu) {
				// Apply Farbtastic plugin
				$('div.farbtasticPicker', miu.dialog).farbtastic('input.farbtasticColor');
			}
		}
	});

	$.markItUp.button.add('farbtastic', {
		name: i18n.addon,
		classname:'markItUpColorPicker',
		command: $.markItUp.command.farbtastic
	});
})(jQuery);