<template>
    <section class="entrust-container">
        <mt-navbar v-model="active">
          <mt-tab-item id="current">{{$t('trade_record.current_entrust')}}<!--当前委托--></mt-tab-item>
          <mt-tab-item id="history">{{$t('trade_record.history_entrust')}}<!--历史委托--></mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="active" :swipeable="true">
          <mt-tab-container-item id="current">
            <div class="setting">
              <div>
                <div>
                  <mt-switch v-model="hideOtherTrust">{{$t('exchange.exchange_hide_trade_pair')}}<!--隐藏其他交易对--></mt-switch>
                </div>
              </div>
              <div class="f24 disabled" v-if="!ncdatas.length">{{$t('trade_record.trade_record_repeal')}}<!--全部撤销--></div>
              <div class="f24" v-if="ncdatas.length" @click="cancelOrder('all')">{{$t('trade_record.trade_record_repeal')}}<!--全部撤销--></div>
            </div>
            <ul class="trust-list">
              <li v-for="(item, index) in ncdatas" :key="index">
                <div class="title">
                  <span :class="[item.direction==1?'buy':'sell']">{{item.direction==1 ? $t('exchange.exchange_buy') : $t('exchange.exchange_sell')}}</span>
                  <span class="market">
                      {{formatMarket(item.market)}}
                  </span>
                  <span class="time">{{new Date(Number(item.createdAt)).format()}}</span>
                  <span class="cancel" @click="cancelOrder(item.orderBookId, index)">{{$t('exchange.exchange_revoked')}}<!--撤销--></span>
                </div>
                <div class="data">
                  <div class="data-title">
                    <span>{{$t('exchange.exchange_price')}}<!--价格-->({{item.baseSymbol}})</span>
                    <span>{{$t('exchange.exchange_problem')}}<!--总量-->({{item.currencySymbol}})</span>
                    <span>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->({{item.currencySymbol}})</span>
                  </div>
                  <div class="data-info">
                    <span>{{getPrice(item.price)}}</span>
                    <span>{{toFixed(item.totalAmount)}}</span>
                    <span>{{toFixed(item.finishedAmount)}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="history">
            <div class="setting">
              <div><mt-switch v-model="hideOtherHistoryTrust">{{$t('exchange.exchange_hide_trade_pair')}}<!--隐藏其他交易对--></mt-switch></div>
              <div><label class="hide-canceled"><input type="checkbox" v-model="hideHistoryTrustCanceled"/><i type="checkbox"></i>{{$t('account.userConcealmentHasBeenRevoked')}}<!--隐藏已撤销--></label></div>
            </div>
            <ul class="trust-list">
              <li v-for="(item, index) in nhdatas" :key="index">
                <div class="title">
                  <span :class="[item.direction==1?'buy':'sell']">{{getType(item.direction)}}</span>
                  <span class="market">
                      {{formatMarket(item.market)}}
                  </span>
                  <span class="time">{{new Date(Number(item.createdAt)).format()}}</span>
                  <span class="cancel">{{getStatue(item)}}</span>
                </div>
                <div class="data">
                  <div class="data-title">
                    <span>{{$t('exchange.exchange_Transaction_price')}}<!--成交均价-->({{item.baseSymbol}}) </span>
                    <span>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->({{item.currencySymbol}})</span>
                    <span>{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额-->({{item.currencySymbol}})</span>
                  </div>
                  <div class="data-info">
                    <span>{{getPrice(item.price)}}</span>
                    <span>{{toFixed(item.finishedAmount)}}<em>({{getFinishedPercent(item)}}%)</em></span>
                    <span>{{toFixed(item.dealCurrency)}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>

      </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import Tip from '@/assets/js/tip'
import numUtils from '@/assets/js/numberUtils'
import market from '@/api/market'
import cpSwitch from '@/components/switch'
export default {
  props: {
    fixedNumber: {
      type: Number,
      default: 8
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    symbol: {
      type: String,
      default: ''
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
      cpSwitch
  },
  data () {
    return {
      isShow: false,
      active: 'current',
      cdatas: [],
      hdatas: [],
      hideOtherTrust: false,
      hideOtherHistoryTrust: false,
      hideHistoryTrustCanceled: false
    }
  },
  computed: {
    ...mapGetters(['getApiToken','getMarketList']),
    symbolList(){
      return this.getMarketList?this.getMarketList.map(item=>{return item.baseSymbol}).join('|'):''
    },
    ncdatas () {
      let newDatas = [], patt = new RegExp(`(.*)(${this.symbolList})$`)
      this.cdatas.forEach((item) => {
        let ms = item.market.match(patt)
        item.currencySymbol = ms && ms[1]
        item.baseSymbol = ms && ms[2]
        newDatas.push(item)
      })
      return newDatas.filter((item) => {
        if (this.hideOtherTrust && this.symbol !== item.market) {
          return false
        } else {
          return true
        }
      })
    },
    nhdatas () {
      let newDatas = [], patt = new RegExp(`(.*)(${this.symbolList})$`)
      this.hdatas.forEach((item) => {
        let ms = item.market.match(patt)
        item.currencySymbol = ms&&ms[1]
        item.baseSymbol = ms&&ms[2]
        newDatas.push(item)
      })
      return newDatas.filter((item) => {
        if (this.hideOtherHistoryTrust && this.symbol !== item.market) {
          return false
        } else {
          let state = Number(item.state)
          if (this.hideHistoryTrustCanceled) {
            return state !== 0 || numUtils.BN(item.finishedAmount).gt(0)
          } else {
            return true
          }
        }
      })
    }
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    symbol () {
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
  beforeDestroy () {
    this.removeEvents('extrustEvent')
  },
  methods: {
    ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents', 'tiggerEvents']),
    formatMarket (market) {
      let m = market.match(/(.*)(BTC|ETH|ATN|USDT)$/)
      if (m) {
        return m[1] + '/' + m[2]
      } else {
        return market
      }
    },
    extrustEvent (res) {
      if (res && res.type === 'current') {
        // 当前委托
        this.cdatas = res.data
      } else if (res && res.type === 'history') {
        // 历史委托
        this.hdatas = res.data
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
        market.getCurrentEntrustBySymbol(0, this.symbol, (res) => {
          this.cdatas = res
        })
        // 历史成交
        market.getHistoryDeal(1, this.symbol, (res) => {
          this.hdatas = res
        })
      } else {
        this.cdatas = []
        this.hdatas = []
      }
    },
    getType (type) {
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return this.$t('exchange.exchange_buys') // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return this.$t('exchange.exchange_sells') // 卖
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
        return this.$t('exchange.exchange_cancelled') // 已撤销
      } else if (state === 2) {
        return this.$t('exchange.exchange_partial_transaction') // 部分成交
      } else if (state === 3 || state === 4) {
        return this.$t('exchange.exchange_complete_transaction') // 完全成交
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
        MessageBox.confirm(this.$t('trade_record.trade_record_repeal')+'?').then(action => {
          market.cancelAll(() => {
            this.cdatas = []
            Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        }, (cacel) =>{})
      } else {
        market.cancelOrder(orderBookId, () => {
          this.cdatas.splice(index, 1)
          Tip({type: 'success', message: this.$t('account.user_center_Successful')})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.mint-switch /deep/ .mint-switch-core{
  width:0.86rem;height:0.45rem;border:none;border-radius:0.3rem;background:#fff;
  top: 0.03rem;
  border: 1px solid #fff;
}
.mint-switch /deep/ .mint-switch-core::before,
.mint-switch /deep/ .mint-switch-core::after{
  width:0.36rem;height:0.36rem;background:#fff;
  border-radius:0.3rem;
  box-shadow:0 0 10px rgba(0, 0, 0, 0.3);
  top: 0.03rem;
  left: 0.02rem;
}
.mint-switch /deep/ .mint-switch-input:checked + .mint-switch-core::after{
  transform:translateX(0.42rem);
}
.mint-switch /deep/ .mint-switch-input:checked + .mint-switch-core{
  background:#0072fd;
  border: 1px solid #0072fd;
}
.entrust-container {
  font-size: 0.24rem;
    /deep/ .mint-navbar {
      background-color: #0c151d;
      width:calc(~"100% + 0.6rem");
      margin-left:-0.3rem;
      .mint-tab-item {
        color: #8089a3;
        border-bottom: 2px solid #0c151d;
        padding: 0.26rem 0.4rem;
        flex:inherit;
        margin-left:0.2rem;
        .mint-tab-item-label{
          font-size: 0.32rem;
        }
      }
      .mint-tab-item.is-selected {
        color: #0072fd;
        border-bottom-color: #0072fd;
        margin-bottom:0;
      }
    }
    .mint-tab-container-item {
      overflow: hidden;
      .setting {
        height: 1.1rem;
        padding-top: 0.4rem;
        display: flex;
        > div:first-of-type {
          flex: 1;
        }
        > div:last-of-type {
          flex: 1;
          text-align: right;
        }
        > div:last-of-type.f24 {
          color:#FFDE00;
        }
        > div:last-of-type.f24.disabled {
          color:#999;
        }
        .hide-canceled {
          font-size: 0.26rem;
          input {
            display: none;
          }
          i{
            display: inline-block;
            width: 0.32rem;
            height: 0.32rem;
            background: url('../../../assets/img/checkbox_icon.png') no-repeat center;
            background-size: contain;
            margin-right: 0.15rem;
            vertical-align: bottom;
          }
          input:checked + i {
            background-image: url('../../../assets/img/checkbox_icon_checked.png')
          }
        }
      }
    }
  }
  .trust-list {
    height:-webkit-calc(~"100vh - 3.05rem");
    height: calc(~"100vh - 3.05rem");
    overflow-y: auto;
    li {
      margin-top: 0.3rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid #262a42;
      .title {
        font-size: 0.3rem;
        position: relative;
        span:first-child{text-transform:uppercase;}
        .buy {
          color: #00cc99;
        }
        .sell {
          color: #e76d42;
        }
        .market {
          color: #fff;
        }
        .time {
          color: #8089a3;
          font-size: 0.24rem;
          transform: scale(0.916);
        }
        .cancel {
          position: absolute;
          right: 0;
          font-size: 0.24rem;
          color:#FFDE00;
        }
      }
      .data {
        margin-top: 0.3rem;
        .data-title {
          display: flex;
          span {
            flex: 1;
            min-width: 0;
            color: #8089a3;
            font-size: 0.24rem;
            &:last-of-type {
              text-align: right;
            }
          }
        }
        .data-info {
          margin-top: 0.2rem;
          font-size: 0.26rem;
          display: flex;
          span {
            flex: 1;
            min-width: 0;
            &:last-of-type {
              text-align: right;
            }
            em {
              color: #8089a3;
              font-size: 0.24rem;
              transform: scale(0.916);
              font-style: normal;
            }
          }
        }
      }
    }
  }
</style>
