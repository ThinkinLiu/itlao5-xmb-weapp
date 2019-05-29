// pages/user/bindUser.js
var util = require('../../utils/util.js')
var appConfig = require('../../appConfig.js')
var app = getApp()
var _countDownIntervalId = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardNoArray: ['大陆', '港澳台'],
    cardNoArrayIndex: 0,
    telephoneNum: '',
    currentTime: 60,
    time: '获取验证码',
    disabled: false,
    picValidCodeUrl: appConfig.picCodeUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.stopCountDown();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cardNoArrayIndex: e.detail.value
    })
  },
  teleInput: function (e) {
    this.setData({
      telephoneNum: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  cardInput: function (e) {
    this.setData({
      cardNum: e.detail.value
    })
  },
  picValidCodeInput: function (e) {
    this.setData({
      picValidCode: e.detail.value
    })
  },
  vertifyCodeInput: function (e) {
    this.setData({
      vertifyCode: e.detail.value
    })
  },
  /**
   * 用户绑定（确定）按钮点击事件
   */
  sureTap: function (e) {
    var that = this;
    if (!this.dataVertify()) {
      // 数据有效性验证
      return;
    }
    wx.showLoading({
      title: '请稍候...',
    })
    var name = this.data.userName;
    var credNo = this.data.cardNum;
    var smsCode = this.data.vertifyCode;
    var mobile = this.data.telephoneNum;
    // 登录
    app.globalData.isBindUser = true;
    wx.redirectTo({
      url: 'userInfo',
    })
  },
  /**
   * 绑定提交数据校验
   */
  dataVertify: function() {
    var name = this.data.userName;
    var credNo = this.data.cardNum;
    var smsCode = this.data.vertifyCode;
    var mobile = this.data.telephoneNum;
    if (util.isBlankOrEmpty(name)) {
      this.showToast('请输入姓名...');
      return false;
    }
    var index = this.data.cardNoArrayIndex;
    if (util.isBlankOrEmpty(credNo) || (index == 0 && !util.isCardNum(credNo))) {
      this.showToast('请输入正确的身份证号...');
      return false;
    }
    if (util.isBlankOrEmpty(smsCode)) {
      this.showToast('请输入验证码...');
      return false;
    }
    if (!util.isTelephone(mobile)) {
      this.showToast('请输入正确的手机号...');
      return false;
    }
    return true;
  },
  /**
   * 发送验证码bindTap事件
   */
  tapSendVertifyCode: function (e) {
    var that = this;
    if (util.isTelephone(that.data.telephoneNum)) {
      if (util.isBlankOrEmpty(that.data.picValidCode)) {
        this.showToast('请输入图形验证码...');
        return;
      }
      this.showToast('正在发送...');
      var currentTime = that.data.currentTime;
      that.startCountDown(currentTime);
      var phone = that.data.telephoneNum;
      var picValidCode = that.data.picValidCode
      // 网络请求验证码

    } else {
      that.showToast('请输入正确的手机号');
    }
  },
  stopCountDown: function () {
    var that = this;
    if (_countDownIntervalId >= 0) {
      clearInterval(_countDownIntervalId);
      _countDownIntervalId = -1;
    }
    that.setData({
      time: '获取验证码',
      currentTime: 60,
      disabled: false
    })
  },
  startCountDown: function (currentTime) {
    var that = this;
    that.stopCountDown();
    that.setData({
      time: currentTime + 's后重发',
      disabled: true
    })
    _countDownIntervalId = setInterval(function () {
      if (_countDownIntervalId >= 0) {
        that.setData({
          time: (currentTime - 1) + 's后重发'
        })
        currentTime--;
        if (currentTime <= 0) {
          that.stopCountDown();
        }
      }
    }, 1000)
  },
  tapPicValidCode: function(e) {
    this.refreshPicValidCode();
  },
  refreshPicValidCode: function () {
    this.setData({
      picValidCodeUrl: appConfig.picCodeUrl + '?r=' + Math.random()
    })
  },

  /**
   * 校验通过
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
    })
  }
})