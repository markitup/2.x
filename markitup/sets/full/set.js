var markItUpSettings = {
//	forceWidth:false,
	onShiftEnter:	{ command: { snippet:'<br />\n'} },
	onCtrlEnter:	{ command: { snippet:'\n<p>{S/}</p>' } },
	preview: {
	//	target:"#myPreview",
	//	refreshOnEvent:'onInsert, onEnter'
	},
	events: {
		onInit:		 			function() 	{ console.log('init')},
		onButtonClick: 			function() 	{ console.log('click button')},
		onBeforeDialogOpen: 	function() 	{ console.log('before open dialog')},
		onDialogOpen: 			function() 	{ console.log('open dialog')},
		onBeforeDialogClose: 	function() 	{ console.log('before close dialog')},
		onDialogClose: 			function() 	{ console.log('close dialog')},
		onBeforePreviewOpen: 	function() 	{ console.log('before open preview')},
		onPreviewOpen: 			function() 	{ console.log('open preview')},
		onBeforePreviewRefresh: function()  { console.log('before refresh preview')},
		onPreviewRefresh: 		function()	{ console.log('refresh preview')},
		onBeforePreviewClose: 	function() 	{ console.log('before close preview')},
		onPreviewClose: 		function() 	{ console.log('close preview')},
		onEditStart: 			function() 	{ console.log('start')},
		onEditStop: 			function() 	{ console.log('stop')},
		onBeforeEditJump: 		function() 	{ console.log('before jump')},
		onEditJump: 			function() 	{ console.log('jump')},
		onBeforeInsert: 		function() 	{ console.log('before insert')},
		onInsert: 				function() 	{ console.log('insert')},
		onTrigg: 				function() 	{ console.log('trigger')}
	},
	plugins: [
		$.markItUp.plugin.zenCoding,
	],
	buttons: [
		{ name:'Headings', key:'3', classname:'markItUpHeading', command:'h1', menu:[
			{ name:'Heading 1', key:'1', command:'h1' },
			{ name:'Heading 2', key:'2', command:'h2' },
			{ name:'Heading 3', key:'3', command:'h3' },
			{ name:'Heading 4', key:'4', command:'h4' },
			{ name:'Heading 5', key:'5', command:'h5' },
			{ name:'Heading 6', key:'6', command:'h6' }
		]},
		{ name:'Paragraph', classname:'markItUpP', command:'p'},
		{ separator:true},
		{ name:'Bold', key:'B', classname:'markItUpBold', command:'bold' },
		{ name:'Italic', key:'I', classname:'markItUpItalic', command:'italic' },
		{ name:'Underline',	key:'U', classname:'markItUpUnderline', command:'underline' },
		{ name:'Stroke', key:'S', classname:'markItUpStroke', command:'stroke' },
		{ separator:true},
		{ name:'Ordered list', classname:'markItUpOl', command:'ol' },
		{ name:'List', classname:'markItUpUl', command:'ul' },
		{ separator:true},
		{ name:'Div', classname:'markItUpDiv', command:'div'},
		{ name:'Picture', key:'P', classname:'markItUpPicture', command:'picture' },
		$.markItUp.button.pictures,
		$.markItUp.button.library,
		{ separator:true},
		{ name:'Link', key:'L', classname:'markItUpLink', command:'link' },
		$.markItUp.button.tinyUrl,
		$.markItUp.button.footNotes,
		{ newBlock:true},
		$.markItUp.button.undo,
		$.markItUp.button.redo,
		{ separator:true},
		$.markItUp.button.htmlTidy,
		$.markItUp.button.htmlParser,
		{ separator:true},
		$.markItUp.button.specialChars,
		$.markItUp.button.farbtastic,
		$.markItUp.button.ugeColorPalette,
		$.markItUp.button.colorPalette,
		$.markItUp.button.miniColorPalette,
		{ separator:true},
		$.markItUp.button.calculator,
		$.markItUp.button.emailContent,
		$.markItUp.button.sortContent,
		$.markItUp.button.dateOfTheDay,
		$.markItUp.button.loremIpsum,
		$.markItUp.button.assets,
		$.markItUp.button.codeBlock,
		{ newBlock:true},
		$.markItUp.button.searchAndReplace,
		$.markItUp.button.fullScreen,
		$.markItUp.button.saveContent,
		$.markItUp.button.printContent,
		{ separator:true},
		$.markItUp.button.spellChecker,	
		$.markItUp.button.terminal,
		$.markItUp.button.zenCoding,
		{ separator:true},
		{ name:'Clear tags', classname:'markItUpClean', onClick:function(miu) { 
			miu.selection(miu.selection().replace(/<(.*?)>/g, '').replace(/^(\s)*/mg, ''), true);
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
 		p:			{ snippet:'<p>{S/}</p>' },
 		div:		{ snippet:'<div{E} id="{E}header{O/}footer{O/}menu{/E}"{/E}{E} class="{E/}"{/E}>\n{I/}{S}{Z/}{/S}\n</div>' },
		ul:			{ snippet:'<ul>\n{L}{I/}<li{E} class="item{N/}"{/E}>{S/}</li>{/L}\n</ul>', altSnippet:'{L}{I/}<li>{S/}</li>{/L}' },
		ol:			{ snippet:'<ol>\n{L}{I/}<li{E} class="item{N/}"{/E}>{S/}</li>{/L}\n</ol>', altSnippet:'{L}{I/}<li>{S/}</li>{/L}' },
		bold: 		{ snippet:'<strong>{S/}</strong>', altSnippet:'coucou' },
		italic: 	{ snippet:'<em>{S}test{/S}</em>' },
		stroke: 	{ snippet:'<del>{S/}</del>', multiline:true  },
		underline: 	{ snippet:'<u>{S/}</u>', selected:true },
		link: 		{ onInit:function(miu) { miu.set.dialog.title = 'my link dialog' }, snippet:'<a href="{V href/}">{S/}</a>', dialog:'link' },
		picture: 	{ snippet:'<img src="{V src/}" alt="{V alt/}"{E}{IF placement} style="{V placement/};"{/IF} />', dialog:'picture' },
		minicolor:  { snippet:'{V color/}', dialog:'minicolor' }
	},
	triggers: {
		date: 		{ command:$.markItUp.command.dateOfTheDay },
		lorem: 		{ command:$.markItUp.command.loremIpsum }
	},
	dialogs: {
		picture: {
			title:"Image",
			rows: [
				{ label:"Source", 	 name:"src", value:'http://', legend:'http://' },
				{ label:"Alt text",  name:"alt" },
				{ label:'Placement', name:'placement', value:'none', values:[
					{ label:'None',  value:''},
					{ label:'Left',  value:'float:left' },
					{ label:'Right', value:'float:right' }
				]},
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