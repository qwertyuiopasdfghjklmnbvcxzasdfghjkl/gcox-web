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
          <button type="button" class="mint-btn default copy" v-clipboard:copy="invitedInfo.myInvitationCode" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('referral.copy')}}<!-- 复制 --></button>
        </div>
        <div class="item">
          <span>{{$t('referral.invitation_link')}}<!-- Invitation Link -->:</span> {{myInvitationUrl}}
          <button type="button" class="mint-btn default copy" v-clipboard:copy="myInvitationUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('referral.copy')}}<!-- 复制 --></button>
        </div>
        <div class="item">
          <span>{{$t('referral.share_to')}}<!-- Share to -->:</span>
          <div class="media"><a class="icon-twitter f-c-white" :href="`https://twitter.com/share?text=${shareTitle}&url=${myInvitationUrl}`"  target="_blank"></a> <a class="icon-facebook1 f-c-white" :href="`https://www.facebook.com/sharer.php?title=${shareTitle}&u=${myInvitationUrl}`" target="_blank"></a></div>
        </div>
      </div>
    </div>

    <div class="ref-profit mt50 ui-flex">
      <div class="ui-flex-1">
        <p class="fs16">{{$t('referral.refunded')}} <template v-if="getSiteType==1">(ACM)</template> <!-- Refunded --></p>
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
        <li class="ui-flex-1" :class="{active:!active}" @click="active=(getSiteType==1?false:true)">{{$t('referral.program_rules')}}<!-- Program Rules --></li>
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
              <span class="ui-flex-1">{{$t('referral.refunded')}}<!-- Refunded --> <template v-if="getSiteType==1">(ACM)</template></span>
            </li>
            <li class="ui-flex" v-for="item in historyList">
              <span class="ui-flex-1">{{item.username}}</span>
              <span class="ui-flex-1">{{item.registerTime}}</span>
              <span class="ui-flex-1">{{getStatus(item.status)}}</span>
              <span class="ui-flex-1">{{item.status!==-1?item.amount:0}}</span>
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
        <template v-if="getLang==='zh-CN'">
          <h3 class="text-center">--邀请朋友注册GCOX交易所赢取丰厚奖励--</h3>
          <p class="mt20">亲爱的GCOX用户，</p>
          <p class="mt20">感谢您对我们ACM 1X2激励计划的大力支持。我们很荣幸乐见此计划在用户中大受欢迎。</p>
          <p class="mt20">由于奖励力度巨大，在此我们将通知您，新用户注册50 ACM奖励与邀请朋友注册25 ACM奖励将会在2019年10月7日23:59（东八区时间）截止。</p>
          <p class="mt20">再次感谢您的支持并请持续关注我们的社交媒体。</p>
          <p class="mt20">注册与邀请奖励计划已结束。</p>
          <p class="mt20">奖励标准：</p>
          <p>• 2019年8月19日下午1点后在GCOX交易所注册（东八区时间）</p>
          <p>• 完成并通过KYC流程</p>
          <p class="mt20">注释*</p>
          <p>*ACM交易钱包——可买卖ACM代币与其他数字货币</p>
          <p>*ACM质押钱包——质押钱包中的ACM将被锁定，每周释放1%的金额到您的交易钱包</p>
          <p>*被邀请人需完成并通过KYC流程才将视为成功邀请</p>
        </template>
        <template v-else-if="getLang==='kr'">
          <h3 class="text-center">-GCOX 거래소에 등록하고 친구를 추천하면 보너스를 받으실 수 있습니다-</h3>
          <p class="mt20">ACM 1x2 보상 프로그램에 대해 사용자 여러분이 보여주신 뜨거운 관심과 성원에 감사의 말씀 올립니다. ACM 프로그램이 사용자 여러분들께 많은 사랑을 받고 있어 기쁩니다.</p>
          <p class="mt20">신규 사용자 당 50 ACM의 신규 가입 보너스와 레퍼럴 당 25 ACM의 레퍼럴 보너스가 10월 7일 23시 59분 (GMT+8)부터 마감되었습니다.</p>
          <p class="mt20">다시 한 번 사용자 여러분께 감사의 인사를 올리며 저희 소셜 네트워크 채널에 주목하시고 GCOX Exchange에서 앞으로 진행할 캠페인에 대한 정보를 놓치지 마세요.</p>
          <p class="mt20">이미 완성된 등록 및 레퍼럴 캠페인</p>
          <p class="mt20">해당 자격:</p>
          <p>• 9월 19일 오후 1시(GMT+8)  후에 GCOX거래소에 등록하신 사용자</p>
          <p>• KYC를 통과하신 사용자</p>
          <p class="mt20">추가 설명:</p>
          <p>• 거래 지갑 – 거래 지갑에 있는 ACM은 거래할 수 있습니다.</p>
          <p>• 스테이킹 지갑 – 스테이킹 지갑에 있는 ACM은 잠겨 있는 상태이며 매주 1%씩 해제됩니다.</p>
          <p>• 추천하신 사용자가 KYC를 통과하신 경우만 추천 성공으로 판단합니다.</p>
        </template>
        <template v-else>
          <h3 class="text-center">--Register on GCOX Exchange and invite your friends to earn attractive bonuses—</h3>
          <p class="mt20">We would like to express our sincere gratitude for the overwhelming support to our ACM 1x2 Acclamation Programme. We are pleased to see our ACM programme is so popular with all our users.</p>
          <p class="mt20">Please be informed that we will be discontinuing the new sign up bonus of 50 ACM tokens per new user and referral bonus of 25 ACM tokens per successful referral on 7th October 23:59(GMT+8).</p>
          <p class="mt20">Thank you and please stay tuned to our socials for more campaigns on GCOX Exchange in the future. </p>
          <p class="mt20">Completed Registration and Referral Campaign</p>
          <p class="">Eligibility Criteria:</p>
          <p>• Register on GCOX Exchange after 19th August, 1pm(GMT+8)</p>
          <p>• Complete the KYC Process</p>
          <p class="mt20">Notes:</p>
          <p>• Trading Wallet – ACM balance held in the Trading Wallet can be used for trading</p>
          <p>• Staking Wallet – ACM balance held in the Staking Wallet is locked and 1% of the staked amount will be release on a weekly basis</p>
          <p>• Referrals are deemed successful once the referred user has completed their KYC process.</p>
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
  import Config from '@/assets/js/config'

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
      ...mapGetters(['getUserInfo','getLang', 'getSiteType']),
      myInvitationUrl(){
        return `${Config.origin}/register?ref=${this.invitedInfo.myInvitationCode}`
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
      onCopy () {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`usercontent.copy-success`)})
      },
      onError () {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`usercontent.copy-error`)})
      },
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

