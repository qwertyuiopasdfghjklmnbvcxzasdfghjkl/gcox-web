<template>
  <div class="coin-box">
    <div class="w1200">
      <ul class="tab">
        <li :class="{active:current==='rise'}" @click="switchTab('rise')">{{$t('public0.public204')}}<!-- 涨幅榜 --></li>
        <li :class="{active:current==='fall'}" @click="switchTab('fall')">{{$t('public0.public205')}}<!-- 跌幅榜 --></li>
        <li :class="{active:current==='new'}" @click="switchTab('new')">{{$t('exchange.new_token_board')}}<!-- 新币榜 --></li>
      </ul>
      <table >
        <thead >
          <tr >
            <th >{{$t('exchange.trade_pair')}}<!-- 交易对 --></th>
            <th >{{$t('exchange.exchange_last_price')}}<!-- 最新价 --></th>
            <th >{{$t('home.home_low_24h')}}<!-- 最低价 --></th>
            <th >{{$t('exchange.exchange_high')}}<!-- 最高价 --></th>
            <th >{{$t('home.home_volume_24h')}}<!-- 成交量 --></th>
            <th class="text-right">{{$t('exchange.up_and_down')}}<!-- 涨跌幅 --></th>
          </tr>
        </thead>
        <tbody >
          <router-link v-for="item in current==='rise'?riseList:(current==='fall'?fallList:newList)" :to="{name: 'exchange_index',params:{symbol:item.currencySymbol+'_'+item.baseSymbol}}" tag='tr' v-if="(item.visible&&Number(item.visible)) || !item.visible">
            <td class="icon" :style="`background-image: url(${item.iconBase64?'data:image/png;base64,'+item.iconBase64:origin+item.iconUrl});`">
              <span >{{item.currencySymbol}}/{{item.baseSymbol}}</span>
            </td>
            <td ><span >{{toFixed(item.lastPrice, item.accuracy)}}</span></td>
            <td ><span >{{toFixed(item.lowPrice24h, item.accuracy)}}</span></td>
            <td ><span >{{toFixed(item.highPrice24h, item.accuracy)}}</span></td>
            <td ><span >{{toFixed(item.dealAmount, 2).toMoney()}}</span></td>
            <td class="text-right"><span v-html="percent(item)"></span>
            </td>
          </router-link>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import Config from '@/assets/js/config'
  export default {
    data () {
      return {
        fixedNumber: 8,
        current: 'rise',
        origin: Config.origin
      }
    },
    computed: {
      ...mapGetters(['getMarketList']),
      riseList () {
        if (!this.getMarketList.length) {
          return []
        }
        let datas = this.getMarketList.filter((item) => {
          let m1 = numUtils.BN(item.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item.change24h).div(item.openingPrice)
          return m1.gte(0)
        })
        let ndatas = datas.sort((item1, item2) => {
          let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
          let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
          if (m1.equals(m2)) {
            return 0
          }
          return m1.lt(m2) ? 1 : -1
        })
        return ndatas.slice(0,10)
      },
      fallList () {
        if (!this.getMarketList.length) {
          return []
        }
        let datas = this.getMarketList.filter((item) => {
          let m1 = numUtils.BN(item.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item.change24h).div(item.openingPrice)
          return m1.lt(0)
        })
        let ndatas = datas.sort((item1, item2) => {
          let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
          let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
          if (m1.equals(m2)) {
            return 0
          }
          return m1.gt(m2) ? 1 : -1
        })
        return ndatas.slice(0,10)
      },
      newList(){
        if (!this.getMarketList.length) {
          return []
        }
        let ndatas = this.getMarketList.sort((item1, item2) => {
          let m1 = numUtils.BN(item1.createdAt)
          let m2 = numUtils.BN(item2.createdAt)
          return m1.gte(m2) ? 1 : -1
        })
        return ndatas.slice(0,10)
      }
    },
    watch: {
      getMarketList () {
        this.setBtcValues(this.getMarketList)
      }
    },
    created () {
      this.queryMarketList() // 初始化数据
    },
    methods: {
      ...mapActions(['setBtcValues','setMarketList']),
      switchTab(current){
        this.current = current
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
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
      queryMarketList () { // 获取所有市场数据
        if(!this.getMarketList.length){
          marketApi.marketList((res) => {
            this.setMarketList(res || [])
          })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
.coin-box {
  min-height: 600px;
  padding: 30px 0;
  .tab {
    font-size: 18px;
    border-bottom: 2px solid #313239;
    li {
        display: inline-block;
        padding: 20px 0;
        border-bottom: 2px solid #313239;
        position: relative;
        cursor: pointer;
        top: 2px;
        &.active {
          color: #00a0e9;
          border-bottom: 2px solid #00a0e9;
        }
        & + li {
          margin-left: 80px;
        }
    }
  }
  table {
    width: 100%;
    font-size: 12px;
    border-collapse: collapse;
    text-align: left;
    thead>tr>th {
      height: 40px;
      line-height: 40px;
      color: #979799;
      font-weight: 400;
      padding: 0 5px;
    }
    tbody>tr {
      cursor: pointer;
      border-bottom: 1px solid #313239;
      &:last-of-type {
        border-bottom:none;
      }
    }
    tbody>tr:hover {background-color: #222125; }
    tbody>tr>td {
        height: 48px;
        line-height: 48px;
        color: #f1f1f2;
        padding: 0 5px;
    }
    tbody>tr>td.icon {
        background-size: 20px 20px;
        background-position: 5px;
        background-repeat: no-repeat;
        padding-left: 40px;
    }
  }
}
</style>
