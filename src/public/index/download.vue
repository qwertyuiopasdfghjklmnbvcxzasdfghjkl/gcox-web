<template>
  <div class="download-box">
    <div class="w1200 download">
      <div class="download-header efont">{{$t('public0.public212')}}<!-- 下载APP --></div>
      <div class="download-slogen text-center fs18">{{$t('about.desc_download')}}<!-- 随时随地，享受安全便捷的数字金融服务 --></div>
      <div class="ui-flex download-main">
        <div class="ui-flex-1 ui-flex">
          <a :href="ios" target="_blank"><span class="app-store"></span></a>
          <a :href="googlePlay" target="_blank"><span class="google-play ml60"></span></a>
          <a :href="android" target="_blank"><span class="android-app ml60"></span></a>
          <a href="javascript:;" class="rp qrcode"><span class="icon-qrcode ml20"></span>
            <div ref="qrcode" class="qr-container"></div>
          </a>
        </div>
        <div class="download-phone">
          <img phone="" src="../../assets/img/moxingphone.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import config from '@/assets/js/config'
export default {
  computed: {
    ...mapGetters(['getSysParams']),
    googlePlay(){
      return 'https://play.google.com/store/apps/details?id=com.gsx.app'
    },
    android(){
      return this.getSysParams.androidUrl && `${config.origin}${this.getSysParams.androidPath.value}`
    },
    ios(){
      return 'https://apps.apple.com/ng/app/gcox/id1458094561'
      // return this.getSysParams.appleUrl && this.getSysParams.appleUrl.value
    },
  },
  watch:{
    android(_new){
      utils.qrcode(this.$refs.qrcode, {
        text: _new,
        width: 100,
        height: 100
      })
    }
  }
}
</script>
<style lang="less" scoped>
.download-box {
    background: url('../../assets/img/kline_bg.png') no-repeat #e3e3e5 0 100%;
    background-size: 100% 40%;
    .download {
      padding-top: 20px;
      color: #151720;
      position: relative;
      height: 400px;
      box-sizing: border-box;
    }
    .download-header {
      margin-bottom: 10px;
      font-size: 20px;
      line-height: 40px;
      text-align: center;
    }
    .download-slogen {
      color: #20212c;
      line-height: 26px;
    }
    .download-main{
      margin-top: 66px;
      position: relative;
      .app-store, .google-play, .android-app {
        width: 160px;
        height: 54px;
        cursor: pointer;
        display: block;
      }
      .icon-qrcode {
        width: 54px;
        height: 54px;
        cursor: pointer;
        display: block;
        background-color: #fff;
        border-radius: 4px;
        line-height: 54px;
        text-align: center;
        color: #222;
        font-size: 40px;
      }
      .app-store {
          background: url('../../assets/img/icon_ios_download.png') no-repeat;
          background-size: 100% 100%;
      }
      .google-play {
          background: url('../../assets/img/icon_google_download.png') no-repeat;
          background-size: 100% 100%;
      }
      .android-app {
          background: url('../../assets/img/icon_android_download.png') no-repeat;
          background-size: 100% 100%;
      }
      .download-phone {
        position: absolute;
        bottom: -189px;
        right: 0;
        img {height: 350px;}
      }
    }
}
.qr-container {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color:#fff;
  padding:10px;
  left: 20px;
  margin-top: 8px;
  display: none;
}
.qrcode:hover .qr-container {display: block;}
</style>
