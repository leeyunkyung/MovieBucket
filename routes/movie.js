var express = require('express');
const aws = require('aws-sdk');
var app = new express();
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var url = require('url');
var session = require('express-session');
var router = express.Router();

const pool = require('../config/db_pool.js');
aws.config.loadFromPath('./config/aws_config.json');

var items = [];
var myModule = require('../public/midTermModule');


//전체리스트 - 성공
router.get("/", function(req,res){
  console.log('====전체영화 리스트===== '+ (new Date()).toLocaleString());
  pool.getConnection(function(error, connection){
    connection.query('select movieId, title, actor, director from movie', function(err, result){
      connection.release();

      res.locals.result = result;
      if(err){
        console.log('database err : ', err);
      }else{
        res.render('totalMovie');
      }
    });
  });
});

//디테일검색 - 성공
router.get("/detailSearch", function(req,res){
    console.log('=====디테일 영화정보===== '+ (new Date()).toLocaleString());
    pool.getConnection(function(error, connection){
          var movieId = req.query.movieId;
          console.log("movieId[%s] ", movieId);
      //무비아이디를 가지고 검색결과의 상세정보 불러오기
      let query1 = 'select movieId, title, rating, pubDate, director, actor from movie where movieId="'+movieId+'"';
      connection.query(query1, function(err, result){
        connection.release();
        res.locals.result = result;
        console.log(result)
        if(err){
          console.log('database err : ', err);
        }else{
          res.render('searchDetail');
        }
      });
    });
});

//키워드검색 - 성공
 router.post("/search", function(req,res){
    console.log('=====키워드 검색===== '+ (new Date()).toLocaleString());
    pool.getConnection(function(error, connection){
          var keyword = req.body.title;
          console.log("keyword[%s] ", keyword);

      //제목, 주연, 감독
      let query1 = 'select movieId, title, actor, director from movie where title like "%'+keyword+'%"';
      connection.query(query1, function(err, result){
        connection.release();

        res.locals.result = result;
        console.log(result);
        if(err){
          console.log('database err : ', err);
        }else{
          res.render('searchInfo');
        }
      });
    });
});

// 파비콘 무시
router.get('/favicon.ico', function(req, response){
    response.sendStatus(204);
});
//공통 사항: 기타 화면
 app.use(function(req, res){
    console.log('=====기타 화면===== '+ (new Date()).toLocaleString());
    res.redirect('http://127.0.0.1:3000');
});
module.exports = router;
