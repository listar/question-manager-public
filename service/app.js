var config = require('./config');
var http_server = require('./api');
var mysqlCon = require('./utils/mysqlController');

//init mysql
mysqlCon.init(config.mysqlConfig);

// web
let webConfig = config.webServerConfig;
http_server.start(webConfig[0]);


