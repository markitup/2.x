/* Library - Use SimpleModal to display a image library
 * V0.1 - By Jay Salvat
 *
 * Use simpleModal - By Eric Marin
 * http://www.ericmmartin.com/projects/simplemodal/
 */
(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		path: 'library/index.html'	
	}
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Image library"
	}
	// ---------------------------------------------------------------

	$.markItUp.button.add('library', {
		scripts:[ 'simplemodal/jquery.simplemodal.js' ],
		styles:	[ 'simplemodal/simplemodal.css', 'styles.css' ],
		onClick:function() {
			$('<iframe src="'+ settings.path +'"></iframe>').modal();
		},
		name: i18n.addon,
		classname:'markItUpLibrary'
	});
})(jQuery);