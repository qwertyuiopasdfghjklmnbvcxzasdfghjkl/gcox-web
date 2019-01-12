<template>
  <div class="page" style="color: white">
    <cp-top-back :back="true">
    </cp-top-back>

    <section class="box wallet-contant" style="margin-top: .25rem">
      <div class="inner">
        <div class="item">
          <div class="inner">
            <div class="header">
              <p><span>{{symbol}} {{$t('account.estimated_value_deposit')}}<!--充值--></span></p>
            </div>
            <div ref="qrcode" class="qrcode" id="picture"></div>
            <p class="first-child"><a @click="savePic">{{$t('account.user_save_QRcode')}}<!--保存二维码到相册--></a></p>
            <p class="two">{{symbolInfo.address}}</p>
            <p class="three" v-tap="{methods:copy}">{{$t('referral.copy')}}<!--复制--></p>
            <section>
              <div class="inner">
                <h1>{{$t('public0.public243')}}：<!--温馨提示--></h1>
                <ul>
                  <li>● {{$t('account.user_prompt1').format(symbol)}}<!--禁止向{0}地址充值除{0}之外的资产，任何充入{0}地址的非{0}资产将不可找回。--></li>
                  <li>● {{$t('account.user_prompt2').format(symbol, symbolInfo.blockConfirm)}}<!--使用{0}地址充值需要{1}个区块确认才能到账。--></li>
                  <li>● {{$t('account.user_prompt10').format(symbol, symbolInfo.blockConfirm)}}<!--充值完成后，你可以进入历史记录页面跟踪进度。--></li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast } from 'mint-ui'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import userUtils from '@/api/wallet'
import cordovaUtils from '@/assets/js/cordovaUtils'
export default {
  name: 'page-topup',
  data () {
    return {
      symbol: '',
      address: ''
    }
  },
  computed: {
    ...mapGetters(['getUserWallets']),
    symbolInfo () {
      let datas = this.getUserWallets
      for (let i = 0; i < datas.length; i++) {
        let d = datas[i]
        if (this.$route.params.symbol === d.symbol) {
          return d
        }
      }
      return {}
    }
  },
  watch: {
    symbolInfo () {
      this.createQRCode()
    }
  },
  created () {
    this.symbol = this.$route.params.symbol
    this.createQRCode()
  },
  methods: {
    createQRCode () {
      if (!this.symbolInfo.address) {
        return
      }
      this.$nextTick(() => {
        utils.qrcode(this.$refs.qrcode, {
          text: this.symbolInfo.address,
          width: 373,
          height: 373
        })
      })
    },
    savePic () { // 保存图片
      cordovaUtils.saveImage(this.$refs.qrcode.querySelector('img').src)
    },
    copy () {
      utils.copyText(this.symbolInfo.address)
      Toast(this.$t('public0.public33')) // 复制成功
    }
  }
}
</script>

<style lang="less" scoped>
  @font_color_transparent:#cbd4ec;
  @fs_24:.24rem;
  @f_c_2:#8089a3;

  .padding-top-bottom-10{
    padding: .1rem 0;
  }
  .selected-title {
    font-size: 0.36rem;
    &:after{
      content: '';
      display: inline-block;
      border-top: 0.15rem  solid #cbd4ec;
      border-left: 0.13rem solid transparent;
      border-right: 0.13rem solid transparent;
      margin-left: 0.12rem;
      padding-bottom: 0.05rem;
    }
  }

  .wallet-list {
    width: 50%;
    margin:auto;
    color:#8089a3;
    li {
      line-height: 0.9rem;
      background-color: #181b2a;
      font-size: 0.32rem;
      text-align: center;
      border-bottom: 1px solid #262a42;
      &:hover {
        background-color: #E5E5E5;
      }
      &:last-of-type {
        border-bottom: none;
      }
    }
  }
  /* 内容*/

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    color: @f_c_2;
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: @f_c_2;
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: @f_c_2;
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: @f_c_2;
  }

  .ko-input-default{
    background:transparent url("../../assets/img/w_search.png") no-repeat .1rem .07rem;
    background-size: .28rem .3rem;
    padding: .1rem 0 .1rem .6rem;
    border: 0;
    color: @f_c_2;
    font-size: @fs_24;
  }
  .header{
    font-size: .32rem;
    color: @font_color_transparent;
  }
  /* 顶部*/
  .box{
    font-size: .3rem;

    &>.inner{
      padding:0 .3rem;
    }
  }

  /*内容*/
  .wallet-contant{
    .item{
      text-align: center;
      >.inner{
        padding: .2rem .25rem;
        p.first-child{
          margin-top: .5rem;
          font-size: .26rem;
          a{
            color: #0072fd;
            text-decoration: underline;
          }
        }
        p.two{
          margin-top: .45rem;
          font-size: .18rem;
        }
        p.three{
          margin-top: .45rem;
          font-size: .26rem;
          color: #0072fd;
          text-decoration: underline;
        }
      }
      section{
        margin-top: .4rem;
        border-radius: .01rem;
        background: #292929;
        >.inner{
          padding:.1rem;
        }
        h1{
          text-align: left;
          font-size: .24rem;
        }
        ul li{
          font-size: .24rem;
          text-align: left;
          line-height: .4rem;
        }
      }
    }

    .header{
      display: flex;
      justify-content: space-between;
      p{
        span{
          position:relative;
          top: -.1rem;
          left: .1rem;
        }
      }
      i{
        display: inline-block;
      }
      i.i_left_eth{
        width: .4rem;
        height: .4rem;
        background:  url('../../assets/img/i_eth.png') no-repeat center;
        background-size:100% 100% ;
      }
      i.i_left{
        width: .4rem;
        height: .4rem;
        background:  url('../../assets/img/i_btc.png') no-repeat center;
        background-size:100% 100% ;
      }
      i.i_right{
        width: .14rem;
        height: .26rem;
        background:  url('../../assets/img/nav_right.png') no-repeat center;
        background-size:100% 100% ;
      }
    }
    .qrcode{
      // width: 280px!important;
      // height: 280px!important;
      display: inline-block;
      margin-top: .3rem;
      width: 3.65rem;
      height: 3.65rem;
      margin: 0 auto;
      padding: 0.1rem;
      background: #fff;
      // position: absolute;
      // left: 50%;top: 50%;
      // margin-left: -140px;
      // margin-top: -140px;
    }
    .content{
      display: inline-block;
      margin-top: .3rem;
      width: 3.65rem;
      height: 3.65rem;
      // background:  url('../../assets/img/i_code.png') no-repeat center;
      background-size:100% 100%
    }
    .bottom{
      padding: .15rem 0rem;
      font-size: .22rem;
      display: flex;
      justify-content: space-between;
      color: #cbd4ec;
      span{
        width: 1.75rem;
        text-align: left;
      }
    }
  }
</style>
