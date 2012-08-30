var markItUpSettings = {
	classname:'markItUpBbocode',
	plugins: [
		$.markItUp.plugin.bbcodeParser
	],
	buttons: [
		{ name:'Bold', key:'B', classname:'markItUpBold', command:'bold' },
		{ name:'Italic', key:'I', classname:'markItUpItalic', command:'italic' },
		{ name:'Underline', key:'U', classname:'markItUpUnderline', command:'underline' },
		{ separator:true},
		{ name:'Ordered list', classname:'markItUpOl', command:'ol' },
		{ name:'Unordered List', classname:'markItUpUl', command:'ul' },
		{ separator:true},
		{ name:'Picture', key:'P', classname:'markItUpPicture', command:'picture' },
		{ name:'Link', key:'L', classname:'markItUpLink', command:'link' },
		{ separator:true},
		{ name:'Colors', classname:'markItUpColor', command:'color'},
		{ name:'Size', key:'S', classname:'markItUpSize', command:'size', menu :[
			  { name:'Big', command:'big' },
			  { name:'Normal', command:'normal' },
			  { name:'Small', command:'small' }
		]},
		{ separator:true},
		{ name:'Quote', classname:'markItUpQuote', command:'quote' },
		{ name:'Code', classname:'markItUpCode', command:'code' },
		{ separator:true},
		{ name:'Remove tags', classname:'markItUpClean', onClick:function(miu) { 
			miu.selection( miu.selection().replace(/[(.*?)]/g, '').replace(/^ */mg, ''));
		}},
		{ name:'Preview', key:'0', classname:'markItUpPreview', onClick:function(miu) { 
			miu.preview.open() ;
		}}
	],
	commands: {
		bold: 		{ snippet:'[b]{S/}[/b]' },
		italic: 	{ snippet:'[i]{S/}[/i]' },
		underline: 	{ snippet:'[u]{S/}[/u]' },
		ol:			{ snippet:'[list={E}1{/E}]\n{L}{I/}[*]{S/}{/L}\n[/LIST]\n', altSnippet:"{I/}[*]{S/}" },
		ul:			{ snippet:'[list]\n{L}{I/}[*]{S/}{/L}\n[/LIST]\n', altSnippet:"{I/}[*]{S/}" },
		link: 		{ snippet:'[url={V href/}]{S/}[/url]', dialog:'link'  },
		picture: 	{ snippet:'[img]{V src/}[/img]', dialog:'picture' },
		quote: 		{ snippet:'[quote="{E}Who?{/E}"]{S/}[/quote]' },
		code: 		{ snippet:'[code]{S/}[/code]' },
		size: 		{ snippet:'[size={E}200{O/}100{O/}50{E/}]{S/}[/size]' },
		big: 		{ snippet:'[size=200]{S/}[/size]' },
		normal: 	{ snippet:'[size=100]{S/}[/size]' },
		small: 		{ snippet:'[size=50]{S/}[/size]' },
		color: 		{ snippet:'{IF bgcolor}[bgcolor={V bgcolor/}]{/IF}'
							+ '{IF color}[color={V color/}]{/IF}{S/}'
							+ '{IF color}[/color]{/IF}'
							+ '{IF bgcolor}[/bgcolor]{/IF}', dialog:'color' }
	},
	triggers: {
		img: { command:'picture' }
	},
	dialogs: {
		picture: {
			title:"Image",
			modal:true,
			rows:[ { label:"Source", name:"src", value:'http://' } ]
		},
		link: {
			title:"Link",
			modal:true,
			rows:[ { label:"Link to", name:"href", value:'http://' } ]
		},
		color: {
			title:'Colors',
			classname:'markItUpColorPalette',
			insertButton:false,
			rows:[
			{	html:function(miu) {
					return $.markItUp.helper.palette(miu, 'color', '#000000', [
					['#000000','#993300','#333300','#003300','#003366','#000080','#333399','#333333'],
					['#800000','#FF6600','#808000','#008000','#008080','#0000FF','#666699','#808080'],
					['#FF0000','#FF9900','#99CC00','#339966','#33CCCC','#3366FF','#800080','#999999'],
					['#FF00FF','#FFCC00','#FFFF00','#00FF00','#00FFFF','#00CCFF','#993366','#C0C0C0'],
					['#FF99CC','#FFCC99','#FFFF99','#CCFFCC','#CCFFFF','#99CCFF','#CC99FF','#FFFFFF']
					], { inputType:'hidden', autoClose:true, colorize:true, title:true });
				}
			}]
		}
	}
}






