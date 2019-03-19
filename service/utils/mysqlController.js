var mysql = require('mysql');
var crypto = require('./crypto')
var vsprintf = require('sprintf-js').vsprintf
var pool = null;
var common = require('./common');


function init(config) {
    if(pool)return;
    pool = mysql.createPool({
        host: config.HOST,
        user: config.USER,
        password: config.PSWD,
        database: config.DB,
        port: config.PORT,
    });
}

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

/**
 * 指定查询
 * @param sql
 * @param fields
 * @returns {string}
 */
function selectFields(sql, fields) {
    if(typeof fields == 'string'){
      return sql.replace("*", fields);
    }else if(typeof fields == "object"){
       return sql.replace("*", fields.join(","));
    }
}

/**
 * 数组查询
 * @param sql
 * @param whereData
 * @returns {string}
 */
function whereData(sql, whereData) {
  if(Object.keys(whereData).length){
    let _whereData = [];
    for(let _key in whereData){
      if(['token'].indexOf(_key) > -1){
        continue;
      }
      _whereData.push("`"+_key+"` = "+mysql.escape(whereData[_key])+" " );
    }
    if(!_whereData.length){
      return sql;
    }
    return sql + " where " + _whereData.join(" and ");
  }
  return sql;
}


function login(param, callback) {
    let sql = 'select * from q_user where userName=%s and userPw = %s and status = 1 ';
  if(typeof param.fields != "undefined"){
    sql = selectFields(sql, param.fields);
    delete param.fields;
  }
    sql = vsprintf(sql, [mysql.escape(param.userName), mysql.escape(param.userPw)]);
    console.log('sql:' + sql);
    query(sql, (err, queryData, fields) => {
        if(err){
            throw err;
        }
        callback(queryData);
    });
}

/**
 * 查询用户表
 * @param param
 * @param callback
 */
exports.selectUser = (param, callback) => {
  let sql = "SELECT * FROM `question`.`q_user` ";
  if(typeof param.fields != "undefined"){
    sql = selectFields(sql, param.fields);
    delete param.fields;
  }
  sql = whereData(sql, param);
  console.log('selectUser_sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback([]);
      throw err;
    }
    callback(queryData);
  });
}

/**
 *
 * insert
 * queryData = {
fieldCount: 0,
affectedRows: 1,
insertId: 4,
serverStatus: 2,
warningCount: 0,
message: "",
protocol41: true,
changedRows: 0
}
 * @param param
 * @param callback
 */
function testinsert(param, callback) {
    // let sql = "INSERT INTO `question`.`q_user`(`userName`, `userPw`, `headimg`, `status`, `time`) VALUES ( 'xiaoming', '123', NULL, 1, 1000);"
    let sql = "update `question`.`q_user` set time=1 where id =1";
    query(sql, (err, queryData, fields) => {
        if(err){
            throw err;
        }
        callback(queryData);
    });
}

/**
 * 添加问题
 * @param param  object
 * @param callback fun
 */
exports.insertQuestion = function (param, callback) {
    let nowTime = parseInt(new Date().getTime()/ 1000);
    let sql = 'INSERT INTO `question`.`q_question`(`qqaId`, `qcId`, `qcName`, `title`, `content`,  `score`, `status`, `isBida`, `tips`, `answerAnalysis`, `time`) VALUES ';
    let insertData = [];
    param.questionList.map((item, i) => {
        insertData.push([vsprintf('(%s, %s, "%s", %s, %s, "%s", %s, "%s", %s, %s, %s)', [param.id, item.qcId, item.qcName, mysql.escape(item.title), mysql.escape(JSON.stringify(item.answerJson)), item.score, item.status, item.isBida, mysql.escape(item.tips), mysql.escape(item.answerAnalysis), nowTime])]);
    });
    sql = sql+ insertData.join(",");
    console.log('sql:' + sql);
    query(sql, (err, queryData, fields) => {
        if(err){
            throw err;
        }
        // console.log(queryData);
        callback(queryData.affectedRows > 0);
    });
}


/**
 * 添加试卷
 * @param param
 * @param callback
 */
exports.addPaper = function(param, callback) {
  let sql = "INSERT INTO  `question`.`q_question_attr` (%s) VALUES (%s);";
  let setData = [];
  let valuesData = [];
  for(let item in param){
    setData.push("`"+item+"` ");
    valuesData.push(mysql.escape(param[item]));
  }
  sql = vsprintf(sql, [setData.join(","), valuesData.join(",")]);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback(false);
      throw err;
    }
    callback(queryData.insertId);
  });
}

/**
 * 删除问题
 * @param param
 * @param callback
 */
exports.deleteQuestion = function (param, callback) {
    let sql = "delete from `q_question` where qqaId = %s";
    sql = vsprintf(sql, [mysql.escape(param)]);
    console.log('sql:' + sql);
    query(sql, (err, queryData, fields) => {
        if(err){
            throw err;
        }
        callback(queryData.affectedRows > 0);
    });
}

/**
 * 修改试卷
 * @param param
 * @param callback
 */
exports.editPaper = function(param, callback) {
    let nowTime = parseInt(new Date().getTime()/ 1000);
    let sql = "UPDATE `question`.`q_question_attr` SET %s WHERE `id` = %s;";
    let setData = ["`time` = "+ nowTime];
    for(let item in param){
        setData.push("`"+item+"` = "+mysql.escape(param[item])+"");
    }
    // Object.keys(param).map((item, i) => {
    //    setData.push("`"+i+"` = '"+item+"'");
    // });
    sql = vsprintf(sql, [setData.join(","), param.id]);
    console.log('sql:' + sql);
    query(sql, (err, queryData, fields) => {
        if(err){
            callback(false);
            throw err;
        }
        callback(queryData.affectedRows > 0);
    });
}

//问卷列表
function listPaper(param, callback) {
    let _pageNum = 10;
    if(typeof param.pageNum != "undefined"){
        _pageNum = param.pageNum;
    }
    let sql = "SELECT * FROM `question`.`q_question_attr` where isDel = 0 and addUserId = %s order by id desc LIMIT  %s,%s";
    sql = vsprintf(sql, [param.addUserId, (param.pageIndex - 1) * _pageNum, _pageNum]);
    console.log('sql:' + sql);
    query(sql, (err, queryData, fields) => {
        if(err){
            throw err;
        }
        callback(queryData);
    });
}

/**
 * 试卷总数
 */
function paperTotal(param, callback) {
    //总数据
    let totalSql = "SELECT count(*) as total FROM `question`.`q_question_attr` where isDel = 0";
    console.log('sql:' + totalSql);
    query(totalSql, (err, queryData, fields) => {
        if(err){
            throw err;
        }
        callback(queryData[0]);
    });
}

//问卷详情   todo  需改
exports.infoPaper = (param, callback)  => {
    if(typeof param != "object" || Object.keys(param).length <1){
        callback('参数错误！');
        return;
    }
    let resultData = {};
    let sql = "SELECT * FROM `question`.`q_question_attr`";
    sql = whereData(sql, param);
    console.log('infoPaper_sql:' + sql);

    new Promise(function(resolve, reject) {
        query(sql, (err, queryData, fields) => {
            if(err){
              callback(false);
                throw err;
            }
            if (queryData[0]){
                resultData.paperAttr = queryData[0];
                resolve(queryData[0].id);
            } else {
              callback(false);
              reject(err);
            }
        });
    }).then((qqaId) => {
        let sql1 = "SELECT * FROM `question`.`q_question` where qqaId = "+ qqaId;
        console.log('sql:' + sql1);
        query(sql1, (err, queryData, fields) => {
            if(err){
              callback(false);
                throw err;
            }
            resultData.questionList = queryData;
            callback(resultData);
        });
    });
}


/**
 * 试卷的属性
 * @param param
 * @param callback
 */
exports.questionAttrInfo = (param, callback) => {
  let sql = "SELECT * FROM `question`.`q_question_attr` ";
  // console.log('debug:', sql, param);
  if(typeof param.fields != "undefined"){
    sql = selectFields(sql, param.fields);
    delete param.fields;
  }
  sql = whereData(sql, param);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback({});
      throw err;
    }
    callback(queryData[0]);
  });
}


/**
 * 问题列表
 * @param param
 * @param callback
 */
exports.questionData = (param, callback) => {
  let sql = "SELECT * FROM `question`.`q_question` ";
  if(typeof param.fields != "undefined"){
      sql = selectFields(sql, param.fields);
      delete param.fields;
  }
  sql = whereData(sql, param);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback([]);
      throw err;
    }
    callback(queryData);
  });
}


/**
 *
 * @param param
 * @param callback
 */
exports.userAnswerInfo = (param, callback) => {
  let sql = "SELECT * FROM `question`.`q_user_answer` ";
  if(typeof param.fields != "undefined"){
    sql = selectFields(sql, param.fields);
    delete param.fields;
  }
  sql = whereData(sql, param);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback([]);
      throw err;
    }
    callback(queryData);
  });
}

/**
 * 用户回答试卷列表
 * @param param
 * @param callback
 */
exports.userAnswerList = (param, callback) => {
  let _pageNum = 10;
  if(typeof param.pageNum != "undefined"){
    _pageNum = param.pageNum;
  }
  _pageNum = parseInt(_pageNum);
  let sql = "SELECT * FROM `question`.`q_user_answer` order by id desc LIMIT  %s,%s";
  sql = vsprintf(sql, [(param.pageIndex - 1) * _pageNum, _pageNum]);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      throw err;
    }
    callback(queryData);
  });
}

/**
 * 回答总数
 * @param param
 * @param callback
 */
exports.userAnswerTotal = (param, callback) => {
  let sql = "SELECT count(1) as total FROM `question`.`q_user_answer` ";
  if(Object.keys(param).length){
      let whereData = [];
      for(let _key in param){
        if(['token'].indexOf(_key) > -1){
          continue;
        }
        whereData.push("`"+_key+"` = "+mysql.escape(param[_key])+" " );
      }
    if(whereData.length)sql += " where " + whereData.join(" and ");
  }
  console.log('userAnswerTotal_sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      throw err;
    }
    callback(queryData[0]);
  });
}

/**------------------------------------------------------------------------------------------------------------------------
 * 客户端接口
 * ------------------------------------------------------------------------------------------------------------------------
 */


/**
 * 用户提交试卷
 * @param param
 * @param callback
 */
exports.submitPaper = (param, callback) =>{
  let sql = "INSERT INTO `question`.`q_user_answer`(`uri`, `userId`, `userName`, `answerJson`, `ip`, `userScore`, `useTime`, `time`) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s);";
  sql = vsprintf(sql, [
    mysql.escape(param.uri),
    mysql.escape(param.userId),
    mysql.escape(param.userName),
    mysql.escape(param.answerJson),
    mysql.escape(param.ip),
    mysql.escape(param.userScore),
    mysql.escape(param.useTime),
    mysql.escape(param.time),
  ]);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
        callback(false);
      throw err;
    }
    callback(queryData.affectedRows > 0);
  });
}


/**
 * 字段计数器
 * @param param
 * @param callback
 */
exports.tableFieldsCount = (param, callback) => {
  let sql = "UPDATE %s SET %s";
  sql = vsprintf(sql, ["`"+param.table+"`", " `"+param.field+"` = `"+param.field+"` + 1"]);
  delete param.table;
  delete param.field;
  sql = whereData(sql, param);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback(false);
      throw err;
    }
    callback(queryData.affectedRows > 0);
  });
};

/**
 * 题目类型列表
 * @param param
 * @param callback
 */
exports.questionCategoryList = (param, callback) => {
  let sql = "SELECT * FROM `question`.`q_category` ";
  if(typeof param.fields != "undefined"){
    sql = selectFields(sql, param.fields);
    delete param.fields;
  }
  sql = whereData(sql, param);
  console.log('questionCategoryList_sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback([]);
      throw err;
    }
    callback(queryData);
  });
}

/**
 * 注册用户
 * @param param
 * @param callback
 */
exports.registerUser = (param, callback) =>{
  let sql = "INSERT INTO `question`.`q_user`(`userName`, `userPw`, `createTime` ) VALUES ( %s, %s, %s);";
  sql = vsprintf(sql, [
    mysql.escape(param.userName),
    mysql.escape(param.userPw),
    mysql.escape(param.createTime),
  ]);
  console.log('sql:' + sql);
  query(sql, (err, queryData, fields) => {
    if(err){
      callback(false);
      throw err;
    }
    callback(queryData.affectedRows > 0);
  });
}


module.exports = Object.assign({
    init,
    query,
    login,
    testinsert,
    listPaper,
    paperTotal
}, module.exports);
