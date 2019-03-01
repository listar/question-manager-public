export default {
  currentUser: state => {
    return {
      token: state.token,
      userInfo: state.userInfo,
      isLogin: state.isLogin
    }
  }
}