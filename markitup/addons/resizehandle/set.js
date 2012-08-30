/* Resize Handle - Add a vertical resize handle to the editor
 * V0.1 - By Jay Salvat
 */
(function($) {
	$.markItUp.plugin.add('resizeHandle', {
		styles:[ 'styles.css' ],
		onInit:function(miu) {
			var resizeHandle = $('<div class="markItUpResizeHandle"></div>')
				.bind("mousedown.markItUp", function(e) {
					var h = miu.textarea.height(), y = e.clientY, mouseMove, mouseUp;
					mouseMove = function(e) {
						$$.css("height", Math.max(20, e.clientY+h-y)+"px");
						return false;
					};
					mouseUp = function(e) {
						$(document)
							.unbind("mousemove.markItUp", mouseMove)
							.unbind("mouseup.markItUp", mouseUp);
						return false;
					};
					$(document)
						.bind("mousemove.markItUp", mouseMove)
						.bind("mouseup.markItUp", mouseUp);
			});
			$('.markItUpFooter', this).append(resizeHandle);
		}
	});
})(jQuery);