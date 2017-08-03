// Import express and path modules.
var express = require( "express");
var path = require( "path");

// Create the express app.
var app = express();

// Define the static folder.
app.use(express.static(path.join(__dirname, './static')));

// Setup ejs templating and define the views folder.
app.set('views', path. join(__dirname, './views'));
app.set('view engine', 'ejs');

var counter = 0;
// Root route to render the index.ejs view.
app.get('/', function(req, res) {
    res.render("index", {counter: counter});
});

var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});

// Create an io object to control sockets
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.emit('update_count', {counter: counter});
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on('epic_click', function(){
        counter += 1;
        io.emit('update_count', {counter: counter});
    });
    socket.on('reset_click', function(){
        counter = 0;
        io.emit('update_count', {counter: counter});
    });
});