const express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var nickname = "Noname"
var puzzle = {
	nickname: nickname
}

server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.set('view engine', 'ejs');

server.get('/',function(req,res){
    res.render('start_page');
});

server.get('/puzzle',function(req,res){
	res.render('puzzle', {puzzle: JSON.stringify(puzzle)});
});

server.post('/register/', urlencodedParser, function (req, res) {
	res.redirect('/puzzle');
	nickname = req.body.nickname;
})

server.listen(8080,
    () => console.log('Server UP!'));