// pages/index/mine.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menuitems: [
      { text: '信息完善', url: '', icon: '../../images/icon-user.png', tips: '', tap: 'bindTapUserInfo' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.wxUserInfo) {
      that.setUserInfo(app.globalData.wxUserInfo);
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.setUserInfo(res.userInfo);
        }
      })
    }
  },

  getUserInfo: function (e) {
    this.setUserInfo(e.detail.userInfo);
  },

  setUserInfo: function (userInfo) {
    console.log(userInfo)
    if (userInfo != null) {
      app.globalData.wxUserInfo = userInfo
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },
  
  //就诊人信息按钮点击事件
  bindTapUserInfo() {
    if (app.globalData.isBindUser) {
      // 如果已经绑定用户，则跳到用户信息
      wx.navigateTo({url: '../user/userInfo'})
    } else {
      // 未绑定，则跳到用户绑定
      wx.navigateTo({url: '../user/bindUser'})
    }
  }
})