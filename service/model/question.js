var mysql = require('mysql');
var crypto = require('./crypto')
var vsprintf = require('sprintf-js').vsprintf
var pool = null;
var common = require('./common');


/**
 * 查询
 * @param sql
 * @param callback
 */
function query(sql, callback) {
  pool.getConnection( (err, con) => {
    if(err){
      throw err;
    }
    con.query(sql, (queryErr, queryValue, queryFields) => {
      //释放连接
      con.release();
      callback && callback(queryErr, queryValue, queryFields);
    })
  })
}