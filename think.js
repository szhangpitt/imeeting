
var module = {};
module.getIntent = function(userSpeech){

	if(typeof require !== 'undefined'){
		var sugar = require('sugar');	
	}
	


	function UserIntent(speech, action, people, devices, time, timeString) {
		this.speech = speech;
		this.action = action;
		this.people = people;
		this.devices = devices || [];
		this.time = time;
		this.timeString = timeString;
	}

	function DateTime(rawString) {

		this.rawString = (rawString || '').toLowerCase();

		this.RELATIVE = ['last', 'next', 'this'];
		this.WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		
		this.DAYS = ['today', 'tomorrow'];
		this.AP = ['a\.m\.', 'p\.m\.', 'am', 'pm'];

		if(rawString.match(/\snow/)){
			return Date.create('now');
		}
		
		rawString = rawString.replace(/a\.m\./gi, 'am')
							 .replace(/p\.m\./gi, 'pm')
							 .replace(/\,\s*|\.\s*/gi, '')
							 //.replace(/(\s*)(?=monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, ' this ')
							 .replace(/(on)\s*(?=monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, ' this ')
							 .replace(/(this)\s*(?:morning|afternoon|evening)/gi, 'today');

		var timeRegex = /(\d+\:*\d*)\s*(?=o'clock|am|pm|\D*(?:morning|afternoon)|\D*(?:today|tomorrow|after\s*tomorrow)|(?:this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))|(?:\D*(?:morning|afternoon)|\D*(?:today|tomorrow|after\s*tomorrow)|(?:this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\s*(?:at|)\s*(\d+\:*\d*)\s*(?:am|pm|o\'clock|\s)|(?:at)\s*(\d+\:*\d*)|(\d+\:\d+)/gi;
		var ampmRegex = /(am|pm|a\.m\.|p\.m\.|morning|afternoon|evening)/gi;
		var dayRegex = /(?:today|tomorrow|after\s*tomorrow)|(?:this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi;


		//var regex = new RegExp('((?:tomorrow|today)\\s*[a-z]*\\s*\\d+(?:am|pm))|(\\d+\\s*(?:am|pm)\\s*(?:tomorrow|today|[a-z]+\\sday after tomorrow))|((?:last|next|this)\\s*(?:' + this.WEEKDAYS.join('|') + ')\\s*[a-z]*\\s*\\d+(?:am|pm|))|(\\d+\\s*(?:am|pm)\\s*[^\r]*(?:next|this|last)\\s*(?:' + this.WEEKDAYS.join('|') + '))|(in\\s*\\d+\\s*(?:hours*|minutes*))|(\\d+\\s*(?:hours*|minutes*)\\s*later)|(\\d+\\s*(?:am|pm))', 'gi');
		//matched = rawString.match(regex);
		//console.log(rawString, 'think.js:rawString for time')
		//console.log(matched, 'think.js:matched time');

		
		var timeMatch = ((rawString.match(timeRegex)||[]).first() || 'now').replace(/[a-z]*/gi, '').compact();/*.exec(rawString)*/;
		if(!isNaN(parseInt(timeMatch))){
			if(parseInt(timeMatch) > 100){//330 --> 3:30 (insert : at index 1 = 3-2), 1230 --> 12:30 (insert : at index 2 = 4-2)
				var len = timeMatch.length;
				timeMatch = timeMatch.slice(0, len - 2) + ':' + timeMatch.slice(len - 2)
			}	
		}		
		
		var guessAmPm = function(tm){
			tm = tm + '';
			if(tm !== 'now'){ 
				if(tm.startsWith('6') || tm.startsWith('7') || tm.startsWith('8') || tm.startsWith('9') || tm.startsWith('10') || tm.startsWith('11')){
					return 'am';
				}
				else if(tm.startsWith('12') || tm.startsWith('1') || tm.startsWith('2') || tm.startsWith('3') || tm.startsWith('4') || tm.startsWith('5')){
					return 'pm';
				}	
			}
			
			return '';
		}

		var ampmMatch = ((rawString.match(ampmRegex)||[]).first() || guessAmPm(timeMatch)).compact();/*.exec(rawString)*/;
		var dayMatch = ((rawString.match(dayRegex)||[]).first()||'today').compact();/*.exec(rawString)*/;

		//var matchedString = matched ? matched[0] : null;
		var matchedString = timeMatch + ' ' + ampmMatch + ' ' + dayMatch;
		console.log(matchedString, 'matchedString');
		if(matchedString.trim() == 'today'){
			matchedString = 'now';
		}

		return Date.create(matchedString);
	}

	function People(rawString){
		this.rawString = (rawString || '').toLowerCase();
	}

	People.prototype.search = function(){
		var regex = new RegExp('\\s*(largest|biggest|large|small|big|huge)|(\\d+)\\s*(?=people|guys*)\\s*|(?:for|with)\\s+(\\d+)\\s*', 'gi');
		var matched = this.rawString.match(regex);
		var vagueMap = {large: 20, small: 5, big: 20, largest: 200, biggest: 200, huge: 200};

		
		var numberPriority = function(matchedArray){
			var arr = matchedArray || [];
			for(var i in arr){	
				//console.log(arr[i]);			
				var a = arr[i].match(/\d+/gi);
				if(!isNaN(parseInt(a))){
					return a + '';
				}
			}
			return arr.first() + '';
		}

		matched = numberPriority(matched).compact();

		if(isNaN(parseInt(matched))){
			matched = vagueMap[matched];
		}
		
		matched = parseInt(matched);
		
		if(isNaN(matched)){
			matched = 5;
		}

		this.rawString = this.rawString.replace(regex, '');

		return {matched: matched, rawString: this.rawString};
	}

	function Device(rawString){
		this.rawString = (rawString || '').toLowerCase();
		this.DEVICES = ['projector', 'whiteboard', 'phone', 'lcd', 'camera', 'speaker', 'catering'];
	}

	Device.prototype.search = function() {
		var words = this.rawString.split(' ');
		words = words.map(function(t){
			var r = t.remove(/\,/g);
			//console.log(r, 'remove');
			return r;
		});

		return words.intersect(this.DEVICES);
	};

	function Analyzer(rawString, words) {
		this.rawString = rawString || '';
		this.words = words || [];
	}

	Analyzer.prototype.getIntent = function () {
		var rs = this.rawString.toLowerCase();
		this.words = rs.split(' ');


		var intent = new UserIntent(rs);

		if (this.words.indexOf('book') !== -1) {
			intent.action = 'book';
		}
		intent.action = intent.action || 'book';

		intent.devices = new Device(rs).search();

		var peopleResult = new People(rs).search();
		intent.people = peopleResult.matched; 
		rs = peopleResult.rawString;

		intent.time = new DateTime(rs);
		intent.timeString = intent.time.format('{12hr}:{mm} {tt} on {Weekday} {Month} {dd}');


		return intent;
	}

	return new Analyzer(userSpeech).getIntent();

}

module.getRoom = function(userIntent){
	if(userIntent.action === 'book'){
		var potential_room = {capacity: 99999};
		var available_rooms = Room.MeetingRooms;//get it from db

		//check db to see "just enough" room
		//TODO: complete time schedule checking
		for(i in Room.MeetingRooms){
			var r = Room.MeetingRooms[i];
			
			if(parseInt(r.capacity) >= parseInt(userIntent.people) && r.capacity <= potential_room.capacity){
				potential_room = r;
			}

		}

		return potential_room;
	}
}