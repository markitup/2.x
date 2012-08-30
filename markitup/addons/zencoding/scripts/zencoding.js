// Zen Coding Javascript Parser
// By Jay Salvat - http://jaysalvat.com
//
// Zen Coding Project
// http://code.google.com/p/zen-coding/
var zenCoding = {
     variables: {
        indentation: 		'\t',
        lang: 				'en',
        locale: 			'en-US',
        charset: 			'UTF-8'
    },

	// Dictionary by Sergey Chikuyonok http://chikuyonok.ru
	snippets: {
		'cc:ie6': 			'<!--[if lte IE 6]>|<![endif]-->',
		'cc:ie': 			'<!--[if IE]>|<![endif]-->',
		'cc:noie': 			'<!--[if !IE]><!-->|<!--<![endif]-->',
		'html:4t': 			'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n' +
							'<html lang="${lang}">\n' +
							'<head>\n' +
							'\t<title>+</title>\n' +
							'\t<meta http-equiv="Content-Type" content="text/html;charset=${charset}">\n' +
							'</head>\n' +
							'<body>|</body>\n' +
							'</html>',
		 'html:4s': 		'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n' +
							'<html lang="${lang}">\n' +
							'<head>\n' +
							'\t<title>+</title>\n' +
							'\t<meta http-equiv="Content-Type" content="text/html;charset=${charset}">\n' +
							'</head>\n' +
							'<body>|</body>\n' +
							'</html>',
		 'html:xt': 		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
							'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
							'<head>\n' +
							'\t<title>+</title>\n' +
							'\t<meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
							'</head>\n' +
							'<body>|</body>\n' +
							'</html>',
		 'html:xs': 		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
							'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
							'<head>\n' +
							'\t<title>+</title>\n' +
							'\t<meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
							'</head>\n' +
							'<body>|</body>\n' +
							'</html>',
		'html:xxs': 		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n' +
							'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">\n' +
							'<head>\n' +
							'\t<title>+</title>\n' +
							'\t<meta http-equiv="Content-Type" content="text/html;charset=${charset}" />\n' +
							'</head>\n' +
							'<body>|</body>\n' +
							'</html>',
		'html:5': 			'<!DOCTYPE HTML>\n' +
							'<html lang="${locale}">\n' +
							'<head>\n' +
							'\t<title>+</title>\n' +
							'\t<meta charset="${charset}">\n' +
							'</head>\n' +
							'<body>|</body>\n' +
							'</html>',
		'a': 				'<a href="+">|</a>',
		'a:link': 			'<a href="http://>|</a>',
		'a:mail': 			'<a href="mailto:>|</a>',
		'abbr': 			'<abbr title="+">|</abbr>',
		'acronym': 			'<acronym title="+">|</acronym>',
		'base': 			'<base href="+" />',
		'bdo': 				'<bdo dir="+">|</bdo>',
		'bdo:r': 			'<bdo dir="rtl">|</bdo>',
		'bdo:l': 			'<bdo dir="ltr">|</bdo>',
		'link:css': 		'<link rel="stylesheet" type="text/css" href="{E}style.css{/E}" media="all" />',
		'link:print': 		'<link rel="stylesheet" type="text/css" href="{E}print.css{/E}" media="print" />',
		'link:favicon': 	'<link rel="shortcut icon" type="image/x-icon" href="{E}favicon.ico{/E}" />',
		'link:touch': 		'<link rel="apple-touch-icon" href="favicon.png" />',
		'link:rss': 		'<link rel="alternate" type="application/rss+xml" title="RSS" href="{E}rss.xml{/E}" />',
		'link:atom': 		'<link rel="alternate" type="application/atom+xml" title="Atom" href="{E}atom.xml{/E}" />',
		'meta:utf': 		'<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />',
		'meta:win': 		'<meta http-equiv="Content-Type" content="text/html;charset=Win-1251" />',
		'meta:compat': 		'<meta http-equiv="X-UA-Compatible" content="IE=7" />',
		'style': 			'<style type="text/css">|</style>',
		'script': 			'<script type="text/javascript">|</script>',
		'script:src': 		'<script type="text/javascript" src="+">|</script>',
		'img': 				'<img src="+" alt="+" />',
		'iframe': 			'<iframe src="+" frameborder="0">|</iframe>',
		'embed': 			'<embed src="+" type="+" />',
		'object': 			'<object data="+" type="+">|</object>',
		'param': 			'<param name="+" value="+" />',
		'map': 				'<map name="+">|</map>',
		'area': 			'<area shape="+" coords="+" href="+" alt="+" />',
		'area:d': 			'<area shape="default" href="+" alt="+" />',
		'area:c': 			'<area shape="circle" coords="+" href="+" alt="+" />',
		'area:r': 			'<area shape="rect" coords="+" href="+" alt="+" />',
		'area:p': 			'<area shape="poly" coords="+" href="+" alt="+" />',
		'link': 			'<link rel="stylesheet" href="+" />',
		'form': 			'<form action="+">|</form>',
		'form:get': 		'<form action="+" method="get">|</form>',
		'form:post': 		'<form action="+" method="post">|</form>',
		'label': 			'<label for="+">|</label>',
		'input': 			'<input type="+" />',
		'input:hidden': 	'<input type="hidden" name="+" />',
		'input:h': 			'<input type="hidden" name="+" />',
		'input:text': 		'<input type="text" name="+" />',
		'input:t': 			'<input type="text" name="+" />',
		'input:search': 	'<input type="search" name="+" />',
		'input:email': 		'<input type="email" name="+" />',
		'input:url': 		'<input type="url" name="+" />',
		'input:password': 	'<input type="password" name="+" />',
		'input:p': 			'<input type="password" name="+" />',
		'input:datetime': 	'<input type="datetime" name="+" />',
		'input:date': 		'<input type="date" name="+" />',
		'input:month': 		'<input type="month" name="+" />',
		'input:week': 		'<input type="week" name="+" />',
		'input:time': 		'<input type="time" name="+" />',
		'input:number': 	'<input type="number" name="+" />',
		'input:color': 		'<input type="color" name="+" />',
		'input:checkbox': 	'<input type="checkbox" name="+" />',
		'input:c': 			'<input type="checkbox" name="+" />',
		'input:radio': 		'<input type="radio" name="+" />',
		'input:r': 			'<input type="radio" name="+" />',
		'input:range': 		'<input type="range" name="+" />',
		'input:file': 		'<input type="file" name="+" />',
		'input:f': 			'<input type="file" name="+" />',
		'input:submit': 	'<input type="submit" value="+" />',
		'input:s': 			'<input type="submit" value="+" />',
		'input:image': 		'<input type="image" src="+" alt="+" />',
		'input:i': 			'<input type="image" src="+" alt="+" />',
		'input:reset': 		'<input type="reset" value="+" />',
		'input:button': 	'<input type="button" value="+" />',
		'input:b': 			'<input type="button" value="+" />',
		'select': 			'<select name="+">|</select>',
		'option': 			'<option value="+">|</option>',
		'textarea': 		'<textarea name="+" cols="30" rows="10">|</textarea>',
		'menu:context': 	'<menu type="context">|</menu>',
		'menu:c': 			'<menu type="context">|</menu>',
		'menu:toolbar': 	'<menu type="toolbar">|</menu>',
		'menu:t': 			'<menu type="toolbar">|</menu>',
		'video': 			'<video src="+">|</video>',
		'audio': 			'<audio src="+">|</audio>',
		'html:xml': 		'<html xmlns="http://www.w3.org/1999/xhtml">|</html>',
		'bq': 				'<blockquote>|</blockquote>',
		'acr': 				'<acronym>|</acronym>',
		'fig': 				'<figure>|</figure>',
		'ifr': 				'<iframe>|</iframe>',
		'emb': 				'<embed>|</embed>',
		'obj': 				'<object>|</object>',
		'src': 				'<source>|</source>',
		'cap': 				'<caption>|</caption>',
		'colg': 			'<colgroup>|</colgroup>',
		'fst': 				'<fieldset>|</fieldset>',
		'btn': 				'<button>|</button>',
		'optg': 			'<optgroup>|</optgroup>',
		'opt': 				'<option>|</option>',
		'tarea': 			'<textarea>|</textarea>',
		'leg': 				'<legend>|</legend>',
		'sect': 			'<section>|</section>',
		'art': 				'<article>|</article>',
		'hdr': 				'<header>|</header>',
		'ftr': 				'<footer>|</footer>',
		'adr': 				'<address>|</address>',
		'dlg': 				'<dialog>|</dialog>',
		'str': 				'<strong>|</strong>',
		'prog': 			'<progress>|</progress>',
		'fset': 			'<fieldset>|</fieldset>',
		'datag': 			'<datagrid>|</datagrid>',
		'datal': 			'<datalist>|</datalist>',
		'kg': 				'<keygen>|</keygen>',
		'out': 				'<output>|</output>',
		'det': 				'<details>|</details>',
		'cmd': 				'<command>|</command>'
    },
    shortcuts: {
		'ol+': 				'ol>li',
		'ul+': 				'ul>li',
		'dl+': 				'dl>dt+dd',
		'map+': 			'map>area',
		'table+': 			'table>tr>td',
		'colgroup+': 		'colgroup>col',
		'colg+': 			'colgroup>col',
		'tr+': 				'tr>td',
		'select+': 			'select>option',
		'optgroup+': 		'optgroup>option',
		'optg+': 			'optgroup>option'
    },
	tags: {
		single:	'area|base|basefont|br|col|frame|hr|img|input|isindex|link|meta|param|embed|keygen|command',
		close: 'address|applet|blockquote|button|center|dd|del|dir|div|dl|dt|fieldset|form|frameset|hr|iframe|ins|isindex|li|link|map|menu|noframes|noscript|object|ol|p|pre|script|table|tbody|td|tfoot|th|thead|tr|ul|h1|h2|h3|h4|h5|h6|a|abbr|acronym|applet|b|basefont|bdo|big|br|button|cite|code|del|dfn|em|font|i|iframe|img|input|ins|kbd|label|map|object|q|s|samp|script|select|small|span|strike|strong|sub|sup|textarea|tt|u|var'
	},
	skip:false,
	parse: function(command, indent, nb) {
		if (!nb) this.skip = false;
		nb++;
		// init indent
		indent = indent || '';
		// Replace Shortcuts
		command = this.replaceShortcuts(command);
		// Match string elements
		var attr = /([a-z][a-z0-9:\!\-]*)(#[\w\-\$]+)?((?:\.[\w\-\$]+)*)(?:\*(\d+))?([\+>])?/.exec(command);
		if (!attr) return '';
		var tag 	= (attr[1]||''),
			id 		= (attr[2]||'').replace(/^#/g, ''),
			classes = (attr[3]||'').replace(/^\./, '').replace(/\./g, ' '),
			loop	= (attr[4]||1),
			sign 	= (attr[5]||''),
			html 	= '',	
			command = command.replace(attr[0], '').replace('^[\+>]', '');

		id = id ? ' id="' + id + '"' : '';
		classes = classes ? ' class="' + classes + '"' : '';
			
		// Loop
		for (var i = 0; i < loop; i++) {
			oid = id.replace(/\$/g, i+1);
			oclasses = classes.replace(/\$/g, i+1);
			// Snippets in dictionary
			if (this.isSnippet(tag)) {
				var snippet = this.replaceVariables(this.snippets[tag]), 
					part = indent + snippet + '\n';
				// Insert Children between tags
					part = part.replace(/(>| \/>)/, oid + oclasses + "$1");
				if (sign == '>' && command) {
					part = part.replace(/\|/, '\n' + this.parse(command, indent + this.variables.indentation, nb) + indent);
				}
				part = part.replace(/\|/, '+');
				html += part;
			} else if (this.isTag(tag)) {
				// Open tag	
				html += indent + '<' + tag + oid + oclasses
				// Close tags and continue if > Children
				if (sign == '>' && command) {
					html += '>\n';
					html += this.parse(command, indent + this.variables.indentation, nb);
					html += indent + '</' + tag + '>\n';
				// Close single tags
				} else if (this.isSingle(tag)) {
					html += ' +/>\n';
				// Close empty tags
				} else  {
					html += '>+</' + tag + '>\n';
				} 
			} else {
				this.skip = true;
				return '';
			}
		}
		// Repeat the process if + Siblings
		if (sign == '+' && command) {
			html += this.parse(command, indent, nb);
		}
		if (this.skip) {
			return '';
		}
		return html;
	}, 
	// Replace shortcuts by proper commands
	replaceShortcuts:function(command) {
		for(shortcut in this.shortcuts) {
			command	= command.replace(shortcut, this.shortcuts[shortcut]+ '+') ;
		}
		return command;
	},
	// Replace user variables by values
	replaceVariables:function(snippet) {
		snippet	= snippet.replace(/\t/g, this.variables.indentation);
		for(variable in this.variables) {
			snippet	= snippet.replace(new RegExp('\\${'+variable+'}', 'g'), this.variables[variable]);
		}
		return snippet;
	},
	isShortcuts:function(tag) {
		if (this.shortcuts[tag]) {
			return true;
		}
		return false;
	},
	isSnippet:function(tag) {
		if (this.snippets[tag]) {
			return true;
		}
		return false;
	},
	isClosed:function(tag) {
		return (new RegExp('^('+this.tags.close+')$')).test(tag);
	},
	isSingle:function(tag) {
		return (new RegExp('^('+this.tags.single+')$')).test(tag);
	},
	isTag:function(tag) {
		return (this.isSingle(tag) || this.isClosed(tag));	
	}
}