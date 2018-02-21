const mysql = require('promise-mysql');
const dbConfig = {
	host : 'rds-goodgid.c4hdhslyc6js.ap-northeast-2.rds.amazonaws.com',
	port : '3306',
	user : 'goodgid',
	password : '1q2w3e4r!',
	database : 'final',
	connectionLimit : 10
};

const dbpool = mysql.createPool(dbConfig);

module.exports = dbpool;