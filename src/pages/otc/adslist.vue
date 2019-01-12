<!--广告列表-->
<template>
    <section class="coin_content">
        <div class="item" v-for="(data, index) in datas" :key="index">
            <div class="inner">
                <ul class="item">
                    <li>
                        <section>
                            <i class="i_eth"></i>
                            <span>{{data.nickname||data.username}}</span>
                        </section>
                        <section></section>
                        <section class="right">
                            <span>{{$t('otc_ad.otc_ad_Praise')}}<!--好评率--> {{Math.floor(data.user_level||0)}}%</span>
                        </section>
                    </li>
                    <li>
                        <section>
                            <span class="color-758">{{$t('message.msg_surplus')}}<!--剩余量--></span>
                            <span>{{data.remain_count||0}} {{data.symbol}}</span>
                        </section>
                        <section>{{tradeParams.price}}<!--单价--></section>
                    </li>
                    <li>
                        <section>
                            <span class="color-758">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
                            <span>{{data.min_amount}} - {{data.max_amount}}</span>
                            <span>{{tradeParams.limit}}</span>
                        </section>
                        <section>{{(data.cur_price||0).toString().toMoney()}} {{data.currency}}</section>
                    </li>
                    <li>
                        <section>
                            <i class="i_bank" v-if="(data.pay_type||'').indexOf('1') !== -1"></i>
                            <i class="i_alipay" v-if="(data.pay_type||'').indexOf('2') !== -1"></i>
                            <i class="i_wechat" v-if="(data.pay_type||'').indexOf('3') !== -1"></i>
                            <i class="i_paypal" v-if="(data.pay_type||'').indexOf('4') !== -1"></i>
                        </section>
                        <section>
                            <button class="c-button c-button-normal c-button-blue" :class="{disabled: getUserInfo.username === data.username}" @click="placeOrderClick(data)">{{tradeParams.tradeTxt}}</button>
                        </section>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { MessageBox, Indicator } from 'mint-ui'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
export default {
  name: 'adslist',
  props: ['params'],
  data () {
    return {
      datas: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
    paramsChange () {
      return {
        ad_type: this.params.ad_type,
        symbol: this.params.symbol,
        currency: this.params.currency,
        pay_type: this.params.pay_type,
        sort_mode: this.params.sort_mode,
        page: this.params.page,
        show: this.params.show
      }
    },
    tradeParams () {
      if (this.paramsChange.ad_type === 2) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          price: this.$t('otc_exchange.otc_exchange_ask'), // 单价
          limit: this.params.currency // 交易限额
        }
      } else {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          price: this.$t('otc_exchange.otc_exchange_bid'), // 单价
          limit: this.params.symbol // 交易限额
        }
      }
    }
  },
  watch: {
    paramsChange () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 获取广告列表
      this.datas = []
      Indicator.open()
      otcApi.getAdvertisementList(this.paramsChange, (res) => {
        Indicator.close()
        res.data.forEach((item) => { // 广告列表数据格式化处理
          item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
          if (this.params.ad_type === 2) {
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
          } else {
            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
          }
          item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
        })
        this.datas = res.data
        this.params.total = res.total
      }, (msg) => {
        Indicator.close()
        console.error(msg)
      })
    },
    checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
      if (!this.getApiToken) {
        Tip({type: 'danger', message: this.$t(message)})
        return
      }
      otcApi.getVerifyState((msg) => {
        if (isCheckPaySet) {
          otcApi.getPaySettings((res) => {
            if (isCheckPayType) {
              otcApi.matchPayTypes(id, (data2) => {
                this.matchPayType = data2
                successCallback && successCallback()
              }, (msg3) => {
                if (msg3 === 'PAY_TYPE_UNMATCH') {
                  // 支付方式不匹配，请设置对应的支付方式
                  MessageBox.confirm(this.$t('error_code.PAY_TYPE_UNMATCH')).then((action) => {
                    this.$router.push({name: 'page-payway'})
                  }, (cancel) => {})
                } else {
                  Tip({type: 'danger', message: this.$t(`error_code.${msg3}`)})
                }
              })
            } else {
              successCallback && successCallback(res.data.pay_type)
            }
          }, (res) => {
            if (res.msg === 'NO_PAY_TYPE') {
              // 请先设置支付方式
              MessageBox.confirm(this.$t('error_code.SET_PAY_TYPE_FIRST')).then((action) => {
                this.$router.push({name: 'page-payway'})
              }, (cancel) => {})
            } else {
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            }
          })
        } else {
          successCallback && successCallback()
        }
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm')
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-realname'})
            }
          })
        } else {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    placeOrderClick (item) {
      if (this.getUserInfo.username === item.username) {
        return
      }
      let isCheckPaySet = parseInt(item.ad_type) === 1
      this.matchPayType = parseInt(item.ad_type) === 1 ? void 0 : item.pay_type
      this.checkSetState(() => {
        this.$emit('placeOrderClick', item)
      }, 'public0.public15', isCheckPaySet, true, item.ad_id)
    }
  }
}
</script>

<style lang="less" scoped>
  @color-758: #7586a3;
  .color-758{color:#7586a3}
  .coin_content{
    .item{
      margin-top: 0;
    }
    font-size: .24rem;
    ul{
      border-top:1px solid #f2f3f8;
      padding: .2rem;
      background-color: #fff;
      border-radius:.05rem;
      // box-shadow: 0px 3px 30px 0px rgba(14, 14, 14, 0.35);
      li{
        display: flex;
        justify-content: space-between;
        span{
          line-height: .4rem;
          vertical-align: middle;
        }
        i{
          height: .4rem;
        }
        i.i_eth{
          display: inline-block;
          width: .4rem;
          left: 0.3rem;
          background: url('../../assets/img/icon-otc.png') no-repeat center;
          background-size: contain;
          text-align: center;
          padding-top: .04rem;
          color: white;
          font-style: normal;
          margin-right: 0.1rem;
          vertical-align: middle;
        }
      }
      li:nth-child(1){
        section:first-child{
          color: #333;
          font-size: .28rem,
        }
        section:last-child{
          color: #999;
        }
      }
      li:nth-child(2){
        margin-top: .2rem;
        section:first-child{
          span:nth-child(n+2){
            color: #7586a3;
          }
        }
        margin-top: .3rem;
      }
      li:nth-child(3){
        margin-top: .1rem;
        section:first-child{
          span:nth-child(n+2){
            color: #7586a3;
          }
        }
        section:last-child{
          font-size: .32rem;
          color: #0072fd;
        }
      }
      li:nth-child(4){
        margin-top: .1rem;
        section:first-child{
          i{
            display: inline-block;
            width: .3rem;
            height: .3rem;
            margin-top: .15rem;
            margin-right: .2rem;
          }
          i.i_bank{
            background: url('../../assets/img/icon-bank.png') no-repeat center;
            background-size: 100% 100%;
          }
          i.i_alipay{
            background: url('../../assets/img/icon-alipay.png') no-repeat center;
            background-size: 100% 100%;
          }
          i.i_wechat{
            background: url('../../assets/img/icon-wechat.png') no-repeat center;
            background-size: 100% 100%;
          }
          i.i_paypal{
            background: url('../../assets/img/icon-paypal.png') no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .c-button{
    height: .6rem;
    font-size: .24rem;
    border-width: 0;
    border-radius: 4px;
  }
  .c-button.disabled{
    background-color: #8089A3;
  }
  .c-button-normal{
    display: inline-block;
    width: 2rem;
    padding-left: .2rem;
    padding-right: .2rem;
  }
  .c-button-green{
    color: #fff;
    background-color: #00cc99;
  }
  .c-button-orange{
    color: #fff;
    background-color: #e76d42;
  }
  .c-button-blue{
    color: #fff;
    background-color: #0072fd;
  }
</style>
