<template>
    <div class="block currencyInfo-warp">
      <div class="currencyInfo-content">
        <div class="header">
          <div class="currency-logo">
            <span class="logo"><img :src="iconUrl"></span><span class="name">{{currentSymbol}}</span><span class="cen-recommend-flag"><i class="co-hot" v-show="isRecommond"></i></span>
          </div>
          <div class="title">{{$t(`symbol.${currentSymbol}`)}}({{currentSymbol}})</div>
        </div>
        <div class="info">
          <ul class="info-tiem">
            <li class="item">
              <div class="title">{{$t('public.introduction')}}<!--币种介绍--></div>
              <div class="body">
                <div v-html="$t(`symbol_desc.${currentSymbol}`)"></div>
              </div>
            </li>
            <li class="item" v-show="false">
              <div class="title"> {{$t('exchange.issuing_date')}}<!-- 发行日期 --> </div>
              <div class="body"> <span> {{new Date(Number(symbolInfo.issueTime)).format('yyyy-MM-dd')}} </span> </div>
            </li>
            <li class="item">
              <div class="title"> {{$t('public.max_supply')}}<!-- 发行总量 --> </div>
              <div class="body"> <span> {{totalIssuance}} {{currentSymbol}} </span> </div>
            </li>
            <li class="item">
              <div class="title"> {{$t('public.circulating_supply')}}<!-- 流通总量 --> </div>
              <div class="body"> <span> {{totalCirculation}} {{currentSymbol}} </span> </div>
            </li>
            <li class="item">
              <div class="title"> {{$t('public.issue_price')}}<!--发行价格--> </div>
              <div class="body"> <span> {{getCoinSign}} {{issuePrice}} </span> </div>
            </li>
            <li class="item">
              <div class="title"> {{$t('exchange.white_paper')}}<!-- 白皮书 --> </div>
              <div class="body"> <a :title="symbolInfo.whitePaperUrl" :href="symbolInfo.whitePaperUrl" target="_blank">{{symbolInfo.whitePaperUrl}}</a> </div>
            </li>
            <li class="item">
              <div class="title"> {{$t('exchange.official_website')}}<!-- 官网 --> </div>
              <div class="body"> <a :title="symbolInfo.officialWebsite" :href="symbolInfo.officialWebsite" target="_blank">{{symbolInfo.officialWebsite}}</a> </div>
            </li>
            <li class="item">
              <div class="title"> {{$t('exchange.block_query')}}<!-- 区块查询 --> </div>
              <div class="body"> <a :title="symbolInfo.blockQueryUrl" :href="symbolInfo.blockQueryUrl" target="_blank">{{symbolInfo.blockQueryUrl}}</a> </div>
              </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import valuation from '@/components/valuation'
export default {
  props: ['baseSymbol', 'currentSymbol', 'symbol', 'iconUrl'],
  components: {
    valuation
  },
  data () {
    return {
      symbolInfo: {}
    }
  },
  computed: {
    ...mapGetters(['getCoinSign', 'getUSDCNY', 'getUsdRate', 'getLang']),

    symbolDescription () {
      return this.$t(`symbol_desc.${this.currentSymbol}`)
    },
    totalIssuance () { // 发行总量
      if (this.symbolInfo && this.symbolInfo.totalIssuance) {
        return this.symbolInfo.totalIssuance.toString().toMoney()
      } else {
        return '--'
      }
    },
    totalCirculation () { // 流通总量
      if (this.symbolInfo && this.symbolInfo.totalCirculation) {
        return this.symbolInfo.totalCirculation.toString().toMoney()
      } else {
        return '--'
      }
    },
    issuePrice () { // 发行价格
      if (this.symbolInfo && this.symbolInfo.issuePrice) {
        if (this.getLang === 'en') {
          return numUtils.mul(this.symbolInfo.issuePrice.toString(), this.getUsdRate).toFixed(2).toMoney()
        } else {
          return parseFloat(this.symbolInfo.issuePrice).toFixed(2).toString().toMoney()
        }
      } else {
        return '--'
      }
    }
  },
  watch: {
    currentSymbol () {
      this.getSymbolIntroduce()
    },
    symbol(){
      this.isRecommond()
    },

  },
  created () {
    this.getSymbolIntroduce()
  },
  methods: {
    isRecommond(){
      let rst = false
       marketApi.marketListCom(1, (res) => {
        res = res.filter(item=>{
          return item.market===`${this.currentSymbol}${this.baseSymbol}`
        })
        rst = res.length>0?true:false
        return rst
       },()=>{
        return rst
       })
    },
    getSymbolIntroduce () {
      marketApi.getSymbolIntroduce(this.currentSymbol, (res) => {
        this.symbolInfo = res || {}
      })
    },
  }
}
</script>

<style lang="less" scoped>
.co-hot {
    position: relative;
    left: -1px;
    &:after {
        content: " ";
        width: 14px;
        height: 14px;
        display: inline-block;
        background: url('../../assets/img/co-hot.svg') no-repeat 0;
        background-size: auto 14px;
        position: relative;
        top: 1px;
    }
}
.currencyInfo-warp {
  min-height: 250px;
  .currencyInfo-content {
      font-size: 12px;
      color: #f1f1f2;
      line-height: 1.5;
      width: 96%;
      margin-left: auto;
      margin-right: auto;
      overflow: hidden;
      .header {
          padding-top: 15px;
          border-bottom: 1px solid #242328;
          padding-bottom: 10px;
          .currency-logo {
              height: 35px;
              line-height: 35px;
              font-size: 18px;
          }
          .logo img {
              display: inline-block;
              height: 26px;
              position: relative;
              top: 6px;
              margin-right: 10px;
          }
          .name {
              padding-right: 5px;
          }
          .title {
              padding-top: 10px;
          }
      }
      .info {
          padding-top: 10px;
          color: 12px;
          .item {
              margin-top: 10px;
              border-bottom: 1px solid #242328;
              padding-bottom: 10px;
              .title {
                  color: #979799;
                  padding-bottom: 5px;
              }
              a {
                  display: block;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  color: #4a90e2;
              }
          }
      }
  }
}
</style>
