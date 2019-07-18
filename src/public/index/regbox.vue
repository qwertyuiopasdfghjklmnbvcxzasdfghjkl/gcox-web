<template>
  <div class="reg-box">
    <div class="w1200 reg">
      <p class="reg-title efont">{{$t('about.slogen')}} <!-- 你最爱的名人币交易所！ --></p>
      <div class="ui-flex reg-main">
        <input type="text" v-model="email" :placeholder="$t('login_register.email')" maxlength="50" v-validate="'email'">
        <div button="" @click="goRegister">{{$t('exchange.exchange_not_account')}}<!-- 立即注册 --></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      email:''
    }
  },
  methods:{
    goRegister(){
      this.$router.push({name:'register', query:{email:this.errors.any()?'':this.email}})
    }
  }
}
</script>
<style lang="less" scoped>
.reg-box {
  background-color: #1f1e23;
  .reg {
    padding-top: 40px;
    padding-bottom: 70px;
    .reg-title {
      font-size: 20px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 50px;
    }
    .reg-main  {
        width: 1000px;
        height: 56px;
        border: 1px solid #f1f1f2;
        margin: 0 auto;
        position: relative;
    }
    input {
        height: 54px;
        line-height: 54px;
        width: 100%;
        padding-left: 20px;
        background-color: transparent;
        border: none;
        display: inline-block;
        margin-left: 1px;
        color: #f1f1f2;
        font-size: 14px;
        outline: none;
    }
    [button]{
        position: absolute;
        right: 3px;
        top: 3px;
        width: 330px;
        height: 48px;
        background-color: #f1f1f2;
        color: #151720;
        text-align: center;
        cursor: pointer;
        line-height: 48px;
        font-size: 18px;
    }
  }
}
</style>
