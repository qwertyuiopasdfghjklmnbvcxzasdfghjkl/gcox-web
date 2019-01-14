<template>
  <div class="page">
    <cp-top-back :back="false" :showLogo="true">
    </cp-top-back>

    <div class="box one">
      <div class="inner">
        <section class="coin_tab">
          <ul>
            <li :class="[tabactive==='tab-container1'?'activation':'']" @click="whickTabFun('tab-container1')"><span>{{$t('home.home_favorites')}}<!--自选--></span></li>
            <li :class="[tabactive==='tab-container2'?'activation':'']" @click="whickTabFun('tab-container2')"><span>BTC</span></li>
            <li :class="[tabactive==='tab-container3'?'activation':'']" @click="whickTabFun('tab-container3')"><span>ETH</span></li>
            <li :class="[tabactive==='tab-container4'?'activation':'']" @click="whickTabFun('tab-container4')"><span>CDCC</span><i></i></li>
            <li :class="[tabactive==='tab-container5'?'activation':'']" @click="whickTabFun('tab-container5')"><span>USDT</span><i></i></li>
          </ul>
        </section>
        <section class="coin_header">
          <ul>
            <li @click="sortMarket('dealAmount')">
              {{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->
              <template v-if="sortActive==='dealAmount'">
                <i class="up" v-if="sort=='asc'"></i>
                <i class="down" v-if="sort=='desc'"></i>
              </template>
            </li>
            <li @click="sortMarket('lastPrice')">
              {{$t('exchange.exchange_price')}}<!--价格-->
              <template v-if="sortActive==='lastPrice'">
                <i class="up" v-if="sort=='asc'"></i>
                <i class="down" v-if="sort=='desc'"></i>
              </template>
            </li>
            <li @click="sortMarket('fall')">
              {{$t('home.home_change_24h')}}<!--24h涨跌-->
              <template v-if="sortActive==='fall'">
                <i class="up" v-if="sort=='asc'"></i>
                <i class="down" v-if="sort=='desc'"></i>
              </template>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <mt-tab-container v-model="tabactive" :swipeable="true">
      <!--自选-->
      <mt-tab-container-item id="tab-container1">
        <div id="scroll">
          <div class="box box-wrap">
            <div class="inner">
              <section class="coin_content">
                <div class="item">
                  <div class="inner">
                    <ul class="item" v-for="(item, index) in favoriteMarkets" :key="index" @click="goToExchangePage(item)">
                      <li>
                        <img :src="item.iconBase64?`data:image/png;base64,`+item.iconBase64:item.iconUrl"/>
                      </li>
                      <li>
                        <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                        <h2>24H {{toFixed(item.dealAmount, 0)}}</h2>
                      </li>
                      <li>
                        <h1>{{toFixed(item.lastPrice)}}</h1>
                        <h2>≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></h2>
                      </li>
                      <li>
                        <button class="c-button c-button-normal" :class="[percent(item).css]">{{percent(item).percent}}%</button>
                      </li>
                    </ul>
                    <div class="lastspace"></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </mt-tab-container-item>

      <!--BTC-->
      <mt-tab-container-item id="tab-container2">
        <div class="box">
          <div class="inner">
            <section class="coin_content">
              <div class="item">
                <div class="inner">
                  <ul class="item" v-for="(item, index) in btcMarkets" :key="index" @click="goToExchangePage(item)">
                    <li>
                      <img :src="item.iconBase64?`data:image/png;base64,`+item.iconBase64:item.iconUrl"/>
                    </li>
                    <li>
                      <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                      <h2>24H {{toFixed(item.dealAmount, 0)}}</h2>
                    </li>
                    <li>
                      <h1>{{toFixed(item.lastPrice)}}</h1>
                      <h2>≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></h2>
                    </li>
                    <li>
                      <button class="c-button c-button-normal" :class="[percent(item).css]">{{percent(item).percent}}%</button>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </mt-tab-container-item>

      <!--ETH-->
      <mt-tab-container-item id="tab-container3">
        <div class="box">
          <div class="inner">
            <section class="coin_content">
              <div class="item">
                <div class="inner">
                  <ul class="item" v-for="(item, index) in ethMarkets" :key="index" @click="goToExchangePage(item)">
                    <li>
                      <img :src="item.iconBase64?`data:image/png;base64,`+item.iconBase64:item.iconUrl"/>
                    </li>
                    <li>
                      <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                      <h2>24H {{toFixed(item.dealAmount, 0)}}</h2>
                    </li>
                    <li>
                      <h1>{{toFixed(item.lastPrice)}}</h1>
                      <h2>≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></h2>
                    </li>
                    <li>
                      <button class="c-button c-button-normal" :class="[percent(item).css]">{{percent(item).percent}}%</button>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </mt-tab-container-item>

      <!--CDCC-->
      <mt-tab-container-item id="tab-container4">
        <div class="box">
          <div class="inner">
            <section class="coin_content">
              <div class="item">
                <div class="inner">
                  <ul class="item" v-for="(item, index) in cdccMarkets" :key="index" @click="goToExchangePage(item)">
                    <li>
                      <img :src="item.iconBase64?`data:image/png;base64,`+item.iconBase64:item.iconUrl"/>
                    </li>
                    <li>
                      <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                      <h2>24H {{toFixed(item.dealAmount, 0)}}</h2>
                    </li>
                    <li>
                      <h1>{{toFixed(item.lastPrice)}}</h1>
                      <h2>≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></h2>
                    </li>
                    <li>
                      <button class="c-button c-button-normal" :class="[percent(item).css]">{{percent(item).percent}}%</button>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </mt-tab-container-item>

      <!--USDT-->
      <mt-tab-container-item id="tab-container5">
        <div class="box">
          <div class="inner">
            <section class="coin_content">
              <div class="item">
                <div class="inner">
                  <ul class="item" v-for="(item, index) in usdtMarkets" :key="index" @click="goToExchangePage(item)">
                    <li>
                      <img :src="item.iconBase64?`data:image/png;base64,`+item.iconBase64:item.iconUrl"/>
                    </li>
                    <li>
                      <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                      <h2>24H {{toFixed(item.dealAmount, 0)}}</h2>
                    </li>
                    <li>
                      <h1>{{toFixed(item.lastPrice)}}</h1>
                      <h2>≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></h2>
                    </li>
                    <li>
                      <button class="c-button c-button-normal" :class="[percent(item).css]">{{percent(item).percent}}%</button>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </mt-tab-container-item>

    </mt-tab-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { TabContainer, TabContainerItem, Indicator } from 'mint-ui'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import valuation from '@/components/valuation'
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
export default {
  name: 'page-iconindex',
  components: {
    valuation
  },
  data () {
    return {
      sortActive: null,
      sort: null,
      scroll: false,
      tabactive: 'tab-container2',
      markets: [],
      favoriteMarkets: [],
      btcMarkets: [],
      ethMarkets: [],
      cdccMarkets: [],
      usdtMarkets: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketList']),
    sortMarketDatas () {
      let datas = this.markets.sort((item1, item2) => {
        if (this.sortActive === 'dealAmount') {
          let m1 = numUtils.BN(item1.dealAmount)
          let m2 = numUtils.BN(item2.dealAmount)
          if (m1.equals(m2)) {
            return 0
          }
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'lastPrice') {
          let m1 = numUtils.BN(item1.lastPrice)
          let m2 = numUtils.BN(item2.lastPrice)
          if (m1.equals(m2)) {
            return 0
          }
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'fall') {
          let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
          let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
          if (m1.equals(m2)) {
            return 0
          }
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else {
          let m1 = item1.currencySymbol
          let m2 = item2.currencySymbol
          return this.sort === 'desc' ? (m1 > m2 ? -1 : 1) : (m1 < m2 ? -1 : 1)
        }
      })
      return datas
    }
  },
  watch: {
    sortMarketDatas () {
      this.favoriteMarkets = []
      this.btcMarkets = []
      this.ethMarkets = []
      this.cdccMarkets = []
      this.usdtMarkets = []
      this.sortMarketDatas.forEach((item) => {
        if (item.baseSymbol === 'BTC') {
          this.btcMarkets.push(item)
        } else if (item.baseSymbol === 'ETH') {
          this.ethMarkets.push(item)
        } else if (item.baseSymbol === 'CDCC') {
          this.cdccMarkets.push(item)
        } else if (item.baseSymbol === 'USDT') {
          this.usdtMarkets.push(item)
        }
        if (item.collection) {
          this.tabactive = 'tab-container1'
          this.favoriteMarkets.push(item)
        }
      })
    }
  },
  created () {
    this.getMarkets()
    this.fromWaletsysbolm()
  },
  methods: {
    sortMarket (active) {
      if (active === this.sortActive) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortActive = active
        this.sort = 'asc'
      }
    },
    fromWaletsysbolm () { // 钱包跳转过来
      let sysbomle = this.$route.params.sysbolm
      if (sysbomle === 'ETH') {
        this.whickTabFun('tab-container3')
      } else if (sysbomle === 'CDCC') {
        this.whickTabFun('tab-container4')
      } else if (sysbomle==='USDT') {
        this.whickTabFun('tab-container5')
      } else {
        this.whickTabFun('tab-container2')
      }
    },
    getMarkets () { // 获取市场
      Indicator.open()
      marketApi.marketList((res) => {
        console.log(res)
        if (this.getMarketList && !this.getApiToken) {
          let datas = this.getMarketList
          let tempObj = {}
          datas.forEach((item) => {
            tempObj[item.market] = item
          })
          res.forEach((item) => {
            let d = tempObj[item.market]
            if (d) {
              item.collection = d.collection
            }
          })
        }
        this.markets = res
        Indicator.close()
      }, () => {
        Indicator.close()
      })
    },
    whickTabFun (index) {
      this.tabactive = index
    },
    goToExchangePage (item) {
      this.$router.push({name: 'exchange-market', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
    },
    percent (item) {
      if (numUtils.BN(item.openingPrice).equals(0)) {
        return {percent: '0.00'}
      } else if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
        if (percent.equals(0)) {
          return {percent: '0.00'}
        }
        return {
          css: percent.gt(0) ? 'c-button-green' : 'c-button-orange',
          percent: percent.toFixed(2)
        }
        return `<font color="${percent < 0 ? '#e76d42' : '#03c087'}">` + percent.toFixed(2) + '%</font>'
      } else {
        return {percent: '0.00'}
      }
    },
    toFixed (v1, fixed) {
      return numUtils.BN(v1).toFixed(fixed !== undefined ? fixed : 8)
    }
  }
}
</script>

<style lang="less" scoped>
@write:#ffffff;
@write-20:#cbd4ec;
@write-374:#374d64;
@write-8e9:#8e9aa5;
.mint-tab-container{position: absolute;top:2.2rem;left:0;right:0;bottom:0;background-color:#f5f5f5; }
.mint-tab-container /deep/ .mint-tab-container-wrap{height:100%;}
.mint-tab-container /deep/ .mint-tab-container-item{overflow:auto;padding-bottom:0.2rem;}
.lastspace{height:0.4rem;width:100%;}
#scroll{height: 100%;overflow-x: hidden;overflow-y: auto;}
.c-button-normal{display: inline-block;padding: 0 .12rem;width: 1.48rem;}
.c-button{
  font-size: .26rem;appearance: none;border-radius:.06rem;border: 0;box-sizing: border-box;
  color: inherit;display: block;height: .64rem;outline: 0;overflow: hidden;position: relative;
  text-align: center;background:#dddddd;
}
.c-button-green{color: #fff;font-weight:bold;background:#24c08a;}
.c-button-orange{color: #fff;font-weight:bold;background:#f1595c;}
.box{background-color: @write;font-size: .3rem;}
.box>.inner{color: #999;}
.coin_tab ul{display: flex;justify-content: space-between;border-bottom: .02rem solid #c7cfd4;padding:0 0.3rem;}
.coin_tab ul li{position: relative;bottom: -0.02rem;line-height: .75rem;height: .75rem;}
.coin_tab ul li.activation{color:#0072fd;}
.coin_tab ul li.activation::after{content:"";position:absolute;display:flex;width:calc(~"100% - 0.08rem");height:0.03rem;background:#0072fd;left:0.04rem;bottom:0rem;}
.coin_tab ul li span{padding:0.04rem 0.08rem;}
.coin_tab ul li.activation span{background:#FFF;}
.coin_header{background: linear-gradient(to bottom,#f2f1f7,#fff);}
.coin_header ul{display: flex;justify-content: center;}
.coin_header ul li{font-size: .24rem;width: 1.8rem;line-height: .75rem;height: .75rem;text-align: center;color:@write-8e9;}
.coin_header ul li i.down{
  display: inline-block;width: 0.14rem;height: 0.17rem;margin-left: .1rem;
  background: url('../../assets/img/i_down.png') no-repeat center;background-size: contain;
}
.coin_header ul li i.up{
  display: inline-block;width: 0.14rem;height: 0.17rem;margin-left: .1rem;
  background: url('../../assets/img/i_up.png') no-repeat center;background-size: contain;
}
.coin_header ul li:nth-child(3){text-align: right;}
.one{background-color: #fff;height: 1.4rem;}
.coin_content{font-size: .24rem;}
.coin_content .item{border-top: 0.01rem solid #f5f5f5;}
.coin_content .item:first-child{border-top: 0;}
.coin_content ul{
  padding: .26rem .2rem;background-color: #fff;display: flex;justify-content: space-between;border-radius:.05rem;
  // box-shadow: 0px 3px 30px 0px rgba(14, 14, 14, 0.35);
}
.coin_content ul li{
  display:flex;flex-direction:column;justify-content:center;
}
.coin_content ul li img{
  height:.4rem;display: inline-block;width: .4rem;left: 0.3rem;
  border-radius:50%;
  overflow: hidden;
}
.coin_content ul li:nth-child(2){
  padding-left: .2rem;padding-right: .2rem;width:2.2rem;color:@write-8e9;
  h1 span{font-size: .32rem;color:@write-374;}
  h1 i{font-style: normal;font-size: .20rem;color: @write-8e9;}
  h2{font-size: .24rem;color:@write-8e9;}
}
.coin_content ul li:nth-child(3){
  padding:0 0.2rem;display:flex;flex:1;flex-direction:column;overflow: hidden;
  h1{
    font-size: .32rem;color:@write-374;width:100%;display:block;
    white-space: nowrap;overflow: hidden;text-overflow:ellipsis;
  }
  h2{
    font-size: .24rem;white-space: nowrap;overflow: hidden;
    text-overflow:ellipsis;width:100%;display:block;
    color:@write-8e9;
  }
}
</style>
