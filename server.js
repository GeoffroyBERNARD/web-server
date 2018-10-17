//loading modules
const express = require('express')
const app = express()




//defining the view engine
app.set('view engine', 'ejs');

let server = require("http").Server(app);
let io = require('socket.io').listen(server);

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
    connection += 1;
    console.log("Connection n°" + connection)
});

//listening
app.listen(port, ip, function () {
  console.log('Server listening on ' + ip + ' with port ' + port)
});





