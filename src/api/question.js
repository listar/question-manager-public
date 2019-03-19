import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../config/env';
const TIMEOUT = 5000;
import store from '@/store/'
import {CookieUtil} from '@/utils/common'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token =  encodeURIComponent(CookieUtil.get('TOKEN'));
  if(token == "null"){
    return config;
  }
  // 在发送请求之前做些什么
  if (config.method == 'post') {
    if (config.data.search('token=') == -1) config.data += '&token=' + token
    // return false
  } else if (config.method == 'get') {
    if (config.params.search('token=') == -1) config.params += '&token=' + token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

/**
 * 添加或者编辑 试卷
 * @param param
 * @returns {AxiosPromise}
 */
export const editQuestionApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/editQuestion?t=1',
        timeout:5000,
        data: qs.stringify(param), //{ arrayFormat: 'indices' }
    });
};


/**
 * 问卷列表
 * @param param
 * @returns {AxiosPromise}
 */
export const listPaperApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/listPaper',
        timeout:5000,
        data: qs.stringify(param),
    });
};

/**
 * 总数
 * @param param
 * @returns {AxiosPromise}
 */
export const paperTotalApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/paperTotal',
        timeout:5000,
        data: qs.stringify(param),
    });
};

/**
 * 问卷详情
 * @param param
 * @returns {AxiosPromise}
 */
export const infoPaperApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/infoPaper',
        timeout:5000,
        data: qs.stringify(param),
    });
};

/**
 * 删除试卷
 * @param param
 * @returns {AxiosPromise}
 */
export const deletePaperApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/deletePaper',
        timeout:5000,
        data: qs.stringify(param),
    });
};

/**
 * 发布试卷
 * @param param
 * @returns {AxiosPromise}
 */
export const publishPaperApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/publishPaper',
        timeout:5000,
        data: qs.stringify(param),
    });
};


/**
 * 计数器
 * @param param
 * @returns {AxiosPromise}
 */
export const addTableCountApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/addTableCount',
    timeout: TIMEOUT,
    data: qs.stringify(param),
  });
};


export const questionCategoryListApi = (param) =>{
    return axios({
      method: 'post',
      url: baseUrl + '/question/categoryList',
      timeout: TIMEOUT,
      data: qs.stringify(param)
    })
}




