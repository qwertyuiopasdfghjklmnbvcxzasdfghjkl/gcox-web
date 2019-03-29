<template>
  <div class="page">
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="content">
      <h1>{{symbol}} {{$t('account.estimated_value_withdrawal')}}<!--提现--></h1>
      <ul class="payment-detail">
        <li>
          <label class="aumont">{{$t('account.estimated_value_available')}}<!--可用余额--></label>
          <p class="aumont">{{symbolInfo.availableBalance}} {{symbol}}</p>
          <label class="address">{{$t('account.user_Pick_up_address')}}<!--提现地址--></label>
          <p class="address">
            <input type="text" v-validate="'required'" name="selToAddress" maxlength="100" v-model="toAddress" :placeholder="$t('public0.public45')" @focus="getUserAddress"/>
            <i class="scanning" v-tap="{methods: scanQRCode}"></i>
            <span class="user-address" v-show="!toAddress && userAddress" @click="toAddress = userAddress">{{userAddress}}</span>
          </p>
        </li>
        <li v-if="symbol==='EOS'">
          <p>{{$t('account.user_center_history_note')}}<!--提现备注--></p>
          <p><input type="text" maxlength="1000" v-model="memo" :placeholder="'Memo,'+$t('public0.public237')" /></p>
        </li>
        <li>
          <p>{{$t('account.user_Draw_the_number')}}<!--提现数量--></p>
          <p><input type="number" v-model="amount" v-validate="'required|isLessMin|isMoreMax'" name="amount" :placeholder="$t('account.user_minimum_number_of_cash').format(`：${minWithdraw} ${symbol}`)"><!--最小提现数量为：{0} {symbol}。--></p>
        </li>
        <li>
          <h4>{{$t('exchange.advanced_fee')}}<!--手续费--></h4>
          <h4>{{procedureFee}} {{symbol}}</h4>
          <h4>{{$t('account.user_Actual_arrival')}}<!--实际到账--></h4>
          <h4>{{lastMount}} {{symbol}}</h4>
        </li>
      </ul>
      <div class="info">
        <div class="inner">
          <section class="with_bootom">
            <section class="inner">
              <h1>{{$t('public0.public243')}}：<!--温馨提示--></h1>
              <ul>
                <li>● {{$t('account.user_prompt7')}}<!--请勿直接提现至众筹或 ICO 地址。我们不会处理未来代币的发放。--></li>
                <li>● {{$t('account.user_prompt8')}}<!--提现请求申请成功后，请去邮箱点击链接确认本次提现请求。--></li>
                <li>● {{$t('public0.public229')}}<!--您可以在充值提现历史记录页面跟踪状态。--></li>
              </ul>
            </section>
          </section>
        </div>
      </div>
      <div class="bottom" >
        <button class="mint-button mint-button--primary mint-button--large" v-tap="{methods: walletWithdraw}">{{$t('account.estimated_value_withdrawal')}}<!--提现--></button>
      </div>
    </div>
    <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
      <confirm ref="confirm" :params="params1" @removeDialog="removeDialog"></confirm>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Validator } from 'vee-validate'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import userUtils from '@/api/wallet'
import confirm from '@/pages/wallet/confirm'
import cordovaUtils from '@/assets/js/cordovaUtils'
export default {
  name: 'page-withdrawal',
  components: {
    confirm
  },
  data () {
    return {
      placeOrderVisible: false,
      value: 'optionA',
      fromAddress: '',
      symbol: '',
      availableBalance: null,
      procedure: '',
      amount: null,
      showNewAddress: false,
      toAddress: '',
      data: [],
      mobileState: null,
      userAddress: null,
      memo:''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    params1 () {
      return {
        fromAccount: this.symbolInfo.accountId,
        selToAddress: this.toAddress,
        amount: this.amount,
        symbol: this.$route.params.symbol,
        symbolType: this.symbolInfo.symbolType,
        phoneNumber: this.getUserInfo.mobile,
        countryCode: this.getUserInfo.countryCode || '+86',
        memo: this.memo
      }
    },
    msgs () {
      return {
        selToAddress: {required: this.$t('public0.public44')}, // 请选择地址或使用新地址
        amount: {required: this.$t('public0.public46')} // 请输入提现金额
      }
    },
    symbolInfo () {
      for (let i = 0; i < this.data.length; i++) {
        let d = this.data[i]
        if (this.$route.params.symbol === d.symbol) {
          return d
        }
      }
      return {}
    },
    procedureFee () { // 手续费 提现数量-固定手续费
      return utils.removeEndZero(numUtils.BN(this.symbolInfo.procedureFee).toFixed(8))
    },
    lastMount () { // 实际到账
      if (this.amount === null || this.amount === 0) {
        return 0
      } else {
        let m = numUtils.minus(this.amount, this.procedureFee)
        if (m.lt(0)) {
          return 0
        } else {
          return utils.removeEndZero(m.toFixed(8, 1))
        }
      }
    },
    minWithdraw () {
      return utils.removeEndZero(numUtils.BN(this.symbolInfo.minWithdraw).toFixed(8))
    },
    isLessMin () { // 是否小于最小额度
      return numUtils.BN(this.amount).gte(numUtils.BN(this.minWithdraw))
    },
    isMoreMax () { // 是否大于可用余额
      return numUtils.BN(this.amount).lte(numUtils.BN(this.symbolInfo.availableBalance))
    }
  },
  watch: {
    amount (newVal) {
      if (newVal.length > 18) {
        this.$nextTick(() => {
          this.amount = newVal.substring(0, 18)
        })
      }
    },
    placeOrderVisible (val) {
      let self = this
      if (val) {
        this.$nextTick(() => {
          setTimeout(() => {
            self.$refs.confirm.$el.querySelector('input').focus()
          }, 100)
        })
      }
    }
  },
  created () {
    this.symbol = this.$route.params.symbol
    Validator.extend('isLessMin', {
      getMessage: (field, args) => this.$t('account.user_minimum_number_of_cash').format(`${this.minWithdraw}${this.symbol}`),
      validate: (files, args) => {
        return this.isLessMin
      }
    })
    Validator.extend('isMoreMax', {
      getMessage: (field, args) => this.$t('public0.public47').format(`${this.symbolInfo.availableBalance}${this.symbol}`), // 提现额度不能大于可用余额：{0}
      validate: (files, args) => {
        return this.isMoreMax
      }
    })
    this.getWalletByCoin()
  },
  methods: {
    scanQRCode () {
      cordovaUtils.scanQRCode((addr) => {
        this.toAddress = addr
      })
    },
    removeDialog () {
      this.placeOrderVisible = false,
      this.$router.push({name: 'page-wallet'})
    },
    getUserState () {
      // 获取当前用户状态信息
      userApi.getUserState((data) => {
        this.mobileState = data.mobileAuthState
      }, (msg) => {
        console.error(msg)
      })
    },
    getWalletByCoin () {
      userUtils.myAssets({}, (res) => {
        res = res.filter(item=>{
          return item.type===1
        })
        this.data = res
      })
    },
    walletWithdraw () {
      var validData = {
        selToAddress: this.toAddress,
        amount: this.amount,
        fromAccount: this.data.fromAccount,
      }
      this.$validator.validateAll(validData).then((validResult) => {
        if (!validResult) {
        let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
        return
        }
        this.placeOrderVisible = true
      })
    },
    getUserAddress () {
      userUtils.listWithdraws(this.symbol, (data) => {
        this.userAddress = data ? data.address : null
      }, (msg) => {
        console.error(msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.place_order_popup{width: 100%;background: #1b1e2e;}
  @font_color_transparent: #cbd4ec;
  .c-button-normal{
    display: inline-block;
    padding: 0 .12rem;
    width: 100%;
  }

  
  .content {
    h1{
      padding: .3rem;
      color: #ffffff;
    }
  }
  .header{
    font-size: .32rem;
    color: @font_color_transparent;
  }

  .payment-detail {
    li {
      color: #8089a3;
      margin-left: 0.3rem;
      margin-right: 0.3rem;
      border-top: .02rem solid #8089a3;
      padding: 0.3rem 0 0rem;
      list-style: none;
      &:first-of-type {
        border-top: none;
      }
      h1 {
        font-size: .36rem;
        padding-bottom: .45rem;
      }
      h2{
        font-size: .22rem;
      }
      h3 {
        position: relative;
        font-size: 0.32rem;
        padding-top: 0.2rem;
        span {
          position: absolute;
          right: 0;
          color: #FF3366;
          font-weight: bold;
        }
      }
      p {
        position: relative;
        line-height: 0.5rem;
        font-size: 0.24rem;
        &:last-of-type {
          color: #cbd4ec;
        }
        input{
          width: 100%;
          font-size: 0.24rem;
          background-color: transparent;
          border: none;
          color: #fff;
          &:focus {

          }
        }
        input::placeholder {
          color: #8089a3;
        }
        span {
          position: absolute;
          right: 0;
          color: #CCC;
        }
      }
      &:last-of-type {
        border-bottom: none;
      }
      > ul > li {
        margin-left: 0;
        margin-right: 0;
      }
      textarea {
        width: 100%;
        font-size: 0.24rem;
        background-color: transparent;
        border: 1px solid #ccc;
        color: #666666;
        padding: 0.15rem 0.1rem;
        height: 1.5rem;
        resize:none;
        &:focus {

        }
      }
    }
    li:nth-of-type(1){
      padding-top: 0;
      label {
        display: block;
        height: .4rem;
        line-height: .4rem;
        &.address {
          margin-top: .3rem;
        }
      }
      p {
        &.aumont {
          color: #fff;
        }
        &.address {
          span {
            position: absolute;
            top: .52rem;
            left: 0;
            z-index: 1;
            width: 100%;
            height: .5rem;
            padding-left: .2rem;
            padding-right: .2rem;
            line-height: .5rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            background-color: #292929;
            overflow: hidden;
          }
        }
      }
    }
    li:nth-of-type(3){
      font-size: .24rem;
      h4{
        line-height: .4rem;
      }
      h4:nth-child(add){
        font-size: .22rem;
      }
      h4:nth-child(even){
        font-size: .3rem;
        text-align: right;
        color: #fff;
      }
    }
  }

  .scanning {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    right: 0;
    top: 0px;
    background:  url('../../assets/img/i_scanning.png') no-repeat center;
    background-size: auto 100%;
  }

  .step-next {
    background-color: #f9f9f9;
    font-size: .36rem;
    .mint-button{
      font-size: .36rem;
    }
    button{
      height: .9rem;
    }
    &.fixed {
      position: fixed;
      left: 0.3rem;
      right: 0.3rem;
      bottom: 0rem;
      margin-top: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }
    .info{
      .with_bootom{
        background-color: #292929;
        >.inner{
          padding: .1rem;

        }
      }
      border-radius: .01rem;
      >.inner{
        padding: .3rem;
      }
      h1{
        color: #8089a3;
        text-align: left;
        font-size: .24rem;
      }
      ul li{
        color: #8089a3;
        font-size: .24rem;
        text-align: left;
        line-height: .5rem;
      }
    }

  .bottom{
    width: 100%;
    text-align: center;
    padding:0 .3rem
  }
</style>
