<template>
  <div class="abcenter register">
    <div class="header ui-flex">
        <div class="ui-flex-1 efont">{{$t('error_code.RESETCODE_FAIL')}}<!-- 重置密码 --></div>
        <router-link :to="{name:'login'}" class="login border-bg-box" tag="div">
          <div class="text efont">{{$t('login_register.login')}}<!-- 登录 --></div>
          <div class="border-bg"></div>
        </router-link>
    </div>
    <div form autocomplete="off" onsubmit="return false">
      <div class="mt45 form-item">
        <input type="text" name="email" :class="{efont:!formData.email}" v-model="formData.email" maxlength="60" v-validate="'required|email'" :placeholder="$t('otc_exchange.otc_exchange_Email')" v-focus> <!--email-->
      </div>
      <div class="error-msg">{{ msgs['email'][errors.firstRule('email')]}}</div>
      <p class="mt10 f-c-green">{{$t('login_register.findPwdTip')}}<!-- 提交之后，您会收到一封关于如何重置密码的说明邮件 --></p>
      <div class="text-right mt30"><button type="button" class="mint-btn default round efont" style="width: 140px;" :disabled="errors.any()" @click="sendMail">{{$t('otc_legal.otc_legal_confirm')}}<!-- 确定 --></button></div>
    </div>
    
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import Config from '@/assets/js/config'
export default {
  data () {
    return {
      locked: false,
      gtLocked: false,
      formData: {
        email: '',
        redirectUrl:`${Config.origin}/#/login`
      }
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        email: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')} // 请输入邮箱||邮箱格式错误
      }
    }
  },
  methods: {
    sendMail () {
      if (this.locked) {
        return
      }
      this.$validator.validateAll(this.formData).then((validResult) => {
        if (!validResult) {
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
          formData.lang = this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en'
          userApi.forgetPwdSendEmail(formData, () => {
            Vue.$koallTipBox({icon: 'success', message: this.$t('login_register.Mail_sent_successfully')}) // 邮件发送成功
            setTimeout(() => {
              this.locked = false
              this.$router.push({name: 'login'})
            }, 1500)
          }, (msg) => {
            this.locked = false
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>
.abcenter {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 670px;
  margin: 0 auto;
}
.register {
  width: 670px;
  margin: 0 auto;
  padding-top: 60px;
  padding-bottom: 60px;
  .header {
    height: 50px;
    padding: 8px 0;
    line-height: 34px;
    div:first-of-type {
      font-size: 20px;
      height: 60px;
      line-height: 60px;
      color: #fff;
    }
    .login {
        position: relative;
        padding-right: 15px;
        .text {
            line-height: 60px;
            font-size: 14px;
            color: #00A0E9;
            margin-right: 15px;
        }
        .border-bg {
            background: url('../assets/img/border-bg.png') no-repeat 100%;
            cursor: pointer;
            width: 50px;
            height: 60px;
            position: absolute;
            right: 0;
            top: 0;
        }
    }
  }
  .form-item {
    position: relative;
    border-bottom: 1px solid hsla(240,1%,60%,.45);
    min-height: 30px;
    padding-top: 0;
    overflow: hidden;
    input {
      height: 30px;
      line-height: 30px;
      border: none;
      width: 100%;
      outline: none;
      background-color: transparent;
      color: #fff;
    }
  }
}
.error-msg {
    height: 30px;
    margin-top: 5px;
    line-height: 30px;
    color: #f1304a;
    font-size: 12px;
}
</style>

