(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Color palette"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.dialog.add('colorPalette', {
			title: i18n.addon,
			classname:'markItUpColorPaletteDialog',
			insertButton:false,
			rows: [
				{ html: function(miu) {	
					var values = ['00', '33', '66', '99', 'CC', 'FF']; 
					var colors = [];
					for(r = 0; r < 6; r++) {
						var subcolors = [];
						for(g = 0; g < 6; g++) { 
							for(b = 0; b < 6; b++) { 
								subcolors.push('#' + values[r] + values[g] + values[b]);
							}
						}
						subcolors.push('#' + values[r] + values[r] + values[r]);
						colors.push(subcolors); 
					}
					// get a palette build with the color values
					return $.markItUp.helper.palette(miu, 'color', '#000000', colors, { 
						inputType: 'hidden', 	// no field
						autoClose: true, 		// dialog stays open after insertion
						colorize: true			// colorize cells with the color values
					});
				}
			}]
		}
	);
	
	$.markItUp.command.add('colorPalette', {
			snippet:'{V color/}',
			altSnippet:'style="{E}color{/E}:{V color/}"',
			styles:[ 'styles.css' ],
			dialog: $.markItUp.dialog.colorPalette
		}
	);
	
	$.markItUp.button.add('colorPalette', {
		name: i18n.addon,
		classname:'markItUpColorPalette',
		command: $.markItUp.command.colorPalette
	});
})(jQuery);