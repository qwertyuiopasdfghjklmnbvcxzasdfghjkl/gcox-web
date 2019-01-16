<template>
  <div class="page">
    <cp-top-back :backPage="'exchange'" :showRight="false">
      <h1>
        <span v-tap="{methods: toggleMarketList}">{{currentSymbol}}/{{baseSymbol}}</span>
      </h1>
      <router-link tag="i" class="kline-btn" :to="{name: 'kline', params: {market: `${currentSymbol}_${baseSymbol}`}}"></router-link>
    </cp-top-back>
    <div class="page-main">
      <section class="exchange-container clearfix">
        <business :pTradeType="tradeType" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol"></business>
        <div class="right">
          <transition enter-active-class="animated short slideInDown" leave-active-class="animated short slideOutUp">
            <depth v-model="showLatestDeal" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" v-show="!showLatestDeal"></depth>
          </transition>
          <transition enter-active-class="animated short slideInUp" leave-active-class="animated short slideOutDown">
            <lastdeal :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :symbol="symbol" v-model="showLatestDeal" v-show="showLatestDeal"></lastdeal>
          </transition>
        </div>
      </section>
      <entrust :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :symbol="symbol"></entrust>
    </div>
    <cp-mask :show="showMarkets" @hide="hideMarketList" :style="{'top': '0.8rem', 'background-color': 'rgba(0, 0, 0, .5)'}">
      <ul class="wallet-list">
        <li v-for="(market, index) in getMarketList" v-tap="{methods: changeMarket, market: market }">{{market.currencySymbol}}/{{market.baseSymbol}}</li>
      </ul>
    </cp-mask>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DataWebSocket from '@/assets/js/websocket'
import numUtils from '@/assets/js/numberUtils'
import business from '@/pages/icontrading/market/business'
import lastdeal from '@/pages/icontrading/market/lastdeal'
import entrust from '@/pages/icontrading/market/entrust'
import depth from '@/pages/icontrading/market/depth'
import cpSwitch from '@/components/switch'
export default {
  name: 'exchange-market',
  components: {
    business,
    lastdeal,
    entrust,
    depth,
    cpSwitch
  },
  data () {
    return {
      showMarkets: false,
      showLatestDeal: false,
      dataSocket: null,
      tradeType: 'buy',
      business: {
        market: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getInitMarket', 'getMarketList', 'getUserWallets']),
    baseSymbol () {
      let symbol = this.$route.params.market
      if (symbol) {
        symbol = symbol.split('_')[1]
        return symbol ? symbol : 'BTC'
      } else {
        return 'BTC'
      }
    },
    currentSymbol () {
      let symbol = this.$route.params.market
      if (symbol) {
        symbol = symbol.split('_')[0]
        return symbol ? symbol : 'ETH'
      } else {
        return 'ETH'
      }
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    }
  },
  watch: {
    symbol () {
      this.dataSocket && this.dataSocket.switchSymbol(this.symbol)
    }
  },
  created () {
    this.tradeType = this.$route.params.action !== false ? 'buy' : 'sell'
    this.InitDataSoket()
  },
  beforeDestroy () {
    this.dataSocket && this.dataSocket.close()
  },
  methods: {
    ...mapActions(['setLast24h', 'tiggerEvents','setMarketList']),
    toggleMarketList (args) {
      this.showMarkets = !this.showMarkets
    },
    hideMarketList () {
      this.showMarkets = false
    },
    changeMarket (args) {
      this.showMarkets = false
      this.$router.replace({name: 'exchange-market', params: {market: `${args.market.currencySymbol}_${args.market.baseSymbol}`}})
    },
    InitDataSoket () { //初始化数据websoket
      this.dataSocket = DataWebSocket({
        symbol: this.symbol,
        period: '1m',
        subscribe: ['depth','msg','last_price','new_transaction','user_new_orderbook','user_history_orderbook'],
        callback: (res) => {
          if (res.symbol && res.symbol !== this.symbol) {
            console.log(`市场数据不匹配...`)
            return
          }
          if (res.dataType === 'LastOrderBook') {
            // 深度数据
            let data = res.data
            this.tiggerEvents({
              name: 'depthEvent',
              params: {
                type: 'updateDatas',
                asks: data.asks || [],
                bids: data.bids || []
              }
            })
          } else if (res.dataType === 'LastPrice') {
            // 24小时最新信息
            this.setLast24h(res.data)
          } else if (res.dataType === 'LastAccounts') {
            // 用户账户余额
            let temp = {}
            res.data.forEach((item) => {
              temp[item.accountName] = item
            })
            this.getUserWallets.forEach((item) => {
              let d = temp[item.accountName]
              if (d) {
                item.availableBalance = d.availableBalance
                item.frozenBalance = numUtils.add(d.frozenBalance, d.adFrozenBalance).add(d.loanBalance).toFixed(8)
                item.totalBalance = d.totalBalance
              }
            })
          } else if (res.dataType === 'LastUserOrderBook') {
            // 当前委托
            this.tiggerEvents({
              name: 'extrustEvent',
              params: {
                type: 'current',
                data: res.data
              }
            })
          } else if (res.dataType === 'LastHistoryBook') {
            // 历史委托
            this.tiggerEvents({
              name: 'extrustEvent',
              params: {
                type: 'history',
                data: res.data
              }
            })
          } else if (res.dataType === 'LastTrades') {
            // 最新交易记录
            this.tiggerEvents({
              name: 'lastdealEvent',
              params: {
                type: 'updateData',
                data: res.data
              }
            })
          } else if (res.dataType === 'markets') {
            // 市场信息
            if (this.getMarketList) {
              let datas = this.getMarketList
              let tempObj = {}
              datas.forEach((item) => {
                tempObj[item.market] = item
              })
              res.data.forEach((item) => {
                let d = tempObj[item.market]
                if (d) {
                  item.collection = d.collection
                  item.iconBase64 = d.iconBase64
                  item.iconUrl = d.iconUrl
                }
              })
            }
            this.setMarketList(res.data)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@write-e76:#e76d42;
@write-556:#55637c;
@write-007:#0072fd;
.page-top h1{height: .8rem;font-size: 0;line-height: 0;text-align: center;}
.page-top h1 span{position: relative;display: inline-block;padding-right: .36rem;font-size: .32rem;line-height: .8rem;color: #fff;}
.page-top h1 span::after{content: "";position: absolute;top: 50%;right: 0;margin-top: -0.06rem;border-width: .12rem .12rem 0 .12rem;border-style: solid;border-color: #fff transparent transparent transparent;}
.page-top .kline-btn{position: absolute;top: .2rem;right: .3rem;width: .4rem;height: .4rem;
background: url('../../assets/img/kline-icon.png') no-repeat center center / contain;
background-size: 90%;
}
.page-top .kline-btn:active{background-image: url('../../assets/img/kline-icon.png');}

.wallet-list{width: 50%;max-height: calc(100% - .8rem);margin-left: auto;margin-right: auto;overflow-x: hidden;overflow-y: auto;}
.wallet-list li{height: .8rem;line-height: .8rem;font-size: 0.32rem;color: #8089a3;text-align: center;background-color: #292929;border-bottom: 1px solid #8089a3;}
.wallet-list li:last-of-type{border-bottom-width: 0;}
.wallet-list li:active{color: #292929;background-color: #8089a3;}

.exchange-container, .entrust-container {
  height:-webkit-calc(100vh - 0.8rem);height: calc(100vh - 0.8rem);min-height:10rem;
  background-color: #161f2f;padding-left: 0.3rem;padding-right: 0.3rem;position: relative;
}
.exchange-container {padding-top: 0.3rem;}
.exchange-container .right{
  float: right;width: 48%;height: 100%;position: relative;text-overflow: hidden;
}
.exchange-container /deep/ .range-percent .mt-range-runway{border-top-color: #46566f;}
.exchange-container /deep/ .range-percent .mt-range-thumb{border:0.07rem solid #fff;background-color: @write-007;z-index:2;}
.exchange-container /deep/ .mt-range-progress{background-color:@write-007;}
</style>
