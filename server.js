const express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var puzzle = require('./puzzle');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var message = "";
const { Pool } = require('pg');
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'NQ',
	password: 'testpassword',
	port: 5432
})

server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.set('view engine', 'ejs');
nickname = "Noname";

server.get('/',function(req,res){
	console.log(puzzle.message);
    res.render('start_page');
});

server.get('/puzzle',function(req,res){
	pool.query('SELECT user_quest.user_id,puzzle_id,title,html,autoskip_minutes,current_puzzle_time FROM user_quest,puzzle,\"user\" WHERE \"user\".login = $1 AND user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id', [puzzle.puzzle.nickname], (err,info) => {
		pool.query('SELECT value FROM answer,puzzle WHERE puzzle.puzzle_id=$1 AND answer.puzzle_id = puzzle.puzzle_id',[info.rows[0].puzzle_id],(err,res1) => {
			pool.query('SELECT value FROM answer,user_answer WHERE user_answer.user_id=$1 AND answer.answer_id = user_answer.answer_id', [info.rows[0].user_id],(err,res2) => {
				var answer = [];
				for (var i=0; i<res1.rows.length; i++) {
					ind = -1;
					for (var j=0;j<res2.rows.length; j++) {
						if (res2.rows[j].value == res1.rows[i].value)
							ind = j;
					}
					if (ind == -1) answer.push("none");
					else answer.push(res1.rows[i].value);
				}
				var now = new Date(); 
				var end = info.rows[0].current_puzzle_time; 
				end.setMinutes(end.getMinutes()+info.rows[0].autoskip_minutes); 
				var ans = new Date(end-now); 
				var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
				if (ans.getUTCFullYear() < 1970) rem = 'time left';
				var pzl = {
					nickname: puzzle.puzzle.nickname,
					title: info.rows[0].title,
					html: info.rows[0].html,
					codes_num: answer.length,
					answers: answer,
					skip_time: rem
				}
				puzzle.puzzle = pzl;
				console.log(puzzle.message);
				res.render('puzzle', {nickname: puzzle.puzzle.nickname,puzzle: JSON.stringify(pzl),message: puzzle.message});
			});
		});
	});
	console.log(puzzle.puzzle);
	puzzle.message = "";
});

server.get('/statistics', function(req,res){
	pool.query('SELECT login,summary_time,puzzles_done,title as puzzle_title from user_quest, puzzle, \"user\" WHERE user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id', (err,info) => {
		console.log(JSON.parse(JSON.stringify(info.rows)));
		res.render('statistics', {statistics: JSON.stringify(info.rows),nickname: puzzle.puzzle.nickname});
	});
});

server.post('/register/', urlencodedParser, function (req, res) {
	pool.query("SELECT * from user_quest,\"user\" WHERE login = $1 AND \"user\".user_id = user_quest.user_id",[req.body.nickname],(err,res1) => {
		console.log(res1.rows.length);
		if (res1.rows.length != 0) {
			puzzle.puzzle.nickname = req.body.nickname;
			res.redirect('/puzzle');
		}
		else {
			puzzle.message="Пользователь не зарегистрирован!";
			res.redirect('/');
		}
	});
	puzzle.message = "";
})

server.post('/check_code/', urlencodedParser, function (req, res1) {
	 pool.query('SELECT user_quest.user_id,answer_id,value from answer,user_quest,\"user\" WHERE "user".login = $1 AND user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = answer.puzzle_id',[puzzle.puzzle.nickname],(err,res) =>{
		puzzle.message = "Код введён неверно"
		for (var i = 0; i<res.rows.length; i++) {
			if (req.body.code == res.rows[i].value) {
				puzzle.message = "Код введён верно";
				puzzle.puzzle.answers[i] = req.body.code;
				var time = '18-11-10 12:00:00';
				pool.query('INSERT INTO user_answer VALUES($1,$2,$3)',[res.rows[i].user_id,res.rows[i].answer_id,time]);
			}
		}
	});
	res1.redirect('/puzzle');
})

server.listen(8080,
    () => console.log('Server UP!'));