/* ShowDown parser - Use ShowDown to parse markDown in the preview
 * V0.1 - By Jay Salvat
 *
 * Use ShowBown - By John Fraser
 * http://www.attacklab.net/
 */
(function($) {
	$.markItUp.plugin.add('markdownParser', {
		scripts:['scripts/showdown.js'],
		onBeforePreviewRefresh:function(miu) {
			var showdown = new Showdown.converter();
			miu.preview.content( showdown.makeHtml( miu.preview.content() ) );
		}
	});
})(jQuery);