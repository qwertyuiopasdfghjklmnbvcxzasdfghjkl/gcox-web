<template>
	<div class="login-box">
    <p class="text-center fs16" header>{{$t('account.user_center_Google_verification_code')}}</p>
    <div form>
      <p class="f-c-gray">{{$t('login_register.inputGoogleAuthCode')}}</p>
      <p class="mt10">
        <input class="googleCode" type="number" oninput="if(value.length>6)value=value.slice(0,6)" name="googleCode" v-model="formData.googleCode">
      </p>
      <p class="mt40 text-center">
        <button type="button" class="mint-btn primary round" style="min-width: 100px;" :disabled="formData.googleCode==='' || locked" @click="login">{{$t('usercontent.user32')}}</button>
      </p>
    </div>
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
  props:['params'],
  data () {
    return {
      locked: false,
      gtLocked: false,
      needGoogleCode:true,
      formData: {
        username: '',
        password: '',
        googleCode:''
      }
    }
  },
  created () {
    this.formData.username = this.params.username
    this.formData.password = this.params.password
  },
  methods: {
    ...mapActions(['setApiToken']),
    goRouter(target){
    	window.vm.$router.push({name:target})
    	this.$emit('removeDialog')
    },
    login () {
      if (this.locked) {
        return
      }
      let formData = {}
      for (let i in this.formData) {
        formData[i] = this.formData[i]
      }
      this.loginAC(formData)
    },
    loginAC(formData){
      this.locked = true
      userApi.getRsaPublicKey((rsaPublicKey) => {
        formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
        formData.rsaPublicKey = rsaPublicKey
        userApi.login(formData, (apiToken, res) => {
          if (apiToken) {
            if(window.vm.$route.name!=='login' && window.vm.$route.name!=='register'){
              window.noLoginRedirect = true
            }
            this.$emit('removeDialog')
            this.setApiToken(apiToken)
            myAPi.addLoginHistory()
            return
          }
        }, (msg, rst) => {
          this.locked = false
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
          if (msg === 'verify_email_required') {
            this.$emit('removeDialog')
            window.vm.$router.push({name: 'sendemail', query: {email: this.formData.username}})
          }
        })
      }, () => {
        this.locked = false
      })
    }
  }
}
</script>

<style lang="less" scoped="">
.login-box {
	width: 390px;
	box-sizing: border-box;
	font-size: 14px;
	word-break: break-all;
	background-color:#fff;
	border-radius: 4px;
  [header] {
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      border-bottom:1px solid #A1A1A3;
  }
  [form] {
      padding: 30px 15px 40px;
  }
  .googleCode {
    width: 100%;
    height: 40px;
    border:1px solid rgba(161,161,163,1);
    border-radius:3px;
    box-sizing: border-box;
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
  }
}
    
</style>
