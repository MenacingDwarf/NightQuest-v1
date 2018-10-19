const express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var puzzle = {
	nickname: "Noname",
	title: "Странный памятник",
	html: "/puzzles/1.html"
}

server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.set('view engine', 'ejs');

server.get('/',function(req,res){
    res.render('start_page');
});

server.get('/puzzle',function(req,res){
	console.log(puzzle.nickname+" started quest");
	res.render('puzzle', {puzzle: JSON.stringify(puzzle)});
});

server.post('/register/', urlencodedParser, function (req, res) {
	req.body.nickname == "" ? puzzle.nickname = "Noname" : puzzle.nickname = req.body.nickname;
	res.redirect('/puzzle');
})

server.post('/check_code/', urlencodedParser, function (req, res) {
	res.redirect('/puzzle');
})

server.listen(8080,
    () => console.log('Server UP!'));