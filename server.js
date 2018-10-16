//loading modules
const express = require('express')
const app = express()

//defining the view engine
app.set('view engine', 'ejs');

//defining network
const ip = "0.0.0.0";
const port = "80";

//defining ressources folder
app.use(express.static(__dirname + '/public'));


//main view
app.use("/", (req, res) => {
    res.render("main");
});

//listening
app.listen(port, ip, function () {
  console.log('Server listening on ' + ip + ' with port ' + port)
})
