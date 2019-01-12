<template>
  <div class="page">
    <cp-top-back :back="false" :showLogo="true"></cp-top-back>

    <div class="login-form">
      <h3 class="login-title">
        {{$t('error_code.RESETCODE_FAIL')}}<!--重置密码-->
      </h3>
      <div class="login-content">
        <div class="login-content-inner">
          <div class="login-content-input password">
            <input uid="common-password" type="password" ref="password" name="password" v-validate="'required|password'" v-model="formData.password" :placeholder="$t('account.user_center_new_password')"><!--邮箱/手机号-->
            <i class="hidden" v-tap="{methods: resetPW, type: 'password'}"></i>
          </div>
          <div class="login-content-input password">
            <input ref="passwordConfirm" type="password" name="passwordConfirm" v-validate="'required|passwordAgain'" v-model="formData.passwordConfirm" :placeholder="$t('account.user_center_confirm_password')" maxlength="16"><!--密码-->
            <i class="hidden" v-tap="{methods: resetPW, type: 'passwordConfirm'}"></i>
          </div>
          <div class="login-content-button">
            <mt-button type="primary" :class="{disabled:locked}" size="large" @click="resetPwd">{{$t('exchange.exchange_determine')}}<!--确定--></mt-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import Tip from '@/assets/js/tip'
export default {
  name: 'app',
  data () {
    return {
      locked: false,
      formData: {
        resetCode: utils.getUrlHashParams().code,
        password: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordConfirm: {required: this.$t('account.user_center_Please_confirm_password')} // 请再次输入新密码
      }
    }
  },
  methods: {
    resetPW (arg) {
      let pwd = $(this.$refs[arg.type])
      if (pwd.next().hasClass('hidden')) { // 如果密码不可见
        pwd.next().removeClass('hidden').addClass('visible') // 密码可见
        pwd.prop('type', 'text')
      } else {
        pwd.next().removeClass('visible').addClass('hidden') // 密码不可见
        pwd.prop('type', 'password')
      }
    },
    resetPwd () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        let formData = {}
        for (let i in this.formData) {
          formData[i] = this.formData[i]
        }
        userApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
          formData.rsaPublicKey = rsaPublicKey
          userApi.forgetPwdChangePwd(formData, () => {
            Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
            setTimeout(() => {
              this.$router.replace({name: 'login'})
            }, 1500)
          }, (msg) => {
            this.locked = false
            Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            setTimeout(() => {
              this.$router.replace({name: 'findpwd'})
            }, 1500)
          })
        }, () => {
          this.locked = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn-register {
  position: absolute;
  top: .2rem;
  right: .3rem;
  height: .4rem;
  font-size: .24rem;
  line-height: .4rem;
  color: #AEBCE4;
  &:active{
    color: #ffde00;
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
    background: url('../assets/img/newton.png') no-repeat center center / contain;
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
  padding: .8rem .4rem;
  margin-top: .4rem;
  background-color: #292929;
  &-input {
    &.password {
      position: relative;
      margin-top: .4rem;
    }
    input {
      width: 100%;
      height: .8rem;
      font-size: .3rem;
      color: #fff;
      background-color: transparent;
      border-width: 0;
      border-bottom: 1px solid #8089a3;
      &:focus {
        border-bottom-color: #ffde00;
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
      font-size: .36rem;
      background: #0072fd;
      color: #fff;
      border: 1px solid #0072fd;
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
}
</style>

