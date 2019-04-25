import { Config } from './config.js';
class Token {
  //构造函数
  constructor(){
    this.verifyUrl = Config.resturl + '/token/verify';
    this.tokenUrl = Config.resturl + '/token/user'
  }
  //验证token
  verify() {
    var token = wx.getSystemInfoSync('token');
    if(!token) {
      this.getTokenFromServer()
    } else {
      this._verifyTokenFromServer(token)
    }
  }
  //从服务器验证token
  _verifyTokenFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method : "POST",
      data : {
        token :token
      },
      success : function (res) {
        var validate = res.data.isvalidate;
        if(!validate) {
          that.getTokenFromServer();
        }
      }
    })
  }
  //从服务器获取token
  getTokenFromServer(callback) {
    var that = this;
    wx.login({
      success : function (res) {
        wx.request({
          url: that.tokenUrl,
          method : "POST",
          data : {
            code : res.code
          },
          success : function (res) {
            console.log(res)
            wx.setStorageSync('token', res.data.token)

            callback && callback(res.data.token)
          }
        })
      }
    })
  }
}

export { Token };