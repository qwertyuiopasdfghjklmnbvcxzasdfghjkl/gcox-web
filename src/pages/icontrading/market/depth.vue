<template>
    <div class="order-book">
        <div>
          <span>{{$t('exchange.exchange_price')}}<!--价格-->({{baseSymbol}})</span>
          <span>{{$t('exchange.exchange_amount')}}<!--数量-->({{currentSymbol}})</span>
        </div>
        <div class="bid-sell">
            <ul class="sell-list" ref="parentListAsk">
                <li v-for="n in askLength">
                    <span>--</span>
                    <span>--</span>
                </li>
                <li v-for="(item, index) in filterAsks" :style="listItemStyle(item, 'ask')">
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.price)}}</span>
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.avaliableAmount, accuracy.quantityAccu)}}</span>
                </li>
            </ul>
        </div>
        <div><p :class="{sell:(getLast24h.direction!=1)}">{{toFixed(getLast24h.close)}}<span><valuation :lastPrice="getLast24h.close" :baseSymbol="baseSymbol"/></span></p></div>
        <div>
            <ul class="buy-list" ref="parentListBid">
                <li v-for="(item, index) in filterBids" :style="listItemStyle(item, 'bid')">
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.price)}}</span>
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.avaliableAmount, accuracy.quantityAccu)}}</span>
                </li>
                <li v-for="n in bidLength">
                    <span>--</span>
                    <span>--</span>
                </li>
            </ul>
        </div>
        <div @click="switchLastDeal"><p>{{$t('exchange.exchange_trade_history')}}<!--最新成交--></p></div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import valuation from '@/components/valuation'
export default {
  props: {
    value: null,
    accuracy: {
      type:Object
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    currentSymbol: {
      type: String,
      default: ''
    }
  },
  components: {
    valuation
  },
  data () {
    return {
      asks: [],
      bids: [],
      mergeLen: 20,
      price: '0',
      active: 'askbid',
      direction: null
    }
  },
  computed: {
    ...mapGetters(['getLast24h', 'getEntrustPrices', 'getNetworkSignal']),
    fromCoin () {
      return this.currentSymbol
    },
    toCoin () {
      return this.baseSymbol
    },
    bidStyle () {
      return this.active === 'bid' ? {height: 'calc(100% - 94px)'} : {}
    },
    askStyle () {
      return this.active === 'ask' ? {height: 'calc(100% - 94px)'} : {}
    },
    filterAsks () {
      let asks = this.mergeDatas(this.asks)
      return asks.sort((item1, item2) => {
        return numUtils.BN(item1.price).lt(item2.price) ? 1 : -1
      })
    },
    filterBids () {
      return this.mergeDatas(this.bids)
    },
    askMax () {
      return this.getMaxAmount(this.filterAsks)
    },
    bidMax () {
      return this.getMaxAmount(this.filterBids)
    },
    askLength () {
      return Math.max(this.mergeLen - this.filterAsks.length, 0)
    },
    bidLength () {
      return Math.max(this.mergeLen - this.filterBids.length, 0)
    },
    keysEntrust () {
      let keys = {}
      this.getEntrustPrices.forEach((item) => {
        let price = this.toFixed(item[0])
        let direction = item[1]
        let key = price + '_' + direction
        keys[key] = true
      })
      return keys
    },
    curArrow () {
      if (Number(this.getLast24h.direction) === 2) {
        return '↓'
      } else if (Number(this.getLast24h.direction) === 1) {
        return '↑'
      } else {
        return null
      }
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    getNetworkTitle () {
      if (!this.getNetworkSignal) {
        return this.$t('public.market_status_running')
      } else {
        return this.$t('public.market_status_delay')
      }
    }
  },
  watch: {
    symbol () {
      this.getDepthList()
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'depthEvent',
        fun: this.depthEvent
      })
    })
    this.getDepthList()
  },
  beforeDestroy () {
    this.removeEvents('depthEvent')
  },
  methods: {
    ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
    switchLastDeal () {
      this.$emit('input', !this.value)
    },
    getDepthList () {
      // 获取深度信息
      marketApi.getDepths(this.symbol, (res) => {
        this.asks = res.asks //  卖
        this.bids = res.bids // 买
      })
    },
    mergeDatas (datas) {
      let mergeDatas = []
      let temp = {}
      try {
        datas.forEach((item) => {
          let key = this.toFixed(item.price)
          let tempItem = temp[key]
          if (!tempItem) {
            temp[key] = {
              price: key,
              avaliableAmount: item.avaliableAmount,
              direction: item.direction
            }
            mergeDatas.push(temp[key])
          } else {
            tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
          }
        })
      } catch (ex) {
        console.warn(datas)
      }
      return mergeDatas
    },
    getMaxAmount (datas) {
      let len = datas.length
      if (!len) {
        return 0
      }
      let max = 0
      datas.forEach((item) => {
        max = Math.max(max, item.avaliableAmount)
      })
      return max
    },
    getAmountTitle (amount) {
      let a = this.toFixed(amount, 2)
      return numUtils.BN(a).equals(0) ? amount : null
    },
    depthEvent (res) {
      if (res && res.type === 'depthEvent') {
        this.direction = res.value
      } else if (res && res.type === 'updateDatas') {
        this.asks = res.asks
        this.bids = res.bids
      }
    },
    listItemStyle (item, type) {
      if (type === 'ask') { // 卖
        if (numUtils.BN(this.askMax).equals(0)) {
          return {}
        }
        let percent = Math.max(1, Math.min(100, numUtils.div(item.avaliableAmount, this.askMax).mul(100).toFixed(2)))
        return {'background-size': `${percent}% 90%`}
      } else if (type === 'bid') { // 买
        if (numUtils.BN(this.bidMax).equals(0)) {
          return {}
        }
        let percent = Math.max(1, Math.min(100, numUtils.div(item.avaliableAmount, this.bidMax).mul(100).toFixed(2)))
        return {'background-size': `${percent}% 90%`}
      }
    },
    checkEntrustPrice (item) {
      let price = this.toFixed(item.price)
      let direction = String(item.direction)
      let key = price + '_' + direction
      return this.keysEntrust[key]
    },
    clickChangeValue (item, type) {
      if (type !== 'total') {
        this.tiggerEvents({
          name: 'businessEvent',
          params: {
            type: type,
            value: item
          }
        })
      } else {
        this.tiggerEvents({
          name: 'businessEvent',
          params: {
            type: 'price',
            value: this.toFixed(item.price)
          }
        })
        this.tiggerEvents({
          name: 'businessEvent',
          params: {
            type: 'amount',
            value: this.toFixed(item.avaliableAmount)
          }
        })
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.order-book{position: absolute;width: 100%;height: 100%;left: 0;top: 0;display: flex;flex-direction:column;}
.order-book> div:nth-of-type(1){flex: 4;min-height: 0;}
.order-book> div:nth-of-type(1) span{
  display: inline-block;width: 50%;text-align: center;color: #8089A3;float:left;font-size: 0.24rem;transform: scale(0.916);
}
.order-book > div:nth-of-type(2){flex-flow:column;justify-content:flex-end;}
.order-book > div:nth-of-type(2),.order-book > div:nth-of-type(4){flex: 40;min-height: 0;display:flex;overflow-y:hidden;}
.order-book > div:nth-of-type(3) {flex: 9;min-height: 0;font-size: 0.34rem;position: relative;}
.order-book > div:nth-of-type(3) p{
  position: absolute;left: 0;right: 0;top: 50%;transform: translateY(-50%);color: #00cc99;
}
.order-book > div:nth-of-type(3) p.sell{color: #e76d42;}
.order-book > div:nth-of-type(3) p span{
  position: absolute;right: 0;line-height: 0.4rem;font-size: 0.24rem;transform: scale(0.916);color: #8089a3;
}
.order-book > div:nth-of-type(5){flex: 7;min-height: 0;position: relative;display:flex;align-items:center;}
.order-book > div:nth-of-type(5) > p{
  position: absolute;left: 0;right: 0;top: 50%;transform: translateY(-65%);font-size: 0.24rem;
}
.order-book > div:nth-of-type(5) > p:after {
  content: '';position: absolute;right: 0;top: 0.1rem;border-bottom: 0.15rem  solid #fff;
  border-left: 0.13rem solid transparent;border-right: 0.13rem solid transparent;
}
.order-book .sell-list,.order-book .buy-list{width:100%;}
.order-book .sell-list li,.order-book .buy-list li{
  height:0.56rem;line-height: 0.56rem;background: url('../../../assets/img/sell-list-bg.png') no-repeat right center;background-size: 1% 90%;
}
.order-book .sell-list li span,.order-book .buy-list li span{
  display: inline-block;float:left;width: 50%;font-size: 0.24rem;transform: scale(0.916);
  &:first-of-type{color: #e76d42;}
  &:last-of-type{color: #fff;text-align: right;}
}
.order-book .sell-list.active{opacity:1;}
.order-book .buy-list li{background-image: url('../../../assets/img/buy-list-bg.png');}
.order-book .buy-list li span:first-of-type{color: #00cc99;}
</style>
