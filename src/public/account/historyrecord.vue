<template>
  <div class="history-record">
    <p>{{$t('usercontent.user59')}}</p>
    <div class="history_nav">
      <label :class="{active:show==='deposit'}" @click="show = 'deposit'">{{$t('account.user_center_history_deposit')}}<!--充值记录--></label>
      <label :class="{active:show==='withdrawal'}" @click="show = 'withdrawal'">{{$t('account.user_center_history_withdrawal')}}<!--提现记录--></label>
      <label :class="{active:show==='staked'}" @click="show = 'staked'">{{$t('account.history_staked')}}<!--锁仓记录--></label>
      <label :class="{active:show==='distributed'}" @click="show = 'distributed'">{{$t('account.history_distributed')}}<!--分发记录--></label>
    </div>

    <div class="search mt10 ui-flex" v-show="show==='deposit'">
      <div @click="panel.showToken=!panel.showToken">
        <p>{{params.token!==''?params.token:$t('trade_record.trade_record_all')}} <i :class="[!panel.showToken?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='deposit' && panel.showToken">
          <li v-for="item in tokens" @click="params.token=item">{{item!==''?item:$t('trade_record.trade_record_all')}}</li>
        </ul>
      </div>
      <div @click="panel.showPeriod=!panel.showPeriod">
        <p>{{params.period}} {{$t('exchange.exchange_day')}} <i :class="[!panel.showPeriod?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='deposit' && panel.showPeriod">
          <li v-for="item in periods" @click="params.period=item">{{item}} {{$t('exchange.exchange_day')}}</li>
        </ul>
      </div>
      <span class="ml30">{{$t('exchange.exchange_status')}}</span>
      <div @click="panel.showStatus=!panel.showStatus">
        <p>{{getRechargeState(params.status).value}} <i :class="[!panel.showStatus?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='deposit' && panel.showStatus">
          <li v-for="item in rechargeStatus" @click="params.status=item">{{getRechargeState(item).value}}</li>
        </ul>
      </div>
    </div>

    <div class="search mt10 ui-flex" v-show="show==='withdrawal'">
      <div @click="panel.showToken=!panel.showToken">
        <p>{{params2.token!==''?params2.token:$t('trade_record.trade_record_all')}} <i :class="[!panel.showToken?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='withdrawal' && panel.showToken">
          <li v-for="item in tokens" @click="params2.token=item">{{item!==''?item:$t('trade_record.trade_record_all')}}</li>
        </ul>
      </div>
      <div @click="panel.showPeriod=!panel.showPeriod">
        <p>{{params2.period}} {{$t('exchange.exchange_day')}} <i :class="[!panel.showPeriod?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='withdrawal' && panel.showPeriod">
          <li v-for="item in periods" @click="params2.period=item">{{item}} {{$t('exchange.exchange_day')}}</li>
        </ul>
      </div>
      <span class="ml30">{{$t('exchange.exchange_status')}}</span>
      <div @click="panel.showStatus=!panel.showStatus">
        <p>{{getWithdrawalState(params2.status).value}} <i :class="[!panel.showStatus?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='withdrawal' && panel.showStatus">
          <li v-for="item in withdrawalStatus" @click="params2.status=item">{{getWithdrawalState(item).value}}</li>
        </ul>
      </div>
    </div>

    <div class="search mt10 ui-flex" v-show="show==='staked'">
      <div @click="panel.showToken=!panel.showToken">
        <p>{{params3.token!==''?params3.token:$t('trade_record.trade_record_all')}} <i :class="[!panel.showToken?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='staked' && panel.showToken">
          <li v-for="item in tokens" @click="params3.token=item">{{item!==''?item:$t('trade_record.trade_record_all')}}</li>
        </ul>
      </div>
      <div @click="panel.showPeriod=!panel.showPeriod">
        <p>{{params3.period}} {{$t('exchange.exchange_day')}} <i :class="[!panel.showPeriod?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='staked' && panel.showPeriod">
          <li v-for="item in periods" @click="params3.period=item">{{item}} {{$t('exchange.exchange_day')}}</li>
        </ul>
      </div>
      <span class="ml30">{{$t('exchange.exchange_status')}}</span>
      <div @click="panel.showStatus=!panel.showStatus">
        <p>{{getStakedState(params3.status).value}} <i :class="[!panel.showStatus?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='staked' && panel.showStatus">
          <li v-for="item in stakedStatus" @click="params3.status=item">{{getStakedState(item).value}}</li>
        </ul>
      </div>
    </div>

    <div class="search mt10 ui-flex" v-show="show==='distributed'">
      <div @click="panel.showToken=!panel.showToken">
        <p>{{params4.token!==''?params4.token:$t('trade_record.trade_record_all')}} <i :class="[!panel.showToken?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='distributed' && panel.showToken">
          <li v-for="item in tokens" @click="params4.token=item">{{item!==''?item:$t('trade_record.trade_record_all')}}</li>
        </ul>
      </div>
      <div @click="panel.showPeriod=!panel.showPeriod">
        <p>{{params4.period}} {{$t('exchange.exchange_day')}} <i :class="[!panel.showPeriod?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='distributed' && panel.showPeriod">
          <li v-for="item in periods" @click="params4.period=item">{{item}} {{$t('exchange.exchange_day')}}</li>
        </ul>
      </div>
      <span class="ml30">{{$t('exchange.exchange_status')}}</span>
      <div @click="panel.showStatus=!panel.showStatus">
        <p>{{getDistributedState(params4.status).value}} <i :class="[!panel.showStatus?'icon-arrow-down2':'icon-arrow-up3']"></i></p>
        <ul v-show="show==='distributed' && panel.showStatus">
          <li v-for="item in rechargeStatus" @click="params4.status=item">{{getDistributedState(item).value}}</li>
        </ul>
      </div>
    </div>

    <div class="recharge" v-if="show==='deposit'">
      <ul class="header" v-if="!rechargeLoading && rechargeHistory.length > 0">
        <li>
          <span class="time">{{$t('account.user_center_history_receiveTime')}}<!--到账时间--></span>
          <span class="currency">{{$t('account.user_center_history_coin')}}<!--币种--></span>
          <!--<span class="id">{{$t('account.user_center_history_tradeID')}}&lt;!&ndash;交易ID&ndash;&gt;</span>-->
          <span class="address">{{$t('account.user_center_history_address')}}<!--转入地址--></span>
          <span class="progress">{{$t('account.user_center_history_progress')}}<!--区块进度--></span>
          <span class="quantity">{{$t('account.user_center_history_amount')}}<!--数量--></span>
          <span class="status">{{$t('account.user_center_history_status')}}<!--状态--></span>
        </li>
      </ul>
      <ul v-if="!rechargeLoading && rechargeHistory.length > 0">
        <li v-for="(item, index) in rechargeHistory" :key="index">
          <span class="time">{{item.competedAt ? new Date(Number(item.competedAt)).format() : '--'}}</span>
          <span class="currency">{{item.symbol}}</span>
          <!--<span class="id" :title="item.txId">{{item.txId}}</span>-->
          <span class="address" :title="item.fromAddress">{{item.fromAddress}}</span>
          <span class="progress">{{Math.min(item.confirmation < 0 ? 1 : item.confirmation, item.blockConfirm)}}/{{item.blockConfirm}}</span>
          <span class="quantity">{{toFixed(item.amount)}}</span>
          <span class="status" :class="getRechargeState(item.status)['className']">{{getRechargeState(item.status)['value']}}</span>
        </li>
      </ul>
      <page v-if="!rechargeLoading && rechargeHistory.length > 0" :pageIndex="params.page" :pageSize="params.show"
            :total="params.total" @changePageIndex="pageChange"/>
      <div class="nodata" v-if="!rechargeLoading && rechargeHistory.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('account.user_center_history_noDeposit')}}<!--暂无充值记录--></div>
      </div>
      <loading v-if="rechargeLoading"/>
    </div>

    <div class="recharge withdrawal" v-show="show==='withdrawal'">

      <ul class="header" v-if="!withdrawalLoading && withdrawalHistory.length > 0">
        <li>
          <span class="time">{{$t('account.user_center_history_sendTime')}}<!--发送时间--></span>
          <span class="currency">{{$t('account.user_center_history_coin')}}<!--币种--></span>
          <span class="id">{{$t('account.user_center_history_tradeID')}}<!--交易ID--></span>

          <span class="quantity">{{$t('account.user_center_history_amount')}}<!--数量--></span>
          <!--<span class="address">{{$t('account.user_center_history_address')}}&lt;!&ndash;转入地址&ndash;&gt;</span>-->
          <span class="status">{{$t('account.user_center_history_status')}}<!--状态--></span>

        </li>
      </ul>

      <ul v-if="!withdrawalLoading && withdrawalHistory.length > 0">
        <li v-for="(item, index) in withdrawalHistory" :key="index">
          <span class="time">{{item.updatedAt ? new Date(Number(item.updatedAt)).format() : '--'}}</span>
          <span class="currency">{{item.symbol}}</span>
          <span class="id" :title="item.txId">{{item.txId || '--'}}</span>

          <span class="quantity">{{toFixed(item.amount)}}</span>
          <!--<span class="address" :title="item.toAddress">{{item.toAddress}}</span>-->
          <span class="status" :class="getWithdrawalState(item.status)['className']">{{getWithdrawalState(item.status)['value']}}</span>

        </li>
      </ul>
      <page v-if="!withdrawalLoading && withdrawalHistory.length > 0" :pageIndex="params2.page" :pageSize="params2.show"
            :total="params2.total" @changePageIndex="pageChange2"/>
      <div class="nodata" v-if="!withdrawalLoading && withdrawalHistory.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('account.user_center_history_noWithdrawal')}}<!--暂无提现记录--></div>
      </div>
      <loading v-if="withdrawalLoading"/>
    </div>

    <div class="recharge withdrawal" v-show="show==='staked'">
      <ul class="header" v-if="!stakedLoading && stakedHistory.length > 0">
        <li>
          <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
          <span class="currency">{{$t('account.user_center_history_coin')}}<!--币种--></span>
          <span class="quantity">{{$t('account.staking_amount')}}<!--锁仓数量--></span>
          <span class="quantity">{{$t('account.staking_reward')}}<!--锁仓奖励--></span>
          <span class="status">{{$t('account.user_center_history_status')}}<!--状态--></span>

        </li>
      </ul>

      <ul v-if="!stakedLoading && stakedHistory.length > 0">
        <li v-for="(item, index) in stakedHistory" :key="index">
          <span class="time">{{item.updatedAt ? new Date(Number(item.updatedAt)).format() : '--'}}</span>
          <span class="currency">{{item.symbol}}</span>
          <span class="quantity">{{toFixed(item.amount) | removeEndZero}}</span>
          <span class="quantity">{{toFixed(item.amount) | removeEndZero}}</span>
          <span class="status" :class="getStakedState(item.status)['className']">{{getStakedState(item.status)['value']}}</span>

        </li>
      </ul>
      <page v-if="!stakedLoading && stakedHistory.length > 0" :pageIndex="params3.page" :pageSize="params3.show"
            :total="params3.total" @changePageIndex="pageChange3"/>
      <div class="nodata" v-if="!stakedLoading && stakedHistory.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('account.nostaking_history')}}<!--暂无锁仓记录--></div>
      </div>
      <loading v-if="stakedLoading"/>
    </div>

    <div class="recharge withdrawal" v-show="show==='distributed'">
      <ul class="header" v-if="!distributedLoading && distributedHistory.length > 0">
        <li>
          <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
          <span class="currency">{{$t('account.user_center_history_coin')}}<!--币种--></span>
          <span class="quantity">{{$t('account.distributed_amount')}}<!--分发数量--></span>
          <span class="status">{{$t('account.user_center_history_status')}}<!--状态--></span>
          <span class="note">{{$t('account.user_center_history_note')}}<!--备注--></span>

        </li>
      </ul>

      <ul v-if="!distributedLoading && distributedHistory.length > 0">
        <li v-for="(item, index) in distributedHistory" :key="index">
          <span class="time">{{item.updatedAt ? new Date(Number(item.updatedAt)).format() : '--'}}</span>
          <span class="currency">{{item.symbol}}</span>
          <span class="quantity">{{toFixed(item.amount) | removeEndZero}}</span>
          <span class="status" :class="getDistributedState(item.status)['className']">{{getDistributedState(item.status)['value']}}</span>
          <span class="note">{{item.note}}</span>

        </li>
      </ul>
      <page v-if="!distributedLoading && distributedHistory.length > 0" :pageIndex="params4.page" :pageSize="params4.show"
            :total="params4.total" @changePageIndex="pageChange4"/>
      <div class="nodata" v-if="!distributedLoading && distributedHistory.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('account.nodistributed_history')}}<!--暂无分发记录--></div>
      </div>
      <loading v-if="distributedLoading"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import userUtils from '@/api/wallet'
  import page from '@/components/page'
  import loading from '@/components/loading'
  import numUtils from '@/assets/js/numberUtils'

  export default {
    components: {
      page,
      loading
    },
    data () {
      return {
        show: 'deposit',
        params: {
          page: 1,
          show: 10,
          total: 0,
          token:'',
          period:7,
          status:''
        },
        params2: {
          page: 1,
          show: 10,
          total: 0,
          token:'',
          period:7,
          status:''
        },
        params3: {
          page: 1,
          show: 6,
          total: 0,
          token:'',
          period:7,
          status:''
        },
        params4: {
          page: 1,
          show: 6,
          total: 0,
          token:'',
          period:7,
          status:''
        },
        rechargeHistory: [],
        withdrawalHistory: [],
        stakedHistory: [],
        distributedHistory: [],
        rechargeLoading: true,
        withdrawalLoading: false,
        stakedLoading: false,
        distributedLoading: false,
        tokens:[],
        periods:[7,30,180],
        rechargeStatus:['', 1, 2],
        withdrawalStatus:['', 1, 2, 4, 5, 6],
        stakedStatus:['', 1, -2],
        panel:{
          showToken:false,
          showPeriod:false,
          showStatus:false
        }
      }
    },
    computed: {
      paramsChange () {
        return {
          direction: 1,
          page: this.params.page,
          pageSize: this.params.show,
          symbol: this.params.token,
          time: this.params.period+'days',
          status: this.params.status
        }
      },
      params2Change () {
        return {
          direction: 2,
          page: this.params2.page,
          pageSize: this.params2.show,
          symbol: this.params2.token,
          time: this.params2.period+'days',
          status: this.params2.status
        }
      },
      params3Change () {
        return {
          page: this.params3.page,
          pageSize: this.params3.show,
          symbol: this.params3.token,
          time: this.params3.period+'days',
          status: this.params3.status
        }
      },
      params4Change () {
        return {
          page: this.params4.page,
          pageSize: this.params4.show,
          symbol: this.params4.token,
          time: this.params4.period+'days',
          status: this.params4.status,
          direction:6
        }
      }
    },
    watch: {
      show(_new){
          this.panel.showToken = false
          this.panel.showPeriod = false
          this.panel.showStatus = false
          switch (_new){
            case 'deposit':
            this.rechargeHistory.length===0 && this.getListDepositHistory()
            break
            case 'withdrawal':
            this.withdrawalHistory.length===0 && this.getListWithdrawHistory()
            break
            case 'staked':
            this.stakedHistory.length===0 && this.findStakingRecords()
            break
            case 'distributed':
            this.distributedHistory.length===0 && this.findDistributedHistory()
            break
          }
      },
      'panel.showToken'(_new){
        if (_new) {
          this.panel.showPeriod = false
          this.panel.showStatus = false
        }
      },
      'panel.showPeriod'(_new){
        if (_new) {
          this.panel.showToken = false
          this.panel.showStatus = false
        }
      },
      'panel.showStatus'(_new){
        if (_new) {
          this.panel.showToken = false
          this.panel.showPeriod = false
        }
      },
      paramsChange () {
        this.getListDepositHistory()
      },
      params2Change () {
        this.getListWithdrawHistory()
      },
      params3Change () {
        this.findStakingRecords()
      },
      params4Change () {
        this.findDistributedHistory()
      }
    },
    created () {
      this.getAssets()
      this.getListDepositHistory()
    },
    methods: {
      getAssets(){
        userUtils.myAssets({}, (data) => {
          data = data.filter(item=>{return item.type===1})
          this.tokens = [''].concat(data.map(item=>{return item.symbol}))
        })
      },
      switch_tab (tab) {
        this.$emit('switchTab', tab)
      },
      getListDepositHistory () { // 获取充值记录
        this.rechargeLoading = true
        let data = this.paramsChange
        userUtils.listDepositHistory(this.paramsChange, (res) => {
          this.rechargeHistory = res.data
          this.params.total = res.total
          this.rechargeLoading = false
        }, (msg) => {
          this.rechargeLoading = false
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      getListWithdrawHistory () { // 获取提现记录
        this.withdrawalLoading = true
        userUtils.listDepositHistory(this.params2Change, (res) => {
          this.withdrawalHistory = res.data
          this.params2.total = res.total
          this.withdrawalLoading = false
        }, (msg) => {
          this.withdrawalLoading = false
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      findStakingRecords () { // 获取锁仓记录
        this.stakedLoading = true
        userUtils.findStakingRecords(this.params3Change, (total, data) => {
          this.stakedHistory = data
          this.params3.total = total
          this.stakedLoading = false
        }, (msg) => {
          this.stakedLoading = false
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      findDistributedHistory () { // 获取分发记录
        this.stakedLoading = true
        userUtils.findDistributedHistory(this.params4Change, (total, data) => {
          this.distributedHistory = data
          this.params4.total = total
          this.stakedLoading = false
        }, (msg) => {
          this.stakedLoading = false
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      getRechargeState (state) { // 获取充值状态
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
            value: this.$t('trade_record.trade_record_all') // 全部
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
              value: this.$t('trade_record.trade_record_all') // 全部
            }
        }
      },
      getStakedState (state) { // 获取锁仓状态
        if (state === -2) {
          return {
            className: 'fail',
            value: this.$t('account.user_center_history_status_fail') // 失败
          }
        } else if (state === 1) {
          return {
            className: 'success',
            value: this.$t('account.user_center_history_status_success') // 成功
          }
        } else {
          return {
            className: null,
            value: this.$t('trade_record.trade_record_all') // 全部
          }
        }
      },
      getDistributedState (state) { // 获取分发状态
        if (state === 1) {
          return {
            className: 'fail',
            value: this.$t('account.user_center_history_status_unissued') // 未发放
          }
        } else if (state === 2) {
          return {
            className: 'success',
            value: this.$t('account.user_center_history_status_issued') // 已发放
          }
        } else {
          return {
            className: null,
            value: this.$t('trade_record.trade_record_all') // 全部
          }
        }
      },
      pageChange (currentIndex) {
        this.params.page = currentIndex
      },
      pageChange2 (currentIndex) {
        this.params2.page = currentIndex
      },
      pageChange3 (currentIndex) {
        this.params3.page = currentIndex
      },
      pageChange4 (currentIndex) {
        this.params4.page = currentIndex
      },
      toFixed (v1) {
        return numUtils.BN(v1).toFixed(8)
      }
    }
  }
</script>

<style scoped lang="less">
  .history-record{
    padding: 14px 18px 60px;
    background-color: rgba(27, 26, 31, 0.9);
    padding-bottom: 30px;
    color: #d8d8da;
    .history_nav{
      font-size: 14px;
      width: 100%;
      height: 33px;
      position: relative;
      margin-top: 20px;
      border-bottom: 1px solid hsla(240,4%,95%,.1);
      label{
        position: relative;
        padding-bottom: 12px;
        margin-right: 70px;
        display: inline-block;
        &.active{
          color: #00a0e9;
          margin-bottom: -1px;
          border-bottom: 2px solid #00a0e9;
          cursor: pointer;
        }
      }
    }
  }
  .recharge, .withdrawal {
    margin-top: 20px;
  }

  .recharge h3, .withdrawal h3 {
    height: 55px;
    padding-left: 20px;
    font-weight: normal;
    font-size: 18px;
    line-height: 55px;
    color: #333;
    text-indent: 8px;
    /*border-bottom: 1px solid #e7e7e7;*/
    position: relative;
  }

  .recharge h3 a {
    position: absolute;
    top: 0;
    right: 25px;
    bottom: 0;
    font-weight: normal;
    font-size: 14px;
    line-height: 55px;
    color: #5A8DF2;
  }

  .recharge h3 a:hover {
    color: #1c55c5;
  }

  .recharge ul {
    padding-left: 20px;
    padding-right: 20px;
  }

  .recharge ul.header {
    /*background: #F5F5F5;*/
  }

  .recharge ul li {
    display: flex;
    justify-content: space-between;
    min-height: 40px;
    line-height: 40px;
  }

  .recharge ul.header li {
    border-bottom: none;
  }

  .recharge ul.header li span {
    color: #979799;
  }

  .recharge ul li span.id {
    width: 170px;
    padding-right: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .recharge ul li span.currency {
    width: 80px;
  }

  .recharge ul li span.quantity {
    width: 160px;
  }

  .recharge ul li span.address {
    width: 190px;
    padding-right: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .recharge ul li span.progress {
    width: 120px;
  }

  .recharge ul li span.status {
    width: 80px;
  }

  .recharge ul li span.time {
    width: 140px;
  }

  .recharge ul li span.status.underway {
    color: #F49651;
  }

  .recharge ul li span.status.fail {
    color: #FF5F5F;
  }

  .recharge ul li span.status.success {
    color: #6FD477;
  }

  .nodata {
    text-align: center;
    /*background: #FFF;*/
  }

  .nodata .nodata-icon {
    height: 80px;
    line-height: 80px;
    font-size: 40px;
    color: #A1A1A1;
  }

  .nodata .nodata-text {
    height: 40px;
    line-height: 20px;
    color: #A1A1A1;
  }

.search {
  > span {line-height: 24px;}
  > div {
      line-height: 25px;
      position: relative;
      &+div {margin-left: 30px;}
      > p {border-bottom: 1px solid hsla(240, 4%, 95%, 0.1); padding-left: 15px; padding-right: 15px; cursor: pointer;  position: relative; display: inline-block; min-width: 100px; }
      > p i {position: absolute; right: 15px; top: 6px;}
      > ul {
        position: absolute; left: 0; right: 0; background-color: #212028; box-shadow: 1px 1px 3px rgba(0,0,0,.3); max-height: 400px; overflow-y: auto; z-index: 1;
        li {line-height: 35px; padding-left: 15px; padding-right: 15px; cursor: pointer;}
        li:hover {background-color: #292831;}
        li.active {color: #00a0e9; background-color: #292831;}
      }
    }
}
</style>

