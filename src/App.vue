<template>
  <div id="app">
    <template v-if="$route.name !== 'login'">
      <!--屏蔽用户名/密码自动填写：创建假的用户名/密码input让chrome浏览器填充，在autocomplete=off不起作用时适用-->
      <input class="fake-input" type="text" name="fakeusernameremembered">
      <input class="fake-input" type="password" name="fakepasswordremembered"/>
    </template>
    <bheader/>
    <div v-if="isIE" class="compatible" v-show="browser">
      <div class="compatible-w">{{$t('public0.public239').format('GCOX')}}<!--建议您使用Chrome浏览器获取GCOX最佳体验。如使用360或QQ浏览器，可切换至极速模式。--><span @click="closeCompa">×</span></div>
    </div>
    <div class="minHeight rp" v-if="maintain"><maintain/></div>
    <div class="minHeight rp" v-else><router-view/></div>
    <bottom v-show="!$route.meta.noBottom" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import GlobalWebSocket from '@/assets/js/websocket'
import OtcWebSocket from '@/assets/js/websocket-otc'
import bheader from '@/components/header'
import bottom from '@/components/bottom'
import userApi from '@/api/user'
import marketApi from '@/api/market'
import jumpto from '@/public/dialog/jumpto'
import jumpto2 from '@/public/dialog/jumpto2'
import maintain from '@/components/maintain'

export default {
  name: 'app',
  components: {
    bheader,
    bottom,
    jumpto,
    jumpto2,
    maintain
  },
  data () {
    return {
      ws: null,
      gws: null,
      browser: true,
      fromRoute: null
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getOtcSocketEvents', 'getLang', 'getSiteType','getUserInfo','getSysParams']),
    isIE () {
      // (true = IE9) || true >= IE10
      return (document.all && document.addEventListener && !window.atob) || (document.body.style.msTouchAction !== undefined)
    },
    maintain(){
      return this.getSysParams.maintain && Number(this.getSysParams.maintain.value) && this.$route.query.admin!=1
    }
  },
  watch: {
    getLang (_n) {
      utils.gtValidate()
      let tar = document.getElementsByTagName('title')
      if(_n==='en'){
        tar[0].innerText = 'GCOX - Global Crypto Offering Exchange'
      } else {
        tar[0].innerText = 'GCOX-比特币以太坊专业数字货币交易网站'
      }
    },
    getApiToken (val) {
      this.getBTCValuation()
      if (val) {
        this.getUserInfoMethod()
      }
      try {
        this.gws.changeLogin()
      } catch (ex) {
        console.warn(ex)
      }
      if (val) {
        // 登录跳转
        if(window.noLoginRedirect){
          window.noLoginRedirect = false
          return
        }
        let tempName = null
        if (this.fromRoute) {
          if (this.fromRoute.meta.goHome) {
            tempName = 'home'
          } else {
            tempName = (this.fromRoute.name === 'login' || this.$route.name === 'login') ? 'home' : this.fromRoute.name
          }
        } else {
          tempName = 'home'
        }
        this.$router.push({name: tempName})
        try {
          this.ws && this.ws.open()
        } catch (ex) {
          window.console.warn(ex)
        }
      } else {
        this.$route.meta.login ? this.$router.push({name: 'home'}) : void 0
        try {
          this.ws && this.ws.close()
        } catch (ex) {
          window.console.warn(ex)
        }
      }
    },
    '$route' (to, from) {
      this.fromRoute = from
      this.checkRouteChange(to)
    }
  },
  created () {
    // this.showJumpTo()
    this.getSysparams()
    this.getBTCValuation()
    this.getUserInfoMethod()
    this.checkRouteChange(this.$route)
    /*this.ws = new OtcWebSocket({
      onMessage: (data) => {
        let events = this.getOtcSocketEvents
        for (let i = 0; i < events.length; i++) {
          let ev = events[i]
          ev(data)
        }
      }
    })*/
    this.gws = new GlobalWebSocket({
      type: 'global',
      checkNetWork: (signal) => {
        this.setNetworkSignal(signal)
      },
      onClose: () => {
        this.setNetworkSignal(3)
      },
      callback: (res) => {
        if (res.dataType === 'LastValuation') {
          this.setUSDCNY({
            USD: numUtils.BN(res.USD).toFixed(2),
            CNY: numUtils.BN(res.USDCNY).toFixed(2)
          })
          this.setBTCValuation(numUtils.BN(res.totalAmount).toFixed(8)) // 当前转换人民币
        }
      }
    })
    if (utils.isMobile) {
      var f = Math.min(window.screen.width, window.screen.height)
      document.documentElement.className = 'phone'
      document.documentElement.style.fontSize = f / 7.5 + 'px'
    }
  },
  beforeDestroy () {
    this.ws && this.ws.close()
  },
  methods: {
    ...mapActions(['setBTCValuation','setApiToken', 'setUSDCNY', 'setNetworkSignal', 'setUserInfo','setSysParams']),
    showJumpTo(){
      marketApi.getIpVerify(res=>{
        if(res && this.getSiteType===1){
          utils.setDialog(jumpto, {
            // backClose:true
          })
        } else if(!res && this.getSiteType===2){
          utils.setDialog(jumpto, {
            // backClose:true
            key:true
          })
        }
      })
    },
    showJumpTo2(){
      if(this.getUserInfo.kycState != 1){
        return
      }
      marketApi.getKycValidate(res=>{
        if(res && this.getSiteType===1){
          this.setApiToken()
          utils.setDialog(jumpto2, {
            // backClose:true
          })
        } else if(!res && this.getSiteType===2){
          this.setApiToken()
          utils.setDialog(jumpto2, {
            // backClose:true
            key:true
          })
        }
      })
    },
    getSysparams(){
      marketApi.rateSysparams(res=>{
        let params = {}
        for(let item of res){
          params[item.code] = item
        }
        this.setSysParams(params)
        if(!this.maintain){
          this.showJumpTo()
        }
      })
    },
    getBTCValuation(){
      marketApi.BTCValuation(data=>{
        this.setUSDCNY({
          USD: numUtils.BN(data.USD).toFixed(2),
          CNY: numUtils.BN(data.USDCNY).toFixed(2)
        })
        this.setBTCValuation(numUtils.BN(data.totalAmount).toFixed(8)) // 当前转换人民币
      })
    },
    checkRouteChange (currentRoute) {
      if (this.getApiToken) {
        currentRoute.meta.noEntry ? this.$router.push({name: 'home'}) : void 0
      } else {
        currentRoute.meta.login ? this.$router.push({name: 'home'}) : void 0
      }
    },
    closeCompa () {
      this.browser = false
    },
    getUserInfoMethod () {
      if (!this.getApiToken) {
        return
      }
      
      userApi.getUserInfo((userInfo) => {
        if (this.getApiToken) {
          this.setUserInfo(userInfo)
          this.showJumpTo2()
        }
      }, (res) => {
        console.warn(res)
        setTimeout(() => {
          this.getUserInfoMethod()
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>
.fake-input{position: absolute;clip: rect(0, 0, 0, 0);}
.mycenter{position: fixed;z-index: 9999;top: 50%;width: 24px;height: 50px;margin-top: -25px;background: url(./assets/images/slide.png) no-repeat center center;}
.mycenter.arrow-left{right: 0;}
.mycenter.arrow-right{left: 0;transform: rotate(180deg);}
.mycenter.arrow-left:hover{animation: arrowAnimation 500ms infinite;}
.mycenter.arrow-right:hover{animation: arrowAnimation 500ms infinite;}
@keyframes arrowAnimation{
  0% {background-position: center;}
  50% {background-position: left;}
  100% {background-position: center;}
}
.dialog{position: absolute;z-index: 999;top: 60px;left: 0;right: 0;min-width: 1200px;min-height: calc(100% - 60px);background-color: #404b69;transition: opacity .5s ease, transform .5s ease;}
.dialog.fadeAndSlide-enter-active{opacity: 0;transform: translate(100%, 0);}
.dialog.fadeAndSlide-enter-to{opacity: 1;transform: translate(0, 0);}
.dialog.fadeAndSlide-leave-active{opacity: 1;transform: translate(0, 0);}
.dialog.fadeAndSlide-leave-to{opacity: 0;transform: translate(100%, 0);}
.dialog-container{width: 1200px;margin-left: auto;margin-right: auto;}
.compatible{height: 46px;line-height: 46px; background-color:#3d99d2;color: #fff; }
.compatible-w{width: 1200px;margin: 0 auto;text-align: center;font-size: 16px;position: relative;}
.compatible-w span{font-size: 24px;position: absolute;right: 2px;cursor: pointer;}

.minHeight {
  min-height: -webkit-calc(100vh - 365px);
  min-height: calc(100vh - 365px)
}
</style>

