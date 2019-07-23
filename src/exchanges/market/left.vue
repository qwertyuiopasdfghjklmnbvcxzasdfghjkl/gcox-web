<template>
  <div class="left-container">
    <div class="block">
      <p class="current-name">
        <img :src="iconUrl">
        <span class="">{{`${currentSymbol}/${baseSymbol}`}}</span>
        <span class="freeTip" v-show="false">{{$t('exchange.fee_free')}}<!-- 免手续费 --></span>
      </p>
      <p class="current-name">
        <last-price :lastPrice="lastPrice" />
      </p>
      <p class="current-name">
        <span class="gray-f"></span>
      </p>
    </div>
    <markets :baseSymbol="baseSymbol" :symbol="symbol" :toFixed="toFixed"/>
    <notice/>
    <coininfo :iconUrl="iconUrl" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :symbol="symbol"/>
  </div>
</template>

<script>
import Vue from 'vue'	
import { mapGetters } from 'vuex'
import markets from './market'
import notice from './notice'
import coininfo from './coininfo'

const lastPrice = { //自定义价格更新组件
	props:['lastPrice'],
  	data: function () {
	    return {
	      	isUp: true,
	      	symbol:''
	    }
	},
	watch:{
		lastPrice(_new,_old){ //更新价格涨跌状态，切换市场一致默认为涨
			if(this.symbol===this.$parent.symbol){
				if(_new>=_old){
					this.isUp = true
				} else {
					this.isUp = false
				}
			} else {
				this.isUp = true
				this.symbol = this.$parent.symbol
			}
		}
	},
	created(){
		this.symbol = this.$parent.symbol
	},
	template: `<span class="icon" :class="isUp?'rang-up':'rang-down'">{{lastPrice}}</span>`
}

export default {
	props:['iconUrl','currentSymbol','baseSymbol','symbol','toFixed','lastPrice'],
	components:{
		markets,
		notice,
		coininfo,
		lastPrice
	},
	data(){
		return {

		}
	},
	computed:{
		...mapGetters([]),
	},
	methods:{

	}

}
</script>

<style lang="less" scoped="">
.left-container {
    font-size: 12px;
    width: 21%;
    padding-left: 6px;
}
.block {
    background: #19181c;
    margin-bottom: 4px;
    padding: 0 10px;
    color: #f1f1f2;
    font-size: 12px;
}
.icon {
    padding-right: 30px;
    font-size: 26px;
    &.rang-up {
        background: url('../../assets/img/icon-up.png') no-repeat 100% 42%;
        background-size: auto 62%;
    }
    &.rang-down {
        background: url('../../assets/img/icon-down.png') no-repeat 100% 42%;
        background-size: auto 62%;
    }
}
.current-name {
  font-size: 18px; height: 35px; line-height: 35px;
  > img {display: inline-block; height: 26px; position: relative; top: 6px; margin-right: 10px;}
  > span {display: inline-block; height: 35px; line-height: 35px; }
  > span.freeTip {
    color: #00a0e9;
    font-size: 12px;
    display: inline-block;
    position: relative;
    top: -1px;
    border-radius: 4px;
    border: 1px solid #00a0e9;
    padding: 0 4px;
    height: 22px;
    line-height: 22px;
  }
}
</style>