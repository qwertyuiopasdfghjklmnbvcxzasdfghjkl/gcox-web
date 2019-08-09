<template>
  <div class="referral">
    <div class="ref-info ui-flex">
      <div class="ref-qr">
        <div ref="inviteQR" class="inviteQR"></div>
        <p class="mt10">Invite friend to scan QR code to register</p>
      </div>
      <div class="ui-flex-1 ml20">
        <div class="item">
          <span>Invitation Code:</span> {{getUserInfo.myInvitationCode}}
          <button type="button" class="mint-btn default copy" @click="copyText(getUserInfo.myInvitationCode)">复制</button>
        </div>
        <div class="item">
          <span>Invitation Link:</span> {{getUserInfo.myInvitationUrl}}
          <button type="button" class="mint-btn default copy" @click="copyText(getUserInfo.myInvitationUrl)">复制</button>
        </div>
        <div class="item">
          <span>Share to:</span>
          <div class="media"><i class="icon-whatsapp"></i> <i class="icon-tencentqq"></i> <i class="icon-twitter"></i> <i class="icon-facebook1"></i> <i class="icon-telegram"></i></div>
        </div>
      </div>
    </div>

    <div class="ref-profit mt50 ui-flex">
      <div class="ui-flex-1">
        <p class="fs16">Refunded (ACM)</p>
        <p class="f-c-main fs24 mt10"><strong>0.00000000</strong></p>
      </div>
      <div class="ml15 ui-flex-1">
        <p class="fs16">Number of Invitees</p>
        <p class="f-c-main fs24 mt10"><strong>1 Invitees</strong></p>
      </div>
    </div>

    <div class="ref-history mt50">
      <ul class="tabs ui-flex">
        <li class="ui-flex-1" :class="{active:active}" @click="active=true">Invitation History</li>
        <li class="ui-flex-1" :class="{active:!active}" @click="active=false">Program Rules</li>
      </ul>
      <div class="mt40 detail" v-show="active">
        <ul class="selector ui-flex">
          <li>
            <p>Date</p>
            <div><button type="button" class="mint-btn default">Today</button></div>
          </li>
          <li>
            <p>Start Date</p>
            <div><button type="button" class="mint-btn default">Last one month</button></div>
          </li>
          <li>
            <p>End Date</p>
            <div><button type="button" class="mint-btn default">Last one year</button></div>
          </li>
          <li>
            <p>Invitation Status</p>
            <div class="rp">
              <button type="button" class="mint-btn default status" @click="showStatus=!showStatus">{{getStatus(params.status)}} <i :class="[showStatus?'icon-arrow-up2':'icon-arrow-down3']"></i></button>
              <div class="status-list" v-show="showStatus">
                <div v-for="item in statusList" @click="status=item,showStatus=false">{{getStatus(item)}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="ref-history-list mt60">
          <ul>
            <li class="header ui-flex">
              <span class="ui-flex-1">Account</span>
              <span class="ui-flex-1">Registeration Time</span>
              <span class="ui-flex-1">Invitation Status</span>
              <span class="ui-flex-1">Refunded (ACM)</span>
            </li>
            <li class="ui-flex" v-for="item in historyList">
              <span class="ui-flex-1">fla****@163.com</span>
              <span class="ui-flex-1">2019-08-07 12:23:23</span>
              <span class="ui-flex-1">完成</span>
              <span class="ui-flex-1">50</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt40 detail" v-show="!active">Program Rules</div>
    </div>
    <page v-if="!showLoading && historyList.length > 0" :pageIndex="params.page" :pageSize="params.size"
          :total="params.total" @changePageIndex="pageChange"/>
    <div class="nodata" v-if="!showLoading && historyList.length === 0">
      <div class="nodata-icon icon-no-order"></div>
      <div class="nodata-text">{{$t('public0.public50')}}<!--暂无提现记录--></div>
    </div>
    <loading v-if="showLoading"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import userUtils from '@/api/individual'
  import utils from '@/assets/js/utils'
  import loading from '@/components/loading'
  import userApi from '@/api/user'
  import page from '@/components/page'

  export default {
    components: {
      page,
      loading,
    },
    data () {
      return {
        showLoading: false,
        showStatus: false,
        active:true,
        statusList:['',1,2],
        historyList:new Array(10),
        params:{
          status:'',
          page:1,
          size:10,
          total:0
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang']),
    },
    watch: {
      
    },
    created () {
      
    },
    mounted(){
      this.initQRCode()
    },
    methods: {
      ...mapActions(['setUserInfo']),
      pageChange (currentIndex) {
        this.params.page = currentIndex
      },
      getStatus(status){
        let rst = ''
        switch(status){
          case '': rst = this.$t('trade_record.trade_record_all'); break;
          case 1: rst = this.$t('account.user_complete'); break;
          case 2: rst = this.$t('account.user_uncompleted'); break;
        }
        return rst
      },
      copyText(str){
        utils.copyText(str)
        Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')})
      },
      initQRCode(){
        //初始化二维码
        utils.qrcode(this.$refs.inviteQR, {
          text: this.getUserInfo.myInvitationUrl,
          colorDark:'#00a0e9',
          width: 116,
          height: 116,
        })
      },
      
    }
  }
</script>

<style scoped lang="less">
.referral {
  color: #ffffff;
  background: rgba(27, 26, 31, 0.9);
  padding: 20px;
  min-height: 200px;
}
.ref-info {
  .ref-qr {width: 136px;}
  .inviteQR {
    width: 116px; height: 116px; background-color: #fff; padding: 10px; 
    /deep/ img, canvas {width: 100%;}
  }
  .item {
    line-height: 40px; border-bottom: 1px solid #302826;
    position: relative;
    span {display: inline-block; min-width: 130px; vertical-align: middle;}
    .copy {position: absolute; right: 0; width: 100px; height: 26px; background-color: #616060; border:none; color: #fff; cursor: pointer; margin-top: 7px; font-size: 14px;}
    .media {
      font-size: 20px;
      display: inline-block;
      vertical-align: middle;
      i {cursor: pointer;}
      i + i {margin-left: 20px;}
    }
    
  }
}
.ref-profit {
  > div { background-color: #3F3A3A; padding:18px 0;  text-align: center;}
}
.ref-history {
  .tabs {
    border-bottom: 1px solid #413E3D;
    li {color: #444140; text-align: center; font-size: 16px; cursor: pointer; font-weight: 600; line-height:40px; position: relative;}
    li.active {color: #00a0e9;}
    li:after {
      content: '';
      position: absolute;
      width: 110px;
      height: 5px;
      left: 50%;
      margin-left: -55px;
      bottom: -3px;
      background-color: #444140;
    }
    li.active:after {
      background-color: #00a0e9;
    }
  }
  .detail {
    min-height: 200px;
  }
  .selector {
    li {
      min-width: 80px; text-align: center; &+li {margin-left: 35px;}
      p {padding-bottom: 10px;}
      button {
        background-color: #615F5F; color: #fff; font-size: 14px; position: relative;
        i {position: absolute; right: 10px; top: 11px;}
      }
      .status {width: 140px;}
    }
  }
}
.status-list {
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 1px;
  border-radius: 4px;
  background-color:#615f5f;
  line-height: 35px;
  z-index: 1;
  > div {border-bottom: 1px solid #545454; cursor:pointer; &:last-of-type{border-bottom: none;} &:hover {background-color: #545454;}}
}
.ref-history-list ul li {line-height: 35px; padding-left: 15px; padding-right: 15px;}
.ref-history-list ul li:not(.header){
  border-bottom: 1px solid #423E3D;
  &:hover {background-color: #3F3B3A;}
}
</style>

