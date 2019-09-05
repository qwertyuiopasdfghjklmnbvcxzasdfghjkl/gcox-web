<template>
  <div class="kline">
    <div class="block no-margin">
     <div class="title-container">
      <span class="pointer" :class="{active:showKline}" @click="showKline=true">{{$t('public.kline_title')}}<!-- K线图 --></span> 
      <span class="pointer" :class="{active:!showKline}" @click="showKline=false">{{$t('public.depth_title')}}<!-- 深度图 --></span>
     </div>
    </div>
    <div class="kline-container">
      <div class="transform-container ui-flex" :class="{depth:!showKline}">
        <div class="chart-container ui-flex-1" id="trade-view"></div>
        <div class="kline-mask" v-show="showKlineMask"></div>
        <div ref="depth" class="depth-container ui-flex-1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DepthChart from '@/assets/js/kline.depth'
import numUtils from '@/assets/js/numberUtils'
import loading from '@/components/loading'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    fixedNumber: {
      type: Number
    },
    symbol: {
      type: String,
      default: ''
    },
    baseSymbol: null,
    currentSymbol: null,
    iconUrl: null,
    klineData: {
      type: Array,
      defualt: () => {
        return []
      }
    },
  },
  components: {
    loading
  },
  data () {
    return {
      showKlineMask:true,
      isEntrustShow: false,
      asks: [],
      bids: [],
      showKline:true,
      depthChart: null,
      TVjsApi: null,
      langs: {
        'zh-CN': 'zh',
        'en': 'en',
        'cht': 'zh_TW'
      }
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    depthChange () {
      return {
        asks: this.filterAsks,
        bids: this.filterBids
      }
    },
    filterAsks () {
      let mergeDatas = []
      let temp = {}
      this.asks.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      newDatas.sort((item1, item2) => {
        return numUtils.BN(item1[0]).lt(numUtils.BN(item2[0])) ? -1 : 1
      })
      return newDatas
    },
    filterBids () {
      let mergeDatas = []
      let temp = {}
      this.bids.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      return newDatas
    }
  },
  watch: {
    klineData () {
      this.$nextTick(() => {
        this.TVjsApi && this.TVjsApi.onMessage(this.klineData)
      })
    },
    symbol () {
      if (this.symbol) {
        this.$nextTick(() => {
          this.TVjsApi && this.TVjsApi.switch_market(this.symbol)
        })
      }
    },
    /*getLang (val) {
      this.$nextTick(() => {
        this.TVjsApi && this.TVjsApi.switch_language(this.langs[val])
      })
    },*/
    depthChange () {
      this.depthChart && this.depthChart.drawDepth(this.depthChange)
    },
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'klineEvent',
        fun: this.klineEvent
      })
      this.initDepthChart()
    })
  },
  mounted(){
    this.TVjsApi = new window.TVjsApi();
    this.TVjsApi.init(this.symbol, '30', this.fixedNumber, this.langs[this.getLang])
    document.addEventListener('click', (e)=>{
      if(this.$route.name==='exchange_index' || this.$route.name==='exchange_index2'){
        if(e.target.className==='kline-mask'){
          this.showKlineMask = false
        } else {
          this.showKlineMask = true
        }
      }
    }, false)
  },
  beforeDestroy () {
    this.removeEvents('klineEvent')
    window.removeEventListener('resize', this.resize, false)
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    
    initDepthChart(){
      window.addEventListener('resize', this.resize, false)
      // 深度图
      this.depthChart = DepthChart({
        riseColor: '#1EC563',
        fallColor: '#F1304A',
        fontColor: '#666',
        gridLineColor: '#201F25',
        middleLineColor: '#7B7B7B',
        tpFillStyle: '#F0F0F0',
        tpStrokeStyle: '#CCC',
        tpTextColor: '#333',
        tpTextPriceColor: '#333',
        container: this.$refs.depth
      })
    },
    klineEvent (res) {
      if (res && res.type === 'depth') {
        this.asks = res.asks
        this.bids = res.bids
      }
    },
    toFixed (v1) {
      return numUtils.BN(v1).toFixed(this.fixedNumber)
    },
    resize () {
      this.depthChart && this.depthChart.resize()
    },
  }
}
</script>

<style lang="less" scoped>
.block {
    background: #19181c;
    margin-bottom: 4px;
    padding: 0 10px;
    .no-margin {
        margin: 0;
    }
}
.kline-container {
  overflow: hidden;
}
.transform-container {
    width: 200%;
    height: inherit;
    transition: .3s;
    position: relative;
    overflow: hidden;
    &.depth {
      margin-left: -100%;
    }
}
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border-bottom: 2px solid transparent;
        &.active {
            color: #00a0e9;
            border-bottom: 2px solid #00a0e9;
        }
        &+span {
            margin-left: 40px;
        }
    }
}
.chart-container, .depth-container {
    background: #19181c;
    height: 470px;
    margin-bottom: 4px;
    position: relative;
}
.kline-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom:0;
  z-index: 1;
}

</style>

