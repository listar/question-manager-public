
const WEBHOST = '127.0.0.1';
const VERSION = '1.0.0.1';


class ConfigArr {
    constructor() {

    }
    //mysql config
    mysqlConfig(){
        return {
            HOST: '127.0.0.1',// '47.104.199.124',
            USER: 'root',
            PSWD: 'li123456',
            DB: 'question',
            PORT: 3306
        }
    }

    //http  server
    webServerConfig(){
        return [
            {
                WEB_PORT: 10080,
                WEB_IP: '127.0.0.1',
                VERSION: VERSION,
            },
            {
                WEB_PORT: 10081,
                WEB_IP: '127.0.0.1',
                VERSION: VERSION,
            },
        ]
    }

    //ws server
    websocketConfig(){
        return {

        }
    }
}

let configObj = new ConfigArr();

module.exports = {
    mysqlConfig: configObj.mysqlConfig(),
    webServerConfig: configObj.webServerConfig(),
    websocketConfig: configObj.websocketConfig(),
}

