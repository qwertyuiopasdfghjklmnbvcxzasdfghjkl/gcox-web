<template>
	<div class="quick-trade-dialog">
    <i class="icon-cross" @click="$emit('removeDialog')"></i>
		<h1 class="fs26">{{data.direction===1?'Buy':'Sell'}}</h1>
    <p class="mt25 fs16 f-c-blue">Please confirm your Buy Order before submitting</p>
    <div class="mt20 ui-flex fs16">
      <div class="ui-flex-3">Order Type</div>
      <div class="ui-flex-2">Market order</div>
    </div>
    <div class="mt20 ui-flex fs16">
      <div class="ui-flex-3">Qty.</div>
      <div class="ui-flex-2">B0.05000000</div>
    </div>
    <div class="mt20 ui-flex fs16">
      <div class="ui-flex-3">Estimated Amount Receivable</div>
      <div class="ui-flex-2">USD7300.00</div>
    </div>
    <div class="mt20 ui-flex fs16">
      <div class="ui-flex-3">Estimated Fees</div>
      <div class="ui-flex-2">0.1%</div>
    </div>
    <p class="mt25 fs13">By confirming this trade order, you have read and agreed with our Terms Conditions Furthermore, you acknowledge and accept the risks associated with this trade order and you acknowledge and accept that once the trade order has been filled, it cannot be reversed, undone or refunded.</p>
    <p class="mt15 fs13">Fo any questions, please contact <a class="f-c-blue" href="mailto:exchange@ogcox.com">exchange@ogcox.com</a> or visit our <a class="f-c-blue" href="javascript:;">Contact Us</a> page</p>
    <div class="btns text-right mt25">
      <button type="button" class="mint-btn" v-if="data.direction===1">CONFIRM BUY</button>
      <button type="button" class="mint-btn sell" v-else>CONFIRM SELL</button>
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
  props:['data'],
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
.quick-trade-dialog {
  position: relative;
	width: 630px;
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
  min-width: 130px; height: 35px; border-radius: 0; border: none; background-image: linear-gradient(left,#90BE3B, #2A5A43); color: #fff; font-size: 16px; cursor: pointer; position: relative;
  &.sell {background-image: linear-gradient(left,#e63c1f, #970112);}
}
.icon-cross {position: absolute; right: 30px; top: 30px; font-size: 20px; cursor: pointer;}
</style>
