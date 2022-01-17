export default {
  /**
   * 1.验证手机号是否合格
   * true  合格
   * @param 手机号
   */
  isPhone (phoneStr) {
    const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    if (!myreg.test(phoneStr)) {
      return false
    } else {
      return true
    }
  },

  /**
  * 2.验证身份证号是否合格
  * true 说明合格
  */
  isIdCard (idCardStr) {
    const idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    if (idcardReg.test(idCardStr)) {
      return true
    } else {
      return false
    }
  },

  /**
  * 3.验证字符串是否为空
  *    ture 说明为空  false 说明不为空
  */
  isEmptyString (string) {
    if (
      string === undefined ||
        typeof string === 'undefined' ||
        !string ||
        string == null ||
        string === '' ||
        /^\s+$/gi.test(string)
    ) {
      return true
    } else {
      return false
    }
  },

  /**
  * 4.判断数据类型
  * @param {any} val - 基本类型数据或者引用类型数据
  * @return {string} - 可能返回的结果有，均为小写字符串
  * number、boolean、string、null、undefined、array、object、function等
  */
  getType (val) {
    // 判断数据是 null 和 undefined 的情况
    if (val == null) {
      return val + ''
    }
    return typeof (val) === 'object'
      ? Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
      : typeof (val)
  },

  /**
  * 5.验证是否为数字
  */
  isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  },

  /**
  * 6.是否为数组
  */
  isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  },

  /**
  * 7.是否为空数组
  */
  isArrayEmpty (val) {
    if (val && val instanceof Array && val.length > 0) {
      return false
    } else {
      return true
    }
  },

  /**
  * 8.获取url参数字符串
  * 没有返回null
  */
  getQueryString (name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },

  /**
  * 9.函数防抖
  * @desc  函数防抖，用于将多次执行变为最后一次执行
  * @param {function} func - 需要使用函数防抖的被执行的函数。必传
  * @param {Number} wait - 多少毫秒之内触发，只执行第一次，默认1000ms。可以不传
  */
  debounce (fn, delay) {
    delay = delay || 1000 // 默认1s后执行
    let timer = null
    return function () {
      const context = this
      const arg = arguments
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn.apply(context, arg)
      }, delay)
    }
  },

  /**
  * 10.节流函数, 用于将多次执行变为每隔一段时间执行
  * @param fn 事件触发的操作
  * @param delay 间隔多少毫秒需要触发一次事件
  */
  throttle2 (fn, delay) {
    let timer = null
    return function () {
      const context = this
      const args = arguments
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(context, args)
          clearTimeout(timer)
        }, delay)
      }
    }
  },

  /**
  * 11. 将字符串时间转换为时间戳
  * @param {string} date
  */
  getDateTime (date) {
    let timestamp = ''
    if (date) {
      date = date.substring(0, 19)
      date = date.replace(/-/g, '/') // 必须把日期'-'转为'/'
      timestamp = new Date(date).getTime()
    }
    return timestamp
  },

  /**
  * 12.获取年-月-日
  * 获取年-月-日
  * @data {Any} 时间戳
  */
  getDates (data) {
    let timeObj = {}
    data = new Date(data)
    const y = data.getFullYear()
    const m =
        data.getMonth() + 1 < 10
          ? '0' + (data.getMonth() + 1)
          : data.getMonth() + 1
    const d = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
    let w = data.getDay()
    switch (w) {
      case 1:
        w = '星期一'
        break
      case 2:
        w = '星期二'
        break
      case 3:
        w = '星期三'
        break
      case 4:
        w = '星期四'
        break
      case 5:
        w = '星期五'
        break
      case 6:
        w = '星期六'
        break
      case 7:
        w = '星期日'
        break
    }
    const h = data.getHours() < 10 ? '0' + data.getHours() : data.getHours()
    const mi = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes()
    const s = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds()
    timeObj = {
      year: y + '',
      month: m + '',
      day: d + '',
      week: w + '',
      hour: h + '',
      minute: mi + '',
      second: s + ''
    }
    return timeObj
  },

  /**
  * 13.验证车牌号是否合格
  * true--说明合格
  */
  isVehicleNumber (vehicleNumber) {
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    if (vehicleNumber.length === 7) {
      return creg.test(vehicleNumber)
    } else if (vehicleNumber.length === 8) {
      return xreg.test(vehicleNumber)
    } else {
      return false
    }
  },

  /*
  * 14.生日转为年龄（精确到月份）
  */
  birsdayToAge (birsday) {
    const aDate = new Date()
    const thisYear = aDate.getFullYear()
    const bDate = new Date(birsday)
    const brith = bDate.getFullYear()
    let age = thisYear - brith
    if (aDate.getMonth() === bDate.getMonth()) {
      if (aDate.getDate() < bDate.getDate()) {
        age = age - 1
      }
    } else {
      if (aDate.getMonth() < bDate.getMonth()) {
        age = age - 1
      }
    }
    return age
  },

  /**
  * 15.邮箱校验
  * true 说明合格
  */
  isEmail (email) {
    const emailReg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
    if (emailReg.test(email)) {
      return true
    } else {
      return false
    }
  },
  isURL (url) {
    var strRegex = '^((https|http|ftp|rtsp|mms|git)?://)' +
    '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + // ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    '([0-9a-z_!~*\'()-]+.)*' + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
    var re = new RegExp(strRegex)

    if (re.test(url)) {
      return true
    } else {
      return false
    }
  }
}
