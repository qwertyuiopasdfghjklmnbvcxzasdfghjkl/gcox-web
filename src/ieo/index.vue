<template>
	<div class="page">
		<img :src="getSysParams.ieoBanner && getSysParams.ieoBanner.value" class="banner-brief">
		<ul class="tab-bar efont"><a name="A"></a>
			<li class="active"><a href="#A">{{$t('ieo.status_processing')}}<!-- 进行中 --></a></li>
			<li><a href="#B">{{$t('ieo.status_to_start')}}<!-- 即将开始 --></a></li>
			<li><a href="#C">{{$t('ieo.status_over')}}<!-- 已结束 --></a></li>
		</ul>
		<div class="title box">{{$t('ieo.status_processing')}}<!-- 进行中 --></div>
		<ul class="items-container clearfix">
			<li v-for="item in list1" :key="item.projectId" @click="goDetail(item.projectId)">
				<p class="rp">
					<img :src="item.projectLogo">
					<span class="fs16 ptitle"><font>{{item[`projectName${lang}`]}} {{item.projectSymbol}}</font></span>
				</p>
				<p class="mt25">{{$t('ieo.status_start_purchase')}}<!-- 申购开始 -->： <span>{{new Date(item.startTime).format()}}</span></p>
				<p class="mt15">{{$t('ieo.status_purchaes_deadline')}}<!-- 申购截止 -->： <span>{{new Date(item.endTime).format()}}</span></p>
				<p class="mt15 ellipsis">{{$t('ieo.issue_number')}}<!-- 发行数量 -->： <span :title="`${String(item.totalIssue).toMoney()} ${item.projectSymbol}`">{{String(item.totalIssue).toMoney()}} {{item.projectSymbol}}</span></p>
				<p class="mt15 ellipsis">{{$t('ieo.raised_amount')}}<!-- 募集金额 -->： <span :title="`${String(item.totalRaised).toMoney()} ${item.priceSymbol}`">{{String(item.totalRaised).toMoney()}} {{item.priceSymbol}}</span></p>
				<p class="mt15 ellipsis" v-if="false">{{$t('ieo.subscribed')}}<!-- 已认购 -->： <span :title="`${toFixed(item.totalQuantity-item.remainingQuantity,0).toMoney()} / ${toFixed(item.totalQuantity,0).toMoney()} Lots`">{{`${toFixed(item.totalQuantity-item.remainingQuantity,0).toMoney()} / ${toFixed(item.totalQuantity,0).toMoney()} Lots`}}</span></p>
				<div class="progress mt20" v-if="false">
					<div class="progress-bar-base"></div>
					<div class="progress-bar" :style="`width: ${(item.totalQuantity-item.remainingQuantity)/item.totalQuantity*100>100?100:(item.totalQuantity-item.remainingQuantity)/item.totalQuantity*100}%`"></div>
				</div>
				<p class="mt8 text-center" v-if="false">{{$t('ieo.achieved')}}<!-- 已达成 --> {{((item.totalQuantity-item.remainingQuantity)/item.totalQuantity*100).toFixed(2)}}%</p>
				<p class="mt15 text-right f-c-main">{{$t('ieo.participate_immediately')}} →</p>
				<button>{{$t('ieo.end_of_distance')}}<!-- 距离结束 -->：{{item.getMsec(item)|humanTime(lang)}}</button>
			</li>
		</ul>
		<div class="nodata" v-if="!locked && list1.length === 0">
		  <div class="nodata-icon icon-stars"></div>
		</div>
		<a name="B"></a>
		<div class="title box mt10">{{$t('ieo.status_to_start')}}<!-- 即将开始 --></div>
		<ul class="items-container wait clearfix">
			<li v-for="item in list2" :key="item.projectId" @click="goDetail(item.projectId)">
				<p class="rp">
					<img :src="item.projectLogo">
					<span class="fs16 ptitle">{{item[`projectName${lang}`]}} {{item.projectSymbol}}</span>
				</p>
				<p class="mt25">{{$t('ieo.status_start_purchase')}}<!-- 申购开始 -->： <span>{{new Date(item.startTime).format()}}</span></p>
				<p class="mt15">{{$t('ieo.status_purchaes_deadline')}}<!-- 申购截止 -->： <span>{{new Date(item.endTime).format()}}</span></p>
				<p class="mt15 ellipsis">{{$t('ieo.issue_number')}}<!-- 发行数量 -->： <span :title="`${String(item.totalIssue).toMoney()} ${item.projectSymbol}`">{{String(item.totalIssue).toMoney()}} {{item.projectSymbol}}</span></p>
				<p class="mt15 ellipsis">{{$t('ieo.raised_amount')}}<!-- 募集金额 -->： <span :title="`${String(item.totalRaised).toMoney()} ${item.priceSymbol}`">{{String(item.totalRaised).toMoney()}} {{item.priceSymbol}}</span></p>
				<p class="mt15 ellipsis" v-if="false">{{$t('ieo.subscribed')}}<!-- 已认购 -->： <span :title="`${toFixed(item.totalQuantity-item.remainingQuantity,0).toMoney()} / ${toFixed(item.totalQuantity,0).toMoney()} Lots`">{{`${toFixed(item.totalQuantity-item.remainingQuantity,0).toMoney()} / ${toFixed(item.totalQuantity,0).toMoney()} Lots`}}</span></p>
				<button>{{$t('ieo.start_of_distance')}}<!-- 距离开始 -->：{{item.getMsec(item)|humanTime(lang)}}</button>
			</li>
		</ul>
		<div class="nodata" v-if="!locked && list2.length === 0">
		  <div class="nodata-icon icon-stars"></div>
		</div>
		<a name="C"></a>
		<div class="title box mt10">{{$t('ieo.status_over')}}<!-- 已结束 --></div>
		<ul class="items-container finished clearfix">
			<li v-for="item in list3" :key="item.projectId" @click="goDetail(item.projectId)">
				<p class="rp">
					<img :src="item.projectLogo">
					<span class="fs16 ptitle">{{item[`projectName${lang}`]}} {{item.projectSymbol}}</span>
				</p>
				<p class="mt25">{{$t('ieo.status_start_purchase')}}<!-- 申购开始 -->： <span>{{new Date(item.startTime).format()}}</span></p>
				<p class="mt15">{{$t('ieo.status_purchaes_deadline')}}<!-- 申购截止 -->： <span>{{new Date(item.endTime).format()}}</span></p>
				<p class="mt15 ellipsis">{{$t('ieo.issue_number')}}<!-- 发行数量 -->： <span :title="`${String(item.totalIssue).toMoney()} ${item.projectSymbol}`">{{String(item.totalIssue).toMoney()}} {{item.projectSymbol}}</span></p>
				<p class="mt15 ellipsis">{{$t('ieo.raised_amount')}}<!-- 募集金额 -->： <span :title="`${String(item.totalRaised).toMoney()} ${item.priceSymbol}`">{{String(item.totalRaised).toMoney()}} {{item.priceSymbol}}</span></p>
				<p class="mt15 ellipsis" v-if="false">{{$t('ieo.subscribed')}}<!-- 已认购 -->： <span :title="`${toFixed(item.totalQuantity-item.remainingQuantity,0).toMoney()} / ${toFixed(item.totalQuantity,0).toMoney()} Lots`">{{`${toFixed(item.totalQuantity-item.remainingQuantity,0).toMoney()} / ${toFixed(item.totalQuantity,0).toMoney()} Lots`}}</span></p>
				<div class="progress mt20" v-if="false">
					<div class="progress-bar-base"></div>
					<div class="progress-bar" :style="`width: ${(item.totalQuantity-item.remainingQuantity)/item.totalQuantity*100>100?100:(item.totalQuantity-item.remainingQuantity)/item.totalQuantity*100}%`"></div>
				</div>
				<p class="mt8 text-center" v-if="false">{{$t('ieo.reach')}}<!-- 达成 --> {{((item.totalQuantity-item.remainingQuantity)/item.totalQuantity*100).toFixed(2)}}%</p>
			</li>
		</ul>
		<div class="nodata" v-if="!locked && list3.length === 0">
		  <div class="nodata-icon icon-stars"></div>
		</div>
		<div class="mask-layer" v-show="locked">
			<div class="center"><loading/></div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import loading from '@/components/loading'
import ieoApi from '@/api/ieo'
import socket from '@/assets/js/socket'
import Config from '@/assets/js/config'
import numUtils from '@/assets/js/numberUtils'

export default {
	components: {
	  loading
	},
	data(){
		return {
			list1: [],
			list2: [],
			list3: [],
			timer:0,
			interVal:null,
			locked:true,
			socket:null
		}
	},
	computed:{
		...mapGetters(['getLang','getSysParams']),
		lang(){
			if(this.getLang==='zh-CN' || this.getLang==='cht'){
				return ''
			} else {
				return 'En'
			}
		}
	},
	created(){
		this.getIEOProjectsList()
		this.connectSoket()
	},
	destroyed(){
		clearInterval(this.interVal)
		this.socket.destroy()
	},
	methods:{
		toFixed (value, fixed) {
		  return numUtils.BN(value || 0).toFixed(fixed === undefined ? 2 : fixed)
		},
		mergeData(data){
			if(data.dataType==='ieo' && data.data.length){
				for(let item of this.list1){
					for(let rd of data.data){
						if(item.projectId === rd.projectId){
							item.remainingQuantity = Number(rd.remainingQuantity)
							if(!rd.remainingQuantity){
								this.getIEOProjectsList()
							}
							break
						}
					}
				}
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
	                isZip:false
	            })
	        })
	        this.socket.on('message', this.mergeData)
	        this.socket.doOpen()
		},
		getIEOProjectsList(){
			ieoApi.getIEOProjectsList((list, serverTime)=>{
				let list1 = [], list2 = [], list3 = []
				this.locked = false
				this.timer = 0
				if(!this.interVal){
					this.interVal = setInterval(()=>{this.timer += 1000},1000)
				}
				for(let item of list){
					item.timestamp = serverTime
					if(item.startTime > serverTime){
						item.getMsec = (project)=>{
							let msec = project.startTime - project.timestamp - this.timer
							if(msec<=0){
								this.getIEOProjectsList()
							}
							return msec>=0?msec:0
						}
						list2.push(item)
					} else if(item.endTime > serverTime && item.remainingQuantity){
						item.getMsec = (project)=>{
							let msec = project.endTime - project.timestamp - this.timer
							if(msec<=0){
								this.getIEOProjectsList()
							}
							return msec>=0?msec:0
						}
						list1.push(item)
					} else {
						list3.push(item)
					}
				}
				this.list1 = list1
				this.list2 = list2
				this.list3 = list3
			}, msg=>{
				Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
			})
		},
		goDetail(id){
			this.$router.push({name:'ieo_detail', params:{id:id}})
		}
	}

}
</script>

<style lang="less" scoped="">
@main-color:#00a0e9;
.page {
	margin:12px auto 42px;
	width:1100px;
	background-color: #1A1A1A;
	position: relative;
	.box {padding-left: 20px; padding-right: 20px;}
}
.banner-brief {display: block; width: 100%; height: 340px;}
.tab-bar {
	margin-top: 10px;
	line-height: 56px;
	background-color: #000;
	border-bottom: 1px solid #37342F;
	li {
		display: inline-block;
		min-width: 180px;
		color: #fff;
		position: relative;
		text-align: center;
		font-size: 15px;
		a {
			display: block;
			color: #fff;
		}
		&.active {
			a {color: @main-color;}
			&:after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 3px;
				background-color:@main-color;
			}
		}
	}
}
.items-container {padding: 20px;}
.items-container li{
	box-sizing:border-box;
	float: left;
	width: 250px;
	padding: 10px 10px 70px;
	margin-right: 20px;
	margin-bottom: 20px;
	background:-webkit-linear-gradient(top, #1e2136,#1a1920);
	overflow-x: hidden;
	position: relative;
	cursor: pointer;
	&:nth-of-type(4n){
		margin-right: 0;
	}
	img {
		position:absolute;
		width: 58px;
		height: 58px;
		box-shadow:0px 2px 4px 0px rgba(6,0,1,0.2);
		border-radius:4px;
		object-fit: cover;
		object-position: center;
		
	}
	.ptitle {display: flex; margin-left: 65px;margin-top: 20px; height: 58px; overflow: hidden; flex-direction: column; justify-content: center;}
	.ptitle font {padding: 10px 8px; background-color: #171717;}
	p {font-size: 13px; color: #999;}
	p span {color: #fff; margin-left: 5px;}
	button {
		position: absolute;
		height: 46px;
		left: 0;
		width: 100%;
		bottom: 0;
		border:none;
		background-color:#E44242;
		color: #fff;
	}
	.progress {
		position: relative;
		text-align: center;
		&-bar {
			position: absolute;
			top: 0;
			left: 0;
			height: 3px;
			font-size: 0;
			background-color: #434361;
			z-index: 1;
		}
		&-bar-base {
			height: 3px;
			line-height:0;
			font-size: 0;
			background-color: #666;
		}
	}
}
.title {background-color: #000; color: #fff; font-size: 18px; line-height: 50px;}
.items-container.wait li button {background-color: #00A55E;}
.items-container.finished li {padding-bottom: 15px;}
.center { position: absolute; left: 50%; top: 50%; margin-left: -24px; margin-top: -24px; }

.nodata{text-align: center;}
.nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
a[name=A], a[name=B], a[name=C] {
	position: absolute;
	margin-top: -70px;
}
</style>