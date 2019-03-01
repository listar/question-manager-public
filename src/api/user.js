import axios from 'axios';
import qs from 'qs';
import {baseUrl} from '../config/env';

const TIMEOUT = 5000;


export const loginApi = (param) => {
    return axios({
        method: 'post',
        url: baseUrl + '/login?t=1',
        timeout: TIMEOUT,
        data: qs.stringify(param),
    });
};



///user/localLogin
export const userlocalLoginApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/user/localLogin',
    timeout: TIMEOUT,
    data: qs.stringify(param),
  });
};



export const submitPaperApi = (param) => {
  return axios({
    method: 'post',
    url: baseUrl + '/submitPaper',
    timeout: TIMEOUT,
    data: qs.stringify(param),
  });
};


