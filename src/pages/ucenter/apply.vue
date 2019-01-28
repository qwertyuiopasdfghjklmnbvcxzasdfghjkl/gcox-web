<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('business.MERCHANT_APPLICATION')}}<!--商家申请--></h1>
    </cp-top-back>

    <div class="page-main content">
      <div class="apply-rule">
        <h2>{{$t('business.Merchant_brief')}}<!-- 商家简介 -->：</h2>
        <p>{{$t('business.BUSINESS_INTERESTS')}}</p>
        <h2>{{$t('business.APPLICATION_RULES')}}：</h2>
        <p>{{$t('business.APPLICATION_RULES_1')}}</p>
        <p>{{$t('business.APPLICATION_RULES_2')}}</p>
        <p>{{$t('business.APPLICATION_RULES_3')}}</p>
        <p>{{$t('business.FEE_DISCOUNT')}}</p>
        <h2>{{$t('business.Hierarchy')}}<!-- 等级权益 -->：</h2>
        <table class="tab">
          <tr>
            <th>{{$t('business.MERCHANT_LEVEL')}}<!-- 商家等级 --></th>
            <th>{{$t('business.AD_SERVICE_FEE')}}<!-- 广告服务费 --></th>
            <th style="width: 1.5rem;">{{$t('business.SINGLE_AD_LIMIT')}}</th>
            <th style="width: 1.5rem;">{{$t('business.PROMOTION_STANDARD')}}</th>
            <th>{{$t('business.EXCLUSIVE_LOGO')}}</th>
          </tr>
          <tr  v-for="item in shopsLevel">
            <td>{{merchant_name(item.levelIndex)}}</td>
            <td>{{item.feeRate*100}}%</td>
            <td>{{item.adLimit}}</td>
            <td>{{item.riseStandard}}</td>
            <td><img :src="levelSymbol[item.shopsLevelId]" v-if="item.shopsLevelId>=2"><span v-else>-</span></td>
          </tr>          
        </table>
      </div>
      <div class="btn-bot">
        <mt-button 
          type="primary" 
          size="large"
          v-tap="{methods:$root.routeTo, to:'page-apple-form'}"
          >{{applyText}}</mt-button>

      </div>
      
      
    </div>
  </div>
</template>

<script>
import userApi from '@/api/individual'
import shopsApi from '@/api/shops'
import silver from '@/assets/img/i-silver.png'
import golden from '@/assets/img/i-gold.png'
import diamond from '@/assets/img/i-jewel.png'
export default {
  name: 'page-apply',
  data () {
    return {
      applyStatus:null,
      shopsLevel:[],
      levelSymbol:{2:silver,3:golden,4:diamond}
    }
  },
  computed: {
    applyText(){
      if(this.applyStatus===1 || this.applyStatus===2){
        return this.$t('public0.public151')
      } else {
        return this.$t('business.TO_APPLY')
      }
    }
  },
  created(){
    this.getShopsLevel()
    this.getShopsApply()
  },
  methods: {
    merchant_name(level){
      return this.$t(`business.MERCHANT_LEVEL_${level}`)
    },
    getShopsLevel(){
      shopsApi.getShopsLevel(res=>{
        this.shopsLevel = res.data
      })
    },
    getShopsApply(){
      shopsApi.getShopsApply(res=>{
        this.applyStatus = (res.data && res.data.state) || null
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
.digTap{
  width:100%;
  .top{
    border-bottom: 1px solid #eee;
    .tl{
      padding: .5rem .3rem 0;
      text-align: center;
    }
    .meg{
      padding: .4rem .3rem;
      font-size: .3rem;
      color: #333;
    }
  }
  .bot{
    text-align: center;
    .btnok{
      height: initial;
      line-height: initial;
      display: inline-block;
      padding: .1rem;
      color: #0d66ef;
      font-size: .32rem;
      margin: .1rem 0;
    }
  }
}
 .header-right{
   float: right;
   font-size: .26rem;
 }
.page{
  background: #fff;
  color:#000;
}
.page-main{
  margin: 0 0 1.2rem;
  .apply-rule{
    padding: .2rem .3rem;
    font-size: 0.3rem;
    line-height: .42rem;
    h2{
      font-size: .32rem;
      font-weight: 600;
      padding: .2rem 0;
    }
    p{
      padding: .05rem 0;
    }
    .tab{
      border-collapse: collapse;
      font-size: 0.2rem;
      line-height: .4rem;
      text-align: center;
      width: 100%;
      td,th{
        border: 1px solid #ddd;
        padding: .2rem 0;
      }
      th{
        background: #eee;
      }
      img {
        width: 0.36rem;
      }
    }
  }
  .btn-bot{
    position: fixed;
    padding: 0 .3rem 0.3rem;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
  }
  
}
body .mint-msgbox-message {
    text-align: center;
    line-height: 0.48rem;
}
</style>
