<template>
  <div class="page" >
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="box">
      <div class="inner editpwd-form">
        <h1 >{{$t('account.user_center_change_password')}}<!--修改密码--></h1>
        <div class="item">
           <p class="line">
             <input name="passwordOld" type="password" v-model="formData.passwordOld" :placeholder="$t('account.user_center_old_password')">
           </p>
        </div>
        <div class="item">
          <p class="line">
            <input name="password" type="password" v-model="formData.password"  :placeholder="$t('account.user_center_new_password')">
          </p>
        </div>
        <div class="item">
          <p class="line">
            <input name="passwordConfirm" type="password" v-model="formData.passwordConfirm" :placeholder="$t('account.user_center_confirm_password')">
          </p>
        </div>

        <footer>
          <p>（{{$t('error_code.CHANGE_PASSWORD_SUCCESS')}}）<!--为了您的资产安全，登录密码修改后24小时以内不允许提现。--></p>
          <button :class="{disabled:locked||gtLocked}" class="c-button c-button-normal c-button-blue" @click="changePwd">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></button>
        </footer>
      </div>
    </div>

  </div>
</template>

<script>
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
export default {
  name: 'page-editPwd',
  data () {
    return {
      locked: false,
      gtLocked: false,
      formData: {
        passwordOld: '',
        password: '',
        passwordConfirm: ''
      }
    }
  },
  methods: {
    changePwd () {
      if (!this.$root.trim(this.formData.passwordOld, 1)) {
        Tip({type: 'danger', message: this.$t('account.user_center_Please_old_password')})
        $('.editpwd-form input[name=passwordOld]').focus()
        return
      } else if (!this.$root.isPassword(this.formData.password)){
        Tip({type: 'danger', message: this.$t('public0.public123')})
        $('.editpwd-form input[name=password]').focus()
        return
      } else if (!(this.formData.passwordConfirm === this.formData.password)){
        Tip({type: 'danger', message: this.$t('public0.public124')})
        $('.editpwd-form input[name=passwordConfirm]').focus()
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
            formData.passwordOld = utils.encryptPwd(rsaPublicKey, formData.passwordOld)
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.changePwd(formData, (msg) => {
              this.locked = false
              Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
              this.$router.push({name:'page-ucenter'})
            }, (msg) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
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
  .c-button.disabled{background:#999;}
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
        font-size: .36rem;
      }
      padding: .3rem;
      font-size: .3rem;
    }
  }

.item{
  font-size: .24rem;
  color: #8089a3;
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
    margin-top: .5rem;
    border-bottom: .01rem solid #8089a3;
  }
  .msg{
    font-size: .24rem;
    color: #8089a3;
    margin-top: .2rem;
  }
}
  .item:nth-of-type(1){
    margin-top: .7rem;
  }
</style>
