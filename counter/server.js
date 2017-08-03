var express = require('express');
var session = require('express-session');
var app = express();

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.use(session({secret: 'donttellanyone', resave: false, saveUninitialized: true}));

app.get('/', function(request, response){
    if (request.session.counter){
        request.session.counter += 1;
    } else{
        request.session.counter = 1;
    }
    response.render('index', {counter: request.session.counter});
});

app.post('/two_times', function(request, response){
    request.session.counter += 1;
    response.redirect('/');
});

app.post('/reset', function(request, response){
    request.session.counter = 0;
    response.redirect('/');
});

app.listen(8000, function() {
    console.log('listening on port 8000');
});


