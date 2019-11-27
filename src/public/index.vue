<template>
  <div class="wrap">
    <!--轮播-->
    <indexslider/>
    <!-- 通知 -->
    <notice/>
    <!--推荐市场-->
    <indexrecom ref="indexrecom"/>
    <!--数据表格-->
    <indexdatatable/>
    <tipbox/>
    <news/>
    <download/>
    <regbox/>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import indexdatatable from '@/public/index/datatable'
  import indexslider from '@/public/index/indexslider'
  import notice from '@/public/index/notice'
  import indexrecom from '@/public/index/indexrecom'
  import tipbox from '@/public/index/tipbox'
  import news from '@/public/index/news'
  import download from '@/public/index/download'
  import regbox from '@/public/index/regbox'
  import KLineWebSocket from '@/assets/js/websocket'
  export default {
    name: 'app',
    components: {
      indexdatatable,
      indexslider,
      notice,
      indexrecom,
      tipbox,
      news,
      download,
      regbox
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang']),
      aboutUrl () {
        if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
          return 'https://gcox.kf5.com/hc/kb/article/1225583/'
        } else {
          return 'https://gcox.kf5.com/hc/kb/article/1225583/'
        }
      },
      serviceAgreementUrl () {
        if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
          return 'https://gcox.kf5.com/hc/kb/article/1225585/'
        } else {
          return 'https://gcox.kf5.com/hc/kb/article/1225582/'
        }
      },
      privacyNoticeUrl () {
        if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
          return 'https://gcox.kf5.com/hc/kb/article/1225585/'
        } else {
          return 'https://gcox.kf5.com/hc/kb/article/1225585/'
        }
      },
      rateStandardUrl () {
        if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
          return 'https://gcox.kf5.com/hc/kb/article/1225584/'
        } else {
          return 'https://gcox.kf5.com/hc/kb/article/1225584/'
        }
      }
    },
    watch: {
      getApiToken () {
        this.socket && this.socket.changeLogin()
      }
    },
    created () {
      this.socket = KLineWebSocket({
        subscribe:['market'],
        callback: (res) => {
          if (res.dataType === 'markets') {
            this.setMarketList(this.mergeMarkets(res.data))
            this.$refs.indexrecom.products = this.mergeRecomMarkets(res.data)
          }
        },
        onClose: () => {
          this.closeMainLoading = true
        }
      })
    },
    methods:{
      ...mapActions(['setMarketList']),
      mergeMarkets(newData){
        let oldData = this.$refs.indexdatatable.products, tempObj = {}
        oldData.forEach((item) => {
          tempObj[item.market] = item.iconBase64
        })
        newData.forEach((item) => {
          item.iconBase64 = tempObj[item.market]
          if(window.marketOrder){
              item.idx = window.marketOrder[item.market]
              item.visible = window.marketVisible[item.market]
          }
        })
        return newData
      },
      mergeRecomMarkets(newData){
        let oldData = this.$refs.indexrecom.products
        oldData = oldData.map((item) => {
          for(let rd of newData){
            if(item.market===rd.market){
              item = Object.assign(item,rd)
              break
            }
          }
          if(window.marketOrder){
              item.visible = window.marketVisible[item.market]
          }
          return item
        })
        return oldData
      }
    },
    beforeDestroy () {
      this.socket && this.socket.close()
    }
  }
</script>

<style scoped>
.wrap{background-color: #040607; color: #f1f1f2;}
.volume{font-size: 12px;}
.bk-wrap{position:relative;overflow:hidden;min-width:1190px;}
.bk-main{position:relative;overflow:hidden;margin:0 auto;max-width:1360px;}
.bottom{min-width:1190px;}
.bottom-center{display:flex;margin:0 auto;min-width:1190px; max-width:1360px;height:50px;border-bottom:1px solid #f0f0f0;color:#586687;justify-content:space-between;align-items:center;}
.bottom-center .item{text-align:left;-webkit-transition:all .2s;transition:all .2s;flex:1 1 auto;color:#FFF;}
.bottom-center .item a{color:#FFF; position: relative;}
.bottom-center .item a:hover,.bottom-center .item:hover{color:#FFF;cursor:pointer;}
.bottom-center .item a.contact-icons{color:#37A6DC;}
.bottom-center .item a.contact-icons:hover,.bottom-center .item.contact-icons:hover{color:#66b9e2;cursor:pointer;}
.bottom-center .item:nth-child(5){width:680px;background:#ff0;}
.bottom-title-img{margin-top: 48px;margin-bottom: 35px;}
.bottom-title{font-size:30px;color:#f0f0f0;}
.bottom-icons{font-size:64px;color:#fff;}
a{cursor:pointer;color: rgba(204, 204, 204, 0.6);}
a:hover{color: rgba(204, 204, 204, 1);}
a.icon-weixin{position: relative}
a.icon-weixin:hover .wechat{display: block;}
.wechat{position: absolute;bottom: 30px;right: -87px;display: none}
.follow{color: #f0f0f0;font-size: 18px;font-weight: bold;margin-bottom: 35px;}
.center-r-title{font-size: 18px;color: #f0f0f0;font-weight: bold;margin-top: 145px;margin-bottom: 30px;}
.center-btn-en,
.center-btn-cn{display: inline-block;margin-right: 36px;width: 180px;height: 56px;line-height: 56px;border-radius: 10px;border: 2px solid #fff;font-size: 18px;text-align: center;color: #f0f0f0;font-weight: bold;}
.center-btn-en:hover,
.center-btn-cn:hover{color: #fdb902;border-color: #fdb902;}

.footer{
  color: #9b9b9b;
}
.footer > p{
  line-height: 80px;
}
.contact-icons{font-size:24px;}
.wxqr {position: absolute; width: 140px; height: 140px; z-index: 1; background-color: #F5F5F5; border-radius: 4px; left: -58px; bottom: 45px;padding: 10px; box-sizing: border-box; display: none;}
.wxqr img {width: 120px; height: 120px;}
.wxqr i {position: absolute; left: 50%; margin-left: -5px; bottom: -10px; border-top: 10px solid #F5F5F5; border-left: 10px solid transparent; border-right: 10px solid transparent; z-index: 2;}
.icon-weixin.hover:hover .wxqr {display: block;}
</style>

