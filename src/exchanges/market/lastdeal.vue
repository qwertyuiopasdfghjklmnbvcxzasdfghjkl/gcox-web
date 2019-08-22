<template>
  <div class="block lastdeal">
    <div class="title-container">
     <span>{{$t('exchange.exchange_trade_history')}}<!--最新成交--></span> 
     <span class="fs16">{{currentSymbol}}/{{baseSymbol}}</span>
    </div>
    <table class="orders-books">
     <thead>
      <tr>
       <th class="text-left">{{$t('exchange.exchange_date')}}<!--时间--></th> 
       <th class="text-left">{{$t('exchange.buy_or_sell')}}<!-- 买卖 --></th> 
       <th class="text-right">{{$t('exchange.exchange_price')}}<!--价格-->({{toCoin}})</th> 
       <th class="text-right">{{$t('exchange.exchange_amount')}}<!--数量-->({{fromCoin}})</th>
      </tr>
     </thead> 
     <tbody>
      <tr v-for="(item, index) in datas" :key="index" @click="clickChangeValue(item)">
       <td class="text-left">{{formatDate(item.createdAt)}}</td> 
       <td class="text-left" :class="[Number(item.direction)===1 ? 'rang-up' : 'rang-down']">{{Number(item.direction)===1 ? $t('exchange.exchange_buy') : $t('exchange.exchange_sell')}}</td> 
       <td class="text-right">{{toFixed(item.price)}}</td> 
       <td class="text-right">{{toFixed(item.amount, Quantityaccu)}}</td>
      </tr>
      <tr v-if="showLoading">
        <td><loading :size="24"/></td>
      </tr>
     </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import market from '@/api/market'
import loading from '@/components/loading'
import numUtils from '@/assets/js/numberUtils'
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
    symbol: {
      type: String
    }
  },
  components: {
    loading
  },
  data () {
    return {
      showLoading: true,
      datas: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    fromCoin () {
      return this.currentSymbol
    },
    toCoin () {
      return this.baseSymbol
    }
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    symbol () {
      this.changeLogin()
    },
    datas () {
      if (this.datas.length) {
        this.tiggerEvents({
          name: 'depthEvent',
          params: {
            type: 'direction',
            value: this.datas[0].direction
          }
        })
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'lastdealEvent',
        fun: this.lastdealEvent
      })
    })
    this.changeLogin()
  },
  beforeDestroy () {
    this.removeEvents('lastdealEvent')
  },
  methods: {
    ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
    lastdealEvent (res) {
      if (res && res.type === 'updateData') {
        this.datas = res.data && res.data.slice(0,12)
      }
    },
    clickChangeValue (item) {
      this.setEntrustNewPrice(item.price)
    },
    changeLogin () {
      this.showLoading = true
      let tempSymbol = this.symbol
      // 最近交易记录
      market.getNearestTradeRecords(this.symbol, (res) => {
        this.showLoading = false
        if (tempSymbol !== this.symbol) {
          //console.log(`lastdeal-symbol不匹配${tempSymbol}-${this.symbol}`)
          return
        }
        this.datas = res
      }, (msg) => {
        //console.log(msg)
        this.showLoading = false
      })
    },
    toFixed (price, fixed) {
      return numUtils.BN(price).toFixed(fixed || this.fixedNumber)
    },
    formatDate (date) {
      return (new Date(Number(date))).format('HH:mm:ss')
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
.lastdeal{height: 360px; box-sizing: border-box; overflow: hidden;}
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    box-sizing: border-box;
    span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border-bottom: 2px solid transparent;
        &+span {
            margin-left: 40px;
        }
    }
}
.orders-books {
  width: 100%;
  th {
      font-weight: 400;
      color: #979799;
      padding: 4px 0;
  }
  td { line-height: 24px;}
}
</style>
