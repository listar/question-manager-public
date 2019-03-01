import {
  loginApi
} from '../api/user'
import {
	GET_WXCONFIG,
	LOGIN_ACCOUNT
} from './mutation-types.js'


export default {

  async getUserInfo({commit, state}, paramObj){
    commit(LOGIN_ACCOUNT, await loginApi(paramObj).then(res => {
      "use strict";
      console.log("getUserInfo",res.data.data);
      return res.data.data;
    }))
  },

}