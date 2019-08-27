<template>
	<div class="stake-dialog">
    <i class="icon-cross" @click="$emit('removeDialog')"></i>
		<h1 class="f-c-blue fs18">{{$t('account.confirm_stake')}}<!-- Confirm your stake --></h1>
    <p class="mt15">{{$t('account.check_stake_tip')}}<!-- Please check the details of your staking befire confirmation --></p>
    <div class="mt15 ui-flex">
      <div class="ui-flex-2">{{$t('account.stake_amount')}}<!-- Stake amount --></div>
      <div class="ui-flex-3">
        <numberbox class="amount" :accuracy="8" type="text" :placeholder="$t('public0.public12')" v-model="amount" ref="amount"/>
        {{data.symbol}}
      </div>
    </div>
    <div class="mt15 ui-flex">
      <div class="ui-flex-2">{{$t('account.user_center_account')}}<!-- Account --></div>
      <div class="ui-flex-3">{{getUserInfo.username}}</div>
    </div>
    <div class="mt15 ui-flex">
      <div class="ui-flex-2">{{$t('account.estimated_value_available')}}<!-- Available --></div>
      <div class="ui-flex-3">{{toFixed(data.availableBalance)|removeEndZero}} &nbsp;&nbsp;{{data.symbol}}</div>
    </div>
    <p class="mt30 fs20">{{$t('account.disclaimer')}}<!-- Disclaimer --></p>
    <p class="mt20">{{$t('account.disclaimer_desc')}}<!-- You are participating in GCOX's staking programme. Please read and agree to the Terms and Conditions of this staking programme before confirming your paricipation. For any questions relating to the staking programme. please contact us at contact@gcox com. --></p>
    <label class="mt50 agreement"><input type="checkbox" name="agree" v-model="agree"><i :class="[agree?'icon-checkbox-checked':'icon-checkbox-unchecked']"></i> &nbsp;&nbsp;&nbsp;&nbsp;{{$t('account.disclaimer_agree')}}<!-- I have read and agree to the disclaimer --></label>
    <div class="btns ui-flex ui-flex-justify mt60">
      <button type="button" class="mint-btn" cancel @click="$emit('removeDialog')">{{$t('account.user_cancel')}}</button>
      <button type="button" class="mint-btn" confirm @click="stake">{{$t('otc_ad.otc_ad_confirm')}}</button>
    </div>
    <div class="mask-layer ui-flex ui-flex-center ui-flex-column" v-show="locked">
      <loading/>
    </div>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import numberbox from '@/components/formel/numberbox'
import numUtils from '@/assets/js/numberUtils'
import walletApi from '@/api/wallet'

export default {
  components: {
    numberbox,
  },
  props:['data'],
  data () {
    return {
      locked: false,
      amount:'',
      agree:true
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  created () {

  },
  methods: {
    ...mapActions([]),
    stake(){
      if(Number(this.amount)===0){
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public12')})
        this.$refs.amount.$el.focus()
        return
      }
      if(Number(this.amount)>this.data.availableBalance){
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public292')})
        return
      }
      if(!this.agree){
        Vue.$koallTipBox({icon: 'notification', message: this.$t('account.stake_agreed_tip')})
        return
      }
      this.locked = true
      let params = {accountId: this.data.accountId, amount: this.amount}
      walletApi.postStake(params, res=>{
        this.locked = false
        Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.SUCCESS')})
        this.$emit('okCallback')
        this.$emit('removeDialog')
      }, msg=>{
        this.locked = false
        alert(111)
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })

    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed).toMoney()
    },
    
  }
}
</script>

<style lang="less" scoped="">
.stake-dialog {
  position: relative;
	width: 820px;
	box-sizing: border-box;
  padding: 20px 30px;
  color: #606266;
	font-size: 14px;
	word-break: break-all;
	background-color:#000;
  border:1px solid #727071;
  box-shadow:-2px 2px 5px rgba(0,0,0,.5);
  color: #fff;
}
.amount {
  height: 30px; width: 160px; background-color: #eee; font-size: 16px; margin-right: 10px; vertical-align: middle; padding-left: 10px; padding-right: 10px;
}
.agreement {
  display: inline-block;
  input {display: none;}
}
.btns button {
  min-width: 150px;
  &[cancel] {background-color: #000000; border: 2px solid #235069; color: #fff;}
  &[confirm] {background-color: #073c5b; color: #fff;}
}
.icon-cross {position: absolute; right: 30px; top: 30px; font-size: 20px; cursor: pointer;}
</style>
