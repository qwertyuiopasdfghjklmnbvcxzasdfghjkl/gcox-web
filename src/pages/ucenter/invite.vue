<template>
  <div class="page">
    <cp-top-back :back="false" :showLogo="true">
    </cp-top-back>
    <div class="invite">
        <div class="banner">
           <div class="banner-img">
               <img src="../../assets/img/invite/banner.png"/>
           </div>
        </div>
        <div class="content">
                <div class="invite_code">
                    <div class="title">{{$t('referral.my_referral')}}<!--我的邀请信息--></div>
                    <div>
                        <div class="invite_list">
                            <div class="invite_caption12">{{$t('referral.referral_friends')}}<!--我的邀请好友--></div>
                            <div class="invite_caption1">
                                <div class="m1"></div>
                                <div>{{getUserInfo.totalM1}}</div>
                            </div>
                            <div class="invite_caption2">
                                <div class="m2"></div>
                                <div>{{getUserInfo.totalM2}}</div>
                            </div>
                            <div class="invite_caption3">
                                <div class="m3"></div>
                                <div>{{getUserInfo.totalM3}}</div>
                            </div>
                            <div class="invite_caption4">
                                <div>{{$t('referral.total')}}<!--合计--></div>
                                <div>{{(getUserInfo.totalM1) + (getUserInfo.totalM2) + (getUserInfo.totalM3)}}</div>
                            </div>
                        </div>
                        <div class="invite_list">
                            <div class="invite_caption12">{{$t('referral.commission_value')}}<!--我的邀请奖励--></div>
                            <div class="invite_caption1">
                                <div>{{(getUserInfo.totalM1) * 15}}&nbsp;ATN</div>
                                <div>{{(getUserInfo.totalM1) * 3}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                            <div class="invite_caption2">
                                <div>{{(getUserInfo.totalM2) * 10}}&nbsp;ATN</div>
                                <div>{{(getUserInfo.totalM2) * 2}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                            <div class="invite_caption3">
                                <div>{{(getUserInfo.totalM3) * 5}}&nbsp;ATN</div>
                                <div>{{(getUserInfo.totalM3) * 1}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                            <div class="invite_caption4">
                                <div>{{reward}}&nbsp;ATN</div>
                                <div>{{reward1}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                        </div>
                        <div class="invite_list my_code">
                            <div class="invite_caption12">{{$t('referral.referral_id')}}<!--我的邀请码--></div>
                            <div class="invite_caption_code">{{getUserInfo.myInvitationCode || '------'}}</div>
                        </div>
                        <div class="invite_list">
                            <div class="invite_caption_left">{{$t('referral.referral_way')}}<!--邀请方式--></div>
                        </div>
                        <div class="invite_list witer">
                            <div class="invite_caption_left">{{$t('referral.text')}}<!--文字--></div>
                            <div class="invite_list_content">{{aaa}}</div>
                            <span class="invite_span" @click="copyCode">{{$t('referral.referral_link')}}<!--复制邀请链接--></span>
                        </div>
                        <div v-if="shareImageUrl" class="invite_list witer">
                            <div class="invite_caption_left">{{$t('referral.poster')}}<!--海报--></div>
                            <span class="invite_span" @click="shareImg">{{$t('referral.invitation_poster')}}<!--邀请海报-->  </span>
                            <span class="share">{{$t('referral.share_to_friends')}}<!--点击分享给好友--></span>
                        </div>
                    </div>
                </div>
                <div class="invite_code_list">
                    <div class="title">{{$t('referral.invitation_rank')}}<!--邀请排行--></div>
                    <ul class="header">
                        <li>
                            <span>Top</span>
                            <span class="list-username">ID</span>
                            <span class="list-totalMx">{{$t('referral.referral_friends_count')}}<!--好友数--></span>
                            <span class="list-rewrard">{{$t('referral.commission')}}<!--奖励--></span>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="(data,index) in inviteData" :key="data.id">
                            <span :class="'number' + index" class="list_top">{{index+1}}</span>
                            <span class="list-username">{{data.username}}</span>
                            <span class="list-totalMx">{{data.totalMx}}</span>
                            <span class="list-rewrard">
                                <em>{{data.totalAwardBark}} &nbsp;ATN</em>
                                <em>{{data.totalAwardTicket}} &nbsp;{{$t('referral.gift_coupon')}} <!--奖券--></em>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="rule">
                    <div class="title">{{$t('referral.referral_rule')}} <!--邀请活动规则--></div>
                    <p>{{$t('referral.invite_reward_nt_1')}}<!--1. 一旦您推荐的好友成功完成注册，实名认证，他将获得660BARK的注册奖励和880BARK的实名认证奖励。--></p>
                    <p>{{$t('referral.invite_reward_nt_2')}}<!--2.您也将获得代币奖励。奖励规则为：每位M1：200BARK，M2：100BARK，M3：50BARK。（M1-M3为下级好友的层级。）--></p>
                    <p>{{$t('referral.invite_reward_nt_3')}}<!--3.您还将获得大量活动抽奖券奖励，每位M1：10张，M2：6张，M3：3 张。活动抽奖券会作为Bitark平台的糖果分发、手续费抽奖等活动的权重依据之一。
    我们将每个月收取手续费的5%加入抽奖活动奖池。若本月收取1000BTC手续费，50BTC加入抽奖活动奖池。--></p>
                    <p>{{$t('referral.invite_reward_nt_4')}}<!--4.邀请奖励均无上限限制。--></p>
                    <p>{{$t('referral.invite_reward_nt_5')}}<!--5. 为回馈前期用户的支持，在邀请活动开始前注册的用户均将自动获得M1-M3好友各一个及相应的奖励。--></p>
                    <p>{{$t('referral.invite_reward_nt_6')}}<!--6. 邀请活动开启时间见活动海报。邀请奖励每周发放一次。--></p>
                    <p>{{$t('referral.invite_reward_nt_7')}}<!--7.活动抽奖劵使用规则以官方活动的详细规则为准。抽奖随机数基于Bitcoin区块hash产生，代码将透明公开开源。--></p>
                    <p>{{$t('referral.invite_reward_nt_8')}}<!--8.Bitark保留随时对邀请活动规则进行调整的权利，但是对您推荐的好友数量没有限制。--></p>
                    <p>{{$t('referral.invite_reward_nt_9')}}<!--9. 被推荐人必须使用您的邀请链接、二维码或者邀请码注册才可以。--></p>
                    <p>{{$t('referral.invite_reward_nt_10')}}<!--10. Bitark会严查重复的或者虚假账户，一经发现，将不会支付奖励。--></p>
                    <div class="remark">
                        <div class="remark_title">
                            <span>*</span>{{$t('referral.important_notice')}}<!--特别注意：-->
                        </div>
                        <div class="detail">{{$t('referral.important_notice_nt')}}<!--由于市场环境的改变，欺诈风险的存在等原因，Bitark保留随时对活动邀请规则做出调整的最终解释权。--></div>
                    </div>
                </div>

        </div>
    </div>
    <mt-popup v-model="popupVisible" position="center">
      <div ref="shareImg" class="share-img">
        <img :src="shareImageUrl"/>
        <div class="buttons">
            <a @click="copyCode2">{{$t("referral.copy")}}</a>
            <a @click="saveImage">{{$t('public0.public276')}}</a>
            <a @click="popupVisible=false">{{$t('account.user_center_google_close')}}</a>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import myApi from '@/api/individual'
import Tip from '@/assets/js/tip'
import cordovaUtils from '@/assets/js/cordovaUtils'
import shareImage from '@/assets/img/invite/poster-zhcn.jpg'
export default {
  name: 'page-invite',
  data () {
    return {
      popupVisible: false,
      shareImage: shareImage,
      shareImageUrl: null,
      inviteData: []
    }
  },
  created () {
    this.getinvitedAwardRank()
  },
  methods: {
    copyCode () {
      Tip({type: 'success', message: this.$t('public0.public33')}) // 复制成功
      utils.copyText(this.aaa)
    },
    copyCode2 () {
      Tip({type: 'success', message: this.$t('public0.public33')}) // 复制成功
      utils.copyText(this.linkUrl)
    },
    shareImg () {
      this.popupVisible = true
    },
    getinvitedAwardRank () {
      myApi.invitedAwardRank((res) => {
        this.inviteData = res.data
        var qrCode = document.createElement('div')
        utils.qrcode(qrCode, {
          text: this.getUserInfo.myInvitationUrl,
          width: 145,
          height: 146
        })
        var img = new Image();
        img.onload = () => {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            context.drawImage(qrCode.querySelector('img'), 40, 520);
            this.shareImageUrl = canvas.toDataURL('image/jpeg', 1.0);
        }
        img.src = shareImage
      })
    },
    loginDialog () {
      this.$router.push({name: 'login'})
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    },
    saveImage () {
      cordovaUtils.saveImage(this.shareImageUrl, true)
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getApiToken', 'getLang', 'getUserInfo']),
    reward () {
      return (this.getUserInfo.totalM1) * 15 + (this.getUserInfo.totalM2) * 10 + (this.getUserInfo.totalM3) * 5
    },
    reward1 () {
      return (this.getUserInfo.totalM1) * 3 + (this.getUserInfo.totalM2) * 2 + (this.getUserInfo.totalM3) * 1
    },
    aaa () {
      if (this.getUserInfo.myInvitationUrl === null) {
        return this.$t('referral.referral_text_nt')
      } else {
        return this.$t('referral.referral_text_nt') + this.getUserInfo.myInvitationUrl
      }
    },
    linkUrl () {
      return this.getUserInfo.myInvitationUrl || ''
    }
  }
}
</script>

<style scoped>
.invite{position: relative;margin: 0 auto;height:calc(100vh - 0.8rem);overflow:auto;}
.banner{background:transparent;}
.banner-img{width: 100%;margin: 0 auto;}
.banner img{width: 100%;}
.invite_code{background: #313131;margin-top:0.25rem; }
.invite_code .title{background: #dfdfdf;height: 0.52rem;line-height: 0.52rem;color:#313131;font-size: 0.24rem;padding-left:0.22rem;font-weight:bold;border-radius:0.1rem 0.1rem 0 0;}
.content{width: 6.54rem;margin:  0 auto;}
.invite_list{display: flex;justify-content:space-between;;background:#313131;color: #c3c3c3;padding-left:0.22rem;padding-top:0.1rem;padding-bottom:0.1rem;}
.invite_list > div{display:flex;align-items:center;justify-content:center;flex-direction:column}
.my_code{border-bottom: 1px solid #262a42;justify-content: start;}
.invite_caption{width:1rem;}
.invite_caption1{width:2.3rem;}
.invite_caption2{width:2.3rem;}
.invite_caption3{width:2.3rem;}
.invite_caption4{width:2.3rem;line-height:0.33rem;}
.invite_list>div.invite_caption12{text-align: left;}
.invite_caption_left{text-align: left !important;line-height:0.6rem;margin-right:0.1rem;}
.my_code .invite_caption12{margin-right:0.08rem;}
.invite_caption12{width: 2rem!important;line-height: 0.6rem;align-items:flex-start!important;}
.invite_caption1 .m1{background:url(../../assets/img/invite/m1.png) no-repeat center;background-size:100% 100%;width:0.94rem;height:0.39rem;margin:0 auto;}
.invite_caption2 .m2{background:url(../../assets/img/invite/m2.png) no-repeat center;background-size:100% 100%;width:0.94rem;height:0.39rem;margin:0 auto;}
.invite_caption3 .m3{background:url(../../assets/img/invite/m3.png) no-repeat center;background-size:100% 100%;width:0.94rem;height:0.39rem;margin:0 auto;}
.invite_caption1>div>span{color:#fff;line-height:0.2rem;text-align: center;}
.invite_caption1>div,.invite_caption2>div,.invite_caption3>div{position: relative;line-height:0.33rem;text-align:center;}
.invite_caption2>div>span,.invite_caption3>div>span{width:0.62rem;height:0.2rem;color:#fff; line-height: 0.2rem;text-align: center;}
.invite_list_content{width:3.4rem;background: #dfdfdf;padding:0.1rem;margin-right:0.2rem;color:#000;word-break:break-all;}
.invite_span{background: #0072fd;color: #fff;border-radius: 0.05rem;cursor: pointer;padding:0.1rem;max-width:2rem;}
.witer{justify-content: start;margin-bottom:0.1rem;align-items: center;}
.invite_code_list .title{background: #dfdfdf;height:0.52rem;line-height:0.52rem;color: #261003;font-size:0.24rem;padding-left:0.22rem;font-weight:bold;border-radius:0.1rem 0.1rem 0 0;}
.invite_code_list ul.header{background:#0072fd;}
.invite_code_list ul li{padding:0.1rem 0;}
.invite_code_list ul.header li{padding:0;}
.invite_code_list ul li span.number0,
.invite_code_list ul li span.number1,
.invite_code_list ul li span.number2{width:0.3rem;height:0.3rem;line-height:0.3rem;text-align: center;color: #fff; border-radius: 50%;background: #ffbc31;}
.invite_code_list ul li span.number1{background: #8ea4c1;}
.invite_code_list ul li span.number2{background: #9e8663;}
.invite_code_list ul li span.list_top{width:0.3rem;height:0.3rem;line-height:0.3rem;text-align: center;color: #fff; border-radius: 50%;}
.invite_code_list ul li{display: flex;justify-content: space-between;align-items: center; border-bottom: 1px solid #262a42;color: #c3c3c3;font-size: 14px;line-height:0.5rem;}
.invite_code_list ul.header li{border-bottom:none;color:#fff;}
.invite_code_list ul li span>em{display: block;line-height:0.3rem;}
.invite_code_list ul{padding:0 0.3rem;}
.rule .title{background:#dfdfdf;height:0.52rem;line-height:0.52rem;color:#000;font-size:0.24rem;font-weight:bold;border-radius:0.1rem 0.1rem 0 0;padding-left:0.22rem;}
.rule{margin-top:0.3rem; color: #c3c3c3;background: #313131;margin-bottom:0.3rem;}
.rule p{line-height:0.4rem;padding:0.2rem 0.2rem 0  0.2rem;}
.remark{padding:0.3rem;}
.remark_title {font-size:0.24rem;color: #c3c3c3;line-height:0.4rem;}
.remark_title span{color: #c3c3c3;margin-right:0.2rem;}
a{cursor:pointer;color: rgba(204, 204, 204, 0.6);}
a:hover{color: rgba(204, 204, 204, 1);}
a.icon-weixin{position: relative}
a.icon-weixin:hover .wechat{display: block;}
.wechat{position: absolute;bottom: 30px;right: -87px;display: none}
.follow{color: #f0f0f0;font-size: 18px;font-weight: bold;margin-bottom: 35px;}
.center-r-title{font-size: 18px;color: #f0f0f0;font-weight: bold;margin-top: 145px;margin-bottom: 30px;}
.center-btn-en,
.center-btn-cn{display: inline-block;margin-right: 36px;width: 180px;height: 56px;line-height: 56px;border-radius: 10px;border: 2px solid #fff;font-size: 18px;text-align: center;color: #f0f0f0;font-weight: bold;}
.center-btn-en:hover,
.center-btn-cn:hover{color: #fdb902;border-color: #fdb902;}
.bk-wrap{position:relative;overflow:hidden;width:100%;}
.bk-main{position:relative;overflow:hidden;margin:0 auto;width:1172px;}
.invite_code_list{background: #313131;margin-top:0.30rem;}
.share{margin-left: 30px;cursor: pointer;color: #c3c3c3;}
.invite_caption_code{color: #c3c3c3;line-height:0.6rem;}
.invite_info_login{width: 435px;height: 230px;background:transparent;margin: 0 auto;margin-top:283px;}
.info-btn-login{color: #000;height:60px;}
.info-btn{display:flex;width:100%;align-items:center;justify-content:center;font-size:16px;}
.info-btn span{flex:1;line-height:60px;text-align: center;cursor: pointer;}
.info-btn span:first-child{margin-right:50px;margin-left:60px;}
.info-btn span:last-child{margin-right:70px;}
.invite_info_login p{font-size: 16xp;color: #FFF;line-height: 80px;}
.list-totalMx{width:1.8rem;text-align: center;}
.list-username{width:1.8rem;text-align: center;}
.list-rewrard{width:1.8rem;text-align: center;}
.list-rewrard em{font-style:normal;}
.mint-popup{width:calc(100% - 0.6rem);height:calc(100% - 0.6rem);}
.share-img{width:100%;height:100%;position: relative;}
.share-img img{width:100%;height:calc(100% - 0.5rem);margin:0 auto;}
.share-img .buttons{display:flex;width:100%;height:0.5;justify-content:center;align-items:center;}
.share-img .buttons a{margin-right:0.3rem;color:#fdb902;line-height:0.4rem;}
.share-img .buttons a:last-child{margin-right:0;}
</style>
