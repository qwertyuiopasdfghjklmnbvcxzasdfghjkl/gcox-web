<template>
  <!--KYC认证-->
  <div class="authentication">
    <!--0:新的,1:已审核,2:正在提交,-1:待审核,-2:错误,-3:拒绝,-4:不完整,-5:失败-->
    <div class="cont">
      <img :src="imgSrc[getUserInfo.kycState]"/>

      <div v-if="getUserInfo.kycState === 0">
        <p>{{$t('usercontent.user85')}}</p>
        <span @click="submitKYC()" style="cursor: pointer" v-html="$t('usercontent.user48')"></span>
      </div>

      <div v-if="getUserInfo.kycState === 1">
        <p class="f-c-green">{{$t('usercontent.user42')}}</p>
        <span>{{$t('usercontent.user43')}}</span>
      </div>

      <div v-if="getUserInfo.kycState === 2">
        <p class="f-c-green">{{$t('usercontent.user46')}}</p>
        <span>{{$t('usercontent.user47')}}</span>
      </div>
      <div v-if="getUserInfo.kycState === -1">
        <p class="f-c-green">{{$t('usercontent.user46')}}</p>
        <span>{{$t('usercontent.user47')}}</span>
      </div>

      <div v-if="getUserInfo.kycState === -2 || getUserInfo.kycState === -3
      || getUserInfo.kycState === -4 || getUserInfo.kycState === -5">
        <p class="f-c-danger">{{$t('usercontent.user44')}}</p>
        <span @click="submitKYC()" style="cursor: pointer" v-html="$t('usercontent.user45')"></span>
      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import utils from '@/assets/js/utils'
  import kyc from '@/components/kyc'
  import {mapGetters} from 'vuex'
  import api from '@/api'

  let domain = ''
  export default {
    data () {
      return {
        // 0未通过，1已通过，-1审核中，-2错误，-3拒绝
        // 0:新的,1:已审核,2:正在提交,-1:待审核,-2:错误,-3:拒绝,-4:不完整,-5:失败
        imgSrc: {
          '0': require('../../assets/img/userContent/authentication01.png'),
          '1': require('../../assets/img/userContent/authentication03.png'),
          '-1': require('../../assets/img/userContent/authentication02.png'),
          '2': require('../../assets/img/userContent/authentication02.png'),
          '-2': require('../../assets/img/userContent/authentication04.png'),
          '-4': require('../../assets/img/userContent/authentication04.png'),
          '-3': require('../../assets/img/userContent/authentication04.png'),
          '-5': require('../../assets/img/userContent/authentication04.png'),
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo'])
    },
    watch: {
      ...mapGetters(['getUserInfo']),
      getUserInfo () {
        //console.log(this.getUserInfo)
      }
    },
    created () {
    },
    methods: {
      submitKYC () {
        api.get(`${domain}api/v1/gcox/user/initiate-kyc`, (res) => {
          if (res.rst === 1) {
            // kyc 国际化为 Locale = zh
            const url = res.data.redirect_url.replace(/locale=zh-CN/i, 'locale=zh')

            utils.setDialog(kyc, { redirect_url: url })
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
          }
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .authentication {
    color: #979799;
    background: rgba(27, 26, 31, 0.8);
    padding: 20px;

    .cont {
      text-align: center;
      padding: 50px;

      p {
        line-height: 32px;
      }
    }
  }
</style>

