<template>
  <div class="digassets">
    <h3>{{$t('usercontent.user58')}}<!--我的数字资产-->
      <template v-if="pandectShow">
        <span class="ml80 pointer" :class="{'f-c-main':accountType===1}" @click="accountType=1">{{$t('account.trading_wallet')}}<!-- 交易钱包 --></span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <span class="pointer" :class="{'f-c-main':accountType===2}" @click="accountType=2">{{$t('account.staking_wallet')}}<!-- 锁仓钱包 --></span>
      </template>
    </h3>
    <div class="hcontainer">
      <div class="chargeWithdraw" v-if="!showLoaing">
        <div class="total">
          {{$t('exchange.exchange_valuation')}}：<!--总当前估值：-->
          <span>{{String(getBTCValuation).toMoney()}} BTC</span>
          <!--≈ {{getCoinSign}} {{USDCNY}}-->
        </div>
        <div class="balance_search" v-if="pandectShow">

          <div class="f-fr">
            <p>{{$t('usercontent.user68')}}</p>
            <div>
              <button @click="address()">{{$t('usercontent.user69')}} <!--地址管理--></button>
            </div>
            <div class="icon-checkbox f-fl" @click.stop="hideZero=!hideZero">
              <em :class="[hideZero?'icon-checkbox-checked':'icon-checkbox-unchecked']"></em>
              <label class="ng-binding">
                {{$t('account.estimated_value_hide')}}<!--隐藏-->&nbsp;0&nbsp;{{$t('account.estimated_value_balances')}}
                <!--金额-->
              </label>
            </div>

            <div class="search_input">
              <i class="icon-search"></i>
              <input type="text" v-model="filterTitle" placeholder="BTC"/>
            </div>
          </div>
        </div>
        <!--<div class="acount_tab">-->
        <!--<div :class="{'active': active === 'main'}" @click="switchHeadTab('main')">{{$t('public.main_account')}}</div>-->
        <!--<div :class="{'active': active === 'vote'}" @click="switchHeadTab('vote')">-->
        <!--{{$t('public.vote_miner_account')}}-->
        <!--</div>-->
        <!--<span @click="tansferDialog">{{$t('vote_mining.funds_transfer')}}</span>-->
        <!--</div>-->
        <div v-show="accountType===1">
          <ul class="accountInfo-lists header" :class="{pandect:pandectShow}">
          <li class="th">
            <div class="items">
              <div class="coin ng-binding" @click="sortAssets('symbol')">
                {{$t('account.estimated_value_coin')}}<!--币种-->
                <em v-if="sortActive==='symbol'">
                  <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                  <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                </em>
              </div>
              <div class="f-right ng-binding" @click="sortAssets('total')">
                {{$t('account.estimated_value_total')}}<!--总金额-->
                <em v-if="sortActive==='total'">
                  <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                  <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                </em>
              </div>
              <div class="f-right ng-binding" @click="sortAssets('available')">
                {{$t('account.estimated_value_available')}}<!--可用余额-->
                <em v-if="sortActive==='available'">
                  <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                  <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                </em>
              </div>
              <div class="useable f-right " @click="sortAssets('frozen')">
                {{$t('public0.public34')}}<!--冻结金额-->
                <em v-if="sortActive==='frozen'">
                  <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                  <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                </em>
              </div>
              <div class="useable f-right " v-if="!pandectShow">
                {{$t('account.staked_balanc')}}<!--当前锁仓-->
              </div>
              <div class="opreat f-right ng-binding" v-if="accountType===1">
                {{$t('otc_exchange.otc_exchange_operating')}}<!--操作-->
                </div>
              </div>
            </li>
          </ul>
          <div class="flex">
            <ul class="accountInfo-lists" :class="{pandect:pandectShow}">
              <li v-for="(data, index) in filterDatas()" :key="data.accountId">
                <div class="items">
                  <div class="coin ">{{data.symbol}}</div>
                  <div class="f-right " :title="toFixed(data.totalBalance)|removeEndZero" v-if="pandectShow">{{toFixed(data.totalBalance)|removeEndZero}}</div>
                  <div class="f-right " :title="toFixed(numUtils.add(data.totalBalance, getStakeBalance(data.accountName)))|removeEndZero" v-else>{{toFixed(numUtils.add(data.totalBalance, getStakeBalance(data.accountName)))|removeEndZero}}</div>
                  <div class="f-right " :title="toFixed(data.availableBalance)|removeEndZero">{{toFixed(data.availableBalance)|removeEndZero}}</div>
                  <div class="useable f-right " :title="toFixed(data.frozenBalance)|removeEndZero">{{toFixed(data.frozenBalance)|removeEndZero}}</div>
                  <div class="useable f-right " v-if="!pandectShow" :title="toFixed(getStakeBalance(data.accountName))|removeEndZero">{{toFixed(getStakeBalance(data.accountName))|removeEndZero}}</div>
                  <moreinfo class="action"
                            :googleState="getUserInfo.googleAuthEnable"
                            :verifyState="getUserInfo.kycState"
                            :symbol="data.symbol"
                            :allData="filterDatas()"
                            :item="data"/>
                </div>
              </li>
            </ul>

            <div class="echart" v-if="!pandectShow">
              <div>
                <v-chart :options="polar"/>
              </div>
            </div>
          </div>
        </div>
        <div v-show="accountType===2"  >
          <ul class="accountInfo-lists header" v-if="pandectShow" :class="{pandect:pandectShow}">
            <li class="th">
              <div class="items">
                <div class="coin " @click="sortAssets('symbol')">
                  {{$t('account.estimated_value_coin')}}<!--币种-->
                  <em v-if="sortActive==='symbol'">
                    <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                    <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                  </em>
                </div>
                <!--<div class="fullName " @click="sortAssets('fullName')">-->
                <!--{{$t('account.estimated_value_name')}}&lt;!&ndash;全称&ndash;&gt;-->
                <!--<em v-if="sortActive==='fullName'">-->
                <!--<i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>-->
                <!--<i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>-->
                <!--</em>-->
                <!--</div>-->
                <div class="f-right " @click="sortAssets('total')">
                  {{$t('account.total_staked')}}<!--总锁仓-->
                  <em v-if="sortActive==='total'">
                    <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                    <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                  </em>
                </div>
                <div class="useable f-right " @click="sortAssets('frozen')">
                  {{$t('account.staked_balanc')}}<!--当前锁仓-->
                  <em v-if="sortActive==='available'">
                    <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                    <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                  </em>
                </div>
                <div class="useable f-right " @click="sortAssets('available')">
                  {{$t('account.released_to_date')}}<!--已解锁-->
                  <em v-if="sortActive==='available'">
                    <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                    <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                  </em>
                </div>
                <div class="opreat f-right ">
                  {{$t('otc_exchange.otc_exchange_operating')}}<!--操作-->
                </div>
              </div>
            </li>
          </ul>
          <div class="flex">
            <ul class="accountInfo-lists" :class="{pandect:pandectShow}">
              <li v-for="(data, index) in filterDatas()" :key="data.accountId">
                <div class="items">
                  <div class="coin ">{{data.symbol}}</div>
                  <div class="f-right ">{{toFixed(data.totalBalance)|removeEndZero}}</div>
                  <div class="useable f-right ">{{toFixed(data.frozenBalance)|removeEndZero}}</div>
                  <div class="useable f-right ">{{toFixed(data.availableBalance)|removeEndZero}}</div>
                  <div class="ui-flex-1 text-center">
                    <button type="button" class="mint-btn action" :disabled="!data.openStaking" @click="showStake(data.accountName)">{{$t('account.stake')}}<!-- Stake --></button>
                  </div>
                </div>
                  
              </li>
            </ul>
          </div>
        </div>
        
      </div>
      <loading v-if="showLoaing"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import numUtils from '@/assets/js/numberUtils'
  import userUtils from '@/api/wallet'
  import utils from '@/assets/js/utils'
  import userApi from '@/api/individual'
  import moreinfo from '@/public/account/moreinfo'
  import stakeDialog from '@/public/account/stakeDialog'
  import loading from '@/components/loading'

  export default {
    props: ['pandect'],
    data () {
      return {
        numUtils:numUtils,
        sortActive: null,
        sort: null,
        showLoaing: true,
        hideZero: false,
        filterTitle: '',
        googleState: 0,
        verifyState: 0,
        mobileState: 0,
        myAssets: [],
        active: 'main',
        accountType: 1,
        pandectShow: true,
        echart: null,
        polar: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            show: true,
            data: [],
            width: '190px',
            top: '200px',
            left: 0,
            textStyle: {
              color: '#ffffff'
            }
          },
          series: [
            {
              name: '数字资产',
              type: 'pie',
              radius: ['65px', '85px'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              center: ['100px', '85px'],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },
    components: {
      moreinfo,
      loading
    },
    computed: {
      ...mapGetters(['getBTCValuation', 'getUSDCNY', 'getCoinSign']),
      USDCNY () {
        return numUtils.mul(this.getBTCValuation, this.getUSDCNY).toFixed(2).toMoney()
      },
    },
    watch: {
      filterTitle (newVal, oldVal) {
        if (!newVal) {
          return
        }
        if (/[^0-9a-z]/i.test(newVal)) {
          this.$nextTick(() => {
            this.filterTitle = oldVal
          })
        }
      },
      echart (data) {
        let name = []
        let arr = []
        data.filter(res => {
          name.push(res.symbol)
          let obj = {}
          obj.name = res.symbol
          obj.value = res.availableBalance
          arr.push(obj)
        })
        this.polar.legend.data = name
        this.polar.series[0].data = arr
      }
    },
    created () {
      if (this.pandect) {
        this.hideZero = this.pandect.hiddenZore
        this.pandectShow = false
      }
      this.getList()
    },
    methods: {
      ...mapGetters(['getUserInfo', 'getLang']),
      showStake(accountName){
        let data = this.myAssets.filter(item=>{ return item.accountName===accountName && item.type===1})
        if(!data[0].openStaking){
          return
        }
        utils.setDialog(stakeDialog, {
          data:data[0],
          backClose:true,
          okCallback: () => {
            this.getList()
          }
        })
      },
      getStakeBalance(accountName){
        let data = this.myAssets.filter(item=>{ return item.accountName===accountName && item.type===2})
        return data[0].frozenBalance
      },
      filterDatas () {
        let ndatas = this.myAssets.filter((item) => {
          if (this.hideZero) {
            if (this.filterTitle) {
              return (item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 || item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1) && numUtils.BN(item.availableBalance).toString() !== numUtils.BN(0).toString()
            }
            return numUtils.BN(item.availableBalance).toString() !== numUtils.BN(0).toString()
          } else {
            if (this.filterTitle) {
              return item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 || item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1
            }
            return true
          }
        })
        ndatas = ndatas.filter(item => {
          return item.type === this.accountType
        })
        ndatas.sort((item1, item2) => {
          if (this.sortActive === 'symbol') {
            let m1 = item1.symbol
            let m2 = item2.symbol
            return this.sort === 'asc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
          } else if (this.sortActive === 'fullName') {
            let m1 = this.$t(`symbol.${item1.symbol}`)
            let m2 = this.$t(`symbol.${item2.symbol}`)
            return this.sort === 'desc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
          } else if (this.sortActive === 'available') {
            let m1 = numUtils.BN(item1.availableBalance)
            let m2 = numUtils.BN(item2.availableBalance)
            if (m1.equals(m2)) {
              return item1.idx < item2.idx ? -1 : 1
            } else {
              return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
            }
          } else if (this.sortActive === 'frozen') {
            let m1 = numUtils.BN(item1.frozenBalance)
            let m2 = numUtils.BN(item2.frozenBalance)
            if (m1.equals(m2)) {
              return item1.idx < item2.idx ? -1 : 1
            } else {
              return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
            }
          } else {
            let m1 = numUtils.BN(item1.totalBalance)
            let m2 = numUtils.BN(item2.totalBalance)
            if (m1.equals(m2)) {
              return item1.idx < item2.idx ? -1 : 1
            } else {
              return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
            }
          }
        })
        this.echart = ndatas
        return ndatas
      },
      sortAssets (active) {
        if (active === this.sortActive) {
          this.sort = this.sort === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortActive = active
          this.sort = 'asc'
        }
      },
      switchHeadTab (tab) {
        this.active = tab
        if (tab == 'main') {
          this.accountType = 1
        } else {
          this.accountType = 2
        }
      },
      switchTab (tab) {
        this.$emit('switchTab', tab)
      },
      getList () {
        this.showLoaing = true
        userUtils.myAssets({}, (data) => {
          data.forEach((item) => {
            item.show = false
            item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toFixed(8)
          })
          this.myAssets = data
          this.showLoaing = false
        }, (data, msg) => {
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          this.showLoaing = false
        })
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed).toMoney()
      },
      address () {
        if (this.getUserInfo().googleAuthEnable !== 1) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35')})
          return
        }
        if (this.getUserInfo().kycState !== 1) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36')})
          return
        }
        this.$router.push('/account/addressManage')
      }
    }
  }
</script>

<style scoped lang="less">
  .icon-checkbox em {
    color: #4a4a4a;
    cursor: pointer;
  }

  .icon-checkbox:hover em {
    color: #00a0e9;
  }

  .icon-checkbox label {
    cursor: pointer;
  }

  .digassets {
    background: rgba(27, 26, 31, 0.9);
    color: #ffffff;
    padding: 0 18px 16px;
    font-size: 12px;
  }

  .digassets h3 {
    padding: 14px 0;
    font-size: 14px;
    font-weight: 400;
  }

  .total {
    margin-bottom: 18px;
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid #312e45;
    padding: 10px 0 20px 0;

    span {
      font-size: 20px;
      margin-left: 10px;
    }

  }

  button {
    cursor: pointer;
    font-size: 12px;
    color: #f1f1f2;
    background-color: #2e2c3c;
    border: 1px solid #312e45;
    text-align: center;
    box-sizing: initial;
    line-height: 28px;
    margin-right: 10px;
    height: 30px;
    padding: 0 10px;
  }

  button:hover {
    border: 1px solid #4d4a64;
    background-color: #4d4a64;
  }

  .balance_search {
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*position: relative;*/
    /*padding-left: 20px;*/
    /*padding-right: 20px;*/
    /*border-bottom: 1px solid #e7e7e7;*/
    height: 60px;
  }

  .balance_search .total {
    height: 65px;
    line-height: 65px;
    font-size: 16px;
  }

  .balance_search i {
    position: absolute;
    right: 10px;
    top: 8px;
    color: #4a4a4a;
    font-size: 20px;
  }

  .balance_search input {
    line-height: 28px;
    height: 28px;
    width: 100%;
    border: 0;
    background-color: transparent;
    color: #f1f1f2;
    padding-left: 5px;
  }

  .balance_search .checkbox {
    position: relative;
    margin-left: 24px;
    color: #d6dff9;
  }

  .balance_search .checkbox label {
    color: #d6dff9;
    margin-left: 8px;
  }

  .balance_search .checkbox em {
    display: inline-block;
    width: 14px;
    height: 14px;
  }

  .balance_search .checkbox em:before {
    position: absolute;
  }

  .balance_search .f-fr {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .balance_search .f-fr p {
    flex-shrink: 1;
    flex-grow: 1;
  }

  .balance_search .f-fr .icon-checkbox {
  }

  .balance_search .f-fr .search_input {
    margin-left: 30px;
    line-height: 30px;
    height: 30px;
    border-bottom: 1px solid #312e45;
    width: 150px;
    position: relative;
  }

  .balance_search .f-fr .total {
    /*color: #333;*/
    font-size: 18px;
    font-weight: bold;
  }

  .balance_search .f-fr .limit {
    height: 32px;
    line-height: 32px;
    margin-left: 20px;
  }

  .balance_search .f-fr .limit span {
    color: #0D66EF;
    cursor: pointer;
  }

  .balance_search .f-fr .limit span:hover {
    color: #0a4fb9;
  }

  .accountInfo-lists {
    padding: 0 8px 0px 8px;
  }
  .accountInfo-lists button {padding-left: 15px; padding-right:15px; border-radius: 0;}
  .accountInfo-lists button:disabled {cursor: not-allowed;}
  .accountInfo-lists.header {
    padding-bottom: 0px;
    color: #979799;
  }

  .accountInfo-lists li.th > .items > div {
    align-items: center;
  }

  .accountInfo-lists li.th > .items > div > em {
    position: relative;
    display: inline-block;
    width: 8px;
    height: 26px;
    line-height: 0px;
    flex: initial;
    display: flex;
    margin-left: 2px;
  }

  .accountInfo-lists li.th > .items > div > em i {
    position: absolute;
    top: 0px;
    left: 0px;
    color: #999;
  }

  .accountInfo-lists li.th > .items > div > em i.icon-arrow-down {
    top: inherit;
    bottom: 0px;
  }

  .accountInfo-lists li.th > .items > div > em i.active {
    color: #0D66EF;
  }

  .accountInfo-lists li {
    padding: 0;
  }

  .accountInfo-lists li a {
    color: #eeba42;
  }

  .accountInfo-lists li a:hover a {
    text-decoration: underline;
  }

  .accountInfo-lists li.bg {
    background-color: rgba(232, 179, 66, 0.05);
  }

  .accountInfo-lists li .items {
    overflow: hidden;
    min-height: 40px;
    display: flex;
  }

  .accountInfo-lists li .items > div {
    font-size: 14px;
    text-align: left;
    box-sizing: border-box;
    min-height: 50px;
    line-height: 22px;
    white-space: nowrap;
    word-break: break-all;
    padding: 0 4px;
    width: 110px;
    text-overflow: ellipsis;
    overflow: hidden
  }
  .accountInfo-lists.pandect li .items > div {
    width: 150px;
  }

  .accountInfo-lists.header li {
    border-bottom: none;
  }

  .accountInfo-lists.header li .items > div {
    display: flex;
  }

  .accountInfo-lists li .items > div .btn {
    display: inline-block;
    height: 22px;
    padding: 0;
    line-height: 22px;
    font-size: 24px;
    color: #0D66EF;
    text-align: left;
    cursor: pointer;
  }

  .accountInfo-lists li .items > div .btn:hover {
    color: #0847a9;
  }

  .accountInfo-lists li .items > div .cur {
    background-color: #e8b342;
    border-color: #e8b342;
    color: #fff;
  }

  .accountInfo-lists li .items > div .disabled {
    cursor: not-allowed;
    color: #ababab;
  }

  .accountInfo-lists li .items > div .disabled:hover {
    color: #ababab;
  }

  .accountInfo-lists li .items > div .active {
    border: none;
    color: #fdb902;
  }

  .accountInfo-lists li .items > div.coin {
    /*flex: 1;*/
    text-align: left;
    width: 80px;
  }

  .accountInfo-lists li .items > div.coin .icon-checkbox {
    margin-left: 14px;
  }

  .accountInfo-lists li .items > div.coin img {
    vertical-align: middle;
    height: 16px;
    margin-right: 6px;
  }


  .accountInfo-lists li .items > div.coin > img {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

  .accountInfo-lists li .items > div.useable {
    width: 90px;
  }
  .accountInfo-lists.pandect li .items > div.useable {
    width: 130px;
  }


  .accountInfo-lists li .items > div.opreat {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  .accountInfo-lists li .items > div.action {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  .acount_tab {
    height: 50px;
    display: flex;
    font-size: 16px;
    position: relative;
  }

  .acount_tab > div {
    width: 190px;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    border-top-right-radius: 10px;
    text-align: center;
    line-height: 50px;
    color: #808080;
    cursor: pointer;
  }

  .acount_tab > div.active {
    background-color: #1571FF;
    border-color: #1571FF;
    color: #fff;
  }

  .acount_tab > div:hover {
    /*color: #333;*/
  }

  .acount_tab > div.active:hover {
    color: #fff;
  }

  .acount_tab > span {
    position: absolute;
    right: 20px;
    height: 50px;
    line-height: 50px;
    color: #1571FF;
    cursor: pointer;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .accountInfo-lists {
      flex: 1;
    }

    .echart {
      width: 190px;
      height: 300px;
    }
  }

</style>

