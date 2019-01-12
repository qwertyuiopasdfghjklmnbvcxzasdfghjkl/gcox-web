<template>
  <div class="page page-reg-bg">
    <cp-top-back :backPage="'exchange'" :showRight="false" class="page-top-bg">
      <router-link tag="span" class="btn-login" :to="{name:'login'}">{{$t('login_register.login')}}<!--登录--></router-link>
    </cp-top-back>

    <div class="findpwd-form">
      <h3 class="findpwd-title">
        <i></i>
        <!--<span>{{$t('login_register.Retrieve_password')}}&lt;!&ndash;找回密码&ndash;&gt;</span>-->
      </h3>
      <div class="findpwd-content">
        <div class="findpwd-content-inner">
          <div class="findpwd-content-tab">
            <label for="findpwd-cellphone">
              <input id="findpwd-cellphone" type="radio" name="findpwdType" :value="1" v-model="findpwdType"/>
              <i></i>
              <span>{{$t('login_register.retrieved_by_cellphone')}}<!--手机找回--></span>
            </label>
            <label for="findpwd-email">
              <input id="findpwd-email" type="radio" name="findpwdType" :value="0" v-model="findpwdType"/>
              <i></i>
              <span>{{$t('login_register.retrieved_by_email')}}<!--邮箱找回--></span>
            </label>
          </div>

          <!--手机找回-->
          <div class="findpwd-content-item cellphone" v-show="findpwdType===1">
            <div class="findpwd-content-row countryCode">
              <select class="mobile" v-model="countryCode">
                <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
              </select>
              <input name="mobile" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'" :placeholder="$t('account.user_center_phone')"><!--手机号-->
            </div>
            <div class="findpwd-content-row SMSCode">
              <input name="smsCode" maxlength="6" v-model="mobileFormData.smsCode" v-validate="'required'" :placeholder="$t('account.user_center_SMS_code')"><!--短信验证码-->
              <mt-button type="primary" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
            </div>
            <div class="findpwd-content-row password">
              <input name="password" type="password" v-model="mobileFormData.password" v-validate="'required|password'" :placeholder="$t('account.user_center_new_password')"><!--新密码-->
            </div>
            <div class="findpwd-content-row confirmPassword">
              <input uid="common-password" type="password" name="passwordConfirm" v-model="mobileFormData.passwordConfirm" v-validate="'required|passwordAgain'" :placeholder="$t('login_register.confirm_new_password')"><!--确认密码-->
            </div>
            <div class="findpwd-content-row button">
              <mt-button :class="{disabled: locked || gtLocked}" type="primary" size="large" v-tap="{methods: updatePwd}">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></mt-button>
            </div>
          </div>

          <!--邮箱找回-->
          <div class="findpwd-content-item email" v-show="findpwdType===0">
            <div class="findpwd-content-row email">
              <input name="email" v-model="formData.username" v-validate="'required|email'" :placeholder="$t('otc_exchange.otc_exchange_Email')"><!--邮箱-->
            </div>
            <div class="findpwd-content-row button">
              <mt-button :class="{disabled: locked || gtLocked}" type="primary" size="large" v-tap="{methods: next}">{{$t('login_register.Next_step')}}<!--下一步--></mt-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--邮箱找回提示-->
    <googledialog :is-show="isShowGoogleDialog" @on-close="closeDialog('isShowGoogleDialog')">
      <div class="dialog-content-inner">
        <div class="text">
          <p>{{$t('login_register.Mail_sent_successfully')}}<!--邮件发送成功--></p>
          <p>{{$t('login_register.please_reset_password')}}<!--请前往邮箱重置密码--></p>
        </div>
        <div class="button">
          <mt-button :class="{disabled: locked || gtLocked}" type="primary" size="large" v-tap="{methods: cannlefun, parms: {one: 'isShowGoogleDialog'}}">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></mt-button>
        </div>
      </div>
    </googledialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import commonConfig from '@/assets/js/commonConfig'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
import googledialog from '@/components/common/dialog'
export default {
  name: 'findpwd',
  components: {
    googledialog
  },
  data () {
    return {
      areaCodeList: commonConfig.areaCodeList,
      countryCode: commonConfig.defaultCode,
      isShowGoogleDialog: false,
      locked: false,
      gtLocked: false,
      findpwdType: 1,
      mobileFormData: {
        phoneNumber: '',
        smsCode: '',
        password: '',
        passwordConfirm: ''
      },
      formData: {
        username: ''
      },
      disabled: false,
      time: 60
    }
  },
  computed: {
    msgs () {
      return {
        phoneNumber: {required: this.$t('public0.public6')}, // 请输入手机号
        smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordConfirm: {required: this.$t('account.user_center_Please_confirm_password')}, // 请再次输入新密码
        username: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')} // 请输入邮箱 邮箱格式错误
      }
    }
  },
  watch: {
    findpwdType () {
      this.$nextTick(() => {
        this.$validator.reset()
      })
    }
  },
  created () {
    this.$nextTick(() => {
      $('.login-form input[name=username]').focus()
    })
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    next () {
      if (this.locked) {
        return
      }
      this.$validator.validateAll(this.formData).then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.formData) {
            formData[i] = this.formData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          userApi.forgetPwdSendEmail(formData, () => {
            Tip({type: 'success', message: this.$t('login_register.Mail_sent_successfully')}) // 邮件发送成功
            setTimeout(() => {
              this.locked = false
              this.isShowGoogleDialog = true
            }, 1500)
          }, (msg) => {
            this.locked = false
            Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
    updatePwd () {
      if (this.locked) {
        return
      }
      this.$validator.validateAll(this.mobileFormData).then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.mobileFormData) {
            formData[i] = this.mobileFormData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.mobileResetPwd(formData, () => {
              Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
              setTimeout(() => {
                this.locked = false
                this.$router.push({name: 'login'})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            })
          }, () => {
            this.locked = false
          })
        })
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.mobileFormData.phoneNumber) {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      }
      this.disabled = true
      myAPi.sendAuthSMSCode({
        countryCode: this.countryCode,
        phoneNumber: this.mobileFormData.phoneNumber
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
    cannlefun (args) {
      this[args.parms.one] = false
      this.$router.push({name: 'login'})
    },
    closeDialog (attr) {
      this[attr] = false
    },
    resetPW (arg) {
      let pwd= $(".login-form").find("input[name=password]")
      if (pwd.next().hasClass('invisible')) { // 如果隐藏
        pwd.next().removeClass('invisible').addClass('visible') // 密码可见
        pwd.prop('type', 'text')
      } else {
        pwd.next().removeClass('visible').addClass('invisible') // 密码不可见
        pwd.prop('type', 'password')
      }
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
.findpwd-form {
  height: calc(~"100% - .8rem");
  padding: .4rem .3rem .8rem .3rem;
  overflow-x: hidden;
  overflow-y: auto;
}
.findpwd-title {
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
.findpwd-content {
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
      white-space: nowrap;
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
        padding-left: .24rem;
        padding-right: .24rem;
        font-size: .24rem;
        line-height: .8rem;
        vertical-align: middle;
        color: #0471e9;
        text-align: center;
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
        height: .6rem;
        padding: 0;
        margin-left: 5%;
        font-size: .24rem;
        vertical-align: middle;
        background: #fff;
        color: #0471e9;
        border: 1px solid #0471e9;
        &:disabled {
          background-color: #eee;
        }
      }
    }
    &.email {
      margin-top: 0;
    }
    &.button {
      margin-top: .8rem;
      button {
        height: .8rem;
        font-size: .3rem;
        background: #0471e9;
        color: #fff;
        border: 1px solid #0471e9;
      }
      button.disabled{background-color: #999;color:#FFF;border-color:#999;}
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
