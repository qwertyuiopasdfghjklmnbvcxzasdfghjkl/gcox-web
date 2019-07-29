<template>
  <!--资金密码管理-->
  <div class="cont">
    <p>{{$t('usercontent.user49')}}{{$t('usercontent.user40')}}</p>

    <div class="form-item">
      <p>{{$t('usercontent.user51')}}</p>
      <input uid="GCOX-newPassword" :type="showNewPass?'text':'password'" name="newPassword"
             :class="{efont:!formData.newPassword}"
             v-model="formData.newPassword" maxlength="256" v-validate="'required|newPassword'"> <!--密码-->
      <div class="show-pwd-box">
        <div class="pwd-isShow" @click="showNewPass=!showNewPass">
          <img src="../../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showNewPass">
          <img src="../../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
        </div>
      </div>
    </div>
    <div class="error-msg">{{ msgs['newPassword'][errors.firstRule('newPassword')]}}</div>

    <div class="form-item">
      <p>{{$t('usercontent.user52')}}</p>
      <input :type="showPassConfig?'text':'password'" name="passwordConfirm" :class="{efont:!formData.passwordConfirm}"
             v-model="formData.passwordConfirm" maxlength="256" v-validate="'required|passwordConfirm'"> <!--密码-->
      <div class="show-pwd-box">
        <div class="pwd-isShow" @click="showPassConfig=!showPassConfig">
          <img src="../../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPassConfig">
          <img src="../../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
        </div>
      </div>
    </div>
    <div class="error-msg">{{ msgs['passwordConfirm'][errors.firstRule('passwordConfirm')]}}</div>

    <div class="form-item">
      <p>{{$t('usercontent.user61')}}</p>
      <input type="text" name="googleCode" :class="{efont:!formData.googleCode}"
             v-model="formData.googleCode" maxlength="256" v-validate="'required|googleCode'"> <!--谷歌验证码-->
    </div>
    <div class="error-msg">{{ msgs['googleCode'][errors.firstRule('googleCode')]}}</div>

    <!--<div class="form-item">-->
    <!--<p>{{$t('usercontent.user62')}}</p>-->
    <!--<input type="text" name="emailCode" :class="{efont:!formData.emailCode}"-->
    <!--v-model="formData.emailCode" maxlength="256" v-validate="'required|emailCode'"> &lt;!&ndash;邮箱验证码&ndash;&gt;-->
    <!--<div class="sendCode" @click="send()" v-html="sendText"></div>-->
    <!--</div>-->
    <!--<div class="error-msg">{{ msgs['emailCode'][errors.firstRule('emailCode')]}}</div>-->

    <div class="btn-box">
      <button @click="submit()">{{$t('account.user_submit')}}</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import googleVerify from './mycenter/google-verify'
  import utils from '@/assets/js/utils'
  import userApi from '@/api/user'

  export default {
    data () {
      return {
        showPass: false,
        showNewPass: false,
        showPassConfig: false,
        locked: true,
        sendText: this.$t('usercontent.user62'),
        formData: {
          newPassword: '',
          passwordConfirm: '',
          googleCode: '',
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang']),
      msgs () {
        return {
          // password: {required: this.$t('login_register.password'), password: this.$t('login_register.gcoxPWReg')}, // 密码至少8位，包括大、小写字母、数字及以下特殊字符 !@#$%^&*+=
          newPassword: {required: this.$t('usercontent.user53'), newPassword: this.$t('login_register.gcoxPWReg')}, // 密码至少8位，包括大、小写字母、数字及以下特殊字符 !@#$%^&*+=
          passwordConfirm: {required: this.$t('usercontent.user54'), passwordConfirm: this.$t('public0.public124')}, // 请输入密码|密码不匹配，请重新输入
          googleCode: {required: this.$t('usercontent.user65'), googleCode: this.$t('usercontent.user65')}, // 请输入密码|密码不匹配，请重新输入
          // emailCode: {required: this.$t('usercontent.user66'), emailCode: this.$t('usercontent.user66')} // 请输入密码|密码不匹配，请重新输入
        }
      }
    },
    created () {
      this.kycGoogle()
    },
    methods: {
      ...mapActions(['getUserInfo', 'setApiToken']),
      kycGoogle () {
        if (this.getUserInfo.googleAuthEnable === 0) {
          this.$router.push('/mycenter')
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35'), delay: 3000})
        } else if (this.getUserInfo.kycState !== 1) {
          this.$router.push('/mycenter')
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36'), delay: 3000})
        }
      },
      submit () {
        this.$validator.validateAll(this.formData).then(v => {
          if (v && this.locked) {
            this.locked = false
            let data = {}
            data.transactionPassword = this.formData.newPassword
            data.totp = this.formData.googleCode
            this.changePassword(data)
          }
        })
      },
      changePassword (formData) {
        userApi.payPW(formData, res => {
          this.locked = true
          Vue.$koallTipBox({
            icon: 'success',
            message: this.$t(`error_code.${res.msg}`)
          })
          this.$router.push('/mycenter/mycenter')
        }, msg => {
          this.tip(msg)
        })
      },
      tip (msg) {
        Vue.$koallTipBox({
          icon: 'notification',
          message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`),
          delay: 3000
        })
        this.locked = true
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    color: #ffffff;
    background: rgba(27, 26, 31, 0.9);
    padding: 20px;

    & > p {
      padding-bottom: 10px;
    }

    .form-item {
      width: 670px;
      margin: 0 auto;
      padding-top: 12px;
      position: relative;
      border-bottom: 1px solid hsla(240, 1%, 60%, .45);
      min-height: 30px;
      overflow: hidden;

      .sendCode {
        position: absolute;
        right: 0;
        z-index: 9;
        border: 1px solid hsla(240, 1%, 60%, 0.45);
        bottom: 5px;
        padding: 4px 6px;
        color: #979799;
        cursor: pointer;
      }

      p {
        color: #979799;
      }

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
    line-height: 30px;
    color: #f1304a;
    font-size: 12px;
    width: 670px;
    margin: 5px auto;
  }

  .show-pwd-box {
    position: absolute;
    right: 5px;
    bottom: 26px;

    .pwd-isShow {
      position: absolute;
      right: 5px;
      top: 6px;

      img {
        width: 20px;
        cursor: pointer;
      }
    }
  }

  .btn-box {
    width: 670px;
    margin: 0 auto;
    margin-bottom: 20px;

    button {
      margin-top: 20px;
      height: 40px;
      border: 1px solid #4d4a64;
      background-color: #4d4a64;
      cursor: pointer;
      color: #f1f1f2;
      width: 100%;

      &:hover {
        border: 1px solid #4d4a64;
        background-color: #4d4a64;
      }
    }
  }
</style>
