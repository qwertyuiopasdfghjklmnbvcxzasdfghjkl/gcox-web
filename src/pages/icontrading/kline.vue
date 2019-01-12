<template>
  <div class="page">
    <cp-top-back></cp-top-back>
    <div class="page-main">
      <div class="info">
        <div>
          <p class="market"><span class="symbol-switch" v-tap="{methods:toggleMarketList}">{{symbol_display}}</span></p>
          <p class="price" :class="{up:(getLast24h.direction!=2)}">
            <span :class="{red:getLast24h.direction==2,green:getLast24h.direction==1}">{{getLast24h.close}}</span>
            <span :class="{red:Number(getLast24h.percent)<0,green:Number(getLast24h.percent)>0}">{{getLast24h.percent}}%</span>
          </p>
          <p class="fabi">≈ <valuation :lastPrice="getLast24h.close" :baseSymbol="baseSymbol"/></p>
        </div>
        <div>
          <p class="market-favorite">
            <img v-tap="{methods:keep}" v-if="curMarket && !curMarket.collection" src="../../assets/img/cdcc/favorite@3x.png"/>
            <img v-tap="{methods:keep}" v-if="curMarket && curMarket.collection" src="../../assets/img/cdcc/favorite-selected@3x.png"/>
          </p>
          <p>{{$t('exchange.exchange_high')}}<!--24h最高价--><span>{{getLast24h.high}}</span></p>
          <p>{{$t('exchange.exchange_low')}}<!--24h最低价--><span>{{getLast24h.bottom}}</span></p>
          <p>{{$t('home.home_volume_24h')}}<!--24h成交量--><span>{{$root.toFixed(getLast24h.vol, 2)}} {{baseSymbol}}</span></p>
        </div>
      </div>
      <ul class="tabs">
        <li :class="{active:isKline}">
          <a v-tap="{methods:toggleDepth, type:true}">
            <img v-if="!isKline" src="../../assets/img/cdcc/hangqing@3x.png"/>
            <img v-if="isKline" src="../../assets/img/cdcc/hangqing-selected@3x.png"/>
            {{$t('public.kline_title')}}<!--K线图-->
          </a>
        </li>
        <li :class="{active:!isKline}">
          <a v-tap="{methods:toggleDepth, type:false}">
            <img v-if="isKline" src="../../assets/img/cdcc/kline@3x.png"/>
            <img v-if="!isKline" src="../../assets/img/cdcc/kline-selected@3x.png"/>
            {{$t('exchange.exchange_depth')}}<!--深度图-->
          </a>
        </li>
      </ul>
      <div class="acpanel">
        <button type="button" class="buy" v-tap="{methods:buyOrSell, t:true}">{{$t('exchange.exchange_buy')}}<!--买入--></button>
        <button type="button" class="sell" v-tap="{methods:buyOrSell, t:false}">{{$t('exchange.exchange_sell')}}<!--卖出--></button>
      </div>
      <div class="kline-panel">
        <div class="kline-panel-container" :class="{depth:!isKline}">
          <div class="kline-master">
            <div class="kline-container" id="klineContainer"></div>
            <div class="kine-select">
              <span v-tap="{methods:setPeriod, t:'1m'}" :class="{active:period=='1m'}">{{$t('exchange.exchange_time')}}<!--分时--></span>
              <span v-tap="{methods:setPeriod, t:'5m'}" :class="{active:period=='5m'}">5{{$t('exchange.exchange_min')}}<!--5分钟--></span>
              <span v-tap="{methods:setPeriod, t:'15m'}" :class="{active:period=='15m'}">15{{$t('exchange.exchange_min')}}<!--15分钟--></span>
              <span v-tap="{methods:setPeriod, t:'1h'}" :class="{active:period=='1h'}">1{{$t('exchange.exchange_hour')}}<!--1小时--></span>
              <span v-tap="{methods:setPeriod, t:'6h'}" :class="{active:period=='6h'}">6{{$t('exchange.exchange_hour')}}<!--6小时--></span>
              <span v-tap="{methods:setPeriod, t:'1d'}" :class="{active:period=='1d'}">1{{$t('exchange.exchange_day')}}<!--1天--></span>
              <span class="more" @click="isMore=!isMore">
                <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
                  <ul class="choices" v-show="isMore">
                    <li v-tap="{methods:setIndice, t:'MACD'}" :class="{active:indice=='MACD'}">MACD</li>
                    <li v-tap="{methods:setIndice, t:'KDJ'}" :class="{active:indice=='KDJ'}">KDJ</li>
                    <li v-tap="{methods:setIndice, t:'StochRSI'}" :class="{active:indice=='StochRSI'}">StochRSI</li>
                  </ul>
                </transition>
              {{$t('exchange.advanced_more')}}<!--更多--></span>
            </div>
          </div>
          <div class="kline-container" id="depthContainer"></div>
        </div>
      </div>
    </div>
    <cp-mask :show="showMarkets" @hide="hideMarketList" :style="{'top': '0.8rem', 'background-color': 'rgba(0, 0, 0, .5)'}">
      <ul class="wallet-list">
        <li v-for="market in getMarketList" v-tap="{methods:changeMarket, market:market}">{{market.currencySymbol}}/{{market.baseSymbol}}</li>
      </ul>
    </cp-mask>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ECharts from '@/assets/js/echarts.min'
import KLineWebSocket from '@/assets/js/websocket'
import KLineChart from '@/assets/js/kline.draw'
import DepthChart from '@/assets/js/kline.depth'
import getDepthOption from '@/assets/js/depth'
import numUtils from '@/assets/js/numberUtils'
import valuation from '@/components/valuation'
import marketApi from '@/api/market'
let chartSettings = window.localStorage.getItem('chartSettings')
chartSettings && (chartSettings = JSON.parse(chartSettings))
export default {
  name: 'kline',
  components: {
    valuation
  },
  data () {
    return {
      asks: [],
      bids: [],
      loading: true,
      showMarkets: false,
      kLineChart: null,
      depthChart: null,
      isMore: false,
      period: chartSettings ? chartSettings.charts.period : '1m', // 分时线时期
      indice: 'MACD', // 技术指标
      isKline: true, // 当前是否是K线图
      isFirstKline: true, // 是否第一次加载K线数据
      klineSocket: null,
      klineData: [], // k线数据
      depthData: {},
      business: {
        market: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getLast24h', 'getInitMarket', 'getMarketList']),
    curMarket () {
      if (!this.getMarketList) {
        return false
      }
      let markets = this.getMarketList
      for (let i = 0; i < markets.length; i++) {
        if (this.symbol === markets[i].market) {
          return markets[i]
        }
      }
      return false
    },
    baseSymbol () {
      return this.business.market.split('_')[1]
    },
    currentSymbol () {
      return this.business.market.split('_')[0]
    },
    symbol () {
      return this.business.market.split('_').join('')
    },
    symbol_display () {
      return this.business.market.replace('_', '/')
    },
    depthChange () {
      return {
        asks: this.filterAsks,
        bids: this.filterBids
      }
    },
    filterAsks () {
      let mergeDatas = []
      let temp = {}
      this.asks.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      newDatas.sort((item1, item2) => {
        return numUtils.BN(item1[0]).lt(numUtils.BN(item2[0])) ? -1 : 1
      })
      return newDatas
    },
    filterBids () {
      let mergeDatas = []
      let temp = {}
      this.bids.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      return newDatas
    }
  },
  watch: {
    '$route.params.market' () { //切换市场后重新初始化websoket
      this.business.market = this.$route.params.market
      this.klineSocket.close()
      this.loading = true
      this.isFirstKline = true
      this.InitKlineWebSoket()
    },
    klineData (n, o) { //如果K线数据有变化，更新K线图数据
      this.kLineChart.updateKlienDatas(JSON.parse(JSON.stringify(n)))
    },
    period (n, o) { //如果K线周期变化，重新请求周期数据
      this.loading = true
      this.isFirstKline = true
      this.kLineChart.switch_period(n)
      this.klineSocket.switchPeriod(n)
    },
    depthChange () {
      this.depthChart && this.depthChart.drawDepth(this.depthChange)
    }
  },
  created () {
    this.business.market = this.$route.params.market || this.getInitMarket
    this.InitKlineWebSoket()
    this.$nextTick(() => {
      this.initECharts()
    })
  },
  beforeDestroy () {
    this.klineSocket && this.klineSocket.close()
  },
  methods: {
    ...mapActions(['setLast24h', 'tiggerEvents', 'setMarketList']),
    toggleMarketList (args) {
      this.showMarkets = !this.showMarkets
    },
    hideMarketList () {
      this.showMarkets = false
    },
    changeMarket (args) {
      this.showMarkets = false
      this.$router.replace({name:'kline', params:{market: `${args.market.currencySymbol}_${args.market.baseSymbol}`}})
    },
    buyOrSell (args) {
      this.$router.replace({name: 'exchange-market', params: {market: this.business.market, action: args.t}})
    },
    toggleDepth (args) {
      this.isKline = args.type
    },
    initECharts () {
      this.kLineChart = KLineChart({
        container: document.getElementById('klineContainer'),
        klineType: 'eosbtc',
        scale: 2,
        hideDepth: true,
        fixedNumber: 8,
        ThemeColor: {
          Background: '#0d0d0d'
        }
      })
      this.kLineChart.switch_indic(this.indice)
      this.kLineChart.updateKlienDatas(JSON.parse(JSON.stringify(this.klineData)))
      // 深度图
      this.depthChart = DepthChart({
        isAmountShowLeft: true,
        container: document.getElementById('depthContainer')
      })
    },
    toggleQualification (args) {
      this.isMore = false
      this.qualification = args.type
    },
    InitKlineWebSoket () { // 初始化K线websoket
      this.klineSocket = KLineWebSocket({
        symbol: this.symbol,
        period: this.period,
        callback: (res) => {
          // K线图数据
          if (res.dataType === 'kline') { // K线图数据
            let klineDatas = JSON.parse(JSON.stringify(this.klineData))
            let datas = res.data && res.data.constructor === Array ? res.data : []
            let newArray = []
            datas.forEach((item) => {
              newArray.push([Number(item[0]), parseFloat(item[1]) || 0, parseFloat(item[2]) || 0, parseFloat(item[3]) || 0, parseFloat(item[4]) || 0, parseFloat(item[5]) || 0])
            })
            if (!this.isFirstKline) {
              let tempObj = {}
              newArray.forEach((item) => {
                tempObj[String(item[0])] = item
              })
              for (let i = 0; i < klineDatas.length; i++) {
                let td = klineDatas[i]
                if (tempObj[String(td[0])]) {
                  klineDatas.splice(i, 1, tempObj[String(td[0])])
                  delete tempObj[String(td[0])]
                }
              }
              newArray.forEach((item) => {
                if (tempObj[String(item[0])]) {
                  klineDatas.push(item)
                }
              })
              this.klineData = klineDatas
            } else {
              this.isFirstKline = false
              this.klineData = newArray
            }

          } else if (res.dataType === 'LastOrderBook') {
            // 深度数据
            this.asks = res.data.asks
            this.bids = res.data.bids
          } else if (res.dataType === 'LastPrice') {
            // 24小时最新信息
            this.setLast24h(res.data)
          } else if (res.dataType === 'markets') {
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
            // 市场信息
            this.setMarketList(res.data)
          }
        },
        onClose: () => {
          this.isFirstKline = true
        }
      })
    },
    setPeriod (args) { //设置K线周期
      this.period = args.t
    },
    setIndice (args) { //设置技术指标
      this.isMore = false
      if (this.isKline) {
        this.kLineChart.switch_indic(args.t)
      }
      this.indice = args.t
    },
    toFixed (v1) {
      return numUtils.BN(v1).toFixed(8)
    },
    keep () {
      let data = this.curMarket
      if (this.getApiToken) {
        if (data.collection) { // 取消
          marketApi.removeCollection({
            market: data.market
          }, (res) => {
            data.collection = !data.collection
          })
        } else {
          marketApi.addCollection({ // 收藏
            market: data.market
          }, (res) => {
            data.collection = !data.collection
          })
        }
      } else {
        data.collection = !data.collection
      }
    }
  }
}
</script>

<style scoped>
.tabs{width:100%;display:flex;height:1rem;background:#161f2f;align-items:center;
border-top: 0.01rem solid #42526a;
}
.tabs /deep/ li{flex:1;text-align:center;font-size:0.3rem;height: 100%;line-height: 1rem;}
.tabs /deep/ li:first-child{border-right: 0.01rem solid #42526a;}
.tabs /deep/ li a{padding:0.2rem 0.4rem;color: #cbd4ec;}
.tabs /deep/ li.active a{color:#0072fd;}
.tabs /deep/ li img{width:0.31rem;height:0.28rem;vertical-align: middle;margin-right: 0.08rem;}
.symbol-switch{position: relative;display: inline-block;padding-right: .36rem;font-size: .36rem;}
.symbol-switch::after{content: "";position: absolute;top: 50%;right: 0;margin-top: -0.06rem;border-width: .12rem .12rem 0 .12rem;border-style: solid;border-color: #cbd4ec transparent transparent transparent;}

.wallet-list{width: 50%;max-height: calc(100% - 1.6rem);margin: .8rem auto;overflow-x: hidden;overflow-y: auto;}
.wallet-list li{height: .8rem;line-height: .8rem;font-size: 0.32rem;color: #8089a3;text-align: center;background-color: #292929;border-bottom: 1px solid #8089a3;}
.wallet-list li:last-of-type{border-bottom-width: 0;}
.wallet-list li:active{color: #292929;background-color: #8089a3;}

.info{padding: 0.3rem;background-color: #161f2f;display: flex;justify-content: space-between;height:2.5rem;}
.info > div:first-of-type{flex:1;min-width:0;}
.info > div:first-of-type .price{font-size: 0.4rem;padding-top: 0.3rem;}
.info > div:first-of-type .price span{font-size: 0.26rem;display: inline-block;margin-left: 0.25rem;}
.info > div:first-of-type .price span:first-child{margin-left:0;font-size: 0.34rem;}
.info > div:first-of-type .price span.red{color:#e76d42;}
.info > div:first-of-type .price span.green{color:#00cc99;}
.info > div:first-of-type .fabi{color: #8089a3;font-size: 0.3rem;margin-top: 0.3rem;}
.info > div:last-of-type{
  flex: 1;min-width: 0;text-align: right;color: #8089a3;font-size: 0.24rem;line-height: 0.5rem;
  white-space:nowrap;
}
.info > div:last-of-type span{
  color: #cbd4ec;font-size: 0.28rem;display: inline-block;margin-left: 0.2rem;
}
.info > div .market{margin-top: 0.05rem;}
.market-favorite img{width:0.36rem;height:0.34rem;}
.acpanel{
  position: absolute;left: 0;right: 0;bottom: 0;padding: 0.2rem 0.3rem;z-index:3;
  background-color: #0d0d0d;display: flex;justify-content:space-between;align-items:center;
}
.acpanel button{border: none;font-size: 0.3rem;color: #fff;margin:0 0.4rem;}
.acpanel button.buy,.acpanel button.sell{width: 2.7rem;height: 0.85rem;background-color: #00cc99;}
.acpanel button.sell{background-color:#e76d42;}
.acpanel button.depth{width: 0.95rem;height: 0.6rem;font-size: 0.24rem;background-color: #262a42;}
.kline-panel{width:100%;height: calc(100vh - 5.75rem);overflow:hidden;}
.kline-panel-container{width:200%;height:100%;display:flex;transition:0.3s;margin-left:0px;}
.kline-panel-container.depth{margin-left:-100%;}
.kline-panel-container > div{display:flex;flex:1;flex-direction:column;}
.kline-container{
  width:100%;height:100%;margin-top:0.15rem;
  border-top:1px solid #313c5a;border-bottom:1px solid #313c5a;
  background-color: transparent;position: relative;overflow:hidden;
}
.kine-select{
  height: 0.55rem;line-height: 0.55rem;position:relative;
  background-color: #0d0d0d;display: flex;justify-content:space-between;z-index: 3;
}
.kine-select span{padding: 0 0.15rem;color: #8089a3;font-size: 0.24rem;}
.kine-select span.active{color: #cbd4ec;}
.kine-select span.more:after{
  content: '';display: inline-block;border-bottom: 0.12rem  solid #8089A3;border-left: 0.10rem solid transparent;
  border-right: 0.10rem solid transparent;margin-left: 0.12rem;padding-bottom: 0.05rem;
}
.kine-select .choices{
  position: absolute;right: 0;bottom: 0.5rem;width: 1.8rem;box-shadow: 0 3px 6px #11131d;
}
.kine-select .choices li{
  line-height: 0.8rem;padding-left: 0.3rem;background-color: #1b1e2e;border-bottom: 1px solid #262a42;
}
.kine-select .choices li:last-of-type{border-bottom: none;}
.kine-select .choices li.active{background-color:#262a42;}
</style>
