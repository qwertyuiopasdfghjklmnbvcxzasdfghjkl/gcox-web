<template>
  <div class="page page-reg-bg">
    <cp-top-back :backPage="'exchange'" :showRight="false" class="page-top-bg">
      <router-link tag="span" class="btn-register" :to="{name:'page-register'}">{{$t('exchange.exchange_not_account')}}<!--立即注册--></router-link>
    </cp-top-back>

    <div class="login-form">
      <h3 class="login-title">
        <i></i>
        <!--<span>{{$t('login_register.title_login').format(brand)}}&lt;!&ndash;欢迎来到NEWTON&ndash;&gt;</span>-->
      </h3>
      <div class="login-content">
        <div class="login-content-inner">
          <div class="login-content-input username">
            <input type="text" name="username" v-model="formData.username" :placeholder="`${$t('otc_exchange.otc_exchange_Email')}/${$t('account.user_center_phone')}`"><!--邮箱/手机号-->
          </div>
          <div class="login-content-input password">
            <input type="password" name="password" v-model="formData.password" :placeholder="$t('exchange.exchange_password')" maxlength="16"><!--密码-->
            <i class="hidden" v-tap="{methods: resetPW}"></i>
          </div>
          <div class="login-content-button">
            <mt-button type="primary" :class="{disabled:locked||gtLocked}" size="large" @click="login">{{$t('login_register.login')}}<!--登录--></mt-button>
          </div>
          <div class="login-content-link forget_pd">
            <router-link tag="span" :to="{name:'findpwd'}">{{$t('login_register.forget_password')}}<!--忘记密码--></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tip from '@/assets/js/tip'
import config from '@/assets/js/config'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
export default {
  name: 'login',
  data () {
    return {
      brand: config.brand.toUpperCase(),
      locked: false, // 锁
      gtLocked: false,
      formData: {
        username: '',
        password: ''
      },
      account: '',
      password: ''
    }
  },
  created () {
    this.$nextTick(() => {
      setTimeout(() => {
        $('.login-form input[name=username]').focus()
      }, 500)
    })
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    resetPW (arg) {
      let pwd = $(".login-form").find("input[name=password]")
      if (pwd.next().hasClass('hidden')) { // 如果密码不可见
        pwd.next().removeClass('hidden').addClass('visible') // 密码可见
        pwd.prop('type', 'text')
      } else {
        pwd.next().removeClass('visible').addClass('hidden') // 密码不可见
        pwd.prop('type', 'password')
      }
    },
    login (args) {
      if (!this.$root.trim(this.formData.username,1)) {
        Tip({type: 'danger', message: this.$t('public0.public246')})
        $('.login-form input[name=username]').focus()
        return
      }
      if (!this.formData.password) {
        Tip({type: 'danger', message: this.$t('login_register.password')})
        $('.login-form input[name=password]').focus()
        return
      } else {
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
                name: 'page-twoverify',
                params: {
                  username: this.formData.username,
                  type: res.type,
                  countryCode: res.countryCode,
                  mobile: res.mobile
                }
              })
            }, (msg, rst) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
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
.btn-register {
  position: absolute;
  top: .2rem;
  right: .3rem;
  height: .4rem;
  font-size: .24rem;
  line-height: .4rem;
  color: #fff;
  &:active{
    color: #0072fd;
  }
}
.login-form {
  height: calc(~"100% - .8rem");
  padding: .8rem .3rem;
  overflow-x: hidden;
  overflow-y: auto;
}
.login-title {
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
.login-content {
  padding: .8rem .4rem .3rem;
  margin-top: .4rem;
  background-color: #fff;
  border-radius: .1rem;
  &-input {
    &.password {
      position: relative;
      margin-top: .4rem;
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
        border-bottom-color: #0072fd;
      }
    }
    i {
      position: absolute;
      top: .2rem;
      right: 0;
      width: .4rem;
      height: .4rem;
      background: none no-repeat center center / contain;
    }
    i.visible {
      background-image: url('../assets/img/key.png');
    }
    i.hidden {
      background-image: url('../assets/img/reset-password@3x.png');
    }
  }
  &-button {
    margin-top: .8rem;
    button {
      height: .8rem;
      font-size: .3rem;
      background: #0072fd;
      color: #fff;
      border: 0;
    }
    button::after{
      background-color: #999;
    }
    button.disabled{
      background-color: #999;
      color:#FFF;
      border-color:#999;
    }
  }
  &-link {
    height: .8rem;
    font-size: .3rem;
    line-height: .8rem;
    color: #0072fd;
    text-align: right;
  }
  .forget_pd{
    text-align: center;
    color: #000;
    font-size: .24rem;
    margin-top: .3rem;
  }
}
</style>
