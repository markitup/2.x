(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		historyLevels: 20
	}
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 	"Undo / Redo",
		undo:	"Undo",
		redo:	"Redo"
	}
	// ---------------------------------------------------------------

		  
	var undo = function(miu, $$) {
			var h = $(miu.textarea).data('historyStorage');
			var l = $(miu.textarea).data('historyLevel');
			if (l < h.length-1) {
				//$('.markItUpRedo', $$).css('opacity', 1);
				$('.markItUpRedo', $$).removeClass('markItUpRedo-alt');
				miu.content(h[++l]);
			} else {
				$('.markItUpUndo', $$).addClass('markItUpUndo-alt');
			}
			$(miu.textarea).data('historyLevel', l);
		},
		
		redo = function(miu, $$) {
			var h = $(miu.textarea).data('historyStorage');
			var l = $(miu.textarea).data('historyLevel');
			
			if (l >= 0) {
				miu.content(h[l--]);
				$('.markItUpUndo', $$).removeClass('markItUpUndo-alt');
			} else {
				$('.markItUpRedo', $$).addClass('markItUpRedo-alt');
			}
			
			$(miu.textarea).data('historyLevel', l);
		},
		
		store = function(miu, $$) {
			$('.markItUpUndo', $$).removeClass('markItUpUndo-alt');
			$('.markItUpRedo', $$).addClass('markItUpRedo-alt');
			
			var h = $(miu.textarea).data('historyStorage');
			var l = $(miu.textarea).data('historyLevel');
			
			h.unshift(miu.textarea.value);
			historyLevel = 0;
			if (h.length >= settings.historyLevels) {
				h.pop(miu.textarea.value);
			}
			
			$(miu.textarea).data('historyStorage', h);
			$(miu.textarea).data('historyLevel', l);
		}
			  
	$.markItUp.events.add('undoRedo', {
		onInit:function(miu) {
			$(miu.textarea).data('historyStorage', []);
			$(miu.textarea).data('historyLevel', 0);
			store(miu, this);
		},
		onInsert:function(miu) {
			store(miu, this);
		}
	});

	$.markItUp.button.add('undoredo', {
		styles:[ 'styles.css' ]
	});
		
	$.markItUp.button.add('undo', {
		name: i18n.undo,
		classname:'markItUpUndo',
		onClick:function(miu) {
			undo(miu, this);
		}
	});

	$.markItUp.button.add('redo', {
		name: i18n.redo,
		classname:'markItUpRedo',
		onClick:function(miu) {
			redo(miu, this);
		}
	});
})(jQuery);
