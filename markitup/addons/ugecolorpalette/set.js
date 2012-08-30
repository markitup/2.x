/* Uge Color Palette - Display a 4096 color palette
 * V0.1 - By Jay Salvat
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Color palette"
	}
	// ---------------------------------------------------------------

	$.markItUp.command.add('ugeColorPalette', {
			snippet:'{V color/}',
			altSnippet:'style="{E}color{O/}background{/E}:{V color/}"',
			styles:[ 'styles.css' ],
			dialog: {
				title: i18n.addon,
				classname:'markItUpUgeColorPaletteDialog',
				insertButton:false,
				rows: [{ 
					html: function(miu) {	
						var total =1657, X = Y = j = RG = B = 0, aR = [], aG = [], aB = [], H = W = 63;
						var hexbase = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
						for (var i=0; i < 256; i++) {
							aR[i+510] = aR[i+765]  = aG[i+1020]	= aG[i+5*255] = aB[i]     = aB[i+255]  = 0;
							aR[510-i] = aR[i+1020] = aG[i]      = aG[1020-i]  = aB[i+510] = aB[1530-i] = i;
							aR[i]     = aR[1530-i] = aG[i+255]  = aG[i+510]   = aB[i+765] = aB[i+1020] = 255;
							if (i < 255) {
								aR[i/2+1530] = aG[i/2+1530] = aB[i/2+1530] = 127;
							}
						}
						var i = 0, jl = [];
						for(var x = 0; x < 16; x++) {
							for(var y = 0; y < 16; y++) { 
								jl[i++] = hexbase[x] + hexbase[y];
							}
						}
						var colors = [];
						for (Y = 0; Y <= H; Y++) {
							j = Math.round(Y * (510 / (H + 1)) - 255)
							var subcolors = [];
							for (X = 0; X <= W; X++) {
								i = Math.round(X*(total/W))
								R = aR[i] - j; if(R < 0) R = 0; if(R > 255 || isNaN(R)) R = 255;
								G = aG[i] - j; if(G < 0) G = 0; if(G > 255 || isNaN(G)) G = 255;
								B = aB[i] - j; if(B < 0) B = 0; if(B > 255 || isNaN(B)) B = 255;
								subcolors.push('#' + jl[R] + jl[G] + jl[B]);
							}
							colors.push(subcolors);
						}
						var palette = $.markItUp.helper.palette(miu, 'color', '#000000', colors, { autoClose:true, colorize:true } );
						return palette;
					}
				}],
				onInit:function(miu) {
					$('table', miu.dialog).mouseover(function(e) {
						col = $(e.target).attr('bgcolor').toUpperCase();
						input = $(this).parent().find('input[name=color]');
					
						r = parseInt( col.substr(1, 2), 16);
						g = parseInt( col.substr(3, 2), 16);
						b = parseInt( col.substr(5, 2), 16);
						e = (r + g + b) / 3;				
							
						input.blur().css({
							backgroundColor: col,
							color: e > 220 ? '#000' : '#FFF'
						}).val(col.toUpperCase());
					});
				}
			}
		}
	);
	
	$.markItUp.button.add('ugeColorPalette', {
		name: i18n.addon,
		classname:'markItUpUgeColorPalette',
		command: $.markItUp.command.ugeColorPalette
	});
})(jQuery);