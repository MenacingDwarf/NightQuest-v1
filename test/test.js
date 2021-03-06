require('dotenv').load();

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
process.env.PORT = 8080;

const { Pool } = require('pg');
const pool = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	database: process.env.PGDATABASE,
	ssl: true,
})

chai.use(chaiHttp);
var url = "https://nightquest.herokuapp.com";

describe('Night Quest tests', () => {
	describe('Start page', () => {
		it('should load with status 200', (done) => {
			chai.request(url)
		  		.get('/')
		  		.end((err,res) => {
		  			res.should.have.status(200);
		  			done();
		  		})
		});

		it('should be able to register players', (done) => {
			chai.request(url)
		  		.post('/register/')
		  		.type('form')
		  		.send({
		  			'nickname': 'Mishanya',
		  			'password': 'nigga228'
		  		})
		  		.end((err,res) => {
		  			res.should.have.status(200);
		  			expect(res).to.redirect;

		  			pool.query('SELECT user_quest.user_id FROM \"user\", user_quest WHERE nickname=\'Mishanya\'',(err,dbres) => {
		  				dbres.rows.length.should.not.equal(0);
		  				done();
		  			})
		  		})
		});

		it('should be able to log in correct players', (done) => {
			pool.query('SELECT password FROM \"user\" WHERE nickname = \'Mishanya\'',(err,pass) => {
				chai.request(url)
			  		.post('/login/')
			  		.type('form')
			  		.set('Cookie','nickname=Mishanya;password='+pass.rows[0].password)
			  		.send({
			  			'nickname': 'Mishanya',
			  			'password': 'nigga228'
			  		})
			  		.end((err,res) => {
			  			res.should.have.status(200);
			  			expect(res).to.redirectTo(url+'/puzzle');
			  			done();
			  		})
		  	})
		});

		it('should forbid logging in incorrect players', (done) => {
			chai.request(url)
		  		.post('/login/')
		  		.type('form')
		  		.send({
		  			'nickname': 'Mishanyna',
		  			'password': 'nigga1488'
		  		})
		  		.end((err,res) => {
		  			res.should.have.status(200);
		  			expect(res).to.redirectTo(url+'/');
		  			done();
		  		})
		});
	});


	describe('Puzzle page', () => {

		it('should load with status 200', (done) => {
			pool.query('SELECT password FROM \"user\" WHERE nickname = \'Mishanya\'',(err,pass) => {
				chai.request(url)
			  		.get('/puzzle')
			  		.set('Cookie','nickname=Mishanya;password='+pass.rows[0].password)
			  		.end((err,res) => {
			  			res.should.have.status(200);
			  			done();
			  		})
			});
		});

		it('should be able to check wrong player codes', (done) => {
			pool.query('SELECT password FROM \"user\" WHERE nickname = \'Mishanya\'',(err,pass) => {
				chai.request(url)
			  		.post('/check_code/')
			  		.type('form')
			  		.set('Cookie','nickname=Mishanya;password='+pass.rows[0].password)
			  		.send({
			  			'code': 'ans1'
			  		})
			  		.end((err,res) => {
			  			res.should.have.status(200);
			  			expect(res).to.redirectTo(url+'/puzzle');

			  			pool.query('SELECT answer_id \
			  						FROM \"user\", user_answer \
			  						WHERE nickname=\'Mishanya\' \
			  						AND user_answer.user_id = \"user\".user_id',(err,dbres) => {
			  				dbres.rows.length.should.equal(0);
			  				done();
			  			})
			  		})
		  	});
		});

		it('should be able to check right player codes', (done) => {
			pool.query('SELECT password FROM \"user\" WHERE nickname = \'Mishanya\'',(err,pass) => {
				pool.query('SELECT value \
							FROM answer,user_quest,\"user\" \
							WHERE nickname = \'Mishanya\' \
							AND \"user\".user_id = user_quest.user_id \
							AND user_quest.current_puzzle_id = answer.puzzle_id',(err,answers) => {
					chai.request(url)
				  		.post('/check_code/')
				  		.type('form')
				  		.set('Cookie','nickname=Mishanya;password='+pass.rows[0].password)
				  		.send({
				  			'code': answers.rows[0].value
				  		})
				  		.end((err,res) => {
				  			res.should.have.status(200);
				  			expect(res).to.redirectTo(url+'/puzzle');

							pool.query('SELECT answer_id \
				  						FROM \"user\", user_answer \
				  						WHERE nickname=\'Mishanya\' \
				  						AND user_answer.user_id = \"user\".user_id',(err,dbres) => {
				  				dbres.rows.length.should.not.equal(0);
				  				done();
				  			})
				  		})
			  	});
			});
		});
	});

	describe('Statistics page', () => {
		it('should load with status 200', (done) => {
			chai.request(url)
		  		.get('/statistics')
		  		.end((err,res) => {
		  			res.should.have.status(200);
		  			done();
		  		})
		});
	});

	after('clearing db...', () => {
		pool.query('DELETE FROM \"user\" WHERE nickname = \'Mishanya\'');	
	});
})

