var express = require('express');
var app = new express();
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var url = require('url');
var session = require('express-session');
var router = express.Router();

var items = [];
const pool = require('../config/db_pool.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection(function (err, connection) {
      // Use the connection
      connection.query('SELECT * FROM board', function (err, rows) {
          if (err) console.error("err : " + err);
          console.log("rows : " + JSON.stringify(rows));

          res.render('index', {title: 'test', rows: rows});
          connection.release();
      });
  });
});

module.exports = router;
