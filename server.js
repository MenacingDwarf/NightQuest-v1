const express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var puzzle = require('./puzzle');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var message = "";

server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.set('view engine', 'ejs');

server.get('/',function(req,res){
    res.render('start_page');
});

server.get('/puzzle',function(req,res){
	res.render('puzzle', {puzzle: JSON.stringify(puzzle.puzzle),message: message});
	message = "";
});

server.post('/register/', urlencodedParser, function (req, res) {
	puzzle.register(req.body.nickname);
	console.log(puzzle.puzzle.nickname+" started quest");
	res.redirect('/puzzle');
})

server.post('/check_code/', urlencodedParser, function (req, res) {
	puzzle.check(req.body.code) ? message = "Код введён верно" : message = "Код введён неверно";
	res.redirect('/puzzle');
})

server.listen(8080,
    () => console.log('Server UP!'));