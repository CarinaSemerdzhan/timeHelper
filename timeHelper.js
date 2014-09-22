;(function($){

	var defaults = {
		city: 'Amsterdam',
		UTC: 1,
		days: {
			0: false,           // Sunday
			1: '8.05 - 17.10',  // Monday
			2: '8.00 - 17.00',  // Tuesday
			3: '8.00 - 17.00',  // Monsday
			4: '9.00 - 21.00',  // Thuersday
			5: '8.00 - 17.00',  // Friday
			6: '11.00 - 17.00', // Saturday
		},
		textAfter: 'textAfter',
		textBefore: 'textBefore',
		textWeekend: 'textWeekend',
		timeNight: 4,
	}

	$.fn.timeHelper = function(options){

		if(this.length == 0) return this;

		// support mutltiple elements
		if(this.length > 1){
			this.each(function(){$(this).timeHelper(options)});
			return this;
		}

		// create a namespace to be used throughout the plugin
		var plugin = {};
		// set a reference to our time helper element
		var el = this;

		/**
		 * Initializes namespace settings to be used throughout plugin
		 */
		var init = function(){
			// merge user-supplied options with the defaults
			plugin.settings = $.extend({}, defaults, options);

			plugin.settings.days = parseDataArray(plugin.settings.days, '-', 'open', 'close', 1);


			setInterval(function() {
				setTimeHelper();
			},1000)

		};

		var setTimeHelper = function () {
			var setTime = getCurrentTime(plugin.settings.city, plugin.settings.UTC);
				setDataHelper = {};
				setDataHelper = parseDataArray(plugin.settings.days[setTime.getCurrentDay], '.', 'hour', 'min', 0);

					if (!setDataHelper.open || !setDataHelper.close) {
						el.html(plugin.settings.textWeekend);
					} else {
						if ((setTime.getCurrentHour >= (setDataHelper.open.hour+1) && setTime.getCurrentHour <= (setDataHelper.close.hour-1)) ||
							(setTime.getCurrentHour == setDataHelper.open.hour && setTime.getCurrentMinute >= setDataHelper.open.min) || 
							(setTime.getCurrentHour == setDataHelper.close.hour && setTime.getCurrentMinute <= setDataHelper.close.min))  {
								el.addClass('no-active')
						}
						if ((setTime.getCurrentHour > setDataHelper.close.hour || setTime.getCurrentHour <= (plugin.settings.timeNight-1)) || 
							(setTime.getCurrentHour == setDataHelper.close.hour && setTime.getCurrentMinute >= setDataHelper.close.min))  {
								el.addClass('active').html(plugin.settings.textAfter);
							}
						if ((plugin.settings.timeNight <= setTime.getCurrentHour && setTime.getCurrentHour < setDataHelper.open.hour) ||
							(setTime.getCurrentHour == setDataHelper.open.hour && setTime.getCurrentMinute <= setDataHelper.open.min)) {
								el.addClass('active').html(plugin.settings.textBefore);
						} 
					}
		};

		var getCurrentTime = function (city, offset) {
			// create Date object for current location
			d = new Date();

			//convert to ms
			//add local time zone offset
			//get UTC time in ms
			utc = d.getTime() + (d.getTimezoneOffset()+60)*60000;

			//create new Date object for different city
			//using supplied offset

			nd = new Date(utc +(3600000*offset));
			var currentTime = {
				getCurrentHour: nd.getHours(),
				getCurrentMinute: nd.getMinutes(),
				getCurrentDay: nd.getDay()
			}

			return currentTime
		};

		var parseDataArray = function (obj, splitChar, arg1, arg2, toInteger) {
			var tmpArray = [];
			for (detail in obj) {
					if (typeof(obj[detail]) == 'string') {
						obj[detail] !== false ? tmpArray = obj[detail].toString().split(splitChar) : tmpArray = false;
						obj[detail] = {};
						toInteger === 1 ? obj[detail][arg1] = tmpArray[0] : obj[detail][arg1] = parseInt(tmpArray[0]);
						toInteger === 1 ? obj[detail][arg2] = tmpArray[1] : obj[detail][arg2] = parseInt(tmpArray[1]);
					}
				}
			return obj;
		};

		init();

		// returns the current jQuery object
		return this;
	}

})(jQuery);
