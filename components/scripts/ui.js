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
			speakUserIntent(userIntent);
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