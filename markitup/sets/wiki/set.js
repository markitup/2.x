var markItUpSettings = {
	classname:'markItUpWiki',
	onShiftEnter:	{ command: { snippet:'\n\n'} },
	onCtrlEnter:	{ command: { snippet:'\n\n'} },
	plugins: [
		$.markItUp.plugin.wikiParser
	],
	buttons: [
		{ name:'Headings', classname:'markItUpHeading', command:'h3', menu:[
			{ name:'Heading 1', key:'1', command:'h1' },
			{ name:'Heading 2', key:'2', command:'h2' },
			{ name:'Heading 3', key:'3', command:'h3' },
			{ name:'Heading 4', key:'4', command:'h4' },
			{ name:'Heading 5', key:'5', command:'h5' }
		]},
		{ separator:true},
		{ name:'Bold', key:'B', classname:'markItUpBold', command:'bold' },
		{ name:'Italic', key:'I', classname:'markItUpItalic', command:'italic' },
		{ separator:true},
		{ name:'Ordered list', classname:'markItUpOl', command:'ol' },
		{ name:'Unordered List', classname:'markItUpUl', command:'ul' },
		{ separator:true},
		{ name:'Picture', key:'P', classname:'markItUpPicture', command:'picture' },
		{ name:'Link', key:'L', classname:'markItUpLink', command:'link' },
		{ separator:true},
		{ name:'Quote', classname:'markItUpQuote', command:'quote' },
		{ name:'Code', classname:'markItUpCode', command:'code' },
		{ separator:true},
		{ name:'Preview', key:'0', classname:'markItUpPreview', onClick:function(miu) { 
			miu.preview.open();
		}}
	],
	commands: {
		h1: 		{ snippet:'== {S}Heading 1{/S} ==' },
		h2: 		{ snippet:'=== {S}Heading 2{/S} ===' },
		h3: 		{ snippet:'==== {S}Heading 3{/S} ====' },
		h4: 		{ snippet:'===== {S}Heading 4{/S} =====' },
		h5: 		{ snippet:'====== {S}Heading 5{/S} ======' },
		bold: 		{ snippet:"'''{S/}'''" },
		italic: 	{ snippet:"''{S/}''" },
		ol:			{ snippet:'# {S/}', multiline:true },
		ul:			{ snippet:'* {S/}', multiline:true },
		quote: 		{ snippet:'  {S/}', multiline:true },
		code: 		{ snippet:' {S/}', multiline:true },
		link: 		{ snippet:'[{V href/} {S}Text to link{/S}]', dialog:'link' },
		picture: 	{ snippet:'[[Image:{V src/}|{V alt/}]]', dialog:'picture' }
	},	
	triggers: {
		img: 		{ command:'picture' }
	},
	dialogs: {
		picture: {
			title:'Image',
			modal:true,
			rows:[
				{ label:'Source', name:'src', value:'http://' },
				{ label:'Alt text', name:'alt' }
			]
		},
		link: {
			title:'Link',
			modal:true,
			rows:[
				{ label:'Link to', name:'href', value:'http://' }
			]
		}
	}
}