<template>
  <div class="myassets-left">
    <ul>
      <li :class="{'active': active === 'mycenter'}" @click="switch_tab('mycenter')">
        <!--<i class="icon-people"></i>-->
        <span>{{$t('usercontent.user37')}}</span>
        <!--个人信息中心-->
      </li>
      <li :class="{'active': active === 'authentication'}" @click="switch_tab('authentication')">
        <!--<i class="icon-suo"></i>-->
        <span>{{$t('usercontent.user38')}}</span>
        <!--KYC认证-->
      </li>
      <li :class="{'active': active === 'resetpassword'}" @click="switch_tab('resetpassword')">
        <!--<i class="icon-wallet"></i>-->
        <span>{{$t('usercontent.user39')}}</span>
        <!--登录密码管理-->
      </li>
      <li :class="{'active': active === 'assetpassword'}" @click="switch_tab('assetpassword')">
        <!--<i class="icon-curry"></i>-->
        <span>{{$t('usercontent.user40')}}</span>
        <!--资金密码管理-->
      </li>
      <!--<li :class="{'active': active === 'transaction'}" @click="switch_tab('transaction')">-->
        <!--&lt;!&ndash;<i class="icon-reports"></i>&ndash;&gt;-->
        <!--<span>{{$t('usercontent.user41')}}</span>-->
        <!--&lt;!&ndash;我的交易记录&ndash;&gt;-->
      <!--</li>-->
      <li :class="{'active': active === 'message'}" @click="switch_tab('message')">
        <!--<i class="icon-message"></i>-->
        <span>{{$t('usercontent.user41')}}</span>
        <!--系统消息-->
      </li>
      <li :class="{'active': active === 'referral'}" @click="switch_tab('referral')">
        <!--<i class="icon-message"></i>-->
        <span>{{$t('referral.referral_programme')}}</span>
        <!--我的推荐-->
      </li>
      <!--<li :class="{'active': active === 'agencyApply'}" @click="switch_tab('agencyApply')" v-if="!showShops">-->
        <!--&lt;!&ndash;<i class="icon-shield"></i>&ndash;&gt;-->
        <!--<span>{{$t('business.MERCHANT_APPLICATION')}}</span>-->
        <!--&lt;!&ndash;商家申请&ndash;&gt;-->
      <!--</li>-->
      <!--<li :class="{'active': active === 'agency'}" @click="switch_tab('agency')" v-if="showShops">-->
        <!--&lt;!&ndash;<i class="icon-shop"></i>&ndash;&gt;-->
        <!--<span>{{$t('business.MERCHANT_MANAGE')}}</span>-->
        <!--&lt;!&ndash;商家管理&ndash;&gt;-->
      <!--</li>-->
      <!--我的推荐中心-->
      <!-- <li @click="switch_like">
          <i class="icon-like"></i>
          <span>{{$t('message.my_referral_center')}}</span>
      </li> -->
    </ul>
  </div>
</template>

<script>
  import shopsApi from '@/api/shops'

  export default {
    props: {
      active: {
        type: String
      }
    },
    data () {
      return {
        showShops: false
      }
    },
    created () {
      this.getShopsApply()
    },
    methods: {
      switch_like () {
        this.$router.push({name: 'invite'})
      },
      switch_tab (tab) {
        this.$emit('switchTab', tab)
      },
      getShopsApply () {
        shopsApi.getShopsApply(res => {
          this.showShops = (res.data && res.data.state === 3) || false
        })
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
    background:rgba(27,26,31,0.9);
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
    &:after{
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

  .myassets-left ul li:hover{
    &:after{
      background: #00B5FF;
    }
  }
  .myassets-left ul li.active {
    color: #00B5FF;
    &:after{
      background: #00B5FF;
    }
    &:before{
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

  .myassets-left ul li:hover, .myassets-left ul li:hover i:before {
    /*color: #fff;*/
  }
</style>
