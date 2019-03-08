<template>
  <div class="page">
      <cp-top-back :back="false" :showLogo="true"></cp-top-back>
      <div class="page-container">
        <div class="img-banner">
          <img src="../assets/img/cdcc/banner@3x.jpg"/>
        </div>
        <div class="recommend-banner">
          <swiper :options="swiperOption">
            <!-- slides -->
            <swiper-slide v-for="(item, index) in products" :key="index">
              <ul class="list">
                <li class="list-item">
                  <span class="market">{{item.currencySymbol}}/{{item.baseSymbol}}</span>
                  <span class="price" :class="{rise: Number(item.direction) === 1, fall: Number(item.direction) === 2}">{{toFixed(item.lastPrice, item.accuracy)}}</span>
                </li>
                <li class="list-item">
                  <span v-html="percent(item)"></span>
                  <span class="currency">≈<valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span>
                </li>
              </ul>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <!-- <div class="notice">
          <img src="../assets/img/newton/gonggao@3x.png"/>
          <span>Newton Lists Bytecoin</span>
        </div> -->
        <!-- <div class="img-banner2">
          <img src="../assets/img/newton/banner2.png"/>
          <span>Newbie Guide</span>
        </div> -->
        <ul class="tabs">
          <li :class="{current:active==='tab-rise-list'}" @click="active='tab-rise-list'">
            <span>{{$t('public0.public204')}}<!--涨幅榜--></span>
          </li>
          <li :class="{current:active==='tab-fall-list'}" @click="active='tab-fall-list'">
            <span>{{$t('public0.public205')}}<!--跌幅榜--></span>
          </li>
        </ul>
        <mt-tab-container v-model="active" :swipeable="true" class="tab-bg">
          <mt-tab-container-item id="tab-rise-list">
            <ul class="sysmbol-list">
              <li v-for="item in riseList" v-tap="{methods:changeMarket,market:item}">
                <div class="left">
                  <span>
                    <font>{{item.currencySymbol}}</font>/{{item.baseSymbol}}
                  </span>
                  <span>24H {{toFixed(item.dealAmount, 2)}}</span>
                </div>
                <div class="middle">
                  <span :class="{rise:Number(item.direction)===1,fall:Number(item.direction)===2}">{{toFixed(item.lastPrice, item.accuracy)}}</span>
                  <span>≈ <valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span>
                </div>
                <div class="right" v-html="percent(item)">
                </div>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-fall-list">
            <ul class="sysmbol-list">
              <li v-for="item in fallList" v-tap="{methods:changeMarket,market:item}">
                <div class="left">
                  <span>
                    <font>{{item.currencySymbol}}</font>/{{item.baseSymbol}}
                  </span>
                  <span>24H {{toFixed(item.dealAmount, 2)}}</span>
                </div>
                <div class="middle">
                  <span :class="{rise:Number(item.direction)===1,fall:Number(item.direction)===2}">{{toFixed(item.lastPrice, item.accuracy)}}</span>
                  <span>≈ <valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span>
                </div>
                <div class="right" v-html="percent(item)">
                </div>
              </li>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import marketApi from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import valuation from '@/components/valuation'
import { Toast } from 'mint-ui'
export default {
  name: 'page-home',
  components: {
    valuation
  },
  data () {
    return {
      marketInterval:null,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      products: [],
      getMarketList:null,
      active: 'tab-rise-list'
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    riseList () {
      if (!this.getMarketList) {
        return []
      }
      let datas = this.getMarketList.filter((item) => {
        let m1 = numUtils.BN(item.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item.change24h).div(item.openingPrice)
        return m1.gt(0)
      })
      let ndatas = datas.sort((item1, item2) => {
        let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
        let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
        if (m1.equals(m2)) {
          return 0
        }
        return m1.lt(m2) ? 1 : -1
      })
      return ndatas.slice(0, 10)
    },
    fallList () {
      if (!this.getMarketList) {
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
      return ndatas.slice(0, 10)
    }
  },
  created () {
    this.getMarketCom()
    this.getLocalMarketList()
    this.marketInterval = setInterval(()=>{
      this.getMarketCom()
      this.getLocalMarketList()
    },5000)
  },
  beforeDestroy(){
    clearInterval(this.marketInterval)
  },
  methods: {
    getLocalMarketList () {
      //更新获取市场列表
      marketApi.marketList((res) => {
        if (!this.getApiToken) {
          res.forEach((item) => {
            item.collection = false
          })
        }
        this.getMarketList = res
      })
    },
    changeMarket(args){
      this.$router.replace({name:'exchange-market', params:{market:`${args.market.currencySymbol}_${args.market.baseSymbol}`}})
    },
    getMarketCom () {
      // 获取推荐市场
      marketApi.marketListCom(1, (res) => {
        this.products = (res || [])
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed)
    },
    percent (item) {
      if (numUtils.BN(item.openingPrice).equals(0)) {
        return '0.00%'
      } else if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
        if (numUtils.BN(percent).equals(0)) {
          return '0.00%'
        }
        return `<font class="${percent < 0 ? 'fall' : 'rise'}">` + percent.toFixed(2) + '%</font>'
      } else {
        return '0.00%'
      }
    }
  }
}
</script>

<style scoped lang="less">
.page-container{position:absolute;top:0.8rem;left:0;right:0;bottom:0;overflow-y:auto;overflow-x:hidden;}
.img-banner{width:100%; height: 3.91rem;}
.img-banner /deep/ img{width:100%;}
.recommend-banner{width:100%;height:1.6rem;display:flex;flex-direction:column;}
.recommend-banner /deep/ .swiper-container{width:100%;height:100%;}
.recommend-banner /deep/ .swiper-pagination{bottom:0.1rem;}
.recommend-banner /deep/ .swiper-pagination-bullet{width:0.08rem;height:0.08rem;background:#CBD4EC;}
.recommend-banner /deep/ .swiper-pagination-bullet-active{background:#FFF;}
.recommend-banner /deep/ .list{
  width:5.5rem;display:flex;color:#fff;font-size:0.24rem;justify-content:center;margin:0.2rem auto 0 auto;
}
.recommend-banner /deep/ .list .list-item{
  display:flex;flex:initial;align-items:center;flex-direction:column;justify-content:center;
  width:3rem;height:1.12rem;border-radius:0.1rem;margin-right:0.5rem;
  border: .01rem solid #646bef;
}
.recommend-banner /deep/ .list .list-item:last-child{margin-right:0;}
.recommend-banner /deep/ .list .list-item .market{color:#66709d;}
.recommend-banner /deep/ .list .list-item .price{font-size:0.3rem;margin:0.06rem 0;}
.recommend-banner /deep/ .list .list-item .rise{color:#00CC99;}
.recommend-banner /deep/ .list .list-item .fall{color:#f34245;}
.recommend-banner /deep/ .list .list-item .currency{margin-top:0.1rem;color:#fff;}
.recommend-banner /deep/ .pagination{width:100%;display:flex;justify-content:center;align-items:center;margin-top:0.18rem;}
.recommend-banner /deep/ .pagination li{width:0.08rem;height:0.08rem;border-radius:50%;background:#494F72;margin-right:0.2rem;}
.recommend-banner /deep/ .pagination li.current{background:#CBD4EC;}
.recommend-banner /deep/ .pagination li:last-child{margin-right:0px;}
.notice{
  height:0.62rem;color:#0D0D0D;font-weight:500;padding-left:0.43rem;
  display:flex;align-items:center;background:#0072fd;font-size:0.24rem;
}
.notice /deep/ img{width:0.25rem;height:0.4rem;margin-right:0.1rem;}
.img-banner2{width:100%;position:relative;display:flex;}
.img-banner2 /deep/ img{width:100%;height:0.7rem;float:left;}
.img-banner2 /deep/ span{
  display:flex;width:100%;height:100%;font-size:0.3rem;font-weight:bold;position:absolute;color:#FFF;align-items:center;
  padding-left:0.43rem;
}
.tabs{width:100%;height:0.7rem;background:#292929;display:flex;justify-content:space-between;align-items:center;}
.tabs /deep/ li{display:flex;flex:1;height:0.7rem;font-size:0.28rem;font-weight:500;justify-content:center;align-items:center;}
.tabs /deep/ li.current{background:#0072fd;color:#fff;}
.sysmbol-list{}
.sysmbol-list /deep/ li{display:flex;width:100%;height:1.2rem;padding:0 0.3rem;justify-content:space-between;align-items:center; border-bottom: 1px solid #eee;}
.sysmbol-list /deep/ li > div{display:flex;flex:1;min-width:0;flex-direction:column;font-size:0.24rem;color:#666;font-weight:500;}
.sysmbol-list /deep/ li > div span{display:block;width:96%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.sysmbol-list /deep/ li > div.left font{color:#333;font-size:0.3rem;}
.sysmbol-list /deep/ li > div.left span:first-child,
.sysmbol-list /deep/ li > div.middle span:first-child{margin-bottom:0.1rem;}
.sysmbol-list /deep/ li > div.middle span:first-child{font-size:0.3rem;font-weight:bold;}
.sysmbol-list /deep/ li > div.middle .rise{color:#0072fd;}
.sysmbol-list /deep/ li > div.middle .fall{color:#0072fd;}
.sysmbol-list /deep/ li > div.right{flex:inherit;}
.sysmbol-list /deep/ li > div.right font{
  height:0.54rem;line-height:0.54rem;width:1.8rem;text-align:center;color:#fff;
  font-size:0.3rem;font-weight:bold;
  background:#0072fd;
}
.tab-bg .sysmbol-list{background-color: #fff;}

.tab-bg /deep/ .mint-tab-container-item {
  min-height:-webkit-calc(~"100vh - 7.01rem");
  min-height: calc(~"100vh - 7.01rem");
}
</style>
