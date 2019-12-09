<template>
  <div class="container w1200">
    <div class="market-container">
      <div class="market-box">
        <ul class="tab">
          <li :class="{active:current==='favor'}" @click="switchTab('favor')">{{$t('home.home_favorites')}}
            <!-- 自选 --></li>
          <li :class="{active:current==='all'}" @click="switchTab('all')">{{$t('exchange.all_market')}}
            <!-- 全部行情 --></li>
          <li :class="{active:current==='rise'}" @click="switchTab('rise')">{{$t('public0.public204')}}<!-- 涨幅榜 --></li>
          <li :class="{active:current==='fall'}" @click="switchTab('fall')">{{$t('public0.public205')}}<!-- 跌幅榜 --></li>
          <li :class="{active:current==='new'}" @click="switchTab('new')">{{$t('exchange.new_token_board')}}
            <!-- 新币榜 --></li>
        </ul>
        <div class="market-wrap">
          <div class="symbolPairs" v-show="current==='all'">
            <span class="efont" v-for="item in symbolList" :class="{active:item===baseSymbol}"
                  @click="switchBaseSymbolTab(item)">{{item}}</span>
          </div>
          <table>
            <thead>
            <tr>
              <th width="16%" @click="sortMarket('market')">{{$t('exchange.trade_pair')}}<!-- 交易对 -->
                <span class="caret-wrapper" :class="{active:sortActive==='market'}">
						    		<i class="sort-caret ascending" :class="{active:sort==='asc'}"></i>
						    		<i class="sort-caret descending" :class="{active:sort==='desc'}"></i>
						    	</span>
              </th>
              <th width="18%" @click="sortMarket('lastPrice')">{{$t('exchange.exchange_last_price')}}<!-- 最新价 -->
                <span class="caret-wrapper" :class="{active:sortActive==='lastPrice'}">
						    		<i class="sort-caret ascending" :class="{active:sort==='asc'}"></i>
						    		<i class="sort-caret descending" :class="{active:sort==='desc'}"></i>
						    	</span>
              </th>
              <th width="18%" @click="sortMarket('lowPrice24h')">{{$t('home.home_low_24h')}}<!-- 最低价 -->
                <span class="caret-wrapper" :class="{active:sortActive==='lowPrice24h'}">
						    		<i class="sort-caret ascending" :class="{active:sort==='asc'}"></i>
						    		<i class="sort-caret descending" :class="{active:sort==='desc'}"></i>
						    	</span>
              </th>
              <th width="18%" @click="sortMarket('highPrice24h')">{{$t('exchange.exchange_high')}}<!-- 最高价 -->
                <span class="caret-wrapper" :class="{active:sortActive==='highPrice24h'}">
						    		<i class="sort-caret ascending" :class="{active:sort==='asc'}"></i>
						    		<i class="sort-caret descending" :class="{active:sort==='desc'}"></i>
						    	</span>
              </th>
              <th width="18%" @click="sortMarket('dealAmount')">{{$t('home.home_volume_24h')}}<!-- 成交量 -->
                <span class="caret-wrapper" :class="{active:sortActive==='dealAmount'}">
						    		<i class="sort-caret ascending" :class="{active:sort==='asc'}"></i>
						    		<i class="sort-caret descending" :class="{active:sort==='desc'}"></i>
						    	</span>
              </th>
              <th width="12%" @click="sortMarket('change24h')" class="text-right">{{$t('exchange.up_and_down')}}
                <!-- 涨跌幅 -->
                <span class="caret-wrapper" :class="{active:sortActive==='change24h'}">
						    		<i class="sort-caret ascending" :class="{active:sort==='asc'}"></i>
						    		<i class="sort-caret descending" :class="{active:sort==='desc'}"></i>
						    	</span>
              </th>
            </tr>
            </thead>
            <tbody>
            <router-link v-for="item in curProducts"
                         :to="{name: 'exchange_index',params:{symbol:item.currencySymbol+'_'+item.baseSymbol}}"
                         tag='tr' v-if="(item.visible&&Number(item.visible)) || !item.visible">
              <td class="icon">
                <span @click.stop="addOrDelFavor(item)"><img src="../assets/img/star_blue.png"
                                                             v-if="item.collection || (!getApiToken && favorSymbol.includes(item.market))"><img
                  src="../assets/img/star_gray.png" v-else></span>
                <span>{{item.currencySymbol}}</span>
                <span class="f-c-gray">/ {{item.baseSymbol}}</span>
              </td>
              <td><span>{{toFixed(item.lastPrice, item.accuracy)}}</span></td>
              <td><span>{{toFixed(item.lowPrice24h, item.accuracy)}}</span></td>
              <td><span>{{toFixed(item.highPrice24h, item.accuracy)}}</span></td>
              <td><span>{{toFixed(item.dealAmount, 2).toMoney()}}</span></td>
              <td><span v-html="percent(item)"></span></td>
            </router-link>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import KLineWebSocket from '@/assets/js/websocket'

  let favorSymbol = JSON.parse(localStorage.getItem('favorSymbol') || '[]')
  export default {
    data () {
      return {
        fixedNumber: 8,
        current: 'all',
        baseSymbol: 'BTC',
        sortActive: '',
        sort: 'desc',
        favorSymbol: favorSymbol,
        socket: null
      }
    },
    computed: {
      ...mapGetters(['getMarketList', 'getApiToken']),
      symbolList () {
        return [...new Set(this.getMarketList.map(item => {
          return item.baseSymbol
        }))].sort()
      },
      curProducts () {
        let datas = this.getMarketList.sort((item1, item2) => {
          if (this.sortActive === 'lastPrice') {
            let m1 = numUtils.BN(item1.lastPrice)
            let m2 = numUtils.BN(item2.lastPrice)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'change24h') {
            let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
            let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'dealAmount') {
            let m1 = numUtils.BN(item1.dealAmount)
            let m2 = numUtils.BN(item2.dealAmount)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'highPrice24h') {
            let m1 = numUtils.BN(item1.highPrice24h)
            let m2 = numUtils.BN(item2.highPrice24h)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'lowPrice24h') {
            let m1 = numUtils.BN(item1.lowPrice24h)
            let m2 = numUtils.BN(item2.lowPrice24h)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'createdAt') {
            let m1 = numUtils.BN(item1.createdAt)
            let m2 = numUtils.BN(item2.createdAt)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'market') {
            let m1 = item1.market
            let m2 = item2.market
            return this.sort === 'asc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
          } else {
            let m1 = numUtils.BN(item1.idx)
            let m2 = numUtils.BN(item2.idx)
            return m1.gt(m2) ? -1 : 1
          }
        })

        if (this.current === 'favor') {
          if (this.getApiToken) {
            datas = datas.filter(item => {
              return item.collection
            })
          } else {
            datas = datas.filter(item => {
              return this.favorSymbol.includes(item.market)
            })
          }
        } else if (this.current === 'all') {
          datas = datas.filter(item => {
            return item.baseSymbol === this.baseSymbol
          })
        }
        return datas
      },
    },
    watch: {
      getApiToken () {
        this.socket && this.socket.changeLogin()
      }
    },
    created () {
      this.queryMarketList()
      this.socket = KLineWebSocket({
        subscribe: ['market'],
        callback: (res) => {
          if (res.dataType === 'markets') {
            this.setMarketList(this.mergeMarkets(res.data))
          }
        },
        onClose: () => {
          this.closeMainLoading = true
        }
      })
    },
    methods: {
      ...mapActions(['setMarketList']),
      mergeMarkets (newData) {
        let oldData = this.getMarketList, tempObj = {}, collectionObj = {}
        oldData.forEach((item) => {
          tempObj[item.market] = item.iconBase64
          collectionObj[item.market] = item.collection
        })
        newData.forEach((item) => {
          item.iconBase64 = tempObj[item.market]
          item.collection = collectionObj[item.market]
          if(window.marketOrder){
              item.idx = window.marketOrder[item.market]
              item.visible = window.marketVisible[item.market]
          }
        })
        return newData
      },
      addOrDelFavor (item) {
        if (this.getApiToken) {
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
          if (this.favorSymbol.includes(item.market)) {
            let index = this.favorSymbol.indexOf(item.market)
            this.favorSymbol.splice(index, 1)
          } else {
            this.favorSymbol.push(item.market)
          }
          favorSymbol = this.favorSymbol
          localStorage.setItem('favorSymbol', JSON.stringify(this.favorSymbol))
        }
      },
      switchTab (target) {
        this.current = target
        if (this.current === 'rise') {
          this.sortActive = 'change24h'
          this.sort = 'desc'
        } else if (this.current === 'fall') {
          this.sortActive = 'change24h'
          this.sort = 'asc'
        } else if (this.current === 'new') {
          this.sortActive = 'createdAt'
          this.sort = 'asc'
        } else {
          this.sortActive = ''
          this.sort = 'asc'
        }
      },
      switchBaseSymbolTab (target) {
        this.baseSymbol = target
      },
      sortMarket (active) {
        if (active === this.sortActive) {
          this.sort = this.sort === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortActive = active
          this.sort = 'asc'
        }
      },
      queryMarketList () { // 获取所有市场数据
        if (!this.getMarketList.length) {
          marketApi.marketList((res) => {

            this.setMarketList(res || [])
          })
        }
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
    },
    beforeDestroy () {
      this.socket && this.socket.close()
    }

  }
</script>

<style lang="less" scoped="">
  .market-container {
    padding: 50px 0 30px;
  }

  .market-box {
    min-height: 600px;
    background: #19181d;
    padding: 0 15px;

    .tab {
      font-size: 15px;

      > li {
        display: inline-block;
        padding: 20px 0;
        position: relative;
        cursor: pointer;
        top: 2px;

        & + li {
          margin-left: 50px;
        }

        &.active {
          color: #00a0e9;
        }
      }
    }

    .symbolPairs {
      padding-bottom: 15px;

      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 20px;
        padding: 0 5px;
        cursor: pointer;
        font-size: 11px;
        -ms-transform: scale(.9);
        transform: scale(.9);

        &.active {
          color: #00a0e9;
          border-bottom: 2px solid #00a0e9;
        }
      }
    }

    table {
      width: 100%;
      font-size: 14px;
      border-collapse: collapse;

      thead {
        border-top: 1px solid #313239;
        border-bottom: 1px solid #313239;
        box-shadow: 0 3px 3px 0 rgba(11, 11, 13, .35);
        font-size: 12px;

        th {
          cursor: pointer;
          height: 40px;
          line-height: 40px;
          color: #636363;
          font-weight: 400;
          text-align: left;
          padding: 0 5px;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #313239;
          cursor: pointer;

          &:hover {
            background-color: #222125;
          }

          &:last-of-type {
            border-bottom: none;
          }

          td {
            height: 48px;
            line-height: 48px;
            color: #f1f1f2;
            text-align: left;
            padding: 0 5px;

            &:last-of-type {
              text-align: right;
            }

            &.icon {
              background-size: 20px 20px;
              background-position: 5px;
              background-repeat: no-repeat;

              img {
                height: 14px;
                padding-right: 3px;
              }
            }
          }
        }
      }
    }

    .caret-wrapper {
      display: inline-flex;
      flex-direction: column;
      vertical-align: middle;
      position: relative;
      height: 20px;
      width: 10px;

      .sort-caret {
        height: 0;
        width: 0;
        border: 4px solid transparent;
        cursor: pointer;

        &.ascending {
          border-bottom-color: #646464;
          position: absolute;
          top: -1px;
          cursor: pointer;
        }

        &.descending {
          border-top-color: #646464;
          position: absolute;
          bottom: -1px;
          cursor: pointer;
        }
      }

      &.active .active.sort-caret.ascending {
        border-bottom-color: #d8d8da;
      }

      &.active .active.sort-caret.descending {
        border-top-color: #d8d8da;
      }
    }
  }
</style>
