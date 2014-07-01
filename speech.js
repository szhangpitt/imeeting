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
      return null;
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