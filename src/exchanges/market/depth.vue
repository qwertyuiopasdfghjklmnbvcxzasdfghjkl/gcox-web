<template>
  <div class="block depth">
    <div class="title-container clearfix">
       <span class="pull-left">{{$t('exchange.order_book')}}<!-- 订单簿 --></span> 
       <span class="small pull-left">{{$t('exchange.exchange_last_price')}}<!-- 最新价 --></span> 
       <span class="small pull-left"><span>{{toFixed(this.getLast24h.close)}} {{toCoin}}</span></span> 
       <span class="small pull-right arrow-down" @click="showDigit=!showDigit"><em>{{mergeValue}}{{$t('exchange.exchange_decimals')}}<!--位小数--></em> 
        <ul v-show="showDigit">
         <li v-for="n in getDigit" :key="n + fixedNumber - getDigit" @click="mergeValue=(n + fixedNumber - getDigit)">{{n + fixedNumber - getDigit}}{{$t('exchange.exchange_decimals')}}<!--位小数--></li>
        </ul></span> 
       <span class="small pull-right">{{$t('exchange.exchange_Deep_merger')}}:<!--深度合并--></span>
    </div>
    <div class="order-book clearfix">
      <ul class="header buy">
        <li class="ui-flex">
          <span class="green with-35">{{$t('exchange.exchange_buy')}}<!-- 买入 --></span> 
          <span class="text-center ui-flex-1">{{$t('exchange.exchange_Transaction_amount')}}({{toCoin}})<!--成交金额--></span> 
          <span class="text-center ui-flex-1">{{$t('exchange.exchange_amount')}} ({{fromCoin}})<!--数量--></span> 
          <span class="text-right ui-flex-1">{{$t('exchange.exchange_price')}}({{toCoin}})<!--价格--></span>
        </li>
      </ul>

      <ul class="header sell">
        <li class="ui-flex">
          <span class="ui-flex-1">{{$t('exchange.exchange_price')}}({{toCoin}})<!--价格--></span> 
          <span class="text-center ui-flex-1">{{$t('exchange.exchange_amount')}} ({{fromCoin}})<!--数量--></span> 
          <span class="text-center ui-flex-1">{{$t('exchange.exchange_Transaction_amount')}}({{toCoin}})<!--成交金额--></span> 
          <span class="text-right red with-35">{{$t('exchange.exchange_sell')}}<!-- 卖出 --></span>
        </li>
      </ul>

      <ul class="buy">
        <li class="ui-flex bar pointer" :style="listItemStyle(item, 'bid')" v-for="(item,index) in filterBids" :key="item.orderBookId" @click="clickChangeValue(item)">
          <span class="rang-up with-35">{{index+1}}</span> 
          <span class="text-center ui-flex-1" @click="clickChangeValue(item, 'total')">{{muldepth(item.price, item.avaliableAmount)}}</span> 
          <span class="text-center ui-flex-1" @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.avaliableAmount, Quantityaccu)}}</span> 
          <span class="text-right ui-flex-1" @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.price,mergeValue)}}</span>
        </li>
      </ul>
      
      <ul class="sell">
        <li class="ui-flex bar pointer" :style="listItemStyle(item, 'ask')" v-for="(item,index) in filterAsks" :key="item.orderBookId" @click="clickChangeValue(item)">
          <span class="ui-flex-1" @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.price,mergeValue)}}</span> 
          <span class="text-center ui-flex-1" @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.avaliableAmount, Quantityaccu)}}</span> 
          <span class="text-center ui-flex-1" @click="clickChangeValue(item, 'total')">{{muldepth(item.price, item.avaliableAmount)}}</span> 
          <span class="text-right rang-down with-35">{{index+1}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
export default {
  props: {
    baseSymbol: {
      type: String,
      default: ''
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    fixedNumber: {
      type: Number
    },
    Quantityaccu: {
      type: Number
    },
    Amountaccu: {
      type: Number
    },
    digit: {
      type: Number
    }
  },
  data () {
    return {
      asks: [],
      bids: [],
      mergeValue: 8,
      price: '0',
      direction: null,
      showDigit:false
    }
  },
  computed: {
    ...mapGetters(['getLast24h', 'getEntrustPrices', 'getNetworkSignal']),
    getDigit (){
      return this.fixedNumber>=this.digit?this.digit:this.fixedNumber
    },
    fromCoin () {
      return this.currentSymbol
    },
    toCoin () {
      return this.baseSymbol
    },
    filterAsks () {
      let asks = this.mergeDatas(this.asks)
      asks = asks.filter(item=>{
        let amount = numUtils.mul(item.avaliableAmount, item.price).toFixed(8)
        return numUtils.BN(amount).gt('0.00000000') ? true : false
      })
      return asks.sort((item1, item2) => {
        return numUtils.BN(item1.price).gt(item2.price) ? 1 : -1
      })
    },
    filterBids () {
      let bids = this.mergeDatas(this.bids)
      bids = bids.filter(item=>{
        let amount = numUtils.mul(item.avaliableAmount, item.price).toFixed(8)
        return numUtils.BN(amount).gt('0.00000000') ? true : false
      })
      return bids
    },
    askMax () {
      return this.getMaxAmount(this.filterAsks)
    },
    bidMax () {
      return this.getMaxAmount(this.filterBids)
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
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
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
    getDepthList () {
      let tempSymbol = this.symbol
      // 获取深度信息
      marketApi.getDepths(this.symbol, (res) => {
        if (tempSymbol !== this.symbol) {
          console.log(`depth-symbol不匹配${tempSymbol}-${this.symbol}`)
          return
        }
        this.asks = res.asks //  卖
        this.bids = res.bids // 买
      })
    },
    mergeDatas (datas) {
      let mergeDatas = []
      let temp = {}
      datas.forEach((item) => {
        let key = this.toFixed(item.price, this.mergeValue)
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
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    },
    muldepth (v1, v2) {
      return numUtils.mul(v1, v2).toFixed(this.mergeValue, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.block {
    background: #19181c;
    margin-bottom: 4px;
    padding: 0 10px;
    font-size: 12px;
    color: #f1f1f2;
}
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    box-sizing: border-box;
    >span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-bottom: 2px solid transparent;
      &+span {
          margin-left: 40px;
      }
      &.small {
          font-size: 12px;
          margin-left: 20px;
          &+.small {
              margin-left: 10px;
          }
          &.arrow-down {
              display: inline-block;
              width: 70px;
              cursor: pointer;
              background: url('../../assets/img/arrow-down.png') no-repeat 94% 50%;
              background-size: 12px;
              padding: 0 20px 0 5px;
              position: relative;
              background-color: #242328;
              >ul {
                  width: 100%;
                  position: absolute;
                  left: 0;
                  z-index: 100;
                  background: #242328;
                  padding-left: 5px;
                  box-sizing:border-box;
                  li:hover {
                    color: #00a0e9;
                  }
              }
          }
      }
      
  }
}
.order-book {
    height: 450px;
    overflow: hidden;
    background: #19181c;
    font-size: 12px;
    ul {
        float: left;
        width: 50%;
        overflow: hidden;
        box-sizing: border-box;
        &:not(.header) li {line-height: 25px;}
        .with-35 {
            width: 35px;
        }
    }
    ul.buy {
        border-right: 2px solid #19181c;
        li.bar {
            background: url('../../assets/img/green_bar.png') no-repeat right center;
        }
    }
    ul.sell {
        border-left: 2px solid #19181c;
        li.bar {
            background: url('../../assets/img/red_bar.png') no-repeat left center;
        }
    }
    ul.header span {
        font-weight: 400;
        color: #979799;
        padding: 10px 4px;
        &.green {color: #1bc863;}
        &.red {color: #f1304a;}
    }
    ul li {
      position: relative;
      span {padding: 4px; position: relative; z-index: 10;}
    }
}
</style>
