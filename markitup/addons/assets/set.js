(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon:			"Assets",
		noLink: 		"No link found.",
		noClass:		"No class found.",
		noImage:		"No image found.",
		noColor:		"No color found.",
		insertLink: 	"- Insert a link -",
		insertClass:	"- Insert a class -"
	}
	// ---------------------------------------------------------------
		
	$.markItUp.dialog.add('assets', {
		title: i18n.addon,
		insertButton:false,
		classname:'markItUpAssetsDialog',
		rows:[
			{  name:'href', values:function(miu) {
					var content = miu.textarea.value,
						regexp = /href\s?=\s?["|'](.*?)["|']/gi,
						opts = [];
					while((h = regexp.exec(content)) != null) {
						opts.push( { label: h[1] , value: h[1] } );
					};
					if (opts.length === 0) {
						 opts.unshift( {label: i18n.noLink} );
					} else {
						 opts.unshift( {label: i18n.insertLink} );
					}
					return opts;
				}, 
				classname:'markItUpAssetsPictures'
			},
			{ name:'class', values:function(miu) {
					var content = miu.textarea.value,
						regexp = /class\s?=\s?["|'](.*?)["|']/gi,
						opts = [];
					while((h = regexp.exec(content)) != null) {
						opts.push( { label: h[1] , value: h[1] } );
					};
					if (opts.length === 0) {
						 opts.unshift( {label: i18n.noClass } );
					} else {
						 opts.unshift( {label: i18n.insertClass } );
					}
					return opts;
				}
			},
			{ html:function(miu) {
					var content = miu.textarea.value,
						regexp = /src\s?=\s?["|'](.*?)["|']/gi,
						opts = {}, rows = [],
						i = 0, tag;
					while((h = regexp.exec(content)) != null) {
						var tag = '<img title="'+ h[1] +'" src="'+ h[1] +'" />';
						if (!opts[ tag ]) {
							opts[ tag ] = h[1];
							if (++i && (i%6) === 0) {
								rows.push(opts);
								opts = {};
							}
						}
					};
					rows.push(opts);
					if (i) {
						return $.markItUp.helper.palette(miu, 'img', '', rows,  { autoClose:true, inputType:'hidden' } );
					}
					return i18n.noImage;
				}, 
				classname:'markItUpAssetsPictures'
			},
			{ html:function(miu) {
					var content = miu.textarea.value,
						regexp = /#[0-9A-F]{3,6}/gi,
						opts = {}, rows = [],
						i = 0, tag;
					while((h = regexp.exec(content)) != null) {
						if (!opts[ h[0] ]) {
							opts[ h[0] ] = h[0];
							if (++i && (i%16) === 0) {
								rows.push(opts);
								opts = {};
							}
						}
					};
					rows.push(opts);
					if (i) {
						return $.markItUp.helper.palette(miu, 'color', '', rows,  { autoClose:true, inputType:'hidden', colorize:true, title:true } );
					}
					return i18n.noColor;
				}, 
				classname:'markItUpAssetsColors'
			}		
		],
		onOpen:function(miu) {
			$('.assetsPictures option', miu.dialog).each(function(i, opt) {
				var url = $(opt).text().replace(/^(http:\/\/[^\/]+).*$/, '$1') + '/favicon.ico';
				$(opt).css( {
					background:'url('+url+') no-repeat left center',
					paddingLeft:'20px'
				});
			});
			$('select').change(function() {
				miu.dialog.insert();
				miu.dialog.close();
			});
		}
	});
	
	$.markItUp.command.add('assets', {
		snippet:  '{IF img}<a href="{V img/}" alt="{E/}">{S/}{/IF}'
				+ '{IF href}<a href="{V href/}"{E} title="{E/}"{/E}>{S/}</a>{/IF}'
				+ '{IF class}class="{V class/}"{/IF}'
				+ '{IF color}{V color/}{/IF}',
		dialog:$.markItUp.dialog.assets
	});
	
	$.markItUp.button.add('assets', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname: 'markItUpAssets',
		command: $.markItUp.command.assets
	});
})(jQuery);
