<template>
  <div class="referral">
    <div class="ref-info ui-flex">
      <div class="ref-qr">
        <div ref="inviteQR" class="inviteQR"></div>
        <p class="mt10">{{$t('referral.referral_title')}}<!-- Invite friend to scan QR code to register --></p>
      </div>
      <div class="ui-flex-1 ml20">
        <div class="item">
          <span>{{$t('referral.invitation_code')}}<!-- Invitation Code -->:</span> {{invitedInfo.myInvitationCode}}
          <button type="button" class="mint-btn default copy" @click="copyText(invitedInfo.myInvitationCode)">{{$t('referral.copy')}}<!-- 复制 --></button>
        </div>
        <div class="item">
          <span>{{$t('referral.invitation_link')}}<!-- Invitation Link -->:</span> {{myInvitationUrl}}
          <button type="button" class="mint-btn default copy" @click="copyText(myInvitationUrl)">{{$t('referral.copy')}}<!-- 复制 --></button>
        </div>
        <div class="item">
          <span>{{$t('referral.share_to')}}<!-- Share to -->:</span>
          <div class="media"><a class="icon-twitter f-c-white" :href="`https://twitter.com/share?text=${shareTitle}&url=${myInvitationUrl}`"  target="_blank"></a> <a class="icon-facebook1 f-c-white" :href="`https://www.facebook.com/sharer.php?title=${shareTitle}&u=${myInvitationUrl}`" target="_blank"></a></div>
        </div>
      </div>
    </div>

    <div class="ref-profit mt50 ui-flex">
      <div class="ui-flex-1">
        <p class="fs16">{{$t('referral.refunded')}} (ACM) <!-- Refunded --></p>
        <p class="f-c-main fs24 mt10"><strong>{{invitedInfo.rewardCount | numbean}}</strong></p>
      </div>
      <div class="ml15 ui-flex-1">
        <p class="fs16">{{$t('referral.invitees_num')}}<!-- Number of Invitees --></p>
        <p class="f-c-main fs24 mt10"><strong>{{invitedInfo.invitedCount}} {{$t('referral.invitees')}}<!-- Invitees --></strong></p>
      </div>
    </div>

    <div class="ref-history mt50">
      <ul class="tabs ui-flex">
        <li class="ui-flex-1" :class="{active:active}" @click="active=true">{{$t('referral.invitation_history')}}<!-- Invitation History --></li>
        <li class="ui-flex-1" :class="{active:!active}" @click="active=false">{{$t('referral.program_rules')}}<!-- Program Rules --></li>
      </ul>
      <div class="mt40 detail" v-show="active">
        <ul class="selector ui-flex">
          <li>
            <p>{{$t('referral.date')}}<!-- Date --></p>
            <div><button type="button" class="mint-btn default" @click="setTime('day')">{{$t('referral.today')}}<!-- Today --></button></div>
          </li>
          <li>
            <p>{{$t('referral.start_date')}}<!-- Start Date --></p>
            <div><button type="button" class="mint-btn default" @click="setTime('month')">{{$t('referral.last_one_month')}}<!-- Last one month --></button></div>
          </li>
          <li>
            <p>{{$t('referral.end_date')}}<!-- End Date --></p>
            <div><button type="button" class="mint-btn default" @click="setTime('year')">{{$t('referral.last_one_year')}}<!-- Last one year --></button></div>
          </li>
          <li>
            <p>{{$t('referral.invitation_status')}}<!-- Invitation Status --></p>
            <div class="rp">
              <button type="button" class="mint-btn default status" @click="showStatus=!showStatus">{{getStatus(params.status)}} <i :class="[showStatus?'icon-arrow-up2':'icon-arrow-down3']"></i></button>
              <div class="status-list" v-show="showStatus">
                <div v-for="item in statusList" @click="params.status=item,showStatus=false">{{getStatus(item)}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="ref-history-list mt60">
          <ul>
            <li class="header ui-flex">
              <span class="ui-flex-1">{{$t('account.user_center_account')}}<!-- Account --></span>
              <span class="ui-flex-1">{{$t('referral.registeration_time')}}<!-- Registeration Time --></span>
              <span class="ui-flex-1">{{$t('referral.invitation_status')}}<!-- Invitation Status --></span>
              <span class="ui-flex-1">{{$t('referral.refunded')}}<!-- Refunded --> (ACM)</span>
            </li>
            <li class="ui-flex" v-for="item in historyList">
              <span class="ui-flex-1">{{item.username}}</span>
              <span class="ui-flex-1">{{item.registerTime}}</span>
              <span class="ui-flex-1">{{getStatus(item.status)}}</span>
              <span class="ui-flex-1">{{item.amount}}</span>
            </li>
          </ul>
          <page v-if="!showLoading && historyList.length > 0" :pageIndex="params.page" :pageSize="params.size"
                :total="total" @changePageIndex="pageChange"/>
          <div class="nodata text-center mt20" v-if="!showLoading && historyList.length === 0">
            <div class="nodata-icon icon-no-order"></div>
            <div class="nodata-text">{{$t('public0.public50')}}<!--暂无相关数据--></div>
          </div>
          <loading v-if="showLoading"/>
        </div>
      </div>
      <div class="mt40 detail lh17" v-show="!active">
        <template v-if="getLang==='en'">
          <h3 class="text-center">--Register on GCOX Exchange and invite your friends to earn attractive bonuses--</h3>
          <p class="mt20">Eligibility Criteria:</p>
          <p>• Register on GCOX Exchange after 19th August, 1pm(GMT+8) </p>
          <p>• Complete the KYC Process</p>
          <p class="mt20">Rewards:</p>
          <p>One-time reward of 100 ACM tokens to your Staking Wallet*. </p>
          <p class="mt20">Also, we are pleased to introduce our referral scheme where you can earn attractive bonuses by simply sharing your referral code with your friends and inviting them to sign up on GCOX Exchange! </p>
          <p class="mt20">Eligibility Criteria:</p>
          <p>• Invite your friends to sign up on GCOX Exchange using your referral code after 19th August, 1 pm(GMT+8)</p>
          <p>• Your friend completes the KYC Process</p>
          <p class="mt20">Rewards:</p>
          <p>50 ACM tokens reward to your Staking Wallet* for every successful referral**, NO CAP! The more you invite, the more you earn!</p>
          <p class="mt20">Notes:</p>
          <p>* Trading Wallet – ACM balance held in the Trading Wallet can be used for trading</p>
          <p>* Staking Wallet – ACM balance held in the Staking Wallet is locked and 1% of the staked amount will be release on a weekly basis</p>
        </template>
        <template v-else>
          <h3 class="text-center">--- “注册奖励计划” ---</h3>
          <p class="text-center mt10">在GCOX交易所注册并邀请您的朋友赚取丰厚奖励！</p>
          <p class="mt20">新用户注册奖励：</p>
          <p>• 一次性100个ACM代币空投至用户的质押钱包* </p>
          <p class="mt20">奖励标准：</p>
          <p>• 8月19日下午1:00后在GCOX交易所注册(GMT+8)</p>
          <p>• 完成KYC流程</p>
          <p class="mt20">邀请注册奖励：</p>
          <p>此外，我们很高兴向您介绍我们的“推荐奖励计划”。每成功推荐一位身边的朋友在GCOX注册并完成KYC，即可获得50个ACM代币奖励，无上限！邀请的越多，赚的越多！</p>
          <p class="mt20">奖励标准：</p>
          <p>• 被邀请人于8月19日下午1:00后通过邀请人发送的邀请码在GCOX交易所注册(GMT+8)</p>
          <p>• 被邀请人完成KYC流程</p>
          <p class="mt20">注释*</p>
          <p>ACM交易钱包——可买卖ACM代币与其他数字货币</p>
          <p>ACM质押钱包——质押钱包中的ACM将被锁定，每周释放1%的金额到您的交易钱包</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import utils from '@/assets/js/utils'
  import loading from '@/components/loading'
  import userApi from '@/api/user'
  import page from '@/components/page'

  export default {
    components: {
      page,
      loading,
    },
    data () {
      return {
        showLoading: false,
        showStatus: false,
        active:true,
        invitedInfo:{},
        statusList:['',1,-1],
        historyList:[],
        params:{
          status:'',
          page:1,
          size:10,
          startTime:''
        },
        total:0,

      }
    },
    computed: {
      ...mapGetters(['getUserInfo','getLang']),
      myInvitationUrl(){
        return `http://${location.host}/register?ref=${this.invitedInfo.myInvitationCode}`
      },
      shareTitle(){
        if(this.getLang==='en')
          return `GCOX invitation from ${this.getUserInfo.nickname||this.getUserInfo.username}`
        else
          return `来自${this.getUserInfo.nickname||this.getUserInfo.username}的GCOX邀请`
      },
      paramsChange(){
        return {
          status:this.params.status,
          page:this.params.page,
          size:this.params.size,
          startTime:this.params.startTime
        }
      }
    },
    watch: {
      paramsChange(){
        this.getInvitedRecord()
      }
    },
    created () {
      this.getInvitedInfo()
      this.getInvitedRecord()
    },
    mounted(){
      
    },
    methods: {
      ...mapActions([]),
      setTime(key){
        let nowdate = new Date()
        switch (key){
          case 'day':
            nowdate = new Date(nowdate.setHours(0, 0, 0, 0)).getTime()
            break
          case 'month':
            nowdate = new Date(nowdate.setHours(0, 0, 0, 0))
            nowdate = new Date(nowdate.setMonth(nowdate.getMonth()-1)).getTime()
            break
          default:
            nowdate = new Date(nowdate.setHours(0, 0, 0, 0))
            nowdate = new Date(nowdate.setFullYear(nowdate.getFullYear()-1)).getTime()
        }
        this.params.startTime = nowdate
      },
      getInvitedInfo(){
        userApi.getInvitedInfo(res=>{
          this.invitedInfo = res
          this.initQRCode()
        },msg=>{
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      getInvitedRecord(){
        this.showLoading = true
        userApi.getInvitedRecord(this.params,(total,res)=>{
          this.historyList = res
          this.total = total
          this.showLoading = false
        },msg=>{
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          this.showLoading = false
        })
      },
      pageChange (currentIndex) {
        this.params.page = currentIndex
      },
      getStatus(status){
        let rst = ''
        switch(status){
          case '': rst = this.$t('trade_record.trade_record_all'); break;
          case 0:
          case 1: rst = this.$t('account.user_complete'); break;
          case -1: rst = this.$t('account.user_uncompleted'); break;
        }
        return rst
      },
      copyText(str){
        utils.copyText(str)
        Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')})
      },
      initQRCode(){
        //初始化二维码
        utils.qrcode(this.$refs.inviteQR, {
          text: this.myInvitationUrl,
          colorDark:'#00a0e9',
          width: 116,
          height: 116,
        })
      },
      
    }
  }
</script>

<style scoped lang="less">
.referral {
  color: #ffffff;
  background: rgba(27, 26, 31, 0.9);
  padding: 20px;
  min-height: 200px;
}
.ref-info {
  .ref-qr {width: 136px;}
  .inviteQR {
    width: 116px; height: 116px; background-color: #fff; padding: 10px; 
    /deep/ img, canvas {width: 100%;}
  }
  .item {
    line-height: 40px; border-bottom: 1px solid #302826;
    position: relative;
    span {display: inline-block; min-width: 130px; vertical-align: middle;}
    .copy {position: absolute; right: 0; width: 100px; height: 26px; background-color: #616060; border:none; color: #fff; cursor: pointer; margin-top: 7px; font-size: 14px;}
    .media {
      font-size: 20px;
      display: inline-block;
      vertical-align: middle;
      a {cursor: pointer;}
      a + a {margin-left: 20px;}
    }
    
  }
}
.ref-profit {
  > div { background-color: #3F3A3A; padding:18px 0;  text-align: center;}
}
.ref-history {
  .tabs {
    border-bottom: 1px solid #413E3D;
    li {color: #444140; text-align: center; font-size: 16px; cursor: pointer; font-weight: 600; line-height:40px; position: relative;}
    li.active {color: #00a0e9;}
    li:after {
      content: '';
      position: absolute;
      width: 110px;
      height: 5px;
      left: 50%;
      margin-left: -55px;
      bottom: -3px;
      background-color: #444140;
    }
    li.active:after {
      background-color: #00a0e9;
    }
  }
  .detail {
    min-height: 200px;
  }
  .selector {
    li {
      min-width: 80px; text-align: center; &+li {margin-left: 35px;}
      p {padding-bottom: 10px;}
      button {
        background-color: #615F5F; color: #fff; font-size: 14px; position: relative;
        i {position: absolute; right: 10px; top: 11px;}
      }
      .status {width: 140px;}
    }
  }
}
.status-list {
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 1px;
  border-radius: 4px;
  background-color:#615f5f;
  line-height: 35px;
  z-index: 1;
  > div {border-bottom: 1px solid #545454; cursor:pointer; &:last-of-type{border-bottom: none;} &:hover {background-color: #545454;}}
}
.ref-history-list ul li {line-height: 35px; padding-left: 15px; padding-right: 15px;}
.ref-history-list ul li:not(.header){
  border-bottom: 1px solid #423E3D;
  &:hover {background-color: #3F3B3A;}
}
.nodata .nodata-icon {
    height: 80px;
    line-height: 80px;
    font-size: 40px;
    color: #A1A1A1;
  }

.nodata .nodata-text {
    height: 40px;
    line-height: 20px;
    color: #A1A1A1;
  }
</style>

