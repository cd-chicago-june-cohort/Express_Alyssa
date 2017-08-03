var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(bodyParser.urlencoded());
app.use(session({secret: 'donttellanyone', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');


app.get('/', function(req, res){
    if (!req.session.number){
        req.session.number = Math.floor(Math.random() * 100)+1;
    }
    if (!req.session.guess){
        req.session.guess = null;
    }
    console.log(req.session.number);
    console.log(req.session.guess);
    var feedback = {};
    switch (req.session.guess){
        case 'wrong-low':
            feedback.type = 'wrong';
            feedback.string = 'Too low!';
            break;
        case 'wrong-high':
            feedback.type = 'wrong';
            feedback.string = 'Too high!';
            break;
        case 'right':
            feedback.type = 'right';
            feedback.string = req.session.number + " was the number!";
            break;
        default:
            feedback.type = null;
            feedback.string = null;
    }
    res.render('index', {feedback: feedback});
});

app.post('/process_guess', function(req, res){
    var guess = req.body.guess;
    var number = req.session.number;
    if (guess>number){
        req.session.guess = 'wrong-high';
    }else if (guess<number){
        req.session.guess = 'wrong-low';
    }else if (guess == number){
        req.session.guess = 'right';
    }
    res.redirect('/');
});

app.get('/reset', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

app.listen(8000);