<template>
  <div class="cont">
    <div class="main">
      <div class="ui-flex">
        <router-link :to="'/account/digassets'" class="all">{{$t('usercontent.user67')}} &gt;&gt;</router-link>
        <div>
          <digassets :pandect="pandect"></digassets>
        </div>
      </div>
      <div class="ui-flex mt25">
        <router-link :to="'/account/history'" class="all">{{$t('usercontent.user67')}} &gt;&gt;</router-link>
        <div>
          <historyrecord></historyrecord>
        </div>
      </div>
      <div class="ui-flex mt25">
        <router-link :to="'/account/transaction'" class="all">{{$t('usercontent.user67')}} &gt;&gt;</router-link>
        <div>
          <transaction :show="pandect.showTraList"></transaction>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import digassets from './digassets'
  import historyrecord from './historyrecord'
  import transaction from './transaction'

  export default {
    name: 'pandect',
    data () {
      return {
        pandect: {
          hiddenZore: false,
          showTraList: false
        }
      }
    },
    components: {
      digassets,
      historyrecord,
      transaction
    }
  }
</script>

<style scoped lang="less">
  .cont {
    color: #ffffff;
    /*background: rgba(27, 26, 31, 0.9);*/

    .ui-flex {
      flex-flow: column;
      position: relative;

      .all {
        position: absolute;
        top: 12px;
        right: 16px;
        background: #2E2C3C;
        padding: 8px 20px;
        cursor: pointer;
        color: #ffffff;
      }
    }
  }
</style>
