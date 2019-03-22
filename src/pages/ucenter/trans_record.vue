<template>
  <div class="page">
    <cp-top-back :showMenu="false">
      <h1>{{$t('trade_record.exchange_record')}}<!--币币成交记录--></h1>
    </cp-top-back>

    <div class="page-main content">
      <div class="record-box">
        <h3 v-if="record.length > 0">
          <span class="market">{{$t('trade_record.trade_record_type')}}/{{$t('trade_record.trade_record_market')}}<!--方向/市场--></span>
          <span class="price">{{$t('exchange.exchange_Transaction_price')}}<!--成交均价--></span>
          <span class="vol">{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></span>
        </h3>
        <mt-loadmore
          ref="recordLoadmore"
          :style="{height: record.length === 0 ? 'calc(100vh - 0.8rem)' : 'calc(100vh - 1.6rem)'}"
          :autoFill="false"
          :topDistance="40"
          infinite-scroll-immediate-check="false"
          infinite-scroll-distance="80"
          infinite-scroll-disabled="recordBottomDisabled"
          v-infinite-scroll="loadMore"
        >
          <template v-if="record.length > 0">
            <ul ref="recordList">
              <li class="item" v-for="(item, index) in record" @click="goDetail(item)">
                <div>
                  <span class="market">
                    <span v-if="item.direction===1">{{$t('exchange.exchange_buys')}}</span><span class="sell" v-else>{{$t('exchange.exchange_sells')}}</span> <template v-if="item.direction===1">{{item.toSymbol}}/{{item.fromSymbol}}</template><template v-else>{{item.fromSymbol}}/{{item.toSymbol}}</template>
                    <p>{{new Date(Number(item.createdAt)).format()}}</p>
                  </span>
                  <span class="price">
                    {{getPrice(item.averagePrice)}}
                    <p><template v-if="item.direction===1">{{item.fromSymbol}}</template><template v-else>{{item.toSymbol}}</template></p>
                  </span>
                  <span class="vol">
                    {{toFixed(item.finishedAmount)}}
                    <p><template v-if="item.direction===1">{{item.toSymbol}}</template><template v-else>{{item.fromSymbol}}</template></p>
                  </span>
                </div>
              </li>
            </ul>
            <loading :bgColor="record.length % 2 === 0 ? '#0c151d' : '#0d0d0d'" v-if="recordBottomLoading"/>
            <noMoreData :bgColor="record.length % 2 === 0 ? '#0c151d' : '#0d0d0d'" v-if="!recordBottomLoading && noMoreRecordHistory"/>
          </template>
          <noData v-if="record.length === 0"/>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
import loading from '@/components/common/loading'
import noData from '@/components/common/noData'
import noMoreData from '@/components/common/noMoreData'
import market from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
export default {
  name: 'trans-record',
  components: {
    loading,
    noData,
    noMoreData
  },
  data(){
    return {
      fixedNumber: 8,
      record: [], // 交易记录
      recordBottomDisabled: false, // 交易记录滚动加载禁用状态
      recordBottomLoading: false, // 交易记录滚动加载状态
      noMoreRecordHistory: false, // 是否没有更多交易记录

      paramRecord: {
        history: '1', // 0 当前，1 历史
        start: '', // 开始时间
        end: '', // 结束时间
        market: '', // 市场
        direction: '', // 0 全部 1买 2卖
        hideCancelled: 0, // 1是, 0否显示
        tp: 1, // 0 委托记录 1 币币成交记录
        current: 1, // 当前第几页 默认为"" 为第一页
        limit: 50 // limit每页记录数，“”默认20条
      },
    }
  },
  watch:{
    'paramRecord.current' (val) {
      if (val !== 1 && !this.noMoreRecordHistory) {
        this.recordBottomDisabled = true
        this.recordBottomLoading = true
        this.getCoinsHistory()
      }
    }
  },
  created(){
    this.getCoinsHistory()
  },
  methods:{
    goDetail(data){
      this.$router.push({name:'trans-detail', params:{id:data.orderBookId, detail:data}})
    },
    loadMore () { // 向下滚动获取更多消息
      this.paramRecord.current++
    },
    getCoinsHistory () { // 委托当前记录
      market.getCurrentEntrustByParams(this.paramRecord, (res) => {
        this.recordBottomDisabled = false
        this.recordBottomLoading = false
        this.record = this.record.concat(res.data)
        if(this.record.length>=res.total){
          this.noMoreRecordHistory = true
        }
      }, (msg) => {
        this.recordBottomDisabled = false
        this.recordBottomLoading = false
        console.error(msg)
      })
    },
    getPrice (price) { // 价格
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    }
  }
}
</script>

<style lang="less" scoped>
.record-box h3,
.record-box ul li{padding: .1rem .2rem;overflow: auto; font-size: 0.24rem;}
.record-box h3{padding-top: .2rem;background-color: #0c151d;}
.record-box ul li:nth-of-type(odd){background-color: #0c151d;}
.record-box ul li:nth-of-type(even){background-color: #101e2b;}
.record-box ul li div{overflow: auto;}
.record-box h3 span,
.record-box ul li span{float: left; font-size: .24rem;line-height: .5rem;white-space: nowrap;text-overflow: ellipsis;overflow-x: hidden;}
.record-box h3 span{color: #8089A3;}
.record-box h3 span.market,
.record-box ul li span.market{width: 45%;}
.record-box h3 span.price,
.record-box ul li span.price{width: 25%;}
.record-box h3 span.vol,
.record-box ul li span.vol{width: 30%; text-align: right;}
.record-box ul li span.market span{color: #00CC66; font-weight: bold; margin-right: 0.2rem;}
.record-box ul li span.market span.sell{color: #FF0033;}
</style>
