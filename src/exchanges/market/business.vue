<template>
    <div class="order-container">
        <div class="title-container">
           <span class="rang-up pointer" :class="{active:tradeType==='buy'}" @click="tradeType='buy'">{{$t('exchange.exchange_buy')}}<!-- 买入 --></span> 
           <span class="rang-down pointer" :class="{active:tradeType==='sell'}" @click="tradeType='sell'">{{$t('exchange.exchange_sell')}}<!-- 卖出 --></span>
        </div>
        <div class="balance ui-flex ui-flex-justify">
          <div><span>{{isBuy ? baseSymbol : currentSymbol}}</span> <span>{{$t('exchange.exchange_balance')}}<!--余额-->：</span> <span>{{toFixed(isBuy ? toBalance.availableBalance : fromBalance.availableBalance).toMoney()}}</span></div>
          <button type="button" class="normal pull-right">充值</button>
        </div>
        <p class="exhange-rate">{{$t('public.fee_rate')}}：{{rateData || 0.01}}%<!--手续费率--></p>
        <form name="orderForm">
          <div class="input-group">
           <label>类型</label> 
           <div class="el-select">
              <input type="text" readonly="readonly" autocomplete="off" placeholder="">
              <span class="input__suffix"><i class="icon-arrow-down2"></i></span>
              <ul class="el-select-item">
                <li :class="{selected:active==='limit'}" @click="switchTab('limit')">{{$t('exchange.exchange_limit')}}<!--限价委托--></li>
                <li :class="{selected:active==='market'}" @click="switchTab('market')">{{$t('exchange.exchange_market')}}<!--市价委托--></li>
              </ul>
           </div>
          </div> 
          <div class="input-group ui-clear">
           <label for="buyLimitPrice">价格</label> 
           <label for="buyLimitPrice" class="code">BTC</label> 
           <input id="buyLimitPrice" name="buyLimitPrice" maxlength="25" disabled="disabled" /> 
           <p class="error-box gray-f"></p> 
           <p class="error-box" style="display: none;"></p>
          </div> 
          <div class="input-group ui-clear">
           <label for="buyQuantity">数量</label> 
           <label for="buyQuantity" class="code">ETH</label> 
           <input id="buyQuantity" name="buyQuantity" maxlength="25" disabled="disabled" /> 
           <p class="error-box" style="display: none;"></p>
          </div> 
          <div class="button-group-wrapper">
           <div class="button-group ui-clear">
            <button type="button" disabled="disabled" class="pull-right">100% </button>
            <button type="button" disabled="disabled" class="pull-right">75% </button>
            <button type="button" disabled="disabled" class="pull-right">50% </button>
            <button type="button" disabled="disabled" class="pull-right">25% </button>
           </div>
          </div> 
          <!----> 
          <!----> 
          <div class="input-group ui-clear">
           <label data-v-ab434934="">总计</label> 
           <label for="buyAmount" class="code">BTC</label> 
           <input disabled="disabled" name="buyAmount" maxlength="25" /> 
           <p class="error-box" style="display: none;"></p>
          </div> 
          <button type="button" class="opertaion-btn">买入 ETH</button>
         </form>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import marketApi from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import regUtils from '@/assets/js/regex'
import utils from '@/assets/js/utils'
import numberbox from '@/components/formel/numberbox'
import arrows from './arrows'
import valuation from '@/components/valuation'
export default {
  props: {
    fixedNumber: {
      type: Number
    },
    Quantityaccu: {
      type: Number
    },
    Amountaccu: {
      type: Number
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    fromWallet: {
      type: Object
    },
    toWallet: {
      type: Object
    },
    marketList: {
      type: Array,
      default: []
    }
  },
  components: {
    numberbox,
    valuation,
    arrows
  },
  data () {
    return {
      active:'limit',
      tradeType:'buy',
      isShowPrice: false,
      isShowTotal: false,
      lockExtrust: false,
      changeInput: '',
      errorObj: {},
      percent: 0,
      showPercentTip: false,
      hoverPercent: 0,
      moveCursor: false,
      updateValue: true,
      formData: {
        price: 0,
        amount: '',
        total: ''
      },
      tipBaseSymbolWidth: 34,
      tipCurrentSymbolWidth: 34
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketConfig', 'getLast24h', 'getEntrustNewPrice','getSysParams']),
    rateData(){
      return this.getSysParams.transactionRate.value * 100
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    isBuy () {
      return this.tradeType === 'buy'
    },
    isMarket () {
      return this.active === 'market'
    },
    toBalance () {
      if (this.toWallet) {
        return this.toWallet
      } else {
        return {}
      }
    },
    fromBalance () {
      if (this.fromWallet) {
        return this.fromWallet
      } else {
        return {}
      }
    },
    marketPrice () {
      return this.$t('exchange.exchange_market_price') // 市价
    },
    baseStyle () {
      return {
        'padding-right': `${this.tipBaseSymbolWidth + 35}px`,
        width: `calc(100% - ${this.tipBaseSymbolWidth + 45}px)`
      }
    },
    currentStyle () {
      return {
        'padding-right': `${this.tipCurrentSymbolWidth + 35}px`,
        width: `calc(100% - ${this.tipCurrentSymbolWidth + 45}px)`
      }
    },
    curPercent () {
      return Math.max(this.hoverPercent, this.percent)
    },
    fixedPrice(){
      let fixedPrice = 0, fixedBuyOrSellPrice = 0
      for(let item of this.marketList){
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
    active () {
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
      this.$nextTick(() => {
        this.tipBaseSymbolWidth = this.$refs.tipBaseSymbol.clientWidth + parseInt(this.$refs.tipBaseSymbol.style.right.replace('px', ''))
        this.tipCurrentSymbolWidth = this.$refs.tipCurrentSymbol.clientWidth + parseInt(this.$refs.tipCurrentSymbol.style.right.replace('px', ''))
      })
    },
    percent (newVal) {
      this.switchPercent(newVal)
      this.$nextTick(() => {
        this.$refs.dragCircle.style.left = `calc(${newVal}% - 7px)`
      })
    },
    getEntrustNewPrice () {
      this.formData.price = this.toFixed(this.getEntrustNewPrice)
    },
    isMarket (newVal) {
      if (!newVal) {
        this.bindEvent()
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'businessEvent',
        fun: this.businessEvent
      })
    })
    this.bindEvent()
    this.$nextTick(() => {
      this.tipBaseSymbolWidth = this.$refs.tipBaseSymbol.clientWidth
      this.tipCurrentSymbolWidth = this.$refs.tipCurrentSymbol.clientWidth
    })
  },
  beforeDestroy () {
    this.removeEvents('businessEvent')
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    switchTab (tab) {
      this.active = tab
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
    bindEvent () {
      this.$nextTick(() => {
        let price = this.$refs.price.$el
        price.addEventListener('focus', () => {
          this.isShowPrice = true
        }, false)
        price.addEventListener('blur', () => {
          this.isShowPrice = false
        }, false)
        let total = this.$refs.total.$el
        total.addEventListener('focus', () => {
          this.isShowTotal = true
        }, false)
        total.addEventListener('blur', () => {
          this.isShowTotal = false
        }, false)
      })
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
      if (this.active === 'market' && this.tradeType === 'buy') {
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
        Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Not_logged')}) // 未登录
        return
      }
      let price = 0
      let msg = null
      let amount = this.formData.amount
      let balance = null
      let fromAccountId = null
      let toAccountId = null
      let direction = null// 1买 2卖
      if (this.active === 'limit') { // 限价
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
          Vue.$koallTipBox({icon: 'notification', message: `${msg}`})
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
        Vue.$koallTipBox({icon: 'notification', message: `${msg}`})
        return
      }
      if (!this.getMarketConfig) {
        Vue.$koallTipBox({icon: 'notification', message: `${msg}`})
        return
      }
      let minQuantity = numUtils.BN(this.getMarketConfig[this.symbol].minQuantity).toString()
      let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()
      // 限价 最小金额控制
      if (this.active === 'limit' && numUtils.BN(this.formData.total).lt(minAmount)) {
        // 最小金额必须大于等于{0}{1}
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        return
      }

      // 限价\市价 最小数量控制
      // this.active === 'market' &&
      if (numUtils.BN(this.formData.amount).lt(minQuantity)) {
        // 最小数量必须大于等于{0}{1}
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public.min_amount_greater_than').format(minQuantity, this.currentSymbol)})
        return
      }

      if (this.tradeType === 'buy') { // 买
        direction = 1 // 买
        balance = this.toBalance.availableBalance // 金额
        fromAccountId = this.toBalance.accountId // baseSymbol帐号id
        toAccountId = this.fromBalance.accountId // currentSymbol帐号id
        if (numUtils.BN(amount).mul(numUtils.BN((price === -1 ? this.getLast24h.close : price))).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      } else if (this.tradeType === 'sell') {
        direction = 2 // 卖
        balance = this.fromBalance.availableBalance // 金额
        fromAccountId = this.fromBalance.accountId // 帐号id
        toAccountId = this.toBalance.accountId // 帐号id
        if (numUtils.BN(amount).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
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

      if (this.active === 'limit' && this.tradeType === 'sell' && numUtils.BN(this.formData.price).lt(numUtils.mul(this.getLast24h.close, 0.95))) {
        // 您委托价格低于最新成交价5%，是否确认下单？
        Vue.$confirmDialog({
          content: this.$t('public.entrustment_price_lower_5'),
          okCallback: () => {
            this.okCallback(data)
          }
        })
        return
      } else if (this.active === 'limit' && this.tradeType === 'buy' && numUtils.BN(this.formData.price).gt(numUtils.mul(this.getLast24h.close, 1.05))) {
        // 您委托价格高于最新成交价5%，是否确认下单？
        Vue.$confirmDialog({
          content: this.$t('public.entrustment_price_higher_5'),
          okCallback: () => {
            this.okCallback(data)
          }
        })
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

        Vue.$koallTipBox({icon: 'success', message: this.$t('exchange.exchange_Commissioned_success')}) // 委托成功
      }, (msg) => {
        this.lockExtrust = false
        if (msg === 'AMOUNT_ERROR') {
          // 最小金额必须大于等于{0}{1}
          let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()
          Vue.$koallTipBox({icon: 'notification', message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    changePriceValue (price) {
      if (this.active === 'limit') {
        this.formData.price = this.toFixed(price)
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    },
    loginDialog () {
      this.$router.push({name: 'login'})
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    },
    percentOver (p) {
      this.hoverPercent = p
    },
    percentOut () {
      this.hoverPercent = 0
    },
    mouseDown (e) { // 拖动
      let left = this.$refs.dragCircle.offsetLeft
      let startX = e.pageX
      let self = this
      let width = this.$refs.percent.clientWidth
      this.moveCursor = true
      function mm (ev) {
        ev.preventDefault()
        let cw = Math.min(Math.max(0, left + ev.pageX - startX), width)
        self.percent = Math.floor(cw / width * 100)
        self.$refs.dragCircle.style.left = `calc(${self.percent}% - 7px)`
        self.showPercentTip = true
        document.body.style.cursor = 'pointer'
      }
      function mp (ev) {
        ev.preventDefault()
        self.moveCursor = false
        self.showPercentTip = false
        document.body.style.cursor = null
        document.removeEventListener('mousemove', mm, false)
        document.removeEventListener('mouseup', mp, false)
      }
      document.addEventListener('mousemove', mm, false)
      document.addEventListener('mouseup', mp, false)
    }
  }
}
</script>

<style lang="less" scoped>
.order-container {
    height: 440px;
    overflow: hidden;
    position: relative;
}
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    box-sizing:border-box;
    span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border-bottom: 2px solid transparent;
        &+span {
            margin-left: 40px;
        }
        &.active.rang-down {
            border-bottom: 2px solid #f1304a;
        }
        &.active.rang-up {
            border-bottom: 2px solid #1bc863;
        }
    }
}
.balance {
  height: 36px;
  color: #f1f1f2;
  position: relative;
  span {
      display: inline-block;
      height: 36px;
      line-height: 36px;
  }
  button {
    cursor: pointer;
    font-size: 12px;
    color: #f1f1f2;
    background-color: #2e2c3c;
    border: none;
    width: 46px;
    height: 24px;
    position: relative;
    top: 6px;
    &:hover {
      background-color: #4D4A64;
    }
  }
}
.exhange-rate {
    line-height: 28px;
    height: 28px;
    color: #62677b;
}
.input-group {
    color: #979799;
    font-size: 14px;
    height: 30px;
    position: relative;
    display: flex;
    label {
        height: 30px;
        line-height: 30px;
        display: block;
        width: 66px;
    }
    .el-select {
        position: relative;
        flex: 1;
        background: #2e2c3c;
        input {
          color: #d8d8da;
          width: 100%;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          padding-right: 30px;
          text-align: center;
          background-color: transparent;
          cursor: pointer;
        }
        .input__suffix {
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            transition: all .3s;
            height: 100%;
            color: #c0c4cc;
            text-align: center;
            i {
                font-size: 14px;
                transition: transform .3s;
                -ms-transform: rotate(180deg);
                transform: rotate(180deg);
                cursor: pointer;
                line-height: 30px;
            }
        }
        .el-select-item {
          position: absolute;
          left: 0;
          top: 40px;
          right: 0;
          padding:4px 0;
          background-color: #212028;
          border-radius: 4px;
          z-index: 1;
          li {
            line-height: 34px;
            padding:0 20px;
            cursor: pointer;
            &.selected {
              color: #00a0e9;
            }
            &:hover {
              background-color: #292831;
            }
          }
        }
    }
}
</style>
