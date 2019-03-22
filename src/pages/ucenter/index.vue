<template>
  <div class="page page-bg">
    <cp-top-back :back="false" :showLogo="true">
    </cp-top-back>

    <div class="box">
      <div class="inner">
        <ul class="one">
          <li v-tap="{methods: $root.routeTo, to: 'page-myInfo'}">
            <img :src="avatarUrl" alt=""/>
          </li>
          <li>
            <p>
              <span class="nickname" v-if="isAlreadyModifyNickname" v-tap="{methods:$root.routeTo, to:'page-myInfo'}">{{updateNickname}}</span><!--昵称-->
              <span class="modify" v-if="!isAlreadyModifyNickname" v-tap="{methods:$root.routeTo, to:'page-myInfo'}">{{$t('public0.public40')}}</span><!--修改昵称-->
              <span class="state entrance" v-if="showVerifyState(0)" v-tap="{methods:$root.routeTo, to:'page-realname'}">{{$t('account.user_Real_name_verification')}}</span><!--实名认证-->
              <span class="state wait" v-if="showVerifyState(1)">{{$t('public0.public37')}}</span><!--待审核-->
              <span class="state wait" v-if="showVerifyState(4)">{{$t('public0.public151')}}</span><!--审核中-->
              <span class="state success" v-if="showVerifyState(2)">{{$t('public0.public38')}}</span><!--已认证-->
              <span class="state fail" v-if="showVerifyState(3)">{{$t('public0.public39')}}</span><!--未通过-->
            </p>
            <p>{{getUserInfo.username}}<!--用户名||邮箱--></p>
          </li>
        </ul>
        <p class="sale">
          <span>
            {{$t('account.user_center_pay_fees').format('CDCC', '50%')}}<!--使用CDCC支付交易手续费（50% 折扣）-->
          </span>
          <a class="icon-checkbox" href="javascript:;" :class="isUseCDCCPay ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked'" @click="switchCoinState"></a>
        </p>
      </div>
    </div>

    <div class="two">
      <div class="inner">
        <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'page-msg'}"><i class="i_one1"></i><span>{{$t('account.user_center_message')}}<!--消息--><i v-if="hasNewMessage" class="circular" ></i></span></p><!--v-if="hasNewMessage"-->
        </section>
        <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'page-setUp'}"><i class="i_one2"></i><span>{{$t('account.user_center_setting')}}<!--设置--></span></p>
        </section>
        <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'page-saft'}"><i class="i_one3"></i><span>{{$t('account.user_center_safety')}}<!--安全中心--></span></p>
        </section>
        <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'trans-record'}"><i class="icon-new-message"></i><span>{{$t('trade_record.trans_record')}}<!--交易记录--></span></p>
        </section>
        <section class="item-section" v-if="!showShops">
          <p v-tap="{methods:$root.routeTo, to:'page-apply'}"><i class="icon-shield"></i><span>{{$t('business.MERCHANT_APPLICATION')}}<!--商家申请--></span></p>
        </section>
        <section class="item-section" v-if="showShops">
          <p v-tap="{methods:$root.routeTo, to:'page-manager'}"><i class="icon-shop"></i><span>{{$t('business.MERCHANT_MANAGE')}}<!--商家管理--></span></p>
        </section>
        <!--推荐中心-->
        <!-- <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'page-invite'}"><i class="i_one6"></i><span>{{$t('public0.public275')}}</span></p>
        </section> -->
        <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'page-help'}"><i class="i_one4"></i><span>{{$t('account.user_center_help')}}<!--帮助--></span></p>
        </section>
        <section class="item-section">
          <p v-tap="{methods:$root.routeTo, to:'page-about'}"><i class="i_one5"></i><span>{{$t('account.user_center_about')}}<!--关于--></span></p>
        </section>
        <section class="item-section"  v-if="isApp">
          <p v-tap="{methods:checkUpdate}"><i class="i_one7"></i><span>{{$t('public.foot_version').format(version)}}<!--版本--></span></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Indicator, MessageBox } from 'mint-ui'
import Tip from '@/assets/js/tip'
import userInfoApi from '@/api/individual'
import avatar from '@/assets/img/touxiang.png'
import config from '@/assets/js/config'
import shopsApi from '@/api/shops'

export default {
  name: 'page-ucenter',
  data () {
    return {
      isUseCDCCPay: false,
      isApp: config.app,
      version:config.version,
      avatarUrl: avatar,
      isShowRegDialog: false,
      uicon: require("../../assets/img/i_o.png"),
      userState: { // 用户状态信息
        coinState: 0,
        googleState: 0,
        nickname: null,
        verifyState: 0,
        verifyTimes: 0
      },
      messageList: [],
      showShops:false
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
    isAlreadyModifyNickname () { // 是否修改昵称
      return this.userState.nickname !== null
    },
    updateNickname () {
      return this.userState.nickname
    },
    hasNewMessage () {
      for (let i = 0; i < this.messageList.length; i++) {
        let item = this.messageList[i]
        if (item.messageState === 0) {
          return true
        }
      }
      return false
    },
  },
  created () {
    this.getShopsApply()
    this.fnUserState()
    this.fnDownloadHeader()
    this.getMessageList()
  },
  methods: {
    switchCoinState () {
      // 切换使用CDCC支付交易手续费（50% 折扣）
      userInfoApi.switchCDCCChargeState((msg) => {
        this.isUseCDCCPay = !this.isUseCDCCPay
      }, (msg) => {
        console.error(msg)
      })
    },
    getShopsApply(){
      shopsApi.getShopsApply(res=>{
        this.showShops = (res.data && res.data.state===3) || false
      })
    },
    checkUpdate(){
      // 检测更新
      if (window.chcp) {
        let chcp = window.chcp;
        // 检测更新
        chcp.fetchUpdate((error, data) => {
          // 表示没有更新版本，或者其他错误，详情的信息参考上面的chcp error链接
          if (error) {
            console.log('--fetchUpdate error--', error.code, error.description);
            MessageBox.alert(this.$t('lastestVersion'), this.$t('public0.public242'),{
              confirmButtonText:this.$t('ok'),
            })
            return;
          }
          // 这次更新的版本信息
          console.log('--fetchUpdate--', data, data.config);
          // 检测是否是否可以进行安装了，双重判断吧，有时候会出现有更新版本但是暂时无法安装的情况（也可以去掉这一层）
          chcp.isUpdateAvailableForInstallation((error, data) => {
            if (error) {
              console.log('No update was loaded => nothing to install');
            } else {
              // 询问用户是否更新 检测到新版本，是否更新?
              MessageBox.confirm(window.$i18n.t('public0.public279')).then(action => {
                // 更新中
                chcp.installUpdate((error) => {
                  if (error) {
                    // 更新失败
                    window.localStorage.setItem('appUpdated', 'false')
                    console.log('Failed to install the update with error code: ' + error.code);
                    console.log(error.description);
                  } else {
                    // 更新成功
                    window.localStorage.setItem('appUpdated', 'true')
                    console.log('Update installed!');
                  }
                });
              }, () =>{})
              // 对比版本号
              console.log('Current content version: ' + data.currentVersion);
              console.log('Ready to be installed:' + data.readyToInstallVersion);
            }
          });
        });
      }
    },
    fnDownloadHeader () {
      // 下载当前用户头像
      userInfoApi.downloadHeader((url) => {
        this.avatarUrl = url
      })
    },
    fnUserState () {
      console.log(this.isLogin)
      if (!this.isLogin) { // 未登录
        this.$router.push({name: 'login'})
        return
      }
      Indicator.open()
      // 获取当前用户状态信息
      userInfoApi.getUserState((data) => {
        this.userState = {
          coinState: data.coinState,
          googleState: data.googleState,
          nickname: data.nickname,
          verifyState: data.verifyState,
          verifyTimes: data.verifyTimes
        }
        this.isUseCDCCPay = (data.coinState === 1)
        setTimeout(() => {
          Indicator.close()
        }, 500)
      }, (msg) => {
        console.error(msg)
        Indicator.close()
      })
    },
    showVerifyState (targetVerifyState) { // 实名验证状态
      if (this.userState.verifyTimes <= 3) {
        if (this.userState.verifyTimes === 3) {
          if (this.userState.verifyState === 0) {
            return targetVerifyState === 3
          } else {
            return targetVerifyState === this.userState.verifyState
          }
        } else {
          return targetVerifyState === this.userState.verifyState
        }
      } else {
        return targetVerifyState === 3
      }
    },
    getMessageList () {
      if (!this.isLogin) {
        this.messageList = []
        this.unReadLength = 0
        return
      }
      // 参数为空时获取所有未读消息
      userInfoApi.getMessages({}, (res) => {
        this.messageList = res.data
        this.unReadLength = res.data.length
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-bg{
  background-color: #161f2f
}
  .usericon {
    img{
      width: 100%;
      height: 100%;
    }
    i{
      color: white;
      position: relative;
      top: -0.2rem;
    }
    position: relative;
    top: .2rem;
    text-align: center;
    width: .64rem;
    height: .64rem;
    display: inline-block;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid #ffde00;
  }

  .two{
    &>.inner{
      padding: .2rem .3rem;
    }
  }
  .item-section:nth-of-type(n+1) {
   p {
     border-bottom: 1px solid #0d0d0d;
     span {
       margin-left: .3rem;
       i.circular {
         border-radius: .2rem;
         width: .15rem;
         height: .15rem;
         display: inline-block;
         background: red;
         margin-left: .1rem;
       }
     }
   }
  }
  .item-section p > i {font-size: 0.35rem; color: #0474EA;}

 .item-section:nth-of-type(5){
    p {
      border-bottom: 0;
    }
  }
  .item-section:nth-of-type(6) {
    margin-top: .2rem;
  }
  .item-section {
    background: #0c151d;
    padding:0 .2rem;
     font-size: .3rem;
    p {
      > i {
        display: inline-block;
        width: .32rem;
        height: .32rem;
        position: relative;
        top: .04rem;
      }
      color: #cbd4ec;
      line-height: .8rem;
    }

    .i_one{
      background:url("../../assets/img/i_tg.png") no-repeat center;
      background-size: 100% 100%;
    }
    .i_one1{
      background:url("../../assets/img/i_xx.png") no-repeat left;
      background-size: 100% 100%;
    }
    .i_one2{
      background:url("../../assets/img/i_set.png") no-repeat left;
      background-size: 100% 100%;
    }
    .i_one3{
      background:url("../../assets/img/i_saft.png") no-repeat left;
      background-size: 100% 100%;
    }
    .i_one4{
      background:url("../../assets/img/i_help.png") no-repeat left;
      background-size: 100% 100%;

    }
    .i_one5{
      background:url("../../assets/img/i_about.png") no-repeat left;
      background-size: 100% 100%;
    }
    .i_one6{
      background:url("../../assets/img/i_tjzx.png") no-repeat left;
      background-size: 100% 100%;
    }
    .i_one7{
      background:url("../../assets/img/i_version.png") no-repeat left;
      background-size: 100% 100%;
    }
    .i_one8{
      background:url("../../assets/img/i_saft.png") no-repeat left;
      background-size: 100% 100%;
    }
  }
  .one {
    display: flex;
    align-items: center;
    padding: .3rem .6rem;
    background-color: #0c151d;
    li:first-of-type {
      position: relative;
      width: .8rem;
      height: .8rem;
      line-height: 0;
      border: 0;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    li:last-of-type {
      width: 100%;
      height: 1rem;
      padding-left: 1.2rem;
      margin-left: -0.8rem;
      p {
        height: 50%;
        &:first-of-type {
          font-size: 0;
          line-height: 0;
          span {
            display: inline-block;
            height: .5rem;
            font-size: .3rem;
            line-height: .5rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &.nickname, &.modify {
              max-width: calc(~"50% - .4rem");
              margin-right: .4rem;
            }
            &.nickname {
              color: #cbd4ec;
            }
            &.modify {
              color: #cfd3e9;
            }
            &.state {
              max-width: 50%;
              padding-left: .2rem;
              padding-right: .2rem;
              color: #fff;
              border-radius: 4px;
            }
            &.entrance {
              background-color: #ffde00;
            }
            &.wait {
              background-color: #ffde00;
            }
            &.success {
              background-color: #03c087;
            }
            &.fail {
              background-color: #e76d42;
            }
          }
        }
        &:last-of-type {
          height: .5rem;
          line-height: .5rem;
          font-size: .3rem;
          color: #cbd4ec;
        }
      }
    }
    .usericon {
      padding-top: 0.1rem;
      text-align: center;
      width: .64rem;
      height: .64rem;
      display: inline-block;
      background-size: 100% 100%;
    }
  }
  .header {
    font-size: .32rem;
    color: #cbd4ec;
  }
  .sale {
    background-color:#0c151d;
    padding-left: 0.5rem;
    padding-right:0.5rem;
    padding-bottom: 0.3rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.28rem;
  }
</style>
