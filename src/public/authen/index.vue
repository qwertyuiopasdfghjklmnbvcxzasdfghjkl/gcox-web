<template>
  <!--KYC认证-->
  <div class="authentication">
    <div class="cont">
      <img :src="imgSrc[getUserInfo.kycState]"/>
      <div v-if="getUserInfo.kycState === 0">
        <p>{{$t('usercontent.user48')}}</p>
        <span @click="submitKYC()" v-html="$t('usercontent.user49')"></span>
      </div>
      <div v-if="getUserInfo.kycState === 1">
        <p class="f-c-green">{{$t('usercontent.user46')}}</p>
        <span>{{$t('usercontent.user47')}}</span>
      </div>
      <div v-if="getUserInfo.kycState === 2">
        <p class="f-c-green">{{$t('usercontent.user42')}}</p>
        <span>{{$t('usercontent.user43')}}</span>
      </div>
      <div v-if="getUserInfo.kycState === 3">
        <p class="f-c-danger">{{$t('usercontent.user44')}}</p>
        <span @click="submitKYC()" v-html="$t('usercontent.user43')"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '@/assets/js/utils'
  import kyc from '@/components/kyc'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        imgSrc: [require('../../assets/img/userContent/authentication01.png'),
          require('../../assets/img/userContent/authentication02.png'),
          require('../../assets/img/userContent/authentication03.png'),
          require('../../assets/img/userContent/authentication04.png')]
      }
    },
    computed: {
      ...mapGetters(['getUserInfo'])
    },
    created () {
    },
    methods: {
      submitKYC () {
        utils.setDialog(kyc)
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
    }
  }
</style>

