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

// 리스트 전체 보기 GET
router.get('/', function(req,res,next){
  console.log('=====전체리스트===== '+ (new Date()).toLocaleString());
    pool.getConnection(function (err, connection){
        var sqlForSelectList = "SELECT idx, title, hit FROM board";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('list', {title: ' 게시판 전체 글 조회', rows: rows});
            connection.release();
        });
    });
});

// 글쓰기 화면 표시 GET
router.get('/write', function(req,res,next){
  console.log('=====글쓰기화면표시===== '+ (new Date()).toLocaleString());
    res.render('write.ejs',{title : "게시판 글 쓰기"});
});

// 글쓰기 로직 처리 POST
router.post('/write', function(req,res,next){
  console.log('=====글쓰기===== '+ (new Date()).toLocaleString());
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var contentPw = req.body.contentPw;
    var datas = [creator_id,title,content,contentPw];

    pool.getConnection(function (err, connection){
        var sqlForInsertBoard = "insert into board(creator_id, title, content, contentPw, regdate, modidate) values(?,?,?,?, now(), now())";
        connection.query(sqlForInsertBoard,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/community');
            connection.release();
        });
    });
});

//디테일검색
router.get("/detailSearch", function(req,res){
    console.log('=====디테일 글정보===== '+ (new Date()).toLocaleString());
    pool.getConnection(function(error, connection){
          var idx = req.query.idx;
          console.log("idx[%s] ", idx);
      
      let query1 = "UPDATE board SET hit = hit + 1 WHERE idx='"+idx+"'";
      connection.query(query1, function(err, result){
        if(err){
          console.log('database err : ', err);
        }else{
            if(err){
                console.log('database err2: ', err);
            }else{     
                let query2 = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, hit from board where idx='"+idx+"'";
                connection.query(query2, function(err, result){
                    connection.release();

                    res.locals.result = result;
                    console.log(result);
                    
                    res.render('listDetail');
                });
            }
        }
      });
    });
});

//글 조회 로직 처리
router.get('/read/:idx',function(req,res,next)
{
    var idx = req.params.idx;
    pool.getConnection(function(err,connection)
    {
        var sql = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate from board where idx=?";
        connection.query(sql,[idx], function(err,row)
        {
            if(err) console.error(err);
            console.log("1개 글 조회 결과 확인 : ",row);
            res.render('read', {title:"글 조회", row:row[0]});
            connection.release();
        });
    });
});

//수정버튼 클릭
router.get('/update',function(req,res,next)
{
  console.log('=====수정버튼 클릭===== '+ (new Date()).toLocaleString());
    var idx = req.query.idx;
    console.log("idx[%s]:", idx);

    pool.getConnection(function(err,connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate from board where idx=?";
        connection.query(sql, [idx], function(err,rows)
        {
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ",rows);
            res.render('update', {title:"글 수정", row:rows[0]});
            connection.release();
        });
    });

});

//커뮤니티 글 업데이트
router.post('/update',function(req,res,next){
    var idx = req.body.idx;
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var contentPw = req.body.contentPw;
    var datas = [creator_id,title,content,contentPw];

    pool.getConnection(function(err,connection)
    {
        var sql = "update board set creator_id=? , title=?,content=?, regdate=now(), modidate=now() where idx=? and contentPw=?";
        connection.query(sql,[creator_id,title,content,idx,contentPw],function(err,result)
        {
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
                res.redirect('/community/read/'+idx);
            }
            connection.release();
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
