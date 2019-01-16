<template>
  <div class="page">
    <cp-top-back :back="false" :showLogo="true">
      <h1 class="header">{{$t('account.userDigitalAssets')}}<!--我的数字资产--></h1>
    </cp-top-back>
    <!--1、头部-->
    <div class="wallet-top">
      <h1>{{$t('exchange.exchange_valuation')}}<!--当前总估值-->（BTC）</h1>
      <h2>{{String(getBTCValuation).toMoney()}}</h2>
      <h3>≈ {{getCoinSign}} {{USDCNY}}</h3>
    </div>
    <div class="accountTabs">
      <span :class="{active:accountType===1}" @click="accountType=1">{{$t('vote_mining.main_account')}}</span>
      <span  :class="{active:accountType===2}" @click="accountType=2">{{$t('vote_mining.vote_mining_account')}}</span>
    </div>
    <!--2内容-->
    <section class="box search">
      <div class="inner">
        <ul>
          <li><input class="ko-input-default" v-model="filterTitle" :placeholder="$t('exchange.advanced_search')"/></li>
          <li>
            <label class="i-checkbox">
              <input type="checkbox" v-model="hideZero"><i type="checkbox">✓</i><span>{{$t('account.estimated_value_hide')}}<!--隐藏--> 0  {{$t('account.estimated_value_balances')}}<!--金额--></span>
            </label>
            <!-- <span>隐藏<i>0</i>金额</span>-->
          </li>
        </ul>
      </div>
    </section>

    <section id="scroll" class="box wallet-contant trans-records-scroll">
      <div class="inner">
        <div v-for="(data,index) in filterDatas" class="item" @click="goWalletDetail(data)" :key="data.accountId">
          <div class="inner">
            <div class="header">
              <p>
                <img :src="`data:image/png;base64,${data.iconBase64}`"/>
                <span>{{data.symbol}}</span>
              </p>
              <i class="i_right" v-show="accountType===1"></i>
            </div>
            <div class="content"><span>{{$t('account.estimated_value_available')}}<!--可用余额--></span><span>{{$t('public0.public34')}}<!--冻结金额--></span><span>{{$t('account.estimated_value_total')}}<!--总金额--></span></div>
            <div class="bottom"><span>{{data.availableBalance}}</span><span>{{data.frozenBalance}}</span><span>{{data.totalBalance}}</span></div>
          </div>
        </div>
      </div>
    </section>
    <button class="mint-button mint-button--primary mint-button--large transfer-btn"  @click="showTransfer=true">{{$t('vote_mining.funds_transfer')}}</button>
    <mt-popup v-model="showTransfer" position="bottom">
      <Transfer @closeDialog="closeTransferDialog" @okCallback="transferDialogCallback" ref="transferDialog"></Transfer>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Indicator } from 'mint-ui'
import Tip from '@/assets/js/tip'
import numUtils from '@/assets/js/numberUtils'
import userUtils from '@/api/wallet'
import Transfer from '@/pages/vote_mining/transfer'

export default {
  components:{
    Transfer,
  },
  name: 'page-wallet',
  data () {
    return {
      value: 'optionA',
      scroll: false,
      myAssets: [],
      hideZero: false, // 是否隐藏
      filterTitle: '', // 搜索框
      accountType:1,
      showTransfer:false
    }
  },
  computed: {
    ...mapGetters(['getBTCValuation', 'getUSDCNY', 'getCoinSign']),
    filterDatas () {
      let ndatas = this.myAssets.filter((item) => {
        if (this.hideZero) {
          if (this.filterTitle) {
            return (item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 || item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1) && !numUtils.BN(item.availableBalance).equals(0)
          }
          return !numUtils.BN(item.availableBalance).equals(0)
        } else {
          if (this.filterTitle) {
            return item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 || item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1
          }
          return true
        }
      })
      ndatas = ndatas.filter(item=>{
        return item.type===this.accountType
      })
      ndatas.sort((item1, item2) => {
        let m1 = numUtils.BN(item1.totalBalance)
        let m2 = numUtils.BN(item2.totalBalance)
        if (m1.equals(m2)) {
          return item1.symbol < item2.symbol ? -1 : 1
        }
        return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
      })
      return ndatas
    },
    USDCNY () {
      return numUtils.mul(this.getBTCValuation, this.getUSDCNY).toFixed(2).toMoney()
    }
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
    }
  },
  created () {
    this.getList()
  },
  methods: {
    ...mapActions(['setUserWallets']),
    goWalletDetail(data){
      if(this.accountType===1){
        this.$router.push({name:'page-trading', params:{symbol: data.symbol, symbolType: data.symbolType, index:data.index}})
      }
    },
    closeTransferDialog(){
      this.showTransfer = false
    },
    transferDialogCallback(){
      this.getList()
    },
    getList () {
      Indicator.open()
      userUtils.myAssets({}, (resSet) => {
        resSet.forEach((item) => {
          Indicator.close()
          // item.totalBalance = numUtils.BN(item.totalBalance).toFixed(8)
          // item.availableBalance = numUtils.BN(item.availableBalance).toFixed(8)
          item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
        })
        this.myAssets = resSet
        this.showLoaing = false
      }, (msg) => {
        Indicator.close()
        this.showLoaing = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @font_color_transparent:#cbd4ec;
  @fs_24:.24rem;
  @f_c_2:#cfd3e9;
  .transfer-btn {position: absolute; bottom: 0;left: 0; right: 0; border-radius: 0 !important; z-index: 1;}
  .accountTabs {
    display: flex;
    line-height: 0.8rem;
    background-color: #0c151d;
    font-size: 0.3rem;
    margin-bottom: 0.16rem;
    span {flex: 1; text-align: center; border-bottom: 1px solid #0c151d; color: #fff;
      &.active {
        border-bottom-color: #0072fd;
        color: #0072fd;
      }
      
    }
  }

  .trans-records-scroll {
    height: calc(~"100vh - 4.7rem - 40px");
    background-color: #161f2f;
    overflow-y:auto;
  }
  label.i-checkbox {
      font-size:.13rem;cursor:pointer;
     i{
       font-size: .19rem;
       font-style: normal;
       display: inline-block;
       width: .3rem;
       height: .3rem;
       text-align: center;
       line-height: .13rem;
       color: #292929;
       vertical-align: middle;
       margin: -0.06rem 0.1rem 0.01rem 0rem;
       border: #0072fd .01rem solid;
       border-radius: .05rem;
       padding: .1rem .1rem .1rem .07rem;
     }
     span{
       font-size: .24rem;
     }
     input[type="checkbox"]{display:none;}
     input[type="checkbox"]:checked + i {background-color: #0072fd;color: #fff;}
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    color: @f_c_2;
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: @f_c_2;
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: @f_c_2;
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: @f_c_2;
  }

  .ko-input-default{
    background:transparent url("../../assets/img/w_search.png") no-repeat .1rem .07rem;
    background-size: .28rem .3rem;
    padding: .1rem 0 .2rem .6rem;
    border: 0;
    color: @f_c_2;
    font-size: @fs_24;
  }
.header{
  font-size: .32rem;
  color: @font_color_transparent;
}
/* 顶部*/
  .box{
    background-color: #161f2f;
    font-size: .3rem;

    &>.inner{
      padding:0 .3rem;
      color: #cfd3e9;
    }
  }
  .page{
    background-color: #161f2f;
  }
.page-top h1{
  display: block;
  position: absolute;
  width: 100%;
  top: 0.02rem;
}
.wallet-top{
  text-align: center;
  height: 2.25rem;
  display: flex;
  width: 100%;
  background: #0c151d;
  background-size: 100% 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1{
    font-size: .24rem;
    position: relative;
    top: -.10rem;
    color: @font_color_transparent;
  }
  h2{
    font-size: .62rem;
    color: #cbd4ec;
  }
  h3{
    font-size: .24rem;
    line-height: .4rem;
    height: .4rem;
    color:@font_color_transparent;
  }
}

  .search{
     ul{
       border-bottom: .02rem solid #cfd3e9;
       height: .6rem;
       margin-top: .2rem;
       display: flex;
       justify-content: space-between;
       font-size: @fs_24;
       li:last-child{
         padding-top: .07rem;
       }
     }
  }

  /*内容*/
  .wallet-contant{
    .item{
      margin-top: .1rem;
      border-radius: .1rem;
      background: #181b2a;
      >.inner {
        padding: .4rem .3rem .2rem .3rem;
        background: #0c151d;
        border-radius: .05rem;
      }
    }
    .item:first-child{margin-top: .25rem;}
    

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      img {
        width: .4rem;
        height: .4rem;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
        margin-left: 0.05rem;
      }
    }
    i.i_right {
      width: .14rem;
      height: .26rem;
      background:  url('../../assets/img/nav_right.png') no-repeat center;
      background-size:100% 100% ;
    }
  }
  .content {
    margin-top: .3rem;
    display: flex;
    justify-content: space-between;
    font-size: .22rem;
    color: #cfd3e9;
    span{
      width: 2rem;
      text-align: left;
    }
  }
    .bottom{
      padding: .15rem 0rem;
      font-size: .22rem;
      display: flex;
      justify-content: space-between;
      color: #cbd4ec;
      span{
        width: 2rem;
        text-align: left;
      }
    }
  }
</style>
