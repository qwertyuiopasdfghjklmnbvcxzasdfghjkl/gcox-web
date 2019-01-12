<template>
  <div class="page">
    <cp-top-back :backPage="'exchange'" :showRight="false">
    </cp-top-back>

    <div class="second-form">
      <h3 class="second-title">
        <i></i>
        <!--<span>{{$t('account.user_center_two_auth')}}&lt;!&ndash;二次验证&ndash;&gt;</span>-->
      </h3>
      <div class="second-content">
        <div class="second-content-inner">
          <div class="second-content-tab" v-if="type === '01' || type === '10'">
            <label for="second-SMS">
              <input id="second-SMS" type="radio" name="verifyType" :value="0" v-model="formData.verifyType"/>
              <i></i>
              <span>{{$t('auth_warning.warning_SMS_auth')}}<!--短信验证--></span>
            </label>
            <label for="second-google">
              <input id="second-google" type="radio" name="verifyType" :value="1" v-model="formData.verifyType"/>
              <i></i>
              <span>{{$t('auth_warning.warning_google_auth')}}<!--谷歌验证--></span>
            </label>
          </div>

          <div class="second-content-item" @click="focusVerifyCode">
            <div class="second-content-row SMSLabel" v-if="formData.verifyType===0">
              <span>{{$t('account.user_center_SMS_code')}}<!--短信验证码--></span>
              <mt-button type="primary" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
            </div>
            <div class="second-content-row googleLabel" v-if="formData.verifyType===1">
              <span>{{$t('account.user_center_Google_verification_code')}}<!--谷歌验证码--></span>
            </div>
            <div class="second-content-row verifyCode">
              <input id="verifyCode" ref="verifyCode" type="text" v-model="formData.verifyCode" :maxlength="verifyCodeLength">
              <ul>
                <li :class="{active:index <= verifyCodes.length}" v-for="index in verifyCodeLength" :key="index">{{verifyCodes[index - 1]||''}}</li>
              </ul>
            </div>
          </div>
          <div class="second-content-row button">
            <mt-button type="primary" size="large" @click="loginbtn">{{$t('login_register.login')}}<!--确定--></mt-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
export default {
  name: 'page-twoverify',
  data () {
    return {
      countryCode: '+86',
      testvalue: [],
      options: [
        {
          label: '',
          value: '1'
        }
      ],
      formData: {
        verifyType: 0, // 0 是短信 1 是谷歌
        username: '',
        mobile: '',
        verifyCode: ''
      },
      isShowGoogleDialog: false,
      locked: false, // 锁
      type: '',
      account: '',
      password: '',
      disabled: false,
      time: 60
    }
  },
  computed: {
    verifyCodeLength () { // 短信长度
      return Number(this.formData.verifyType) === 0 ? 6 : 6
    },
    verifyCodes () {
      let arr = (this.formData.verifyCode || '').split('')
      return arr
    },
  },
  watch: {
    'formData.verifyType' () {
      this.formData.verifyCode = ''
      this.$nextTick(() => {
        $('#verifyCode').focus()
      })
    },
    type (val) {
      if (String(val).indexOf('0') !== -1) {
        this.formData.verifyType = 0
      } else {
        this.formData.verifyType = 1
      }
    }
  },
  created () {
    let username = this.$route.params.username
    if (username) {
      this.formData.username = username
      window.localStorage.setItem('$twoverify_username', username)
    } else {
      username = window.localStorage.getItem('$twoverify_username')
      if (username) {
        this.formData.username = username
      } else {
        this.$router.push({name: 'login'})
      }
    }
    let mobile = this.$route.params.mobile
    if (mobile) {
      this.formData.mobile = mobile
      window.localStorage.setItem('$twoverify_mobile', mobile)
    } else {
      mobile = window.localStorage.getItem('$twoverify_mobile')
      if (mobile) {
        this.formData.mobile = mobile
      }
    }
    let type = this.$route.params.type
    if (type) {
      this.type = type
      window.localStorage.setItem('$twoverify_type', type)
    } else {
      type = window.localStorage.getItem('$twoverify_type')
      if (type) {
        this.type = type
      }
    }
    let countryCode = this.$route.params.countryCode
    if (countryCode) {
      this.countryCode = countryCode
      window.localStorage.setItem('$twoverify_countryCode', countryCode)
    } else {
      countryCode = window.localStorage.getItem('$twoverify_countryCode')
      if (countryCode) {
        this.countryCode = countryCode
      }
    }
    this.$nextTick(() => {
      $('#verifyCode').focus()
    })
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    focusVerifyCode () {
      $('#verifyCode').focus()
    },
    loginbtn () {
      if (this.locked) {
        return
      }
      let m = Number(this.formData.verifyType) === 0 ? 'loginMobileVerify' : 'loginTwo'
      let formData = Number(this.formData.verifyType) === 0 ? { // 短信验证
        smsCode: this.formData.verifyCode,
        username: this.formData.username
      } : {
        verifyCode: this.formData.verifyCode,
        username: this.formData.username
      }
      myAPi[m](formData, (apiToken) => {
        window.localStorage.removeItem('$twoverify_username')
        this.locked = false
        this.setApiToken(apiToken)
        userApi.getUserInfo((userInfo) => {
          this.setUserInfo(userInfo)
        })
        this.$router.push({name: 'page-ucenter'})
        myAPi.addLoginHistory()
      }, (msg) => {
        this.locked = false
        this.formData.verifyCode = ''
        setTimeout(() => {
          $('#verifyCode').focus()
        }, 10)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.formData.mobile) {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      }
      this.disabled = true
      myAPi.sendAuthSMSCode({
        phoneNumber: this.formData.mobile,
        countryCode: this.countryCode
      }, (res) => {
        let timeOut = () => {
          this.time--
          if (this.time === 0) {
            this.disabled = false
            this.time = 60
            return
          }
          setTimeout(timeOut, 1000)
        }
        setTimeout(timeOut, 1000)
        Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
      }, (msg) => {
        this.disabled = false
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  background: #161f2f;
}
.second-form {
  height: calc(~"100% - .8rem");
  padding: .8rem .3rem;
  overflow-x: hidden;
  overflow-y: auto;
}
.second-title {
  height: 1.3rem;
  line-height: 1.3rem;
  text-align: center;
  i {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
    background: url('../assets/img/LOGO.png') no-repeat center center / contain;
  }
  span {
    display: inline-block;
    height: .8rem;
    font-size: .36rem;
    line-height: .8rem;
    color: #fff;
    vertical-align: middle;
  }
}
.second-content {
  padding: .8rem .4rem;
  margin-top: .4rem;
  border-radius: 0.05rem;
  background-color: #0c151d;
  &-tab {
    margin-bottom: .4rem;
    overflow: hidden;
    label {
      float: left;
      font-size: 0;
      line-height: 0;
      white-space: nowrap;
      input {
        display: none;
        &:checked {
          + i {
            background-color: #0072fd;
            border-color: #0072fd;
          }
          ~ span {
            color: #0072fd;
          }
        }
      }
      i {
        display: inline-block;
        width: .32rem;
        height: .32rem;
        padding: 2px;
        vertical-align: middle;
        background-color: transparent;
        background-clip: content-box;
        border: 2px solid #d6dff9;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        height: .8rem;
        padding-left: .08rem;
        padding-right: .32rem;
        font-size: .3rem;
        line-height: .8rem;
        vertical-align: middle;
      }
    }
  }
  &-row {
    margin-top: .4rem;
    &.SMSLabel, &.googleLabel {
      font-size: 0;
      line-height: 0;
      span {
        display: inline-block;
        width: 55%;
        height: .8rem;
        font-size: .3rem;
        line-height: .8rem;
        vertical-align: middle;
      }
      button {
        width: 40%;
        height: .6rem;
        padding: 0;
        margin-left: 5%;
        font-size: .24rem;
        vertical-align: middle;
        background: #0c151d;
        color: #0072fd;
        border: 1px solid #0072fd;
        &:disabled {
          background-color: #999;
        }
      }
    }
    &.SMSLabel {
      margin-top: 0;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &.googleLabel {
      margin-top: 0;
      span {
        width: 100%;
      }
    }
    &.verifyCode {
      position: relative;
      overflow: hidden;
      input {
        /*在IOS下隐藏光标需设置200%倍宽度和100%偏移*/
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: .8rem;
        border-width: 0;
        clip: rect(0, 0, 0, 0);
      }
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: .8rem;
        li {
          width: .4rem;
          height: .4rem;
          font-size: .36rem;
          line-height: .4rem;
          color: #fff;
          text-align: center;
          background-color: #0072fd;
        }
      }
    }
    &.button {
      button {
        height: .8rem;
        font-size: .36rem;
        background: #0072fd;
        color: #fff;
        border: 1px solid #0072fd;
      }
    }
  }
}
</style>
