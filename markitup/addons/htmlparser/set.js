/*
 * V0.1 - By Jay Salvat
 *
 * Use HTML Parser - By John Resig
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Tidy Html"
	}
	// ---------------------------------------------------------------
	$.markItUp.command.add('htmlParser', {
		scripts:[ 'scripts/htmlparser.js' ],
		onInit:function(miu) {
			var content, sel = false;
			if (miu.selection()) {
				content = miu.selection();
				sel = true;			
			} else {
				content = miu.textarea.value;
			}
			var level = 0;
			var results = "";
			var parents = makeMap("applet,blockquote,div,dl,fieldset,form,frameset,map,object,ol,pre,script,table,tbody,tfoot,thead,tr,ul");
			var blocks = makeMap("h1,h2,h3,h4,h5,h6,p,label,li,address,button,dd,dir,dt,hr,td");
	
			content = content.replace(/\t/g, '')
							 .replace(/\r/g, '')
							 .replace(/\n/g, '')
							 .replace(/ {1,}/g, ' ')
							 .replace(/> </g, '><');
	
			function isBlock(tag) {
				return (tag in blocks);
			}
			function isParent(tag) {
				return (tag in parents);
			}		
			function indent(level) {
				var ind = '';
				for(var i = 0; i < level; i++) {
					ind += '\t';
				}
				return ind;
			}
	
			function makeMap(str){
				var obj = {}, items = str.split(",");
				for ( var i = 0; i < items.length; i++ )
					obj[ items[i] ] = true;
				return obj;
			}
			
			HTMLParser(content, {
				start: function( tag, attrs, unary ) {
					if (isParent(tag)) {
						results += "\n";
						results += indent(level);
					}
					results += "<" + tag;		
					for ( var i = 0; i < attrs.length; i++ ) {
						results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
					}
					results += (unary ? " /" : "") + ">";
					if (isParent(tag)) {
						level++;
						results += "\n";
						results += indent(level);
					}
				},
				end: function( tag ) {
					if (isParent(tag)) {
						level--;
						results += "\n";
						results += indent(level);
					}
					results += "</" + tag + ">";
					if (isBlock(tag) || isParent(tag)) {
						results += "\n";
						results += indent(level);
					}
				},
				chars: function( text ) {
					results += text;
				},
				comment: function( text ) {
					results += "<!--" + text + "-->";
				}
			});
	
			results = results.replace(/\n\t\n/g, '\n')
							 .replace(/\n{2,}/, '\n')
							 .replace(/^\n/, '')
							 .replace(/\n$/, '')
							 .replace(/\t/g, miu.settings().indentation);
			
			if (sel) {
				miu.selection(results);	
			} else {
				miu.content(results);	
			}
		}
	});
	
	$.markItUp.button.add('htmlParser', {
		styles:[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpHtmlParse',
		command: $.markItUp.command.htmlParser
	});
})(jQuery);