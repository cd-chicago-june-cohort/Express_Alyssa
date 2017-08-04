// Import express and path modules.
var express = require( "express");
var path = require( "path");

// Create the express app.
var app = express();

// Define the static folder.
app.use(express.static(path.join(__dirname, "./static")));

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

var users = [];
var chats = [];

io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on('new_user_join', function(data){
        var new_user = {
            user_name: data.user_name,
            user_id: socket.id
        };
        users.push(new_user);
        // send the new user the all_chats information
        socket.emit('all_chats', {chats: chats});
        socket.broadcast.emit('user_joined', {new_user: new_user});
    });

    socket.on('post_message', function(data){
        var new_message = {
            name: data.name,
            message: data.message,
        };
        chats.push(new_message);
        io.emit('update_messages', {new_message: new_message});
    });

    socket.on('disconnect', function(){
        console.log('got disconnect from:', socket.id);
        var user_index = users.map(function(x) {return x.user_id; }).indexOf(socket.id);
        var disconnected_user = users[user_index];
        io.emit('user_left', {disconnected_user: disconnected_user});
        console.log(users);
    });
});