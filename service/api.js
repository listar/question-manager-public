var express = require('express');
var bodyParser = require('body-parser');

var crypto = require('./utils/crypto');
var mysqlCon = require('./utils/mysqlController');
var CryptoJS = require("crypto-js");
var env = require('./env');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));//这两个是和post请求有关系的
app.use(express.urlencoded({ extended: false }));//这个是和get又关系的
let config = null;

module.exports.start = function (cfg) {
    config = cfg;
    app.listen(config.WEB_PORT);
    console.log("web server is listening on " + config.WEB_PORT);
}


//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

function _httpSend(res, result, code = 0, msg = 'success'){
    let _webResult = {
        errcode: code,
        errmsg: msg,
        data: result
    };
    res.send(JSON.stringify(_webResult));
}

app.get('/get_version', function (req, res) {
    let ret = {
        version: config.VERSION,
    }
    console.log('/get_version', req.query, ret);
    res.send(JSON.stringify(ret));
});

//测试
app.get('/testinsert', (param, res) => {
    mysqlCon.testinsert([], (result) => {
        _httpSend(res, result);
    });
});

// 登录
app.post('/login', (param, res) => {
  //指定字段
  let selectData = param.body;
  selectData.fields = ['id', 'userName', 'headimg', 'lastTime'];

    mysqlCon.login(selectData, (result) => {
      if(!Object.keys(result).length){
        return _httpSend(res, '用户或者密码错误', 1000);
      }

      let _userInfo = result[0];
      // 加上token
      let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(_userInfo), env.ENCRYPTKEY).toString();
      _userInfo.token = ciphertext;
      console.log(_userInfo);
      return _httpSend(res, _userInfo);
    });
});

//完成编辑题目
app.post('/editQuestion', (param, res) => {
    let bodyData = param.body;
    if(typeof bodyData.id == "undefined"){
        return _httpSend(res, '发送数据有误！', 100);
    }
    //编辑
    if(bodyData.id > 0){
        //`title`, `description`, `startTime`, `endTime`, `contentNum`, `contentScore`, `view`, `isRandom`, `type`, `time`
        bodyData.questionList = JSON.parse(bodyData.questionList);
        let updateData = {
            id: bodyData.id,
            title: bodyData.title,
            description: bodyData.description,
            startTime: bodyData.startTime,
            endTime: bodyData.endTime,
            contentNum: bodyData.questionList.length,
            // contentScore: bodyData.contentScore,
            // view: bodyData.view,
            // isRandom: bodyData.isRandom,
            type: bodyData.type,
            time: parseInt(new Date().getTime()/ 1000)
        };
        mysqlCon.editPaper(updateData, (result) => {
            if(!result){
                _httpSend(res, '更新失败！', 1000);
                return;
            }


            //批量删除题目
            mysqlCon.deleteQuestion(updateData.id, (result) => {
                if(!result){
                    _httpSend(res, '更新失败！ 批量删除题目失败！', 1000);
                    return;
                }

                //批量添加
                mysqlCon.insertQuestion(bodyData, (result) => {
                    if(!result){
                        _httpSend(res, '更新失败！2', 1000);
                        return;
                    }

                    _httpSend(res, result);
                });
            });


        });

    }else {
        mysqlCon.addquestion( bodyData, (result) => {
            _httpSend(res, result);
        });
    }
});


/**
 * 删除试卷
 */
app.post('/deletePaper', (param, res) => {
    if(typeof param.body.id == "undefined"){
        _httpSend(res, '参数错误！', 100);
        return;
    }
    let _updateData = {
        id: param.body.id,
        isDel: 1
    };
    mysqlCon.editPaper(_updateData, (result) =>{
        if(!result){
            _httpSend(res, '删除失败！deletePaper', 1000);
            return;
        }
        _httpSend(res, result);
    });
});

/**
 * 发布试卷  对外开放
 */
app.post('/publishPaper', (param, res) => {
    if(typeof param.body.id == "undefined"){
        _httpSend(res, '参数错误！', 100);
        return;
    }
    let _updateData = {
        id: param.body.id,
        isPublish: 1
    };
    mysqlCon.editPaper(_updateData, (result) =>{
        if(!result){
            _httpSend(res, '发布失败！publishPaper', 1000);
            return;
        }
        _httpSend(res, result);
    });
});



//试卷列表
app.post('/listPaper', (param, res) => {
    mysqlCon.listPaper(param.body, (result) => {
        _httpSend(res, result);
    });
});

/**
 * 试卷总数
 */
app.post('/paperTotal', (param, res) => {
    mysqlCon.paperTotal(param.body, (result) => {
        _httpSend(res, result);
    });
});

/**
 * 试卷详情
 */
app.post('/infoPaper', (param, res) => {
    mysqlCon.infoPaper(param.body, (result) => {
        _httpSend(res, result);
    });
});


/**
 * 用户提交试卷
 */
app.post('/submitPaper', (param, res) => {
  let bodyData = param.body;
  if(typeof bodyData.userId == "undefined"){
    return _httpSend(res, '发送数据有误！', 100);
  }

  //todo 获取ip
  bodyData.ip = '';

  // 计算用户得分
  mysqlCon.questionAttrInfo({
    fields: ['id'],
    uri: bodyData.uri
  }, (result_qqa) => {

    //查出题目信息
    mysqlCon.questionData({
      qqaId: result_qqa.id
    }, (result) => {
      if(!result){
        _httpSend(res, '提交失败！_1', 1001);
        return;
      }

      bodyData.userScore = 0;
      let _userAnswerData = JSON.parse(bodyData.answerJson);
      result.map((item, i) => {
        //用户答案
        let _answerIndex = _userAnswerData["subject_"+item.id];
        if(typeof _answerIndex == "undefined"){
          return;
        }

        let contentJson = JSON.parse(item.content);
        switch (item.qcId){
          case 1:
            if(typeof contentJson[_answerIndex] == "undefined"){
              break;
            }
            if(typeof contentJson[_answerIndex]['isAnswer'] == "undefined"){
              break;
            }
            if(contentJson[_answerIndex]['isAnswer']){
              bodyData.userScore += item.score;
            }
            break;
          case 2:
            let _userAnswerStr = _answerIndex.sort().join("_");
            let _sysAnswer = [];
            contentJson.map( (cItem, cIndex) => {
              if(cItem.isAnswer){
                _sysAnswer.push(cIndex);
              }
            });

            if(_userAnswerStr == _sysAnswer.sort().join("_")){
              bodyData.userScore += item.score;
            }
            break;
          case 3:
            //todo
            break;
          default:
            break;
        }
      });

      //提交
      mysqlCon.submitPaper(bodyData, (result) => {
        if(!result){
          _httpSend(res, '提交失败！submitPaper', 1000);
          return;
        }
        _httpSend(res, result);
      });

    });


  });





});



// todo  客服端的加用户登录 再查
app.post('/user/answerInfo', (param, res) => {

  mysqlCon.userAnswerInfo(param.body, (result) => {
    _httpSend(res, result);
  });
});



/**
 * 提交试卷回答的列表
 */
app.post('/user/answerList', (param, res) => {
  mysqlCon.userAnswerList(param.body, (result) => {
    _httpSend(res, result);
  });
});

/**
 * 提交试卷的总数
 */
app.post('/user/answerTotal', (param, res) => {
  mysqlCon.userAnswerTotal(param.body, (result) => {
    _httpSend(res, result);
  });
});





/**------------------------------------------------------------------------------------------------------------------------
 * 客户端接口
 * ------------------------------------------------------------------------------------------------------------------------
 */



//tableFieldsCount

app.post('/addTableCount', (param, res) => {
  let userData = param.body;
  if (typeof userData.table == "undefined") {
    _httpSend(res, '参数错误！', 1001);
    return;
  }
  if (typeof userData.field == "undefined") {
    _httpSend(res, '参数错误！', 1002);
    return;
  }

  // 指定表 枚举
  if(['qqa'].indexOf(userData.table) < 0 ){
    _httpSend(res, 'error', 404);
    return;
  }

  let _tableName = '';
  switch (userData.table) {
    case 'qqa':
      _tableName = 'q_question_attr';
      if(userData.uri == undefined || userData.field != 'view'){
        _httpSend(res, '参数错误！', 1003);
        return;
      }
      userData.table = _tableName;
      break;
  }

  mysqlCon.tableFieldsCount(userData, (result) => {
    _httpSend(res, result);
  });
});

/**
 * token登录
 */
app.post('/user/localLogin', (param, res) => {
  let userData = param.body;
  if(typeof userData.token == "undefined"){
    _httpSend(res, '参数错误！', 1000);
    return;
  }
  // Decrypt
  let bytes  = CryptoJS.AES.decrypt(userData.token, env.ENCRYPTKEY);
  let userDataStr = '';
  try {
     userDataStr = bytes.toString(CryptoJS.enc.Utf8);
  }catch (e) {
    _httpSend(res, 'token 错误！', 1003);
    return;
  }
  let decryptedData = JSON.parse(userDataStr);
  if(typeof decryptedData.id == "undefined"){
    _httpSend(res, 'token 错误！', 1002);
    return;
  }

  _httpSend(res, decryptedData);
});
