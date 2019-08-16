<template>
  <div class="quick-trade w1200 f-c-white">
    <div>
      <p class="fs28">1-Click-Trade</p>
      <div class="ui-flex mt20">
        <div class="trade-panel">
          <div class="setting clearfix">
            <div class="symbol-container">
              <div class="text-center fs24 f-c-gray"><span class="pointer" :class="{'rang-up':formData.direction===1}" @click="formData.direction=1">Buy</span> &nbsp;|&nbsp; <span class="pointer" :class="{'rang-down':formData.direction===2}"  @click="formData.direction=2">Sell</span></div>
              <div class="symbol">
                <img :src="icons[formData.symbol]"> <span class="ml10">{{formData.symbol}}</span> <i class="icon-arrow-down3"></i>
                <ul ref="symbol">
                  <li class="ui-flex" v-for="item in symbols" @click="setSymbol(item)"><span class="ui-flex-1 text-right"><img :src="icons[item]"></span><span class="ui-flex-1 ml10 text-left">{{item}}</span></li>
                </ul>
              </div>
            </div>
            <div class="currency-container">
              <div class="text-center fs24 f-c-gray"><span class="pointer" :class="{'rang-up':formData.direction===1}" @click="formData.direction=1">With</span> &nbsp;|&nbsp; <span class="pointer" :class="{'rang-down':formData.direction===2}"  @click="formData.direction=2">For</span></div>
              <div class="currency">
                <img :src="icons[formData.currency]"> <span class="ml10">{{formData.currency}}</span> <i class="icon-arrow-down3"></i>
                <ul ref="currency">
                  <li class="ui-flex" v-for="item in currency" @click="setCurrency(item)"><span class="ui-flex-1 text-right"><img :src="icons[item]"></span><span class="ui-flex-1 ml10 text-left">{{item}}</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="block mt60">
            <div>Amount (Including Fees)</div>
            <div class="amount">
              <numberbox :accuracy="8" type="text" v-model="formData.amount" v-focus /><span>QTY</span>
              <span>Your Maximum Amount: <i class="f-c-orange">---QTY</i> <i class="icon-help-with-circle"></i></span>
            </div>
            <div class="fs16 mt40 ui-flex ui-flex-justify"><span>Estimated Amount Receivable</span> <span>USD 7300.00</span></div>
            <div class="mt25 text-right">
              <button type="button" class="submit" :class="{sell:formData.direction===2}" @click="showTradeDialog">SUBMIT</button>
            </div>
            <div class="mt15">Description</div>
            <div class="mt15">
              The current quotation may be not the final transaction price.<br />
              Please pay attention to the market fluctuation.<br /><br />
              Daily buy limit for each account: 1000 USD.<br /><br />
              Pees: Same as transaction fees and subject to actual transaction.<br />
              Click to view <span class="f-c-orange">Fees Schedule</span>
            </div>
          </div>
        </div>
        <div class="balance-panel ui-flex-1">
          <p class="fs20"><strong>fla126@qq.com</strong></p>
          <ul class="list mt10">
            <li class="ui-flex header">
              <span class="ui-flex-1">Currency</span>
              <span class="ui-flex-1">Balance</span>
              <span class="ui-flex-1">Available</span>
              <span class="ui-flex-1"></span>
            </li>
          </ul>
          <div class="wallet" id="scrollWrapper">
            <ul class="list">
              <li class="ui-flex" v-for="data in myAssets">
                <span class="ui-flex-1 ellipsis">{{data.symbol}}</span>
                <span class="ui-flex-1 ellipsis">{{toFixed(data.totalBalance)|removeEndZero}}</span>
                <span class="ui-flex-1 ellipsis">{{toFixed(data.availableBalance)|removeEndZero}}</span>
                <span class="ui-flex-1">
                  <span><i class="icon-download"></i><br />Deposit</span>
                  <span><i class="icon-upload1"></i><br />Withdraw</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt40 fs20">Your Orders</div>
      <ul class="orders mt20">
        <li class="ui-flex">
          <span class="ui-flex-3">Date (UTC)</span>
          <span class="text-center ui-flex-2">Side</span>
          <span class="text-right ui-flex-3">Qty.</span>
          <span class="text-right ui-flex-3">Cash Qty.</span>
          <span class="text-right ui-flex-2">Price</span>
          <span class="text-right ui-flex-3">Filled</span>
          <span class="text-right ui-flex-3">Remaining</span>
          <span class="text-right ui-flex-3">Avg price</span>
          <span class="text-right ui-flex-2">Status</span>
        </li>
        <li class="ui-flex" v-for="item in orders">
          <span class="ui-flex-3">Date (UTC)</span>
          <span class="text-center ui-flex-2">Side</span>
          <span class="text-right ui-flex-3">Qty.</span>
          <span class="text-right ui-flex-3">Cash Qty.</span>
          <span class="text-right ui-flex-2">Price</span>
          <span class="text-right ui-flex-3">Filled</span>
          <span class="text-right ui-flex-3">Remaining</span>
          <span class="text-right ui-flex-3">Avg price</span>
          <span class="text-right ui-flex-2">Status</span>
        </li>
      </ul>
      <page v-if="!orderLoaing && orders.length > 0" :pageIndex="params.page" :pageSize="params.show"
            :total="params.total" @changePageIndex="pageChange"/>
      <div class="nodata mt30" v-if="!orderLoaing && orders.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('public0.public141')}}<!--暂无订单--></div>
      </div>
      <loading v-if="orderLoaing"/>
    </div>
    <div class="mask-layer ui-flex ui-flex-center ui-flex-column" v-show="showLoaing">
      <loading/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import userUtils from '@/api/wallet'
import loading from '@/components/loading'
import marketApi from '@/api/market'
import numberbox from '@/components/formel/numberbox'
import IScroll from 'iscroll'
import page from '@/components/page'
import quickTradeDialog from '@/exchanges/market/quickTradeDialog'
import utils from '@/assets/js/utils'


export default {
  name:'fiat',
  components: {
    loading,
    numberbox,
    page
  },
  data () {
    return {
      currency:['USD','CNY'],
      icons:{},
      formData:{
        direction:1,
        symbol:'BTC',
        currency:'USD',

        amount:'',
      },
      params: {
        page: 1,
        show: 10,
        total: 10
      },
      orders:new Array(10),
      myAssets:[],
      mScroll:null,
      showLoaing:false,
      orderLoaing:false
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    symbols(){
      let list = [], icons = {}
      for(let item of this.myAssets){
        list.push(item.symbol)
        icons[item.symbol] = `data:image/png;base64,${item.iconBase64}`
      }
      list = [...new Set(list)]
      icons.CNY=require('@/assets/img/CNY.png')
      icons.USD=require('@/assets/img/USD.png')
      this.icons = icons
      return list.sort()
    }

  },
  watch:{
    params () {
      
    },
  },
  created () {
    this.getList()
  },
  mounted(){
    this.initScroll()
  },
  beforeDestroy () {

  },
  methods: {
    ...mapActions([]),
    showTradeDialog(){
      utils.setDialog(quickTradeDialog, {
        data:this.formData,
        // backClose:true,
        okCallback: () => {
          this.getList()
        }
      })
    },
    initScroll(){
      this.mScroll = new IScroll('#scrollWrapper',{
        mouseWheel: true,
        scrollbars: 'custom',
        click:true
      })
    },
    setSymbol(key){
      this.formData.symbol = key
      this.$refs.symbol.style.display = 'none'
      setTimeout(()=>{
        this.$refs.symbol.removeAttribute('style')
      },100)
    },
    setCurrency(key){
      this.formData.currency = key
      this.$refs.currency.style.display = 'none'
      setTimeout(()=>{
        this.$refs.currency.removeAttribute('style')
      },100)
    },
    getList () {
      this.showLoaing = true
      userUtils.myAssets({}, (data) => {
        data.forEach((item) => {
          item.show = false
          item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toFixed(8)
        })
        this.myAssets = data.filter(item=>{return item.type===1})
        this.showLoaing = false
        setTimeout(()=>{
          this.mScroll && this.mScroll.refresh()
        },100)
      }, (data, msg) => {
        console.error(msg)
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        this.showLoaing = false
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed).toMoney()
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
    },
  }
}
</script>

<style lang="less" scoped>
.setting > div{
  width: 200px;
  float: left;
  &+div {margin-left: 35px;}
  .symbol, .currency {
    border: 1px solid #fff;
    border-radius: 8px;
    line-height: 46px;
    font-size: 22px;
    text-align: center;
    margin-top: 15px;
    position: relative;
    cursor: pointer;
    i{position: absolute; right: 15px; top: 15px; font-size: 16px;}
    img {width: 26px; height: 26px; object-fit: contain; vertical-align: middle; margin-top: -6px;}
    ul {
      position: absolute;  left: 0; right: 0; background-color: #212028; box-shadow: 1px 1px 3px rgba(0,0,0,.3); max-height: 400px; overflow-y: auto; z-index: 1; display: none;
      li:hover {background-color: #292831;}
      li.active {color: #00a0e9; background-color: #292831;}
    }
    &:hover  ul {display: block;}
  }
}
.block {
    width: 550px;
    background: #19181d;
    margin-bottom: 4px;
    padding: 15px 20px;
    .no-margin {
        margin: 0;
    }
}
.quick-trade {padding-top: 50px; padding-bottom: 30px; > div {padding-left: 15px; padding-right: 15px;}}
.amount{
  line-height: 40px; position: relative; font-size: 16px;
  input {width:100%; height: 30px; box-sizing: border-box; font-size: 16px; color: #fff; background-color: transparent; padding-left: 10px; padding-right: 100px; border-bottom: 1px solid #fff;}
  input:focus {border-bottom-color: #fff!important;}
  span{position: absolute; right: 0; }
  span:last-of-type {top: 30px; font-size: 12px;}
}
.submit {min-width: 130px; height: 35px; border: none; background-image: linear-gradient(left,#90BE3B, #2A5A43); color: #fff; font-size: 16px; cursor: pointer; position: relative;}
.submit:after {content: ''; position: absolute; left: 0; top: 0; right: 0; bottom: 0;}
.submit:active:after {background-color: rgba(0,0,0,.1);}
.submit.sell {background-image: linear-gradient(left,#e63c1f, #970112);}

.balance-panel {
  margin-left: 100px;
  background-color:#2f2825;
  padding:15px;
  position: relative;
  .wallet {
    position: absolute;
    left: 15px;
    right: 15px;
    bottom:15px;
    top: 93px;
    overflow: hidden;
  }
  .list li {
    line-height: 40px;
    background-color:#545251;
    &.header {background-color:#3C3736;}
    &:nth-of-type(2n){background-color:#3C3736;}
    > span {
      border-bottom: 2px solid #312927; border-right: 2px solid #312927;
      &:first-of-type {padding-left: 10px;}
      &:nth-of-type(2), &:nth-of-type(3) {padding-right: 10px; text-align: right;}
      &:last-of-type {border-bottom-color: transparent; text-align: center; background-color: #2f2825;}
      span {display: inline-block; line-height: 14px; font-size: 12px; cursor: pointer; }
      span:last-of-type {margin-left: 10px;}
      i {font-size: 16px;}
    }
  }
}
#scrollWrapper {
  /deep/ .iScrollVerticalScrollbar{
    position: absolute; z-index: 9999; width: 5px; bottom: 2px; top: 2px; right: 1px; overflow: hidden; pointer-events: none;
    .iScrollIndicator {
      box-sizing: border-box; position: absolute; background: rgba(151,151,153,.2); border-radius: 3px; width: 100%;
    }
  }
}
.orders li {
  line-height: 40px;
  background-color:#3C3736;
  > span {
    padding: 0 10px; border-bottom: 2px solid #312927; border-right: 2px solid #312927;
  }
}
.nodata {
  text-align: center;
}

.nodata .nodata-icon {
  height: 80px;
  line-height: 80px;
  font-size: 40px;
  color: #A1A1A1;
}

.nodata .nodata-text {
  height: 40px;
  line-height: 20px;
  color: #A1A1A1;
}
</style>

