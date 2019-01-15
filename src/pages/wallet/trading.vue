<template>
  <div class="page">
    <cp-top-back :back="true">
      <h1>
        <span v-tap="{methods: toggleSymbolList}">{{porp.symbol}}</span>
      </h1>
    </cp-top-back>

    <div class="wallet">
      <section class="wallet-feature">
        <h2 class="wallet-feature-title">
          <img v-if="currentSymbolInfo" :src="'data:image/png;base64,' + currentSymbolInfo.iconBase64"/>
          <span>{{porp.symbol}}</span>
        </h2>
        <div class="wallet-feature-operation">
          <span v-tap="{methods: $root.routeTo, to: 'page-topup', params: {symbol: porp.symbol}}">
            <img src="../../assets/img/i_cz.png">
            <em>{{$t('account.estimated_value_deposit')}}<!--充值--></em>
          </span>
          <span v-tap="{methods: withdrawal, params: {symbol: porp.symbol, symbolType: porp.symbolType}}">
            <img src="../../assets/img/i_tx.png">
            <em>{{$t('account.estimated_value_withdrawal')}}<!--提现--></em>
          </span>
          <span v-tap="{methods: $root.routeTo, to: 'page-iconindex', params: {symbol: porp.symbol}}">
            <img src="../../assets/img/i_jy.png">
            <em>{{$t('account.estimated_value_trade')}}<!--交易--></em>
          </span>
        </div>
      </section>

      <section class="wallet-history">
        <ul class="wallet-history-tab">
          <li :class="{active: currentHistory === 1}" @click="currentHistory = 1">{{$t('account.user_center_history_deposit')}}<!--充值记录--></li>
          <li :class="{active: currentHistory === 2}" @click="currentHistory = 2">{{$t('account.user_center_history_withdrawal')}}<!--提现记录--></li>
        </ul>
        <div class="wallet-history-group">
          <!--充值记录，使用InfiniteScroll指令时需用v-show来实现隐藏/显示不能用v-if-->
          <div class="wallet-history-box" v-show="currentHistory === 1">
            <h3 v-if="depositHistory.length > 0">
              <span class="quantity">{{$t('account.user_center_history_amount')}}<!--数量--></span>
              <span class="state">{{$t('account.user_center_history_status')}}<!--状态--></span>
              <span class="time">{{$t('account.user_center_history_date')}}<!--时间--></span>
            </h3>
            <mt-loadmore
              :class="{'is-loading': depositTopLoading}"
              ref="depositLoadmore"
              :style="{height: depositHistory.length === 0 ? 'calc(100vh - 4.4rem)' : 'calc(100vh - 5.2rem)'}"
              :autoFill="false"
              :topDistance="40"
              :topMethod="loadTop"
              @top-status-change="handleTopChange"
              infinite-scroll-immediate-check="false"
              infinite-scroll-distance="80"
              infinite-scroll-disabled="depositBottomDisabled"
              v-infinite-scroll="loadMore"
            >
              <!-- <loading slot="top" :class="{'is-loading': depositTopDrop}"/> -->
              <template v-if="depositHistory.length > 0">
                <ul ref="depositHistoryList">
                  <li class="item" v-for="(item, index) in depositHistory">
                    <div>
                      <span class="quantity">{{item.amount}}</span>
                      <span class="state">{{getDepositState(item.status)['value']}}</span>
                      <span class="time">{{item.updatedAt ? new Date(Number(item.updatedAt)).format() : '--'}}</span>
                    </div>
                    <div>
                      <span class="txid">TXID：{{item.txId}}</span>
                      <span class="copy" v-if="item.txId" v-tap="{methods: copy, txId: item.txId}">
                        <i></i>
                        <em>{{$t('referral.copy')}}<!--复制--></em>
                      </span>
                    </div>
                  </li>
                </ul>
                <loading :bgColor="depositHistory.length % 2 === 0 ? '#0c151d' : '#0d0d0d'" v-if="depositBottomLoading"/>
                <noMoreData :bgColor="depositHistory.length % 2 === 0 ? '#0c151d' : '#0d0d0d'" v-if="!depositBottomLoading && noMoreDepositHistory"/>
              </template>
              <noData :bgColor="'#0c151d'" v-if="!depositTopLoading && depositHistory.length === 0"/>
            </mt-loadmore>
          </div>
          <!--提现记录，使用InfiniteScroll指令时需用v-show来实现隐藏/显示不能用v-if-->
          <div class="wallet-history-box" v-show="currentHistory === 2">
            <h3 v-if="withdrawalHistory.length > 0">
              <span class="quantity">{{$t('account.user_center_history_amount')}}<!--数量--></span>
              <span class="state">{{$t('account.user_center_history_status')}}<!--状态--></span>
              <span class="time">{{$t('account.user_center_history_date')}}<!--时间--></span>
            </h3>
            <mt-loadmore
              :class="{'is-loading': withdrawalTopLoading}"
              ref="withdrawalLoadmore"
              :style="{height: withdrawalHistory.length === 0 ? 'calc(100vh - 4.4rem)' : 'calc(100vh - 5.2rem)'}"
              :autoFill="false"
              :topDistance="40"
              :topMethod="loadTop"
              @top-status-change="handleTopChange"
              infinite-scroll-immediate-check="false"
              infinite-scroll-distance="80"
              infinite-scroll-disabled="withdrawalBottomDisabled"
              v-infinite-scroll="loadMore"
            >
              <!-- <loading slot="top" :class="{'is-loading': withdrawalTopDrop}"/> -->
              <template v-if="withdrawalHistory.length > 0">
                <ul ref="withdrawalHistoryList">
                  <li v-for="(item, index) in withdrawalHistory">
                    <div>
                      <span class="quantity">{{item.amount}}</span>
                      <span class="state">{{getWithdrawalState(item.status)['value']}}</span>
                      <span class="time">{{item.updatedAt ? new Date(Number(item.updatedAt)).format() : '--'}}</span>
                    </div>
                    <div>
                      <span class="txid">TXID：{{item.txId}}</span>
                      <span class="copy" v-if="item.txId" v-tap="{methods: copy, txId: item.txId}">
                        <i></i>
                        <em>{{$t('referral.copy')}}<!--复制--></em>
                      </span>
                    </div>
                  </li>
                </ul>
                <loading :bgColor="withdrawalHistory.length % 2 === 0 ? '#0c151d' : '#0d0d0d'" v-if="withdrawalBottomLoading"/>
                <noMoreData :bgColor="withdrawalHistory.length % 2 === 0 ? '#0c151d' : '#0d0d0d'" v-if="!withdrawalBottomLoading && noMoreWithdrawalHistory"/>
              </template>
              <noData :bgColor="'#0c151d'" v-if="!withdrawalTopLoading && withdrawalHistory.length === 0"/>
            </mt-loadmore>
          </div>
        </div>
      </section>
    </div>

    <cp-mask :show="showSymbolList" @hide="hideSymbolList" :style="{'top': '0.8rem', 'background-color': 'rgba(0, 0, 0, .5)'}">
      <ul class="wallet-symbol">
        <li v-for="(item, index) in symbolList" v-tap="{methods: changeSymbol, item: item}">{{item.symbol}}</li>
      </ul>
    </cp-mask>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import myApi from '@/api/user'
import userApi from '@/api/individual'
import userUtils from '@/api/wallet'
import loading from '@/components/common/loading'
import noData from '@/components/common/noData'
import noMoreData from '@/components/common/noMoreData'
export default {
  name: 'page-trading',
  components: {
    loading,
    noData,
    noMoreData
  },
  data () {
    return {
      porp: {
        symbol: this.$route.params.symbol,
        symbolType: this.$route.params.symbolType
      },
      symbolList: [], // 币种列表
      showSymbolList: false,
      currentHistory: 1, // 当前记录：1充值记录 2提现记录
      paramDeposit: {
        symbol: this.$route.params.symbol,
        page: 1,
        pageSize: 10
      },
      paramWithdrawal: {
        symbol: this.$route.params.symbol,
        page: 1,
        pageSize: 10
      },
      depositHistory: [], // 充值记录
      depositTopDrop: false, // 充值记录下拉状态
      depositTopLoading: false, // 充值记录下拉加载状态
      depositBottomDisabled: false, // 充值记录滚动加载禁用状态
      depositBottomLoading: false, // 充值记录滚动加载状态
      noMoreDepositHistory: false, // 是否没有更多充值记录
      withdrawalHistory: [], // 提现记录
      withdrawalTopDrop: false, // 提现记录下拉状态
      withdrawalTopLoading: false, // 提现记录下拉加载状态
      withdrawalBottomDisabled: false, // 提现记录滚动加载禁用状态
      withdrawalBottomLoading: false, // 提现记录滚动加载状态
      noMoreWithdrawalHistory: false, // 是否没有更多提现记录
      responseState: { // 组件创建时所请求的接口的响应状态
        item1: false,
        item2: false,
        item3: false
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    currentSymbolInfo () {
      for (let i = 0; i < this.symbolList.length; i++) {
        let tempItem = this.symbolList[i]
        if (this.porp.symbol === tempItem.symbol) {
          return tempItem
        }
      }
      return null
    }
  },
  watch: {
    responseState: { // 数据请求完毕后关闭indicator
      handler (val) {
        let i = 0
        let j = 0
        for (let x in val) {
          i++
          if (val[x]) {
            j++
          }
        }
        if (i === j) {
          Indicator.close()
        }
      },
      deep: true
    },
    'porp.symbol' (val) {
      Indicator.open()
      // 初始化充值记录参数
      this.paramDeposit.symbol = val
      this.paramDeposit.page = 1
      this.depositHistory = []
      // 初始化提现记录参数
      this.paramWithdrawal.symbol = val
      this.paramWithdrawal.page = 1
      this.withdrawalHistory = []
      // -- //
      if (this.currentHistory === 1) {
        this.getDepositHistory(() => {
          Indicator.close()
        }, () => {
          Indicator.close()
        })
      } else {
        this.getWithdrawalHistory(() => {
          Indicator.close()
        }, () => {
          Indicator.close()
        })
      }
    },
    currentHistory (val) {
      if (val === 1) {
        if (this.depositHistory.length === 0) {
          Indicator.open()
          this.getDepositHistory(() => {
            Indicator.close()
          }, () => {
            Indicator.close()
          })
        }
      } else {
        if (this.withdrawalHistory.length === 0) {
          Indicator.open()
          this.getWithdrawalHistory(() => {
            Indicator.close()
          }, () => {
            Indicator.close()
          })
        }
      }
    },
    'paramDeposit.page' (val) {
      if (val !== 1 && !this.noMoreDepositHistory) {
        this.depositBottomDisabled = true
        this.depositBottomLoading = true
        this.getDepositHistory(() => {
          this.depositBottomLoading = false
        }, () => {
          this.depositBottomLoading = false
        })
      }
    },
    'paramWithdrawal.page' (val) {
      if (val !== 1 && !this.noMoreWithdrawalHistory) {
        this.withdrawalBottomDisabled = true
        this.withdrawalBottomLoading = true
        this.getWithdrawalHistory(() => {
          this.withdrawalBottomLoading = false
        }, () => {
          this.withdrawalBottomLoading = false
        })
      }
    }
  },
  created () {
    Indicator.open()
    this.$nextTick(() => {
      this.fnGetUserInfo()
      this.getSymbolList()
      if (this.currentHistory === 1) {
        this.getDepositHistory(() => {
          this.responseState.item3 = true
        }, () => {
          this.responseState.item3 = true
        })
      } else {
        this.getWithdrawalHistory(() => {
          this.responseState.item3 = true
        }, () => {
          this.responseState.item3 = true
        })
      }
    })
  },
  methods: {
    ...mapActions(['setUserInfo']),
    fnGetUserInfo () { // 获取用户信息
      myApi.getUserInfo((userInfo) => {
        this.setUserInfo(userInfo)
        this.responseState.item1 = true
      }, (msg) => {
        this.responseState.item1 = true
        console.error(msg)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    getSymbolList () { // 获取币种列表
      userUtils.myAssets({}, (data) => {
        data = data.filter(item=>{
          return item.type===1
        })
        this.symbolList = data.sort((item1, item2) => {
          if (item1.symbol === item2.symbol) {
            return 0
          } else {
            return item1.symbol < item2.symbol ? -1 : 1
          }
        })
        this.responseState.item2 = true
      }, (msg) => {
        this.responseState.item2 = true
        console.error(msg)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    toggleSymbolList () { // 展开/收起币种列表
      this.showSymbolList = !this.showSymbolList
    },
    hideSymbolList () { // 隐藏币种列表
      this.showSymbolList = false
    },
    changeSymbol (args) { // 切换币种
      this.porp.symbol = args.item.symbol
      this.porp.symbolType = args.item.symbolType
      this.$router.replace({path: `/trading/${args.item.symbol}`})
      this.showSymbolList = false
    },
    withdrawal () { // 前往提现
      userApi.getUserState((data) => {
        if (data.verifyState !== 2) {
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm')
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-realname'})
            }
          })
          return
        }
        if (data.googleState !== 1 && data.mobileAuthState !== 1) {
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm')
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-saft'})
            }
          })
          return
        }
        if (!this.getUserInfo.email && data.mobileAuthState !== 1) {
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('error_code.CELLPHONE_AUTH_FIRST'), // 请先进行短信验证
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm')
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-saft'})
            }
          })
          return
        }
        this.$router.push({name: 'page-withdrawal', params: {userInfo: this.getUserInfo}})
      }, (msg) => {
        console.error(msg)
      })
    },
    getDepositHistory (successCallback, errorCallback, isLoadTop) { // 获取充值记录
      userUtils.depositHistory(this.paramDeposit, (res) => {
        if (isLoadTop) { // 判断是否为下拉刷新方式加载数据，则替换旧数据
          this.depositHistory = res.data
        } else {
          res.data.forEach((item) => {
            this.depositHistory.push(item)
          })
        }
        if (this.depositHistory.length >= res.total) { // 判断数据是否加载完毕，则禁用滚动加载事件
          this.depositBottomDisabled = true
          this.noMoreDepositHistory = true
        } else {
          this.depositBottomDisabled = false
          this.noMoreDepositHistory = false
        }
        if (!this.noMoreDepositHistory) { // 如果数据撑不满容器时，继续请求下一页数据
          this.$nextTick(() => {
            if (this.$refs.depositLoadmore.$el.clientHeight > this.$refs.depositHistoryList.clientHeight) {
              this.paramDeposit.page++
            }
          })
        }
        successCallback && successCallback(res)
      }, (msg) => {
        errorCallback && errorCallback(msg)
        console.error(msg)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    getWithdrawalHistory (successCallback, errorCallback, isLoadTop) { // 获取提现记录
      userUtils.withdrawalHistory(this.paramWithdrawal, (res) => {
        if (isLoadTop) { // 判断是否为下拉刷新方式加载数据，则替换旧数据
          this.withdrawalHistory = res.data
        } else {
          res.data.forEach((item) => {
            this.withdrawalHistory.push(item)
          })
        }
        if (this.withdrawalHistory.length >= res.total) { // 判断数据是否加载完毕，则禁用滚动加载事件
          this.withdrawalBottomDisabled = true
          this.noMoreWithdrawalHistory = true
        } else {
          this.withdrawalBottomDisabled = false
          this.noMoreWithdrawalHistory = false
        }
        if (!this.noMoreWithdrawalHistory) { // 如果数据撑不满容器时，继续请求下一页数据
          this.$nextTick(() => {
            if (this.$refs.withdrawalLoadmore.$el.clientHeight > this.$refs.withdrawalHistoryList.clientHeight) {
              this.paramWithdrawal.page++
            }
          })
        }
        successCallback && successCallback(res)
      }, (msg) => {
        errorCallback && errorCallback(msg)
        console.error(msg)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    getDepositState (state) { // 获取充值状态
      if (state === 1) {
        return {
          className: 'underway',
          value: this.$t('account.user_center_history_status_wait') // 等待中
        }
      } else if (state === 2) {
        return {
          className: 'success',
          value: this.$t('account.user_center_history_status_success') // 成功
        }
      } else {
        return {
          className: null,
          value: null
        }
      }
    },
    getWithdrawalState (state) { // 获取提现状态
      switch (state) {
        case 1:
          return {
            className: 'underway',
            value: this.$t('account.user_center_history_status_review') // 审核中
          }
        case 2:
        case 3:
          return {
            className: 'underway',
            value: this.$t('account.user_center_history_status_withdrawal') // 提现中
          }
        case 4:
          return {
            className: 'fail',
            value: this.$t('account.user_center_history_status_repeal') // 已撤销
          }
        case 5:
          return {
            className: 'fail',
            value: this.$t('account.user_center_history_status_fail') // 失败
          }
        case 6:
          return {
            className: 'success',
            value: this.$t('account.user_center_history_status_complete') // 已完成
          }
        default:
          return {
            className: null,
            value: null
          }
      }
    },
    copy (args) { // 复制TXID
      utils.copyText(args.txId)
      Toast(this.$t('public0.public33')); // 复制成功
    },
    handleTopChange (status) { // 获取组件的下拉状态 status: pull（组件被下拉但未达到阈值）、drop（组件被下拉且已达到阈值）、loading（组件被下拉达到阈值后释放）
      if (this.currentHistory === 1) {
        this.depositTopDrop = status !== 'pull'
        this.depositTopLoading = status === 'loading'
      } else {
        this.withdrawalTopDrop = status !== 'pull'
        this.withdrawalTopLoading = status === 'loading'
      }
    },
    loadTop () { // 下拉获取最新消息
      if (this.currentHistory === 1) {
        this.paramDeposit.page = 1
        this.getDepositHistory(() => {
          this.depositTopDrop = false
          this.depositTopLoading = false
        }, () => {
          this.depositTopDrop = false
          this.depositTopLoading = false
        }, true)
      } else {
        this.paramWithdrawal.page = 1
        this.getWithdrawalHistory(() => {
          this.withdrawalTopDrop = false
          this.withdrawalTopLoading = false
        }, () => {
          this.withdrawalTopDrop = false
          this.withdrawalTopLoading = false
        }, true)
      }
    },
    loadMore () { // 向下滚动获取更多消息
      if (this.currentHistory === 1) {
        this.paramDeposit.page++
      } else {
        this.paramWithdrawal.page++
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page{background-color:#161f2f;}
.page-top h1{height: .8rem;font-size: 0;line-height: 0;text-align: center;}
.page-top h1 span{position: relative;display: inline-block;padding-right: .36rem;font-size: .32rem;line-height: .8rem;color: #cbd4ec;}
.page-top h1 span::after{content: "";position: absolute;top: 50%;right: 0;margin-top: -0.06rem;border-width: .12rem .12rem 0 .12rem;border-style: solid;border-color: #cbd4ec transparent transparent transparent;}

.wallet{padding: .2rem .3rem 0 .3rem;}
.wallet-feature{padding: .3rem;background-color: #0c151d;}
.wallet-feature-title{font-size: 0;line-height: 0;}
.wallet-feature-title img{width: .6rem;height: .6rem;vertical-align: middle;}
.wallet-feature-title span{padding-left: .2rem;font-weight: bold;font-size: .3rem;color: #fff;vertical-align: middle;}
.wallet-feature-operation{display: flex;justify-content: space-between;padding-left: .8rem;padding-right: .8rem;margin-top: .4rem;}
.wallet-feature-operation span{font-size: 0;line-height: 0;text-align: center;}
.wallet-feature-operation span img{width: .9rem;height: .6rem;vertical-align: top;}
.wallet-feature-operation span em{display: block;height: .6rem;font-style: normal;font-size: .24rem;line-height: .9rem;}

.wallet-history{margin-top: .2rem;}
.wallet-history-tab{overflow: auto;background-color: #0c151d;border-bottom: 0.02rem solid #161f2f;}
.wallet-history-tab li{float: left;width: 50%;height: .9rem;font-size: .3rem;line-height: .9rem;text-align: center;
border-bottom: 0.02rem solid #0c151d;
}
.wallet-history-tab li.active{border-bottom-color: #0072fd;color: #0072fd;}
.wallet-history-box h3,
.wallet-history-box ul li{padding-left: .2rem;padding-right: .2rem;overflow: auto;}
.wallet-history-box h3{padding-top: .2rem;background-color: #0c151d;}
.wallet-history-box ul li:nth-of-type(odd){background-color: #0c151d;}
.wallet-history-box ul li:nth-of-type(even){background-color: #0d0d0d;}
.wallet-history-box ul li div{overflow: auto;}
.wallet-history-box h3 span,
.wallet-history-box ul li span{float: left;height: .6rem;font-size: .24rem;line-height: .6rem;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.wallet-history-box h3 span{color: #8089A3;}
.wallet-history-box h3 span.quantity,
.wallet-history-box ul li span.quantity{width: 35%;}
.wallet-history-box h3 span.state,
.wallet-history-box ul li span.state{width: 30%;}
.wallet-history-box h3 span.time,
.wallet-history-box ul li span.time{width: 35%;text-align: right;}
.wallet-history-box ul li span.txid{width: 80%;color: #8089A3;}
.wallet-history-box ul li span.copy{float: right;font-size: 0;line-height: 0;text-align: right;}
.wallet-history-box ul li span.copy i{display: inline-block;width: .3rem;height: .3rem;margin-bottom: 2px;vertical-align: middle;background: url(../../assets/img/i_copy.png) no-repeat center center / contain;}
.wallet-history-box ul li span.copy em{display: inline-block;height:.6rem;font-style: normal;font-size: .24rem;line-height: .6rem;color: #ffde00;text-indent: .12rem;vertical-align: middle;}

.mint-loadmore .loading:first-of-type{visibility: hidden;margin-top: -0.8rem;}
.mint-loadmore .loading.is-loading:first-of-type{visibility: visible;}

.wallet-symbol{width: 50%;max-height: calc(~"100% - .8rem");margin-left: auto;margin-right: auto;overflow-x: hidden;overflow-y: auto;}
.wallet-symbol li {height: .8rem;line-height: .8rem;font-size: 0.32rem;color: #8089a3;text-align: center;background-color: #0c151d;border-bottom: 1px solid #8089a3;}
.wallet-symbol li:last-of-type{border-bottom-width: 0;}
.wallet-symbol li:active{color: #292929;background-color: #8089a3;}
</style>
