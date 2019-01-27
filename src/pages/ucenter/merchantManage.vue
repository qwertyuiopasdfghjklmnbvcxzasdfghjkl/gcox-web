<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('seller_apply.merchant_manage')}}<!--商家申请--></h1>
    </cp-top-back>
    <div class="page-main content">
      <div class="mgWp">
        <div class="mgItem">
          <p>{{merthant.lv.name}}</p>
          <input readonly type="text" v-model="merthant.lv.val">
        </div>
        <div class="mgItem">
          <p>{{merthant.fee.name}}</p>
          <input readonly type="text" v-model="merthant.fee.val">
        </div>
        <div class="mgItem">
          <p>{{merthant.commity.name}}</p>
          <input readonly type="text" v-model="merthant.commity.val">
        </div>
        <div class="mgItem">
          <p>{{merthant.tolVolume.name}}</p>
          <input readonly type="text" v-model="merthant.tolVolume.val">
        </div>
        <div class="mgItem">
          <p>{{merthant.tolNumber.name}}</p>
          <input readonly type="text" v-model="merthant.tolNumber.val">
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
import userApi from '@/api/individual'
export default {
  name: 'page-manager',
  data () {
    return {
      merthant:{
        lv:{name:'当前等级',val:'普通商家'},
        fee:{name:'手续费率',val:'1%'},
        commity:{name:'当属社区',val:'清分社区'},
        tolVolume:{name:'总成交量',val:'355，545.23CNY'},
        tolNumber:{name:'总成交笔数',val:'357'},
      }
    }
  },
  methods: {
    
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
      }
      input{
        width: 100%;
        font-size: 0.38rem;
        padding:  .15rem 0 .05rem;
        color: #000;
        border: 0;
      }
    }
    .mgItem:last-of-type{
      border-bottom: 0;
    }
  }
}
</style>
