<template>
  <div class="page">
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="box">
      <div class="inner">
        <h1 v-if="googleState === 0">{{$t('account.user_bind_google_authentication')}}<!--绑定谷歌验证--></h1>
        <h1 v-if="googleState === 1">{{$t('account.user_unbind_google_authentication')}}<!--解除谷歌验证--></h1>
        <!--1、绑定谷歌验证-->
        <div v-if="googleState === 0" class="bindgoole-form">
          <div class="my-item one">
            <div class="bind-qrcode">
              <div class="bind-qrcode-img" ref="qrcode"><!--谷歌验证二维码--></div>
            </div>
            <p><span>{{$t('account.user_center_backup_key')}}：<!--密钥--></span><span>{{bindGoogleFormData.key}}</span><i class="cop_icon" @click="copy"></i></p>
            <p>（{{$t('public0.public240')}}）<!--强烈建议备份此密钥--></p>
          </div>
          <div class="my-item">
            <p class="line">
              <input name="password" type="password" v-model="bindGoogleFormData.password" :placeholder="$t('account.user_center_login_password')"><!--登录密码-->
            </p>
          </div>
          <div class="my-item">
            <p class="line">
              <input name="verifyCode" v-model="bindGoogleFormData.verifyCode" :placeholder="$t('account.user_center_Google_verification_code')"><!--谷歌验证码-->
            </p>
          </div>
        </div>

        <!--2、解除谷歌验证-->
        <div v-if="googleState === 1" class="unbindgoole-form">
            <div class="my-item">
              <p class="line">
                <input name="password" type="password" v-model="unbindGoogleFormData.password" :placeholder="$t('account.user_center_login_password')"><!--登录密码-->
              </p>
            </div>
            <div class="my-item">
              <p class="line">
                <input name="verifyCode" v-model="unbindGoogleFormData.verifyCode" :placeholder="$t('account.user_center_Google_verification_code')"><!--谷歌验证码-->
              </p>
            </div>
        </div>

        <footer>
          <button v-if="googleState === 0" class="c-button c-button-normal c-button-blue" @click="bindGoogleAuth">{{$t('account.user_center_operate_bind')}}<!--绑定--></button>
          <button v-if="googleState === 1" class="c-button c-button-normal c-button-blue" @click="unbindGoogleAuth">{{$t('account.user_center_operate_unbind')}}<!--解绑--></button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast } from 'mint-ui'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import userApi from '@/api/individual'
import myApi from '@/api/user'
export default {
  name: 'page-bindgoogle',
  data () {
    return {
      googleState: 0, // 是否绑定验证
      showUnbindGoogleButton: false, // 默认不显示 解绑谷歌验证按钮
      showUnbindGoogleForm: false, // 默认不显示 解绑谷歌验证表单
      pwdLevel: null, // 登录密码等级
      delayedShow: false, // 延迟显示
      bindGoogleFormData: { // 绑定
        key: '',
        verifyCode: '',
        password: ''
      },
      unbindGoogleFormData: { // 解绑
        verifyCode: '',
        password: ''
      },
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    pwdLevelInfo () { // 登录密码安全等级
      if (this.pwdLevel === 2) {
        return {
          css: 'middle',
          text: this.$t('public0.public194_Medium') // 中
        }
      } else if (this.pwdLevel === 3) {
        return {
          css: 'high',
          text: this.$t('public0.public194_High') // 高
        }
      } else {
        return {
          css: 'low',
          text: this.$t('public0.public194_Low') // 低
        }
      }
    }
  },
  created () {
    this.fnUserState()
  },
  methods: {
    copy () {
      Toast(this.$t('public0.public33'));
      utils.copyText(this.bindGoogleFormData.key)
    },
    fnUserState () { // 获取当前用户状态信息
      userApi.getUserState((data) => {
        this.googleState = data.googleState
        this.pwdLevel = Number(data.passwdLevel)
        /*this.showUnbindGoogleButton = data.googleState === 1*/
        if (data.googleState === 0) { // 未绑定谷歌验证码
          userApi.createGoogleKey((res) => {
            this.bindGoogleFormData.key = res.key
            var qrCode = `otpauth://totp/${res.company}:${this.getUserInfo.username}?secret=${res.key}&issuer=${res.company}`
            utils.qrcode(this.$refs.qrcode, {
              width: 200,
              height: 200,
              text: qrCode
            })
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        }
        this.delayedShow = true // 延迟显示
      }, (msg) => {
        console.error(msg)
      })
    },
    bindGoogleAuth () { // 绑定谷歌二次验证
      if (!this.$root.trim(this.bindGoogleFormData.password, 1)) {
        Tip({type: 'danger', message: this.$t('login_register.password')})
        $('.bindgoole-form input[name=password]').focus()
        return
      } else if (!this.$root.isNumbers(this.bindGoogleFormData.verifyCode)) {
        Tip({type: 'danger', message: this.$t('error_code.NUMERIC')})
        $('.bindgoole-form input[name=verifyCode]').focus()
        return
      } else {
        let formData = {}
        for (let i in this.bindGoogleFormData) {
          formData[i] = this.bindGoogleFormData[i]
        }
        myApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.rsaPublicKey = rsaPublicKey
          userApi.bindGoogleAuth(formData, (msg) => {
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            this.bindGoogleFormData = {key: '', verifyCode: '', password: ''}
            this.fnUserState()
            this.$router.push({name: 'page-ucenter'})
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        })
      }
    },
    unbindGoogleAuth () { // 解除谷歌二次验证
      if (!this.$root.trim(this.unbindGoogleFormData.password, 1)) {
        Tip({type: 'danger', message: this.$t('login_register.password')})
        $('.unbindgoole-form input[name=password]').focus()
        return
      } else if (!this.$root.isNumbers(this.unbindGoogleFormData.verifyCode)) {
        Tip({type: 'danger', message: this.$t('error_code.NUMERIC')})
        $('.unbindgoole-form input[name=verifyCode]').focus()
        return
      } else {
        let formData = {}
        for (let i in this.unbindGoogleFormData) {
          formData[i] = this.unbindGoogleFormData[i]
        }
        myApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.rsaPublicKey = rsaPublicKey
          userApi.unbindGoogleAuth(formData, (msg) => {
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            this.unbindGoogleFormData = {verifyCode: '', password: ''}
            this.fnUserState()
            this.showUnbindGoogleForm = false
            this.$router.push({name: 'page-ucenter'})
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .one{
    text-align: center;
    .bind-qrcode{
      width: 2.1rem;
      height: 2.1rem;
      background: #d9edf7;
      display: inline-block;
      padding: .1rem;
      span{
        color: #1b1e2e;
      }
    }
    p:nth-of-type(1){
      margin-top: .4rem;
      span:first-child{

      }
      span:nth-child(2){
        margin-left: .2rem;
        color: #cbd4ec;
        font-weight: bold;
      }
    i.cop_icon{
      margin-left: .2rem;
      width: 0.36rem;
      height: 0.36rem;
      display: inline-block;
      background: url('../../assets/img/i_copy.png') no-repeat center;
      background-size: 100% 100%;
    }
    }
    p:nth-of-type(2){
      margin-top: .2rem;
    }

  }

  footer{
    p{
      line-height: .6rem;
      color: #8089a3;
      font-size: .23rem;
    }
    margin-top: 1rem;
  }
  .c-button-normal{
    display: inline-block;
    padding: 0 .12rem;
    width: 100%;
  }
  .c-button{
    font-size: .26rem;
    appearance: none;
    border-radius:.05rem;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    height: .75rem;
    line-height: .75rem;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
  }
  .c-button-blue{
    color: #fff;
    background-color: #0072fd;
  }
.form-row{
  display: flex;
  margin-top: .3rem;
  .row-description{
     p{
       padding-left: .2rem;
     }
  }
  .row-file
  {
    .for-label{
    }
  }
}
  .form-row .row-file img{width: 2.24rem;height: 100%;
  }
  .form-row .row-file-input{position: absolute;top: 0;left: 0;width: 140px;height: 140px;
  }
  .form-row .row-file-input input{width: 100%;height: 100%;opacity: 0;cursor: pointer;
  }
  .form-row .row-file-prompt{height: 30px;line-height: 30px;color: #becbe8;white-space: nowrap;
  }
  .form-row .row-file-prompt.error{color: #e53f3f;
  }

  .page{
    bottom:initial;
    height: 100vh;
    overflow-y: auto;
    position: relative;
  }
  .box{
    .inner{
      >h1{
        font-size: 0.36rem;
      }
      padding: .3rem;
      font-size: .3rem;
    }
  }

.my-item{
  font-size: .24rem;
   h1{
     margin-top: .5rem;
     font-size: .3rem;
     color: #cbd4ec;
   }
   color: #8089a3;
    input{
      background: transparent;
      border: 0;
      font-size: .3rem;
      color: white;
      height: .8rem;
      width: 100%;
    }
  input::placeholder{
    color:#8089a3;
  }
  p.line{
    margin-top: .5rem;
    border-bottom: .01rem solid #8089a3;
}
  .msg{
    font-size: .24rem;
    color: #8089a3;
    margin-top: .2rem;
  }
}
  .my-item:nth-of-type(1){
    margin-top: .7rem;
  }
</style>
