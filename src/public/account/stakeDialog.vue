<template>
	<div class="stake-dialog">
    <i class="icon-cross" @click="$emit('removeDialog')"></i>
		<h1 class="f-c-blue fs18">Confirm your stake</h1>
    <p class="mt15">Please check the details of your staking befire confirmation</p>
    <div class="mt15 ui-flex">
      <div class="ui-flex-2">Stake amount</div>
      <div class="ui-flex-3">
        <numberbox class="amount" :accuracy="8" type="text" :placeholder="$t('public0.public12')" v-model="amount" />
        ACM
      </div>
    </div>
    <div class="mt15 ui-flex">
      <div class="ui-flex-2">Account</div>
      <div class="ui-flex-3">fla126@163.com</div>
    </div>
    <div class="mt15 ui-flex">
      <div class="ui-flex-2">Available</div>
      <div class="ui-flex-3">123,456 &nbsp;&nbsp;ACM</div>
    </div>
    <p class="mt30 fs20">Disclaimer</p>
    <p class="mt20">You are participating in GCOX's staking programme. Please read and agree to the Terms and Conditions of this staking programme before confirming your paricipation. For any questions relating to the staking programme. please contact us at contact@gcox com.</p>
    <label class="mt50 agreement"><input type="checkbox" name="agree" v-model="agree"><i :class="[agree?'icon-checkbox-checked':'icon-checkbox-unchecked']"></i> &nbsp;&nbsp;&nbsp;&nbsp;I have read and agree to the disclaimer</label>
    <div class="btns ui-flex ui-flex-justify mt60">
      <button type="button" class="mint-btn" @click="$emit('removeDialog')">{{$t('account.user_cancel')}}</button>
      <button type="button" class="mint-btn primary" @click="stake">{{$t('otc_ad.otc_ad_confirm')}}</button>
    </div>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import numberbox from '@/components/formel/numberbox'
export default {
  components: {
    numberbox,
  },
  data () {
    return {
      locked: false,
      amount:'',
      agree:false
    }
  },
  computed: {
    
  },
  created () {

  },
  methods: {
    ...mapActions([]),
    stake(){

    }
    
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
.btns button {min-width: 150px;}
.icon-cross {position: absolute; right: 30px; top: 30px; font-size: 20px; cursor: pointer;}
</style>
