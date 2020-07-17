// pages/imRobot/chat.js
var emoji = require('../../utils/emojiMap.js');
const util = require('../../utils/util.js');

//获取全局唯一的录音管理器
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
// 录音部分参数
const recordOptions = {
  duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
  sampleRate: 44100, // 采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 192000, // 编码码率
  format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
};

const app = getApp();


var _isPageLoad = false; // 页面是否加载
var _recorderStart = false; // 录音开始

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    inputBottom: 0,
    chatBoxH: 66, // 底部输入框高度，动态获取
    showInput: false, //无输入状态 
    extras: false, //附加功能
    phiz: false, //表情
    keyboard: true, //键盘
    voice: false, //录音
    sendOutVAL: true,
    extrasVAL: false,
    lastAudioPlayIndex: 0,
    scopeRecord: false, // 录音权限
    toView: 0,
    userImId: 'me', // 当前用户imId
    toUserImId: 'you', // 消息接收用户imId
    msgList: [{
      from: "me",
      time: 1511111122,
      type: "Text", // Text 文本和emoji表情，Image 图片，Audio 音频
      emojiTexts: "", // Text类型时 通过消息转换 为带emoji表情的文本
      text: "你好啊",
      // thumbnail: "" // 缩略图
      // imageUrl: "https://dwz.itlao5.com?id=ojubp", // 原图
      // audioUrl: "https://dwz.itlao5.com?id=ojubp", // 音频地址
      // audioSecond: 11, // 时长
      // audioIsPlaying: false, // 是否正在播放
      // audioIsReaded: false, // 是否已读
    },{
      from: "you",
      time: 1511111422,
      type: "Image", // Text 文本和emoji表情，Image 图片，Audio 音频
      thumbnail: "http://hbimg.huabanimg.com/251fcc506c8d1a8cd00a1e69d99fdd05d4a6c06f155a5-9uwXzK_fw658",
      imageUrl: "http://hbimg.huabanimg.com/251fcc506c8d1a8cd00a1e69d99fdd05d4a6c06f155a5-9uwXzK_fw658",
    },{
      from: "you",
      time: 1511111522,
      type: "Audio", // Text 文本和emoji表情，Image 图片，Audio 音频
      audioUrl: "https://cos.ap-shanghai.myqcloud.com/606f-shanghai-007-shared-02-1256635546/dace-1400323869/650c-DR151/DR151-UR7799-80896-tmp_13232687690136680.aac",
      audioSecond: 11, // 时长
      audioIsPlaying: false, // 是否正在播放
      audioIsReaded: false, // 是否已读
    }],
    emojiUrl: emoji.emojiUrl,
    emojiMap: emoji.emojiMap,
    emojiName: emoji.emojiName
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _recorderStart = false;
    _isPageLoad = true;
    this.data.msgList.forEach(msg => {
      this.transMsgEmojiStr(msg);
    })
    this.setData({
      msgList: this.data.msgList
    });
    this.recorderManagerEvent(this);
    this.queryRecord();
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
    _isPageLoad = false;
    if (this.data.scopeRecord && _recorderStart) {
      console.log("结束录音")
      _recorderStart = false;
      recorderManager.stop();
    }
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

  // 提示
  tip: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },

  // msg转emoji
  transMsgEmojiStr: function(msg) {
    if (msg.type == "Text") {
      msg.emojiTexts = emoji.transEmojiStr(msg.text);
    }
  },
  
  //点击图片进行预览
  previewImg: function(event) {
    var that = this;
    var src = event.target.dataset.img; //获取data-src
    var imgList = [event.target.dataset.img]; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //按住按钮
  touchStart: function(event) {
    var that = this;
    console.log("按住按钮")
    if (this.data.scopeRecord) {
      console.log("开始录音")
      _recorderStart = true;
      recorderManager.start(recordOptions);
    } else {
      this.requestRecord(function() {
        console.log("获取录音权限 授权成功.");
        that.setData({
          scopeRecord: true,
        })
      })
    }

  },

  //松开按钮
  touchEnd: function(event) {
    console.log("松开按钮")
    if (this.data.scopeRecord) {
      console.log("结束录音")
      _recorderStart = false;
      recorderManager.stop();
    }
  },
  keyboardBTN: function() {
    this.setData({
      keyboard: true, //键盘按钮
      showInput: true, //焦点输入区
      voice: false, //关闭录音按钮
      phiz: false, //表情 
      extras: false //关闭录像
    })
  },
  voiceBTN: function() {
    this.setData({
      voice: true, //录音
      keyboard: false, //键盘 
      showInput: false, //取消输入焦点
      extras: false, //键盘 
      phiz: false,
      chatBoxH: 66
    })
  },
  extrasBTN: function() {
    this.setData({
      extras: true,
      phiz: false, //表情 
      showInput: false, //键盘 
    })
    inputRoomHeight(this);
    this.setData({
      toView: this.data.msgList.length - 1
    })
  },

  phizBTN: function() { //开启表情
    this.setData({
      phiz: (!this.data.phiz),
      keyboard: true, //键盘
      voice: false, //录音
      extras: false, //附加功能
    })
    inputRoomHeight(this);
    this.setData({
      toView: this.data.msgList.length - 1
    })
  },
  eea: function() {
    this.setData({
      chatBoxH: 66,
      phiz: false, //表情 
      extras: false //附加功能
    })
  },
  // 选择emoji表情
  tapEmoji: function(e) {
    this.setData({
      inputVal: this.data.inputVal + e.currentTarget.dataset.text,
      sendOutVAL: false,
      extrasVAL: true
    });
  },
    /**
   * 获取聚焦
   */

  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      inputBottom: (keyHeight), 
      chatBoxH: (keyHeight + 66),
      extras: false, //附加功能
      phiz: false, //表情 
      toView: this.data.msgList.length - 1,

    });
    //计算msg高度
    console.log(keyHeight)
  },
  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      inputBottom: 0,
      chatBoxH: 66,
      toView: this.data.msgList.length - 1,
      showInput: false
    })
  },
  input: function(e) {
    this.data.inputVal = e.detail.value
    var inputCont = this.data.inputVal
    if (inputCont == "") {
      this.setData({
        sendOutVAL: true,
        extrasVAL: false
      })
    } else {
      this.setData({
        sendOutVAL: false,
        extrasVAL: true
      })
    }
  },  
    /**
   * 发送点击监听
   */
  sendClick: function(e) {
    var that = this;
    var text = this.data.inputVal;
    var msg = {
      from: "me",
      time: util.getTimestamp() / 1000,
      type: "Text", // Text 文本和emoji表情，Image 图片，Audio 音频
      emojiTexts: "", // Text类型时 通过消息转换 为带emoji表情的文本
      text: text,
    };
    that.transMsgEmojiStr(msg); // 转换emoji文字
    that.data.msgList.push(msg)
    that.setData({
      msgList: that.data.msgList,
      inputVal: "",
      toView: 'msg-' + (that.data.msgList.length - 1),
      sendOutVAL: true,
      extrasVAL: false
    });

  },
  getPhoto: function() {
    var that = this;
    // 1. 选择图片
    wx.chooseImage({
      sourceType: ['album'], // 从相册选择
      count: 1, // 只选一张
      success: function(res) {
        that.data.msgList.push({
          from: "me",
          time: util.getTimestamp() / 1000,
          type: "Image", // Text 文本和emoji表情，Image 图片，Audio 音频
          thumbnail: res.tempFilePaths[0],
          imageUrl: res.tempFiles[0].path,
        })
        that.setData({
          msgList: that.data.msgList,
          toView: that.data.msgList.length - 1
        });
      },
      fail: function(res) {
        // 选择图片失败
        console.log(res)
      }
    });
  },
  takePhoto: function() {
    var that = this;
    // 1. 拍摄图片
    wx.chooseImage({
      sourceType: ['camera'], // 从相机拍摄选择
      count: 1, // 只选一张
      success: function(res) {
        that.data.msgList.push({
          from: "me",
          time: util.getTimestamp() / 1000,
          type: "Image", // Text 文本和emoji表情，Image 图片，Audio 音频
          thumbnail: res.tempFilePaths[0],
          imageUrl: res.tempFiles[0].path,
        })
        that.setData({
          msgList: that.data.msgList,
          toView: that.data.msgList.length - 1
        });
      },
      fail: function(res) {
        // 拍摄图片失败
        console.log(res)
      }
    });
  },  
  
  //播放音频消息
  audioPlay: function(event) {
    console.log("播放音频消息")
    var that = this;
    var index = event.currentTarget.dataset.index;
    var msgList = that.data.msgList;

    var audioUrl = msgList[index].audioUrl;
    
    if (audioUrl == '' || !audioUrl) {
      this.tip("语音已失效")
      return;
    }

    innerAudioContext.src = audioUrl;
    innerAudioContext.play();

    var lastAudioPlayIndex = that.data.lastAudioPlayIndex;  
    msgList[index].audioReaded = true; //已读   
    if(msgList[lastAudioPlayIndex]) msgList[lastAudioPlayIndex].audioPlaying = false; //停止上一个播放
    msgList[index].audioPlaying = true; //正在播放
    lastAudioPlayIndex = index;
    this.setData({
      lastAudioPlayIndex: lastAudioPlayIndex,
      msgList: msgList,
    })

    //结束监听
    innerAudioContext.onEnded(() => {
      console.log("播放音频结束")
      msgList[index].audioPlaying = false; //停止播放
      that.setData({
        msgList: msgList,
      })
    })
  },

  // 录音监听事件
  recorderManagerEvent: function(that) {
    // 监听录音错误事件
    recorderManager.onError(function(errMsg) {
      console.warn('recorder error:', errMsg);
      if(_isPageLoad) {
        that.tip('录音错误:' + errMsg.errMsg)
      }
    });

    // 监听录音结束事件，录音结束后
    recorderManager.onStop(function(res) {
      console.log('recorder stop', res);
      if(res.duration == 0) {
        wx.showToast({
          title: '录音时间太短',
        })
        return;
      }
      
      that.data.msgList.push({
        from: "me",
        time: util.getTimestamp() / 1000,
        type: "Audio", // Text 文本和emoji表情，Image 图片，Audio 音频
        audioUrl: "",
        audioSecond: res.duration / 1000, // 时长
        audioIsPlaying: false, // 是否正在播放
        audioIsReaded: false, // 是否已读
      });
      that.setData({
        msgList: that.data.msgList,
        //inputVal: "",
        extras: false,
        toView: that.data.msgList.length - 1
      });
    });
  },
  
  // 查询录音权限
  queryRecord: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log("requestRecord():")
        console.log(res)
        //这里判断是否有地理位置权限
        if (res.authSetting['scope.record']) {
          //已经获取录音权限
          that.setData({
            scopeRecord: true,
          })
        }
      }
    })
  },

  //获取录音权限
  requestRecord: function(successCallback) {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log("requestRecord():")
        console.log(res)
        //这里判断是否有地理位置权限
        if (!res.authSetting['scope.record']) { //获取录音权限          
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log('授权成功')
              successCallback();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '尚未授权录音功能，语音通讯将无法使用',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log("打开设置页面");
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.record']) {
                          console.log('授权成功')
                          successCallback();
                        }
                      },
                      fail: function() {
                        console.log("授权设置录音失败");
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          successCallback();
        }
      }
    });
  },
})

/**
* 高度
*/
function inputRoomHeight(that) {
 //创建节点选择器
 var query = wx.createSelectorQuery();
 //选择id
 query.select('.inputRoom').boundingClientRect()
 query.exec(function (res) {
   if (that) that.setData({
     chatBoxH: (res[0].height),
   })
 })
}