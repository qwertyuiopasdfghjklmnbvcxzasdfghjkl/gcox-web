<template>
	<div class="page">
		<div class="detail-top">
			<div class="left box-bgc"><img :src="info.projectThumb"></div>
			<div class="right">
				<div>
					<strong class="fs18">{{info[`projectName${lang}`]}} {{info.projectSymbol}}</strong>
					<button type="button" class="mint-btn danger small ml50" style="vertical-align: bottom;" v-if="stage===1">{{$t('ieo.status_processing')}}<!-- 进行中 --></button>
					<button type="button" class="mint-btn success small ml50" style="vertical-align: bottom;" v-if="stage===2">{{$t('ieo.status_to_start')}}<!-- 即将开始 --></button>
					<button type="button" disabled="" class="mint-btn disabled small ml50" style="vertical-align: bottom;" v-if="stage===3">{{$t('ieo.status_over')}}<!-- 已结束 --></button>
				</div>
				<div class="mt20 fs13" v-html="info[`projectProfile${lang}`]"></div>
				<div class="mt20 items">
					<p>{{$t('ieo.status_start_purchase')}}<!-- 申购开始 -->： <span>{{new Date(info.startTime).format()}}</span></p>
					<p>{{$t('ieo.status_purchaes_deadline')}}<!-- 申购截止 -->： <span>{{new Date(info.endTime).format()}}</span></p>
				</div>
				<div class="mt15 items">
					<p>{{$t('ieo.subscription_price')}}<!-- 认购价格 -->： <span>1 {{info.priceSymbol}} = {{info.subscriptionPrice}} {{info.projectSymbol}} </span></p>
					<p class="ellipsis">{{$t('ieo.issue_number')}}<!-- 发行数量 -->： <span :title="`${String(info.totalIssue).toMoney()} ${info.projectSymbol}`">{{String(info.totalIssue).toMoney()}} {{info.projectSymbol}}</span></p>
				</div>
				<div class="mt15 items">
					<p class="ellipsis" v-if="false">{{$t('ieo.subscribed')}}<!-- 已认购 -->： <span :title="`${toFixed(info.totalQuantity-info.remainingQuantity,0).toMoney()} / ${toFixed(info.totalQuantity,0).toMoney()} Lots`">{{`${toFixed(info.totalQuantity-info.remainingQuantity,0).toMoney()} / ${toFixed(info.totalQuantity,0).toMoney()} Lots`}}</span></p>
					<p class="ellipsis">{{$t('ieo.raised_amount')}}<!-- 募集金额 -->： <span :title="`${String(info.totalRaised).toMoney()} ${info.priceSymbol}`">{{String(info.totalRaised).toMoney()}} {{info.priceSymbol}}</span></p>
				</div>
				<div class="mt20 progress-container">
					<div class="progress" sty v-if="false">
						<div class="progress-bar-base"></div>
						<div class="progress-bar" :style="`width: ${(info.totalQuantity-info.remainingQuantity)/info.totalQuantity*100>100?100:(info.totalQuantity-info.remainingQuantity)/info.totalQuantity*100}%`"></div>
						<p class="mt8 f-c-gray">{{$t('ieo.achieved')}}<!-- 已达成 -->： {{((info.totalQuantity-info.remainingQuantity)/info.totalQuantity*100).toFixed(2)}}%</p>
					</div>
					<div>
						<button type="button" class="mint-btn" :class="stage!==3?'success':'disabled'" :disabled="stage!==1"  @click="joinDialog()">{{$t('ieo.participate_immediately')}}<!-- 立即参与 --></button>
						<span class="f-c-danger fs12 ml20" v-if="stage!==3"><i v-if="stage===2">{{$t('ieo.start_of_distance')}}<!-- 距离开始 --></i><i v-if="stage===1">{{$t('ieo.remaining')}}<!-- 剩余 --></i>：{{info.getMsec(info)|humanTime(lang)}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="title box mt10">{{$t('ieo.project_progres')}}<!-- 项目进度 --></div>
		<div class="steps-container box-bgc">
			<div class="steps">
				<span :class="{active: serverTime>= info.startTime}"></span>
				<span :class="{active: serverTime>= info.endTime}"></span>
				<span :class="{active: serverTime>= info.paidTime}"></span>
				<span :class="{active: serverTime>= info.releaseTime}"></span>
			</div>
			<div class="steps-bar ui-flex">
				<div class="ui-flex-1 rp"><span :style="getProgress1"></span></div>
				<div class="ui-flex-1 rp"><span :style="getProgress2"></span></div>
				<div class="ui-flex-1 rp"><span :style="getProgress3"></span></div>
			</div>
			<div class="steps-title mt20">
				<span>{{$t('ieo.status_start_purchase')}}<!-- 申购开始 -->：{{new Date(info.startTime).format()}}</span>
				<span>{{$t('ieo.status_purchaes_deadline')}}<!-- 申购截止 -->：{{new Date(info.endTime).format()}}</span>
				<span>{{$t('ieo.deduction_time')}}<!-- 扣款时间 -->：{{new Date(info.paidTime).format()}}</span>
				<span>{{$t('ieo.currency_time')}}<!-- 发币时间 -->：{{new Date(info.releaseTime).format()}}</span>
			</div>
		</div>
		<div class="mt10 detail-bottom">
			<div class="brief">
				<div class="title box">{{$t('ieo.project_detail')}}<!-- 项目详情 --></div>
				<div class="inner box-bgc" v-html="info[`projectDetail${lang}`]"></div>
			</div>
			<div class="rules">
				<div class="title box">{{$t('ieo.participation_rules')}}<!-- 参与规则 --></div>
				<div class="inner box-bgc" v-html="info[`participationRules${lang}`]"></div>
			</div>
		</div>
		<div class="mask-layer" v-show="locked">
			<div class="center"><loading/></div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import ieoApi from '@/api/ieo'
import joinDialog from './join'
import loading from '@/components/loading'
import socket from '@/assets/js/socket'
import Config from '@/assets/js/config'
import numUtils from '@/assets/js/numberUtils'
export default {
	components: {
	  loading
	},
	data(){
		return {
			info:{},
			stage:3,
			timer:0,
			interVal:null,
			locked:true,
			socket:null,
			serverTime:null
		}
	},
	computed:{
		...mapGetters(['getLang', 'getApiToken']),
		lang(){
			if(this.getLang==='zh-CN' || this.getLang==='cht'){
				return ''
			} else {
				return 'En'
			}
		},
		getProgress1(){
			let duration = Math.round((this.serverTime -this.info.startTime) / (this.info.endTime - this.info.startTime) *100)
			duration = duration<=0?0:duration
			duration = duration>100?100:duration
			return {width:duration+'%'}
		},
		getProgress2(){
			let duration = Math.round((this.serverTime -this.info.endTime) / (this.info.paidTime - this.info.endTime) *100)
			duration = duration<=0?0:duration
			duration = duration>100?100:duration
			return {width:duration+'%'}
		},
		getProgress3(){
			let duration = Math.round((this.serverTime -this.info.paidTime) / (this.info.releaseTime - this.info.paidTime) *100)
			duration = duration<=0?0:duration
			duration = duration>100?100:duration
			return {width:duration+'%'}
		}
	},
	watch:{
		stage(_n){
			if(_n===1){
				this.connectSoket()
			}
		}
	},
	created(){
		this.getIEOprojectsDetail()
	},
	destroyed(){
		clearInterval(this.interVal)
		this.socket && this.socket.destroy()
	},

	methods:{
		toFixed (value, fixed) {
		  return numUtils.BN(value || 0).toFixed(fixed === undefined ? 2 : fixed)
		},
		mergeData(data){
			if(data.dataType==='ieo'){
				if(!Number(data.data.remainingQuantity)){
					this.stage = 3
					return
				}
				this.info.remainingQuantity = Number(data.data.remainingQuantity)
			}
		},
		connectSoket(){
			let host = location.host.toLowerCase(), url = `${Config.protocol}${Config.domain}/ws9501`
			if(host.indexOf('gcox.com') !== -1 &&  host.indexOf('exchange-staging.gcox.com') === -1) {
			  url = `${Config.protocol}ws-exchange.gcox.com/ws9501`
			}
			this.socket = new socket(url)
			this.socket.on('open', ()=>{
	            this.socket.send({
	            	event: 'addChannel',
	                channel:'subscribe_ieo',
	                project_id:this.info.projectId,
	                isZip:false
	            })
	        })
	        this.socket.on('message', this.mergeData)
	        this.socket.doOpen()
		},
		joinDialog(){
			if(!this.getApiToken){
				Vue.$confirmDialog({
				  id: 'PLEASE_LOGIN',
				  showCancel: true,
				  content: `${this.$t('exchange.exchange_Not_logged')}, ${this.$t('public0.public142')}`, // 请前往登录
				  okCallback: () => {
				    this.$router.push({path:'/login'})
				  }
				})
				return
			}
			if(JSON.stringify(this.info.accounts)==='{}'){
				Vue.$koallTipBox({icon: 'notification', message: this.$t('ieo.not_configured_payment_account')}) //项目未配置支付账户
				return
			}
			utils.setDialog(joinDialog, {
				info:this.info,
				okCallback: () => {
					this.getIEOprojectsDetail()
				}
			})
		},
		getIEOprojectsDetail(){
			ieoApi.getIEOprojectsDetail(this.$route.params.id,(res, serverTime)=>{
				this.locked = false
				this.timer = 0
				this.serverTime = serverTime
				if(!this.interVal){
					this.interVal = setInterval(()=>{this.timer += 1000},1000)
				}
				res.timestamp = serverTime
				res.paymentConfig = res.paymentConfig && res.paymentConfig.length?res.paymentConfig.reduce(function(obj,item){obj[item.symbol]=item;return obj;},{}):{}
				res.accounts = res.accounts && res.accounts.length?res.accounts.reduce(function(obj,item){obj[item.accountId]=item;return obj;},{}):{}
				if(res.startTime > serverTime){
					this.stage = 2
					res.getMsec = (project)=>{
						let msec = project.startTime - project.timestamp - this.timer
						if(msec<=0){
							this.getIEOprojectsDetail()
						}
						return msec>=0?msec:0
					}
				} else if(res.endTime > serverTime && res.remainingQuantity){
					this.stage = 1
					res.getMsec = (project)=>{
							let msec = project.endTime - project.timestamp - this.timer
							if(msec<=0){
								this.getIEOprojectsDetail()
							}
							return msec>=0?msec:0
						}
				}
				this.info = res
			}, msg=>{
				Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
			})
		}
	}

}
</script>

<style lang="less" scoped="">
@main-color:#00a0e9;
.box-bgc {background-color: #1A1A1A;}
.page {
	margin:12px auto 42px;
	width:1100px;
	position: relative;
	.box {padding-left: 20px; padding-right: 20px;}
	.inner {padding: 20px;}
}
.detail-top {
	display: flex;
	.left {
		width: 390px;
		min-width: 0;
		img {width: 100%; height: 100%; object-fit: cover; object-position: center;}
	}
	.right {
		flex: 1;
		box-sizing: border-box;
		min-height: 280px;
		background-color: #fff;
		padding: 25px 30px 15px;
	}
	.items {
		display: flex;
		> div, p {
			flex: 1;
			min-width: 0;
			span {color: #666; margin-left: 20px;}
		}
	}
}
.progress-container {
	display: flex;
	justify-content: space-between;
	> div:first-of-type {width: 280px;}
	> div:last-of-type {width: 50%;}
}
.progress {
	position: relative;
	text-align: center;
	&-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 8px;
		font-size: 0;
		background-color: @main-color;
		z-index: 1;
	}
	&-bar-base {
		height: 8px;
		line-height:0;
		font-size: 0;
		background-color: #eee;
	}
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
.steps-container {
	margin:55px 20px 50px; position: relative;
	.steps {
		height: 6px;
		line-height: 0;
		font-size: 0;
		background-color:#383838;
		position: relative;
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
		span {
			width: 12px;
			height: 12px;
			background-color:#383838;
			border-radius: 12px;
			margin-top: -3px;
			position: relative;
			z-index: 2;
			&.active {background-color:@main-color;}
		}
	}
	.steps-bar {
		height: 6px; position: absolute; top: 0; left: 0; right: 0; z-index: 1;
		span {position: absolute; height: 100%;left: 0; top: 0; background-color: @main-color;}
	}
	.steps-title {
		display: flex;
		justify-content: space-between;
		color: #fff;
	}
}
.detail-bottom {
	display: flex;
	.brief {flex: 1; color: #fff; line-height: 1.5em;}
	.rules {width: 400px; margin-left: 10px; color: #fff; line-height: 1.5em;}
}
.center { position: absolute; left: 50%; top: 50%; margin-left: -24px; margin-top: -24px; }
</style>