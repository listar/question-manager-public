
import user from './modules/user'
import paper from './modules/paper'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

var UA = window.navigator.userAgent;
var OS = {
  ios: UA.match(/iphone|ipad|ipod/i),
  ipad: UA.match(/ipad/i),
  iphone: UA.match(/iphone/i),
  android: UA.match(/android/i),
  webkit: UA.match(/webkit/i),
  ie: UA.match(/MSIE/i),
  wechat: UA.match(/micromessenger/i),
  paperApp: UA.match(/papermessenger/i)
};

const state = {
  os:OS,
  token: '',
  userInfo: {}, //用户信息
  isLogin: false,//是否登录
  userSendAnswerData: {}, // 用户提交的答案
}




let _vuex = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  // modules: {
  //   user,
  //   paper
  // },
  strict: debug,
})

export default _vuex;