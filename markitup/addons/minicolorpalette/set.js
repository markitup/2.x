/* Color Palette - Display a 222 safe color palette
 * V0.1 - By Jay Salvat
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Color palette"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.dialog.add('miniColorPalette', {
		title: i18n.addon,
		classname:'markItUpMiniColorPaletteDialog',
		insertButton:false,
		rows:[
		{	html:function(miu) {
				return $.markItUp.helper.palette(miu, 'color', '#000000', [
					['#000000','#993300','#333300','#003300','#003366','#000080','#333399','#333333'],
					['#800000','#FF6600','#808000','#008000','#008080','#0000FF','#666699','#808080'],
					['#FF0000','#FF9900','#99CC00','#339966','#33CCCC','#3366FF','#800080','#999999'],
					['#FF00FF','#FFCC00','#FFFF00','#00FF00','#00FFFF','#00CCFF','#993366','#C0C0C0'],
					['#FF99CC','#FFCC99','#FFFF99','#CCFFCC','#CCFFFF','#99CCFF','#CC99FF','#FFFFFF']
					], { inputType:'hidden', autoClose:true, colorize:true, title:true });
			}
		}]
	});

	$.markItUp.command.add('miniColorPalette', {
		snippet:'{V color/}',
		altSnippet:'style="{E}color{O/}background{/E}:{V color/}"',
		styles:[ 'styles.css' ],
		dialog: $.markItUp.dialog.miniColorPalette
	});

	$.markItUp.button.add('miniColorPalette', {
		name: i18n.addon,
		classname:'markItUpMiniColorPalette',
		command: $.markItUp.command.miniColorPalette
	});
})(jQuery);