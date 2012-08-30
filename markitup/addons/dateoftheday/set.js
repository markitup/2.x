(function($) {
	// i18n ------------------------------------------------------
	var i18n = {
		addon: "Date of the day",
		format: "%D %d %M %Y{E} %h:%i{E}:%s{/E}{/E}",
		days:[
			'Sunday', 
			'Monday', 
			'Tuesday', 
			'Wednesday', 
			'Thursday', 
			'Friday', 
			'Saturday'
		],
		monthes:[
			'January', 
			'February', 
			'March', 
			'April', 
			'May', 
			'June', 
			'July', 
			'August', 
			'September', 
			'October', 
			'November', 
			'December'
		]
	}
	// ---------------------------------------------------------------

	$.markItUp.command.add('dateOfTheDay', {
		snippet:function() { 
			function f(val) {
				if (val < 10) {
					return '0'+val;
				}
				return val;
			}
			var date = new Date(), f;

			f = i18n.format.replace(/%D/g,  i18n.days[date.getDay()])
						   .replace(/%M/g,  i18n.monthes[date.getMonth()])
				  		   .replace(/%Y/g,  date.getFullYear())
				  		   .replace(/%y/g,  date.getYear())
				  		   .replace(/%d/g,  f(date.getDate()))
				  		   .replace(/%m/g,  f(date.getDay()))
				  		   .replace(/%h/g,  f(date.getHours()))
				  		   .replace(/%i/g,  f(date.getMinutes()))
				  		   .replace(/%s/g,  f(date.getSeconds()));
			return f;
		}
	});
	
	$.markItUp.button.add('dateOfTheDay', {
		styles:	[ 'styles.css' ],
		name: i18n.addon,
		classname:'markItUpDateOfTheDay',
		command: $.markItUp.command.dateOfTheDay
	});
})(jQuery);