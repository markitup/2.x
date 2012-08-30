/* Special Chars - A Special chars dialogbox
 * V0.1 - By Jay Salvat
 *
 * Idea and char table by Joseph Woods
 */
(function($) {
	// TEXTS ---------------------------------------------------------
	var i18n = {
		addon: "Special chars table"
	}
	// ---------------------------------------------------------------
	
	$.markItUp.dialog.add('specialChars', {
		title: i18n.add,
		classname:'markItUpSpecialCharsDialog',
		insertButton:false,
		rows: [
			{ html: function(miu) {	
				return $.markItUp.helper.palette(miu, 'char', '', [
					['&nbsp;','&iexcl;','&cent;','&pound;','&yen;','&sect;','&uml;','&copy;','&laquo;','&not;','&reg;'],
					['&deg;','&plusmn;','&acute;','&micro;','&para;','&middot;','&cedil;','&raquo;','&iquest;','&Agrave;','&Aacute;'],
					['&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;'],
					['&Iacute;','&Icirc;','&Iuml;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&Oslash;','&Ugrave;'],
					['&Uacute;','&Ucirc;','&Uuml;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;'],
					['&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&ntilde;','&ograve;'],
					['&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc','&uuml','&yuml;'],
					['&#8218;','&#402;','&#8222;','&#8230;','&#8224;','&#8225;','&#710;','&#8240;','&#8249;','&#338;','&#8216;'],
					['&#8217;','&#8220;','&#8221;','&#8226;','&#8211;','&#8212;','&#732;','&#8482;','&#8250;','&#339;','&#376;']
				], { inputType:'hidden', autoClose:true });
			}
		}]
	});
	
	$.markItUp.command.add('specialChars', {
		snippet:'{V char/}',
		styles:  [ 'styles.css' ],
		dialog: $.markItUp.dialog.specialChars
	});
	
	$.markItUp.button.add('specialChars', {
		name: i18n.addon,
		classname:'markItUpSpecialChars',
		command: $.markItUp.command.specialChars
	});
})(jQuery);