/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

//接口域名
let baseUrl = 'http://127.0.0.1:10080';

//路由模式
let routerMode = 'history';

//cdnurl img
let imgBaseUrl = 'https://img.fphdcdn.com';

//headers
let headers = { 'Content-Type' : 'application/json; charset=utf-8'};



export {
    baseUrl,
    routerMode,
    headers,
    imgBaseUrl
}