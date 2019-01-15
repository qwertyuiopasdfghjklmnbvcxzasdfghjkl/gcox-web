<template>
  <div id="app">
    <transition enter-active-class="animated short myFadeIn" leave-active-class="animated short fadeOut">
      <router-view></router-view>
    </transition>
    <mt-popup v-model="popupVisible" position="right">
      <menus></menus>
    </mt-popup>
    <googledialog :is-show="isShowGoogleDialog" @on-close="closeDialog('isShowGoogleDialog')">
      <googleauthform @gogleauth="gogleauthFun" @smsauth="smsauthFun" @onclosefun="onclosefun" @on-close-all="closeDialog('isShowGoogleDialog')"></googleauthform>
    </googledialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import config from '@/assets/js/config'
import GlobalWebSocket from '@/assets/js/websocket'
import OtcWebSocket from '@/assets/js/websocket-otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import walletApi from '@/api/wallet'
import userApi from '@/api/user'
import menus from '@/components/common/menus'
import googleauthform from '@/components/login_google_auth_from'
import googledialog from '@/components/common/dialog'
import { MessageBox } from 'mint-ui'
export default {
  name: 'app',
  components: {
    menus,
    googledialog,
    googleauthform
  },
  data () {
    return {
      popupVisible: false,
      gws: null,
      showGuide: config.app,
      fromRoute: null,
      isShowGoogleDialog: false
    }
  },
  created () {
    let isfirst = localStorage.getItem('firstBitark')
    if(!isfirst && this.showGuide){
      // this.$router.replace({name: 'guide'})
    } else {
      if(this.$route.name == 'index'){
        this.$router.replace({name:'page-iconindex'})
      }
    }
    this.ws = new OtcWebSocket({
      onMessage: (data) => {
        let events = this.getOtcSocketEvents
        for (let i = 0; i < events.length; i++) {
          let ev = events[i]
          ev(data)
        }
      }
    })
    //建立全局推送，初始化数据
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
    this.getMarketList()
    this.checkLogin(this.$route)
    this.loadLoginInfo()
    this.getUserInfoMethod()
    this.setMessageBoxDefaults()
  },
  computed: {
    ...mapGetters(['getApiToken', 'getOtcSocketEvents', 'getMenuVisible', 'getLang'])
  },
  watch: {
    getLang () {
      utils.gtValidate()
      this.setMessageBoxDefaults()
    },
    getMenuVisible () {
      this.popupVisible = this.getMenuVisible
    },
    popupVisible () {
      this.setMenuVisible(this.popupVisible)
    },
    getApiToken (newVal) {
      this.loadLoginInfo()
      this.getMarketList()
      this.getUserInfoMethod((userInfo) => {
        if (userInfo.googleAuthEnable === 0 && userInfo.mobileAuthEnable === 0) {
          this.isShowGoogleDialog = true
        }
      })
      try {
        this.gws.changeLogin()
      } catch (ex) {
        console.warn(ex)
      }
      // 登录/退出后页面跳转
      if (newVal) {
        let tempName = null
        if (this.fromRoute) {
          if (this.fromRoute.meta.goHome) {
            tempName = 'page-iconindex'
          } else {
            tempName = this.fromRoute.name === 'login' ? 'page-iconindex' : this.fromRoute.name
          }
        } else {
          tempName = 'page-iconindex'
        }
        this.$router.push({name: tempName})
        try {
          this.ws && this.ws.open()
        } catch (ex) {
          window.console.warn(ex)
        }
      } else {
        this.$route.meta.login ? this.$router.push({name: 'page-home'}) : void 0
        try {
          this.ws && this.ws.close()
        } catch (ex) {
          window.console.warn(ex)
        }
      }
    },
    $route (to, from) {
      if (!this.$router.getMatchedComponents(to).length) {
        this.$router.push({name: 'index'})
        return
      }
      this.popupVisible = false
      this.fromRoute = from
      this.checkLogin(to, from)
    }
  },
  methods: {
    ...mapActions(['setBTCValuation', 'setUSDCNY', 'setNetworkSignal','setBtcValues','setMarketList', 'setMarketConfig', 'setUserWallets', 'setUserInfo', 'setMenuVisible']),
    getMarketList () {
      //获取市场列表并初始化BTC币种与其它币种最新交易价格
      marketApi.marketList((res) => {
        if (!this.getApiToken) {
          res.forEach((item) => {
            item.collection = false
          })
        }
        this.setMarketList(res)
        this.setBtcValues(res)
        let config = {}
        res.forEach((item) => {
          config[item.market] = {
            minAmount: item.minAmount,
            minQuantity: item.minQuantity
          }
        })
        this.setMarketConfig(utils.isPlainEmpty(config) ? null : config)
      })
    },
    checkLogin (currentRoute) {
      if (this.getApiToken) {
        currentRoute.meta.noEntry ? this.$router.push({name: 'page-iconindex'}) : void 0
      } else {
        currentRoute.meta.login ? this.$router.push({name: 'login'}) : void 0
      }
    },
    loadLoginInfo () {
      if (this.getApiToken) {
        walletApi.myAssets({}, (res) => {
          res = res.filter(item=>{
            return item.type===1
          })
          this.setUserWallets(res)
        })
      } else {
        this.setUserWallets([])
      }
    },
    getUserInfoMethod (callback) {
      if (this.getApiToken) {
        userApi.getUserInfo((userInfo) => {
          this.setUserInfo(userInfo)
          callback && callback(userInfo)
        }, (res) => {
          console.warn(res)
          setTimeout(() => {
            this.getUserInfoMethod()
          }, 1000)
        })
      }
    },
    gogleauthFun () {
      this.isShowGoogleDialog = false
      this.$router.push({name: 'page-bindgoogle'})
    },
    smsauthFun () {
      this.isShowGoogleDialog = false
      this.$router.push({name: 'page-bindphone'})
    },
    onclosefun () {
      this.isShowGoogleDialog = false
    },
    closeDialog (attr) {
      this[attr] = false
    },
    setMessageBoxDefaults () {
      MessageBox.setDefaults({
        title: this.$t('public0.public242'),
        confirmButtonText: this.$t('exchange.exchange_determine'),
        cancelButtonText: this.$t('account.user_cancel')
      })
    }
  }
}
</script>

<style lang="less">
@import './assets/css/common/common.less';
body .mint-msgbox-message {
  text-align: left;
  line-height: 0.48rem;
}
</style>
