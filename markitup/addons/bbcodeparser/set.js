(function($) {
	$.markItUp.plugin.add('bbcodeParser', {
		scripts:['scripts/bbcode.js'],
		onBeforePreviewRefresh:function(miu) {
			miu.preview.content( parseBBCode( miu.preview.content() ) );
		}
	});
})(jQuery);