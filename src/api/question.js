import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../config/env';
const TIMEOUT = 5000;

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




