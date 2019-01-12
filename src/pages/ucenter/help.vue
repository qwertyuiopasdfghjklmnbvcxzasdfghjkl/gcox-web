<template>
  <div class="page">
    <cp-top-back>
      <h1>{{$t('account.user_center_help')}}<!--帮助--></h1>
    </cp-top-back>

    <div class="page-main content">
      <section class="item">
        <div class="inner">
          <p><span class="left">{{$t('account.user_center_help_account')}}<!--账户--></span><span class="right-icon"></span></p>
        </div>
      </section>
      <section class="item">
        <div class="inner">
          <p><span class="left">{{$t('account.user_center_help_trade')}}<!--交易--></span><span class="right-icon"></span></p>
        </div>
      </section>
      <section class="item">
        <div class="inner">
          <p><span class="left">{{$t('account.estimated_value_title')}}<!--充值 & 提现--></span><span class="right-icon"></span></p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-help'
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
