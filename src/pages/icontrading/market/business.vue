<template>
    <div class="left">
        <div class="acBtns">
            <button type="button" class="buy" :class="{active:isBuy}" @click="switchTradeType('buy')">{{$t('exchange.exchange_buy')}}<!--买入--></button>
            <button type="button" class="sell" :class="{active:!isBuy}" @click="switchTradeType('sell')">{{$t('exchange.exchange_sell')}}<!--卖出--></button>
        </div>
        <div class="trust-type-choice">
            <span @click="toggleChoice" :class="{active:!fixedPrice}">{{$t(entrustType=='market'?'exchange.exchange_market':'exchange.exchange_limit')}}</span>
                <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
                    <ul class="choices" v-show="isTrustChioce">
                        <li @click="toggleChoice('limit')">{{$t('exchange.exchange_limit')}}<!--限价委托--></li>
                        <li @click="toggleChoice('market')">{{$t('exchange.exchange_market')}}<!--市价委托--></li>
                    </ul>
                </transition>
            </div>
        <cp-adjust v-model="formData.price" v-if="!isMarket && !fixedPrice" :accuracy="accuracy.fixedNumber"></cp-adjust>
        <p class="price-placeholder" v-if="!isMarket && fixedPrice">{{fixedPrice}}</p>
        <p class="price-placeholder" v-if="isMarket">{{$t('exchange.exchange_market_price')}}</p>
        <p class="fabi">
          <valuation :lastPrice="formData.price" :baseSymbol="baseSymbol"/>
        </p>
        <cp-adjust style="margin-top: 0.6rem;" v-model="formData.amount" :accuracy="accuracy.quantityAccu"></cp-adjust>
        <p class="btc-tip">{{isBuy ? baseSymbol : currentSymbol}} {{$t('exchange.exchange_balance')}}：<!--{symbol}余额-->{{toFixed(isBuy ? toBalance.availableBalance : fromBalance.availableBalance).toMoney()}}</p>
        <div class="range-percent">
            <p>{{percent}}%</p>
            <mt-range v-model="percent" :bar-height="2">
                <div slot="start" class="dots d1" :class="{d2:percent>=25,d3:percent>=50,d4:percent>=75,d5:percent>=100}">
                    <span @click="percent=0"></span>
                    <span @click="percent=25"></span>
                    <span @click="percent=50"></span>
                    <span @click="percent=75"></span>
                    <span @click="percent=100"></span>
                </div>
            </mt-range>
        </div>
        <div class="space-area"></div>
        <div class="ac-area">
            <div class="total-input" v-if="!isMarket">
                <span>{{$t('exchange.exchange_total')}}<!--金额--></span>
                <div>
                    <span>{{toFixed(formData.total, accuracy.amountAccu) || 0}} {{baseSymbol}}</span>
                </div>
            </div>
            <p class="fabi" style="margin-top: 0.3rem;" v-if="!isMarket">
              <valuation :lastPrice="formData.total" :baseSymbol="baseSymbol"/>
            </p>
            <button type="button" :class="[isBuy ? 'buyBtn' : 'sellBtn', lockExtrust ? 'disabled' : '']" @click="buyOrSell">
                {{$t(isBuy?'exchange.exchange_buy':'exchange.exchange_sell')}} {{currentSymbol}}
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import Tip from '@/assets/js/tip'
import regUtils from '@/assets/js/regex'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import cpAdjust from '@/components/adjust'
import valuation from '@/components/valuation'
export default {
  props: {
    accuracy: {
      type:Object
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    pTradeType: null
  },
  components: {
    cpAdjust,
    valuation
  },
  data () {
    return {
      tradeType: 'buy',
      entrustType: 'limit',
      lockExtrust: false,
      changeInput: '',
      errorObj: {},
      percent: 0,
      updateValue: true,
      isTrustChioce: false,
      formData: {
        price: 0,
        amount: '',
        total: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketConfig', 'getLast24h', 'getEntrustNewPrice', 'getUserWallets','getMarketList']),
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    isBuy () {
      return this.tradeType === 'buy'
    },
    isMarket () {
      return this.entrustType === 'market'
    },
    fromBalance () {
      for (let i = 0; i < this.getUserWallets.length; i++) {
        let item = this.getUserWallets[i]
        if (item.symbol === this.currentSymbol) {
          return item
        }
      }
      return {}
    },
    toBalance () {
      for (let i = 0; i < this.getUserWallets.length; i++) {
        let item = this.getUserWallets[i]
        if (item.symbol === this.baseSymbol) {
          return item
        }
      }
      return {}
    },
    marketPrice () {
      return this.$t('exchange.exchange_market_price') // 市价
    },
    fixedPrice(){
      let fixedPrice = 0, fixedBuyOrSellPrice = 0
      for(let item of this.getMarketList||[]){
        if(item.market===this.symbol){
          fixedPrice = Number(item.fixedPrice)
          fixedBuyOrSellPrice = Number(this.isBuy?item.fixedBuyPrice:item.fixedSellPrice)
          break
        }
      }
      return fixedBuyOrSellPrice?fixedBuyOrSellPrice:fixedPrice
    }
  },
  watch: {
    fixedPrice(_n){
      if(_n){
        this.entrustType = 'limit'
      }
    },
    entrustType () {
      this.percent = 0
      this.formData.amount = ''
    },
    tradeType () {
      this.formData.amount = ''
    },
    'formData.price' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'price')
    },
    'formData.amount' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'amount')
    },
    'formData.total' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'total')
    },
    getLast24h (newVal) {
      if (this.updateValue) {
        this.updateValue = false
        setTimeout(()=>{
          this.formData.price = this.toFixed(utils.removeEndZero(this.getLast24h.close))
        },200)
      }
    },
    symbol () {
      this.updateValue = true
    },
    percent (newVal) {
      this.switchPercent(newVal)
    },
    getEntrustNewPrice () {
      this.formData.price = this.toFixed(this.getEntrustNewPrice)
    }
  },
  created () {
    this.tradeType = this.pTradeType ? this.pTradeType : 'buy'
    this.$nextTick(() => {
      this.addEvents({
        name: 'businessEvent',
        fun: this.businessEvent
      })
    })
  },
  beforeDestroy () {
    this.removeEvents('businessEvent')
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    switchTradeType (type) {
        this.tradeType = type
    },
    toggleChoice (e) {
        if(this.fixedPrice){
          return
        }
        if (typeof e === 'string') {
            this.entrustType = e
        }
        this.isTrustChioce = !this.isTrustChioce
    },
    businessEvent (res) {
      if (res && res.type === 'price') {
        this.formData.price = res.value
      } else if (res && res.type === 'amount') {
        this.formData.amount = res.value
      } else if (res && res.type === 'total') {
        this.formData.total = res.value
      }
    },
    changeValue (newVal, oldVal, type) {
      if (numUtils.BN(newVal).equals(numUtils.BN(oldVal))) {
        this.changeInput = ''
        return
      }
      if (numUtils.BN(newVal).equals(numUtils.BN(0))) {
        if (this.changeInput) {
          return
        }
        this.changeInput = type
        if (type === 'amount' || type === 'price') {
          this.formData.total = ''
        }
        if (type === 'total' || type === 'price') {
          this.formData.amount = ''
        }
        this.$nextTick(() => {
          this.changeInput = ''
        })
        return
      }
      if (this.changeInput && this.changeInput !== type) {
        this.changeInput = ''
        return
      }
      this.changeInput = type
      let Price = this.fixedPrice===0?this.formData.price:this.fixedPrice
      if (type === 'total' && numUtils.BN(Price).gt(0)) {
        this.formData.amount = this.toFixed(numUtils.div(this.formData.total, Price), this.Quantityaccu)
      } else if (type === 'total' && numUtils.BN(this.formData.amount).gt(0)) {
        this.formData.price = this.toFixed(numUtils.div(this.formData.total, this.formData.amount))
      } else if (numUtils.BN(Price).gt(0) && numUtils.BN(this.formData.amount).gt(0)) {
        this.formData.total = this.toFixed(numUtils.mul(Price, this.formData.amount), this.Amountaccu)
      } else if (numUtils.BN(Price).gt(0) && numUtils.BN(this.formData.total).gt(0)) {
        this.formData.amount = this.toFixed(numUtils.div(this.formData.total, Price), this.Quantityaccu)
      } else {
        this.changeInput = ''
      }
    },
    switchPercent (p) {
      p = p / 100
      let amount = numUtils.mul(this.tradeType === 'buy' ? this.toBalance.availableBalance : this.fromBalance.availableBalance, p).toFixed(this.fixedNumber)
      if (this.entrustType === 'market' && this.tradeType === 'buy') {
        this.formData.amount = Number(amount)?numUtils.div(amount, this.getLast24h.close).toFixed(this.fixedNumber, 1):''
        return
      }
      if (this.tradeType === 'buy') {
        this.formData.total = Number(amount)?amount:''
      } else {
        this.formData.amount = Number(amount)?amount:''
      }
    },
    buyOrSell () {
      this.errorObj = {}
      if (!this.getApiToken) {
        Tip({type: 'danger', message: this.$t(`exchange.exchange_Not_logged`)}) // 未登录
        return
      }
      let price = 0
      let msg = null
      let amount = this.formData.amount
      let balance = null
      let fromAccountId = null
      let toAccountId = null
      let direction = null// 1买 2卖
      if (this.entrustType === 'limit') { // 限价
        price = this.fixedPrice===0?this.formData.price:this.fixedPrice
        if (!price) {
          msg = this.$t('exchange.exchange_price_empty') // 价格不能为空
        } else if (numUtils.BN(price).equals(numUtils.BN(0))) {
          msg = this.$t('exchange.exchange_price_ont') // 价格不能为0
        } else if (!regUtils.intOrDecimal.test(price)) {
          msg = this.$t('exchange.exchange_price_decimal_int') // 价格只能为整数或小数
        }
        if (msg) {
          this.errorObj = {
            type: 'price',
            msg: msg
          }
          Tip({type: 'danger', message: msg})
          return
        }
      } else { // 市价
        price = -1
      }
      if (!amount) {
        msg = this.$t('exchange.exchange_number_empty') // 数量不能为空
      } else if (numUtils.BN(amount).equals(numUtils.BN(0))) {
        msg = this.$t('exchange.exchange_number_ont') // 数量不能为0
      } else if (!regUtils.intOrDecimal.test(amount)) {
        msg = this.$t('exchange.exchange_number_decimal_int') // 数量只能为整数或小数
      }
      if (msg) {
        this.errorObj = {
          type: 'amount',
          msg: msg
        }
        Tip({type: 'danger', message: msg})
        return
      }
      if (!this.getMarketConfig) {
        Tip({type: 'danger', message: `error_code.SYMBOL_INEXIST`})
        return
      }
      let minQuantity = numUtils.BN(this.getMarketConfig[this.symbol].minQuantity).toString()
      let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()

      // 限价 最小金额控制
      if (this.entrustType === 'limit' && numUtils.BN(this.formData.total).lt(minAmount)) {
        // 最小金额必须大于等于{0}{1}
        Tip({type: 'danger', message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        return
      }

      // 限价\市价 最小数量控制
      // this.entrustType === 'market' &&
      if (numUtils.BN(this.formData.amount).lt(minQuantity)) {
        // 最小数量必须大于等于{0}{1}
        Tip({type: 'danger', message: this.$t('public.min_amount_greater_than').format(minQuantity, this.currentSymbol)})
        return
      }
      if (this.tradeType === 'buy') { // 买
        direction = 1 // 买
        balance = this.toBalance.availableBalance // 金额
        fromAccountId = this.toBalance.accountId // baseSymbol帐号id
        toAccountId = this.fromBalance.accountId // currentSymbol帐号id
        if (numUtils.BN(amount).mul(numUtils.BN((price === -1 ? this.getLast24h.close : price))).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      } else if (this.tradeType === 'sell') {
        direction = 2 // 卖
        balance = this.fromBalance.availableBalance // 金额
        fromAccountId = this.fromBalance.accountId // 帐号id
        toAccountId = this.toBalance.accountId // 帐号id
        if (numUtils.BN(amount).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      }
      let data = {
        price: price, // 表示价格‘-1’表示市价
        amount: amount, //
        fromAccountId: fromAccountId,
        toAccountId: toAccountId,
        market: this.symbol,
        // marketId: 2, // 市场id
        direction: direction // 1买 2卖
      }

      if (this.entrustType === 'limit' && this.tradeType === 'sell' && numUtils.BN(this.formData.price).lt(numUtils.mul(this.getLast24h.close, 0.95))) {
        // 您委托价格低于最新成交价5%，是否确认下单？
        MessageBox.confirm(this.$t('public.entrustment_price_lower_5')).then(() => {
          this.okCallback(data)
        }, () => {})
        return
      } else if (this.entrustType === 'limit' && this.tradeType === 'buy' && numUtils.BN(this.formData.price).gt(numUtils.mul(this.getLast24h.close, 1.05))) {
        // 您委托价格高于最新成交价5%，是否确认下单？
        MessageBox.confirm(this.$t('public.entrustment_price_higher_5')).then(() => {
          this.okCallback(data)
        }, () => {})
        return
      }
      this.okCallback(data)
    },
    okCallback (data) {
      if (this.lockExtrust) {
        return
      }
      this.lockExtrust = true
      marketApi.marketBuyorSell(data, (res) => {
        this.formData.amount = ''
        this.formData.total = ''
        this.lockExtrust = false
        Tip({type: 'success', message: this.$t('exchange.exchange_Commissioned_success')}) // 委托成功
      }, (msg) => {
        this.lockExtrust = false
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    changePriceValue (price) {
      if (this.entrustType === 'limit') {
        this.formData.price = this.toFixed(price)
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
    }
  }
}
</script>

<style lang="less" scoped>
@write-e76:#e76d42;
@write-556:#55637c;
@write-007:#0072fd;
@write-0c9:#0c9;
.left{float: left;width: 48%;height:100%;min-height:fit-content;position: relative;display:flex;flex-direction:column;}
.left .acBtns{height: 0.75rem;}
.left .acBtns button{
  width: 50%;height: 0.75rem;font-size: 0.3rem;border: none;color: #fff;background-color: @write-556;float:left;
}
.left .acBtns button.buy.active{color:#fff;background:@write-0c9;}
.left .acBtns button.sell.active{color:#fff;background:@write-e76;}
.left .trust-type-choice{margin-top:0.45rem;font-size: 0.3rem;position: relative;height: 0.5rem;}
.left .trust-type-choice > span.active:after{
  display: inline-block;content: '';margin-left: 0.2rem;border-top: 0.15rem  solid #fff;
  border-left: 0.13rem solid transparent;border-right: 0.13rem solid transparent;
}
.left .trust-type-choice .choices{
  position: absolute;top: 0.5rem;left: -0.3rem;width: 2.2rem;box-shadow: 0 3px 6px #11131d;
}
.left .trust-type-choice .choices li{
  line-height: 0.8rem;padding-left: 0.3rem;background-color: #1b1e2e;
}
.left .trust-type-choice .choices li:first-of-type{border-bottom: 1px solid #262a42;}
.left .trust-type-choice .choices li.active{background-color: #262a42;}
.left .price-placeholder {
  margin-top: 0.4rem;height: 0.88rem;background-color: #292929;
  line-height: 0.88rem;text-align: center;color: #fff;font-size: 0.3rem;
}
.left .fabi{color: #8089a3;font-size: 0.26rem;margin-top: 0.25rem;}
.left .btc-tip{color: #8089a3;font-size: 0.26rem;margin-top: 0.25rem;}
.left .range-percent{margin-top: 0.6rem;}
.left .range-percent p{
  text-align: center;color: #8089A3;font-size: 0.24rem;margin-bottom: 0.25rem;
}
.left .range-percent .dots{
  position: absolute;left: 0;right: 0;top: 8px;display: flex;justify-content:space-between;
}
.left .range-percent .dots span{
  z-index: 1;width: 15px;height: 15px;background-color: #46566f;border-radius: 100%;
}
.left .range-percent .dots.d1 span:nth-of-type(1),
.left .range-percent .dots.d2 span:nth-of-type(2),
.left .range-percent .dots.d3 span:nth-of-type(3),
.left .range-percent .dots.d4 span:nth-of-type(4),
.left .range-percent .dots.d5 span:nth-of-type(5){background-color: @write-007;}
.left .space-area{display:flex;flex:1;}
.left .ac-area{width:100%;margin-bottom:0.36rem;margin-top:0.2rem;}
.left .actBtn,.left .buyBtn,.left .sellBtn{
  margin-top: 0.5rem;width: 100%;height: 0.95rem;color: #fff;border: none;font-size: 0.34rem;
  
}
.left .buyBtn{background:@write-0c9;}
.left .sellBtn{background:@write-e76;}
.left .ac-area button.disabled{background-color: #999 !important;}
.left .total-input{color: #8089A3;font-size: 0.24rem;display: flex;}
.left .total-input > span{flex:3;min-width: 0;}
.left .total-input > div{flex: 9;min-width: 0;}
.left .total-input > div input,
.left .total-input > div span{
  font-size: 0.3rem;color: #fff;width: 100%;background-color: transparent;border: none;
}
</style>
