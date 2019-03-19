import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../config/env';
const TIMEOUT = 5000;


/**
 * 登录
 * @param param
 * @returns {AxiosPromise}
 */
export const loginApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/login?t=1',
        timeout: TIMEOUT,
        data: qs.stringify(param),
    });
};


/**
 * 解析本地 本地登录
 * @param param
 * @returns {AxiosPromise}
 */
export const userlocalLoginApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/user/localLogin',
    timeout: TIMEOUT,
    data: qs.stringify(param),
  });
};


/**
 * 提交试卷
 * @param param
 * @returns {AxiosPromise}
 */
export const submitPaperApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/submitPaper',
    timeout: TIMEOUT,
    data: qs.stringify(param),
  });
};


/**
 * 注册
 * @param param
 * @returns {AxiosPromise}
 */
export const registerUserApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/registerUser',
    timeout: TIMEOUT,
    data: qs.stringify(param),
  });
};


