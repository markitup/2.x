// ----------------------------------------------------------------------------
// markItUp! Universal MarkUp Engine, JQuery plugin
// v 2.x alpha
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) Jay Salvat
// http://jaysalvat.com/ or http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------
(function($) {
	$.fn.markItUp = function(options, extraOptions) {
		var el = [];
		this.each(function() {
			el.push(new $.markItUp(this, options, extraOptions));
		});
		return el[0]||this;
	};
	
	$.markItUp = function(el, options, extraOptions) {
		var $$ = $(el);
		if (data = $$.data("markItUp")) {
			return data;
		}

		options = $.extend(true, $.markItUp.defaultOptions, options, extraOptions);
							
		var tags = {
			edit: {
				before:'{E}', after:'{/E}', single:'{E/}', opts:'{O/}'
			},
			selection: {
				before:'{S}', after:'{/S}', single:'{S/}'
			},
			lines: {
				before:'{L}', after:'{/L}', count:'{N/}'
			},
			vars: {
				single:'{V (\\w+)/}', before:'{V (\\w+)}', after:'{/V}'
			},
			constants: {
				single:'{C (\\w+)/}'
			},
			conditions: {
				before:'{IF (\\w+)}', after:'{/IF}', alt:'{ELSE/}'
			},
			alternatives: {
				before:'{A}', after:'{/A}', alt:'{OR/}'
			},
			funcs: {
				single:'{F ([A-Za-z0-9_]*?)/}'
			},
			indent: {
				single:'{I/}'
			},
			end: {
				single:'{Z/}'
			}
		},
		textarea 		= el,
		iframe			= '',
		template		= '',
		trigged			= null,
		current			= {},
		editMode		= false,
		selectBack		= null,
		dialog 			= null,
		duplicate		= null,
		previewContent	= null,
		overlay			= {},
		locklay			= {},
		self			= {},
		preview 		= {},
		processing		= {},
		toolbar			= {},
		core 			= {},
		locals			= {},
		globals			= options.globals,
		processes		= [];
		
		var namespace = function (tags, ns) {
			for(var key in tags) {
				var tag = tags[key];
				if (typeof tag === 'object') {
					namespace(tag, ns);
				} else {
					tags[key] = tag.replace('{', '{'+ ns +':');
				}		
			}
		},
			
		init = function() {
			var id = $$.attr('id');
			if (options.id) {
				id = 'id="'+ options.id +'"';
			} else if(id) {
				id = 'id="markItUp'+ id.charAt(0).toUpperCase() + id.substr(1) +'"';
			} else {
				id = '';
			}

			var previewTop = '', 
				previewBot = '';
			if (options.preview.position == 'top') {
				previewTop  = '<div class="markItUpPreviewBlock">'
							+ '<iframe class="markItUpPreviewFrame"></iframe>'
							+ '<a class="markItUpCloseButton" href="#">'+ $.markItUp.i18n.close +'</a>'
							+ '</div>'; 
			} else {
				previewBot  = '<div class="markItUpPreviewBlock">'
							+ '<a class="markItUpCloseButton" href="#">'+ $.markItUp.i18n.close +'</a>'
							+ '<iframe class="markItUpPreviewFrame"></iframe>'
							+ '</div>'; 
			}

			var	blockCode 	= '<div '+ id +' class="markItUp '+ options.classname +'">'
							+ '<div class="markItUpContainer">'
							+ previewTop
							+ '<div class="markItUpEditor">'
							+ '<div class="markItUpHeader">'
							+ '<div class="markItUpToolbar"></div>'
							+ '<div class="markItUpProcessing">'+ $.markItUp.i18n.processing +'</div>'
							+ '<div style="clear:both;"></div></div>'
							+ '<div class="markItUpBody">'+  outerHtml($$) +'</div>'
							+ '<div class="markItUpFooter"></div>'
							+ '</div>'
							+ previewBot
							+ '</div>'
							+ '</div>';

			self = $(blockCode);
			processing = $('.markItUpProcessing', self);
			preview = $('.markItUpPreviewBlock', self);
			toolbar = $('.markItUpToolbar', self);
			var closeButton = $('.markItUpCloseButton', self);
			var container = $('.markItUpContainer', self);
			
			toolbar.append( buildToolbar(options.buttons) );

			closeButton.click(function(e) {
				closePreview();
				return stopEvt(e);
			});
			
			$$.replaceWith(self);
			$$ = $('textarea', self);
			textarea = $$.get(0);

			var iframes = $('iframe', self);
			iframe = iframes[iframes.length-1].contentWindow || frame[iframes.length-1];

			options.preview.parserPath = setRoot(options.preview.parserPath, 1);
			options.preview.templatePath = setRoot(options.preview.templatePath, 1);

			if (options.namespace !== '') {
				namespace(tags, options.namespace);
			}
			if (!options.processing) {
				processing.remove();
			}
			if (options.width) {
				$$.width(options.width);
			}
			if (options.height) {
				$$.height(options.height);
			}
			if (options.forceWidth) {	
				self.width($('textarea').outerWidth(true));
				container.width($('textarea', self).outerWidth(true));
			}
			if (options.preview.openAtStart) {
				preview.show();	
			} else {
				preview.hide();	
			}
			$(document).bind('click.markItUp', function(e) {
				hideMenus();
			});
			
			delete $.markItUp.plugin.add;
			$.each(options.plugins, function(n, settings) {
				$.each(settings, function(evt, func) {
					 $$.bind(evt+'.markItUp', function(e) {
						callback(func);
					 });
				 });
			});
			
			delete $.markItUp.events.add;
			$.each($.markItUp.events, function(name, events) {
				$.each(events, function(evt, func) {
					 $$.bind(evt+'.markItUp', function(e) {
					 	callback(func);
					 });
				 });
			});

			$.each(options.events, function(evt, func) {
				$$.bind(evt+'.markItUp', function(e) {
					callback(func);
				});
			});
			
			$$.bind('keypress.markItUp', function(e) {
				keyPress(e);
 			}).bind('keyup.markItUp', function(e) {
				$$.trigger('onKeyStroke');
			}).bind('keydown.markItUp', function(e) {
				keyDown(e);
			}).bind('focus.markItUp', function() { 
				$('.markItUp textarea').removeClass('markItUpFocused');
				$$.addClass('markItUpFocused');
			});
			
			$.each(options.preview.refreshOnEvent.split(','), function(n, evt) {
				$$.bind(evt, function() {
					refreshPreview();
				});
			});

			initCore();
			refreshPreview();
			
			$$.data('markItUp', core);
			
			$$.trigger('onInit');
		},

		buildToolbar = function(buttons, level) {
			var ul = $('<ul></ul>'), z = options.zIndex;
			$.each(buttons, function() {
				var button = this,
					name = button.name || '',
					classname = button.classname || '',
					key = button.key ? 'accesskey="'+ button.key +'"' : '',
					title, li, delay;
					if (!level) {
					    title = button.key ? name +' ['+ options.keys.shortcut +'+'+ button.key +']' : name;
					} else {
					    title = button.key ? options.keys.shortcut +'+'+ button.key : '';
					}
					if (button.menu) {
					    title = '';
					}
				if (button.newBlock) {
					li = $('<li class="markItUpNewline '+ classname +'" />');
				} else if (button.separator) {
					li = $('<li class="markItUpSeparator '+ classname +'">'+ name +'</li>');
				} else {
					li = $('<li class="markItUpButton '+ classname +'"><a href="#" '+ key +' title="'+ title +'">'+ name +'</a></li>');		
					li.mousedown(function(e) {
						//setTimeout(function() { proceed(button, e); }, 1); // FF
						proceed(button, e); // Safari
						return stopEvt(e);
					}).bind("contextmenu", function(e) {
						return stopEvt(e);
					}).bind("click", function(e) {
						return stopEvt(e);
					});
					if (button.menu) {
						li.hover(function(e){
							var $this = this;
							delay = setTimeout(function(t) {
								$('ul:first:hidden', $this).show();
							}, 600);
						},function(e){
							clearTimeout(delay);
							$('ul:visible:first', this).hide();
						})
                         	.addClass('markItUpDropMenu')
                         	.attr('style', 'z-index:'+ (z--)) // ridiculous hack for IE7 z-index bug
                         	.append( buildToolbar(button.menu, 1) );
					}
				}
				li.appendTo(ul);
			}); 
			return ul;
		},

		hideMenus = function() {
			$('ul ul', toolbar).hide();	
		},

		initCore = function() {
			lineCount = 0;
			duplicate = null;
			previewContent = null;
			locals = {};
			core = {
				textarea: textarea,
				preview: preview,
				processing: processing,
				dialog: null,
				button: null,
				event: null,
				trigger: '',
				keys:{
					alternative: false,
					multiline: false,
					duplicate: false,
					shortcut: false
				},
				set: {
					dialog: {},
					command: {},
					button: {},
					trigger: {}
				},
				line: function() {
					var start = getCaret(),
						line = textarea.value.substr(0, start);

					if (line = line.match(/\b.*$/)) {
						return $.trim(line.toString());
					}

					return '';
				},
				word: function() {
					var start = getCaret(),
						word = textarea.value.substr(0, start);

					if (word = word.match(/\w+$/)) {
						return $.trim(word.toString());
					}

					return '';
				},
				selection: function(start, len) {
					if (typeof(start) == 'string') {
						return launch(start, !len, null, true);
					}
					return start == null ? getSel() : setSel(start, len);
				},
				caret: function(pos) {
					return pos ? setCaret(pos) : getCaret();
				},
				len: function(string) {
					return normalizeLen(string);
				},
				start: function(start) {
					return normalizeStart(start);
				},					
				snippet: function(snippet, selectBack) {
					launch(snippet, selectBack);
				},
				content: function(content) {
					if (content) {
						write(content);							
					}
					return textarea.value;
				},
				constants: function(key) {
					return options.constants[key]||'';
				},
				vars: function(key, value, type) {
					if (key && value) {
						(type == 'global') ? globals[key] = value : locals[key] = value;
					} else if (typeof key == 'object') {
						(type == 'global') ? $.extend(globals, key) : $.extend(locals, key);
					} else if (!key && !value) {
						return $.extend({}, globals, locals);
					} else {
						return getRightVar(key);
					}
				},
				settings:function(settings) {
					if (settings && settings.preview && settings.preview.templatePath) {
						template = null;
					}
					return settings ? $.extend(true, options, settings) : options;
				},
				preview: {
					content: function(content) {
						if (content) {
							previewContent = content;
						}
						return previewContent||textarea.value;
					},
					refresh: function() {
						refreshPreview();
					},
					open: function() {
						openPreview();
					},
					close: function() {
						closePreview();
					},
					write: function(content) {
						writePreview(content);
					}
				},
				lock:function() {
					lock();
				},
				unlock:function() {
					unlock();
				}
			}
		},

		// Insertion -------------------------------

		write = function(content) {
			var tops = textarea.scrollTop,
				content = content||'',
				start = getCaret();
		
			textarea.focus();
			textarea.value = content;
			textarea.scrollTop = tops;

			setCaret(start);
		},

		insert = function(content, selected) {
			var tops = textarea.scrollTop,
				heights = textarea.scrollHeight,
				content = content||'',
				start = getCaret(),
				selection = getSel();

			textarea.focus();
			if (document.selection) {
				document.selection.createRange().text = content;
			} else {
				var begin = textarea.value.substr(0, start),
					end = textarea.value.substr(start + selection.length);
				textarea.value = begin + content + end;
			}
			
			if (heights - tops <= heights) {
				textarea.scrollTop = tops;	
			}

			if (selected) {
				setSel(start, content.length);
			} else {
				setCaret(start + content.length);
			}
		},

		// Caret & Selection -------------------------------

		getSel = function() {
			textarea.focus();
			var sel;
			if (document.selection) {
				sel = document.selection.createRange().text;
			} else {
				sel = textarea.value.substr(textarea.selectionStart, textarea.selectionEnd - textarea.selectionStart);
			}
			return sel;
		},

		setSel = function(start, len) {
			textarea.focus();
			if (document.selection) {
				var range = textarea.createTextRange();
				range.collapse(true);
				range.moveStart('character', start); 
				range.moveEnd('character', len); 
				range.select();
			} else if (textarea.setSelectionRange) {
				textarea.setSelectionRange(start, start + len);
			}
		},

		getCaret = function() {
			textarea.focus();
			var caret, range;
			if (document.selection && !textarea.selectionStart) {
				caret = -1;
				range = document.selection.createRange();
				rangeCopy = range.duplicate();
				rangeCopy.moveToElementText(textarea);
				while(rangeCopy.inRange(range)) {
					rangeCopy.moveStart('character');
					caret++;
				}
			} else {
				caret = textarea.selectionStart;
			}
			return caret;
		},

		setCaret = function(start){
			setSel(start, 0);
		},

		doSelectBack = function() {
			if (!selectBack) return;
			var start = selectBack.start,
				len = textarea.value.length - selectBack.buffer;
			setSel(start, len);
		},

		normalizeLen = function(string) {
			if ($.browser.msie) {
				return string.replace(/\r/g, '').length;
			}
			return len;
		},

		normalizeStart = function(start) {
			if ($.browser.msie) {
				var begin = textarea.value.substr(0, start);
				start -= begin.length - normalizeLen(begin);
			}
			return start;
		},

		// Parsing --------------------------------------------
		
		reg = function(reg, f) {
			return new RegExp(reg, f||'g');
		},

		nestedReg = function(before, after, single) {
			var single = (single) ? single +'|' : '';
			return new RegExp(single + before +'((?:'+ before +'(?:'+ before +'[\\s\\S]*?'+ after +'|.)*?'+ after +'|.)*?)'+ after, 'g');
		},

		proceed = function(elmt, e) {
			initCore();
			hideMenus();
			// Close previously opened dialog
			if (dialog) {
				dialog.close();
			}
			
			if (e && e.type == 'mousedown') {
				core.event = e;
				core.set.button = elmt;
				core.button = $(e.target).parent();
				keyCombo(e, 'duplicate');
				keyCombo(e, 'alternative');
				keyCombo(e, 'multiline');
				keyCombo(e, 'shortcut');
			}
			
			if (trigged) {
				elmt = callback(trigged);
				core.set.trigger = elmt;
				trigged = null;
			}

			if (options.commands[elmt.command]) {
				core.set.command = options.commands[elmt.command];
			} else {
				core.set.command = elmt.command||{};
			}

			if (options.dialogs[core.set.command.dialog||null]) {
				core.set.dialog = options.dialogs[core.set.command.dialog||null];
			} else {
				core.set.dialog = core.set.command.dialog||null;
			}

			if (e && e.type == 'mousedown') {
				$$.trigger('onButtonClick');
				callback(core.set.button.onClick);
			}

			if (core.set.trigger.command) {
				$$.trigger('onTrigg');
				callback(core.set.trigger.onTrigg);
			}

			callback(core.set.command.onInit);

			if (core.set.dialog) {
				core.dialog = openDialog(core.set.dialog);
				return;
			}

			if (core.set.command.snippet) {
				$$.trigger('onBeforeInsert');
				callback(core.set.command.onBeforeInsert);
				
				launch(core.set.command);
			}
		},

		launch = function(command, selected, keepPrevious, disableIndent) {
			textarea.focus();
			command = callback(command);
			var snippet = command;
			
			if (typeof command == 'object') {
				if (keyCombo(core.event, 'alternative') && command.altSnippet) {
					snippet = command.altSnippet;
				} else {
					snippet = command.snippet;
				}
				if (command.selected) {
					selected = true;
				}
			}

			snippet = callback(snippet);

			if (keyCombo(core.event, 'multiline') || command.multiline) {
				snippet = snippet.replace(tags.lines.before, '').replace(tags.lines.after, '');
				snippet = tags.lines.before + snippet + tags.lines.after;
			}

			if (!disableIndent) {
				snippet = keepIndent(snippet);
			}

			// Stop edition mode of previous processes if out of zone
			// if (!keepPrevious && processes[processes.length-1]) {
			// 	processes[processes.length-1].checkEdit();
			// }
			// Stack a new Edit process
			processes.push(new process(snippet, selected));
		},

		// Editing -----------------------------------------

		process = function(snippet, selected) {
			this.up = function() {
				return up();
			}
			this.down = function() {
				return down();
			}
			this.previous = function() {
				return previous();
			}
			this.next = function() {
				return next();
			}
			this.stopEdit = function(stay) {
				return stopEdit(stay);
			}
			this.checkEdit = function() {
				return checkEdit();
			}
			var proceedMultilines = function(snippet) {
				var regex = reg(tags.lines.before +'([\\s\\S]*?)'+ tags.lines.after), found;
				snippet = snippet.replace(regex, function(tag, line) {
					found = true;
					if (core.set.command.duplicate) {
						duplicate = cleanIndent(core.set.command.duplicate);
					} else {
						duplicate = cleanIndent(line);
					}
					selection = t(selection);
					var backup = selection,
						lines  = [],
						splits = selection.split(/[\r]?\n/),
						indent = getIndent();
					for (var i = 0, l = splits.length; i < l; i++ ) {
						var newline = splits[i];
						if (newline === '' && splits.length > 1) {
							lines.push(newline);
							continue;
						}
						selection = newline;
						newline = line.replace(tags.lines.count, ++lineCount);
						newline = proceedTags(newline);
						lines.push(newline);
					}
					selection = backup;
					return lines.join('\n'+indent);
				});
				if (found) {
					return snippet;
				}
				return snippet.replace(tags.lines.count, ++lineCount);
			},

			proceedTags = function(snippet) {
				var regex;
				// Functions
				regex = reg(tags.funcs.single);
				snippet = snippet.replace(regex, function(tag, funcname) {
					if (func = core.set.command[funcname]) {
						return callback(func);
					}
					return tag;
				});
				// Indent
				regex = reg(tags.indent.single);
				snippet = snippet.replace(regex, function() {
					return options.indentation;
				});
				// Alternatives
				regex = reg(tags.alternatives.before +'([\\s\\S]*?)(?:'+ tags.alternatives.alt +'([\\s\\S]*?))?'+ tags.alternatives.after);
				snippet = snippet.replace(regex, function(tag, ifTrue, ifFalse) {
					if (keyCombo(core.event, 'alternative')) {
						return ifTrue;
					} else if (ifFalse) {
						return ifFalse;
					}
					return '';
				});
				// Conditions
				regex = reg(tags.conditions.before +'([\\s\\S]*?)(?:'+ tags.conditions.alt +'([\\s\\S]*?))?'+ tags.conditions.after);
				snippet = snippet.replace(regex, function(tag, varname, ifTrue, ifFalse) {
					if (locals[varname] || globals[varname]) {
						return ifTrue;
					} else if (ifFalse) {
						return ifFalse;
					}
					return '';
				});
				// Constants
				regex = reg(tags.constants.single);
				snippet = snippet.replace(regex, function(tag, varname) {
					return options.constants[varname] || tag;
				});
				// Vars
				regex = reg(tags.vars.single);
				snippet = snippet.replace(regex, function(tag, varname) {
					return getRightVar(varname);
				});
				// Vars with default value
				regex = reg(tags.vars.before +'([\\s\\S]*?)'+ tags.vars.after);
				snippet = snippet.replace(regex, function(tags, varname, value) {
					if (locals[varname] || globals[varname]) {
						return getRightVar(varname);
					}
					return value;
				});	
				// Selection
				regex = reg(tags.selection.single);
				snippet = snippet.replace(regex, function() {
					return cleanIndent(selection) || tags.edit.single;
				});
				// Selection with placeholder
				regex = reg(tags.selection.before +'([\\s\\S]*?)'+ tags.selection.after);
				snippet = snippet.replace(regex, function(tag, placeholder) {
					return cleanIndent(selection) || tags.edit.before + placeholder + tags.edit.after;
				});	
				regex = reg(tags.edit.before + tags.end.single + tags.edit.after);
				snippet = snippet.replace(regex, tags.end.single);

				return snippet;	
			},

			proceedSpots = function(snippet, offset) {
				if ($.browser.opera) {
					snippet = snippet.replace(/\r/g, '').replace(/\n/g, '\r\n');
				}
				var found, start, opts, clean, a, len,
				 	regex = nestedReg(tags.edit.before, tags.edit.after, tags.end.single +'|'+ tags.edit.single);
				while(found = regex.exec(snippet)) {
					if (found[0] == tags.end.single) {	
						start = offset + regex.lastIndex;
						fix += tags.end.single.length;
						landing = start - fix;
					} else if (found[0] == tags.edit.single) {	
						start = offset + regex.lastIndex;
						fix += tags.edit.single.length;
						spots.push({ start: start - fix, len: 0 });
					} else {
						if (!(reg(tags.edit.before+'|'+tags.edit.single)).test(found[1]) ) {
							opts = found[1].split(tags.edit.opts);
							clean =  cleanTags(opts[0]);
							a = found[1].length - clean.length;
						} else {
							opts = null;
							clean = cleanTags(found[1]);
							a = 0;
						}
						start = offset + regex.lastIndex - found[1].length;
						len = clean.length;	
						fix += tags.edit.before.length + tags.edit.after.length;

						spots.push({ start: start - fix, len: len, opts : opts, vindex: 0});

						proceedSpots(found[1], start);
						fix += a;
					}
				}
			},

			cleanTags = function(snippet) {
				var regex = reg(tags.edit.before + "([\\s\\S]*?)" + tags.edit.after);
				snippet = snippet.replace(regex, function(tag, opts) {
					var opts = opts.split(tags.edit.opts);
					return opts[0];
				});
				regex = reg(tags.end.single + "|" + tags.edit.single + "|" + tags.edit.before + "|" + tags.edit.after);
				return snippet.replace(regex, '');
			},

			startEdit = function() {
				index = 0;
				editMode = true;

				$$.trigger('onEditStart');
				callback(core.set.command.onStartEdit);

				if (!totalSpots) {
					stopEdit();
					return;
				}
				go(0);
			},

			stopEdit = function(stay) {
				processes.pop();
				if (!stay) {
					goEnd();
				}
				if (!processes.length) {
					editMode = false;
				}
				$$.trigger('onEditStop');
				callback(core.set.command.onstopEdit);
			},

			checkEdit = function() {
				if (spots[index]) {
					var caret = getCaret(),
						len = getChange(),
						start = spots[index].start,
						end = start + spots[index].len + len;
					if (caret < start || caret > end) {
						stopEdit(1);
						return false;
					}
					return true;
				}
			},

			adjustSpots = function() {
				if (spots[index]) {		
					var spot = spots[index],
						len = getChange();
					if (spot) {
						buffer = textarea.value.length;
						spot.end = spot.start + spot.len;
						spot.len += len;	
						for(var i = 0; i < totalSpots; i++) {
							if (i != index && spots[i]) {
								if (len != 0) {
									if (spots[i].start >= spot.start && spots[i].start + spots[i].len <= spot.end ) {
										spots[i] = null;
										spots[index] = null;
										continue;
									}
								}
								if (spots[i].start <= spot.start && spots[i].start + spots[i].len >= spot.end) {
									spots[i].len += len;
								}
								if (spots[i].start >= spot.start) {
									spots[i].start += len;
								}
							}
						}
						if (landing >= spot.start) {
							landing += len;
						}
						if (checkEdit()) {
							$$.trigger('onEditJump');
							callback(core.set.command.onJump);
						}
					}
				}
			},

			next = function() {
				adjustSpots();
				index++;
				if (index >= totalSpots) {
					stopEdit();
					return false;
				}
				if (!go(index)) {
					next();
				}
			},

			previous = function() {
				adjustSpots(); 
				index--;
				if (index < 0) {
					index = totalSpots - 1;
				}
				if (!go(index)) {	// TODO: Fix the infinite loop when all tabstops are null
					previous();
				}
			},

			up = function() {
				if (!checkEdit() || !spots[index] || !spots[index].opts || spots[index].opts.length <= 1) return true; //  

				adjustSpots();
				var l = spots[index].opts.length - 1,
				 	s = spots[index];
				setSel(s.start, s.len);
				s.vindex++;
				if (s.vindex > l) {
					s.vindex = 0;
				}
				insert(s.opts[s.vindex], true);
				return false;
			},

			down = function() {
				if (!checkEdit() || !spots[index] || !spots[index].opts || spots[index].opts.length <= 1) return true; //  
				adjustSpots();
				var l = spots[index].opts.length - 1,
					s = spots[index];
				setSel(s.start, s.len);
				s.vindex--;
				if (s.vindex < 0) {
					s.vindex = l;
				}
				insert(s.opts[s.vindex], true);
				return false;
			},

			go = function(position) {
				index = position;
				if (spots[index]) {	
					setSel(spots[index].start, spots[index].len);
					return true;
				}
				return false;
			},

			goEnd = function() {
				if (selectBack && selectBack.auto) { 
					doSelectBack();
				} else {
					setCaret(landing);
				}
			},

			getChange = function() {
				return textarea.value.length - buffer;
			},

			index 		= 0,
			totalSpots	= 0,
			buffer 		= 0,
			fix			= 0,
			landing 	= 0,
			spots 		= [],
			id 			= processes.length;
			selection 	= getSel();
			caret		= getCaret();
			snippet 	= proceedMultilines(snippet);
			snippet 	= proceedTags(snippet);
			
			proceedSpots(snippet, caret);
			
			totalSpots 	= spots.length;
			snippet 	= cleanTags(snippet);

			if (!landing) {
			    landing = caret + snippet.length;
			}
			selectBack = { 
				start: getCaret(), 
				buffer: textarea.value.length - selection.length,
				auto: selected
			};

			insert(snippet);

			$$.trigger('onInsert');
			callback(core.set.command.onInsert);

			buffer = textarea.value.length;
			
			setTimeout(function() { 
				startEdit(); 
			}, 1);
		},

		// Indentation ---------------------------------------------------------

		getIndent = function() {
			var begin = textarea.value.substr(0, getCaret()),
				matches = begin.match(/^(.*?)$/mg),
				last = matches[matches.length-1],
				regexp = new RegExp('^(' + options.indentation + ')*');
			return regexp.exec(last)[0]||'';		
		},

		keepIndent = function(content) {
			var indent = getIndent();
			return (content||'').replace(/\n/g, '\n' + indent);
		},
		
		cleanIndent = function(string) {
			regexp = new RegExp('^(' + options.indentation +'|'+ tags.indent.single +')*');
			return (string||'').replace(regexp, '');
		},

		indent = function() {
			if (getSel()) {
				insert(getSel().replace(reg('(^.)', 'mg'), options.indentation + "$1"),getSel());
			} else {
				insert(options.indentation);
			}
		},

		outdent = function() {
			var content = getSel().replace(reg('^' + options.indentation, 'mg'), '');
			insert(content, true);
		},

		isNewLine = function() {
			var char = textarea.value.charCodeAt(getCaret()-1);
			return (char == 10 || char == 13 || isNaN(char));
		},

		// Key managment -----------------------------------------------------

		keyPress = function(e) {
			var sel = getSel();
			// Wrapping
			if (sel !== '') {	
				switch (e.charCode) {
					case 40:
						insert('('+ sel +')', true);
						return stopEvt(e);
					case 123:
						insert('{'+ sel +'}', true);
						return stopEvt(e);
					case 91:
						insert('['+ sel +']', true);
						return stopEvt(e);
					case 39:
						insert("'"+ sel +"'", true);
						return stopEvt(e);
					case 34:
						insert('"'+ sel +'"', true);
						return stopEvt(e);
					case 60:
						sel = sel.replace(/\n/g, '');
						launch('<'+ sel +'>'+ tags.edit.single +'</'+ sel +'>');
						return stopEvt(e);
				}
			}				
		},

		keyDown = function(e) {
			hideMenus();			
			// Key shortcut
			if (keyCombo(e, 'shortcut')) {
				li = $('li a[accesskey='+ String.fromCharCode(e.keyCode) +']', self);
				if (li.length) {
					li.trigger('mousedown');
					return stopEvt(e);
				}
			}

			if ($.browser.opera && e.keyCode == 9) {
				setTimeout(function() {
					textarea.focus();
				}, 1);
			}

			if (e.keyCode == 27) {
				setCaret(getCaret() + getSel().length);	
			}
			
			if (processes.length && editMode == true) {	
				current = processes[processes.length-1];
				if (current) {
					if (e.keyCode == 9) {
						if (e.shiftKey === true) {
							current.previous();
						} else {
							current.next();
						}
						return stopEvt(e);
					} else if (e.shiftKey !== true && e.keyCode == 27) {
						current.stopEdit(1);
						return stopEvt(e);
					} else if (e.keyCode == 38) {
						if (!current.up()) return stopEvt(e);
					} else if (e.keyCode == 40) {
						if (!current.down()) return stopEvt(e);
					} else if (e.keyCode >= 48 && e.keyCode <= 90 && !e.ctrlKey) {
						current.checkEdit();
					}
				}
			} 

			if (e.keyCode == 9 || (e.shiftKey === true && e.keyCode == 27)) {				
				// Triggers
				var test = textarea.value;
				if ($.browser.msie) {
					test = test.replace(/\r*/g, '');	
				}
				var trigger = test.substr(0, getCaret()).match(new RegExp(options.triggerMask+'*$', 'i')).toString();

				trigged = null;
				core.trigger = trigger;
				if (options.triggers[trigger]) {
					trigged = options.triggers[trigger];
				} else if (options.triggers['catchAll']) {
					trigged = callback(options.triggers['catchAll']);
				}
				if (trigged) {
					var start = getCaret(),
						len = trigger.length,
						begin = test.substr(0, start - len),
						end = test.substr(start, textarea.value.length);
						
					setTimeout(function() {
						write(begin + end);
						setCaret(start-len);
						proceed(trigged);
					}, 1);
					return stopEvt(e);
				}
			}
							
			// Tab jobs
			if (e.keyCode == 9) {
				if (e.shiftKey) {
					if (getSel()) {
						outdent();
					} else {
						doSelectBack();
					}
				} else if (e.shiftKey && selectBack) {
					doSelectBack();
				} else {
					if (!selectBack || !selectBack.auto) {
						indent();
					} else {
						setCaret(getCaret() + getSel().length);
					}
					selectBack = null;
				}
				return stopEvt(e);
			} else if (!editMode && (e.keyCode > 48 || e.keyCode == 13)) {
				selectBack = null;
			}

			if (e.keyCode == 13 || e.keyCode == 10) {
				if (keyCombo(e, 'duplicate') && duplicate && editMode) {
					if (!current.checkEdit()) return;
					current.stopEdit(1);
					goNewLine();
					launch('\n'+ duplicate, false); // , false
					return stopEvt(e);
				}
				if (e.ctrlKey && e.shiftKey && options.onShiftCtrlEnter) {
					proceed(options.onShiftCtrlEnter);
					return stopEvt(e);
				}
				if (e.ctrlKey && options.onCtrlEnter) {
					proceed(options.onCtrlEnter);
					return stopEvt(e);
				}
				if (e.shiftKey && options.onShiftEnter) {
					proceed(options.onShiftEnter);
					return stopEvt(e);
				}
				if (options.onEnter) {
					proceed(options.onEnter);
					$$.trigger('onEnter');
					return stopEvt(e);
				}

				insert('\n' + getIndent());
				$$.trigger('onEnter');
				return stopEvt(e);
			}
		},

		keyCombo = function(e, type) {
			var state = e
				&& /ctrl/i.test(options.keys[type]) === e.ctrlKey
				&& /alt/i.test(options.keys[type]) === e.altKey
				&& /shift/i.test(options.keys[type]) === e.shiftKey
				&& (e.shiftKey || e.ctrlKey || e.altKey);
			return core.keys[type] = state;
		},
		
		stopEvt = function(e) {
			e.stopPropagation();
			e.preventDefault();
			return false;
		},

		goNewLine = function() {
			var pos = textarea.value.replace(/\r/g, '').indexOf('\n', getCaret());
			setCaret(pos > 0 ? pos : textarea.value.length); 
		},

		// Callbacks ---------------------------------------
		
		callback = function(elmt) {
			if ($.isFunction(elmt)) {
				return elmt.call(self, core);
			}
			return elmt;
		},

		// Preview -----------------------------------------
		
		openPreview = function(skipRefresh) {
			$$.trigger('onBeforePreviewOpen');

			$('.markItUpPreview', self).addClass('markItUpPreview-alt');
			preview.show();

			$$.trigger('onPreviewOpen');

			if (!skipRefresh) {
				refreshPreview();
			}
		},

		closePreview = function() {
			$$.trigger('onBeforePreviewClose');

			$('.markItUpPreview', self).removeClass('markItUpPreview-alt');
			preview.hide();

			$$.trigger('onPreviewClose');
		},

		refreshPreview = function() {
			if (!options.preview.target && !preview.is(':visible')) {
				return false;	
			}
			previewContent = textarea.value;
			
			$$.trigger('onBeforePreviewRefresh');

			if (options.preview.template) {
				template = options.preview.template;
			} else if (options.preview.parserPath) {
				processing.show();
				$.ajax( {
					type: 'POST',
					url: options.preview.parserPath,
					data: options.preview.parserVar +'='+ encodeURIComponent(previewContent),
					success:function(data) {
						data = setRoot(data);
						writePreview(data);
						processing.hide();
					}
				});
				return;
			} else if (!template) {
				processing.show();
				$.ajax( {
					async:false,
					url: options.preview.templatePath,
					success: function(data) {	
						template = setRoot(data);
						processing.hide();
					}
				});
			}
			writePreview(template.replace(new RegExp("\{previewContent/\}", "g"), previewContent));
			
			$$.trigger('onPreviewRefresh');
		},
		
		writePreview = function(data) {
			data = setRoot(data);
			
			if (options.preview.target && $(options.preview.target).size()) {
				$(options.preview.target).html(data);
				return;
			}
			
			var scrollPosition;	
			try {
				scrollPosition = iframe.document.body.scrollTop || iframe.document.documentElement.scrollTop;
			} catch(e) {
				scrollPosition = 0;
			}

			iframe.document.open();
			iframe.document.write(data);
			iframe.document.close();
		//	setTimeout(function() { iframe.document.close(); }, 10);
			iframe.document.documentElement.scrollTop = scrollPosition;	
			iframe.document.body.scrollTop = scrollPosition;	
		},

		// Dialog ------------------------------------------------------------

		openDialog = function(settings) {
			if (dialog) {
				dialog.close();
			}
			
			$$.trigger('onBeforeDialogOpen');
			callback(core.set.dialog.onBeforeOpen);

			var lay = $('<div class="markItUpOverlay"></div>'),
				box = $('<div class="markItUpDialog '+ (settings.classname || '') +'"><h3>'+ (settings.title || 'markItUp!') +'</h3></div>'),
				buttons = $('<div class="markItUpDialogButtons"></div>');	
			
			box.insert = function() {
				$.extend(locals, getDialogVars());
				if (settings.autoClose !== false) {
					box.close();
				}
				launch(core.set.command);
			};
			box.close = function() {
				closeDialog();
			};
			box.vars = function(key) {
				var vars = getDialogVars(box);
				if (key) {
					return vars[key];
				}
				return vars;
			};
			
			$.each(settings.rows || [], function(n, row) {
				var f = '<div '+ s(row) +' '+ c(row) +'>';
				if (row.label) {
					f += '<label>'+ callback(row.label) +'</label>';
				}
				if (row.include) {
					$.ajax({
						url:row.include,
						async:false,
						success:function(content) {
							f += content;
						}
					})
				}
				if (row.html) {
					f += callback(row.html);
				} else if (row.iframe) {
					f += '<iframe src="'+ row.iframe +'" '+ s(row) +'></iframe>';
				} else if (row.name) {
					if (row.values) {
						f += '<select name="'+ row.name +'">';
						$.each(callback(row.values), function(n, opt) {
							if ((!row.value && n === 0) || (row.value && callback(row.value) == callback(opt.value))) {
								selected = ' selected="selected"';
							} else {
								selected = '';
							}
							f += '<option'+ selected +' value="'+ e( callback(opt.value) ) +'">'+ opt.label +'</option>';
						});
						f += '</select>';
					} else {
						var type = row.checkbox ? 'checkbox' : 'text';
						f += '<input type="'+ type +'" name="'+ row.name +'" value="'+ e( callback(row.value) ) +'" />';
					}
					if (row.legend) {
						f += '<small>'+ (row.legend||'') +'</small>';
					}
				}
				f += '</div>';
				box.append(f);
			});
			
			if (settings.buttons) {
				$.each(settings.buttons, function(n, button) {
					var btn = $('<input type="button" value="'+ button.name +'" '+ c(button) +'/>').click(function(e) {
						core.button = this;
						core.event = e;
						callback(button.onClick);
						return stopEvt(e);
					});
					buttons.append(btn);
				});
			}
			
			box.append(buttons);
				
			if (settings.insertButton !== false) {
				insertButton = $('<input type="submit" value="'+ $.markItUp.i18n.insert +'" />').click(function(e) {
					core.event = e;
					box.insert();
					return stopEvt(e);
				});
				buttons.append(insertButton);
			}
			
			if (settings.closeButton !== false) {
				closeButton = $('<input type="button" value="'+ $.markItUp.i18n.close +'" />').click(function(e) {
					box.close();
					return stopEvt(e);
				});
				buttons.append(closeButton);
			}
			
			if (settings.modal) {
				textarea.blur();
				overlay = lay.appendTo(self);	
			} else {
				overlay = {};
			}
			
			if (settings.draggable !== false) {
				var offsetX, offsetY;
				$("h3", box).mousedown(function(e) {
					offsetX = parseInt(box.css('left')) - e.clientX;
					offsetY = parseInt(box.css('top'))  - e.clientY;
					$(document).bind('mousemove.markItUp', function(e) {
						box.css({ 
							left: e.clientX + offsetX, 
							top: e.clientY + offsetY
						});
						return stopEvt(e);
					});
					return false;
				}).mouseup(function(e) {
					$(document).unbind('mousemove.markItUp');
					return stopEvt(e);
				}).css("cursor", "move");
			}
			
			box.keydown(function(e) {
				if (e.keyCode == 27) closeDialog();
			})
			.wrapInner('<form>')
			.appendTo('body');
			
			core.dialog = box;
			callback(settings.onInit);
			
			if (settings.width) {
				box.width(settings.width);	
			}

			var et = self.offset().top,
				el = self.offset().left,
				ew = self.width(),
				eh = self.height(),
				bw = box.outerWidth(),
				bh = box.outerHeight(),
				ct = et + ((eh)/2) - (bh/2),
				cl = el + (ew/2) - (bw/2);

			if ($(preview).is(':visible')) {
				if (options.preview.position == 'top'){
					ct += preview.height()/2;
				} else {
					ct -= preview.height()/2;						
				}
			}

			$(box).css({
				top: ct > 5 ? ct : 5, 
				left: cl > 5 ? cl : 5
			});
			
			$(overlay).css({ 
				top: 0,
				left: 0, 
				width: ew, 
				height:	eh
			});

			$('input[type=text]:eq(0)', box).focus(function() { this.select(); } ).focus();
			$('.markItUpPicker input').markItUpPicker();

			$$.trigger('onDialogOpen');
			callback(core.set.dialog.onOpen);

			dialog = box;
			return dialog;
		},

		closeDialog = function() {
			$$.trigger('onBeforeDialogClose');
			callback(core.set.dialog.onBeforeClose);
			
			$(overlay).remove();
			$(dialog).remove();
			
			dialog = null;
			textarea.focus();
			
			$$.trigger('onDialogClose');
			callback(core.set.dialog.onClose);
		},

		getDialogVars = function() {
			var dialogVars = {};
			$.each($('input[type=text], input[type=hidden], input[type=checkbox]:checked, input[type=radio]:checked, select, textarea', dialog), function(n, elmt) {
				var name = $(elmt).attr("name"),
				    value = $(elmt).val();
				dialogVars[name] = value;
			});
			return dialogVars;
		},

		lock = function(overlay) {
			textarea.blur();
			locklay = $('<div class="markItUpLock"></div>').appendTo(self);

			var ph = 0;
			if ($(preview).is(':visible') && options.preview.position == 'top') {
				ph = preview.height();
			}

			$(locklay).css({ 
				top: 0 + ph,
				left: 0, 
				width: self.width(), 
				height:	self.height() - preview.height()
			});
		},

		unlock = function() {
			$(locklay).remove();
			textarea.focus();
		},

		getRightVar = function(key) {
			if (locals[key]) {
				return locals[key];
			} else if (globals[key]) {
				return globals[key];
			}
			return '';
		},

		// Utils -----------------------------------------------------------

		t = function(string) {
			return string.replace(/^\n*|\n*$/g, '');
		},

		e = function(string) {
			return $('<p>').text(string||'').html();
		},
		
		c = function(settings) {
			var classes = (settings.classname||'') + (settings.picker ? ' markItUpPicker': '');
			return classes ? 'class="'+ classes + '"' : '';
		},	
		
		s = function(settings) {
			if (settings.width || settings.width) {
				var style = '';
				style += settings.width ? 'width:'+ settings.width +'px;' : '';
				style += settings.height ? 'height:'+ settings.height +'px;' : '';
				return 'style="'+ style+ '"';
			}
			return '';	
		};

		// -------------------------------------------------------------------

		init();

		return core;
	};

	var getRoot = function() {
		var scripts = $('script'), s;
		for (var l = scripts.length, i = 0; i < l ; i++) {
			s = scripts[i].src.match(/(.*)jquery\.markitup(?:\.pack)?\.js$/);
			if (s !== null) { 
				return s[1];
			}
		}
		return '';
	},

	setRoot = function(data, isPath) {
		if (!data) return;
		if (isPath) {
			return data.replace(/^~\//g, $.markItUp.root);
		}
		return data.replace(/("|')~\//g, '$1'+ $.markItUp.root);
	},

	outerHtml = function(elmt) {
		return 	$('<p>').append( $(elmt).clone() ).html();
	};

	$.fn.markItUpRemove = function() {
		return this.each(function() {
			$(this)
			.data('markItUp', null)
			.unbind('.markItUp')
			.parents('div.markItUpContainer:parent')
			.replaceWith($(this));
			$.markItUpCloseDialogs();
		});
	};

	$.fn.markItUpPicker = function() {
		return this.each(function() {
			var $$ = $(this), picker;
			picker = $('<div>')
			.mousemove(function(e) { 
				var v = getColor(e);
				$(this)
				.css({
					backgroundColor:v.h,
					color:((v.r + v.g + v.b / 3) > 220) ? '#000' : '#FFF'
				})
				.text(v.h);
			}).mousedown(function(e) {	
				var v = getColor(e);
				$$.val(v.h);
			}).css({
				display: 'none',
				position: 'absolute',
				top: $$.position().top + $$.outerHeight() - 1, 
				left: $$.position().left - 1
			});

			$$.focus(function() {
				picker.show();
			}).blur(function() {
				picker.hide();
			})
			.after(picker)
			.addClass('markItUpSmall');

			function getColor(e) {
				// By Mark Kahn
				var r, g, b, h, base,
					p = picker.offset(),
					x = e.clientX - Math.round(p.left),
					y = e.clientY - Math.round(p.top),
					i = y * 350 + x - 1,
					w = 350 / 7,
					C = i % 350,
					R = Math.floor(i/(w * 7)),
					c = i % w,
					l = (255 / w) * c;
				if(C >= w * 6){
					r = g = b = 255 - l;
				} else {
					h = 255 - l;
					r = C < w ? 255 : C < w * 2 ? h : C < w * 4 ? 0 : C < w * 5 ? l : 255;
					g = C < w ? l : C < w * 3 ? 255 : C < w * 4 ? h : 0;
					b = C < w * 2 ? 0 : C < w * 3 ? l : C < w * 5 ? 255 : h;
					if(R < (23 / 2)) {
						base = 255 - (255 * 2 / 23) * R;
						r = base + (r * R * 2 / 23);
						g = base + (g * R * 2 / 23);
						b = base + (b *R *2 / 23);
					} else if(R > (23 / 2)){
						base = (23 - R) / (23 / 2);
						r = r * base;
						g = g * base;
						b = b * base;
					}
				}
				return { h:'#'+hex(r)+hex(g)+hex(b), r:r, g:g, b:b };
			}

			function hex(c){
				c = parseInt(c).toString(16);
				return (c.length < 2 ? '0' + c : c).toUpperCase();
			}
		});
	};
	
	$.markItUpCloseDialogs = function() {
		$('.markItUpDialog, .markItUpOverlay').remove();
	};

	$.markItUp.helper = {
		options:function(options) {
			return '{E}'+ options.join('{O/}') +'{/E}';
		},
		humanizeUrl:function(url) {
		  s = url.split("/")[url.split("/").length-1]
		         .split("?")[0]
				 .split("#")[0]
				 .toLowerCase()
		         .replace(/\.[a-z0-9]*$/g, '')
		         .replace(/[-_]/g, ' ')
		         .replace(/(\w)([0-9]+)/g, '$1 $2');
		  return s.charAt(0).toUpperCase() + s.substr(1);
		},
		underline: function(text, char) {
			return '\n' + text + '\n' + text.replace(/./g, char||'-');
		},
		palette: function(miu, varname, defaultValue, data, options) {
			var defaults = {
				selectedClassname: 'selected',
				inputType: 'text',
				inputPosition: 'after',
				autoClose: false,
				colorize: false,
				title: false
			}, options = $.extend(defaults, options), palette, input, id = 'markItUp'+ new Date().getTime();
			if (typeof data !== 'object') {
				palette = data;
			} else {
				palette = '<table id="'+id+'" class="markItUpPalette" cellpadding="0" cellspacing="0" border="0">';
				for (var x = 0, l = data.length; x < l; x++) {
					palette += '<tr>';
					for (var y in data[x]) {
						var label = $.isArray(data[x]) ? data[x][y] : y,
							value = data[x][y], 
							title = '',
							style = '',
							classname = '';
						if (value == defaultValue) {
							classname = 'class="'+ options.selectedClassname +'"';
						}
						if (options.title) {
							title = 'title="'+ label +'"';
						}
						if (options.colorize) {
							palette += '<td bgcolor="'+ value +'"><a href="#" '+ classname +' rel="'+ value +'" '+ title +'></a></td>';
						} else {
							palette += '<td><a href="#" '+ classname +' rel="'+ value +'" '+ title +'>'+ label +'</a></td>';
						}
					}
					palette += '</tr>';
				}
				palette += '</table>';
			}
			input = '<input type="'+ options.inputType + '" name="'+ varname +'" value="'+ defaultValue +'">';
			palette = options.inputPosition == 'before' ? $(input + palette) : $(palette + input);

			$('#'+id).live('click.markItUp', function(e) {	
				var target = $(e.target).closest('a');
				$(this)
				.siblings('input')
				.val(target.attr('rel'));
				if (options.autoClose) {
					miu.event = e;					
					miu.dialog.insert();
				} else {
					$('a', this).removeClass(options.selectedClassname);
					target.addClass(options.selectedClassname);	
				}
				return false;
			});
			return outerHtml(palette);
		}
	};

	$.markItUp.root = getRoot();
		
	$.markItUp.button = {
		add:function(name, settings) { this[name] = $.markItUp.register(name, settings) }
	}
	
	$.markItUp.command = {
		add:function(name, settings) { this[name] = $.markItUp.register(name, settings) }
	}
	
	$.markItUp.dialog = {
		add:function(name, settings) { this[name] = $.markItUp.register(name, settings) }
	}
	
	$.markItUp.plugin = {
		add:function(name, settings) { this[name] = $.markItUp.register(name, settings) }
	}
	
	$.markItUp.events = {
		add:function(name, settings) { this[name] = $.markItUp.register(name, settings) }
	}
	
	$.markItUp.register = function(name, settings) {
		var path = $.markItUp.root + 'addons/'+ name.toLowerCase() +'/', content = '';
		$.each(settings.styles||{}, function(n, style) {
			content += '<link rel="stylesheet" type="text/css" href="'+ path + style +'"/>';	
		});			
		$.each(settings.scripts||{}, function(n, script) {
			content += '<script type="text/javascript" src="'+ path + script +'"></script>';
		});
		if (content) {
			$('head').append(content);
		}
		if (settings.events) {
			$.markItUp.events.add(name, settings.events);
		}
		delete settings.styles;
		delete settings.scripts;
		return settings;
	}

	$.markItUp.i18n = {
		close: 'Close',
		insert: 'Insert',
		processing: 'Processing'
	};
	
	$.markItUp.defaultOptions = {
		id:					'',
		classname:			'',
		width:				'',
		height:				'',
		namespace:			'',
		indentation:		'    ',
		triggerMask:		'[a-z0-9]',
		zIndex:				1000,
		forceWidth:			true,
		processing:			true,
		onEnter:			null,
		onCtrlEnter:		null,
		onShiftEnter:		null,
		onShiftCtrlEnter:	null,
		keys: {
			multiline: 		'Shift+Ctrl',
			alternative: 	'Alt',
			shortcut: 		'Ctrl',
			duplicate: 		'Shift'
		},
		events: {
			onInit:					null,
			onButtonClick: 			null,
			onBeforeDialogOpen: 	null,
			onDialogOpen: 			null,
			onBeforeDialogClose: 	null,
			onDialogClose: 			null,
			onBeforePreviewOpen: 	null,
			onPreviewOpen: 			null,
			onBeforePreviewRefresh: null,
			onPreviewRefresh: 		null,
			onBeforePreviewClose: 	null,
			onPreviewClose: 		null,
			onBeforeInsert: 		null,
			onInsert: 				null,
			onEditStart: 			null,
			onEditStop: 			null,
			onEditJump: 			null,
			onTrigg: 				null,
			onKeyStroke:			null
		},
		preview: {
			openAtStart:	false,
			target:			null, //'#myPreview',
			position:		'bottom',
			template:		null, //'{previewContent/}',
			templatePath:	'~/templates/preview.html',
			parserPath:		null, //'~/templates/parser.php',
			parserVar:		'data',
			refreshOnEvent:	'onInsert,onEnter'
		},
		plugins:			[],	
		buttons:			[],
		commands:			{},
		dialogs:			{},
		triggers:			{},
		globals:			{},
		constants:			{}
	}
})(jQuery);