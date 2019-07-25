<template>
  <div class="block market-watch-height entrust-container">
    <div class="title-container clearfix">
        <span class="pointer" :class="{'active':active==='current'}" @click="switchTab('current')">
          {{$t('trade_record.current_entrust')}}<!--当前委托-->
        </span>
        <span class="pointer ml40" :class="{'active':active==='history'}" @click="switchTab('history')">
          {{$t('trade_record.history_entrust')}}<!--历史委托-->
        </span>
        <div class="pull-right">
          <div class="ui-radio">
           <input type="checkbox" id="viewAll" class="ui-radio-input" v-model="checked"  /> 
           <label class="ui-radio-icon" for="viewAll"></label>
           <label class="ml10 pointer" for="viewAll">{{$t('exchange.view_all_entrust')}}</label>
          </div>
          <router-link to="/account/transaction" class="inline fs12 ml20 pointer" tag="div">查看全部 ></router-link>
        </div>
    </div>
    
    <ul class="orders-books header" v-if="getApiToken">
      <li class="ui-flex">
        <span class="ui-flex-2">{{$t('exchange.exchange_date')}}<!--时间--></span>
        <span class="ui-flex-2">{{$t('business.TYPE')}}<!-- 类型 --></span>
        <span class="ui-flex-2">{{$t('exchange.buy_or_sell')}}<!-- 买卖 --></span>
        <span class="ui-flex-2">{{$t('exchange.trade_pair')}}<!-- 交易对 --></span>
        <span class="ui-flex-3 text-right">{{$t('exchange.entrust_price')}}<!-- 委托价格 -->/<br />{{$t('exchange.exchange_Transaction_price')}}<!-- 成交均价 --></span>
        <span class="ui-flex-3 text-right">{{$t('exchange.entrust_number')}}<!-- 委托数量 -->/<br />{{$t('exchange.advanced_filled')}}<!-- 成交数量 --></span>
        <span class="ui-flex-3 text-right">{{$t('exchange.entrust_total')}}<!-- 委托总量 --></span>
        <span class="ui-flex-2 text-right" v-if="false">{{$t('exchange.advanced_fee')}}<!-- 手续费 --></span>
        <span class="ui-flex-2 text-center">
          <template v-if="active==='current'">{{$t('otc_exchange.otc_exchange_operating')}}<!-- 操作 --></template>
          <template v-else>{{$t('exchange.exchange_status')}}<!--状态--></template>
        </span>
      </li>
    </ul>

    <div id="currentOrdersScroll" v-show="active==='current'">
      <ul class="orders-books">
        <li class="ui-flex" v-for="(item,index) in filterCdatas" :key="item.orderBookId">
          <span class="ui-flex-2">{{new Date(Number(item.createdAt)).format()}}</span>
          <span class="ui-flex-2">{{Number(item.price)===-1?$t('exchange.exchange_market_price'):$t('otc_exchange.otc_exchange_limited_price')}}</span>
          <span class="ui-flex-2" :class="[Number(item.direction)===1 ? 'rang-down' : 'rang-up']">{{getType(item.direction)}}</span>
          <span class="ui-flex-2">{{currentSymbol}}/{{baseSymbol}}</span>
          <span class="ui-flex-3 text-right">{{getPrice(item.price)}}/<br />{{item.averagePrice}}</span>
          <span class="ui-flex-3 text-right">{{toFixed(item.totalAmount)}}/<br />{{toFixed(item.finishedAmount)}} ({{getFinishedPercent(item)}}%)</span>
          <span class="ui-flex-3 text-right">{{toFixed(item.totalAmount)}}</span>
          <!-- <span class="ui-flex-2 text-right">0</span> -->
          <span class="ui-flex-2 text-center f-c-main pointer" @click="cancelOrder(item.orderBookId, index)">{{$t('exchange.exchange_revoked')}}</span>
        </li>
      </ul>
    </div>

    <div id="historyOrdersScroll" v-show="active==='history'">
      <ul class="orders-books">
        <li class="ui-flex" v-for="(item,index) in filterHdatas" :key="item.orderBookId">
          <span class="ui-flex-2">{{new Date(Number(item.createdAt)).format()}}</span>
          <span class="ui-flex-2">{{Number(item.price)===-1?$t('exchange.exchange_market_price'):$t('otc_exchange.otc_exchange_limited_price')}}</span>
          <span class="ui-flex-2" :class="[Number(item.direction)===1 ? 'rang-down' : 'rang-up']">{{getType(item.direction)}}</span>
          <span class="ui-flex-2">{{currentSymbol}}/{{baseSymbol}}</span>
          <span class="ui-flex-3 text-right">{{getPrice(item.price)}}/<br />{{item.averagePrice}}</span>
          <span class="ui-flex-3 text-right">{{toFixed(item.totalAmount)}}/<br />{{toFixed(item.finishedAmount)}} ({{getFinishedPercent(item)}}%)</span>
          <span class="ui-flex-3 text-right">{{toFixed(item.totalAmount)}}</span>
          <!-- <span class="ui-flex-2 text-right">0</span> -->
          <span class="ui-flex-2 text-center" v-html="getStatue(item)"></span>
        </li>
      </ul>
    </div>
    <div class="text-center not-login" v-if="!getApiToken">
     <img src="../../assets/img/login_bg.png" /> 
     <p><span >{{$t('message.msg_please')}}<!-- 请先 --></span> <span class="pointer f-c-main ml5" @click="showQuickLogin">{{$t('login_register.login')}}<!-- 登录 --></span> <router-link :to="{name:'register'}" class="pointer f-c-main ml5" tag="span">{{$t('login_register.register')}}<!-- 注册 --></router-link></p>
    </div>
    <balance ref="balance" :valuationCout="valuationCout" :newRmbCount="newRmbCount" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :toFixed="toFixed"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import market from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import IScroll from 'iscroll'
import quickLogin from '@/components/quickLogin'
import utils from '@/assets/js/utils'
import balance from '@/exchanges/market/balance'
export default {
  props: {
    valuationCout: null,
    newRmbCount: null,
    currentSymbol: null,
    baseSymbol: null,
    fixedNumber: {
      type: Number
    },
    symbol: {
      type: String,
      default: ''
    },
    toFixed: {
      type: Function
    },
    mul: {
      type: Function
    },
    changeEntrustData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    balance
  },
  data () {
    return {
      isShow: false,
      b: Date.now(),
      active: 'current',
      cdatas: [],
      cshowLoading: true,
      hdatas: [],
      marketId: 0, // 市场id
      hshowLoading: true,
      checked: true,
      currentOrdersScroll:null,
      historyOrdersScroll:null
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    filterCdatas(){
      let data = this.cdatas
      if(!this.checked){
        data = data.filter((item) => {return this.symbol !== item.market})
      }
      return data
    },
    filterHdatas(){
      let data = this.hdatas
      if(!this.checked){
        data = data.filter((item) => {return this.symbol !== item.market})
      }
      return data
    }
  },
  watch: {
    active(_new){
      if(this.active==='history'){
        if(!this.historyOrdersScroll){
          setTimeout(this.initHistoryOrdersScroll,0)
        } else {
          setTimeout(()=>{this.historyOrdersScroll.refresh()},0)
        }
      } else {
        setTimeout(()=>{this.currentOrdersScroll.refresh()},0)
      }
    },
    checked(){
      if(this.active==='history'){
        setTimeout(()=>{this.historyOrdersScroll.refresh()},0)
      } else {
        setTimeout(()=>{this.currentOrdersScroll.refresh()},0)
      }
    },
    getApiToken () {
      this.changeLogin()
    },
    changeEntrustData (obj) {
      this.cdatas = obj.current
      this.hdatas = obj.history
    },
    cdatas () {
      this.setEntrustPrices(this.cdatas)
    },
    isShow () {
      this.$nextTick(() => {
        this.tiggerEvents({
          name: 'klineEvent',
          params: {type: 'resize', value: this.isShow}
        })
      })
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'extrustEvent',
        fun: this.extrustEvent
      })
    })
    this.changeLogin()
  },
  mounted(){
    this.initCurrentOrdersScroll()
  },
  beforeDestroy () {
    this.removeEvents('extrustEvent')
  },
  methods: {
    ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents', 'tiggerEvents']),
    showQuickLogin () {
      utils.setDialog(quickLogin, {backClose:true})
    },
    initCurrentOrdersScroll(){
      this.currentOrdersScroll = new IScroll('#currentOrdersScroll',{
        mouseWheel: true,
        scrollbars: 'custom',
        click:true
      })
    },
    initHistoryOrdersScroll(){
      this.historyOrdersScroll = new IScroll('#historyOrdersScroll',{
        mouseWheel: true,
        scrollbars: 'custom',
        click:true
      })
    },
    extrustEvent (res) {
      // 已退出登录后，返回的数据不在处理。
      if (!this.getApiToken) {
        return
      }
      if (res && res.type === 'current') {
        // 当前委托
        this.cdatas = res.data
        setTimeout(()=>{this.currentOrdersScroll && this.currentOrdersScroll.refresh()},0)
      } else if (res && res.type === 'history') {
        // 历史委托
        this.hdatas = res.data
        setTimeout(()=>{this.historyOrdersScroll && this.historyOrdersScroll.refresh()},0)
      }
    },
    switchTab (tab, isShow) {
      this.isShow = !isShow
      this.active = tab
    },
    getFinishedPercent (item) {
      return numUtils.div(item.finishedAmount, item.totalAmount).mul(100).toFixed(2)
    },
    changeLogin () {
      if (this.getApiToken) {
        // 根据symbol获取当前委托
        this.cshowLoading = true
        let tempSymbol = this.symbol
        market.getCurrentEntrustBySymbol(0, '', (res) => {
          this.cshowLoading = false
          this.cdatas = res
        }, () => {
          this.cshowLoading = false
        })
        // 历史成交
        this.hshowLoading = true
        market.getHistoryDeal(1, '', (res) => {
          this.hshowLoading = false
          this.hdatas = res
        }, () => {
          this.hshowLoading = false
        })
      } else {
        this.cdatas = []
        this.cshowLoading = false
        this.hdatas = []
        this.hshowLoading = false
      }
    },
    getType (type) {
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return this.$t('exchange.exchange_buy') // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return this.$t('exchange.exchange_sell') // 卖
      }
    },
    getPrice (price) {
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    getStatue (item) {
      let state = Number(item.state)
      if (state === 0) {
        if (numUtils.BN(item.finishedAmount).gt(0)) {
          return this.$t('exchange.exchange_partial_transaction') // 部分成交
        }
        return `<span class="rang-down">${this.$t('exchange.exchange_cancelled')}</span>` // 已撤销
      } else if (state === 2) {
        return this.$t('exchange.exchange_partial_transaction') // 部分成交
      } else if (state === 3 || state === 4) {
        return `<span class="rang-up">${this.$t('exchange.exchange_complete_transaction')}</span>` // 完全成交
      } else {
        return '--'
      }
    },
    minus (v1, v2) {
      return numUtils.minus(v1, v2).toFixed(this.fixedNumber)
    },
    div (v1, v2) {
      return numUtils.div(v1, v2).toFixed(2)
    },
    cancelOrder (orderBookId, index) {
      if (this.cdatas.length === 0) {
        return
      }
      if (!this.getApiToken) {
        return
      }
      if (orderBookId === 'all') {
        market.cancelAllOrder(this.symbol, () => {
          this.cdatas = []
          Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
        return
      }
      market.cancelOrder(orderBookId, () => {
        this.cdatas.splice(index, 1)
        Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
}
</script>

<style lang="less" scoped>
.market-watch-height {height: 360px; position: relative;}
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    box-sizing:border-box;
    >span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border-bottom: 2px solid transparent;
        color: #979799;
        &.active {
          color: #00a0e9;
          border-bottom: 2px solid #00a0e9;
        }
    }
}
.ui-radio {
    display: inline-block;
    overflow: hidden;
    padding: 5px;
    height: 30px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    vertical-align: middle;
    .ui-radio-input {
        display: none;
    }
    .ui-radio-icon {
        border: 1px solid #4a4a4a;
        width: 16px;
        height: 16px;
        position: relative;
        display: inline-block;
        &:after {
            position: absolute;
            background-color: #00a0e9;
            left: 50%;
            top: 50%;
            width: 8px;
            height: 8px;
            content: "";
            margin-left: -4px;
            margin-top: -4px;
            transform: scale(0);
            transition: all .2s ease;
        }
    }
    .ui-radio-input:checked+.ui-radio-icon:after {
        transform: scale(1);
    }
    label {display: inline-block; vertical-align: middle;}
}
.orders-books {
  font-size: 12px;
  li{
    width: 100%;
    span {padding: 4px 0;}
    span+span {padding: 4px;}
  }
  &.header span {
    color: #979799;
  }
}
#currentOrdersScroll, #historyOrdersScroll {
  position:relative;
  height: 270px;
  overflow: hidden;
  /deep/ .iScrollVerticalScrollbar{
    position: absolute; z-index: 9999; width: 5px; bottom: 2px; top: 2px; right: 1px; overflow: hidden; pointer-events: none;
    .iScrollIndicator {
      box-sizing: border-box; position: absolute; background: rgba(151,151,153,.2); border-radius: 3px; width: 100%;
    }
  }
}
.not-login {
    position: absolute;
    top: 80px;
    width: 100%;
    >img {
        display: inline-block;
        margin-top: 50px;
        width: 150px;
    }
}
</style>
