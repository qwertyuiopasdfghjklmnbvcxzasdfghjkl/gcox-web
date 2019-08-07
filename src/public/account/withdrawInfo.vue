<template>
  <div ref="withdrawBox" class="withdrawBox" @click="showDropdown=false;showSymbol=false">
    <div class="koall-verify-all">
      <div class="koall-verify-title">
        <router-link :to="'/account/digassets'">{{$t('usercontent.user58')}}<!--我的资产--></router-link>
        >
        <span>{{$t('account.estimated_value_withdrawal')}}<!--提现--></span>
      </div>
      <div>
        <p class="tbsm">
          <span>{{$t('usercontent.description')}} </span>
          <span style="padding-left:4px ">{{$t('usercontent.description-text')}}</span>
        </p>
      </div>
      <div class="input-box">
        <div class="filed symbol">
          <em>
            {{$t('usercontent.user86')}}
          </em>
          <div class="withAdress">
            <p class="drown" @click.stop="showSymbol=!showSymbol">{{symbol}}</p>
            <ul v-show="showSymbol">
              <li v-for="item in allData"
                  @click.prevent="changeW(item)"
                  :class="{active: item.symbol === symbol}">{{item.symbol}}
              </li>
            </ul>
          </div>
        </div>
        <div class="filed">
          <em>
            {{$t('account.user_Pick_up_address').format(symbol)}}<!--提现地址-->
          </em>
          <div class="withAdress" style="position:relative;" :class="{error:errors.has('selToAddress')}">
            <input type="text" maxlength="100" v-validate="'required'"
                   data-vv-name="selToAddress" v-model="toAddress"/>
            <span class="dowml" @click.stop="showDropdown=!showDropdown"></span>
            <em class="error" v-if="errors.has('selToAddress')">{{this.$t('public0.public44')}}<!--请选择地址或使用新地址--></em>
            <ul v-show="showDropdown">
              <li v-if="datas" class="user-addr" @click.prevent="userSelAddress(datas)">{{datas.memo}} -
                {{datas.address}}
              </li>
              <li v-else>{{$t('usercontent.no-address')}}</li>
            </ul>
          </div>
          <p @click="useNewAddress" class="add-address">
            {{$t('account.user_new_address')}}<!--使用新地址-->
          </p>
        </div>
        <div class="filed">
          <div class="filed-number">
            <em>{{$t('account.user_Draw_the_number')}}<!--提现数量--> </em>

          </div>
          <div class="number" :class="{error:errors.has('amount')}">
            <numberbox v-validate="'required|isLessMin|isMoreMax'" :accuracy="8" data-vv-name="amount" class="numberAll"
                       type="text" v-model="amount"/>
            <a href="javascript:;" @click="allWithdraw">{{$t('account.user_All_cash')}}<!--全部提现--></a>
            <span>
              {{$t('account.estimated_value_available')}}<!--可用余额-->：<small
              class="green">{{available}} {{symbol}}</small>
            </span>
          </div>
          <em class="error" v-if="errors.has('amount')">{{getErrors('amount')}}</em>
        </div>
        <div class="filed">
          <div class="withdraw-info f-cb">
            <div class="ng-binding">
              <p>{{$t('exchange.advanced_fee')}}<!--手续费--> </p>
              <span>{{procedureFee}} {{symbol}}</span>
            </div>
            <div class="ng-binding">
              <p>{{$t('account.user_Actual_arrival')}}<!--实际到账--> </p>
              <span>{{lastMount}} {{symbol}}</span>
            </div>
          </div>
        </div>
        <div class="filed">
          <em>
            {{$t('usercontent.user11')}}<!--资金密码-->
          </em>
          <div class="withAdress" style="position:relative;" :class="{error:errors.has('payPassword')}">
            <input :type="showPayPW?'text':'password'" maxlength="100" v-validate="'required'"
                   data-vv-name="payPassword" v-model="payPassword"/>
            <div class="pwd-isShow" @click="showPayPW=!showPayPW">
              <img src="../../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPayPW">
              <img src="../../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
            </div>
          </div>
          <em class="error" v-if="errors.has('payPassword')">{{getErrors('payPassword')}}</em>
        </div>
        <div class="filed">
          <em>
            {{$t('usercontent.user61')}}<!--谷歌验证码-->
          </em>
          <div class="withAdress" style="position:relative;" :class="{error:errors.has('googleCode')}">
            <input type="text" maxlength="6" v-validate="'required'"
                   data-vv-name="googleCode" v-model="googleCode"/>
          </div>
          <em class="error" v-if="errors.has('googleCode')">{{getErrors('googleCode')}}</em>
        </div>
        <div class="filed">
          <input type="button" class="BNB-subbtn" :value="$t('account.user_submit')" @click="walletWithdraw"/><!--提交-->
        </div>
      </div>
      <!--<div class="f-fr">-->
      <!--<ul class="tips">-->
      <!--<li>{{$t('account.user_minimum_number_of_cash').format(`：${minWithdraw} ${symbol}`)}}&lt;!&ndash;最小提现数量为{0}。&ndash;&gt;</li>-->
      <!--<li>{{$t('account.user_prompt7')}}&lt;!&ndash;请勿直接提现至众筹或ICO地址.我们不会处理未来代币的发放.&ndash;&gt;</li>-->
      <!--<li>{{$t('public0.public229')}}&lt;!&ndash;您可以在充值提现历史记录页面跟踪状态。&ndash;&gt;</li>-->
      <!--</ul>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import userUtils from '@/api/wallet'
  import userApi from '@/api/individual'
  import numUtils from '@/assets/js/numberUtils'
  import {Validator} from 'vee-validate'
  import numberbox from '@/components/formel/numberbox'
  import utils from '@/assets/js/utils'
  import add from '../account/addSymbol'

  export default {
    components: {
      numberbox
    },
    data () {
      return {
        symbol: null,
        symbolType: null,
        fromAccount: null,
        available: null,
        fromAddress: null,
        procedure: null,
        minWithdraw: null,
        mobileState: null,
        fixedNumber: 8,
        payPassword: null,
        googleCode: null,
        datas: {},
        showDropdown: false,
        showNewAddress: false,
        showSymbol: false,
        memo: '', //提现备注
        alias: '', // 别名
        amount: '', // 提现金额
        toAddress: '', // 提现地址
        showPayPW: false,
        allData: [],
        msgs: {
          amount: {required: this.$t('public0.public46')}, // 请输入提现金额
          payPassword: {required: this.$t('usercontent.inp-pay-pw')}, // 请输入资金密码
          googleCode: {required: this.$t('usercontent.user33')}, // 请输入谷歌认证码
        }
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
      'alias' (newVal) {
        if (newVal.length > 15) {
          this.alias = newVal.substring(0, 15)
        }
      },
      'toAddress' (newVal) {
        if (newVal.length > 100) {
          this.toAddress = newVal.substring(0, 100)
        }
      }
    },
    computed: {
      procedureFee () { // 手续费 提现数量-固定手续费
        return utils.removeEndZero(numUtils.BN(this.procedure).toFixed(8))
      },
      lastMount () { // 实际到账
        if (this.amount === '' || this.amount === 0) {
          return 0
        } else {
          return utils.removeEndZero(numUtils.minus(this.amount, this.procedureFee).toFixed(8, 1))
        }
      },
      isLessMin () { // 是否小于最小额度
        return numUtils.BN(this.amount).gte(numUtils.BN(this.minWithdraw))
      },
      isMoreMax () { // 是否大于可用余额
        return numUtils.BN(this.amount).lte(numUtils.BN(this.available))
      }
    },
    created () {
      let item = this.$route.params.item
      this.allData = this.$route.params.allData
      if (!item || item === 'undefined') {
        console.log('error')
        this.$router.push({
          name: 'account_menu',
          params: {
            menu: 'pandect'
          }
        })
      } else {
        this.symbol = item.symbol
        this.symbolType = item.symbolType
        this.fromAccount = item.fromAccount
        this.available = item.available
        this.fromAddress = item.fromAddress
        this.procedure = item.procedure
        this.minWithdraw = item.minWithdraw
      }
      console.log(this.allData)
      this.getUserState()
      Validator.extend('isLessMin', {
        getMessage: (field, args) => this.$t('account.user_minimum_number_of_cash').format(`${this.minWithdraw}`),
        validate: (files, args) => {
          return this.isLessMin
        }
      })
      Validator.extend('isMoreMax', {
        getMessage: (field, args) => this.$t('public0.public47').format(this.available), // 提现额度不能大于可用余额：{0}
        validate: (files, args) => {
          return this.isMoreMax
        }
      })
      this.$nextTick(() => {
        userUtils.listWithdraws( // 获取提现地址列表
          this.symbol, (res) => {
            this.datas = res
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
      })
    },
    methods: {
      getUserState () {
        // 获取当前用户状态信息
        userApi.getUserState((data) => {
          this.mobileState = data.mobileAuthState
        }, (msg) => {
          console.error(msg)
        })
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      getErrors (name) {
        return this.msgs[name][this.errors.firstRule(name)] || this.$t(this.errors.first(name)) || null
      },
      closeDailog () {
        this.$emit('removeDialog')
      },
      removeAddress (itemIndex, id) { // 移除提现地址
        userUtils.removeWithdraws({
          id: id
        }, (msg) => {
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.datas.splice(itemIndex, 1)
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      userSelAddress (item) { // 现在现有地址
        this.toAddress = item.address
        this.showNewAddress = false
        this.showDropdown = false
      },
      useNewAddress () { // 使用新地址
        // this.toAddress = ''
        // this.showNewAddress = true
        // this.showDropdown = false
        // this.errors.clear()
        utils.setDialog(add, {
          symbol: this.symbol,
          okCallback: (data) => {
            this.toAddress = data.address
          }
        })
      },
      allWithdraw () {
        this.amount = this.available
      },
      walletWithdraw () { // 提现请求
        let validData = {}
        validData = {
          alias: this.alias,
          toAddress: this.toAddress,
          amount: this.amount,
          payPassword: this.payPassword,
          googleCode: this.googleCode
        }
        this.$validator.validateAll(validData).then((validResult) => {
          if (!validResult) {
            return
          }
          //
          let formData = { // 提现
            symbol: this.symbol,
            symbolType: this.symbolType,
            amount: this.amount,
            fromAccount: this.fromAccount, // 用户id
            toAddress: this.toAddress,
            alias: this.alias,
            memo: this.memo,
            password: this.payPassword,
            googleCode: this.googleCode,
            lang: window.localStorage.getItem('lang') === 'zh-CN' ? 'cn' : 'en',
            withdrawFast: false,
            type: 0
          }
          userUtils.walletWithdraw(formData, (res) => {
            Vue.$koallTipBox({icon: 'success', message: res})
            this.$emit('okCallback')
            this.$emit('removeDialog')
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        })
      },
      changeW (item) {
        //  换提现币种
        this.symbol = item.symbol
        this.symbolType = item.symbolType
        this.fromAccount = item.accountId
        this.available = item.availableBalance
        this.fromAddress = item.getAddress
        this.procedure = item.procedureFee
        this.minWithdraw = item.minWithdraw
        this.showSymbol = false
      }
    }
  }
</script>
<style scoped lang="less">
  div.error, input.error {
    border-color: #e53f3f !important;
  }

  em.error {
    position: absolute;
    left: 0px;
    bottom: -16px;
    color: #e53f3f !important;
    height: 18px !important;
    line-height: 18px;
    font-size: 12px !important;
  }

  .withdrawBox {
    padding: 14px 18px 90px;
    background-color: #19181c;
    color: #f1f1f2;
    overflow: hidden;
    position: relative;
  }

  .tbsm {
    background-color: #242328;
    margin-top: 25px;
    padding: 10px;
    line-height: 30px;
    display: flex;
  }

  .withdrawBox .filed {
    margin-bottom: 30px;
    position: relative;
  }

  .withdrawBox .filed .joint {
    color: #283149;
  }

  .withdrawBox .filed em {
    font-size: 16px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #999;
  }

  .withdrawBox .filed em i.asterisk {
    position: relative;
    top: 5px;
    line-height: 0;
    font-size: 18px;
    color: red;
  }

  .withdrawBox .filed label {
    display: inline-block;
    font-size: 12px;
    color: #999;
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    position: absolute;
    left: -25px;
    top: 0;
  }

  .withdrawBox .filed .withdraw-info {
    display: inline-block;
    box-sizing: border-box;
    padding: 0px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: transparent;
    font-size: 14px;
    color: #0b0c0e;
  }

  .withdrawBox .filed .withdraw-info > div {
    font-size: 16px;
    color: #979799;
    margin-bottom: 30px;

    span {
      display: block;
      border-bottom: 1px solid hsla(0, 0%, 100%, .12);
      font-size: 14px;
      color: #f1f1f2;

    }
  }

  .withdrawBox .filed .BNB-subbtn {
    margin: 60px 0;
    height: 40px;
    line-height: 40px;
    width: 100%;
    cursor: pointer;
    font-size: 12px;
    color: #f1f1f2;
    background-color: #2e2c3c;
    border: 1px solid #312e45;
    text-align: center;
    box-sizing: initial;
  }

  .withdrawBox .filed .BNB-subbtn:hover {
    border: 1px solid #4d4a64;
    background-color: #4d4a64;
  }

  .withdrawBox .filed .withAdress {
    position: relative;
    color: #999;
    font-size: 14px;
    height: 30px;
    border-bottom: 1px solid hsla(0, 0%, 100%, .12);

    .pwd-isShow {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 9;

      img {
        width: 20px;
      }
    }
  }

  .withdrawBox .filed.memo {
    padding-top: 10px;
    margin-bottom: 5px;
  }

  .withdrawBox .filed.memo em {
    width: 50px;
    display: block;
    height: 28px;
    line-height: 28px;
  }

  .withdrawBox .filed.memo input {
    flex: 1;
    height: 28px;
    width: 100%;
    border-bottom: 1px solid hsla(0, 0%, 100%, .12);
  }

  .withAdress span.dowml {
    position: relative;
    cursor: pointer;
    vertical-align: top;
    width: 29px;
    height: 30px;
    border-left: 1px solid transparent;
    display: inline-block;
    float: right;
  }

  .withAdress span.dowml:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border: 1px solid #999;
    border-top-color: transparent;
    border-right-color: transparent;
    position: absolute;
    transform: rotate(-45deg);
    top: 10px;
    left: 5px;
  }

  .withAdress span.dowml:hover:before {
    border-color: #00B5FF;
    border-top-color: transparent;
    border-right-color: transparent;
  }

  .withAdress input {
    width: 529px;
    padding-right: 6px;
    background-color: transparent;
    height: 30px;
    color: #ffffff;
  }

  .withAdress ul {
    position: absolute;
    z-index: 22;
    width: 570px;
    top: 30px;
    left: -1px;
    border: 1px solid #283149;
    padding: 6px 0;
  }

  .withAdress ul li {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #fff;
    text-indent: 12px;
    background-color: #19181c;
    cursor: pointer;
    padding: 0 6px;

    &.active {
      background-color: #242328;
      color: #00B5FF;
    }
  }

  .withAdress ul li:hover {
    background-color: #242328;
    color: #00B5FF;
  }

  .withAdress ul li span {
    font-size: 16px;
    position: absolute;
    right: 7px;
    top: 8px;
    cursor: pointer;
  }

  .withAdress ul li img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }

  .withdrawBox .fee {
    margin-bottom: -10px;
  }

  .tixian {
    margin-bottom: 5px;
    height: 30px;
  }

  .isAddAddress {
    width: 130px;
    box-sizing: border-box;
    height: 30px;
    padding-left: 12px;
    padding-right: 12px;
    line-height: 28px;
    color: #261003;
    background-color: transparent;
    border: 1px solid #ccc;
  }

  .address {
    width: 357px;
    box-sizing: border-box;
    height: 30px;
    padding-left: 12px;
    padding-right: 12px;
    line-height: 28px;
    color: #261003;
    background-color: transparent;
    border: 1px solid #ccc;
  }

  .number {
    position: relative;
    box-sizing: border-box;
    height: 30px;
    padding: 0 12px;
    border-bottom: 1px solid hsla(0, 0%, 100%, .12);
    margin-top: 0px;
    color: #979799;
    text-align: right;
    line-height: 30px;
  }

  .number a {
    color: #00B5FF;
  }

  .number a:hover {
    color: #00B5FF;
  }

  .number .numberAll {
    position: absolute;
    left: 0;
    width: 408px;
    height: 28px;
    line-height: 28px;
    color: #ffffff;
    background-color: transparent;
  }

  .number span {
    position: absolute;
    right: 0;
    top: 30px;
  }

  .withdrawBox:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }

  .withdrawBox .tips {
    width: 226px;
    margin-top: 18px;
  }

  .withdrawBox .tips li {
    line-height: 1.5;
    list-style-type: square;
    font-size: 14px;
    color: #666;
    padding: 5px 0;
    border: none;
    width: 190px;
  }

  .withdrawBox .tips li a {
    color: #aeb7d0;
    text-decoration: underline;
    font-size: 14px;
  }

  /* .koall-verify-title{width: 100%;height: 16px;line-height: 16px;margin-top: 2px;} */
  .koall-verify-title {
    position: relative;
  }

  .koall-verify-title p {
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    background-color: #0D66EF;
  }

  .koall-verify-title span {
    text-decoration: none;
    font-size: 14px;
    color: #979799;
  }

  .koall-verify-title a {
    font-size: 14px;
    color: #fff;
  }

  .koall-verify-title span:hover {

  }

  .koall-verify-all {
    display: block;
    width: 100%;
  }

  .filed-number {
    display: flex;
    justify-content: space-between;
  }

  .filed-number span {
    line-height: 30px;
    color: #999;
  }

  input::-webkit-input-placeholder { /* WebKit browsers */
    color: #818fae;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #818fae;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #818fae;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #818fae;
  }

  .input-box {
    padding-top: 20px;
    width: 570px;
    margin: 0 auto;
  }

  .green {
    color: #1bc863
  }

  .add-address {
    position: absolute;
    right: -100px;
    top: 41px;
    width: 100px;
    color: #999;
    height: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .symbol {
    font-size: 16px;

    p {
      font-size: 14px;
      color: #fff;
      position: relative;
      width: 100%;
      height: 30px;

      &:before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1px solid #999;
        border-top-color: transparent;
        border-right-color: transparent;
        position: absolute;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        top: 10px;
        right: 16px;
      }

      &:hover:before {
        border-color: #00B5FF;
        border-top-color: transparent;
        border-right-color: transparent;
      }
    }
  }
</style>
