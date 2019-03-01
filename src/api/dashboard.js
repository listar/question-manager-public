import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../config/env';


/**
 * 提交的试卷答案列表
 * @param param
 * @returns {AxiosPromise}
 */
export const userAnswerListApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/user/answerList',
    timeout:5000,
    data: qs.stringify(param),
  });
};

/**
 * 提交的试卷总数
 * @param param
 * @returns {AxiosPromise}
 */
export const userAnswerTotalApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/user/answerTotal',
    timeout:5000,
    data: qs.stringify(param),
  });
};