<template>
  <div class="adressCava" @click="showSymbol = false">
    <div class="koall-verify-title">
      <router-link :to="'/account/digassets'">{{$t('usercontent.user58')}}<!--我的资产--></router-link>
      >
      <span>{{$t('usercontent.recharge')}}<!--数字货币充值--></span>
    </div>
    <div class="tsmb">
      <div class="tsmb-flex">
        <p>{{$t('usercontent.notice')}}</p>
        <label>
          <p>{{$t('usercontent.not1').format(symbol)}}</p>
          <!--<p>{{$t('usercontent.not2').format(symbol,'0.01')}}</p>-->
        </label>
      </div>
      <div class="tsmb-flex blue">
        <p>{{$t('usercontent.not3')}}</p>
        <label style="padding-left: 4px">
          <p>{{$t('usercontent.not3-1').format(symbol)}}</p>
        </label>
      </div>
    </div>
    <div class="title-div">
      <small>{{$t('usercontent.user86')}}</small>
      <p @click.stop="showSymbol = !showSymbol">{{symbol}}</p>
      <ul v-show="showSymbol">
        <li v-for="item in allData" @click.prevent="icheck(item)" v-show="item.rechargeFlag===1">{{item.symbol}}</li>
      </ul>
    </div>
    <p class="title-div" style="margin-top: 40px;"><small>{{$t('account.userRechargeAddress')}}<!--充值地址--></small> <small style="color: #E14B26; display: inline-block; background-color: #2E2C3C; padding: 0 8px;" v-show="symbol==='EOS' || symbol==='XRP'"><i class="icon-notification"></i> {{$t('account.userRechargeMemoTip')}}<!-- Memo和Address需要同时使用才能充值成功！ --></small></p>
    <div class="bottom-box" style="margin-top: 10px;">
      <div class="copy">
        <p class="ellipsis">{{getAddress}}</p>
        <label v-clipboard:copy="getAddress" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('usercontent.copy')}}</label>
      </div>
      <div class="qrad">
        <p>{{$t('usercontent.qrcode')}}</p>
        <div ref="qrcode" class="qrcode"></div>
      </div>
    </div>
    <template v-if="symbol==='EOS' || symbol==='XRP'">
      <p class="title-div" style="margin-top: 40px;"><small>{{symbol}} {{$t('account.recharge_memo')}}<!--充值备注--></small></p>
      <div class="bottom-box" style="margin-top: 10px;">
        <div class="copy">
          <p class="ellipsis">{{addr}}</p>
          <label v-clipboard:copy="addr" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('usercontent.copy_memo')}}</label>
        </div>
        <div class="qrad">
          <p>{{$t('usercontent.qrcode')}}</p>
          <div ref="memoQrcode" class="qrcode"></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import utils from '@/assets/js/utils'
  import Vue from 'vue'
  import userUtils from '@/api/wallet'

  export default {
    data () {
      return {
        addr: null,
        symbol: null,
        allData: [],
        showSymbol: false,
        minWithdraw: '',
        EOS_MEMO:''
      }
    },
    computed: {
      ...mapGetters(['getSysParams', 'getUserInfo']),
      XRP_MEMO(){
        return (this.getSysParams['mainAddXRP'] && this.getSysParams.mainAddXRP.value) || ''
      },
      getAddress(){
        return this.symbol==='EOS'?this.EOS_MEMO:(this.symbol==='XRP'?this.XRP_MEMO:this.addr)
      }
    },
    watch: {
      getAddress () {
        utils.qrcode(this.$refs.qrcode, {
          text: this.getAddress,
          width: 190,
          height: 190
        })
      },
      addr () {
        this.$nextTick(() => {
          utils.qrcode(this.$refs.memoQrcode, {
            text: this.addr,
            width: 190,
            height: 190
          })
        })
      },
    },
    created () {
      if(this.getUserInfo.kycState !== 1){
        Vue.$confirmDialog({
          id: 'KYC_AUTH_FIRST',
          showCancel: false,
          content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
          okCallback: () => {
            this.$router.push({name: 'mycenter_menu', params: {menu: 'authentication'}})
          }
        })
        this.$router.replace({name:'account'})
      }
      let symbol = this.$route.params.symbol
      this.symbol = symbol || 'ETH'
      this.getListAccount()
      //console.log(this.addr, this.symbol)
      this.$nextTick(() => {
        utils.qrcode(this.$refs.qrcode, {
          text: this.getAddress,
          width: 190,
          height: 190
        })

        utils.qrcode(this.$refs.memoQrcode, {
          text: this.addr,
          width: 190,
          height: 190
        })

      })
      if(this.symbol==='EOS' && !this.EOS_MEMO){
        this.getEosAddress()
      }
    },
    methods: {
      getEosAddress(){
        userUtils.getEosAddress(data=>{
          this.EOS_MEMO = data
        })
      },
      icheck (item) {
        //console.log(item)
        this.addr = item.address
        this.symbol = item.symbol
        this.getEosAddress()
      },
      onCopy () {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`usercontent.copy-success`)})
      },
      onError () {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`usercontent.copy-error`)})
      },
      getListAccount () {
        userUtils.myAssets({}, res => {
          this.allData = res.filter(next => {
            if (next.type === 1) {
              if (next.symbol === this.symbol) {
                this.addr = next.address
                this.minWithdraw = next.minWithdraw
                //console.log(next)
              }
            }
            return next.type === 1
          })
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .koall-verify-title {
    color: #979799;

    a {
      color: #ffffff;
    }
  }

  .adressCava {
    padding: 14px 18px 80px;
    background-color: #19181c;
    color: #f1f1f2;
    font-size: 14px;

    .tsmb {
      margin-top: 20px;
      background-color: #1d1c23;
      padding: 10px;
      line-height: 30px;

      .tsmb-flex {
        display: flex;

        & > p {
          min-width: 110px;
          white-space: nowrap;
          padding-right: 10px;
        }

        & > label {

        }
      }

      .blue {
        color: #00a0e9;
      }
    }

    .title-div {
      margin-top: 18px;
      position: relative;

      small {
        line-height: 30px;
        color: #979799;
      }

      p {
        height: 32px;
        line-height: 32px;
        width: 350px;
        border-bottom: 1px solid hsla(0, 0%, 100%, .12);
        position: relative;

        &:after {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border: 1px solid #999;
          border-top-color: transparent;
          border-right-color: transparent;
          position: absolute;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          top: 10px;
          right: 16px;
        }

        &:hover:after {
          border-color: #00B5FF;
          border-top-color: transparent;
          border-right-color: transparent;
        }
      }

      ul {
        position: absolute;
        left: 0;
        top: 63px;
        list-style: none;
        padding: 6px 0;
        margin: 0;
        box-sizing: border-box;
        background-color: #212028;
        border: 1px solid #242329;
        width: 350px;
        z-index: 1;

        li {
          font-size: 12px;
          padding: 0 20px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #f1f1f2;
          height: 34px;
          line-height: 34px;
          box-sizing: border-box;
          cursor: pointer;

          &:hover {
            background: #292831;
          }
        }
      }
    }
  }

  .bottom-box {
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    margin-top: 80px;

    .copy {
      width: 650px;
      height: 60px;
      line-height: 60px;
      border: 1px solid hsla(0, 0%, 100%, .12);
      display: flex;
      justify-content: space-between;
      margin-right: 20px;

      label {
        background: #2e2c3c;
        text-align: center;
        padding: 0 50px;
        cursor: pointer;
      }

      p {
        flex: 1;
        padding-left: 6px;
      }
    }

    .qrad {
      width: 220px;
      text-align: center;
      background: #4c4a64;
      line-height: 60px;
      height: 60px;
      position: relative;

      .qrcode {
        display: none;
        position: absolute;
        top: 62px;
        left: 0;
        width: 190px;
        padding: 15px;
        background: #ffffff;
        height: 190px;
        z-index: 1;
        img {
          width: 190px;
        }
      }

      &:hover {
        .qrcode {
          display: block;
        }
      }
    }
  }
</style>
