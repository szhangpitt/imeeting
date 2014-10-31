
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
$(document).ready(function() {
  var GetRecognition = function() {
    if (typeof speechRecognition !== 'undefined') {
      return new speechRecognition();
    } else if (typeof msSpeechRecognition !== 'undefined') {
      return new msSpeechRecognition();
    } else if (typeof mozSpeechRecognition !== 'undefined') {
      return new mozSpeechRecognition();
    } else if (typeof webkitSpeechRecognition !== 'undefined') {
      return new webkitSpeechRecognition();
    } else {
      console.error('no SpeechRecognition supported!');
      return {};
    }
  }

  var recognition = GetRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-GB';


  var fillText = true;
  $(document).on('confirming', function(e){
      fillText = false;
  }).on('yes', function(e){
      fillText = true;
      finalTranscript = '';
      interimTranscript = '';
  });

  var interimTranscript = '';
  var finalTranscript = '';
  recognition.onresult = function(event) {
    interimTranscript = '';

    for (var i = event.resultIndex; i < event.results.length; i++){
      if(event.results[i].isFinal){
        finalTranscript += event.results[i][0].transcript;    
        console.log('onresult - finalTranscript: ' + finalTranscript);
      }
      else{
        interimTranscript += event.results[i][0].transcript;
        console.log('onresult - interimTranscript: ' + interimTranscript);
      }
    }

    if (finalTranscript.length > 0) {
      if(fillText){
        $('#what-i-say').val(finalTranscript);        
      }

      if(finalTranscript.trim().toLowerCase() === 'yes'){
        $(document).trigger('yes');
      }
      finalTranscript = ''; 
      console.log('onresult - recognizing: ' + recognizing);
    }
  }

  recognition.onstart = function(event){
    $('.wrapper').addClass('recording');
  }

  recognition.onend = function(event){
    recognizing = false;            
    console.log('onend - recognizing: ' + recognizing);
    $('.wrapper').removeClass('recording');
  }

  var recognizing = false;
  $('#what-i-say, .mic-icon').on('click', function(e){
    if(!recognizing){
      recognition.start();
      recognizing = true;
      console.log('onclick - recognizing: ' + recognizing);
    }
    else{
      recognition.stop();
      recognizing = false;
      console.log('onclick - recognizing: ' + recognizing);
    }

  });





});
var Room = {};

Room.MeetingRooms = [
    {
    	name:'Weyrich', 
    	floor:2, 
    	capacity: 30
    },
    {
    	name:'Executive', 
    	floor:1, 
    	capacity: 50
    },
    {
    	name:'AC', 
    	floor:2, 
    	capacity: 20
    },
    {
    	name:'ADS', 
    	floor:2, 
    	capacity: 10
    },
    {
    	name:'General', 
    	floor:1, 
    	capacity: 200
    },
    {
    	name:'Ad hoc 1', 
    	floor:1, 
    	capacity: 5
    },
    {
    	name:'Ad hoc 2', 
    	floor:1, 
    	capacity: 5
    }
];

$(document).ready(function(e){	
	var think = module.getIntent;
	var prevUserIntent = {};
	var prevUserSay = '';
	

	$('#what-i-say').focus(); 

	//injectRooms();

	function injectRooms(){
		$('#what-i-have ul').empty();
		for(i in Room.MeetingRooms){
			var r = Room.MeetingRooms[i];
			$('#what-i-have ul').append('<li data-id="room-{name}"><img src="assets/room_{name}.jpg" /><span>{title}, on {floor} floor, capacity: {capacity}</span></li>'
				.assign({name: r.name.dasherize(), title: r.name, floor: parseInt(r.floor) == 1 ? '1st' : '2nd', capacity: r.capacity}))
		}
	}

	toggle();

	function toggle(){
		$('#what-i-think section').each(function(index, item){
			if($(this).find('p').text().trim() === ''){
				$(this).addClass('hidden');
			}
			else{
				$(this).removeClass('hidden');
			}
		});	
	}
	

	setInterval(function(){		
		var s = $('#what-i-say').val();

		//if the text has changed
		if(s != prevUserSay){
			resize();
			var userIntent = think(s.endsWith(' ') ? s : s + ' ');	//sometimes it requires a additional ' ' to recognize time
			onthefly(userIntent);			
			prevUserIntent = userIntent;	
			prevUserSay = s;	
			var room = module.getRoom(userIntent);
			var room_id = 'room-' + (room.name||'').dasherize();
			$('#what-i-have li:not([data-id="' + room_id + '"])').hide();
			$('#what-i-have li[data-id="' + room_id + '"]').show();
			console.log(room);
			console.log('updated HMI');
			toggle();
		}		
	}, 500);

	

	var resize = function(){
		window.setTimeout(function(){
			console.log('scrollHeight: ' +  $('#what-i-say').prop('scrollHeight') + 'px');
			$('#what-i-say').css('height', 'auto');
			$('#what-i-say').css('height', $('#what-i-say').prop('scrollHeight') + 'px');
		}, 0);	
	}

	$('#what-i-say').on('keyup', resize);
	$(window).on('resize', resize);

	
	function onthefly(userIntent){
		$wit = $('#what-i-think');
		var changed = false;
		for(k in userIntent){
			var uiprop = (userIntent[k] + '').trim(), 
			puiprop = (prevUserIntent[k] + '').trim();
			if(uiprop != puiprop){
				console.log(uiprop + '---' + puiprop);
				$wit.find('#' + k + ' p').html(uiprop).effect('bounce', 'slow');			
				changed = true;
			}
		}
		if(changed){
			// setTimeout(function(){
			// 	speakUserIntent(userIntent);
			// }, 30000);
		}
	}

	var justSpoken = false;
	var confirmUserIntent = null;

	function speakUserIntent(userIntent){
		if(!justSpoken){
			var str = 'You want to {action} a meeting room {timeString} for {people} participants with {devices}. '
			.assign({action: userIntent.action, timeString: userIntent.timeString, people: userIntent.people, devices: (userIntent.devices || []).length == 0 ? 'no special device' : userIntent.devices.join(', ')});
			var msg = new SpeechSynthesisUtterance(str);
			var confirm = new SpeechSynthesisUtterance('Is this correct?');
			$(document).trigger('confirming');
			window.speechSynthesis.speak(msg);			
			setTimeout(function(){window.speechSynthesis.speak(confirm);}, 500);

			confirmUserIntent = userIntent;
			justSpoken = true;
			setTimeout(function(){justSpoken = false;}, 10000);
		}		
	}

	$(document).on('yes', function(e){
		console.log(e, 'yes');
		var ok = new SpeechSynthesisUtterance('OK, let me look it up. ');
		window.speechSynthesis.speak(ok);
	});



});