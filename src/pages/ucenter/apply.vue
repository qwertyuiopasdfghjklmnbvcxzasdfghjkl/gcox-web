<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('seller_apply.seller_agency_apply')}}<!--商家申请--></h1>
    </cp-top-back>

    <div class="page-main content">
      <div class="apply-rule">
        <h2>商家简介：</h2>
        <p>成为商家后您可以发布广告，赚取溢价。</p>
        <p>升级为白银以上商家，更有专属认证标志。</p>
        <h2>申请规则：</h2>
        <p>通过实名认证、短信认证及设置收款方式的用户均可以申请为普通商家。</p>
        <p>我们将在72小时内对您的商家申请资料进行审核，我们会通过站内信或电话的方式与您通知您结果。</p>
        <p>普通商家在OTC达到一定交易额（自己发布广告的交易额），可升级为更高等级的商家。</p>
        <p>享受手续折扣，具体如下所示：</p>
        <h2>等级权益：</h2>
        <table class="tab">
          <tr>
            <th>商家等级</th>
            <th>广告服务费</th>
            <th>单次广告限额<br>(CNY))</th>
            <th>晋级标准<br>(交易额)</th>
            <th>专属标识</th>
          </tr>
          <tr>
            <td>平台商家</td>
            <td>1%</td>
            <td>10000</td>
            <td>0</td>
            <td>-</td>
          </tr>
          <tr>
            <td>白银商家</td>
            <td>0.8%</td>
            <td>50000</td>
            <td>1000</td>
            <td><img width="18" src="../../assets/img/i-silver.png" alt=""></td>
          </tr>
          <tr>
            <td>黄金商家</td>
            <td>0.8%</td>
            <td>50000</td>
            <td>1000</td>
            <td><img width="18" src="../../assets/img/i-gold.png" alt=""></td>
          </tr>
          <tr>
            <td>钻石商家</td>
            <td>0.8%</td>
            <td>50000</td>
            <td>1000</td>
            <td><img width="18" src="../../assets/img/i-jewel.png" alt=""></td>
          </tr>
        </table>
      </div>
      <div class="btn-bot">
        <mt-button 
          type="primary" 
          size="large"
          @click="tipMeg()"
          >{{$t('seller_apply.btnApplySeller')}}</mt-button>
      </div>
      
      
    </div>
  </div>
</template>

<script>
import userApi from '@/api/individual'
import Tip from '@/assets/js/tip'
export default {
  name: 'page-apply',
  data () {
    return {
      formData: {
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        commity: '',
      },
    }
  },
  created () {
    //this.ruleForm()
  },
  computed:{
    meg() {
      return
      Tip({type: 'danger',  message: this.$t('seller_apply.real_name')});
    }
  },
  methods: {
    tipMeg(){
      
      Tip({type: 'danger', message: this.$t('seller_apply.real_name')});
      
      this.$router.push({name: 'page-apple-form'});
    }
    
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
