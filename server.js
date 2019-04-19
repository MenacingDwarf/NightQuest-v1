require('dotenv').load();

const express = require('express');
var Cookies = require('cookies');
var path = require('path');
var bodyParser = require("body-parser");
var cors = require("cors");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var message = "";
const { Pool } = require('pg');
const pool = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	database: process.env.PGDATABASE,
	ssl: true,
})

server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.use(cors());
server.set('view engine', 'ejs');

server.get('/',function(req,res){
	var cookies = new Cookies(req,res);
	var message = cookies.get('message');
	cookies.set('message','');
	if (cookies.get('nickname') == undefined)
		pool.query('SELECT start_date FROM quest',(err,info) => {
			var now = new Date();
			var rem = '00:00:00';
			if (now < info.rows[0].start_date) {
				var ans = new Date(info.rows[0].start_date-now);
				var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds());
			}
			res.status(200).render('start_page', {message: message,start: rem});
		});
	else res.redirect('/puzzle');
});

server.get('/puzzle',function(req,res){
	var cookies = new Cookies(req,res);
	pool.query('SELECT user_quest.user_id FROM \"user\",user_quest WHERE nickname = $1 AND password = $2 AND \"user\".user_id = user_quest.user_id',[cookies.get('nickname'),cookies.get('password')],(err,exist) => {
		if (exist.rows.length == 0) {
			cookies.set('nickname','');
			cookies.set('password','');
			res.redirect('/');
		}
		else pool.query('SELECT user_quest.user_id,current_puzzle_id,title,html,autoskip_minutes,current_puzzle_time FROM user_quest,puzzle,\"user\" WHERE \"user\".nickname = $1 AND user_quest.user_id = \"user\".user_id AND puzzle_id = current_puzzle_id', [cookies.get('nickname')], (err,info) => {
			pool.query('SELECT title,nickname FROM quest,"user" WHERE user_id = owner',(err,quest) => {
				if (info.rows[0].current_puzzle_id == 0) {
					res.render('win',{nickname: cookies.get('nickname'),quest: JSON.stringify(quest.rows[0])}); 
				}
				else pool.query('SELECT value FROM answer,puzzle WHERE puzzle.puzzle_id=$1 AND answer.puzzle_id = puzzle.puzzle_id',[info.rows[0].current_puzzle_id],(err,res1) => {
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
							pool.query('SELECT user_quest.user_id,quest_id,current_puzzle_id,current_puzzle_time FROM user_quest,\"user\" WHERE \"user\".nickname = $1 AND user_quest.user_id = \"user\".user_id',[cookies.get('nickname')],(err,inf) => {
								pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = $2 AND NOT puzzle_id = 0 GROUP BY puzzle_id',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id],(err,remain) => {
									if (remain.rows.length == 0) { 
										var now = new Date();
										var ans = new Date(now-inf.rows[0].current_puzzle_time);
										var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
										
										const add_user_puzzle = async()=>{ 
											await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id,rem]);
											await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[0,inf.rows[0].user_id,now]);	
											await res.render('win',{nickname: cookies.get('nickname'),quest: JSON.stringify(quest.rows[0])});
										}
										add_user_puzzle();
									}
									else pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM puzzle,user_quest WHERE puzzle_id = current_puzzle_id GROUP BY puzzle_id) AND NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = 0 GROUP BY puzzle_id',[inf.rows[0].user_id],(err,free) => {
										
										if (free.rows.length == 0) {
											pool.query('SELECT puzzle_id FROM puzzle,user_quest WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = $2 AND puzzle_id = current_puzzle_id AND NOT puzzle_id = 0AND NOT puzzle_id = 0 AND current_puzzle_time = (SELECT min(current_puzzle_time) FROM user_quest)',[info.rows[0].user_id,inf.rows[0].current_puzzle_id], (err,result) => {
												var now = new Date();
												var ans = new Date(now-inf.rows[0].current_puzzle_time);
												var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
												const add_user_puzzle = async()=>{ 
													await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id,rem]);
													await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[result.rows[0].puzzle_id,inf.rows[0].user_id,now]);
													await res.redirect('/puzzle');
												}
												console.log(cookies.get('nickname')+'sent all codes and get free puzzle');
												add_user_puzzle();										
											});
										}
										else {
											var new_id = free.rows[Math.floor(Math.random() * free.rows.length)].puzzle_id;
											var now = new Date();
											var ans = new Date(now-inf.rows[0].current_puzzle_time);
											var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
											const add_user_puzzle = async()=>{ 
												await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id,rem]);
												await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[new_id,inf.rows[0].user_id,now]);
												await res.redirect('/puzzle');
											}
											console.log(cookies.get('nickname')+'sent all codes and get busy puzzle');
											add_user_puzzle();
										}
									});
								});
							});
						else {
							var now = new Date();
							var end = info.rows[0].current_puzzle_time; 
							end.setMinutes(end.getMinutes()+info.rows[0].autoskip_minutes);
							var ans = new Date(end-now); 
							var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
							if (ans.getUTCFullYear() < 1970) {
								pool.query('SELECT user_quest.user_id,quest_id,current_puzzle_id,current_puzzle_time FROM user_quest,\"user\" WHERE \"user\".nickname = $1 AND user_quest.user_id = \"user\".user_id',[cookies.get('nickname')],(err,inf) => {
									pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = 0 AND NOT puzzle_id = $2 GROUP BY puzzle_id',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id],(err,remain) => {
										if (remain.rows.length == 0) { 
											var now = new Date();
											var ans = new Date(now-inf.rows[0].current_puzzle_time);
											var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
											
											const add_user_puzzle = async()=>{ 
												await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id,rem]);
												await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $4 WHERE user_id = $2',[0,inf.rows[0].user_id,now]);	
												await res.render('win',{nickname: cookies.get('nickname'),quest: JSON.stringify(quest.rows[0])});
											}
											add_user_puzzle();
										}
										else pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM puzzle,user_quest WHERE puzzle_id = current_puzzle_id GROUP BY puzzle_id) AND NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = 0 GROUP BY puzzle_id',[inf.rows[0].user_id],(err,free) => {
											if (free.rows.length == 0) {
												pool.query('SELECT puzzle_id FROM puzzle,user_quest WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = $2 AND puzzle_id = current_puzzle_id AND current_puzzle_time = (SELECT min(current_puzzle_time) AND NOT puzzle_id = 0 FROM user_quest)',[info.rows[0].user_id,inf.rows[0].current_puzzle_id], (err,result) => {
													var now = new Date();
													var ans = new Date(now-inf.rows[0].current_puzzle_time);
													var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
													
													const add_user_puzzle = async()=>{ 
														await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id,rem]);
														await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[result.rows[0].puzzle_id,inf.rows[0].user_id,now]);
														await res.redirect('/puzzle');
													}
													console.log(cookies.get('nickname')+'autoskipped recent puzzle and get free puzzle');
													add_user_puzzle();
												});
											}
											else {
												var new_id = free.rows[Math.floor(Math.random() * free.rows.length)].puzzle_id;
												var now = new Date();
												var ans = new Date(now-inf.rows[0].current_puzzle_time);
												var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
												
												const add_user_puzzle = async()=>{ 
													await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id,rem]);
													await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[new_id,inf.rows[0].user_id,now]);
													await res.redirect('/puzzle');
												}
												console.log(cookies.get('nickname')+'autoskipped recent puzzle and get busy puzzle');
												add_user_puzzle();
											}
										});
									});
								});
							}
							else {
								pool.query('SELECT hint_id,html,fine_minutes,open_minutes FROM hint WHERE puzzle_id = $1',[info.rows[0].current_puzzle_id],(err,hint)=> {
									pool.query('SELECT hint_id FROM user_hint WHERE user_id = $1',[info.rows[0].user_id],(err,taked_hint) => {
										hints = [];

										info.rows[0].current_puzzle_time.setMinutes(info.rows[0].current_puzzle_time.getUTCMinutes()-info.rows[0].autoskip_minutes);

										for (var i=0; i<hint.rows.length; i++) {
											var ihint = {
												id : hint.rows[i].hint_id,
												status : 'none',
												val : 'none'
											}

											var hint_now = new Date();
											var hint_end = info.rows[0].current_puzzle_time; 
											hint_end.setUTCMinutes(hint_end.getUTCMinutes()+hint.rows[i].open_minutes);
											
											if (hint_end > hint_now) {
												var hint_ans = new Date(end-now); 
												var hint_rem = (hint_ans.getUTCHours()<10 ? '0'+hint_ans.getUTCHours() : hint_ans.getUTCHours()) + ':'+(hint_ans.getUTCMinutes()<10 ? '0' + hint_ans.getUTCMinutes() : hint_ans.getUTCMinutes())+':'+ (hint_ans.getUTCSeconds()<10 ? '0'+hint_ans.getUTCSeconds() : hint_ans.getUTCSeconds()); 
												ihint.val = hint_rem;
												ihint.status = "wait";
											}
											else {
												var taked = false;
												for (var j = 0; j < taked_hint.rows.length; j++) {
													if (hint.rows[i].hint_id == taked_hint.rows[j].hint_id) {
														taked = true;
														ihint.val = hint.rows[i].html;
														ihint.status = "display";
													}
												}
												if (taked == false) {
													ihint.val = hint.rows[i].fine_minutes;
													ihint.status = "suggest";
												}
											}

											hints.push(ihint);
											info.rows[0].current_puzzle_time.setUTCMinutes(info.rows[0].current_puzzle_time.getUTCMinutes()-hint.rows[i].open_minutes);
										}
													

										var pzl = {
											title: info.rows[0].title,
											html: info.rows[0].html,
											codes_num: answer.length,
											answers: answer,
											skip_time: rem
										}
										res.render('puzzle', {nickname: cookies.get('nickname'),puzzle: JSON.stringify(pzl),hints: JSON.stringify(hints),message: cookies.get('message'),quest: JSON.stringify(quest.rows[0])});
									})
								})
							}
						}
					});
				});
			});
		});
	});
	cookies.set('message','');
});

server.get('/statistics', function(req,res){
	var cookies = new Cookies(req,res);
	pool.query('SELECT current_puzzle_time,nickname,hsum.summary_fine,start_date,puzzle.title as puzzle_title, puzzles_done from user_quest, puzzle, quest, \"user\",(SELECT * FROM (SELECT user_id,count(puzzle_id) as puzzles_done FROM user_puzzle GROUP BY user_id) AS T1 UNION ALL (SELECT user_id, 0 as puzzles_done FROM user_quest WHERE user_id NOT IN (SELECT user_id FROM user_puzzle) ) ) pnum, (SELECT * FROM (SELECT user_id,sum(fine_minutes) as summary_fine FROM user_hint,hint WHERE hint.hint_id = user_hint.hint_id GROUP BY user_id) AS T1 UNION ALL (SELECT user_id,0 as summary_fine FROM user_quest WHERE user_id NOT IN (SELECT user_id FROM user_hint) ) ORDER BY user_id) hsum WHERE quest.quest_id = user_quest.quest_id AND user_quest.user_id = \"user\".user_id AND \"user\".user_id = pnum.user_id AND \"user\".user_id = hsum.user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id GROUP BY nickname,hsum.summary_fine,start_date,puzzle.title,puzzles_done,current_puzzle_time', (err,info) => {
		pool.query('SELECT title,nickname FROM quest,"user" WHERE user_id = owner',(err,quest) => {
			for (var i = 0; i<info.rows.length; i++) {
				var now = new Date();
				if (info.rows[i].puzzle_title == 'Окончил квест') now = info.rows[i].current_puzzle_time;
				var ans = new Date(now-info.rows[i].start_date);
				ans.setUTCMinutes(ans.getUTCMinutes()+Number(info.rows[i].summary_fine));
				info.rows[i].summary_fine = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
			}
			res.render('statistics', {statistics: JSON.stringify(info.rows),nickname: cookies.get('nickname'),quest: JSON.stringify(quest.rows[0])});
		});
	});
});

server.post('/login/', urlencodedParser, function (req, res) {
	const bcrypt = require('bcrypt');
	var cookies = new Cookies(req,res);
	pool.query("SELECT nickname,password from user_quest,\"user\" WHERE nickname = $1 AND \"user\".user_id = user_quest.user_id",[req.body.nickname],(err,res1) => {
		
		if (res1.rows.length == 0) {
			cookies.set('message','undefined user');
			res.redirect('/');
		}
		else {
			bcrypt.compare(req.body.password,res1.rows[0].password,function(err,ans){
				if (ans == false) {
					cookies.set('message','wrong password');
					res.redirect('/');
				}
				else {
					cookies.set('nickname',req.body.nickname);
					cookies.set('password',res1.rows[0].password);
					res.redirect('/puzzle');
				}
			});
		}
	});
})

server.post('/register/', urlencodedParser, function (req, res) {
	const bcrypt = require('bcrypt');
	var cookies = new Cookies(req,res);
	pool.query("SELECT nickname from user_quest,\"user\" WHERE nickname = $1 AND \"user\".user_id = user_quest.user_id",[req.body.nickname],(err,res1) => {
		if (res1.rows.length != 0) {
			cookies.set('message','already registered');
			res.redirect('/');
		}
		else {
			pool.query('SELECT puzzle_id FROM puzzle WHERE puzzle_id NOT IN (SELECT current_puzzle_id FROM user_quest) AND NOT puzzle_id = 0',(err,free) => {
				if (free.rows.length < 2) {
					cookies.set('message','no places');
					res.redirect('/');
				}
				else {
					var new_id = free.rows[Math.floor(Math.random() * free.rows.length)].puzzle_id;
					bcrypt.hash(req.body.password,Math.floor(Math.random() * 10),(err,hash)=>{
						const add_user_puzzle = async()=>{ 
							await pool.query('INSERT INTO \"user\" VALUES(DEFAULT,$1,$2)',[req.body.nickname,hash]);
							await pool.query('SELECT user_id,start_date FROM \"user\",quest WHERE nickname=$1',[req.body.nickname],(err,info)=>{
								pool.query('INSERT INTO user_quest VALUES($1,1,$2,$3)',[info.rows[0].user_id,new_id,info.rows[0].start_date]);
							})
							await cookies.set('message','registered');
							await res.redirect('/');
						}
						add_user_puzzle();
					})
				}
			})
		}
	})
})

server.post('/check_code/', urlencodedParser, function (req, res1) {
	var cookies = new Cookies(req,res1);
	pool.query('SELECT user_quest.user_id,answer_id,value from answer,user_quest,\"user\" WHERE "user".nickname = $1 AND user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = answer.puzzle_id',[cookies.get('nickname')],(err,res) =>{
		cookies.set('message','Wrong answer');
		for (var i = 0; i<res.rows.length; i++) {
			if (req.body.code == res.rows[i].value) {
				cookies.set('message','Right answer');
				var time = new Date();
				pool.query('INSERT INTO user_answer VALUES($1,$2,$3)',[res.rows[i].user_id,res.rows[i].answer_id,time]);
			}
		}
		res1.redirect('/puzzle');
	});
})
server.post('/take_hint', urlencodedParser, function (req, res) {
	var cookies = new Cookies(req,res);
	var now = new Date();
	var puzzle_id = req.query.id;
	pool.query('SELECT user_id FROM \"user\" WHERE nickname=$1',[cookies.get('nickname')],(err,user_info) => {
		pool.query('INSERT INTO user_hint VALUES($1,$2,$3)',[user_info.rows[0].user_id,puzzle_id,now]);
		res.redirect('/puzzle');
	})
})

server.get('/quit',urlencodedParser, function (req, res) {
	var cookies = new Cookies(req,res);
	cookies.set('nickname','');
	res.redirect('/');
})

server.post('/check_matrix', urlencodedParser, (req, res) => {
	matrix = req.body.matrix;
	res.set({
	  "Accept": "application/json",
	  "Access-Control-Allow-Origin": "*",
	  "X-Requested-With": "XMLHttpRequest",
	  "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
	  "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
	});
	// Проверка на правильность матрицы
	if (matrix[0][0] == 180 && matrix[1][0] == 0 && matrix[1][1] == 270 && matrix[0][1] == 90 && matrix[0][2] == 180 && (matrix[1][2] == 90 || matrix[1][2] == 270) 
				&& (matrix[2][2] == 90 || matrix[2][2] == 270) && matrix[3][2] == 270 && (matrix[3][1] == 0 || matrix[3][1] == 180) && matrix[3][0] == 90 && matrix[4][0] == 0
				&& matrix[4][1] == 180 && matrix[5][1] == 0 && (matrix[5][2] == 0 || matrix[5][2] == 180) && matrix[5][3] == 270 && (matrix[4][3] == 90 || matrix[4][3] == 270)
				&& matrix[3][3] == 90 && matrix[3][4] == 270 && matrix[2][4] == 90 && matrix[2][5] == 180 && matrix[3][5] == 0 && matrix[3][6] == 180
				&& (matrix[4][6] == 90 || matrix[4][6] == 270) && matrix[5][6] == 0 && matrix[5][7] == 270 && matrix[4][7] == 90) {
		res.send({'result': true, 'text': 'Похоже, вы отлично справляетесь с трубами. Но есть парень, который делает это лучше, вам поможет Леонид Зиновьев!',
								 'image': 'http://d1.endata.cx/data/games/65192/JIBRz-H9QIw.jpg'})
	}
	else res.send({'result': false})
})

server.post('/check_piano', urlencodedParser, (req, res) => {
	answer = [];
	let clicked = req.body.clicked;
	if (clicked[clicked.length-1] == "D") res.send({'result': 'ok', 'clicked': clicked});
	else res.send({'result': 'not ok', 'clicked': clicked})
})

server.listen(process.env.PORT,
    () => console.log('Server UP!'));

module.exports = server;