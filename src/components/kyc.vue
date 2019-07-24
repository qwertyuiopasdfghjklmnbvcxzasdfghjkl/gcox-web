<template>
  <div class="cont">
    <iframe :src="redirect_url"
            width="930" height="750" allow="camera"></iframe>
  </div>
</template>

<script>
  import api from '@/api'
  import Vue from 'vue'

  let domain = ''
  export default {
    name: 'kyc',
    data () {
      return {redirect_url: ''}
    },
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

      api.get(`${domain}api/v1/gcox/user/initiate-kyc`, (res) => {
        if (res.rst === 1) {
          this.redirect_url = res.data.redirect_url
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
        }
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
</script>

<style scoped>
  .cont {
    background: #ffffff;
  }
</style>
