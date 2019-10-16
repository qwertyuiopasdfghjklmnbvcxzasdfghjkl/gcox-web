<template>
  <div class="moreinfo">
    <div class="depositBox">
      <div class="filed">
        <!--<div class="adr-list">-->
          <!--<label class="active" style="position:relative;">-->
            <!--{{symbol}} {{$t('account.userRechargeAddress')}}&lt;!&ndash;充值地址&ndash;&gt; ：-->
          <!--</label>-->
          <!--<label class="sum" style="display:none;">-->
            <!--{{$t('account.estimated_value_total')}}&lt;!&ndash;总金额&ndash;&gt;-->
          <!--</label>-->
          <!--<label class="yue" style="display:none;">-->
            <!--{{$t('account.estimated_value_available')}}&lt;!&ndash;可用余额&ndash;&gt;-->
          <!--</label>-->
          <!--<label class="xiadan" style="display:none;">-->
            <!--{{$t('public0.public34')}}&lt;!&ndash;冻结金额&ndash;&gt;-->
          <!--</label>-->
        <!--</div>-->
        <div class="lists active">
          <div class="name2">
            <div class="name">
              <!--<input type="text" class="adressName" readonly="readonly" :disabled="Number(item.rechargeFlag) !== 1"-->
                     <!--:value="Number(item.rechargeFlag) !== 1 ? null : getAddress"/>-->
              <!--<span class="copy icon_copy" :class="{disabled: Number(item.rechargeFlag) !== 1}"-->
                    <!--@click="Number(item.rechargeFlag) !== 1 ? false : copy()" :title="$t('account.user_Copy_address')">-->
                                <!--&lt;!&ndash;复制地址&ndash;&gt;-->
                            <!--</span>-->
              <span class="reche icon_withdraw" :class="{disabled: !item.openStaking}"
                    @click="showStake"
                    :title="$t('account.stake')">
                    {{$t('account.stake')}}<!--锁仓-->
              </span>

              <span class="reche icon_withdraw"
                    :class="{disabled: Number(item.withdrawFlag) !== 1}"
                    @click="Number(item.withdrawFlag) !== 1 ? false : withdrawDalog()"
                    :title="$t('account.estimated_value_withdrawal')">
                                {{$t('usercontent.user70')}}<!--提现-->
                            </span>
              <span class="ewm icon_recharge"
                    :class="{disabled: Number(item.rechargeFlag) !== 1}"
                    @click="Number(item.rechargeFlag) !== 1 ? false : scanEWM()"
                    :title="$t('account.estimated_value_deposit')">
                                {{$t('usercontent.user71')}}<!--充值-->
                            </span>
              <span  class="buy icon_recharge"
                     :class="{disabled: Number(item.rechargeFlag) !== 1 || Number(item.withdrawFlag) !== 1}"
                      @click="(Number(item.rechargeFlag) !== 1) &&(Number(item.withdrawFlag) !== 1) ? false : buy()">
                {{$t('usercontent.user72')}}
              </span>
            </div>
          </div>
        </div>
        <!--<template v-if="item.symbol==='EOS'">-->
          <!--&lt;!&ndash;<div class="adr-list">&ndash;&gt;-->
            <!--&lt;!&ndash;<label class="active" style="position:relative;">&ndash;&gt;-->
              <!--&lt;!&ndash;{{symbol}} {{$t('account.recharge_memo')}}&lt;!&ndash;EOS充值备注&ndash;&gt; ：&ndash;&gt;-->
            <!--&lt;!&ndash;</label>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--<div class="lists active">-->
            <!--<div class="name2">-->
              <!--<div class="name">-->
                <!--&lt;!&ndash;<input type="text" class="adressName" readonly="readonly" :disabled="Number(item.rechargeFlag) !== 1"&ndash;&gt;-->
                       <!--&lt;!&ndash;:value="Number(item.rechargeFlag) !== 1 ? null : item.address"/>&ndash;&gt;-->
                <!--&lt;!&ndash;<span class="copy icon_copy" :class="{disabled: Number(item.rechargeFlag) !== 1}"&ndash;&gt;-->
                      <!--&lt;!&ndash;@click="Number(item.rechargeFlag) !== 1 ? false : copy_memo()"&ndash;&gt;-->
                      <!--&lt;!&ndash;:title="$t('account.user_Copy_address')">&ndash;&gt;-->
                                  <!--&lt;!&ndash;&lt;!&ndash;复制地址&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;</span>&ndash;&gt;-->
                <!--&lt;!&ndash;<span class="ewm icon-qrcode" style="color: #4A91FD;"&ndash;&gt;-->
                      <!--&lt;!&ndash;:class="{disabled: Number(item.rechargeFlag) !== 1}"&ndash;&gt;-->
                      <!--&lt;!&ndash;@click="Number(item.rechargeFlag) !== 1 ? false : scanMEMO()">&ndash;&gt;-->
                                  <!--&lt;!&ndash;&lt;!&ndash;充值&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;</span>&ndash;&gt;-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--&lt;!&ndash;<div class="adr-list">&ndash;&gt;-->
            <!--&lt;!&ndash;<label class="active" style="position:relative;">&ndash;&gt;-->
              <!--&lt;!&ndash;<i style="color: red;">{{$t('public0.public242')}}：{{$t('account.eos_recharge_warn')}}</i>&ndash;&gt;-->
              <!--&lt;!&ndash;&lt;!&ndash;备注和地址同时使用才能充值EOS成功&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;</label>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</template>-->
        <!--<div class="addBNB">-->
          <!--<ul class="tips">-->
            <!--<li style="display:none;">-->
              <!--● <strong>{{$t('public0.public32')}}&lt;!&ndash;点击“默认”按钮后会将该钱包设置为OTC专用钱包。&ndash;&gt;</strong>-->
            <!--</li>-->
            <!--<li>-->
              <!--● {{$t('account.user_prompt1').format(item.symbol)}}&lt;!&ndash;禁止向{0}地址充值除{0}之外的资产，任何充入{0}地址的非{0}资产将不可找回。&ndash;&gt;-->
            <!--</li>-->
            <!--<li>-->
              <!--● {{$t('account.user_prompt2').format(item.symbol, blockQuantity)}}&lt;!&ndash;使用BTC地址充值需要{1}个区块确认才能到账。&ndash;&gt;-->
            <!--</li>-->
            <!--<li>-->
              <!--● {{$t('account.user_prompt10')}}&lt;!&ndash;充值完成后，你可以进入历史记录页面跟踪进度。&ndash;&gt;-->
            <!--</li>-->
            <!--<li style="display:none;">-->
              <!--● {{$t('account.user_prompt4').format(5)}}&lt;!&ndash;每个币种最多添加5个充值地址，如需更多请联系客服。&ndash;&gt;-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>
<script>
  import userUtils from '@/api/wallet'
  import utils from '@/assets/js/utils'
  import adressCava from './adresscava'
  import memoCava from './memocava'
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import stakeDialog from '@/public/account/stakeDialog'

  const copyText = (str) => {
    var save = function (e) {
      e.clipboardData.setData('text/plain', str)
      e.preventDefault()
    }
    document.addEventListener('copy', save)
    document.execCommand('copy')
    document.removeEventListener('copy', save)
  }
  export default {
    props: {
      mobileState: {
        type: Number,
        default: 0
      },
      item: {
        type: Object
      },
      symbol: {
        type: String
      },
      allData: {
        type: Array
      }
    },
    components: {
      adressCava
    },
    data () {
      return {
        disabled: false,
        dataWallet: [],
        show: false,
        EOS_MEMO: ''
      }
    },
    computed: {
      ...mapGetters(['getMarketList']),
      blockQuantity () {
        if (this.item.blockConfirm) {
          return this.item.blockConfirm
        }
        return this.item.symbol === 'BTC' ? 6 : 30
      },
      getAddress () {
        return this.symbol === 'EOS' ? this.EOS_MEMO : this.item.address
      }
    },
    created () {
      if (this.symbol === 'EOS' && !this.EOS_MEMO) {
        this.getEosAddress()
      }
    },
    methods: {
      ...mapGetters(['getUserInfo', 'getLang']),
      showStake(){
        if(!this.item.openStaking){
          return
        }
        if (this.verifyState !== 2) {
          Vue.$confirmDialog({
            id: 'KYC_AUTH_FIRST',
            showCancel: false,
            content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
            okCallback: () => {
              this.$router.push({name: 'mycenter_menu', params: {menu: 'mycenter'}})
            }
          })
          return
        }
        utils.setDialog(stakeDialog, {
          data:this.item,
          backClose:true,
          okCallback: () => {
            this.$parent.getList()
          }
        })
      },
      getEosAddress () {
        userUtils.getEosAddress(data => {
          this.EOS_MEMO = data
        })
      },
      copy () {
        Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')}) // 复制成功
        copyText(this.getAddress)
      },
      copy_memo () {
        Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')}) // 复制成功
        copyText(this.item.address)
      },
      detWallet (item) {
        if (item.type === 1) {
          return
        }
        userUtils.defaultWallet({
          accountId: item.accountId,
          symbol: item.symbol
        }, (msg) => {
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.dataWallet.forEach((d) => {
            if (item.accountId === d.accountId) {
              d.type = 1
            } else {
              d.type = 0
            }
          })
        }, (msg) => {
          Vue.$koallTipBox({icon: 'error', message: this.$t(`error_code.${msg}`)})
        })
      },
      withdrawDalog () {
        // if (this.verifyState !== 2) {
        //   Vue.$confirmDialog({
        //     id: 'KYC_AUTH_FIRST',
        //     showCancel: false,
        //     content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
        //     okCallback: () => {
        //       this.$router.push({name: 'mycenter_menu', params: {menu: 'mycenter'}})
        //     }
        //   })
        //   return
        // }
        if (this.getUserInfo().googleAuthEnable !== 1) {
          Vue.$confirmDialog({
            id: 'GOOGLEAUTH_OR_SMSAUTH_FIRST',
            showCancel: false,
            content: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
            okCallback: () => {
              this.$router.push({name: 'mycenter_menu', params: {menu: 'mycenter'}})
            }
          })
          return
        }
        // if (!this.getUserInfo.email && this.mobileState !== 1) {
        //   Vue.$confirmDialog({
        //     id: 'SMS_AUTH_FIRST',
        //     showCancel: false,
        //     content: this.$t('error_code.CELLPHONE_AUTH_FIRST'), // 请先进行短信验证
        //     okCallback: () => {
        //       this.$router.push({name: 'mycenter_menu', params: {menu: 'safety'}})
        //     }
        //   })
        //   return
        // }
        let data = {
          symbol: this.item.symbol,
          symbolType: this.item.symbolType,
          available: this.item.availableBalance,
          fromAddress: this.getAddress,
          procedure: this.item.procedureFee,
          minWithdraw: this.item.minWithdraw,
          fromAccount: this.item.accountId,
        }
        this.$router.push({
          name: 'account_menu',
          params: {
            menu: 'withdrawInfo',
            item: data,
            allData: this.allData
          }
        })
        // utils.setDialog(withdrawInfo, {
        //   symbol: this.item.symbol,
        //   symbolType: this.item.symbolType,
        //   available: this.item.availableBalance,
        //   fromAddress: this.getAddress,
        //   procedure: this.item.procedureFee,
        //   minWithdraw: this.item.minWithdraw,
        //   fromAccount: this.item.accountId,
        //   okCallback: () => {
        //     this.$emit('updateMyAssets')
        //   }
        // })
      },
      scanEWM () {
        if (this.verifyState !== 2) {
          Vue.$confirmDialog({
            id: 'KYC_AUTH_FIRST',
            showCancel: false,
            content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
            okCallback: () => {
              this.$router.push({name: 'mycenter_menu', params: {menu: 'mycenter'}})
            }
          })
          return
        }
        this.$router.push({
          name: 'account_menu',
          params: {
            menu: 'adresscava',
            symbol: this.symbol,
          }
        })
      },
      buy(){
        let market = this.getMarketList.filter(item=>{
          return item.currencySymbol === this.symbol
        })
        if(market.length){
          this.$router.push({name:'exchange_index',params:{symbol:`${market[0].currencySymbol}_${market[0].baseSymbol}`}})
        } else {
          this.$router.push({name:'exchange_index2'})
        }
      },
      scanMEMO () {
        utils.setDialog(memoCava, {
          addr: this.item.address,
          symbol: this.item.symbol
        })
      },
    }
  }
</script>
<style scoped>
  .important-tips {
    position: absolute;
    bottom: -18px;
    left: 0px;
    font-size: 12px;
    line-height: 22px;
    background-color: #343d53;
    color: #666;
    padding: 0 4px;
  }

  .moreinfo {
    padding: 8px;
  }

  .depositBox {
    /*background-color: #F5F5F5;*/
    /*border-radius: 4px;*/
  }

  .depositBox .filed {
    width: 100%;
  }

  .depositBox .filed span {
    display: inline-block;
    height: 25px;
    background: none no-repeat left center;
  }

  .depositBox .filed span.icon_copy {
    background-image: url(../../assets/images/icon_copy.png);
  }

  .depositBox .filed span.icon_copy:hover {
    background-image: url(../../assets/images/icon_copy_hover.png);
  }

  .depositBox .filed span.icon_recharge {
    cursor: pointer;
    font-size: 12px;
    color: #f1f1f2;
    background-color: #2e2c3c;
    border: 1px solid #312e45;
    text-align: center;
    -webkit-box-sizing: initial;
    box-sizing: initial;
    line-height: 28px;
    height: 30px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .depositBox .filed span.icon_recharge.buy{
    margin-right: 0;
  }

  .depositBox .filed span.icon_recharge:hover {
    border: 1px solid #4d4a64;
    background-color: #4d4a64;
  }

  .depositBox .filed span.icon_withdraw {
    cursor: pointer;
    font-size: 12px;
    color: #f1f1f2;
    background-color: #2e2c3c;
    border: 1px solid #312e45;
    -webkit-box-sizing: initial;
    box-sizing: initial;
    line-height: 28px;
    height: 30px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .depositBox .filed span.icon_withdraw:hover {
    border: 1px solid #4d4a64;
    background-color: #4d4a64;
  }

  .depositBox .filed span.icon_copy.disabled,
  .depositBox .filed span.icon_recharge.disabled,
  .depositBox .filed span.icon_withdraw.disabled {
    cursor: not-allowed;
  }

  .depositBox .filed span.icon_copy.disabled,
  .depositBox .filed span.icon_copy.disabled:hover {
    background-image: url(../../assets/images/icon_copy_disabled.png);
  }

  .depositBox .filed span.icon_recharge.disabled,
  .depositBox .filed span.icon_recharge.disabled:hover {
    background: #4b4956;
    color: #929292;
  }

  .depositBox .filed span.icon_withdraw.disabled,
  .depositBox .filed span.icon_withdraw.disabled:hover {
    background: #4b4956;
    color: #929292;
  }

  .depositBox .filed ul.number {
    border: none;
    margin-top: 0px;
    display: inline-block;
    vertical-align: top;
  }

  .depositBox .filed ul li {
    overflow: hidden;
    border: none;
  }

  .depositBox .filed ul li.active div {
    color: #666;
  }

  .depositBox .filed ul li span {
    float: left;
    border: none;
    width: 130px;
    text-align: center;
    color: #d6dff9;
    display: inline-block;
  }

  .depositBox .filed ul li span.sum {
    width: 169px;
    text-align: left;
  }

  .depositBox .filed ul li span.yue {
    width: 169px;
    text-align: left;
  }

  .depositBox .filed ul li span.xiadan {
    width: 172px;
    text-align: left;
  }

  .depositBox .filed ul li span.guzhi {
    width: 180px;
    text-align: left;
  }

  .depositBox .filed label {
    display: inline-block;
    font-size: 14px;
    color: #333;
    width: 168px;
    text-align: center;
  }

  .depositBox .filed label.active {
    width: 350px;
    text-align: left;
    color: #333;
  }

  .depositBox .filed label.sum {
    width: 164px;
    text-align: left;
  }

  .depositBox .filed label.yue {
    width: 164px;
    text-align: left;
  }

  .depositBox .filed label.xiadan {
    width: 172px;
    text-align: left;
  }

  .depositBox .filed label.guzhi {
    width: 130px;
    text-align: left;
  }

  .depositBox .filed > div {
    line-height: 40px;
    position: relative;
  }

  .depositBox .filed > div.add {
    background-color: #e9b342;
    cursor: pointer;
    border: none;
    text-align: center;
    box-sizing: border-box;
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color: #0b0c0e;
    width: 250px;
    margin-bottom: 10px;
    float: left;
    font-size: 14px;
    margin-left: 52px;
  }

  .depositBox .filed > div .left {
    display: inline-block;
    width: 306px;
  }

  .depositBox .filed > div .tit {
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
    position: relative;
  }

  .depositBox .filed > div .name {
    font-size: 12px;
    color: #d6dff9;
    height: 30px;
  }

  .depositBox .filed > div.active {
    margin-left: 20px;
  }

  .depositBox .filed > div.lists {
    line-height: 20px;
  }

  .depositBox .filed > div.lists.active ul.number {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.sum {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.yue {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.xiadan {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.guzhi {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.name2 {
    display: inline-block;
  }

  .depositBox .filed > div.lists.name2 .name {
    font-size: 24px;
    color: #d6dff9;
    margin-top: 5px;
  }

  .depositBox .filed > div.lists.name2 .name3 {
    margin-left: 44px;
    margin-bottom: 5px;
  }

  .depositBox .filed > div.lists.name2 .name3 span {
    display: inline-block;
    font-size: 16px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    background-color: #fdb902;
    color: #fff;
    text-align: center;
  }

  .depositBox .filed > div.lists.name2 .name3 span.reche.disabled {
    background-color: #464c5c;
    cursor: not-allowed;
  }

  .depositBox .filed > div.adr-list {
    margin-left: 28px;
  }

  .addBNB {
    height: inherit;
    margin-left: 20px;
  }

  .addBNB .add, .addBNB.space {
    background-color: #fdb902;
    color: #fff;
    margin-left: 44px;
    vertical-align: top;
    cursor: pointer;
    border: none;
    text-align: center;
    box-sizing: border-box;
    margin-top: 10px;
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
    width: 170px;
    margin-bottom: 10px;
    display: inline-block;
    font-size: 14px;
  }

  .addBNB .space {
    background-color: #464c5c;
    cursor: not-allowed;
  }

  .depositBox .filed input {
    box-sizing: border-box;
    height: 28px;
    line-height: 28px;
    padding: 0px 7px 0px 0px;
    border: 1px solid #d4d4d4;
    color: #333;
    width: 250px;
  }

  .depositBox .filed input.adressName {
    width: 470px;
    height: 30px;
    line-height: 30px;
    text-indent: 8px;
    margin-left: 10px;
    border: 1px solid #8CB4F2;
    margin-right: 8px;
    display: inline-block;
    padding: 0px;
    color: #666;
    font-size: 14px;
    vertical-align: top;
    background-color: #D3E2FA;
  }

  .depositBox .filed input.adressName:disabled {
    cursor: not-allowed;
  }

  .depositBox .filed span {
    height: 30px;
    display: inline-block;
    font-size: 28px;
    color: #fdb902;
    cursor: pointer;
    text-align: center;
    line-height: 28px;
    box-sizing: border-box;
    vertical-align: text-bottom;
    position: relative;
  }

  .depositBox:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }

  .depositBox .ewm {
    height: 95px;
  }

  .depositBox .ewm canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .moreinfo .tips {
    margin-bottom: 15px;
    display: inline-block;
    margin-left: 10px;
    margin-top: 15px;
  }

  .moreinfo .tips li {
    height: 21px;
    line-height: 21px;
    list-style-type: square;
    font-size: 12px;
    color: #666;
    border: none;
  }

  .moreinfo .tips li .recoreds {
    font-size: 12px;
    color: #d6dff9;
    font-weight: bold;
    text-decoration: underline;
  }

  .moreinfo .tips li a {
    color: #fdb902 !important;
  }

  .moreinfo form .filed {
    margin-bottom: 20px;
    position: relative;
    padding-left: 130px;
    height: 30px;
  }

  .moreinfo form .filed label {
    display: inline-block;
    font-size: 12px;
    color: #d6dff9;
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    position: absolute;
    left: -25px;
    top: 0;
  }

  .moreinfo form .filed input.ipt {
    box-sizing: border-box;
    width: 494px;
    height: 30px;
    padding: 0 10px;
    border: 1px solid #d4d4d4;
    color: #333;
  }

  .moreinfo form .filed input.defineValidateError {
    border: 1px solid #ff5252 !important;
  }

  .moreinfo form .filed .select input {
    box-sizing: border-box;
    width: 494px;
    height: 30px;
    padding: 0 10px;
    border: 1px solid #d4d4d4;
    color: #333;
  }

  .moreinfo form .filed .select .icon-downsj {
    position: absolute;
    right: 1px;
    top: 1px;
    z-index: 10;
    height: 28px;
    line-height: 29px;
    margin: 0;
    width: 28px;
    text-align: center;
    border-left: 1px solid #d4d4d4;
    cursor: pointer;
    background-color: #fff;
  }

  .moreinfo form .filed .defineValidate {
    position: absolute;
    bottom: -16px;
    left: 132px;
    font-size: 12px;
    color: #ff5252;
  }
</style>
