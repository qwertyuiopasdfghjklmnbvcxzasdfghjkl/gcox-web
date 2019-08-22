<template>
  <div class="header-container">
    <div class="header-bg"></div>
    <div class="header w1200 ui-flex ui-flex-justify">
      <div class="ui-flex-1">
        <router-link :to="{name:'home'}" class="icon_logo item"></router-link>
        <router-link :to="{name:'market'}" class="item"><i class="market"></i> {{$t('home.home_pair')}}<!-- 市场 -->
        </router-link>
        <router-link :to="{name:'exchange_index2'}" class="item" :class="{active:$route.name === 'exchange_index2' || $route.name === 'exchange_index' || $route.name === 'quickTrade'}">
           <i class="exchange"></i> {{$t('exchange.exchange_name')}}<!-- 交易所 -->
           <div class="popover-nav black" ref="nav2" @click="hidePopoverNav('nav2')">
              <div class="popover-menu">
                <router-link :to="{name:'quickTrade'}" class="sub-item" tag="div" v-if="false">
                  <span>{{$t('exchange.oneClickTrade')}}<!-- 一键购买 --></span>
                </router-link>
                <router-link :to="{name:'exchange_index2'}" class="sub-item" tag="div">
                  <span>{{$t('exchange.advanced')}}<!-- 专业版 --></span>
                </router-link>
              </div>
            </div>
        </router-link>
        <!-- <router-link :to="{name:'acm'}" class="item"><i class="acm"></i> ACM</router-link> -->
        <a href="javascript:;" v-if="!isLogin" class="item" @click="showQuickLogin"><i class="account"></i> {{$t('usercontent.user56')}}<!-- 资产管理 --></a>
        <router-link v-if="isLogin" :to="{name:'account'}" class="item"><i class="account"></i> {{$t('usercontent.user56')}}<!-- 资产管理 --></router-link>
        <router-link v-if="isLogin" v-show="false" :to="{name:'fiat'}" class="item"><i class="icon-curry"></i> FIAT<!-- FIAT --></router-link>
        <router-link v-if="isLogin" :to="{name:'mycenter_menu', params:{menu:'referral'}}" class="item"><i class="icon-users"></i> {{$t('referral.referral_programme')}}<!-- 我的推荐 --></router-link>
      </div>
      <div class="right">
          <router-link to="" class="item" v-if="isLogin">
            <span style="color: #fff;">{{displayUsername}}</span>
            <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav1" @click="hidePopoverNav('nav1')">
              <div class="popover-menu">
                <router-link :to="{name:'mycenter_menu', params:{menu:'mycenter'}}" class="sub-item" tag="div">
                  <i class="security"></i>
                  <span>{{$t('usercontent.user37')}}<!-- 个人信息中心 --></span>
                </router-link>
                <router-link :to="{name:'mycenter_menu', params:{menu:'authentication'}}" class="sub-item" tag="div">
                  <i class="verification"></i>
                  <span>{{$t('usercontent.user38')}}<!-- KYC认证 --></span>
                </router-link>
                <router-link :to="{name:'mycenter_menu', params:{menu:'message'}}" class="sub-item" tag="div">
                  <i class="message"></i>
                  <span>{{$t('usercontent.user41')}}<!-- 系统消息 --></span>
                </router-link>
                <div class="sub-item" @click="logout">
                  <i class="logout"></i>
                  <span>{{$t('public.navigation_logout')}}<!-- 退出 --></span>
                </div>
              </div>
            </div>
          </router-link>
          <a v-show="!isLogin" class="item pointer" @click="showQuickLogin">{{$t('login_register.login')}}
            <!-- 登录 --></a>
          <router-link v-show="!isLogin" :to="{name:'register'}" class="item f-c-blue">{{$t('login_register.register')}}
            <!-- 注册 --></router-link>
          <a class="item" href="javascript:;" @click="setLanguage('en')" v-if="getLang==='zh-CN'">ENGLISH</a>
          <a class="item" href="javascript:;" @click="setLanguage('zh-CN')" v-if="getLang==='en'">简体中文</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import langApi from '@/api/language'
  import utils from '@/assets/js/utils'
  import quickLogin from '@/components/quickLogin'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
      displayUsername () {
        if (this.getUserInfo.username) {
          let temp = this.getUserInfo.username.split('@')
          return temp[0].slice(0, Math.ceil(temp[0].length / 2)) + '*'.repeat(Math.floor(temp[0].length / 2)) + '@' + temp[1]
        } else {
          return ''
        }
      }
    },
    watch: {},
    created () {

    },
    beforeDestroy () {

    },
    methods: {
      ...mapActions(['setLang', 'setApiToken']),
      showQuickLogin () {
        utils.setDialog(quickLogin, {
          backClose:true
        })
      },
      setLanguage (lang) {
        this.setLang(lang)
        if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(lang))) {
          this.$i18n.locale = lang
          return
        }
        //console.log('change langugae')
        langApi.getLanguage(lang, (res) => {
          this.$i18n.locale = lang
          this.$i18n.setLocaleMessage(lang, res)
        })
      },
      logout () {
        this.setApiToken(null)
      },
      hidePopoverNav (target) {
        if(this.$refs[target]){
          this.$refs[target].style.display = 'none'
          setTimeout(() => {
            this.$refs[target].removeAttribute('style')
          }, 1000)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .header-container {
    height: 70px;
  }

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
    line-height: 70px;
    font-size: 12px;

    .item {
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      position: relative;
      &+.item {margin-left: 60px;}

      .popover-nav {
        position: absolute;
        top: 69px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 4px;
        background: #fff;
        min-width: 150px;
        border: 1px solid #ebeef5;
        z-index: 2000;
        color: #606266;
        text-align: justify;
        font-size: 14px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        word-break: break-all;
        display: none;
        &.en {min-width: 200px;}
        &.black {
          background: #3F3B3B;
          border-radius: 0;
          border: none;
          color: #fff;
          .popover-menu .sub-item:hover {
            background-color: #333030;
            color: #00a0e9;
          }
        }

        .popover-menu {
          line-height: 40px;

          .sub-item {
            padding: 0 10px;
            border-bottom: 1px solid rgba(21, 23, 32, .08);
            cursor: pointer;
            display: flex;
            position: relative;

            &:hover {
              background-color: #E5E5E5;
            }

            i {
              height: 40px;
              width: 30px;
              background: no-repeat 0;
              background-size: 20px 20px;
            }
            span{
              white-space: nowrap;
            }
            .security {
              background-image: url('../assets/img/icon-security.svg');
            }

            .verification {
              background-image: url('../assets/img/icon-verification.svg');
            }

            .message {
              background-image: url('../assets/img/icon-message.svg');
            }

            .logout {
              background-image: url('../assets/img/icon-logout.svg');
            }
          }
        }
      }
    }

    .item:hover .popover-nav {
      display: block;
    }

    .item + .item {
      margin-left: 25px;
    }

    .icon_logo {
      width: 120px;
      background-image: url('../assets/img/logo.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }

    a {
      font-family: 'ethnocentric';
      color: #fff;

      div {
        font-family: PingFangSC-Regular, Microsoft YaHei, sans-serif;
      }

      i {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        font-size: 20px;

        &.market {
          background-image: url('../assets/img/MARKETS.svg');
        }

        &.exchange {
          background-image: url('../assets/img/EXCHANGE.svg');
        }

        &.acm {
          background-image: url('../assets/img/ACM.svg');
        }

        &.account {
          background-image: url('../assets/img/ACCOUNT.svg');
        }
      }

      &.active, &:hover, &.router-link-exact-active {
        color: #00A0E9;

        i {
          &.market {
            background-image: url('../assets/img/MARKETS-blue.svg');
          }

          &.exchange {
            background-image: url('../assets/img/EXCHANGE-blue.svg');
          }

          &.acm {
            background-image: url('../assets/img/ACM-blue.svg');
          }

          &.account {
            background-image: url('../assets/img/ACCOUNT-blue.svg');
          }
        }
      }
    }
  }
</style>
