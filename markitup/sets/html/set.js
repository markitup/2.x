var markItUpSettings = {
	classname:'markItUpHtml',
	onShiftEnter:	{ command: { snippet:'<br />\n'} },
	onCtrlEnter:	{ command:'p' },
	preview: {
		refreshOnEvent:'onInsert, onEnter'
	},
	buttons: [
		{ name:'Headings', classname:'markItUpHeading', command:'h3', menu:[
			{ name:'Heading 1', key:'1', command:'h1' },
			{ name:'Heading 2', key:'2', command:'h2' },
			{ name:'Heading 3', key:'3', command:'h3' },
			{ name:'Heading 4', key:'4', command:'h4' },
			{ name:'Heading 5', key:'5', command:'h5' },
			{ name:'Heading 6', key:'6', command:'h6' }
		]},
		{ name:'Paragraph', key:'P', classname:'markItUpP', command:'p' },
		{ separator:true},
		{ name:'Bold', key:'B', classname:'markItUpBold', command:'bold' },
		{ name:'Italic', key:'I', classname:'markItUpItalic', command:'italic' },
		{ name:'Stroke', key:'S', classname:'markItUpStroke', command:'stroke' },
		{ separator:true},
		{ name:'Ordered list', classname:'markItUpOl', command:'ol' },
		{ name:'Unordered List', classname:'markItUpUl', command:'ul' },
		{ separator:true},
		{ name:'Picture', key:'P', classname:'markItUpPicture', command:'picture' },
		{ name:'Link', key:'L', classname:'markItUpLink', command:'link' },
		{ separator:true},
		{ name:'Remove tags', classname:'markItUpClean', onClick:function(miu) { 
			miu.selection( miu.selection().replace(/<(.*?)>/g, '').replace(/^ */mg, ''));
		}},
		{ name:'Preview', key:'0', classname:'markItUpPreview', onClick:function(miu) { 
			miu.preview.open() ;
		}}
	],
	commands: {
		h1: 		{ snippet:'<h1{A} id="{E/}"{/A}>{S}Heading 1{/S}</h1>' },
		h2: 		{ snippet:'<h2{A} id="{E/}"{/A}>{S}Heading 2{/S}</h2>' },
		h3: 		{ snippet:'<h3{A} id="{E/}"{/A}>{S}Heading 3{/S}</h3>' },
		h4: 		{ snippet:'<h4{A} id="{E/}"{/A}>{S}Heading 4{/S}</h4>' },
		h5: 		{ snippet:'<h5{A} id="{E/}"{/A}>{S}Heading 5{/S}</h5>' },
		h6: 		{ snippet:'<h6{A} id="{E/}"{/A}>{S}Heading 6{/S}</h6>' },
		p:			{ snippet:'<{A}div{OR/}p{/A}>{S/}</{A}div{OR/}p{/A}>\n' },
		bold: 		{ snippet:'<strong>{S/}</strong>' },
		italic: 	{ snippet:'<em>{S/}</em>' },
		stroke: 	{ snippet:'<del>{S/}</del>' },
		ol:			{ snippet:'<ol>\n{L}    <li>{S/}</li>{/L}\n</ol>\n', altSnippet:"    <li>{S/}</li>" },
		ul:			{ snippet:'<ul>\n{L}    <li>{S/}</li>{/L}\n</ul>\n', altSnippet:"    <li>{S/}</li>" },
		link: 		{ snippet:'<a href="{V href/}"{IF title} title="{V title/}"{/IF}{V target/}>{S/}</a>', dialog:'link' },
		picture: 	{ snippet:'<img src="{V src/}" alt="{V alt/}" {IF placement}style="{V placement/};"{/IF}/>', dialog:'picture' }
	},
	triggers: {
		img: 		{ command:'picture' }
	},
	dialogs: {
		picture: {
			title:"Image",
			modal:true,
			rows:[
				{ label:"Source", name:"src", value:'http://' },
				{ label:"Alt text", name:"alt" },
				{ label:'Placement', name:'placement', value:'none', values:[
					{ label:'None', value:''},
					{ label:'Left', value:'float:left' },
					{ label:'Right', value:'float:right' }
				]}
			]
		},
		link: {
			title:"Link",
			modal:true,
			rows:[
				{ label:"Link to", name:"href", value:'http://' },
				{ label:"Title", name:"title" },
				{ label:'Target', name:'target', value:'', values:[
					{ label:'Same window' },
					{ label:'New window', value:' target="_blank"' }
				]}
			]
		}
	}
}