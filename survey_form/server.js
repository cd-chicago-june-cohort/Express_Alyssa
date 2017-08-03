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
    res.render('index');
});

app.post('/process_survey', function(req, res){
    req.session.survey_results = req.body;
    res.redirect('/result');
});

app.get('/result', function(req, res){
    var user = req.session.survey_results;
    res.render('result', {user: user});
});

app.listen(8000);