import numUtils from '@/assets/js/numberUtils'
export default {
  routeTo (args) { // 自定义公共路由函数
    this.$router.push({name: args.to, query: args.query, params: args.params})
  },
  trim (str, len) { // 去除空格并验证数据是否达到指定字符串长度
    var string = str.replace(/^\s+|\s+$/g, "")
    if (string != '') {
      return string.length >= len
    } else {
      return false
    }
  },
  ismobile (str) { // 检测手机号码的合法性
    if (str.length != 11) {
      return false
    } else {
      var t = /^(13\d{9})|(14\d{9})|(15\d{9})|(17\d{9})|(18\d{9})|(0\d{10,11})$/
      return t.test(str)
    }
  },
  isEmail (str) { // 检测邮箱是否合法性
    var pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return pattern.test(str)
  },
  isNumbers (str) { // 是否是整数
    var pInteger = /^\d+$/
    return pInteger.test(str)
  },
  isPassword (str) { // 是否密码正确 请输入6~16位数字+字母组合的密码
    var pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    return pwd.test(str)
  },
  bankCardValid (str) { // 银行卡账号验证
    var bkstr = /^[0-9\- ]+$/
    return bkstr.test(str);
  },
  toFixed (value, fixed) {
    if (isNaN(Number(value))) {
      return value
    } else {
      return numUtils.BN(value || 0).toFixed(fixed)
    }
  }
}
