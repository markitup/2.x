/* HtmlTidy - Tidy the HTML code
 * V0.1 - By Jay Salvat
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: 		"Html Tidy",
		repair:		"Repair",
		report:		"Report"
	}
	// ---------------------------------------------------------------
	$.markItUp.command.add('htmlTidyRepair', {
		onInit:function(miu) {
			// Show the processing indicator
			miu.processing.show();
	
			var tidy;
			// If there is a no selection, we work with the textarea content
			if (miu.selection() == '') {
				$.ajax({
					async:   false,
					type:    'POST',
					url:     $.markItUp.root + 'addons/htmlTidy/scripts/repair.php',
					data:    'data='+ encodeURIComponent(miu.textarea.value),
					success:function(content) {
						// Replace the textarea content by the new content
						miu.textarea.value = content;
					}, complete: function() {
						// Hide the processing indicator
						miu.processing.hide();
					}
				});
			// If there is a selection, we work with the selection
			} else {
				$.ajax({
					async:   false,
					type:    'POST',
					url:     $.markItUp.root + 'addons/htmlTidy/scripts/repair.php',
					data:    'selection='+ encodeURIComponent(miu.selection()),
					success:function(content) {
						// Replace the selection with the new content
						miu.replace(content); 
					}, complete: function() {
						// Hide the processing indicator
						miu.processing.hide();
					}
				});
			}    
		}
	});
	
	$.markItUp.command.add('htmlTidyReport', {
		onInit:function(miu) {
			// Show the processing indicator
			miu.processing.show();
	
			var settings = miu.settings();
			// Get the current autoRefresh value
			var	autoRefresh = settings.preview.autoRefresh;
			
			// Set the autoRefresh value to false
			miu.settings({ preview:{ autoRefresh:false } })
			
			// Closing/opening the preview  set back the autoRefresh value to the original value
			$('.markItUpCloseButton', this).one('click', function() {
				miu.settings({ preview:{ autoRefresh:autoRefresh } });
			});
			$('.markItUpPreview', this).one('click', function() {
				miu.settings({ preview:{ autoRefresh:autoRefresh } });
			});
			
			// Get the HTML Tidy report
			$.ajax({
				type:     'POST',
				url:      $.markItUp.root + 'addons/htmlTidy/scripts/report.php',
				data:     'data='+ encodeURIComponent(miu.textarea.value),
				success:function(content) {
					// Open the report in the preview
					miu.preview.open();
					miu.preview.write(content);
					
					// Open the report in a new Window
					// win = window.open('', 'htmlTidyReport','width=600, height=400, resizable=yes, scrollbars=yes');
					// win.document.open();
					// win.document.write(content);
					// win.document.close();
					// win.focus();
					
					// Hide the processing indicator
					miu.processing.hide();
				}
			});
		}
	});
	
	$.markItUp.button.add('htmlTidy', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpHtmlTidy',
		command: $.markItUp.command.htmlTidyRepair,
		menu:[
			{	name: i18n.repair,
				classname:'markItUpHtmlTidyRepair',
				command: $.markItUp.command.htmlTidyRepair
			},
			{	name: i18n.report,
				classname:'markItUpHtmlTidyReport',
				command: $.markItUp.command.htmlTidyReport
			}
		]
	});
})(jQuery);