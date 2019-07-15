<template>
  <div class="header-container">
    <div class="header-bg"></div>
    <div class="header">
        <router-link :to="{name:'home'}" class="icon_logo" ></router-link>
        <router-link :to="{name:'market'}"><i class="market"></i> {{$t('home.home_pair')}}<!-- 市场 --></router-link>
        <router-link :to="{name:'exchange'}"><i class="exchange"></i> {{$t('exchange.exchange_name')}}<!-- 交易所 --></router-link>
        <router-link :to="{name:'acm'}"><i class="acm"></i> ACM</router-link>
        <template v-if="isLogin">
          <router-link :to="{name:'account'}">{{$t('account.user_center_help_account')}}<!-- 账户 --></router-link>
          <router-link :to="{name:'ucenter'}">{{getUserInfo.username}}</router-link>
        </template>
        <template v-else>
          <router-link :to="{name:'login'}">{{$t('login_register.login')}}<!-- 登录 --></router-link>
          <router-link :to="{name:'register'}">{{$t('login_register.register')}}<!-- 注册 --></router-link>
        </template>
        <a href="javascript:;" @click="setLanguage('en')" v-if="getLang==='zh-CN'">ENGLISH</a>
        <a href="javascript:;" @click="setLanguage('zh-CN')" v-if="getLang==='en'">简体中文</a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import langApi from '@/api/language'
import utils from '@/assets/js/utils'
export default {
  data () {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
    
  },
  watch: {
    
  },
  created () {
    
  },
  beforeDestroy () {
    
  },
  methods: {
    ...mapActions(['setLang']),
    setLanguage (lang) {
      this.setLang(lang)
      if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(lang))) {
        this.$i18n.locale = lang
        return
      }
      console.log('change langugae')
      langApi.getLanguage(lang, (res) => {
        this.$i18n.locale = lang
        this.$i18n.setLocaleMessage(lang, res)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.header-container {height: 70px; }
.header-bg {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  height: 70px;
  background-color: #151517;
}
.header {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  width: 1190px;
  line-height: 70px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  .icon_logo {
    width: 120px;
    background-image:url('../assets/img/logo.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  a {
    font-family: 'ethnocentric','Microsoft YaHei';
    color: #fff;
    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      background-size:contain;
      background-repeat:no-repeat;
      background-position:center;
      &.market {
        background-image:url('../assets/img/MARKETS.png');
      }
      &.exchange {
        background-image:url('../assets/img/EXCHANGE.png');
      }
      &.acm {
        background-image:url('../assets/img/ACM.svg');
      }
    }
    &.active, &:hover, &.router-link-exact-active {
      color: #00A0E9;
      i {
        &.market {
          background-image:url('../assets/img/MARKETS-blue.png');
        }
        &.exchange {
          background-image:url('../assets/img/EXCHANGE-blue.png');
        }
        &.acm {
        background-image:url('../assets/img/ACM-blue.svg');
      }
      }
    }
  }
}
</style>
