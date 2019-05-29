var app = getApp();
var config = require('../appConfig.js')

/**
 * 用户绑定
 * pid: uid
 * mobile: 手机号
 * callback:
 *    当网络请求成功时: 1). 获取到数据，success回调，2). 未获取到数据，fail回调
 *    当网络请求失败时，error回调
 * 错误码： -1 微信登录失败，-2 网络请求失败 1 网络请求成功，但未返回正确数据 2 网络请求成功，但未返回正确数据，按照ErrorMsg显示错误
 */
function bindUser(uid, mobile, callback) {
  // 登录
  wx.login({
    success: res => {
      var wxCode = res.code;
      wx.request({
        url: config.baseUrl + '/bindWeChat',
        data: { 
          pid: pid, 
          mobile: mobile, 
          appCode: wxCode 
        },
        success: function (res) {
          if (res && res.data && res.data.ErrorCode == 0) {
            callback.success(res.data);
          } else if (res && res.data && res.data.ErrorCode>0) {
            callback.fail(2, res);
          } else {
            callback.fail(1, res);
          }
        },
        fail: function (res) {
          callback.fail(-2, res);
        }
      })
    },
    fail: function (res) {
      // 微信登录失败
      callback.fail(-1, res);
    }
  })
}

/**
 * 用户绑定
 * uid: 
 * mobile: 手机号
 * callback:
 *    当网络请求成功时: 1). 获取到数据，success回调，2). 未获取到数据，fail回调
 *    当网络请求失败时，error回调
 * 错误码： -1 微信登录失败，-2 网络请求失败 1 网络请求成功，但未返回正确数据 2 网络请求成功，但未返回正确数据，按照ErrorMsg显示错误
 */
function unbindUser(uid, callback) {
  // 登录
  wx.login({
    success: res => {
      var wxCode = res.code;
      wx.request({
        url: config.baseUrl + '/unbindUser',
        data: {
          pid: pid,
          appCode: wxCode
        },
        success: function (res) {
          if (res && res.data && res.data.ErrorCode == 0) {
            callback.success(res.data);
          } else if (res && res.data && res.data.ErrorCode>0) {
            callback.fail(2, res);
          } else {
            callback.fail(1, res);
          }
        },
        fail: function (res) {
          callback.fail(-2, res);
        }
      })
    },
    fail: function (res) {
      // 微信登录失败
      callback.fail(-1, res);
    }
  })
}

/**
 * 网络请求用户信息
 * callback:  
 *    当网络请求成功时: 1）. 获取到数据，success回调，2）. 未获取到数据，fail回调
 *    当网络请求失败时，error回调
 * 错误码： -1 微信登录失败，-2 网络请求失败 1 网络请求成功，但未返回正确数据
 */
function requestUserInfo(callback) {
  wx.login({
    success: res => {
      var wxCode = res.code;
      wx.request({
        url: config.baseUrl + '/getUserInfoByCode',
        data: { appCode: wxCode},
        success: function (res) {
          if (res && res.data && res.data.ErrorCode == 0 && res.data.ReturnData) {
            callback.success(res.data);
          } else {
            callback.fail(1, res);
          }
        },
        fail: function (res) {
          callback.fail(-2, res);
        }
      })
    },
    fail: function (res) {
      // 微信登录失败
      callback.fail(-1, res);
    }
  })
}

function sendSmsCode(phone, picCode, callback) {
  wx.request({
    url: config.baseUrl + '/sendSmsCode',
    data: {
      mobile: phone,
      picValidCode: picCode
    },
    success: function (res) {
      console.log('code:')
      console.log(res.data)
      if (res.data && res.data.ErrorCode == 0 && res.data.ReturnData) {
        var returnData = JSON.parse(res.data.ReturnData);
        if (returnData.ResultCode == 0) {
          callback.success(res.data);
        } else {
          callback.fail(1, res); 
        }
      } else {
        callback.fail(2, res);
      }
    },
    fail: function (res) {
      callback.fail(-1, res);
    }
  })
}

function isLogin() {
  if (app.globalData.isBindUser) {
    return true;
  } else {
    wx.showToast({
      title: '登录已失效，请重新登录',
    })
    wx.redirectTo({
      url: '../user/bindUser'
    })
    return false;
  }
}

module.exports = {
  requestUserInfo: requestUserInfo,
  bindUser: bindUser,
  unbindUser: unbindUser,
  isLogin: isLogin,
  sendSmsCode: sendSmsCode
}