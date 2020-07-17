//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

      menuitems: [
        // text标题，hint介绍，url跳转页面，icon图标，tips备注，tap点击事件(与url二选一)
        { text: '小萌伴APP', hint: '能帮您找手机的聊天伴侣！', url: '', icon: '../../images/icon-xmb-app.png', tips: '', tap: 'showConcatModal' },
        { text: '在线翻译', hint: '在线英汉互译', url: '../error/update', icon: '../../images/icon-xmb-code.jpg', tips: '', tap: '' },
        { text: '文字语音转换', hint: '语音转文字、文字转语音', url: '../error/update', icon: '../../images/icon-xmb-code.jpg', tips: '', tap: '' },
        { text: '图片转换', hint: '图片转ASCII字符图片', url: '../error/update', icon: '../../images/icon-xmb-code.jpg', tips: '', tap: '' },
        { text: '聊天机器人', hint: '聊天机器人陪聊', url: '../imRobot/chat', icon: '../../images/icon-xmb-code.jpg', tips: '', tap: '' }
      ],
      showConcatModal: false
  },
  onLoad: function () {
    
    
  },
  showConcatModal: function(e) {
    this.setData({
      showConcatModal: true,
    }) 
  },
  dismissConcatModal: function (e) {
    this.setData({
      showConcatModal: false,
    })
  }
})
