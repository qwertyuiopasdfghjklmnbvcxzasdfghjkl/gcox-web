<template>
  <div class="page">
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="box">
      <div class="inner">
        <h1 v-if="mobileState === 0">{{$t('account.user_bind_SMS_verification')}}<!--绑定短信认证--></h1>
        <section class="phone_header" v-if="mobileState === 1">
          <h1>{{$t('account.user_unbind_SMS_verification')}}<!--解除短信认证--></h1>
          <p>（{{$t('public0.public245')}}）<!--为了您的资产安全，不建议您解除手机短信验证码功能。--></p>
        </section>
        <!--1、绑定短信认证-->
        <div class="unbindgoole-form">
          <div class="my-item phoneNumber" v-if="mobileState === 0">
            <p class="line">
              <select v-model="mobileFormData.countryCode">
                <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}<!--中国大陆-->&nbsp;{{item.code}}</option>
              </select>
              <input type="text" name="phoneNumber" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'" :placeholder="$t('account.user_center_phone')" maxlength="11"><!--手机号-->
            </p>
          </div>
          <div class="my-item">
            <p class="line">
              <input name="phonepassword" v-model="mobileFormData.phonepassword" v-validate="'required'" type="password" :placeholder="$t('account.user_center_login_password')"><!--登录密码-->
            </p>
          </div>
          <div class="my-item smscodediv">
            <p class="line">
              <input name="smsCode" maxlength="6" v-model="mobileFormData.smsCode" v-validate="'required|pInteger'" :placeholder="$t('account.user_center_SMS_code')"><!--短信验证码-->
              <mt-button type="primary" size="small" :disabled="disabled" v-tap="{methods: sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
            </p>
          </div>
        </div>
        <footer>
          <button class="c-button c-button-normal c-button-blue" v-tap="{methods: bindMobile}">{{mobileState === 0 ? $t('account.user_center_operate_bind') : $t('account.user_center_operate_unbind')}}<!--绑定--></button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tip from '@/assets/js/tip'
import commonConfig from '@/assets/js/commonConfig'
import utils from '@/assets/js/utils'
import myApi from '@/api/user'
import userApi from '@/api/individual'
export default {
  name: 'page-bindphone',
  data () {
    return {
      mobileState: 0, // 1 已经绑定  0 未绑定
      disabled: false,
      time: 60,
      areaCodeList: commonConfig.areaCodeList,
      mobileFormData: {
        countryCode: commonConfig.defaultCode,
        phoneNumber: '',
        phonepassword: '',
        smsCode: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    msgs () {
      return {
        phoneNumber: {required: this.$t('public0.public6')}, // 请输入手机号
        phonepassword: {required: this.$t('login_register.password')}, // 请输入密码
        smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
      }
    }
  },
  created () {
    this.fnUserState()
  },
  methods: {
    fnUserState () {
      userApi.getUserState((data) => {
        this.mobileState = data.mobileAuthState
        if(this.mobileState === 1){
          this.getMyUserInfo ()
        }
      }, (msg) => {
        console.error(msg)
      })
    },
    bindMobile () {
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
        let formData = {}
        for (let i in this.mobileFormData) {
          formData[i] = this.mobileFormData[i]
        }
        formData.password = formData.phonepassword
        delete formData.phonepassword
        myApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.rsaPublicKey = rsaPublicKey
          if (Number(this.mobileState) === 1) {
            userApi.unbindMobile(formData, (msg) => {
              this.showBindMobile = false
              this.disabled = false
              Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
              this.mobileFormData = {
                countryCode: commonConfig.defaultCode,
                phoneNumber: '',
                phonepassword: '',
                smsCode: ''
              }
              this.fnUserState()
              this.getMyUserInfo()
            }, (msg) => {
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            })
            return
          }
          userApi.bindMobile(formData, (msg) => {
            this.showBindMobile = false
            this.disabled = false
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            setTimeout(()=>{
              this.$router.push({name: 'page-ucenter'})
            },1000)
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        })
      })
    },
    getMyUserInfo () {
      myApi.getUserInfo((res) => {
        this.mobileFormData.phoneNumber = res.mobile
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      } else if (this.mobileFormData.phoneNumber === "") {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      }
      this.disabled = true
      userApi.sendAuthSMSCode({
        countryCode: this.mobileFormData.countryCode,
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
        this.time = 60
        setTimeout(timeOut, 1000)
        Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')}) // 验证码发送成功
      }, (msg) => {
        this.disabled = false
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
}
</script>

<style lang="less" scoped>
.phone_header{
  p{
    font-size: .24rem;
    color: #8089a3;
    margin-top: .3rem;
  }
}

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
      span:nth-child(2){
        margin-left: .2rem;
        color: #cbd4ec;
        font-weight: bold;
      }
      i.cop_icon{
        margin-left: .2rem;
        width: 0.36rem;
        height: 0.4rem;
        display: inline-block;
        background: url('../../assets/img/i_copy_icon.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
    p:nth-of-type(2){
      margin-top: .2rem;
    }
  }

  footer{
    margin-top: 1rem;
    p{
      line-height: .6rem;
      color: #8089a3;
      font-size: .23rem;
    }
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
      padding: .3rem;
      font-size: .3rem;
      section h1{
        font-size: 0.36rem;
      }
      >h1{
        font-size: 0.36rem;
      }
    }
  }

.my-item{
  font-size: .24rem;
  &:first-of-type{
    margin-top: .7rem;
  }
  h1{
    margin-top: .5rem;
    font-size: .3rem;
    color: #cbd4ec;
  }
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
    position: relative;
    margin-top: .5rem;
    border-bottom: .01rem solid #8089a3;
  }
  .msg{
    font-size: .24rem;
    color: #8089a3;
    margin-top: .2rem;
  }
}
.my-item.phoneNumber{
  p {
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
      background-image: url(../../assets/img/down-icon-8089a3@3x.png);
    }
    input {
      padding-left: 40%;
      text-indent: .12rem;
    }
  }
}

.smscodediv{
  .sendbtn {
    color: white;
    background: #0072fd;
  }
  .disabled{
    background: #8089a3;
  }
  p {
    font-size: 0;
    line-height: 0;
    border-width: 0 !important;
  }
  input {
    width: 55%;
    vertical-align: middle;
    border-bottom: 1px solid #8089a3;
  }
  button {
    width: 40%;
    height: .75rem;
    padding: 0;
    margin-left: 5%;
    font-size: .24rem;
    vertical-align: middle;
    background: #0072fd;
    &:disabled {
      background-color: #999;
    }
  }
}
</style>
