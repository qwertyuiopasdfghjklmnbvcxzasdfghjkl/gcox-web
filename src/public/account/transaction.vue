<template>
  <div class="transaction">
    <ul class="tabcontrol">
      <li :class="{'active': active === 'now'}" @click="switch_tab('now')">
        {{$t('trade_record.current_entrust')}}<!--当前委讬 --></li>
      <li :class="{'active': active === 'history'}" @click="switch_tab('history')">
        {{$t('trade_record.history_entrust')}}<!--历史委讬 --></li>
      <li :class="{'active': active === 'curreny'}" @click="switch_tab('curreny')" v-if="this.show">
        {{$t('trade_record.exchange_record')}}<!--币币成交记录--></li>
      <!--<li :class="{'active': active === 'otccurreny'}" @click="switch_tab('otccurreny')">{{$t('trade_record.otc_record')}}&lt;!&ndash;OTC交易记录&ndash;&gt;</li>-->
      <!--<li :class="{'active': active === 'transfer'}" @click="switch_tab('transfer')">{{$t('trade_record.transfer_record')}}&lt;!&ndash;资金划转记录&ndash;&gt;</li>-->
    </ul>
    <delegate v-show="active==='now' || active==='history'" :show="active"/>
    <curreny v-show="active==='curreny'"/>
    <!--<otccurreny v-show="active==='otccurreny'"/>-->
    <!--<transfer v-show="active==='transfer'"/>-->
  </div>
</template>
<script>
  import delegate from '@/public/mycenter/records/delegate'
  import curreny from '@/public/mycenter/records/curreny'
  import otccurreny from '@/public/mycenter/records/otccurreny'
  import transfer from '@/public/mycenter/records/transfer'

  export default {
    props: {
      show: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        active: 'now'
      }
    },
    components: {
      delegate,
      curreny,
      otccurreny,
      transfer
    },
    methods: {
      switch_tab (tab) {
        this.active = tab
      }
    }
  }
</script>
<style scoped>
  .transaction {
    padding: 14px 18px 60px;
    background-color: rgba(27, 26, 31, 0.9);
    padding-bottom: 30px;
    color: #d8d8da;
    margin-bottom: 50px;
  }

  .transaction .tabcontrol {
    border-bottom:1px solid hsla(240, 4%, 95%, 0.1);
    height: 65px;
  }

  .transaction .tabcontrol li {
    display: inline-block;
    height: 64px;
    margin-right: 40px;
    line-height: 65px;
    font-size: 12px;
    color: #ffffff;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }

  .transaction .tabcontrol li.active {
    color: #00B5FF;
    border-bottom-color: #00B5FF;
  }

  .transaction .tabcontrol li:hover {
    color: #00B5FF;
  }
</style>

