<template>
  <div class="myassets-left">
    <ul>
      <li :class="{'active': active === 'pandect'}" @click="switch_tab('pandect')">
        <span>{{$t('usercontent.user57')}}</span>
        <!--账户一览-->
      </li>
      <li :class="{'active': active === 'digassets'||
      active ==='withdrawInfo'||active ==='addressManage'||active ==='adresscava'}"
          @click="switch_tab('digassets')">
        <span>{{$t('usercontent.user58')}}</span>
        <!--我的资产-->
      </li>
      <li :class="{'active': active === 'history'}" @click="switch_tab('history')">
        <span>{{$t('usercontent.user59')}}</span>
        <!--充提历史-->
      </li>
      <li :class="{'active': active === 'transaction'}" @click="switch_tab('transaction')">
        <span>{{$t('usercontent.user60')}}</span>
        <!--我的订单-->
      </li>
      <li :class="{'active': active === 'ieorecords'}" @click="switch_tab('ieorecords')">
        <span>{{$t('ieo.myieo')}}</span>
        <!--我的Sparkle-->
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'left',
    props: {
      active: {
        type: String
      }
    },
    methods: {
      switch_tab (tab) {
        this.$emit('switchTab', tab)
      },
    }
  }
</script>

<style scoped lang="less">
  .myassets-left {
    float: left;
    width: 192px;
  }

  .myassets-left ul {
    background: rgba(27, 26, 31, 0.9);
    overflow: hidden;
  }

  .myassets-left ul li {
    padding-left: 17px;
    padding-right: 20px;
    margin-top: 1px;
    font-size: 0;
    line-height: 0;
    color: #fff;
    text-align: left;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: relative;

    &:after {
      position: absolute;
      content: '';
      width: 180px;
      left: 17px;
      bottom: 0;
      height: 2px;
      background: #2D2C2F;
    }
  }

  .myassets-left ul li:first-of-type {
    margin-top: 0;
  }

  .myassets-left ul li:hover {
    &:after {
      background: #00B5FF;
    }
  }

  .myassets-left ul li.active {
    color: #00B5FF;

    &:after {
      background: #00B5FF;
    }

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 10px;
      height: 3px;
      background: #00B5FF;
      left: 0;
      top: 25px;
    }
  }

  .myassets-left ul li i,
  .myassets-left ul li span {
    display: inline-block;
    vertical-align: middle;
  }

  .myassets-left ul li i {
    font-size: 20px;
  }

  .myassets-left ul li span {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }

  .myassets-left ul li i.icon-like:before {
    color: #666
  }
</style>
