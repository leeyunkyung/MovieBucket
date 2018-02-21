var express = require('express');
var aws = require('aws-sdk');
var app = new express();
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var url = require('url');
var session = require('express-session');
var router = express.Router();

var pool = require('../config/db_pool.js');
aws.config.loadFromPath('./config/aws_config.json');

var items = [];
// midTermModule.js 추출
var myModule = require('../public/midTermModule');



//장바구니
router.get('/',function(req,res){
  console.log('=====장바구니===== '+ (new Date()).toLocaleString());
    pool.getConnection(function(err,connection){
      sess = req.session;
      var userId = sess.userId;
      console.log("userId[%s]:",userId);

      if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

      var sql = 'select title, actor, director from mypage my, movie m where my.movieId=m.movieId and my.userId="'+userId+'"';
        connection.query(sql, function(err,result){
            res.locals.result = result;
            if(err) console.error(err);
            else{
              console.log("장바구니확인 : ",result);
              if(result == undefined || userId == NaN){
                res.render('main');
              }
              res.render('mypage');
            }
            connection.release();
        });
    });

});

//장바구니누르면 마이페이지에 저장
router.post("/bucket", function(req, res){ //ajax로 세션아이디를 가지고 오고, 프론트에서는 무브아이디만 가지고오기
    console.log('=====장바구니에 저장===== '+ (new Date()).toLocaleString());
    pool.getConnection(function(error, connection){
        var userId = req.session.userId;
        var movieId = req.body.movieId;

        var result = {code:"1"};
        console.log("userId[%s] movieId[%s]", userId, movieId);

      connection.query('select * from mypage where userId="'+userId+'" and movieId="'+movieId+'"', function(err, res1){
        if(err){
          console.log('database err:', err);
        }else{
          if (res1.length != 0) {
            console.log('item(중복-장바구니) : ', res1);
              result.code = "2";

              //res.locals.result = result;
              console.log(result);
              res.send(result);
          }
          else {
            console.log('a');
              connection.query('insert into mypage set ?', {userId: userId, movieId: movieId}, function(err, res2){
                connection.release();
                if(err){
                  console.log('bucket2 err');
                }else{
                  console.log('bucket==>%j', {userId: userId, movieId: movieId});
                  //응답 데이터
                  res.send(result);
                }
              });
          }
        }
      });
    });
});
//index에서 main으로 넘겨주기
router.get("/main", function(req,res){
    console.log('=====메인=====');
    var item = {};
    sess = req.session;
    //sess.userId = userId;
    item.sess = sess;

    console.log(item);
    res.render('main', item);
});

//로그인
router.post("/login", function(req,res){
    console.log('=====로그인===== '+ (new Date()).toLocaleString());
    pool.getConnection(function(error, connection){
      var userId = req.body.userId;
      var pwd = req.body.pwd;
      console.log("userId[%s] pwd[%s]", userId, pwd);

      var item = {};
      var resultCode = "0";

      // midTermModule내 getItem을 이용하여 데이터 조회
      var obj =  {};

      connection.query('select * from user where userId="'+ userId+'" and pwd="'+ pwd+'"', function(err, result){
        connection.release();
        if(err){
          console.log('database err:', err);
        }
        else{
          obj = result[0] || {};
          console.log(obj);
          if (myModule.isNotEmptyObj(obj) && pwd == obj.pwd ) {
            console.log("obj==>%j", obj);
            sess = req.session;

              var date = new Date();
              date.setDate(date.getSeconds() + 50); //50초후 쿠키 삭제
              //sess.now = (new Date()).toUTCString();
              sess.userId = userId;
              item.sess = sess;
              console.log(sess.userId);

              resultCode = "1";
              item.userId = sess.userId;
          }
          item.code = resultCode;

          console.log(item);
          res.send(JSON.stringify(item));
        }
      });
    });
});

//회원가입 -성공
router.post("/regist", function(req,res){
    console.log('=====회원가입===== '+ (new Date()).toLocaleString());
    var userId = req.body.registId;
    var pwd = req.body.Pwd;
    var name = req.body.UserName;
    var phone = req.body.Phone;
    console.log('userId[%s] name[%s] pwd[%s] phone[%s]', userId, name, pwd, phone);

    var result = {code:"1"};

    pool.getConnection(function(error, connection){
      connection.query('select * from user where userId="'+userId+'"', function(err, res1){

        if(err){
          console.log('database err:', err);
        }else{
          console.log('item(중복데이터) : ', res1);
          if (res1.length = 0) {
              result.code = "2";
              res.send(result);
          }
          else {
              // 입력된 데이터 items에 추가
              //var dt = (new Date()).toLocaleString();
              connection.query('insert into user set ?', {userId: userId, name: name, pwd: pwd, phone: phone}, function(err, res2){
                connection.release();
                if(err){
                  console.log('regist err');
                }else{
                  console.log('item==>%j', {userId: userId,  name: name, pwd: pwd, phone: phone});
                  //응답 데이터
                  res.send(result);
                }
              });
          }
        }
      });
    });
});

//로그아웃
router.get("/logout", function(req,res){
    console.log('=====로그아웃===== '+ (new Date()).toLocaleString());
    // 쿠키 지움
    if(req.session.userId){
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }else{
                // 메인화면으로 redirect
                res.redirect('http://127.0.0.1:3000');
            }
        });
    }else{
        // 메인화면으로 redirect
        res.redirect('http://127.0.0.1:3000');
    }
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
