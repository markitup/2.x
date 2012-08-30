var markItUpSettings = {
	classname:'markItUpMarkdown',
	onShiftEnter:	{ command: { snippet:'\n\n'} },
	onCtrlEnter:	{ command: { snippet:'\n\n'} },
	preview: {
		template:'{previewContent/}',
		target:'#myPreview',
		refreshOnEvent:'onKeyStroke,onInsert,onEnter'
	},
	plugins:[
		$.markItUp.plugin.markdownParser
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
		h1: 		{ snippet:'# {S}Heading 1{/S} #', altSnippet:function(miu) { return $.markItUp.helper.underlineText(miu.selection()||'Heading 1', '=') } },
		h2: 		{ snippet:'## {S}Heading 2{/S} ##', altSnippet:function(miu) { return $.markItUp.helper.underlineText(miu.selection()||'Heading 2', '-' ) } },
		h3: 		{ snippet:'### {S}Heading 3{/S} ###' },
		h4: 		{ snippet:'#### {S}Heading 4{/S} ####' },
		h5: 		{ snippet:'##### {S}Heading 5{/S} #####' },
		h6: 		{ snippet:'###### {S}Heading 6{/S} ######' },
		bold: 		{ snippet:'**{S/}**' },
		italic: 	{ snippet:'_{S/}_' },
		ol:			{ snippet:'{N/}. {S/}', altSnippet:'\t{S/}', multiline:true },
		ul:			{ snippet:'- {S/}', altSnippet:'\t{S/}', multiline:true },
		quote: 		{ snippet:'> {S}Text to quote{/S}', multiline:true },
		code: 		{ snippet:'{A}`{OR/}\t{/A}{S}Code sample{/S}{A}`{/A}', multiline:true },
		link: 		{ snippet:'[{S}Text to link{/S}]({V href/}{IF title} "{V title/}"{/IF})', dialog:'link' },
		picture: 	{ snippet:'![{V alt/}]({V src/}{IF title} "{V title/}"{/IF})', dialog:'picture' }		
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
				{ label:'Alt text', name:'alt' },
				{ label:'Title', name:'title' }
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