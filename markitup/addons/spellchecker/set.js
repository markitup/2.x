(function($) {
	// SETTINGS ------------------------------------------------------
	var settings = {
		lang:'en',
		ignorecaps:1,
		ignoredigits:1	
	}
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Spell check"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.button.add('spellChecker', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpSpellChecker',
		onClick:function(miu) {
			miu.processing.show();
			var $$ = $(this), 
				preview = $('iframe', $$),
				autoRefresh = miu.settings().preview.autoRefresh;
						
			var options = $.extend({},
				settings,
				{ text: miu.selection() || miu.textarea.value }
			);
				
			var checkSpelling = function() {
				$.get($.markItUp.root + 'addons/spellChecker/scripts/spellcheck.php', options, 
				function(result) { 
					displayResults(result);
					miu.lock();
				});
			};
	
			checkSpelling();
	
			var displayResults = function(result) {
				// Set the autoRefresh value to false
				miu.settings({ preview:{ autoRefresh:false } })
				miu.button.addClass('markItUpSpellChecker-alt');
				
				// Closing/opening the preview  set back the autoRefresh value to the original value
				$('.markItUpCloseButton', $$).one('click', function() {
					miu.settings({ preview:{ autoRefresh:autoRefresh } });
					miu.unlock();
					miu.button.removeClass('markItUpSpellChecker-alt');
				});
				$('.markItUpPreviewBlock', $$).one('click', function() {
					miu.settings({ preview:{ autoRefresh:autoRefresh } });
					miu.unlock();
					miu.button.removeClass('markItUpSpellChecker-alt');
				});
			
				miu.preview.open(true);
				miu.preview.write(result);
	
				preview.load(function() {  
					$(preview).contents().find('dd').bind('click',function() {
						var $$ = $(this),
							dl = dt = $(this).parent(),
							dt = dl.find('dt'),
							start = miu.start(parseInt(dt.attr('start'))),
							len = parseInt(dt.attr('len')),
							word = $('.word', dt).text();
							replacement = $$.text();
						
						if ($$.hasClass('select')) {
							miu.selection(start, len);
							return;
						} else if ($$.hasClass('ignore')) {
							$(this).parent('dt').remove();
							if ( !$('dt', preview).length ) {
								miu.preview.close();
							}
						} else {
							var fix = word.length - replacement.length;
							$('.word', dt).text(replacement);
						
							miu.selection(start, len);
							miu.snippet(replacement, true);
						
							$('.ignore', dl).addClass('done');
							dt.attr('len', replacement.length);
						
							dl.nextAll().each(function() {					
								$('dt', this).attr('start', parseInt($('dt', this).attr('start')) - fix);
							});
						
							$('.ignore', dl).text('Done!');
						}
					});
				});
	
				miu.processing.hide();
			}
	
		}
	});
})(jQuery);