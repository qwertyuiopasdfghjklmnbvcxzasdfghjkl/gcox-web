<template>
    <div class="login">
      <div class="header ui-flex">
        <div class="ui-flex-1">{{$t('login_register.login')}}<!-- 登录 --></div>
        <router-link :to="{name:'register'}" class="register border-bg-box" tag="div">
          <div class="text">{{$t('login_register.register')}}<!-- 注册 --></div>
          <div class="border-bg"></div>
        </router-link>
      </div>
      <div form autocomplete="off" onsubmit="return false">
        <div class="mt50 form-item">
          <input type="text" name="username" v-model="formData.username" maxlength="60" v-validate="'required|email'" :placeholder="$t('account.user_center_account')" v-focus> <!--账号-->
        </div>
        <div class="error-msg">{{ msgs['username'][errors.firstRule('username')]}}</div>
        <div class="form-item">
          <input :type="showPass?'text':'password'" name="password" v-model="formData.password" maxlength="256" v-validate="'required'" :placeholder="$t('exchange.exchange_password')"> <!--密码-->
          <div class="show-pwd-box">
            <div class="pwd-isShow" @click="showPass=!showPass">
              <img src="../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPass">
              <img src="../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
            </div>
          </div>
        </div>
        <div class="error-msg">{{ msgs['password'][errors.firstRule('password')]}}</div>
        <div class="text-right"><router-link :to="{name:'findpwd'}" class="f-c-main f12">{{$t('login_register.forget_password')}}<!-- 忘记密码？ --></router-link></div>
        <div class="text-right mt30"><button type="button" class="mint-btn default round" style="width: 140px;" :disabled="errors.any()" @click="login">{{$t('login_register.login')}}<!-- 登录 --></button></div>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
import utils from '@/assets/js/utils'
export default {
  data () {
    return {
      locked: false,
      gtLocked: false,
      showPass:false,
      formData: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        username: {required: this.$t('login_register.email_account'), email:this.$t('login_register.valid_email_account')}, // 请输入邮箱账号
        password: {required: this.$t('login_register.password')} // 请输入密码
      }
    }
  },
  created () {
    
  },
  methods: {
    ...mapActions(['setApiToken']),
    login () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if (this.locked) {
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
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.rsaPublicKey = rsaPublicKey
            userApi.login(formData, (apiToken, res) => {
              if (apiToken) {
                this.setApiToken(apiToken)
                myAPi.addLoginHistory()
                return
              }
              // 二次验证
              this.$router.push({
                name: 'twoverify',
                params: {
                  username: this.formData.username,
                  type: res.type,
                  countryCode: res.countryCode,
                  mobile: res.mobile
                }
              })
            }, (msg, rst) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
              if (rst === 300) {
                this.$router.push({name: 'sendemail', params: {email: this.formData.username}})
                console.log(this.formData.username)
              }
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
.login {
  width: 670px;
  margin: 0 auto;
  padding-top: 60px;
  margin-bottom: 60px;
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
    .register {
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

</style>
