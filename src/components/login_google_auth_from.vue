<template>
  <div class="google-form">
    <header><img class="imgaa" :src="warnimg"></header>
    <section class="g-content">
      <p>{{$t('auth_warning.warning_content')}}<!--为了您的账户安全，我们强烈建议您开启二次验证。--></p>
      <p>{{$t('auth_warning.warning_choose')}}<!--请选择你希望的二次认证方式--></p>
    </section>
    <div class="footer">
      <ul>
        <li><span class="c-button c-button-normal save-btn" @click="gogle">{{$t('auth_warning.warning_google_auth')}}<!--谷歌认证--></span></li>
        <li><span class="c-button c-button-normal cannel-btn" @click="sms">{{$t('auth_warning.warning_SMS_auth')}}<!--短信认证--></span></li>
      </ul>
      <p>{{$t('auth_warning.warning_understand_risks')}}<!--我已知晓风险，--><a href="javascript:;" @click="onclose">{{$t('auth_warning.warning_not_set')}}<!--暂不设置--></a></p>
    </div>
  </div>
</template>

<script>
import Tip from '@/assets/js/tip'
import userApi from '@/api/individual'
export default {
  name: 'page-help',
  props: {
    nikename: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      warnimg: require("../assets/img/logo_warn.png"),
      saveimg: require("../assets/img/guge_icon.png"),
      cannelimg: require("../assets/img/shouji.png"),
      nicknameValue: this.nikename
    }
  },
  computed: {
    msgs () {
      return {
        nickname: {required: this.$t('public0.public73')} // 请输入昵称
      }
    }
  },
  methods: {
    canlFun () {
      this.$emit('on-close-all')
    },
    submit () {
      this.$validator.validateAll().then((res) => {
        if (!res) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        userApi.editNickname({
          nickname: this.nicknameValue
        }, (msg) => {
          this.$emit('okCallback', this.nicknameValue)
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          this.canlFun()
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      })
    },
    gogle () {
      this.$emit("gogleauth")
    },
    sms () {
      this.$emit("smsauth")
    },
    onclose () {
      this.$emit("onclosefun")
    }
  }
}
</script>

<style lang="less" scoped>
.g-content{
  p{
    font-size: .24rem;
    color:#333333;
    line-height: .4rem;
    text-align: center
  }
  p:first-child{
    margin-top: .2rem;
  }
}

.google-form{
   header{
      text-align: center
   }
   header img{
     width: .7rem;
     height: .7rem;
   }
}
.nikename-form{
  p:first-child{
    input{
      background: transparent;
      border: 0;
      font-size: .3rem;
      color:#181b2a;
      height: .7rem;
      width: 100%;
    }
    border-bottom: .01rem solid #8089a3;
  }
  p:nth-child(2){
    color: #8089a3;
    font-size: .2rem;
  }
}

.footer{
  p{
    margin-top: .3rem;
    text-align: right;
    font-size: .22rem;
    color: #616161;
    a{
      color:#409ff8;
    }
  }
  .save-btn{
    background: #292929 url('../assets/img/guge_icon.png') no-repeat .33rem;
    background-size:.34rem .26rem;

  }
  .cannel-btn{
    background: #292929 url('../assets/img/shouji.png') no-repeat .33rem;
    background-size:.22rem .32rem;
  }
  margin-top: .4rem;
  ul{
    display: flex;
    justify-content:center;
    li{
      margin-left: .2rem;
    }
  }
}

.c-button-normal{
  display: inline-block;
  padding: 0 .12rem;
  width: 2.42rem;
  padding-left: .5rem;
}
.c-button{
    background: #292929;
    font-size: .3rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: .01rem;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: inline-block;
    /* height: .64rem; */
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
    height: .61rem;
    line-height: .61rem;
}
.c-button-blue{
  color: #fff;
  background-color: #ffde00;
}
  .c-button-gray{
    color:#8089a3;
    border: .01rem solid #8089a3;
  }
</style>
