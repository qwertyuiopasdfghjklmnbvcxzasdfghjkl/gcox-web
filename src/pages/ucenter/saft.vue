<template>
  <div class="page">
    <cp-top-back>
      <h1>{{$t('account.user_center_safety')}}<!--安全中心--></h1>
    </cp-top-back>

    <div class="page-main content">
      <section class="item">
        <div class="inner">
          <p v-tap="{methods:$root.routeTo, to:'page-editPwd'}"><span class="left">{{$t('account.user_center_change_password')}}<!--修改密码--></span><span class="right-icon"></span></p>
        </div>
      </section>
      <section class="item">
        <div class="inner">
          <p><span class="left">{{$t('auth_warning.warning_google_auth')}}<!--谷歌验证--><i>（{{googleState === 0 ? $t('account.user_center_state_unbind') : $t('account.user_center_state_bind')}}）<!--未绑定--></i></span><button class="right-btn" v-tap="{methods:$root.routeTo, to:'page-bindgoogle'}">{{googleState === 0 ? $t('account.user_center_operate_bind') : $t('account.user_center_operate_unbind')}}<!--绑定||解绑--></button></p>
        </div>
      </section>

      <section class="item">
        <div class="inner">
          <p>
            <span class="left">{{$t('auth_warning.warning_SMS_auth')}}<!--短信验证--><i>（{{mobileState === 0 ? $t('account.user_center_state_unbind') : $t('account.user_center_state_bind')}}）<!--未绑定--></i></span>
            <button class="right-btn" v-tap="{methods:$root.routeTo, to:'page-bindphone'}">{{mobileState === 0 ? $t('account.user_center_operate_bind') : $t('account.user_center_operate_unbind')}}<!--绑定||解绑--></button>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/individual'
export default {
  name: 'page-saft',
  data () {
    return {
      googleState: '',
      mobileState: '' // 短信验证状态是否绑定
    }
  },
  created () {
    this.getbindstatue()
  },
  methods: {
    getbindstatue (){
      userApi.getUserState((data) => {
        this.mobileState = data.mobileAuthState;
        this.googleState = data.googleState
      }, (msg) => {
        console.error(msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .header-right{
   float: right;
   font-size: .26rem;
 }

  .item{
    margin-top: .8rem;
    font-size: .3rem;
    >.inner{
      padding:0 .3rem;
    }
    .left i{
      font-style: normal;
      font-size:.26rem ;
      color: #8089a3;
    }

    .right-icon{
      display: inline-block;
      width: .14rem;
      height: .26rem;
      float: right;
      background: url('../../assets/img/n_i_icon.png') no-repeat center;
      background-size: 100% 100%;
margin-top: .08rem;
    }
.right-btn{
  display: inline-block;
  padding: .06rem .2rem;
  float: right;
  background: #0072fd;
  border: 0;
  color: white;
  border-radius: 0.05rem;
  margin-top: .04rem;
}
  }
</style>
