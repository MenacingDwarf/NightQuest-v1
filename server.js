const express = require('express');
var Cookies = require('cookies');
var path = require('path');
var bodyParser = require("body-parser");
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

server.get('/',function(req,res){
	var cookies = new Cookies(req,res);
	console.log(cookies.get('nickname'));
	if (cookies.get('nickname') == undefined) res.render('start_page');
    else res.redirect('/puzzle');
});

server.get('/puzzle',function(req,res){
	var cookies = new Cookies(req,res);
	pool.query('SELECT user_quest.user_id,puzzle_id,title,html,autoskip_minutes,current_puzzle_time FROM user_quest,puzzle,\"user\" WHERE \"user\".login = $1 AND user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id', [cookies.get('nickname')], (err,info) => {
		pool.query('SELECT value FROM answer,puzzle WHERE puzzle.puzzle_id=$1 AND answer.puzzle_id = puzzle.puzzle_id',[info.rows[0].puzzle_id],(err,res1) => {
			pool.query('SELECT value FROM answer,user_answer WHERE user_answer.user_id=$1 AND answer.answer_id = user_answer.answer_id', [info.rows[0].user_id],(err,res2) => {
				var answer = [];
				var right_ans_num = 0;
				for (var i=0; i<res1.rows.length; i++) {
					ind = -1;
					for (var j=0;j<res2.rows.length; j++) {
						if (res2.rows[j].value == res1.rows[i].value) {
							ind = j;
							right_ans_num += 1;
						}
					}
					if (ind == -1) answer.push("none");
					else answer.push(res1.rows[i].value);
				}
				if (res1.rows.length == right_ans_num)
					res.redirect('/next_puzzle');
				else {
					var now = new Date(); 
					var end = info.rows[0].current_puzzle_time; 
					end.setMinutes(end.getMinutes()+info.rows[0].autoskip_minutes); 
					var ans = new Date(end-now); 
					var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
					if (ans.getUTCFullYear() < 1970) {
						res.redirect('/next_puzzle');
					}
					else {
						console.log(ans);
						var pzl = {
							title: info.rows[0].title,
							html: info.rows[0].html,
							codes_num: answer.length,
							answers: answer,
							skip_time: rem
						}
						res.render('puzzle', {nickname: cookies.get('nickname'),puzzle: JSON.stringify(pzl),message: cookies.get('message')});
					}
				}
			});
		});
	});
	cookies.set('message','');
});

server.get('/statistics', function(req,res){
	var cookies = new Cookies(req,res);
	pool.query('SELECT login,summary_time,puzzles_done,title as puzzle_title from user_quest, puzzle, \"user\" WHERE user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id', (err,info) => {
		console.log(JSON.parse(JSON.stringify(info.rows)));
		res.render('statistics', {statistics: JSON.stringify(info.rows),nickname: cookies.get('nickname')});
	});
});

server.post('/register/', urlencodedParser, function (req, res) {
	var cookies = new Cookies(req,res);
	pool.query("SELECT * from user_quest,\"user\" WHERE login = $1 AND \"user\".user_id = user_quest.user_id",[req.body.nickname],(err,res1) => {
		console.log(res1.rows.length);
		if (res1.rows.length != 0) {
			cookies.set('nickname',req.body.nickname);
			res.redirect('/puzzle');
		}
		else {
			cookies.set('message','Пользователь не зарегистрирован!');
			res.redirect('/');
		}
	});
	cookies.set('message','');
})

server.post('/check_code/', urlencodedParser, function (req, res1) {
	var cookies = new Cookies(req,res1);
	pool.query('SELECT user_quest.user_id,answer_id,value from answer,user_quest,\"user\" WHERE "user".login = $1 AND user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = answer.puzzle_id',[cookies.get('nickname')],(err,res) =>{
		cookies.set('message','Wrong answer');
		for (var i = 0; i<res.rows.length; i++) {
			if (req.body.code == res.rows[i].value) {
				cookies.set('message','Right answer');
				var time = '18-11-10 12:00:00';
				pool.query('INSERT INTO user_answer VALUES($1,$2,$3)',[res.rows[i].user_id,res.rows[i].answer_id,time]);
			}
		}
		res1.redirect('/puzzle');
	});
})

server.get('/next_puzzle', urlencodedParser, function (req, res) {
	var cookies = new Cookies(req,res);
	pool.query('SELECT * FROM user_quest,\"user\" WHERE \"user\".login = $1',[cookies.get('nickname')],(err,info) => {
		pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM puzzle,user_quest WHERE puzzle_id = current_puzzle_id GROUP BY puzzle_id) AND NOT puzzle_id IN (SELECT puzzle.puzzle_id FROM user_answer,puzzle,answer WHERE user_answer.user_id = $1 AND user_answer.answer_id = answer.answer_id AND answer.puzzle_id = puzzle.puzzle_id GROUP BY puzzle.puzzle_id) GROUP BY puzzle_id',[info.rows[0].user_id],(err,free) => {
			var new_id = free.rows[Math.floor(Math.random() * free.rows.length)].puzzle_id;
			var now = new Date();
			pool.query('UPDATE user_quest SET current_puzzle_id = $1,puzzles_done = $3,current_puzzle_time = $4 WHERE user_id = $2',[new_id,info.rows[0].user_id,info.rows[0].puzzles_done+1,now]);
			res.redirect('/puzzle');
		});
	});
})

server.get('/quit',urlencodedParser, function (req, res) {
	var cookies = new Cookies(req,res);
	cookies.set('nickname','');
	res.redirect('/');
})

server.listen(8080,
    () => console.log('Server UP!'));