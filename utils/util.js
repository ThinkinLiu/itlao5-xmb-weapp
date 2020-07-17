const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * js对象合法性判断
 */
function isBlank(obj, expectType) {
  if (obj == null || typeof obj == "undefined") {
    console.log("obj 未指定");
    return true;
  }

  if (expectType != null && typeof expectType != "undefined") {
    if (!(obj instanceof expectType)) {
      console.log("obj 类型不对");
      return true;
    }
  }

  return false;

}

/**
 *null underfined empty判断
 */
function isBlankOrEmpty(obj) {
  if (obj == null || typeof obj == "undefined" || obj == "") {
    console.log("obj 未指定 " + obj);
    return true;
  }
  return false;

}

function isTelephone(phone) {
  //手机号正则  
  var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
  //电话  
  if (!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

function isCardNum(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  } else {
    return true;
  }
}
/**
 * 获取当前时间的日期部分 yyyy-MM-dd
 */
function getDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  return [year, month, day].map(formatNumber).join('-');
}
/**
 * /Date(1915151515)/格式转为 yyyy-MM-dd
 */
function getDateFromDateTime(datetime) {
  var times = parseInt(datetime.replace("/Date(", "").replace(")/", ""));
  var date = new Date(times);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

function getTimestamp() {
  return Date.parse(new Date());
}

module.exports = {
  formatTime: formatTime,
  isBlank: isBlank,
  isBlankOrEmpty: isBlankOrEmpty,
  isTelephone: isTelephone,
  isCardNum: isCardNum,
  getDate: getDate,
  getDateFromDateTime: getDateFromDateTime,
  getTimestamp: getTimestamp
}
