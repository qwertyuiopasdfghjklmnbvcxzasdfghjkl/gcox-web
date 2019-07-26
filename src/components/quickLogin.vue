<template>
	<div class="login-box">
		<div header="" class="ui-flex">
			<div class="ui-flex-1 efont">{{$t('login_register.login')}}<!-- 登录 --></div>
			<div class="register border-bg-box" @click="goRouter('register')">
				<div class="text efont f-c-main">{{$t('login_register.register')}}<!-- 注册 --></div>
				<div class="border-bg"></div>
			</div>
		</div>
		<form autocomplete="off">
			<div form="">
				<input type="text" name="name" value="" style="position: absolute; top: -100px; height: 0px; width: 0px; opacity: 0;">
				<div class="form-item">
					<input type="text" name="username" class="f-input-1" :class="{efont:!formData.username}" v-model="formData.username" maxlength="60" v-validate="'required|email'" :placeholder="$t('account.user_center_account')" v-focus> <!--email-->
				</div>
				<div class="error-msg-box">
					<div class="error-msg">{{ msgs['username'][errors.firstRule('username')]}}</div>
				</div>
				<div class="form-item">
					<input :type="showPass?'text':'password'" name="password" class="f-input-1" :class="{efont:!formData.password}" v-model="formData.password" maxlength="256" v-validate="'required'" :placeholder="$t('exchange.exchange_password')"> <!--密码-->
					<div class="show-pwd-box">
					  <div class="pwd-isShow" @click="showPass=!showPass">
					    <img src="../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPass">
					    <img src="../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
					  </div>
					</div>
				</div>
				<div class="error-msg-box">
					<div class="error-msg">{{ msgs['password'][errors.firstRule('password')]}}</div>
				</div>
				<div class="form-item" v-if="needGoogleCode">
					<input type="text" name="googleCode" :class="{efont:!formData.googleCode}" v-model="formData.googleCode" maxlength="6" v-validate="'required|length:6'" :placeholder="$t('account.user_center_Google_verification_code')"> <!--谷歌验证码-->
				</div>
				<div class="error-msg-box" v-if="needGoogleCode">
					<div class="error-msg">{{errors.has('googleCode')?$t('login_register.inputGoogleAuthCode'):null}}</div>
				</div>
			</div>
			<div class="ui-flex">
				<div class="ui-flex-1"> </div>
				<div forgot="" @click="goRouter('findpwd')"> 忘记密码？ </div>
			</div>
			<div class="mt30 text-right">
				<button type="button" class="mint-btn primary middle round" style="width: 90px;" :disabled="errors.any()" @click="login">{{$t('login_register.login')}}<!-- 登录 --></button>
			</div>
		</form>
    <div class="mask-layer ui-flex ui-flex-center ui-flex-column" v-show="locked">
      <loading/>
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
      needGoogleCode:false,
      formData: {
        username: '',
        password: '',
        googleCode:''
      }
    }
  },
  computed: {
    msgs () {
      return {
        username: {required: this.$t('login_register.email_account'), email:this.$t('login_register.valid_email_account')}, // 请输入邮箱账号
        password: {required: this.$t('login_register.password')}, // 请输入密码
      }
    }
  },
  created () {

  },
  methods: {
    ...mapActions(['setApiToken']),
    goRouter(target){
    	window.vm.$router.push({name:target})
    	this.$emit('removeDialog')
    },
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
              	window.noLoginRedirect = true
              	this.$emit('removeDialog')
                this.setApiToken(apiToken)
                myAPi.addLoginHistory()
                return
              }
            }, (msg, rst) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
              if (msg === 'verify_email_required') {
                window.vm.$router.push({name: 'sendemail', params: {email: this.formData.username}})
              } else if (msg === 'invalid_totp') {
                this.needGoogleCode = true
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

<style lang="less" scoped="">
.login-box {
	width: 570px;
	box-sizing: border-box;
    padding: 30px;
    color: #606266;
	font-size: 14px;
	word-break: break-all;
	background-color:#fff;
	border-radius: 4px;
    [header] {
        height: 50px;
        padding: 8px 0;
        line-height: 34px;
        box-sizing: border-box;
        >div:first-child {
            font-size: 18px;
            color: #3b383d;
        }
    }
    .border-bg-box {
        position: relative;
        padding-right: 15px;
        .text {
            line-height: 36px;
            font-size: 12px;
            margin-right: 5px;
        }
        .border-bg {
            background: url('../assets/img/border-bg.png') no-repeat 100%;
            background-size: 31px 35px;
            cursor: pointer;
            width: 31px;
            height: 35px;
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    [form] .form-item {
        position: relative;
        border-bottom: 1px solid hsla(240,1%,60%,.45);
        height: 50px;
        padding-top: 20px;
        box-sizing: border-box;
        overflow: hidden;
        input {
            height: 30px;
            line-height: 30px;
            border: none;
            width: 100%;
            outline: none;
        }
    }
    .error-msg-box {
        height: 20px;
        margin-top: 5px;
        .error-msg {
            line-height: 20px;
            color: #f1304a;
            font-size: 12px;
        }
    }
    [forgot] {
        color: #00a0e9;
        cursor: pointer;
        text-align: right;
        font-size: 13px;
    }
}
.f-input-1, .f-input-2 {
    width: 100%;
    padding-top: 5px;
    font-size: 12px;
    border: 0;
    min-height: 30px;
    line-height: 30px;
    background-color: transparent;
}
.show-pwd-box {
    position: absolute;
    right: 5px;
    bottom: 26px;
}
.pwd-isShow {
    position: absolute;
    right: 5px;
    top: 6px;
    img {
        width: 20px;
        cursor: pointer;
    }
}
</style>
