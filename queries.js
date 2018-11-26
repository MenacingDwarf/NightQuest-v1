const { Pool } = require('pg');
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'NQ',
	password: 'testpassword',
	port: 5432
})

pool.query('SELECT user_quest.user_id,puzzle_id,title,html,autoskip_time,current_puzzle_time FROM user_quest,puzzle,\"user\" WHERE \"user\".login = $1 AND user_quest.user_id = \"user\".user_id AND user_quest.current_puzzle_id = puzzle.puzzle_id', ['Petya'], (err,info) => {
	pool.query('SELECT value FROM answer,puzzle WHERE puzzle.puzzle_id=$1 AND answer.puzzle_id = puzzle.puzzle_id',[info.rows[0].puzzle_id],(err,res1) => {
		pool.query('SELECT value FROM answer,user_answer WHERE user_answer.user_id=$1 AND answer.answer_id = user_answer.answer_id', [info.rows[0].user_id],(err,res2) => {
			var ans = [];
			for (var i=0; i<res1.rows.length; i++) {
				ind = -1;
				for (var j=0;j<res2.rows.length; j++) {
					if (res2.rows[j].value == res1.rows[i].value)
						ind = j;
				}
				if (ind == -1) ans.push("none");
				else ans.push(res1.rows[i].value);
			}
			var puzzle = {
				nickname: 'Petya',
				title: info.title,
				html: info.html,
				answers: ans,
				skip_time: "02:00:00"
			}
			console.log(ans);
		});
	});
});