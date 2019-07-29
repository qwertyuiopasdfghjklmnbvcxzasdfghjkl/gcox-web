<template>
  <div class="cont">
    <div class="close">
      <span @click="closeDialog" class="icon-close"></span>
    </div>
    <iframe :src="redirect_url"
            width="930" height="750" allow="camera"></iframe>
  </div>
</template>

<script>
  import api from '@/api'
  import Vue from 'vue'
  import userApi from '@/api/user'
  import {mapActions} from 'vuex'

  let domain = ''
  export default {
    name: 'kyc',
    props: ['redirect_url'],
    created() {
      window.onJumioResult = data => {
        if (data.payload.value === 'success' || data.payload.value === 'error') {
          let postData = {
            idScanStatus: data.payload.value.toUpperCase(),
            merchantIdScanReference: data.customerInternalReference,
            jumioIdScanReference: data.transactionReference,
            errorCode: data.payload.value === 'error' ? data.payload.metainfo.code : ""
          }
          api.post(`${domain}api/v1/gcox/user/update-kyc-submit-status`, postData, res => {
            userApi.getUserInfo((userInfo) => {
              this.setUserInfo(userInfo)
            })
            this.$emit('removeDialog')
            if (res.rst) {
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`submitted`)})
            } else {
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
            }
          }, res => {
            this.$emit('removeDialog')
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
          })
        }
      }
    },
    methods: {
      ...mapActions(['setUserInfo']),
      closeDialog () {
        this.$emit('removeDialog')
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    background: #ffffff;

    .close {
      position: relative;
      background: #ffffff;
      height: 40px;
      width: 100%;

      .icon-close {
        position: absolute;
        right: 10px;
        z-index: 99;
      }

    }
  }
</style>
