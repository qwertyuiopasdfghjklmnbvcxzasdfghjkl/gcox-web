<template>
  <div class="ad-container">
    <ul class="ad-tabs">
        <li class="ad-tabs-item" :class="{active:active==='current'}" @click="active='current'">
            {{$t('public0.public155')}}<!--当前广告-->
        </li>
        <li class="ad-tabs-item" :class="{active:active==='history'}" @click="active='history'">
            {{$t('public0.public156')}}<!--历史广告-->
        </li>
    </ul>
    <div class="ad-wrap" v-if="getApiToken">
      <div class="ad-box ad-box-current" v-if="active==='current'">
        <ul class="ad-list ad-list-current" v-if="!currentLoading && cDatas.length > 0">
            <li class="ad-list-item">
                <span class="ad-list-item-coin">{{$t('account.estimated_value_coin')}}<!--币种--></span>
                <span class="ad-list-item-type">{{$t('exchange.exchange_type')}}<!--类型--></span>
                <span class="ad-list-item-limit">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
                <span class="ad-list-item-price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
                <span class="ad-list-item-surplus">{{$t('message.msg_surplus')}}<!--剩余--></span>
                <span class="ad-list-item-status">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
                <span class="ad-list-item-operate">{{$t('otc_exchange.otc_exchange_operating')}}</span>
            </li>
            <li class="ad-list-item" v-for="item in cDatas" :key="item.ad_id">
                <span class="ad-list-item-coin">{{item.symbol}}</span>
                <span class="ad-list-item-type" :class="[item.ad_type === 2 ? 'sell' : 'buy']">{{$t(item.ad_type === 2 ? 'exchange.exchange_sell' : 'exchange.exchange_buy')}}</span>
                <span class="ad-list-item-limit">{{item.min_amount}}-{{item.max_amount}} {{item.ad_type === 2 ? item.currency : item.symbol}}</span>
                <span class="ad-list-item-price">{{item.cur_price}} {{item.currency}}</span>
                <span class="ad-list-item-surplus">{{item.remain_count}} {{item.symbol}}</span>
                <span class="ad-list-item-status">{{$t(item.status===1?'public0.public51':'public0.public52')}}</span>
                <span class="ad-list-item-operate">
                  <input class="ad-list-item-btn" v-if="item.status===1" type="button" :value="$t('otc_ad.otc_cancel_ad')" @click="deleteAd(item.ad_id)"/>
                  <input class="ad-list-item-btn" v-if="item.status===0" type="button" :value="$t('otc_ad.otc_edit_ad')" @click="updateAd(item)"/>
                </span>
            </li>
        </ul>
        <div class="ad-nodata" v-if="!currentLoading && cDatas.length === 0">
          <div class="ad-nodata-icon icon-no-order"></div>
          <div class="ad-nodata-text">{{$t('public0.public147')}}<!--暂无广告--></div>
        </div>
        <loading v-if="currentLoading"/>
      </div>
      <div class="ad-box ad-box-history" v-if="active==='history'">
        <ul class="ad-list ad-list-history" v-if="!historyLoading && hDatas.length > 0">
            <li class="ad-list-item">
                <span class="ad-list-item-coin">{{$t('account.estimated_value_coin')}}<!--币种--></span>
                <span class="ad-list-item-type">{{$t('exchange.exchange_type')}}<!--类型--></span>
                <span class="ad-list-item-limit">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
                <span class="ad-list-item-price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
                <span class="ad-list-item-amount">{{$t('exchange.exchange_amount')}}<!--数量--></span>
                <span class="ad-list-item-status">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
            </li>
            <li class="ad-list-item" v-for="item in hDatas" :key="item.id">
                <span class="ad-list-item-coin">{{item.symbol}}</span>
                <span class="ad-list-item-type" :class="[item.ad_type === 2 ? 'sell' : 'buy']">{{$t(item.ad_type === 2 ? 'exchange.exchange_sell' : 'exchange.exchange_buy')}}</span>
                <span class="ad-list-item-limit">{{item.min_amount}}-{{item.max_amount}} {{item.ad_type === 2 ? item.currency : item.symbol}}</span>
                <span class="ad-list-item-price">{{item.cur_price}} {{item.currency}}</span>
                <span class="ad-list-item-amount">{{item.symbol_count}} {{item.symbol}}</span>
                <span class="ad-list-item-status">{{$t('otc_ad.otc_ad_completed')}}</span>
            </li>
        </ul>
        <page v-if="!historyLoading && hDatas.length > 0" :pageIndex="formData.page" :pageSize="formData.show" :total="formData.total" @changePageIndex="pageChange"/>
        <div class="ad-nodata" v-if="!historyLoading && hDatas.length === 0">
          <div class="ad-nodata-icon icon-no-order"></div>
          <div class="ad-nodata-text">{{$t('public0.public147')}}<!--暂无广告--></div>
        </div>
        <loading v-if="historyLoading"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import loading from '@/components/loading'
import page from '@/components/page'
import createorder from '@/otc/otchome/createorder'
export default {
  props: ['params'],
  components: {
    loading,
    page
  },
  data () {
    return {
      active: 'current',
      cDatas: [],
      hDatas: [],
      formData: {
        page: 1,
        show: 6,
        total: 0
      },
      currentLoading: true,
      historyLoading: true
    }
  },
  computed: {
    ...mapGetters(['getApiToken'])
  },
  watch: {
    getApiToken () {
      this.getList()
    },
    active () {
      this.getList()
    },
    'params.newAdCount' () {
      this.getList()
    },
    'formData.page' () {
      this.getList()
    }
  },
  created () {
    this.getList()
    this.$nextTick(() => {
      this.addEvents({
        name: 'updateMyAds',
        fun: this.getList
      })
    })
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy () {
    this.removeEvents('updateMyAds')
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents']),
    systemEvent (data) {
      let optType = parseInt(data.operate_type)
      let childType = parseInt(data.child_type)
      if (optType === 1) { // 系统消息
        switch (childType) {
          case 35: // 正常放币消息
          case 36: // 强制放币买家消息
          case 37: // 强制放币卖家消息
            // 更新我的广告列表
            this.getList()
            break
        }
      }
    },
    getList () {
      if (this.active === 'current') {
        this.getCurAdList()
      } else if (this.active === 'history') {
        this.getHistoryList()
      }
    },
    getCurAdList () { // 获取当前广告
      if (!this.getApiToken) {
        return
      }
      this.cDatas = []
      this.currentLoading = true
      otcApi.getMyAdvertisementList({
        ad_type: 0,
        symbol: null
      }, (res) => {
        res.forEach((item) => {
          // 类型转换
          item.status = parseInt(item.status)
          item.ad_type = parseInt(item.ad_type)
          item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
          if (item.ad_type === 2) {
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
          } else {
            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
          }
          item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
        })
        this.cDatas = res
        this.currentLoading = false
      }, (msg) => {
        this.currentLoading = false
        console.error(msg)
      })
    },
    getHistoryList () { // 获取历史广告
      if (!this.getApiToken) {
        return
      }
      this.hDatas = []
      this.historyLoading = true
      otcApi.getHistoryAdList(this.formData, (res) => {
        res.data.forEach((item) => {
          // 类型转换
          item.status = parseInt(item.status)
          item.ad_type = parseInt(item.ad_type)
          item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
          if (item.ad_type === 2) {
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
          } else {
            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
          }
          item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
        })
        this.hDatas = res.data
        this.formData.total = res.total
        this.historyLoading = false
      }, (msg) => {
        this.historyLoading = false
        console.error(msg)
      })
    },
    deleteAd (id) { // 下架广告
      otcApi.deleteAdvertisement(id, (msg) => {
        this.params.newAdCount--
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        this.getList()
      }, (msg) => {
        Vue.$confirmDialog({showCancel: false, content: this.$t(`error_code.${msg}`)})
      })
    },
    updateAd (obj) { // 修改广告
      otcApi.getVerifyState((msg) => {
        otcApi.getPaySettings((res) => {
          this.params.symbol = obj.symbol
          utils.setDialog(createorder, {
            id: 'dialog_createorder',
            myPayType: res.data.pay_type,
            params: this.params,
            ad_id: obj.ad_id,
            okCallback: () => {
              this.$emit('goToSettings')
            }
          })
        }, (res) => {
          if (res.msg === 'NO_PAY_TYPE') {
            Vue.$confirmDialog({
              content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
              okCallback: () => {
                this.$emit('goToSettings')
                this.$emit('removeDialog')
              }
            })
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
          }
        })
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          Vue.$confirmDialog({
            content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            okCallback: () => {
              this.$emit('goToMyCenter')
              this.$emit('removeDialog')
            }
          })
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    pageChange (currentIndex) {
      this.formData.page = currentIndex
    }
  }
}
</script>

<style scoped>
.ad-container{position:relative;background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.ad-tabs{display:flex;height: 49px;padding: 0 20px;border-bottom:1px solid #eee;}
.ad-tabs-item{height:48px;line-height:48px;margin-right:40px;margin-bottom:-1px;color:#666;border-bottom:2px solid transparent;cursor:pointer;}
.ad-tabs-item.active{color: #3283FF;border-bottom-color: #3283FF;}
.ad-tabs-item:hover {color: #3283FF;}
.ad-list{display:flex;flex-flow:column;padding: 0 20px 24px 20px;}
.ad-list-history{padding-bottom: 0;}
.ad-list-item{display:flex;justify-content:space-between;height: 40px;line-height: 40px;color: #333;border-bottom: 1px solid #eee;cursor: pointer;}
.ad-list-item span{font-size:12px;color:#333;}
.ad-list-item:first-of-type span{color:#999;}
.ad-list-item-coin{width:60px;}
.ad-list-item-type{width:60px;}
.ad-list-item-limit{width:260px;}
.ad-list-item-price{width:130px;}
.ad-list-item-surplus{width:160px;}
.ad-list-item-amount{width:160px;}
.ad-list-item-status{width:100px;}
.ad-list-item-operate{width:80px;}
.ad-list-item-type.buy{color:#23CD09;}
.ad-list-item-type.sell{color:#F34246;}
.ad-list-item-btn{height:25px;margin-top:8px;color:#fff;vertical-align:top;background-color:transparent;border: 1px solid #3283FF; border-radius:4px;cursor:pointer; color: #3283FF;}
.ad-list-item-btn:hover{border-color:#2565c5; color: #2565c5;}
.ad-nodata{text-align: center;}
.ad-nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.ad-nodata-text{height: 40px;line-height: 20px;color: #8b94a9;}
</style>
