<template>
  <div class="content">
    <div class="myassets clearfix">
      <left :active="active" @switchTab="switch_tab"></left>
      <div class="myassets-right">
        <component :is="active" :linkItem="linkItem" :adsSymbol="adsSymbol" :adsType="adsType"
                   @switchTab="switch_tab"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import mycenter from '@/public/mycenter/mycenter'
  import authentication from '@/public/authen'
  import left from '@/public/mycenter/left'
  import settings from '@/public/mycenter/settings'
  import safety from '@/public/mycenter/safety'
  import message from '@/public/mycenter/message'
  import agency from '@/public/mycenter/agency'
  import agencyApply from '@/public/mycenter/agencyApply'
  import resetpassword from '@/public/mycenter/resetpassword'
  import assetpassword from '@/public/mycenter/assetpassword'
  import Vue from 'vue'
  import {mapGetters} from 'vuex'

  export default {
    props: ['adsSymbol', 'adsType', 'linkItem'],
    data () {
      return {
        active: this.$route.params.menu || 'mycenter'
      }
    },
    components: {
      mycenter,
      authentication,
      left,
      settings,
      safety,
      message,
      agency,
      agencyApply,
      resetpassword,
      assetpassword
    },
    watch: {
      '$route' (to, from) {
        let menu = this.$route.params.menu || 'mycenter'
        this.active = menu
      }
    },
    methods: {
      ...mapGetters(['getUserInfo', 'getLang']),
      switch_tab (tab) {
        if (tab === 'assetpassword') {
          console.log(this.getUserInfo())
          if (this.getUserInfo().googleAuthEnable === 0) {

            Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35'), delay: 3000})
          } else if (this.getUserInfo().kycState !== 1) {

            Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36'), delay: 3000})
          } else {
            this.$router.push({
              name: 'mycenter_menu',
              params: {
                menu: tab
              }
            })
          }
        } else {
          this.$router.push({
            name: 'mycenter_menu',
            params: {
              menu: tab
            }
          })
        }
      },
    }
  }
</script>

<style scoped>
  .content {
    background: url("../../assets/img/bg_common.png") no-repeat center #1f1e24;
    min-height: calc(100vh - 365px);
  }

  .myassets {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 49px;
    padding-bottom: 60px;
  }

  .myassets::before {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #F2F3F8;
    z-index: -1;
  }

  .myassets-right {
    float: right;
    width: 1000px;
  }
</style>

