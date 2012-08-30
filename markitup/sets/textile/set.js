var markItUpSettings = {
	classname:'markItUpTextile',
	onShiftEnter:	{ command: { snippet:'\n\n'} },
	onCtrlEnter:	{ command:'p' },
	plugins: [
		$.markItUp.plugin.textileParser
	],
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
		{ name:'Quote', classname:'markItUpQuote', command:'quote' },
		{ name:'Code', classname:'markItUpCode', command:'code' },
		{ separator:true},
		{ name:'Preview', key:'0', classname:'markItUpPreview', onClick:function(miu) { 
			miu.preview.open() ;
		}}
	],
	commands: {
		h1: 		{ snippet:'h1. {S}Heading 1{/S}', altSnippet:'h1({E}class{/E}). {S}Heading 1{/S}' },
		h2: 		{ snippet:'h2. {S}Heading 2{/S}', altSnippet:'h2({E}class{/E}). {S}Heading 2{/S}' },
		h3: 		{ snippet:'h3. {S}Heading 3{/S}', altSnippet:'h3({E}class{/E}). {S}Heading 3{/S}' },
		h4: 		{ snippet:'h4. {S}Heading 4{/S}', altSnippet:'h4({E}class{/E}). {S}Heading 4{/S}' },
		h5: 		{ snippet:'h5. {S}Heading 5{/S}', altSnippet:'h5({E}class{/E}). {S}Heading 5{/S}' },
		h6: 		{ snippet:'h6. {S}Heading 6{/S}', altSnippet:'h6({E}class{/E}). {S}Heading 6{/S}' },
		p:			{ snippet:'p. {S}Some text{/S}', altSnippet:'p({E}class{/E}). {S}Some text{/S}' },
		bold: 		{ snippet:'*{S/}*' },
		italic: 	{ snippet:'_{S/}_' },
		stroke: 	{ snippet:'-{S/}-' },
		ol:			{ snippet:'# {S/}', altSnippet:'#{S/}', multiline:true },
		ul:			{ snippet:'* {S/}', altSnippet:'*{S/}', multiline:true },
		quote: 		{ snippet:'bq. {S}Text to quote{/S}', altSnippet:'??{S/}??' },
		code: 		{ snippet:'bc. {S}Code sample{/S}', altSnippet:'@{S/}@' },
		link: 		{ snippet:'"{S}Text to link{/S}{IF title}({V title/}){/IF}":{V href/}', dialog:'link' },
		picture: 	{ snippet:'!{V src/}{IF alt}({V alt/}){/IF}!', dialog:'picture' }
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
				{ label:'Link to', name:'href', value:'http://' },
				{ label:'Title', name:'title' }
			]
		}
	}
}