<template>
  <div class="page page-reg-bg">
    <cp-top-back :backPage="'exchange'" :showRight="false" class="page-top-bg">
      <router-link tag="span" class="btn-login" :to="{name:'login'}">{{$t('login_register.login')}}<!--登录--></router-link>
    </cp-top-back>

    <div class="register-form">
      <h3 class="register-title">
        <i></i>
        <!--<span>{{$t('login_register.register')}}&lt;!&ndash;注册&ndash;&gt;</span>-->
      </h3>
      <div class="register-content">
        <div class="register-content-inner">
          <div class="register-content-tab">
            <label for="register-cellphone">
              <input id="register-cellphone" type="radio" name="registerType" :value="1" v-model="formData.registerType"/>
              <i></i>
              <span>{{$t('login_register.register_by_cellphone')}}<!--手机注册--></span>
            </label>
            <label for="register-email">
              <input id="register-email" type="radio" name="registerType" :value="0" v-model="formData.registerType"/>
              <i></i>
              <span>{{$t('login_register.register_by_email')}}<!--邮箱注册--></span>
            </label>
          </div>

          <!--手机注册-->
          <div class="register-content-item cellphone" v-show="formData.registerType===1">
            <div class="register-content-row countryCode">
              <select class="mobile" v-model="formData.countryCode">
                <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}<!--中国大陆-->&nbsp;{{item.code}}</option>
              </select>
              <input name="mobile" v-model="formData.mobile" v-validate="'required|telphone'" :placeholder="$t('account.user_center_phone')"><!--手机号-->
            </div>
            <div class="register-content-row SMSCode">
              <input name="smsCode" maxlength="4" v-model="formData.smsCode" v-validate="'required'" :placeholder="$t('account.user_center_SMS_code')"><!--短信验证码-->
              <mt-button type="primary" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
            </div>
          </div>

          <!--邮箱注册-->
          <div class="register-content-item email" v-show="formData.registerType===0">
            <div class="register-content-row email">
              <input name="email" v-model="formData.email" v-validate="'required|email'" :placeholder="$t('otc_exchange.otc_exchange_Email')"><!--邮箱-->
            </div>
          </div>

          <!--共同部分-->
          <div class="register-content-item common">
            <div class="register-content-row password">
              <input name="password" type="password" v-model="formData.password" v-validate="'required|password'" :placeholder="$t('exchange.exchange_password')"><!--密码-->
            </div>
            <div class="register-content-row confirmPassword">
              <input uid="common-password" type="password" name="passwordConfirm" v-model="formData.passwordConfirm" v-validate="'required|passwordAgain'" :placeholder="$t('login_register.confirm_password')"><!--确认密码-->
            </div>
            <div class="register-content-row invitation">
              <input name="ref" v-model="formData.ref" :placeholder="`${$t('public0.public244')}（${$t('public0.public237')}）`"><!--邀请码-->
            </div>
            <div class="register-content-row service">
              <label for="service">
                <input id="service" type="checkbox" name="service" v-model="checked">
                <i type="checkbox"></i>
              </label>
              <span>
                <label for="service">{{$t('login_register.agree_Service')}}<!--我已阅读并同意--></label>
                <a :href="getAgreementUrl" target="_blank">{{$t('login_register.bitark_service').format(brand)}}<!--NEWTON服务条款--></a>
              </span>
            </div>
            <div class="register-content-row button">
              <mt-button :class="{disabled: locked || gtLocked}" type="primary" size="large" v-tap="{methods: register}">{{$t('login_register.register')}}<!--注册--></mt-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <googledialog :is-show="isShowGoogleDialog" @on-close="closeDialog('isShowGoogleDialog')">
      <googleauthform @on-close-all="closeDialog('isShowGoogleDialog')"></googleauthform>
    </googledialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tip from '@/assets/js/tip'
import config from '@/assets/js/config'
import commonConfig from '@/assets/js/commonConfig'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import googledialog from '@/components/common/dialog'
import googleauthform from '@/components/login_google_auth_from'
export default {
  name: 'page-register',
  components: {
    googledialog,
    googleauthform
  },
  data () {
    return {
      areaCodeList: commonConfig.areaCodeList,
      brand: config.brand.toUpperCase(),
      icircle: require('../assets/img/i_circle.png'),
      iradius: require('../assets/img/i_radius.png'),
      testvalue: [],
      checked: false,
      options: [
        {
          label: ' ',
          value: '1'
        }
      ],
      isShowGoogleDialog: false,
      locked: false, // 锁
      gtLocked: false,
      disabled: false,
      formData: {
        countryCode: commonConfig.defaultCode,
        registerType: 1,
        mobile: '',
        smsCode: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        ref: ''
      },
      time: 60
    }
  },
  computed: {
    msgs () {
      return {
        mobile: {required: this.$t('public0.public6')}, // 请输入手机号
        smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
        email: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')}, // 请输入邮箱；邮箱格式错误
        password: {required: this.$t('login_register.password')}, // 请输入密码
        passwordConfirm: {required: this.$t('login_register.confirm_password')} // 请再次输入密码
      }
    },
    getAgreementUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://cdcc.kf5.com/hc/kb/article/1225585/'
      } else {
        return 'https://cdcc.kf5.com/hc/kb/article/1225582/'
      }
    }
  },
  watch: {
    'formData.registerType' () {
      this.$validator.reset()
    },
    $route () {
      this.formData.ref = utils.getUrlHashParams().ref
    }
  },
  created () {
    this.formData.ref = utils.getUrlHashParams().ref
    this.$nextTick(() => {
      $('.login-form input[name=username]').focus()
    })
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.formData.mobile) {
        Tip({type: 'danger', message: this.$t('public0.public6')})
        return
      }
      this.disabled = true
      userApi.sendSMSCode({
        countryCode: this.formData.countryCode,
        phoneNumber: this.formData.mobile
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
        Tip({type: 'success', message: msg})
      })
    },
    register () {
      var formData = {}
      for (let i in this.formData) {
        formData[i] = this.formData[i]
      }
      if (Number(formData.registerType) === 0) { // 邮箱注册
        delete formData.mobile
        delete formData.smsCode
        delete formData.countryCode
        formData.username = formData.email
      } else {
        formData.username = formData.mobile
        delete formData.email
      }
      console.log(formData)
      this.$validator.validateAll(formData).then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        if (!this.checked) {
          Tip({type: 'danger', message: this.$t('public0.public122')})
          return
        }
        if (this.locked) {
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          this.locked = true
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.register(formData, (msg) => {
              this.locked = false
              Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
              setTimeout(() => {
                this.$router.push({name: 'login'})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            })
          }, () => {
            this.locked = false
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
    closeDialog (attr) {
      this[attr] = false
    }
  }
}
</script>

<style lang="less" scoped>
.page-reg-bg{
  background: linear-gradient(to right,#0071ee,#4638f1);
}
.page-top-bg{
  background: #0c151d;
}
.btn-login {
  position: absolute;
  top: .2rem;
  right: .3rem;
  height: .4rem;
  font-size: .24rem;
  line-height: .4rem;
  color: #fff;
  &:active{
    color: #0471e9;
  }
}
.register-form {
  height: calc(~"100% - .8rem");
  padding: .4rem .3rem .8rem .3rem;
  overflow-x: hidden;
  overflow-y: auto;
}
.register-title {
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
.register-content {
  padding: .4rem .4rem .55rem;
  margin-top: .4rem;
  background-color: #fff;
  border-radius: .1rem;
  &-tab {
    overflow: hidden;
    border: 1px solid #0471e9;
    border-radius: .1rem;
    margin: 0 auto;
    display: inline-block;
    transform: translate(-50%, 0);
    margin-left: 50%;
    margin-right: -50%;
    word-break:keep-all; 
    white-space:nowrap;
    label {
      font-size: 0;
      line-height: 0;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      input {
        display: none;
        &:checked {
          + i {
            background-color: #0471e9;
            border-color: #0471e9;
          }
          ~ span {
            color: #fff;
            background-color: #0471e9;
          }
        }
      }
      i {
        width: 0;
        height: .32rem;
        padding: 0;
        border: 0;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        height: .8rem;
        padding-left: .32rem;
        padding-right: .32rem;
        font-size: .24rem;
        line-height: .8rem;
        color: #0471e9;
        vertical-align: middle;
      }
    }
  }
  &-row {
    margin-top: .4rem;
    &.countryCode {
      position: relative;
      margin-top: 0;
      &::before {
        content: "";
        position: absolute;
        top: .2rem;
        left: 40%;
        width: 1px;
        height: .4rem;
        background-color: #8089a3;
      }
      select {
        position: absolute;
        top: 0;
        left: 0;
        width: 40%;
        height: .8rem;
        font-size: .3rem;
        color: #8089a3;
        background-image: url(../assets/img/down-icon-8089a3@3x.png);
      }
      input {
        padding-left: 40%;
        text-indent: .2rem;
      }
    }
    &.SMSCode {
      font-size: 0;
      line-height: 0;
      input {
        width: 55%;
        vertical-align: middle;
      }
      button {
        width: 40%;
        height: .7rem;
        padding: 0;
        margin-left: 5%;
        font-size: .24rem;
        vertical-align: middle;
        background-color: #fff;
        color: #0471e9;
        border: 1px solid #0471e9;
        &:disabled {
          background-color: #fafbf2;
        }
      }
    }
    &.email {
      margin-top: 0;
    }
    &.service {
      margin-top: 0;
      font-size: 0;
      line-height: 0;
      > label {
        display: inline-block;
        width: .32rem;
        height: .32rem;
        margin-top: .24rem;
        vertical-align: top;
        input {
          display: none;
          &:checked {
            + i {
              background-color: #0471e9;
              &::before {
                border-color: #fff;
              }
            }
          }
        }
        i {
          position: relative;
          display: block;
          width: .32rem;
          height: .32rem;
          border: 2px solid #0471e9;
          border-radius: 2px;
          overflow: hidden;
          &::before {
            content: "";
            position: absolute;
            top: -0.16rem;
            left: -0.08rem;
            width: .32rem;
            height: .32rem;
            border-width: 0 2px 2px 0;
            border-style: solid;
            border-color: transparent;
            border-radius: 2px;
            transform: rotate(45deg);
          }
        }
      }
      span {
        display: inline-block;
        width: 100%;
        min-height: .4rem;
        padding: .2rem 0 .3rem .52rem;
        margin-left: -0.32rem;
        font-size: .3rem;
        line-height: .4rem;
        vertical-align: top;
        color: #333;
        a {
          color: #0471e9;
          text-decoration: underline;
        }
      }
    }
    &.button {
      margin-top: 0;
      button {
        height: .8rem;
        font-size: .3rem;
        background: #0471e9;
        color: #fff;
        border: 1px solid #0471e9;
      }
      button.disabled{background:#999;color:#FFF;border-color:#999;}
    }
    input {
      width: 100%;
      height: .8rem;
      font-size: .3rem;
      color: #333;
      background-color: transparent;
      border-width: 0;
      border-bottom: 1px solid #8089a3;
      &:focus {
        border-bottom-color: #0471e9;
      }
    }
  }
}
</style>
