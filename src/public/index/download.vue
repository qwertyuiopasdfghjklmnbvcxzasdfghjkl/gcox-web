<template>
  <div class="download-box">
    <div class="w1200 download">
      <div class="download-header efont">{{$t('public0.public212')}}<!-- 下载APP --></div>
      <div class="download-slogen text-center fs18">{{$t('about.desc_download')}}<!-- 随时随地，享受安全便捷的数字金融服务 --></div>
      <div class="ui-flex download-main">
        <div class="ui-flex-1 ui-flex">
          <a :href="ios" target="_blank"><span class="app-store"></span></a>
          <a :href="android" target="_blank"><span class="google-play ml60"></span></a>
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
export default {
  computed: {
    ...mapGetters(['getSysParams']),
    android(){
      return this.getSysParams.androidUrl && this.getSysParams.androidUrl.value
    },
    ios(){
      return this.getSysParams.appleUrl && this.getSysParams.appleUrl.value
    },
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
      .app-store, .google-play {
        width: 160px;
        height: 54px;
        cursor: pointer;
        display: block;
      }
      .app-store {
          background: url('../../assets/img/icon_ios_download.png') no-repeat;
          background-size: 100% 100%;
      }
      .google-play {
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
</style>
