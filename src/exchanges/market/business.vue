<template>
    <div class="order-container">
        <div class="title-container">
           <span class="rang-up pointer" :class="{active:tradeType==='buy'}" @click="tradeType='buy'">{{$t('exchange.exchange_buy')}}<!-- 买入 --></span>
           <span class="rang-down pointer" :class="{active:tradeType==='sell'}" @click="tradeType='sell'">{{$t('exchange.exchange_sell')}}<!-- 卖出 --></span>
        </div>
        <div class="balance ui-flex ui-flex-justify">
          <div><span>{{isBuy ? baseSymbol : currentSymbol}}</span> <span>{{$t('exchange.exchange_balance')}}<!--余额-->：</span> <span>{{toFixed(isBuy ? toBalance.availableBalance : fromBalance.availableBalance, 8) | removeEndZero | toMoney}}</span></div>
          <router-link :to="{name:'account_menu', params:{menu: 'adresscava',symbol: currentSymbol}}" class="normal pull-right" tag="button" v-if="getApiToken" :disabled="Number(fromWallet && fromWallet.rechargeFlag) !== 1">{{$t('account.estimated_value_deposit')}}<!-- 充值 --></router-link>
          <router-link :to="{name:'login'}" class="normal pull-right" tag="button" v-else>{{$t('account.estimated_value_deposit')}}<!-- 充值 --></router-link>
        </div>
        <p class="exhange-rate" v-if="false">{{$t('public.fee_rate')}}：{{rateData || 0.01}}%<!--手续费率--></p>
        <form name="orderForm" class="mt30">
          <div class="input-group no-margin">
           <label>{{$t('business.TYPE')}}<!-- 类型 --></label>
           <div class="el-select" :class="{active:showTypeSelector}" @click="toggleEntrustType">
              <input type="text" readonly="readonly" autocomplete="off" placeholder="" :value="active==='limit'?$t('exchange.exchange_limit'):$t('exchange.exchange_market')">
              <span class="input__suffix"><i class="icon-arrow-down2"></i></span>
              <ul class="el-select-item">
                <li :class="{selected:active==='limit'}" @click="switchTab('limit')">{{$t('exchange.exchange_limit')}}<!--限价委托--></li>
                <li :class="{selected:active==='market'}" @click="switchTab('market')">{{$t('exchange.exchange_market')}}<!--市价委托--></li>
              </ul>
           </div>
          </div>
          <div class="input-group">
           <label for="Price">{{$t('exchange.exchange_price')}}<!--价格--></label>
           <label for="Price" class="code">{{baseSymbol}}</label>
           <numberbox ref="price" id="Price" v-if="!isMarket && fixedPrice!==0" :accuracy="fixedNumber" type="text" v-model="fixedPrice" :readonly="true"/>
           <numberbox ref="price" id="Price" v-if="!isMarket && fixedPrice===0" :accuracy="fixedNumber" type="text" v-model="formData.price"/>
           <input v-if="isMarket" id="Price" :value="$t('exchange.exchange_market_price')" type="text" readonly="readonly"/>
          </div>
          <div class="input-group">
           <label for="Quantity">{{$t('exchange.exchange_amount')}}<!--数量--></label>
           <label for="Quantity" class="code">{{currentSymbol}}</label>
           <numberbox id="Quantity" :accuracy="Quantityaccu" type="text" v-model="formData.amount" />
          </div>
          <div class="button-group-wrapper">
           <div class="button-group ui-flex">
            <button type="button" class="ui-flex-1" :class="{active:percent===25}" @click="percent=25">25% </button>
            <button type="button" class="ui-flex-1" :class="{active:percent===50}" @click="percent=50">50% </button>
            <button type="button" class="ui-flex-1" :class="{active:percent===75}" @click="percent=75">75% </button>
            <button type="button" class="ui-flex-1" :class="{active:percent===100}" @click="percent=100">100% </button>
           </div>
          </div>
          <div class="input-group" v-show="!isMarket">
           <label>{{$t('exchange.exchange_total')}}<!--金额--></label>
           <label for="Amount" class="code">{{baseSymbol}}</label>
           <numberbox ref="total" id="Amount" :accuracy="Amountaccu" type="text" v-model="formData.total" />
          </div>
          <button type="button" class="opertaion-btn" :class="{sell:!isBuy, disabled:lockExtrust}" @click="buyOrSell" v-if="getApiToken">{{$t(isBuy?'exchange.exchange_buy':'exchange.exchange_sell')}} {{currentSymbol}}</button>
          <button type="button" class="opertaion-btn" :class="{sell:!isBuy}" @click="showQuickLogin" v-else>{{$t(isBuy?'exchange.exchange_buy':'exchange.exchange_sell')}} {{currentSymbol}}</button>
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
import quickLogin from '@/components/quickLogin'

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
    quickLogin,
  },
  data () {
    return {
      showTypeSelector:false,
      active:'limit',
      tradeType:'buy',
      lockExtrust: false,
      changeInput: '',
      errorObj: {},
      percent: 0,
      updateValue: true,
      formData: {
        price: 0,
        amount: '',
        total: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketConfig', 'getLast24h', 'getEntrustNewPrice','getSysParams','getUserInfo']),
    rateData(){
      return this.getSysParams.transactionRate && this.getSysParams.transactionRate.value * 100
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
    },
    percent (newVal) {
      this.switchPercent(newVal)
    },
    getEntrustNewPrice () {
      this.formData.price = this.toFixed(this.getEntrustNewPrice)
    },
  },
  created () {
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
    showQuickLogin(){
      utils.setDialog(quickLogin, {backClose:true})
    },
    switchTab (tab) {
      this.active = tab
    },
    toggleEntrustType(){
      this.showTypeSelector = !this.showTypeSelector
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
      if(this.getUserInfo.kycState !== 1){
        Vue.$confirmDialog({
          id: 'KYC_AUTH_FIRST',
          showCancel: true,
          content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
          okCallback: () => {
            this.$router.push({name: 'mycenter_menu', params: {menu: 'authentication'}})
          }
        })
        return
      }
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
          Vue.$koallTipBox({icon: 'notification', delay:3000, message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        } else {
          Vue.$koallTipBox({icon: 'notification', delay:3000, message: this.$t(`error_code.${msg}`)})
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
  }
}
</script>

<style lang="less" scoped>
.order-container {
    height: 450px;
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
    padding-left:15px;
    padding-right:15px;
    height: 24px;
    position: relative;
    top: 6px;
    &:hover {
      background-color: #4D4A64;
    }
    &:disabled {
      color: #999;
      cursor: not-allowed;
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
    margin-top: 28px;
    height: 30px;
    position: relative;
    display: flex;
    &.no-margin {margin-top: 0;}
    label {
        height: 30px;
        line-height: 30px;
        display: block;
        width: 66px;
        &.code {
            width: 50px;
            text-align: right;
            position: absolute;
            right: 0;
            padding-right: 10px;
        }
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
            transition: transform .3s;
            transform: rotate(180deg);
            i {
                font-size: 14px;
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
          display: none;
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
        &.active .el-select-item {display: block;}
        &.active .input__suffix {transform: rotate(0deg);}
    }
    > input {
        background: transparent;
        border: 1px solid #8a8a90;
        outline: none;
        color: #f1f1f2;
        height: 30px;
        line-height: 30px;
        float: left;
        display: block;
        -ms-flex-positive: 1;
        flex-grow: 1;
        padding-left: 10px;
        padding-right: 50px;
    }
    > input[readonly], input[disabled] {
      cursor: not-allowed;
      background-color: #212025;
      border: 1px solid #28272c;
    }
}
.button-group-wrapper {
    padding-left: 66px;
    .button-group {
        padding: 28px 0 0;
        button {
            box-sizing: border-box;
            cursor: pointer;
            width: 25%;
            height: 24px;
            line-height: 24px;
            border: 1px solid #3c3a48;
            background: transparent;
            color: #686b7b;
            &[disabled] {
                cursor: not-allowed;
            }
            &+button {
                border-left: none;
            }
            &.active {
                color: #f1f1f2;
                background: #2e2c3c;
            }
        }
    }
}
.opertaion-btn {
    margin-top: 30px;
    color: #f1f1f2;
    width: 100%;
    display: block;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    background: #1bc863;
    border: none;
    cursor: pointer;
    &.sell {
        background: #f1304a;
        color: #f1f1f2;
    }
}
</style>
