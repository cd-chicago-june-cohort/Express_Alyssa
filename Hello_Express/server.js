var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.get('/', function(request, response) {
    response.send('<h1>Hello Express</h1');
});

// this is the line that tells our server to use the "/static" folder for static content
// two underscores before dirname
app.use(express.static(__dirname + "/static"));

// This sets the location where express will look for the ejs views
app.set('views', __dirname + '/views'); 
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');

app.get('/user_list', function(request,response){
    var users_array = [
        {name: "Michael", email: "michael@codingdojo.com"}, 
        {name: "Jay", email: "jay@codingdojo.com"}, 
        {name: "Brendan", email: "brendan@codingdojo.com"}, 
        {name: "Andrew", email: "andrew@codingdojo.com"}
    ];
    response.render('users', {users: users_array});
});

app.get('/index', function(request, response){
    response.render('index');
});

app.use(bodyParser.urlencoded({extended: true}));

app.post('/users', function(request, response){
    console.log('POST DATA \n\n', request.body);
    response.redirect('/');
});

app.get("/users/:id", function (req, res){
    console.log("The user id requested is:", req.params.id);
    // just to illustrate that req.params is usable here:
    res.send("You requested the user with id: " + req.params.id);
    // code to get user from db goes here, etc...
});


app.listen(8000, function() {
    console.log('listening on port 8000');
});