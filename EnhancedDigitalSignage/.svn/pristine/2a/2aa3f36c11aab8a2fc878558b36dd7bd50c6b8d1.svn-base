// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.

//Once Running the app interacts with the presentation layer via
//socket.on and socket.emit with the page scripts in public/assests/js/scripts.js


// Creating an express server

var express = require('express'),
	app = express();

// Set up port for our app to run on.
var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.
var io = require('socket.io').listen(app.listen(port));

//Initialize node crypto
var crypto = require('crypto');



// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

//array to hold room codes
var roomCodes = [];
//array to hold quiz content
var quiz = [
		{	
			background : "assets/img/1.jpg",
			browser : "What was the right time to begin everything?",
			controller : {
						a : "Future",
						b : "Past",
						c : "Now"
			}
		},
		{
			background : "assets/img/2.jpg",
			browser : "Who were the right people to listen to?",
			controller : {
						a : "Friends",
						b : "Parents",
						c : "Person you are with"
			}

		},
		{
			background : "assets/img/3.jpg",
			browser : "What was the most important thing to do?",
			controller : {
						a : "Have Fun",
						b : "Make Memories",
						c : "Do Good"
			}
		},
		{
			background : "assets/img/4.jpg",
			browser : "Congratulations!!!",
			controller : 'Congratulations!!!'

		},
	];


// Initialize a new socket.io application
var presentation = io.on('connection', function (socket) {
	// Browser views of site will call to get and return connection code
	socket.on('getRoom', function(data){
		// This will generate a room between your phone and browser, the room id will prevents others from opening your presentation
		// and controlling it. It is a Dynamically generated 3 byte hex string.
		room = crypto.randomBytes(3).toString('hex');
		//verify uniqueness of room id
		while(room in roomCodes)
         {
            room = crypto.randomBytes(3).toString('hex');
         }
        //add roomid to roomCodes array
        //set room to object to store quiz data
        roomCodes[room] = {answers : []};
        //tag the room to the current socket as a property
        socket.roomCode = room;
        //join the unique room
		socket.join(room);
		// return room info to browser
		io.sockets.in(room).emit('returnRoom', {
			room: room
		});
	});



	// A new controller has come online. Check the connection and 
	// emit a "granted" or "denied" message.

	socket.on('load', function(data){
		//check that room exists
		if(roomCodes.hasOwnProperty(data.room) == true) {
			//have the controller join the room
			socket.join(data.room);
			//tag the room to the current socket as a property
			socket.roomCode = data.room;
			//return access
			io.sockets.in(data.room).emit('access', {
				access: "granted",
				room: data.room,
				content: quiz[data.state]
			});
		}else{
			//deny access
			io.sockets.in(data.room).emit('access', {
				access: "denied",
				room: data.room
			});
		}
		

	});
	//Controller emits an answer
	socket.on('answer', function(data){
		//use returned data to set answer in roomCodes object
		roomCodes[data.room].answers[data.state] = data.answer;
		// increment data state
		data.state += 1;
		// return next question content
		presentation.in(data.room).emit('next', {
				room: data.room,
				state : data.state,
				//use state to get next content item in quiz
				content: quiz[data.state]
		});
		// log room codes object for development
	});

	// Clients send the 'slide-changed' message whenever they navigate to a new slide.
	socket.on('slide-changed', function(data){

		// Check the secret key again
		if(roomCodes.hasOwnProperty(data.room) == true) {

			// Tell all connected clients to navigate to the new slide
			presentation.in(data.room).emit('navigate', {
				hash: data.hash,
				room: data.room
			});
		}

	});
	//remove room when controller or browser disconnect
	socket.on('disconnect', function () {
			delete roomCodes[socket.roomCode];
    });

});

console.log('Your presentation is running on http://localhost:' + port);
