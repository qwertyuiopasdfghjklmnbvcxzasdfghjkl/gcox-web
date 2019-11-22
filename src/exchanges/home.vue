<template>
  <div class="exchange">
    <div class="neck"></div>
    <div class="ui-flex">
      <left :iconUrl="iconUrl" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :symbol="symbol" :toFixed="toFixed" :lastPrice="toFixed(getLast24h.close, fixedNumber)" @changeSymbol="changeSymbol"/>
      <div class="right-container ui-flex-1">
        <div class="block">
          <table class="current-detail"> 
           <thead> 
            <tr> 
             <th class="text-left"> {{$t('home.home_change_24h')}}<!--24h涨跌--> </th> 
             <th class="text-left"> {{$t('home.home_high_24h')}}<!--24h最高价--> </th> 
             <th class="text-left"> {{$t('home.home_low_24h')}}<!--24h最低价--> </th> 
             <th class="text-left"> {{$t('home.home_volume_24h')}}<!--24h成交量--> </th> 
            </tr> 
           </thead> 
           <tbody> 
            <tr> 
             <td class="text-left" :class="[getLast24h.isDown?'rang-down':'rang-up']"> {{getLast24h.isDown?'':'+'}}{{getLast24h.percent}}% </td> 
             <td class="rang-up text-left"> {{toFixed(getLast24h.high, fixedNumber)}} </td> 
             <td class="rang-down text-left"> {{toFixed(getLast24h.bottom, fixedNumber)}} </td> 
             <td class="text-left"> {{toFixed(getLast24h.vol, 2)}} {{baseSymbol}} </td> 
            </tr> 
           </tbody> 
          </table>
        </div>
        <kline ref="kline" :iconUrl="iconUrl" :klineData="klineData" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :symbol="symbol" :fixedNumber="fixedNumber" />
        <div class="ui-flex">
          <div class="business block no-margin">
            <business ref="business" :fixedNumber="fixedNumber" :Quantityaccu="Quantityaccu" :Amountaccu="Amountaccu" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :fromWallet="fromWallet" :toWallet="toWallet" :marketList="marketList" />
          </div>
          <div class="depth ui-flex-1 block no-margin">
            <depth ref="depth" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :Quantityaccu="Quantityaccu" :Amountaccu="Amountaccu" :digit="digit"/>
          </div>
        </div>
        <div class="ui-flex">
          <div class="entrust">
            <entrust ref="entrust" :valuationCout="valuationCout" :newRmbCount="newRmbCount" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :symbol="symbol" :toFixed="toFixed" :mul="mul" :changeEntrustData="changeEntrustData"/>
          </div>
          <div class="lastdeal ui-flex-1">
            <lastdeal ref="lastdeal" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :Quantityaccu="Quantityaccu" :symbol="symbol" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import left from '@/exchanges/market/left'
import kline from '@/exchanges/market'
import business from '@/exchanges/market/business'
import depth from '@/exchanges/market/depth'
import lastdeal from '@/exchanges/market/lastdeal'
import entrust from '@/exchanges/market/entrust'
import KLineWebSocket from '@/assets/js/websocket'
import marketApi from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import config from '@/assets/js/config'
import valuation from '@/components/valuation'

export default {
  components: {
    left,
    kline,
    business,
    depth,
    lastdeal,
    entrust,
    valuation,
  },
  data () {
    return {
      isFirst: true,
      fixedNumber: 8, //价格进度控制
      Quantityaccu: 4, //数量精度控制
      Amountaccu: 8, //金额精度控制
      digit: 4, //深度合并的选项数量
      klineData: [], // k线数据
      socket: null,
      fromWallet: null,
      toWallet: null,
      changeEntrustData: {},
      valuationCout: 0, // 当前估值
      newRmbCount: 0, // 最新人民币估值
      marketList: [] //市场列表
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getLast24h', 'getMarketConfig']),
    baseSymbol () {
      let symbol = this.$route.params.symbol
      if (symbol) {
        symbol = symbol.split('_')[1]
        return symbol || 'BTC'
      } else {
        return 'BTC'
      }
    },
    currentSymbol () {
      let symbol = this.$route.params.symbol
      if (symbol) {
        symbol = symbol.split('_')[0]
        return symbol || 'ETH'
      } else {
        return 'ETH'
      }
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    iconUrl () {
      if (!this.getMarketConfig) {
        return null
      }
      let d = this.getMarketConfig[this.symbol]
      if (!d) {
        return null
      }
      return d.iconBase64 ? `data:image/png;base64,${d.iconBase64}` : config.origin + d.iconUrl
    }
  },
  watch: {
    getApiToken () {
      this.socket && this.socket.changeLogin()
    },
    symbol () {
      this.get24hPrice()
      this.socket && this.socket.switchSymbol && this.socket.switchSymbol(this.symbol)
    },
    fixedNumber(newVal){
      this.$refs.depth.mergeValue = newVal
    }
  },
  created () {
    window.klineLocal = this
    this.socket = KLineWebSocket({
      symbol: this.symbol,
      period: null,
      callback: (res) => {
        if (res.symbol && res.symbol !== this.symbol) {
          //console.log(`市场数据不匹配...`)
          return
        }
        // K线图数据
        if (res.dataType === 'kline') { // K线图数据
          let klineDatas = this.klineData
          let datas = res.data && res.data.constructor === Array ? res.data : []
          let newArray = []
          if(datas.length>0){
            datas.sort((item1, item2)=>{
              return item1[0]>=item2[0]?1:-1
            })
          }
          datas.forEach((item) => {
            newArray.push([Number(item[0]), parseFloat(this.toFixed(Number(item[1]))) || 0, parseFloat(this.toFixed(Number(item[2]))) || 0, parseFloat(this.toFixed(Number(item[3]))) || 0, parseFloat(this.toFixed(Number(item[4]))) || 0, parseFloat(this.toFixed(Number(item[5]))) || 0])
          })
          if (!this.isFirst && newArray.length===1) {
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
                if(klineDatas.slice(-1).length===0 || (klineDatas.slice(-1).length && item[0]>klineDatas.slice(-1)[0][0])){
                  klineDatas.push(item)
                }
              }
            })
          } else if(newArray.length>1){
            this.isFirst = false
            this.klineData = newArray
          }
        } else if (res.dataType === 'LastOrderBook') {
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
          this.tiggerEvents({
            name: 'klineEvent',
            params: {
              type: 'depth',
              asks: data.asks || [],
              bids: data.bids || []
            }
          })
        } else if (res.dataType === 'LastPrice') {
          // 24小时最新信息
          this.setLast24h(res.data)
        } else if (res.dataType === 'LastAccounts') {
          // 用户账户余额
          this.tiggerEvents({
            name: 'balanceEvent',
            params: {
              type: 'updateData',
              data: res.data
            }
          })
        } else if (res.dataType === 'LastUserOrderBook') {
          //console.log('res.data==',res.data)
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
          if(window.marketOrder){
            res.data.forEach(item=>{
              item.idx = window.marketOrder[item.market]
            })
          }
          this.tiggerEvents({
            name: 'marketEvent',
            params: {
              type: 'updateData',
              data: res.data
            }
          })
        }
      },
      onClose: () => {
        this.isFirst = true
      }
    })

    this.get24hPrice()
  },
  methods: {
    ...mapActions(['setLast24h', 'tiggerEvents']),
    get24hPrice () {
      let tempSymbol = this.symbol
      // 获取24小时最新价格
      marketApi.get24hPrice({
        symbol: this.symbol
      }, (res) => {
        if (tempSymbol !== this.symbol) {
          //console.log(`24h-symbol不匹配${tempSymbol}-${this.symbol}`)
          return
        }
        // 24小时最新信息
        this.setLast24h(res)
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    },
    mul (price, v1, v2) {
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return '暂无'// 市价
      }
      return numUtils.mul(v1, v2).toFixed(this.fixedNumber)
    },
    switchPeriod (period) {
      this.isFirst = true
      this.socket && this.socket.switchPeriod && this.socket.switchPeriod(period)
    },
    changeSymbol (baseSymbol, currentSymbol) {
      this.klineData = []
      this.$refs.business.formData.amount = ''
      this.$refs.business.percent = '0'
      this.$router.push({name: 'exchange_index', params: {symbol: `${currentSymbol}_${baseSymbol}`}})
    },
  },
  beforeDestroy () {
    this.setLast24h()
    this.socket && this.socket.close()
  }
}
</script>
<style lang="less" scoped>
.exchange {
    background: #242328;
    color: #f1f1f2;
}
.neck {border-top: 1px solid hsla(0,0%,100%,.08); padding-bottom: 6px; }



.right-container {
  padding-right: 6px;
  margin-left: 4px;
}
.current-detail {
    table-layout: fixed;
    th {
        font-size: 12px;
        font-weight: 400;
        color: #979799;
        height: 35px;
        line-height: 35px;
        width: 200px;
    }
    td {
        font-size: 18px;
        height: 35px;
        line-height: 35px;
    }
}
.block {
    background: #19181c;
    margin-bottom: 4px;
    font-size: 12px;
    padding: 0 10px;
    .no-margin {
        margin: 0;
    }
}
.business {width: 33%; border-right: 4px solid #242328; }
.entrust {width: 66%; border-right: 4px solid #242328;}
</style>

