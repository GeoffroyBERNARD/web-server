//loading modules
const express = require('express')
const app = express()

//defining the view engine
app.set('view engine', 'ejs');

let fs = require('fs');

let server = require("http").Server(app);


//defining network
const ip = "localhost";
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

	socket.on('nickname', function(nick) {
		socket.nick = nick;
		console.log("new entry : " + nick);
	});


	socket.on('sending',function(message){
		console.log(socket.nick + ": " + message)
        io.emit('receiving',socket.nick + ": " +message+"<br>"); //envoi le message à tout le monde
	});
});

//listening
server.listen(port, ip, function () {
  console.log('Server listening on ' + ip + ' with port ' + port);
});







