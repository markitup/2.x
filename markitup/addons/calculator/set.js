(function($) {
	// ---------------------------------------------------------------
	var i18n = {
		addon:			"Calculator",
		operation: 		"Operation",
		addition: 		"Addition",
		soustraction: 	"Soustraction",
		multiplication: "Multiplication",
		division: 		"Division",
		number:			"Number",
		round:			"Round",
		floor:			"Floor",
		ceil:			"Ceil",
		float:			"Float",
		ok:				"Ok"	
	}
	// ---------------------------------------------------------------
		
	$.markItUp.dialog.add('calculator', {
		title: i18n.addon,
		insertButton:false,
		rows:[
			{ label:i18n.operation, name:'sign', value:"-", classname:'markItUpLarge', values:[
				{ label:i18n.addition, value:'+' },
				{ label:i18n.soustraction, value:'-' },
				{ label:i18n.multiplication, value:'*' },
				{ label:i18n.division, value:'/' }
				]
			},
			{ label: i18n.number, name:'number', value:'50%', classname:'markItUpSmall' },
			{ label: i18n.round, name:'round', value:"round", classname:'markItUpLarge', values:[
				{ label: i18n.round, value:'round' },
				{ label: i18n.floor, value:'floor' },
				{ label: i18n.ceil, value:'ceil' },
				{ label: i18n.float, value:'' },
				]
			}
		],
		buttons: [
			{ name: i18n.ok, onClick:function(miu) {
				var sign = miu.dialog.vars('sign');
				var number = miu.dialog.vars('number'); // TODO: vérifier que c'est un chiffre
				var round = miu.dialog.vars('round');
				var selection = miu.selection()||'';
				
				selection = selection.replace(/("|'|\s|^)(\d+)("|'|%|em|px|\s?)/g, function(a, before, value, after) {
					num = number.replace(/\d+%/, function(percent) {
						percent = percent.replace('%', '');
						return value / 100 * percent;
					});
					var value = eval(value + sign + num);
					if (round == 'floor') {
						value = Math.floor(value);
					} else if (round == 'ceil') {
						value = Math.ceil(value);
					} else if (round == 'round') {
						value = Math.round(value);
					}
					
					return before + value + after;
				});
				miu.selection(selection, true);
				miu.dialog.close();
				}
			}
		]
	});

	$.markItUp.command.add('calculator', {
		//dialog: $.markItUp.dialog.calculator,
		onInit:function(miu) {
			var t = false;
			var selection = miu.selection()||'';
			if (/[a-z]/gi.test(selection)) {
				miu.set.dialog = $.markItUp.dialog.calculator;
				return;
			}
			selection = selection.replace(/([\d().+\-\/*])+/, function(operation) {
				try {
					var value = eval(operation);
					if (!miu.keys.alternative) {
						value = Math.round(value);
					}
					return value;
				} catch(e) {
					miu.set.dialog = $.markItUp.dialog.calculator;
					return operation;
				}
			});
			miu.selection(selection, true);
		}
	});
	
	$.markItUp.button.add('calculator', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpCalculator',
		command: $.markItUp.command.calculator
	});
})(jQuery);