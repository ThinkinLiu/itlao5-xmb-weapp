// pages/user/userInfo.js
var app = getApp();
var config = require("../../appConfig.js")
var util = require('../../utils/util.js')
var _countDownIntervalId = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: {
      userId: 0,
      name: "张三",
      birthday: "2012-12-12",
      phone: "13565656565 ",
      credNo: "521321201212125265",
      sex: 1,
      isDefault: 1
    },
    startDate: "1900-01-01",// 日期选择开始日期
    endDate: "2019-06-01",// 日期选择结束日期
    sexArray: ["男", "女"],
    phoneModal: {
      hidden: true,
      title: "修改手机号",
      placeHolder: "请输入手机号码",
      inputText: null,
      picCodePlaceHolder: "请输入图形码",
      picCodeInputText: null,
      picValidCodeUrl: config.baseUrl + '/VerificationCode/GenerateImage',
      captchaPlaceholder: "请输入验证码",
      captchaInputText: null,
      btnText: "发送验证码",
      currentTime: 60,
      btnDisabled: false
    },
    cardNoModal: {
      hidden: true,
      title: "修改证件号码",
      placeHolder: "请输入证件号码", 
      inputText: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
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

  sexPickerChange: function (e) {
    console.log(e);
    var sex = e.detail.value == 1? 2: 1;
    // updateUeserInfo({userSex: sex})
  },

  datePickerChange: function (e) {
    var birthday = e.detail.value;
    if (birthday > util.getDate()) {
      this.showToast('出生日期不正确');
      return;
    }
    // updateUeserInfo({userBirthday: birthday})
  },

  userSwitchChange: function (e) {
    console.log(e);
    var isDefault = e.detail.value ? 1 : 0;

    // updateUeserInfo({userIsDefault: isDefault})
  },

  /**
   * 解除绑定
   */
  unBindTap: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定解除绑定？',
      success: function (res) {
        if (res.confirm) {
          //点击确定
          that.unBind()
        } else {
          //点击取消,默认隐藏弹框
        }
      }
    })
  },
  // 非就诊人时，解除绑定
  unBind: function (e) {
   
    wx.showLoading({
      title: '正在解除绑定...'
    })
    // 网络请求
    // 成功后
    wx.hideLoading();
    app.globalData.isBindUser = false;
    wx.reLaunch({
      url: '../index/index'
    })
  },

  btnclick: function (e) {
    var modalHidden = this.data.modalHidden;
    console.log(modalHidden);
    this.setData({ modalHidden: !modalHidden });
  },
  // 点击证件号码，显示证件号码修改窗口
  cardNumTap: function (e) {
    this.setData({
      cardNoModal: {
        hidden: false,
        title: "修改证件号码",
        placeHolder: "请输入证件号码",
        inputText: null
      }
    })
  },
  // 证件号码窗口输入框值变化事件
  cardNoModalInput: function (e) {
    var modal = this.data.cardNoModal;
    modal.inputText = e.detail.value;
    this.setData({
      cardNoModal: modal
    })
  },
  // 证件号码窗口确认事件
  cardNoModalConfirm: function (e) {
    var that = this;
    var cardNo = that.data.cardNoModal.inputText;
    if (util.isBlankOrEmpty(cardNo)) {
      that.showToast("请输入证件号码");
      return;
    }
    if (cardNo == that.data.items.credNo) {
      that.showToast("修改成功");
      that.cardNoModalCancel();
      return;
    }

    // updateUeserInfo({userCardNo: cardNo})

    that.showToast("修改成功");
    // that.cardNoModalCancel();
  },
  // 证件号码窗口取消事件
  cardNoModalCancel: function (e) {
    var modal = this.data.cardNoModal;
    modal.hidden = true;
    this.setData({
      cardNoModal: modal
    })
  },

  // 点击手机号，显示手机号修改窗口
  phoneNumTap: function (e) {
    console.log(e)
    this.setData({
      phoneModal: {
        hidden: false,
        title: "修改手机号",
        placeHolder: "请输入手机号码",
        inputText: null,
        picCodePlaceHolder: "请输入图形码",
        picCodeInputText: null, 
        picValidCodeUrl: config.baseUrl + '/VerificationCode/GenerateImage?r=' + Math.random(),
        captchaPlaceholder: "请输入验证码",
        captchaInputText: null,
        btnText: "发送验证码",
        currentTime: 60,
        btnDisabled: false
      }
    })
  },
  // 手机号窗口输入框值变化事件
  phoneModalInput: function (e) {
    var modal = this.data.phoneModal;
    modal.inputText = e.detail.value;
    this.setData({
      phoneModal: modal
    })
  },
  // 手机号窗口 图形验证码输入框值变化事件
  picCodeModalInput: function (e) {
    var modal = this.data.phoneModal;
    modal.picCodeInputText = e.detail.value;
    this.setData({
      phoneModal: modal
    })
  },
  // 手机号窗口 短信验证码输入框值变化事件
  captchaModalInput: function (e) {
    var modal = this.data.phoneModal;
    modal.captchaInputText = e.detail.value;
    this.setData({
      phoneModal: modal
    })
  },
  // 手机号窗口确认事件
  phoneModalConfirm: function (e) {
    var that = this;
    var phone = that.data.phoneModal.inputText;
    if (!util.isTelephone(phone)) {
      that.showToast("请输入正确的手机号");
      return;
    }
    var captcha = that.data.phoneModal.captchaInputText;
    if (util.isBlankOrEmpty(captcha)) {
      that.showToast("请输入验证码");
      return;
    }


    // updateUeserInfo({userMobile: phone})

    that.showToast("修改成功");
    // that.phoneModalCancel();
  },
  // 手机号窗口取消事件
  phoneModalCancel: function (e) {
    var modal = this.data.phoneModal;
    modal.hidden = true;
    this.setData({
      phoneModal: modal
    })
  },
  // 发送验证码
  phoneModalBtnTap: function (e) {
    var that = this;
    var phone = that.data.phoneModal.inputText;
    if (!util.isTelephone(phone)) {
      that.showToast("请输入正确的手机号");
      return;
    }
    var picCode = that.data.phoneModal.picCodeInputText;
    if (util.isBlankOrEmpty(picCode)) {
      that.showToast("请输入图形验证码");
      return;
    }
    that.sendCaptcha(phone, picCode);
  },
  sendCaptcha: function (phone, picCode) {
    var that = this;
    var currentTime = that.data.phoneModal.currentTime;
    that.startCountDown(currentTime);
    loginHelper.sendSmsCode(phone, picCode, {
      success(res) {
        wx.showToast({
          title: '发送成功',
        })
      },
      fail(code, res) {
        that.refreshPicValidCode();
        if (code > 0) {
          if (res.data && res.data.ErrorCode && res.data.ErrorCode > 0) {
            that.showToast(res.data.ErrorMsg);
          } else {
            that.showToast('获取失败，请稍后重试');
          }
        } else {
          that.showToast('网络请求失败，请稍后重试');
        }
        that.stopCountDown();
      }
    }) 
  },
  // 手机号修改窗口 验证码图片点击事件
  tapPicValidCode: function (e) {
    this.refreshPicValidCode();
  },
  refreshPicValidCode: function () {
    var modal = this.data.phoneModal;
    modal.picValidCodeUrl = config.baseUrl + '/VerificationCode/GenerateImage?r=' + Math.random();
    this.setData({
      phoneModal: modal
    });
  },
  setCaptcha: function (captchaTime) {
    if (captchaTime > 0) {
      this.setData({ captchaBtnText: "发送验证码", captchaIsEnable: true });
    } else {
      this.setData({ captchaBtnText: "发送验证码", captchaIsEnable: true });
      clearInterval(this.data.captchaIntervalId);
    }
  },
  stopCountDown: function () {
    var that = this;
    if (_countDownIntervalId >= 0) {
      clearInterval(_countDownIntervalId);
      _countDownIntervalId = -1;
    }

    var modal = that.data.phoneModal;
    modal.btnText = "发送验证码";
    modal.currentTime = 60;
    modal.btnDisabled = false;
    that.setData({
      phoneModal: modal
    })
  },
  startCountDown: function (currentTime) {
    var that = this;
    that.stopCountDown();
    var modal = that.data.phoneModal;
    modal.btnText = currentTime + 's后重发';
    modal.btnDisabled = true;
    that.setData({
      phoneModal: modal
    })
    _countDownIntervalId = setInterval(function () {
      if (_countDownIntervalId >= 0) {
        var modal = that.data.phoneModal;
        modal.btnText = (--currentTime) + 's后重发';
        modal.btnDisabled = true;
        that.setData({
          phoneModal: modal
        })
        if (currentTime <= 0) {
          that.stopCountDown();
        }
      }
    }, 1000)
  },
  
  /**
   * 提示
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
    })
  }

})