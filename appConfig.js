
var baseUrl = 'https://itlao5.com';
//var picCodeUrl = baseUrl + "/getPicCode"; // 实时生成图形验证码，使用时可以带上r=随机数，以便页面image控件刷新，这里作为示例写死一张
var picCodeUrl = baseUrl + "/wp/wp-content/uploads/2019/05/piccode.jpg";


//app全局配置，状态缓存管理
var AppConfig = {
  baseUrl: baseUrl,
  picCodeUrl: picCodeUrl,

  getState: function (key) {
    var state = wx.getStorageSync("wx_appState") || {};
    return state[key] || null;
  },
  setState: function (key, value) {
    var state = wx.getStorageSync("wx_appState") || {};
    state[key] = value;
    wx.setStorage({
      key: 'wx_appState',
      data: state
    })
  },
  clearState: function () {
    wx.removeStorageSync("wx_appState");
  }
};

module.exports = AppConfig;