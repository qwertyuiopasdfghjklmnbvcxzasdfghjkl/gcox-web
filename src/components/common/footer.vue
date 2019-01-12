<template>
  <mt-tabbar v-model="selected" :fixed="true">
    <mt-tab-item id="icontrading" v-tap="{methods:$root.routeTo, to:'page-iconindex'}">
      <img slot="icon" src="../../assets/img/bibi-trade-icon@3x.png">
      <img slot="icon" src="../../assets/img/bibi-trade-pitch-icon@3x.png">
      {{$t('public.navigation_exchange')}}<!--币币交易-->
    </mt-tab-item>
    <mt-tab-item id="otc" v-tap="{methods:$root.routeTo, to:'page-otc'}">
      <img slot="icon" src="../../assets/img/fabi-trade-icon@3x.png">
      <img slot="icon" src="../../assets/img/fabi-trade-pitch-icon@3x.png">
      {{$t('public.navigation_OTC')}}<!--OTC-->
    </mt-tab-item>
    <mt-tab-item id="wallet" v-tap="{methods:$root.routeTo, to:'page-wallet'}">
      <img slot="icon" src="../../assets/img/wallet-icon@3x.png">
      <img slot="icon" src="../../assets/img/wallet-pitch-icon@3x.png">
      {{$t('public.navigation_wallet')}}<!--钱包-->
    </mt-tab-item>
    <mt-tab-item id="ucenter" v-tap="{methods:$root.routeTo, to:'page-ucenter'}">
      <img slot="icon" src="../../assets/img/me-icon@3x.png">
      <img slot="icon" src="../../assets/img/me-pitch-icon@3x.png">
      {{$t('public.navigation_account')}}<!--个人中心-->
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
import Vue from 'vue'
import { Tabbar, TabItem } from 'mint-ui'
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
export default {
  name: 'cp-footer',
  data () {
    return {
      selected:'icontrading'
    }
  },
  mounted () {
    this.setTab()
  },
  watch: {
    $route () {
      this.setTab()
    }
  },
  methods: {
    setTab () {
      if (this.$route.path.indexOf('icontrading') > -1) {
        this.selected = 'icontrading'
      }
      if (this.$route.path.indexOf('otc') > -1) {
        this.selected = 'otc'
      }
      if (this.$route.path.indexOf('wallet') > -1) {
        this.selected = 'wallet'
      }
      if (this.$route.path.indexOf('ucenter') > -1) {
        this.selected = 'ucenter'
      }
    }
  }
}
</script>

<style lang="less">
.wrap .mint-tabbar {
  background-color: #181b2a;
  background-image: none;
  > .mint-tab-item {
    color: #414B67;
    padding: 0.14rem 0;
    background-color: #181b2a;
    .mint-tab-item-icon {
      width: 0.5rem;
      height: 0.5rem;
      img {
        object-fit: contain;
      }
    }
    img:last-of-type {
      display: none;
    }
    &.is-selected {
      background-color: #181b2a;
      color: #409CF2;
      img:first-of-type {
        display: none;
      }
      img:last-of-type {
        display: block;
      }
    }
    .mint-tab-item-label {
      font-size: 0.24rem;
    }
  }
}
</style>
