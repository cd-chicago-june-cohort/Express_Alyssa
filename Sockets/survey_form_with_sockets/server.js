// Import express and path modules.
var express = require( "express");
var path = require( "path");

// Create the express app.
var app = express();

// Define the static folder.
app.use(express.static(path.join(__dirname + "./static")));

// Setup ejs templating and define the views folder.
app.set('views', path. join(__dirname, './views'));
app.set('view engine', 'ejs');

// Root route to render the index.ejs view.
app.get('/', function(req, res) {
    res.render("index");
});

// Start Node server listening on port 8000.
var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});

// Create an io object to control sockets
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket. on( "posting_form", function (data){
        var form_data = data.form_data;
        var form_display = "{ name: '" + form_data.name + "', location: '" + form_data.location + "', language: '" + form_data.language + "', comment: '" + form_data.comment + "'}";
        var lucky_num = Math.ceil(Math.random() * 1000);
        socket.emit( 'server_response', {form_display: form_display, lucky_num: lucky_num});
    });
});