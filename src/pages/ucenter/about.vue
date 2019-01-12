<template>
  <div class="page">
    <cp-top-back>
      <h1>{{$t('account.user_center_about')}}<!--关于--></h1>
    </cp-top-back>

    <div class="page-main content">
      <section class="item-section">
        <div class="inner">
          <p><span class="left">{{$t('public.foot_fees')}}<!--费率标准--></span><span class="right-icon"></span></p>
        </div>
      </section>
      <section class="item-section">
        <div class="inner">
         <p><span class="left">{{$t('public.foot_privacy')}}<!--隐私声明--></span><span class="right-icon"></span></p>
        </div>
      </section>
      <section class="item-section">
        <div class="inner">
          <p><span class="left">{{$t('public.foot_terms')}}<!--服务协议--></span><span class="right-icon"></span></p>
        </div>
      </section>
      <section class="item-section">
        <div class="inner">
          <p><span class="left">{{$t('public.foot_about')}}<!--关于我们--></span><span class="right-icon"></span></p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-about'
}
</script>

<style lang="less" scoped>
 .header-right{
   float: right;
   font-size: .26rem;
 }

.item-section{
  margin-top: .8rem;
  font-size: .3rem;
  >.inner{
    padding:0 .3rem;
  }
  .right-icon{
    display: inline-block;
    width: .14rem;
    height: .26rem;
    float: right;
    background: url('../../assets/img/n_i_icon.png') no-repeat center;
    background-size: 100% 100%;
  }
}
</style>
