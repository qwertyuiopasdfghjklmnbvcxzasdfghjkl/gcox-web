<template>
  <div class="cont">
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
    created () {
      window.onJumioResult = data => {
        if (data.payload.value === 'success' || data.payload.value === 'error') {
          let postData = {
            idScanStatus: data.payload.value.toUpperCase(),
            merchantIdScanReference: data.customerInternalReference,
            jumioIdScanReference: data.transactionReference,
            errorCode: data.payload.metainfo.code
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
    }
  }
</script>

<style scoped>
  .cont {
    background: #ffffff;
  }
</style>
