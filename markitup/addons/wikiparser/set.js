(function($) {
	$.markItUp.plugin.add('wikiParser', {
		scripts:['scripts/wiki2html.js'],
		onBeforePreviewRefresh:function(miu) {
			miu.preview.content( wiki2html( miu.preview.content() ) );
		}
	});
})(jQuery);