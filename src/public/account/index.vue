<template>
  <div class="content">
    <div class="myassets clearfix">
      <left :active="active" @switchTab="switch_tab"></left>
      <div class="myassets-right">
        <component :is="active" @switchTab="switch_tab"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import left from './left'
  import pandect from './pandect'
  import digassets from './digassets'
  import history from './historyrecord'
  import transaction from './transaction'
  import adresscava from './adresscava'
  import addressManage from './addressManage'
  import withdrawInfo from './withdrawInfo'

  export default {
    name: 'index',
    data () {
      return {
        active: this.$route.params.menu || 'pandect'
      }
    },
    components: {
      left,
      pandect,
      digassets,
      history,
      transaction,
      adresscava,
      addressManage,
      withdrawInfo
    },
    watch: {
      '$route' (to, from) {
        this.active = this.$route.params.menu || 'pandect'
      }
    },
    methods: {
      switch_tab (tab) {
        this.$router.push({
          name: 'account_menu',
          params: {
            menu: tab
          }
        })
      }
    }
  }
</script>

<style scoped>
  .content {
    background: url("../../assets/img/bg_common.png") no-repeat center #1f1e24;
    min-height: calc(100vh - 365px);
    background-attachment: fixed;
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
