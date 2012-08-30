var markItUpSettings = {
	classname:'markItUpCss',
	onShiftEnter: { command:'comments' },
	buttons: [
		{ name:'Class', classname:'markItUpBold', command:'name' },
		{ separator:true },
		{ name:'Bold', key:'B', classname:'markItUpBold', command:'bold' },
		{ name:'Italic', key:'I', classname:'markItUpItalic', command:'italic' },
		{ name:'Fonts', key:'F', classname:'markItUpItalic', command:'fonts' },
		{ name:'Borders', key:'B', classname:'markItUpItalic', command:'borders' }
	], 
	commands: {
		name: 		{ snippet:'{E}.{O/}#{O/}{/E}{E}element{/E} {\n{L}{I/}{S/}{/L}{Z/}\n}' },
		bold: 		{ snippet:'font-weight: bold;' },
		italic: 	{ snippet:'font-style: italic;' },
		fonts: 		{ snippet:'font: {V style/}{V size/}{IF lheight}/{V lheight/}{/IF}{V family/};', dialog:'fonts' },
		borders: 	{ snippet:'border: {V size/} {V style/} {V color/};', dialog:'borders' },
		comments:	{ snippet:'/* {S/} */', multiline:true }
	},
	dialogs: {
		fonts: {
			title:'Font',
			modal:true,
			rows:[ 
				{ label:'Family', name:'family', value:'Arial', values:[
					{ label:'Arial',  		value:' Arial, sans-serif'},
					{ label:'Courier',		value:' "Courier New", monospace' },
					{ label:'Georgia', 		value:' "Georgia", serif' },
					{ label:'Times', 		value:' "Times New Roman", serif' },
					{ label:'Trebuchet',	value:' "Trebuchet MS", sans-serif' },
					{ label:'Verdana',  	value:' Verdana, sans-serif' }
				]},
				{ label:'Size', name:'size', value:'11px', legend:'px/em/%' },
				{ label:'Line Height', name:'lheight', value:'1.5em', legend:'px/em' },
				{ label:'Style', name:'style', value:'', values:[
					{ label:'None',  		value:''},
					{ label:'Bold',  		value:'bold '},
					{ label:'Italic',		value:'italic ' },
					{ label:'Bold, Italic', value:'bold italic ' }
				]}
			]
		},
		borders: {
			title:'Border',
			classname:'markItUpBorderDialog',
			modal:true,
			rows:[ 
				{ label:'Size', name:'size', value:'1px', legend:'px/em', classname:'markItUpSmall'},
				{ label:'Style', name:'style', value:'solid', classname:'markItUpBig', values:[
					{ label:'None',  	value:'none'	},
					{ label:'Dotted',  	value:'dotted'	},
					{ label:'Dashed',	value:'dashed' 	},
					{ label:'Solid',	value:'solid' 	},
					{ label:'Double',	value:'double' 	},
					{ label:'Groove',	value:'groove' 	},
					{ label:'Ridge',	value:'ridge' 	},
					{ label:'Inset',	value:'inset' 	},
					{ label:'Outset',	value:'outset' 	},
					{ label:'Inherit',	value:'inherit' }
				]},
				{ label:'Color', name:'color', value:'#FF9900', picker:true }
			]
		}
	}
}