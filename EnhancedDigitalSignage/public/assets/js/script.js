$(function() {

	// Initialize the Reveal.js library with the default config options
	// See more here https://github.com/hakimel/reveal.js#configuration

	Reveal.initialize({
		controls: false,	// Display controls in the bottom right corner
		progress: true,		// Display a presentation progress bar
		history: true,		// Every slide will change the URL
		touch: false		// Enables touch navigation on devices with touch input
	});

	// Connect to the socket

	var socket = io();

	// Variable initialization

	var form = $('form.login'),
		secretTextBox = form.find('input[type=text]'),
		presentation = $('.reveal'),
		main_content = $('#main-content'),
		controller_btn = $('#controller button'),
		secCdBrwsr = $('#secretCodeBrowser'),
		key = '', animationTimeout,
		room = '',
		device = '',
		state = 0;
	var quiz_content = {
			browser_content : $('#browser .content'),
			question_a : $('.controller #a'),
			question_b : $('.controller #b'),
			question_c : $('.controller #c')
	};


   	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )
   	{	
   		device='controller';
   		$('.mobile').removeClass('hidden');
   	}else{
   		device='browser';
   		$('.browser').removeClass('hidden');
   	};
	// When the page is loaded it asks you for a key and sends it to the server
	if(device == 'browser'){
		socket.emit('getRoom');
		socket.on('returnRoom', function(data){
			secCdBrwsr.html(data.room);
		});
	}

	// Form for controller to log in to room
	form.submit(function(e){
		e.preventDefault();
		room = secretTextBox.val().trim().toLowerCase();

		// If there is a key, send it to the server-side
		// through the socket.io channel with a 'load' event.

		if(room.length) {
			socket.emit('load', {
				room: room,
				state: state
			});
		}

	});

	//function for setting content
	function load_content (data){
		quiz_content.browser_content.html(data.browser);
		quiz_content.question_a.html(data.controller.a);
		quiz_content.question_b.html(data.controller.b);
		quiz_content.question_c.html(data.controller.c);
	};

	//set emit for quiz answers		
	controller_btn.click(function(){
		socket.emit('answer', {
			room: room,
			state: state,
			answer: $(this).data('selection')
		});
		
	});
	
	// The server will either grant or deny access, depending on the room code
	socket.on('access', function(data){
		// Check if we have "granted" access.
		// If we do, we can continue with the presentation.

		if(data.access === "granted") {
			room = data.room;
			// Unblur everything
			main_content.removeClass('blurred');

			form.hide();

			// laod page with current content
			load_content(data.content);

			// update state and content when app sends new quiz content
			socket.on('next', function(data){
				if(data.state <= 2){
					state++;
					load_content(data.content);
				}else{
					$("#browser").html("<h1>congratulations</h1>");
					$("#controller").html("<h1>congratulations</h1>");
				}
				
			});

		}
		else {

			// Wrong secret key

			clearTimeout(animationTimeout);

			// Addding the "animation" class triggers the CSS keyframe
			// animation that shakes the text input.
			secretTextBox.addClass('denied animation');
			
			animationTimeout = setTimeout(function(){
				secretTextBox.removeClass('animation');
			}, 1000);

			form.show();
		};
	});
});