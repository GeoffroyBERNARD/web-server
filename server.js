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
const ip = "0.0.0.0";
const port = "80";

//number of connection (TOTAL)
let connection = 0;

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


	socket.on('sending',function(message){
		message = message.split(' ')
		message.forEach(function(word, index){
			if(validator.isURL(word)){
				console.log('url');
				message[index] = "<a target='_blank 'href="+ word +">" + word +"</a>";
			}
			else validator.escape(word)
		});
		message = message.join()
		console.log(socket.nick + ": " + message)
        io.emit('receiving',socket.nick + ": " + message+"<br>"); //envoi le message à tout le monde
	});
});

//listening
server.listen(port, ip, function () {
  console.log('Server listening on ' + ip + ' with port ' + port);
});







