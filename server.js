//loading modules
const express = require('express')
const SocketIOFileUpload = require("socketio-file-upload");
const app = express().use(SocketIOFileUpload.router);
const validator = require('validator');

//defining the view engine
app.set('view engine', 'ejs');

let fs = require('fs');

let server = require("http").Server(app);


//defining network
const ip = "localhost";
const port = "80";

let connection = 0;
let score = 0;
let chat = [];

//defining ressources folder
app.use(express.static(__dirname + '/public'));


//main view
app.use("/", (req, res) => {
    res.render("main");
    connection ++;
});


let io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {

  	var siofu = new SocketIOFileUpload();
    siofu.dir = __dirname + "/public/upload";
    siofu.listen(socket);


  	socket.nick = "Anon"
  	socket.desc = "Short for a non mouse."

  	socket.emit("chat",chat);
  	socket.emit('score',score); 

  	siofu.on("saved", function(event){
        console.log(socket.nick + " saved " + event.file.name + " as his profile pic");
        socket.pic = event.file.name
    });

    // Error handler:
    siofu.on("error", function(event){
        console.log(socket.nick + " failed to save " + event.file.name + " as his profile pic");
    });

	socket.on('nickname', function(nick) {
		socket.nick = validator.escape(nick);
	});

	socket.on('description', function(desc) {
		socket.desc = validator.escape(desc);
	});

	socket.on('picture', function(pic) {
		socket.pic = validator.escape(pic);
	});

	socket.on('click', function() {
		score += 1;
		io.emit('score',score); 
	});



	socket.on('message',function(message){
		message = message.split(' ')
		message.forEach(function(word, index){
			if(validator.isURL(word)){
				console.log('url');
				message[index] = "<a target='_blank 'href="+validator.escape(word) +">" + validator.escape(word) +"</a>";
			}
			else validator.escape(word)
		});


		let tmp = {};
		tmp.sender = socket.nick
		tmp.message = message.join()
		message = socket.nick + ": " + message+ "<br>"
		chat.push(tmp)
		console.log(chat[chat.length - 1]);
        io.emit('chat',chat); 
	});
});

//listening
server.listen(port, ip, function () {
  console.log('Server listening on ' + ip + ' with port ' + port);
});







