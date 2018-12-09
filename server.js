const express = require('express');
var Cookies = require('cookies');
var path = require('path');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var message = "";
const { Pool } = require('pg');
const pool = new Pool({
	user: 'bmqdyfqdyhfcxv',
	password: '1184c6a5ec317b6467153cb5a3bc16dadc498059d39af5e5f82cb62faeca5ed7',
	host: 'ec2-54-75-231-3.eu-west-1.compute.amazonaws.com',
	port: 5432,
	database: 'd5q612j9avqv2g',
	ssl: true,
})

server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.set('view engine', 'ejs');

server.get('/',function(req,res){
	var cookies = new Cookies(req,res);
	var message = cookies.get('message');
	cookies.set('message','');
	if (cookies.get('nickname') == undefined) {
		res.render('start_page', {message: message});
	}
    else {
    	res.redirect('/puzzle');
    }
});

server.get('/puzzle',function(req,res){
	var cookies = new Cookies(req,res);
	pool.query('SELECT user_quest.user_id,current_puzzle_id,title,html,autoskip_minutes,current_puzzle_time FROM user_quest,puzzle,\"user\" WHERE \"user\".nickname = $1 AND user_quest.user_id = \"user\".user_id AND puzzle_id = current_puzzle_id', [cookies.get('nickname')], (err,info) => {
		if (info.rows[0].current_puzzle_id == 0) {
			res.render('win',{nickname: cookies.get('nickname')}); 
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
					pool.query('SELECT user_quest.user_id,quest_id,current_puzzle_id,current_puzzle_time,summary_fine FROM user_quest,\"user\" WHERE \"user\".nickname = $1 AND user_quest.user_id = \"user\".user_id',[cookies.get('nickname')],(err,inf) => {
						pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = $2 GROUP BY puzzle_id',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id],(err,remain) => {
							if (remain.rows.length == 0) { 
								var now = new Date();
								var ans = new Date(now-inf.rows[0].current_puzzle_time);
								var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
								ans.setMinutes(ans.getMinutes()+inf.rows[0].summary_fine);
								const add_user_puzzle = async()=>{ 
									await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].current_puzzle_id,inf.rows[0].user_id,rem]);
									await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[0,inf.rows[0].user_id,now]);	
									await res.render('win',{nickname: cookies.get('nickname')});
								}
								console.log('WIIIIIIIIIIIIIIIIIIIN!!!!!!'); 
								add_user_puzzle();
							}
							else pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM puzzle,user_quest WHERE puzzle_id = current_puzzle_id GROUP BY puzzle_id) AND NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) GROUP BY puzzle_id',[inf.rows[0].user_id],(err,free) => {
								if (free.rows.length == 0) {
									pool.query('SELECT puzzle_id FROM puzzle,user_quest WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND puzzle_id = current_puzzle_id AND current_puzzle_time = (SELECT min(current_puzzle_time) FROM user_quest)',[info.rows[0].user_id], (err,result) => {
										var now = new Date();
										var ans = new Date(now-inf.rows[0].current_puzzle_time);
										var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
										ans.setMinutes(ans.getMinutes()+inf.rows[0].summary_fine);
										const add_user_puzzle = async()=>{ 
											await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].current_puzzle_id,inf.rows[0].user_id,rem]);
											await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[result.rows[0].puzzle_id,inf.rows[0].user_id,now]);
											await res.redirect('/puzzle');
										}
										console.log('Position 1');
										add_user_puzzle();										
									});
								}
								else {
									var new_id = free.rows[Math.floor(Math.random() * free.rows.length)].puzzle_id;
									var now = new Date();
									var ans = new Date(now-inf.rows[0].current_puzzle_time);
									var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
									ans.setMinutes(ans.getMinutes()+inf.rows[0].summary_fine);
									const add_user_puzzle = async()=>{ 
										await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].current_puzzle_id,inf.rows[0].user_id,rem]);
										await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[new_id,inf.rows[0].user_id,now]);
										await res.redirect('/puzzle');
									}
									console.log('Position 2');
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
						pool.query('SELECT user_quest.user_id,quest_id,current_puzzle_id,current_puzzle_time,summary_fine FROM user_quest,\"user\" WHERE \"user\".nickname = $1 AND user_quest.user_id = \"user\".user_id',[cookies.get('nickname')],(err,inf) => {
							pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND NOT puzzle_id = $2 GROUP BY puzzle_id',[inf.rows[0].user_id,inf.rows[0].current_puzzle_id],(err,remain) => {
								if (remain.rows.length == 0) { 
									var now = new Date();
									var ans = new Date(now-inf.rows[0].current_puzzle_time);
									var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
									ans.setMinutes(ans.getMinutes()+inf.rows[0].summary_fine);
									const add_user_puzzle = async()=>{ 
										await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].current_puzzle_id,inf.rows[0].user_id,rem]);
										await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $4 WHERE user_id = $2',[0,inf.rows[0].user_id,now]);	
										await res.render('win',{nickname: cookies.get('nickname')});
									}
									console.log('WIIIIIIIIIIIIIIIIIIIN!!!!!!'); 
									add_user_puzzle();
								}
								else pool.query('SELECT puzzle_id FROM puzzle WHERE NOT puzzle_id IN (SELECT puzzle_id FROM puzzle,user_quest WHERE puzzle_id = current_puzzle_id GROUP BY puzzle_id) AND NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) GROUP BY puzzle_id',[inf.rows[0].user_id],(err,free) => {
									if (free.rows.length == 0) {
										pool.query('SELECT puzzle_id FROM puzzle,user_quest WHERE NOT puzzle_id IN (SELECT puzzle_id FROM user_puzzle WHERE user_id = $1) AND puzzle_id = current_puzzle_id AND current_puzzle_time = (SELECT min(current_puzzle_time) FROM user_quest)',[info.rows[0].user_id], (err,result) => {
											var now = new Date();
											var ans = new Date(now-inf.rows[0].current_puzzle_time);
											var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
											ans.setMinutes(ans.getMinutes()+inf.rows[0].summary_fine);
											const add_user_puzzle = async()=>{ 
												await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].current_puzzle_id,inf.rows[0].user_id,rem]);
												await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[result.rows[0].puzzle_id,inf.rows[0].user_id,now]);
												await res.redirect('/puzzle');
											}
											console.log('Position 3');
											add_user_puzzle();
										});
									}
									else {
										var new_id = free.rows[Math.floor(Math.random() * free.rows.length)].puzzle_id;
										var now = new Date();
										var ans = new Date(now-inf.rows[0].current_puzzle_time);
										var rem = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
										ans.setMinutes(ans.getMinutes()+inf.rows[0].summary_fine);
										const add_user_puzzle = async()=>{ 
											await pool.query('INSERT INTO user_puzzle VALUES($1,$2,$3)',[inf.rows[0].current_puzzle_id,inf.rows[0].user_id,rem]);
											await pool.query('UPDATE user_quest SET current_puzzle_id = $1,current_puzzle_time = $3 WHERE user_id = $2',[new_id,inf.rows[0].user_id,now]);
											await res.redirect('/puzzle');
										}
										console.log('Position 4');
										add_user_puzzle();
									}
								});
							});
						});
					}
					else {
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
	pool.query('SELECT nickname,summary_fine,start_date,puzzle.title as puzzle_title, puzzles_done from user_quest, puzzle, quest, \"user\",(SELECT * FROM (SELECT user_id,count(puzzle_id) as puzzles_done FROM user_puzzle GROUP BY user_id) AS T1 UNION ALL (SELECT user_id, 0 as puzzles_done FROM user_quest WHERE user_id NOT IN (SELECT user_id FROM user_puzzle) ) ) pnum WHERE quest.quest_id = user_quest.quest_id AND user_quest.user_id = \"user\".user_id AND \"user\".user_id = pnum.user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id GROUP BY nickname,summary_fine,start_date,puzzle.title,puzzles_done', (err,info) => {
		for (var i = 0; i<info.rows.length; i++) {
			var now = new Date();
			var ans = new Date(now-info.rows[i].start_date);
			ans.setMinutes(ans.getMinutes()+info.rows[i].summary_fine);
			info.rows[i].summary_fine = (ans.getUTCHours()<10 ? '0'+ans.getUTCHours() : ans.getUTCHours()) + ':'+(ans.getUTCMinutes()<10 ? '0' + ans.getUTCMinutes() : ans.getUTCMinutes())+':'+ (ans.getUTCSeconds()<10 ? '0'+ans.getUTCSeconds() : ans.getUTCSeconds()); 
		}
		res.render('statistics', {statistics: JSON.stringify(info.rows),nickname: cookies.get('nickname')});
	});
});

server.post('/register/', urlencodedParser, function (req, res) {
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
					res.redirect('/puzzle');
				}
			});
		}
	});
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

server.get('/quit',urlencodedParser, function (req, res) {
	var cookies = new Cookies(req,res);
	cookies.set('nickname','');
	res.redirect('/');
})

server.listen(8080,
    () => console.log('Server UP!'));