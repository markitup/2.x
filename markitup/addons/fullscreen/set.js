/* Fullscreen - Get the editor fullScreen
 * V0.1 - By Jay Salvat
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Fullscreen"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.button.add('fullScreen', {
		styles: [ 'styles.css' ],
		name: i18n.addon, 
		classname:'markItUpFullScreen', 
		onClick:function(miu) { 
			var textarea 	= $('.markItUpContainer textarea', this),
				container 	= $('.markItUpContainer', this),
				footer 		= $('.markItUpFooter', this),
				header 		= $('.markItUpHeader', this),
				body 		= $('body'),
				Wdelta 		= parseInt(textarea.outerWidth(true)) - parseInt(textarea.width()),
				Hdelta 		= parseInt(textarea.outerHeight(true)) - parseInt(textarea.height()),
				$$			= $(this),
				ifr;
					
			function resize() {
				//  Container has to fit the screen
				if (screen.availHeight) {
					container
						.height(screen.availHeight)
						.width(screen.availWidth);
				} else {
					container
						.height(window.innerHeight)
						.width(window.innerWidth);
				}
				//  Textarea has to fit the container
				textarea
					.width( 
						container.innerWidth() - (Wdelta)
					).height( 
						container.innerHeight() - (Hdelta)
						- header.outerHeight(true)
						- footer.outerHeight(true)
					);
			}
			
			function goFullscreen() {
				ie7fix = $('<div class="markItUpIe7Fix"></div>').css({
					height:'10000px'
				}).appendTo($$);
				
				// Change the button icon
				miu.button.addClass('markItUpFullScreen-alt');
				// Place the editor on top left
				container.css({
					position:'fixed',
					top:0, 
					left:0,
					margin:0,
					zIndex:99999
				});
				body.css('overflow', 'hidden');
				
				// Resize the editor when the window is resized
				$(window).bind('resize.markItUpFullscreen', function() { 
					resize() 
				});
				// Resize
				resize();
			}
			
			function goNormal() {
				// Change the button icon
				miu.button.removeClass('markItUpFullScreen-alt');
	
				var origin = $$.data('fullScreen');
				container
					.css({
						position: 		origin.container.position,
						top:			origin.container.top,
						left:			origin.container.left,
						marginLeft:		origin.container.marginL,
						marginRight:	origin.container.marginR,
						marginBottom:	origin.container.marginB,
						marginTop:		origin.container.marginT,
						zIndex:			origin.container.zIndex 
					})
					.width( 		origin.container.width)
					.height( 		'auto');
				textarea
					.width( 		origin.textarea.width)
					.height( 		origin.textarea.height);
				
				body.css('overflow', origin.body.overflow);
				$(window).unbind('.markItUpFullscreen');
				
				$(".markItUpIe7Fix", $$).remove();
				
				$$.unbind('.markItUpFullscreen');
				
				document.documentElement.scrollTop = origin.body.scrollTop;
			}

			if ($(this).data('fullScreen')) {
				// Close the preview if it is open
				miu.preview.close();
				// Go nromal
				goNormal();	
				// Delete the original values
				$(this).data('fullScreen', false);
			 } else {
				// Close the preview if it is open
				miu.preview.close();

				// Store the original values
				$(this).data('fullScreen', {
					container: {
						position: 	container.css('position'),
						top: 		container.css('top'),
						left: 		container.css('left'),
						marginB: 	container.css('marginBottom'), 
						marginT: 	container.css('marginTop'), 
						marginL: 	container.css('marginLeft'), 
						marginR: 	container.css('marginRight'), 
						zIndex: 	container.css('zIndex'),
						width:		container.width(),
						height:		container.height()
					},
					textarea: {
						width:		textarea.width(),
						height:		textarea.height()
					},
					body: {
						scrollTop:	document.documentElement.scrollTop,
						overflow:	body.css('overflow')
					}
				});

				// Go fullScreen
				goFullscreen();
			}
		}
	});
})(jQuery);