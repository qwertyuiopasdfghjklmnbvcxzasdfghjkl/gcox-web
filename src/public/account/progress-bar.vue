<template>
    <div class="cont">
      <p class="top">{{$t('account.add_release_title')}}<!-- Trading Amount Require For Additional 1% Bonus Release --></p>
      <div class="bar ui-flex mt10">
        <span class="bar-vol">{{getPercent}}%</span>
        <label class="bar-cont ui-flex-1 ml5">
          <i>$ {{data.thisWeekDealAmount?data.thisWeekDealAmount.toFixed(2):'-'}}/{{tarAmount}}</i>
          <span :style="{width:getProgress+'%'}"></span>
        </label>
        <p class="ml20">{{$t('account.target_amount')}}<!-- Target Amount -->: $ {{tarAmount}}</p>
      </div>
      <p class="bottom mt10">{{$t('account.your_progress')}}<!-- Your Progress -->:&nbsp;&nbsp;&nbsp;{{getWeekStartDate().format('yyyy-MM-dd')}}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{{getWeekEndDate().format('yyyy-MM-dd')}}</p>
    </div>
</template>

<script>
import userUtils from '@/api/wallet'
import utils from '@/assets/js/utils'
var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //

export default {
  name: 'progress-bar',
  data(){
    return {
      data:{}
    }
  },
  computed:{
    tarAmount(){
      let amount = this.data.lastWeekDealAmount?utils.removeEndZero((this.data.lastWeekDealAmount*0.05).toFixed(2)):'-'
      return amount
    },
    getPercent(){
      if(!this.data.lastWeekDealAmount){
        return '-'
      } else {
        return (this.data.thisWeekDealAmount / (this.data.lastWeekDealAmount*0.05) * 100).toFixed(2)
      }
    },
    getProgress(){
      if(!this.data.lastWeekDealAmount){
        return 0
      } else {
        let p = (this.data.thisWeekDealAmount / (this.data.lastWeekDealAmount*0.05) * 100).toFixed(2)
        if(Number(p)>=100){
          p = '100'
        }
        return p
      }
    }
  },
  created(){
    this.getUnlockSchedule()
  },
  methods:{
    getUnlockSchedule(){
      userUtils.getUnlockSchedule((res) => {
        console.log(res)
        this.data = res
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    getWeekStartDate() { //获得本周的开始日期 
      var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
      return weekStartDate
    },
    getWeekEndDate() { //获得本周的结束日期 
      var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
      return weekEndDate
    } 

  }
}
</script>

<style scoped lang="less">
.cont{
  width: 500px;
  .bar{
    .bar-cont {
      background-color: #3f3b3a; position: relative; text-align: center;
      i {position: relative; z-index: 1;}
      span {position: absolute; left: 0;top: 0; bottom: 0;  background: -webkit-linear-gradient(left,#003659,#1e89cb); background: linear-gradient(left,#003659,#1e89cb);}
    }
  }
}
</style>
