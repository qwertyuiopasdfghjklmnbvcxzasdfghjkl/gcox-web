<template>
  <div class="page">
    <cp-top-back>
      <h1>{{$t('account.user_center_setting')}}<!--设置--></h1>
    </cp-top-back>

    <div class="page-main content">
      <section class="item-section">
        <div class="inner">
          <p v-tap="{methods: $root.routeTo, to: 'page-language'}">
            <span class="left">{{$t('account.user_center_language')}}<!--语言--></span>
            <span class="right-icon"></span>
          </p>
        </div>
      </section>
      <section class="item-section">
        <div class="inner">
          <p v-tap="{methods: $root.routeTo, to: 'page-payway'}">
            <span class="left">{{$t('otc_legal.otc_legal_currency')}}<!--收款方式设置--></span>
            <span class="right-icon"></span>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-setUp'
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
    background: #409cf2;
    border: 0;
    color: white;
    margin-top: .04rem;
  }
}
</style>
