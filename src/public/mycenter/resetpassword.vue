<template>
  <!--重置密码-->
  <div class="cont">
    <p>{{$t('usercontent.user49')}}{{$t('usercontent.user39')}}</p>
    <div class="form-item">
      <p>{{$t('usercontent.user50')}}</p>
      <input :type="showPass?'text':'password'" name="password" :class="{efont:!formData.password}"
             v-model="formData.password" maxlength="256" v-validate="'required|password'"> <!--密码-->
      <div class="show-pwd-box">
        <div class="pwd-isShow" @click="showPass=!showPass">
          <img src="../../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPass">
          <img src="../../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
        </div>
      </div>
    </div>
    <div class="error-msg">{{ msgs['password'][errors.firstRule('password')]}}</div>

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
    name: 'resetpassword',
    data () {
      return {
        showPass: false,
        showNewPass: false,
        showPassConfig: false,
        locked: true,
        formData: {
          password: '',
          newPassword: '',
          passwordConfirm: ''
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang']),
      msgs () {
        return {
          password: {required: this.$t('login_register.password'), password: this.$t('login_register.gcoxPWReg')}, // 密码至少8位，包括大、小写字母、数字及以下特殊字符 !@#$%^&*+=
          newPassword: {required: this.$t('usercontent.user53'), newPassword: this.$t('login_register.gcoxPWReg')}, // 密码至少8位，包括大、小写字母、数字及以下特殊字符 !@#$%^&*+=
          passwordConfirm: {required: this.$t('usercontent.user54'), passwordConfirm: this.$t('public0.public124')} // 请输入密码|密码不匹配，请重新输入
        }
      }
    },
    created () {
    },
    methods: {
      ...mapActions(['setApiToken']),
      submit () {
        this.$validator.validateAll(this.formData).then(v => {
          if (v && this.locked) {
            this.locked = false
            let data = {}
            data.password = this.formData.password
            data.passwordNew = this.formData.newPassword
            if (this.getUserInfo.googleAuthEnable === 1) {
              utils.setDialog(googleVerify, {
                state: 2,
                okCallback: (res) => {
                  data.googleCode = res
                  this.changePassword(data)
                }
              })
            } else {
              this.changePassword(data)
            }
          }
        })
      },
      changePassword (formData) {
        userApi.getRsaPublicKey(rsaPublicKey => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.passwordNew = utils.encryptPwd(rsaPublicKey, formData.passwordNew)
          formData.rsaPublicKey = rsaPublicKey
          userApi.changePwd(formData, msg => {
            this.locked = true
            this.setApiToken(null)
            Vue.$koallTipBox({
              icon: 'success',
              message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
            })
            this.$router.push({name: 'login'})
          }, msg => {
            this.tip(msg)
          })
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
    &>p{
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
