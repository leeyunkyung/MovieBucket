module.exports.bindSimpleData = bindSimpleData;
module.exports.isNotEmptyObj = isNotEmptyObj;

const pool = require('../config/db_pool.js');
/*
 내용 치환함수
 예) 내용중 <%=stdno%>가 있는 경우, 객체내 stdno값으로 치환
*/
function bindSimpleData(src, obj) {
    var result = src;
    var keys = Object.keys(obj);
    keys.forEach(function (key, idx){
        result = result.replace(new RegExp('<%='+key+'%>', 'g'), obj[key]);
    });
    return result;
};

/*
객체 배열에서 객체의 키값과 일치하는 데이터 반환하는 함수
*/
function getItem(arr, key, val) {
    var result = {};
    pool.getConnection(function(error, connection){
      connection.query('select * from user where '+key+'="'+val+'"', function(err, res){
        connection.release();
        if(err){
          console.log('database err:', err);
        }else{
          return res[0];
        }
      });
    });
};

/*
빈 객체인지 체크(빈객체:false, 객체내용있음:true)하는 함수
*/
function isNotEmptyObj(obj) {
    return !(Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({}));
};
