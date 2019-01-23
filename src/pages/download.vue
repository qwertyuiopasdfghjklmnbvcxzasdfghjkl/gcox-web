<template>
    <div class="page">
        <cp-top-back :back="false" :showLogo="true"></cp-top-back>
        <div class="download-scroll">
        <div class="download">
            <div class="banner1">
                <div class="content">
                    
                    <div class="title1" style="margin-top: 1rem;">{{$t('public0.public285')}}</div>
                    <div class="title2">
                        <!--保持链接 实时掌握-->
                        {{$t('public0.public286')}}
                    </div>
                    <div class="download-buttons" v-if="isWeiXi">
                        <a class="button" @click="showTip">
                            <!--安卓下载-->
                            {{$t('public0.public226')}}
                        </a>
                        <a class="button" @click="showTip">
                            <!--IOS下载-->
                            {{$t('public0.public227')}}
                        </a>
                    </div>
                    <div class="download-buttons" v-if="!isWeiXi">
                        <a class="button" :class="{en:getLang=='en'}" :href="apk" target="_blank">
                            <!--安卓下载-->
                            {{$t('public0.public226')}}
                        </a>
                        <a class="button" :class="{en:getLang=='en'}" href="https://www.pgyer.com/2lKH" target="_blank">
                            <!--IOS下载-->
                            {{$t('public0.public227')}}
                        </a>
                    </div>
                    <div class="title4">&nbsp;</div>
                </div>
            </div>
            <!--微信内请点击右上角“...”按钮，使用浏览器打开。-->
            <!-- <div class="tips">
                <p>
                
                {{$t('public0.public213')}}
                </p>
            </div> -->
        </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from 'vuex'
import config from '@/assets/js/config'
import Tip from '@//assets/js/tip'

export default {
  name: 'page-download',
  data () {
    return {
      isWeiXi: /MicroMessenger/i.test(window.navigator.userAgent)
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    apk(){
        return `${config.url}/static/cdcc-release-1.0.1.apk`
    }
  },
  methods: {
    showTip () {
      Tip({icon: 'danger', message: this.$t('public0.public213')})
    }
  }
}
</script>

<style scoped>
.download-scroll{
    width:100%;height:calc(100% - 0.8rem);overflow-y:auto;
}
.download{
    width:100%;min-height:100%;height:fit-content;margin:0 auto;display:flex;flex-direction:column;align-items:center;
    background-color:#fafafa;background-image:linear-gradient(rgba(43, 45, 66, 0.75), rgba(43, 45, 66, 0.75)), url(../assets/img/download/bg.jpg);
    background-size:cover;background-position:bottom;background-attachment:fixed;
    padding:0 0.3rem;
}
.download .banner1{
    width:100%;position: relative;display:flex;align-items:center;justify-content:center;
}
.download .banner1 > img{width:100%;}
.download .banner1 .content{width:100%;margin-top:0.3rem; text-align: center;}
.download .banner1 .content .title1{font-size:0.5rem;font-weight:bold;color:#fff;}
.download .banner1 .content .title2{font-size:0.36rem;font-weight:bold;color:#ccc;line-height:0.73rem;}
.download .banner1 .content .title3{font-size:0.3rem;font-weight:bold;color:#FFFEFE;line-height:0.5rem;}
.download .banner1 .content .download-buttons{display:flex;width:100%; justify-content: center; margin-top: 0.2rem;}
.download .banner1 .content .download-buttons .button{
    display:flex;min-width:2rem;height:1.21rem;line-height:1.4rem;background:url(../assets/img/download/btn.png) no-repeat center;
    background-size:100% 100%;padding:0 0.2rem;
    cursor: pointer;justify-content:center;color:#FFF;font-size:0.24rem;font-weight:bold;
}
.download .banner1 .content .download-buttons .button.en{font-size:0.18rem;}
.download .banner1 .content .download-buttons .button:last-child{margin-left:0.4rem;}
.download .banner1 .content .title4{font-size:0.28rem;font-weight:bold;color:#BAB9B9;line-height:1rem;}
.download .tips{
    position: relative;display:flex;justify-content:center;height:1rem;width:100%;padding:0 0.2rem; margin-left: -0.3rem; margin-right: -0.3rem;
    background:url(../assets/img/download/bg2.png) no-repeat center;background-size:100% 100%;
}
.download .tips img{width:100%;}
.download .tips p{
    height:100%;display:flex;align-items:center;top:0px;width:100%;
    font-size:0.28rem;color:#010101;font-weight:bold;
}
</style>