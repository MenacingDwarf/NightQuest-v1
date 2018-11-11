const { Client } = require('pg');
const client = new Client({
	user: 'postgres',
	host: 'localhost',
	database: 'NQ',
	password: 'testpassword',
	port: 5432
})

client.connect();

client.query('SELECT title from puzzle',(err,res) => {
	console.log(res.rows);
	client.end();
})