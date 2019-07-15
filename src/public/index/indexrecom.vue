<template>
  <ul class="w1200 mt20 recommend-markets ui-flex ui-flex-justify">
    <li v-for="(item, index) in products">
      <div class="ui-flex" tp>
        <img class="icon" :src="item.iconBase64?`data:image/png;base64,${item.iconBase64}`:`${origin}${item.iconUrl}`">
        <div class="ui-flex-1 name">{{item.currencySymbol}}/{{item.baseSymbol}}</div>
        <div class="fs12" v-html="percent(item)"></div>
      </div>
      <div class="price">{{toFixed(item.lastPrice, item.accuracy)}}</div>
      <div class="line-box">
        <v-chart :options="getBar(item.kline)"/>
      </div>
    </li>
  </ul>
</template>
<script>
  import Vue from 'vue'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import Config from '@/assets/js/config'
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/line'
  import getBar from '@/assets/js/bar'
  export default {
    components: {
      'v-chart': ECharts
    },
    data () {
      return {
        fixedNumber: 8,
        products: [],
        origin: Config.origin,
        getBar: getBar,
      }
    },
    created () {
      this.getMarketCom()
    },
    methods: {
      getDirection (direction) { //  1 买  绿色  2 卖 红色
        return parseInt(direction || 0)
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      getMarketCom () {
        // 获取推荐市场
        marketApi.marketListCom(1, (res) => {
          this.products = res
        }, () => {
        })
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
      }
    }
  }
</script>
<style lang="less" scoped>
.recommend-markets {
    height: 160px;
    li {
      width: 220px;
      height: 155px;
      border-radius: 3px;
      border: 1px solid #2d2b37;
      cursor: pointer;
      position: relative;
      background: #242328;
      overflow: hidden;
      transition: all .3s ease;
      transform: translateZ(0);
      [tp] {
        padding: 10px;
        line-height: 30px;
      }
      .icon {
          width: 24px;
          height: 30px;
          object-fit: contain;
          margin-right: 10px;
      }
      .name {height: 30px; line-height: 30px;}
      .price {
          padding-left: 10px;
          line-height: 24px;
          font-size: 18px;
      }
      .line-box {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 220px;
          height: 66px;
      }
  }
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
