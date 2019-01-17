<template>
  <div class="page page-bg">
    <cp-top-back :back="false">
      <h1 class="header">{{$t('public.navigation_OTC')}}<!--OTC--></h1>
    </cp-top-back>

    <div class="box one">
      <div class="inner">
        <section class="coin_tab">
          <ul>
            <li :class="[active==='tab-container1'?'activation':'']" @click="whickTabFun('tab-container1')">
              <span>{{$t('exchange.exchange_buys')}}<!--买币--></span>
            </li>
            <li :class="[active==='tab-container2'?'activation':'']" @click="whickTabFun('tab-container2')">
              <span>{{$t('exchange.exchange_sells')}}<!--卖币--></span>
            </li>
            <li :class="[active==='tab-container3'?'activation':'']" @click="whickTabFun('tab-container3')">
              <span>{{$t('public0.public140')}}<!--未完成订单--></span>
            </li>
            <li :class="[active==='tab-container4'?'activation':'']" @click="whickTabFun('tab-container4')">
              <span>{{$t('otc_ad.otc_ad_Order_completed')}}<!--已完成订单--></span><i></i>
            </li>
            <li :class="[active==='tab-container5'?'activation':'']" @click="whickTabFun('tab-container5')">
              <span>{{$t('public0.public155')}}<!--当前广告--></span><i></i>
            </li>
          </ul>
        </section>
        <section class="coin_header">
          <template v-if="active === 'tab-container1' || active === 'tab-container2' || active === 'tab-container5'">
            <select class="symbol" v-model="globalParams.symbol">
              <option v-for="(item, index) in symbolList" :value="item.symbol">{{item.symbol}}</option>
            </select>
            <span>/</span>
            <select class="currency" v-model="globalParams.currency">
              <option v-for="(item, index) in currencyList" :value="item.value">{{$t(item.text)}}</option>
            </select>
          </template>
          <select class="state" v-if="active === 'tab-container4'" v-model="globalParams.state">
            <option :value="2">{{$t('otc_ad.otc_ad_Order_completed')}}<!--已完成订单--></option>
            <option :value="3">{{$t('otc_ad.otc_ad_cancelled_order')}}<!--已取消订单--></option>
          </select>
          <template  v-if="active === 'tab-container5'" >
            <span>/</span>
            <select class="adType" v-model="globalParams.ad_type">
              <option :value="1">{{$t('otc_exchange.otc_exchange_buys')}}</option>
              <option :value="2">{{$t('otc_exchange.otc_exchange_sell')}}</option>
            </select>
          </template>
          <button type="button" class="pub-ad" v-if="active === 'tab-container5'" @click="createorder">{{$t('otc_ad.otc_post_ad')}}</button>
        </section>
      </div>
    </div>

    <mt-tab-container v-model="active" :swipeable="true">
      <mt-tab-container-item id="tab-container1">
        <div id="scroll">
          <div class="box">
            <div class="inner">
              <adslist :params="globalParams" @placeOrderClick="placeOrderClick"></adslist>
            </div>
          </div>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container2">
        <div class="box">
          <div class="inner">
            <adslist :params="globalParams" @placeOrderClick="placeOrderClick"></adslist>
          </div>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container3">
        <div class="box">
          <div class="inner">
            <orderlist ref="curOrderList" :params="globalParams"></orderlist>
          </div>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container4">
        <div class="box">
          <div class="inner">
            <orderlist :params="globalParams"></orderlist>
          </div>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container5">
        <div class="box">
          <div class="inner">
            <myadslist></myadslist>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>

    <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
      <placeorder :params="globalParams" :ad_id="adsId" @hidePlaceOrderDialog="hidePlaceOrderDialog"></placeorder>
    </mt-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { TabContainer, TabContainerItem } from 'mint-ui'
import otcConfig from '@/assets/js/otcconfig'
import otcApi from '@/api/otc'
import adslist from '@/pages/otc/adslist'
import orderlist from '@/pages/otc/orderlist'
import placeorder from '@/pages/otc/placeorder'
import myadslist from '@/pages/otc/myadslist'
import Tip from '@/assets/js/tip'
import shopsApi from '@/api/shops'

Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
export default {
  name: 'page-otc',
  components: {
    adslist,
    orderlist,
    placeorder,
    myadslist
  },
  data () {
    return {
      isShop:false,
      placeOrderVisible: false,
      scroll: false,
      active: 'tab-container1',
      adsId: null,
      symbolList: otcConfig.coins,
      currencyList: otcConfig.currencys,
      globalParams: {
        ad_type: 2,
        symbol: 'ETH',
        currency: 'CNY',
        state: 1, // 1未完成订单 2已完成订单 3已取消订单
        type: 0, // 0当前广告 1历史广告
        pay_type: null,
        sort_mode: 1, // 1价格升序 2信用降序 3价格降序
        page: 1,
        show: 10
      }
    }
  },
  watch: {
    placeOrderVisible (bool) {
      if (!bool) {
        this.adsId = null
      }
    },
    active(_new){
      if(_new==='tab-container1'){
        this.globalParams.ad_type = 2
        this.globalParams.sort_mode = 1
      } 
      if(_new==='tab-container2'){
        this.globalParams.ad_type = 1
        this.globalParams.sort_mode = 3
      } 
      if(_new==='tab-container3'){
        this.globalParams.state = 1
      } 
      if(_new==='tab-container4'){
        this.globalParams.state = 2
      } 
      this.$router.push({name:'page-otc', params:{tab:_new}})
    }
  },
  created(){
    this.getShopsApply()
    if(this.$route.params.tab){
      this.active = this.$route.params.tab
      if(this.active==='tab-container1'){
        this.globalParams.ad_type = 2
        this.globalParams.sort_mode = 1
      } 
      if(this.active==='tab-container2'){
        this.globalParams.ad_type = 1
        this.globalParams.sort_mode = 3
      } 
      if(this.active==='tab-container3'){
        this.globalParams.state = 1
      } 
      if(this.active==='tab-container4'){
        this.globalParams.state = 2
      } 
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
  },
  methods: {
    getShopsApply(){
      if(this.getApiToken){
        shopsApi.getShopsApply(res=>{
          this.isShop = (res.data && res.data.state===3) || false
        })
      }
    },
    goToMyCenter () {
      this.$router.push('/realname')
    },
    goToSettings () {
      this.$router.push('/payway')
    },
    checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
      if (!this.getApiToken) {
        Tip({type: 'danger', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
        return
      }
      otcApi.getVerifyState((msg) => {
        if (isCheckPaySet) {
          otcApi.getPaySettings((res) => {
            if (isCheckPayType) {
              otcApi.matchPayTypes(id, (data2) => {
                this.matchPayType = data2
                successCallback && successCallback()
              }, (msg3) => {
                if (msg3 === 'PAY_TYPE_UNMATCH') {
                  Vue.$confirmDialog({
                    id: 'PAY_TYPE_UNMATCH',
                    content: this.$t('error_code.PAY_TYPE_UNMATCH'), // 支付方式不匹配，请设置对应的支付方式
                    okCallback: () => {
                      this.goToSettings()
                    }
                  })
                } else {
                  Tip({type: 'danger', message: this.$t(`error_code.${msg3}`)})
                }
              })
            } else {
              if(this.isShop){
                successCallback && successCallback(res.data.pay_type)
              } else {
                Vue.$confirmDialog({
                  id: 'goShopsApply',
                  content: this.$t('business.ISSHOPS'),
                  okCallback: () => {
                    Tip({type: 'info', message: this.$t('business.APPLYISMADING')})
                    // this.$router.push({to:'/mycenter/agencyApply'})
                  }
                })
              }
            }
          }, (res) => {
            if (res.msg === 'NO_PAY_TYPE') {
              Vue.$confirmDialog({
                id: 'NO_PAY_TYPE',
                content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                okCallback: () => {
                  this.goToSettings()
                }
              })
            } else {
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            }
          })
        } else {
          successCallback && successCallback()
        }
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          Vue.$confirmDialog({
            id: 'KYC_AUTH_FIRST',
            content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            okCallback: () => {
              this.goToMyCenter()
            }
          })
        } else {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    createorder () { // 添加广告
      this.checkSetState((myPayType) => {
        this.$router.push({name:'otc-update', params:{
          ad_type: this.globalParams.ad_type,
          currency: this.globalParams.currency,
          symbol:this.globalParams.symbol,
          myPayType: myPayType
        }})
      }, 'public0.public109', true, false)
    },
    hidePlaceOrderDialog (bool) {
      this.placeOrderVisible = false
      if (bool) {
        this.whickTabFun('tab-container3')
        this.$refs.curOrderList.getOrderList()
      }
    },
    placeOrderClick (item) {
      this.placeOrderVisible = true
      this.adsId = item.ad_id
    },
    whickTabFun (index) {
      this.active = index
    }
  }
}
</script>

<style lang="less" scoped>
  .place_order_popup{width:100%;}
  .page{display:flex;flex-direction:column;}
  .page-bg{background: #f2f3f8;}
  .mint-tab-container{height:calc(100% - 1.45rem);}
  .mint-tab-container /deep/ .mint-tab-container-wrap{height:100%;}
  .mint-tab-container /deep/ .mint-tab-container-item{overflow:auto;padding-bottom:0.2rem;}
  @font_color_transparent:#cbd4ec;
  #scroll{
    overflow-x: hidden;
    overflow-y: auto;
  }
  @write:#ffffff;
  @write-20:#cbd4ec;
  .header{
    font-size: .32rem;
    color: @font_color_transparent;
  }
  .c-button-normal{
    display: inline-block;
    padding: 0 .12rem;
    width: 1.48rem;
  }
  .c-button{
    font-size: .26rem;
    appearance: none;
    border-radius:.01rem;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    height: .64rem;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
  }
  .c-button-green{
    color: #fff;
    background-color: #00cc99;
  }
  .c-button-orange{
    color: #fff;
    background-color: #e76d42;
  }
  .c-button-blue{
    color: #fff;
    background-color: #0072fd;
    border-radius: .02rem;
  }
  .box{
    font-size: .3rem;
    &>.inner{
      padding: 0;
      color: #999;
    }
  }
  .coin_tab {
    height: .75rem;
    background-color: #fff;
    ul{
      display: flex;
      justify-content: space-between;
      border-bottom: 0.02rem solid #f2f3f8;
      padding: 0 .3rem;
      li{
        margin-bottom: -1px;
        line-height: .75rem;
        border-bottom: 1px solid #f2f3f8;
        &.activation{
          color: #0072fd;
          border-bottom-color: #0072fd;
        }
      }
      li:last-child{border: 0;}
    }
  }
  .coin_header {
    height: .75rem;
    font-size: 0;
    line-height: 0;
    padding: 0 0.3rem;
    position: relative;
    background: linear-gradient(to bottom, #f2f1f7, #fff);
    select {
      height: .75rem;
      vertical-align: middle;
      color: #0072fd;
      background-image: url('../../assets/img/down-icon-8089a3@3x.png');
      &.symbol {
      }
      &.currency {
      }
    }
    span {
      display: inline-block;
      width: .48rem;
      height: .75rem;
      font-size: .3rem;
      line-height: .75rem;
      text-align: center;
      vertical-align: middle;
    }
  }

  .one{
    background-color: #fff;
  }
  .coin_content{
    font-size: .24rem;
    .item{
      margin-top: .2rem;
    }
    ul{
      padding: .2rem;
      background-color: #fff;
      border-radius:.05rem;
      box-shadow: 0px 3px 30px 0px rgba(14, 14, 14, 0.35);
      li{
        display: flex;
        justify-content: space-between;
        span{
          line-height: .4rem;
        }
        i{
          height: .4rem;
          line-height: .4rem;
        }
        i.i_eth{
          display: inline-block;
          width: .4rem;
          left: 0.3rem;
          background: url('../../assets/img/cion_icon.png') no-repeat center;
          background-size: contain;
          text-align: center;
          color: white;
          font-style: normal;
        }
      }
      li:nth-child(1){
        section:first-child{
          color: #ffffff;
        }
        section:last-child{
          color: #cbd4ec;
        }
      }
      li:nth-child(2){
        section:first-child{
          span:nth-child(n+2){
            color: #cbd4ec;
          }
        }
        margin-top: .3rem;
      }
      li:nth-child(3){
        section:first-child{
           span:nth-child(n+2){
             color: #cbd4ec;
           }
        }
        section:last-child{
          font-size: .32rem;
          color: #ffffff;
        }
      }
      li:nth-child(4){
        margin-top: .2rem;
        section:first-child{
          i{
            display: inline-block;
            width: .28rem;
            height: .28rem;
            margin-top: .3rem;
            margin-right: .2rem;
          }
          i:first-child{
            background: url('../../assets/img/icon-bank.png') no-repeat center;
            background-size: 100% 100%;
          }
          i:nth-child(2){
            background: url('../../assets/img/icon-wechat.png') no-repeat center;
            background-size: 100% 100%;
          }
          i:nth-child(3){
            background: url('../../assets/img/icon-alipay.png') no-repeat center;
            background-size: 100% 100%;
          }
          i:nth-child(4){
            background: url('../../assets/img/icon-paypal.png') no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .pub-ad {
    position: absolute;
    right: -0.1rem;
    min-width: 2rem;
    height: 100%;
    color: #fff;
    font-size: 0.24rem;
    background-color: #0072fd;
    cursor: pointer;
    border: 1px solid #0072fd;
  }
</style>
