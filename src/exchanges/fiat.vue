<template>
  <div class="fiat w1200 f-c-white">
    <div>
      <p class="fs16">购买 BTC / ETH</p>
      <div class="ui-flex mt15">
        <div class="block">
          <p>Order Amount</p>
          <div class="amount mt10 fs16">
            <input type="number" name="amount" v-model="formData.amount" placeholder="请输入购买数量" v-focus>
            <a href="javascript:;">
              {{formData.symbol}} <i class="icon-arrow-down3 ml10"></i>
              <ul ref="symbol">
                <li v-for="item in symbol" @click="setSymbol(item)">{{item}}</li>
              </ul>
            </a>
          </div>
          <p style="margin-top: 60px;">Total Charge (fee included)</p>
          <div class="charge mt10 fs16">
            <input type="number" name="charge" :value="formData.charge" readonly="">
            <a href="javascript:;">
              {{formData.currency}} <i class="icon-arrow-down3 ml10"></i>
              <ul ref="currency">
                <li v-for="item in currency" @click="setCurrency(item)">{{item}}</li>
              </ul>
            </a>
          </div>
          <button type="button" class="buy mt40"><strong>BUY NOW</strong></button>
          <div class="mt20 text-center powerby">
            Powered by <i class="icon_simplex ml20"></i>
          </div>
        </div>
        <div class="ml40 why" style="padding-top: 25px;">
          <p class="fs16">Why Credit Card?</p>
          <p class="mt20"><i class="icon-check"></i> Fast: Average 10-30 mins for cryptocurrency to reach your wallet</p>
          <p class="mt20"><i class="icon-check"></i> Low Fees: Simplex charges only 3.5% per transaction (10 USD minimum)</p>
          <p class="mt20"><i class="icon-check"></i> Convenient: Visa and MasterCard accepted</p>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import numUtils from '@/assets/js/numberUtils'
import loading from '@/components/loading'
import { mapGetters, mapActions } from 'vuex'

export default {
  name:'fiat',
  components: {
    loading
  },
  data () {
    return {
      symbol:['BTC','ETH'],
      currency:['USD','CNY'],
      formData:{
        symbol:'BTC',
        amount:'1',
        currency:'USD',
        charge:'',

      }
    }
  },
  computed: {
    ...mapGetters(['getLang']),

  },
  created () {

  },
  mounted(){

  },
  beforeDestroy () {

  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    setSymbol(key){
      this.formData.symbol = key
      this.$refs.symbol.style.display = 'none'
      setTimeout(()=>{
        this.$refs.symbol.removeAttribute('style')
      },100)
    },
    setCurrency(key){
      this.formData.currency = key
      this.$refs.currency.style.display = 'none'
      setTimeout(()=>{
        this.$refs.currency.removeAttribute('style')
      },100)
    }
  }
}
</script>

<style lang="less" scoped>
.block {
    width: 550px;
    background: #19181d;
    margin-bottom: 4px;
    padding: 15px 20px;
    .no-margin {
        margin: 0;
    }
}
.fiat {padding-top: 50px; padding-bottom: 30px; > div {padding-left: 15px; padding-right: 15px;}}
.amount, .charge {
  background-color: #3F3B3A; line-height: 40px; position: relative;
  input {width:100%; height: 30px; box-sizing: border-box; font-size: 16px; color: #fff; background-color: transparent; padding-left: 20px; padding-right: 100px;}
  a {
    position: absolute; right: 20px; top: 0;bottom: 0; width: 80px; text-align: right; color: #fff; z-index: 1;
    ul {
      left: 0; right: 0; margin-right: -20px; top: 40px; background-color: #3F3B3A; display: none;
      li {text-align: left; padding-left: 20px; border-bottom: 1px solid #343434;}
      li:hover { background-color: #363332;}
    }
    &:hover ul {display: block;}
  }
}
.buy {width: 100%; height: 40px; border: none; background-image: linear-gradient(left,#90BE3B, #2A5A43); color: #fff; font-size: 16px; cursor: pointer; position: relative;}
.buy:after {content: ''; position: absolute; left: 0; top: 0; right: 0; bottom: 0;}
.buy:active:after {background-color: rgba(0,0,0,.1);}
.powerby {line-height: 52px;}
.icon_simplex {display: inline-block; height: 40px; width:150px; background: url('../assets/img/simplex_logo.png') no-repeat left center; background-size: contain; vertical-align: middle;}
.why i {color: #009A3E; font-size: 24px;}
</style>

