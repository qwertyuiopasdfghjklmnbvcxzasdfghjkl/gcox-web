<template>
  <div class="cont" @click="showDropdown=false">
    <p class="title">
      <router-link :to="'/account/digassets'">{{$t('usercontent.user58')}}<!--我的资产--></router-link>
      >
      <span>{{$t('usercontent.user69')}}<!--地址管理--></span>
    </p>
    <div class="content">
      <div class="select">
        <p>{{$t('usercontent.user86')}}<!--币种--></p>
        <div class="select-li">
          <p @click.stop="showDropdown=!showDropdown">
            <span>{{symbol}}</span>
            <i class="icon-arrow-down2"></i>
          </p>
          <ul v-show="showDropdown" class="ul">
            <li v-for="item in symbolList" @click.prevent="selAdd(item)">{{item}}</li>
          </ul>
        </div>
        <label class="add">
          + <span @click="addAddress()">{{$t('usercontent.user87')}}<!--添加提币地址--></span>
        </label>
      </div>
      <dl class="tab">
        <dt>
          <span>{{$t('usercontent.user88')}}<!--提币地址--></span>
          <span>{{$t('usercontent.user89')}}<!--标签--></span>
          <span>{{$t('usercontent.user90')}}<!--备注--></span>
          <span>{{$t('usercontent.user91')}}<!--操作--></span>
        </dt>
        <dd v-if="addressList" v-for="item in addressList">
          <span>{{item.address}}</span>
          <span>{{item.memo}}</span>
          <span></span>
          <span><button class="btn" @click="del(item.withdrawId)">{{$t('public0.public3')}}</button></span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import walletApi from '../../api/wallet'
  import utils from '@/assets/js/utils'
  import add from './addSymbol'

  export default {
    name: 'addressManage',
    props: {
      symbol: {
        type: String,
        default: 'ETH'
      }
    },
    data () {
      return {
        showDropdown: false,
        symbolList: [],
        addressList: []
      }
    },
    watch: {
      symbol (e) {
        this.getAddressList()
      }
    },
    created () {
      this.getAllSymbol()
      this.getAddressList()
      if (this.getUserInfo().googleAuthEnable !== 1) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35')})
        this.$router.push('/account/digassets')
      }
      if (this.getUserInfo().kycState !== 1) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36')})
        this.$router.push('/account/digassets')
      }
    },
    methods: {
      ...mapGetters(['getUserInfo']),
      getAllSymbol () {
        walletApi.myAssets({}, res => {
          console.log(res)
          res.filter(item => {
            this.symbolList.push(item.symbol)
          })
        })
        // walletApi.getAllSymbol({}, data=>{
        //
        // })
      },
      selAdd (sym) {
        this.showDropdown = false
        this.symbol = sym
      },
      getAddressList () {
        walletApi.addressList({symbol: this.symbol}, res => {
          this.addressList = res
        })
      },
      addAddress () {
        utils.setDialog(add, {
          symbol: this.symbol,
          okCallback: () => {
            this.getAddressList()
          }
        })
      },
      del (id) {
        walletApi.deleteAddress(id, res => {
          this.getAddressList()
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${res.msg}`)})
        }, msg => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    background: rgba(27, 26, 31, 0.9);
    color: #ffffff;
    padding: 0 18px 16px;
    font-size: 12px;

    .title {
      padding-top: 20px;
      font-size: 14px;

      a {
        color: #ffffff;
      }

      span {
        color: #979799;
      }
    }

    .content {
      padding: 40px 0;
      min-height: 200px;

      .select {
        .add {
          float: right;
          cursor: pointer;
          padding: 10px;

          span {
            color: #00B5FF;
          }
        }

        .select-li {
          display: inline-block;
          width: 340px;
          height: 45px;
          position: relative;

          p {
            border-bottom: 1px solid #2D2C2F;
            height: 36px;
            line-height: 36px;
            padding-top: 10px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 10px;

            i {
              cursor: pointer;
            }
          }

          ul {
            position: absolute;
            top: 46px;
            left: 0;
            z-index: 9;
            background: #151517;
            width: 340px;
            max-height: 200px;
            overflow-y: auto;

            li {
              padding: 10px;
              font-size: 14px;
              transition: background 0.3s;
              border-bottom: 1px solid #1d1c1e;

              &:hover {
                background: #2D2C2F
              }
            }
          }
        }
      }

      .tab {
        display: block;
        margin-top: 40px;

        dt, dd {
          display: flex;
          justify-content: space-between;
          padding: 6px 2px;
          span {
            color: #979799;
            &:nth-child(1){
              width: 300px;
            }
            &:nth-child(2){
              width: 36px;
            }
            &:nth-child(3){
              width: 60px;
            }
            &:nth-child(4){
              width: 100px;
            }
          }
        }
      }
    }
    .btn{
      cursor: pointer;
      font-size: 12px;
      color: #f1f1f2;
      background-color: #2e2c3c;
      border: 1px solid #312e45;
      padding: 2px 10px;
    }
  }
</style>
