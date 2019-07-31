<template>
    <div class="register">
      <div class="header ui-flex">
        <div class="ui-flex-1 efont">{{$t('login_register.register')}}<!-- 注册 --></div>
        <router-link :to="{name:'login'}" class="login border-bg-box" tag="div">
          <div class="text efont">{{$t('login_register.login')}}<!-- 登录 --></div>
          <div class="border-bg"></div>
        </router-link>
      </div>
      <div form autocomplete="off" onsubmit="return false">
        <div class="mt50 form-item">
          <input type="text" name="username" :class="{efont:!formData.username}" v-model="formData.username" maxlength="60" v-validate="'required|email'" :placeholder="$t('otc_exchange.otc_exchange_Email')"> <!--email-->
        </div>
        <div class="error-msg">{{ msgs['username'][errors.firstRule('username')]}}</div>
        <div class="form-item">
          <input uid="GCOX-password" :type="showPass?'text':'password'" name="password" :class="{efont:!formData.password}"
                 v-model="formData.password" maxlength="256" v-validate="'required|password'" :placeholder="$t('exchange.exchange_password')"> <!--密码-->
          <div class="show-pwd-box">
            <div class="pwd-isShow" @click="showPass=!showPass">
              <img src="../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPass">
              <img src="../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
            </div>
          </div>
        </div>
        <div class="error-msg">{{ msgs['password'][errors.firstRule('password')]}}</div>
        <div class="form-item">
          <input :type="showPassConfig?'text':'password'" name="passwordConfirm" :class="{efont:!formData.passwordConfirm}"
                 v-model="formData.passwordConfirm" maxlength="256" v-validate="'required|passwordAgain'" :placeholder="$t('login_register.confirm_password')"> <!--密码-->
          <div class="show-pwd-box">
            <div class="pwd-isShow" @click="showPassConfig=!showPassConfig">
              <img src="../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPassConfig">
              <img src="../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
            </div>
          </div>
        </div>
        <div class="error-msg">{{ msgs['passwordConfirm'][errors.firstRule('passwordConfirm')]}}</div>
        <div class="form-item">
          <input type="text" name="ref" :class="{efont:!formData.ref}" v-model="formData.ref" maxlength="256" :placeholder="$t('public0.public244')"> <!--邀请码-->
        </div>
        <div class="checkbox-group mt30">
            <i :class="[checked?'icon-checkbox-checked':'icon-checkbox-unchecked']" @click="checked=!checked"></i>
            <span>
              <em @click="checked=!checked">{{$t('login_register.agree_Service')}}<!--我已阅读并同意--></em>
              《<a :href="walletAgreement" target="_blank">钱包使用条款<!--钱包使用条款--></a>》、《<a :href="useAgreement" target="_blank">使用条款<!--使用条款--></a>》、《<a :href="privacyAgreement" target="_blank">隐私条款<!--隐私条款--></a>》
            </span>
        </div>
        <div class="text-right mt60"><button type="button" class="mint-btn default round efont" style="width: 140px;" :disabled="!checked" @click="register">{{$t('login_register.register')}}<!-- 注册 --></button></div>
      </div>
      <div class="mask-layer ui-flex ui-flex-center ui-flex-column" v-show="locked">
        <loading/>
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
  name:'register',
  data () {
    return {
      locked: false,
      gtLocked: false,
      checked: false,
      showPass:false,
      showPassConfig:false,
      formData: {
        email:'',
        username: '',
        password: '',
        passwordConfirm: '',
        ref: '',
        redirectUrl:`${Config.origin}/login`
      },
      time: 60
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        username: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')}, // 请输入邮箱||邮箱格式错误
        password: {required: this.$t('login_register.password'), password:this.$t('login_register.gcoxPWReg')}, // 密码至少8位，包括大、小写字母、数字及以下特殊字符 !@#$%^&*+=
        passwordConfirm: {required: this.$t('login_register.password'), passwordAgain:this.$t('public0.public124')} // 请输入密码|密码不匹配，请重新输入
      }
    },
    walletAgreement () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://gcoxgroup.com/wallet_tnc.html'
      } else {
        return 'https://gcoxgroup.com/wallet_tnc.html'
      }
    },
    useAgreement () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://gcoxgroup.com/terms_of_use.html'
      } else {
        return 'https://gcoxgroup.com/terms_of_use.html'
      }
    },
    privacyAgreement () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://gcoxgroup.com/privacy_policy.html'
      } else {
        return 'https://gcoxgroup.com/privacy_policy.html'
      }
    },
  },
  watch: {
    $route () {
      this.formData.ref = utils.getUrlHashParams().ref
    }
  },
  created () {
    this.formData.username = this.$route.query.email
    this.formData.ref = utils.getUrlHashParams().ref
  },
  methods: {
    register () {
      let formData = {}
      this.formData.email = this.formData.username
      for (let i in this.formData) {
        formData[i] = this.formData[i]
      }
      formData.lang = this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en'
      this.$validator.validateAll(formData).then((validResult) => {
        if (!validResult) {
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
              Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
              setTimeout(() => {
                this.$router.push({name: 'sendemail', params:{email:this.formData.email}})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
            })
          }, () => {
            this.locked = false
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
.show-pwd-box {
  position: absolute;
  right: 5px;
  bottom: 26px;
  .pwd-isShow{
    position: absolute;
    right: 5px;
    top: 6px;
    img {
      width: 20px;
      cursor: pointer;
    }
  }
}

.checkbox-group{overflow: auto; color: #888;}
.checkbox-group i{float: left;width: 14px;height: 14px;margin-top: 8px;color: #888;text-indent: 1px;cursor: pointer;}
.checkbox-group i:hover{color: #888;}
.checkbox-group i.icon-checkbox-checked {color: #00A0E9;}
.checkbox-group span{float: left;width: 630px;min-height: 30px;padding-left: 8px;line-height: 30px;}
.checkbox-group span a{color: #00A0E9;text-decoration: underline;}
.checkbox-group span a:hover{color: #00A0E9;}
</style>

