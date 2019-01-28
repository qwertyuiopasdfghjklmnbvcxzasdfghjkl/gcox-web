<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('business.MERCHANT_MANAGE')}}<!--商家申请--></h1>
    </cp-top-back>
    <div class="page-main content">
      <div class="mgWp">
        <div class="mgItem">
          <p>{{$t('business.LEVEL')}}</p>
          <p>{{shopsInfo.levelName}}</p>
        </div>
        <div class="mgItem">
          <p>{{$t('public.fee_rate')}}</p>
          <p>{{shopsInfo.feeRate*100}}%</p>
        </div>
        <div class="mgItem">
          <p>{{$t('business.ATTRIBUTION_COMMUNITY')}}</p>
          <p>{{shopsInfo.community}}</p>
        </div>
        <div class="mgItem">
          <p>{{$t('business.TOTAL_VOLUME')}}</p>
          <p>{{(shopsInfo.totalCurrency+'').toMoney()}} CNY</p>
        </div>
        <div class="mgItem">
          <p>{{$t('business.TOTAL_TRANSACTIONS')}}</p>
          <p>{{shopsInfo.totalNumber}}</p>
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
import userApi from '@/api/individual'
import shopsApi from '@/api/shops'
export default {
  name: 'page-manager',
  data () {
    return {
      shopsInfo:{},
    }
  },
  created(){
    this.getShopsApply()
  },
  methods: {
    getShopsApply(){
      shopsApi.getShopsApply(res=>{
        if(res.data){
          this.shopsInfo = res.data
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.popul70{
  width: 80%;
  border-radius: .1rem;
  overflow: hidden;
}
.header-right{
  float: right;
  font-size: .26rem;
}
.page{
  background: #f9f9f9;
  color:#000;
}
.page-main{
  margin: 0 0 1.2rem;
  .mgWp{
    padding: .2rem .5rem;
    font-size: 0.3rem;
    background: #fff;
    line-height: .42rem;
    .mgItem{
      font-size: .32rem;
      padding: .3rem 0;
      border-bottom: 1px solid #eee;
      p{
        font-size: 0.3rem;
        padding: .05rem 0;
        color: #666;
        &:last-of-type {
          font-size: 0.38rem;
          padding:  .15rem 0 .05rem;
          color: #000;
        }
      }
    }
    .mgItem:last-of-type{
      border-bottom: 0;
    }
  }
}
</style>
