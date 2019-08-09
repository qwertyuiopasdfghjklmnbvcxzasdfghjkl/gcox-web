<template>
  <div class="block market-container">
    <div class="title-container">{{$t('exchange.exchange_market_title')}}<!-- 市场 --></div>
    <div class="top-search">
      <input v-model="filterValue" maxlength="20" type="text" :placeholder="$t('public0.public284')" />
      <img src="../../assets/img/icon-search.png">
    </div>
    <ul class="pairs mt20">
        <li :class="{active:active===item}" v-for="item in markets" :key="item" @click="active=item">{{item !== 'collection' ? item : $t('home.home_favorites')}}</li>
    </ul>
    <div class="wrapper">
      <ul class="pair-table">
        <li class="header">
          <span class="fixed" @click="sortMarket('market')">
            <span class="pointer rules" :class="[sortActive==='market'?(sort==='asc'?'down':'up'):'']">{{$t('exchange.trade_pair')}}<!-- 交易对 --></span>
          </span>
          <span class="text-right ui-flex-1" @click="sortMarket('lastPrice')">
            <span class="pointer rules" :class="[sortActive==='lastPrice'?(sort==='asc'?'down':'up'):'']">{{$t('exchange.exchange_price')}}<!-- 价格 --></span>
          </span>
          <span class="text-right ui-flex-1" @click="sortMarket('change24h')">
            <span class="pointer rules" :class="[sortActive==='change24h'?(sort==='asc'?'down':'up'):'']">{{$t('exchange.exchange_change')}}<!-- 24h涨跌 --></span>
          </span>
        </li>
      </ul>
      <div class="scroll-wrapper" id="scrollWrapper">
        <ul class="pair-table">
          <li v-for="item in curProducts" class="pointer" :class="{active:item.market===symbol}" @click="changeSymbol(item)">
            <span class="fixed favor">
              <span @click.stop="addOrDelFavor(item)"><img src="../../assets/img/star_blue.png" v-if="item.collection || (!getApiToken && favorSymbol.includes(item.market))"><img src="../../assets/img/star_gray.png" v-else></span>
              <span>{{item.currencySymbol}}</span>
              <span class="gray"> / {{item.baseSymbol}}</span>
            </span>
            <span class="text-right ui-flex-1">
              <span>{{toFixed(item.lastPrice,item.accuracy)}}</span>
            </span>
            <span class="text-right ui-flex-1">
              <span v-html="percent(item)"></span>
            </span>
          </li>
          <li v-if="showLoading && getMarketList.length===0">
            <loading :size="24"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import IScroll from 'iscroll'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import loading from '@/components/loading'
import utils from '@/assets/js/utils'
let favorSymbol = JSON.parse(localStorage.getItem('favorSymbol') || '[]')

export default {
  props:['baseSymbol','symbol','toFixed'],
  components: {
    loading
  },
  data () {
    return {
      sortActive: '',
      sort: 'asc',
      active: this.baseSymbol,
      showLoading: true,
      filterValue: '',
      mScroll:null,
      favorSymbol:favorSymbol
    }
  },
  computed: {
    ...mapGetters(['getApiToken','getMarketList','getMarketConfig']),
    markets () {
      let temp = [...new Set(this.getMarketList.map(item=>{return item.baseSymbol}))].sort()
      temp.push('collection')
      return temp
    },
    curProducts () {
      let val = this.filterValue.toUpperCase()
      let datas = this.getMarketList.sort((item1, item2) => {
        if (this.sortActive === 'lastPrice') {
          let m1 = numUtils.BN(item1.lastPrice)
          let m2 = numUtils.BN(item2.lastPrice)
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'change24h') {
          let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
          let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else {
          let m1 = item1.currencySymbol
          let m2 = item2.currencySymbol
          return this.sort === 'asc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
        }
      })

      datas = datas.filter((item) => {
        let symbol = (item.market || '').toUpperCase()
        if (this.active !== 'collection') {
          return this.active === item.baseSymbol && (!val || symbol.indexOf(val) !== -1)
        } else {
          if(this.getApiToken){
            return item.collection && (!val || symbol.indexOf(val) !== -1)
          } else {
            return this.favorSymbol.includes(item.market) && (!val || symbol.indexOf(val) !== -1)
          }
        }
      })
      return datas
    },
    getAccuracy () {
      let accuracy,Quantityaccu,Amountaccu,digit, market = this.getMarketConfig && this.getMarketConfig[this.symbol]
      if(market){
        this.$parent.$parent.fixedNumber = Number(market.accuracy) || 8
        this.$parent.$parent.Quantityaccu = Number(market.quantityAccu) || 4
        this.$parent.$parent.Amountaccu = Number(market.amountAccu) || 8
        this.$parent.$parent.digit = Number(market.digit) || 4
      }
    },
    marketConfig () {
      let config = {}
      this.getMarketList.forEach((item) => {
        config[item.market] = item
      })
      return utils.isPlainEmpty(config) ? null : config
    },
    hasCollection () {
      let rst = false
      if(this.getApiToken){
        let rds = this.getMarketList.filter(item=>{
          return item.collection
        })
        rst = rds.length>0?true:false
      } else {
        rst = this.favorSymbol.length>0?true:false
      }
      return rst
    }
  },
  watch: {
    getAccuracy (val) {
      this.$emit('input', val)
    },
    getMarketList(){
      setTimeout(()=>{
        this.mScroll && this.mScroll.refresh()
      }, 0);
    },
    getApiToken () {
      this.queryMarketList(true)
    },
    marketConfig () {
      this.setMarketConfig(this.marketConfig)
    },
    filterValue (newVal, oldVal) {
      if (!newVal) {
        return
      }
      if (/[^0-9a-z]/i.test(newVal)) {
        this.$nextTick(() => {
          this.filterValue = oldVal
        })
      }
    },
    getMarketList () {
      this.setBtcValues(this.getMarketList)
    }
  },
  created () {
    this.queryMarketList()
    this.$nextTick(() => {
      this.addEvents({
        name: 'marketEvent',
        fun: this.marketEvent
      })
    })
  },
  mounted(){
    this.initScroll()
  },
  beforeDestroy () {
    this.removeEvents('marketEvent')
  },
  methods: {
    ...mapActions(['setMarketConfig', 'addEvents', 'removeEvents', 'setBtcValues','setMarketList']),
    sortMarket (active) {
      if (active === this.sortActive) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortActive = active
        this.sort = 'asc'
      }
    },
    addOrDelFavor(item){
      if(this.getApiToken){
        if (item.collection) { // 取消
          marketApi.removeCollection({
            market: item.market
          }, (res) => {
            item.collection = !item.collection
          })
        } else {
          marketApi.addCollection({ // 收藏
            market: item.market
          }, (res) => {
            item.collection = !item.collection
          })
        }
      } else {
        if(this.favorSymbol.includes(item.market)){
          let index = this.favorSymbol.indexOf(item.market)
          this.favorSymbol.splice(index,1)
        } else {
          this.favorSymbol.push(item.market)
        }
        favorSymbol = this.favorSymbol
        localStorage.setItem('favorSymbol',JSON.stringify(this.favorSymbol))
      }
    },
    initScroll(){
      this.mScroll = new IScroll('#scrollWrapper',{
        mouseWheel: true,
        scrollbars: 'custom',
        click:true
      })
    },
    queryMarketList (key) { // 获取所有市场数据
      if(!this.getMarketList.length || key){
        marketApi.marketList((res) => {
          this.setMarketList(res || [])
          if(!this.$route.params.symbol && this.hasCollection){
            this.active = 'collection'
          }
        })
      } else {
        if(!this.$route.params.symbol && this.hasCollection){
          this.active = 'collection'
        }
      }
    },
    marketEvent (res) {
      if (res && res.type === 'updateData') {
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
          }
        })
        this.setMarketList(res.data || [])
      }
    },
    percent (item) {
      if (numUtils.BN(item.openingPrice).equals(0)) {
        return '0.00%'
      } else if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
        return `<font class="${percent < 0 ? 'rang-down' : 'rang-up'}">` + percent.toFixed(2) + '%</font>'
      } else {
        return '0.00%'
      }
    },
    changeSymbol (item) {
      this.$parent.$emit('changeSymbol', item.baseSymbol, item.currencySymbol)
    },
    sortMarket (active) {
      if (active === this.sortActive) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortActive = active
        this.sort = 'asc'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    box-sizing: border-box;
}
.top-search {
  border-bottom: 1px solid #3c3a48;
  position: relative;
  >img {
    position: absolute;
    right: 0;
    top: 0;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  >input {
      background: transparent;
      border: none;
      outline: none;
      color: #979799;
      height: 24px;
      line-height: 24px;
      width: 100%;
      padding-right: 24px;
  }
}
.pairs li {
    position: relative;
    display: inline-block;
    font-size: 14px;
    padding: 3px 0;
    border-bottom: 2px solid transparent;
    color: #f1f1f2;
    cursor: pointer;
    &+li {
        margin-left: 10px;
    }
    &.active {
        color: #00a0e9;
        border-bottom: 2px solid #00a0e9;
    }
}
.wrapper {
    height: 350px;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
}
.pair-table {
    font-size: 12px;
    li {
      display: flex;
      font-weight: 400;
      color: #979799;
      padding: 6px 0;
      &:not(.header) {
        border-top: 1px solid #212121;
        padding: 6px 0;
        &:hover, &.active {background-color: #222125;}
      }
      > span {
          &.fixed {
              width: 110px;
          }
          &.favor img {
              height: 11px;
              padding-right: 3px;
          }
      }
    }
}
.rules {
    display: inline-block;
    padding-right: 12px;
    &.up {
        color: #00a0e9;
        background: url('../../assets/img/rules-up.png') no-repeat 100%;
        background-size: auto 16px;
    }
    &.down {
        color: #00a0e9;
        background: url('../../assets/img/rules-down.png') no-repeat 100%;
        background-size: auto 16px;
    }
}
.scroll-wrapper {
  position: relative;
  overflow: hidden;
  height: 310px;
  /deep/ .iScrollVerticalScrollbar{
    position: absolute; z-index: 9999; width: 5px; bottom: 2px; top: 2px; right: 1px; overflow: hidden; pointer-events: none;
    .iScrollIndicator {
      box-sizing: border-box; position: absolute; background: rgba(151,151,153,.2); border-radius: 3px; width: 100%;
    }
  }
}

</style>
