(function($) {
	$.markItUp.plugin.add('textileParser', {
		scripts:['scripts/supertextile.js'],
		onBeforePreviewRefresh:function(miu) {
			miu.preview.content( superTextile( miu.preview.content() ) );
		}
	});
})(jQuery);