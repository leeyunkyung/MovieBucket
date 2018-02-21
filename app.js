var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('promise-mysql');

//const pool = require('./config/db_pool.js');
//const aws = require('aws-sdk');
//aws.config.loadFromPath('./config/aws_config.json');

var index = require('./routes/index');
var users = require('./routes/users');
var mypage = require('./routes/mypage');
var movie = require('./routes/movie');
var community = require('./routes/community');

var app = express();
app.use(bodyParser.json());
// app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('config', express.static(path.join(__dirname, 'config')));

app.use(session({
  secret: 'seceret key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 5 * 1000
  }
}));

app.use('/', index);
app.use('/users', users);
app.use('/mypage', mypage);
app.use('/movie', movie);
app.use('/community', community);

/**********************카카오톡******************************/
app.get('/keyboard', (req, res) => {
  const menu = {
      type: 'buttons',
      buttons: ["강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"]
  };
  res.set({
      'content-type': 'application/json'
  }).send(JSON.stringify(menu));
});

//카톡 메시지 처리
app.post('/message',function (req, res) {
      const _obj = {
          user_key: req.body.user_key,
          type: req.body.type,
          content: req.body.content
      };
  
      console.log(_obj.content)
  
      if(_obj.content == '강철비'){
        let massage = {
            "message": {
                "text": '주연은 정우성이고, 평점은 8.2야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
  
        //카톡으로 전송
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '스타워즈')
      {
        let massage = {
            "message": {
                "text": '주연은 데일리 리즐리고, 평점은 7.9야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '꾼')
      {
        let massage = {
            "message": {
                "text": '주연은 현빈이고, 평점은 7.8이야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '기억의 밤'){
        let massage = {
            "message": {
                "text": '주연은 강하늘이고, 평점은 8.3야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
  
        //      카톡으로 전송
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '라라랜드')
      {
        let massage = {
            "message": {
                "text": '주연은 엠마 스톤이고, 평점은 8.6야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '메리와 마녀의 꽃')
      {
        let massage = {
            "message": {
                "text": '주연은 스기사키 하나이고, 평점은 7.6이야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '뽀로로'){
        let massage = {
            "message": {
                "text": '주연은 이선이고, 평점은 9.2야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
  
        //      카톡으로 전송
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '튤립 피버')
      {
        let massage = {
            "message": {
                "text": '주연은 알리시아 비칸데르이고, 평점은 7.8야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      else if(_obj.content == '오리엔트 특급 살인')
      {
        let massage = {
            "message": {
                "text": '주연은 페넬로페 크루즈이고, 평점은 8.1이야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }

      else if(_obj.content == '세 번째 살인')
      {
        let massage = {
            "message": {
                "text": '주연은 후쿠야마 마사하루이고, 평점은 8.7이야'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                  "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                ]
            }
        };
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
      //예외 처리...
      //하지만 현재는 버튼 방식이기에 이 루틴을 탈 수가 없다.
      else {
          let massage = {
              "message": {
                  "text": '못 알아 먹었다...'
              },
              "keyboard": {
                  "type": "buttons",
                  "buttons": [
                    "강철비", "스타워즈", "꾼","기억의밤", "라라랜드", "메리와 마녀의 꽃","뽀로로 극장판", "튤립 피버", "오리엔트 특급 살인","세 번째 살인"
                  ]
              }
          };
          res.set({
              'content-type': 'application/json'
          }).send(JSON.stringify(massage));
      }
  });

app.post('/friend', (req, res) => {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 쳇팅방에 참가했습니다.`);
    
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});

app.delete('/friend', (req, res) => {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 쳇팅방을 차단했습니다.`);
    
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});
/*********************************끝************************************/  


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
