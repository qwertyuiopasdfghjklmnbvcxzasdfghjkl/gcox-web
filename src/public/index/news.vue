<template>
  <div class="news mt70">
    <div class="w1200">
      <p class="news-header efont">{{$t('about.news')}}<!-- 资讯 --></p>
      <div class="ui-flex">
         <router-link :to="{name:'detail',params:{id:item.cmsInfoId, type:'news'}}" class="ui-flex-1  ui-flex ui-flex-center item"  v-for="item in news" tag="div">
          <div class="ui-flex-column">
           <div class="item-title ellipsis"> {{getTitle(item)}} </div>
           <div class="item-detail ellipsis-4"> {{getSummary(item)}} </div>
           <div class="item-bottom ui-flex">
            <div class="ui-flex-1"> {{new Date(item.createdAt).format('yyyy-MM-dd')}} </div>
            <div>{{$t('exchange.advanced_more')}} &gt;&gt; <!-- 更多 --></div>
           </div>
          </div>
         </router-link>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters} from 'vuex'
import marketApi from '@/api/market'
export default{
data(){
    return {
        news:[]
    }
},
computed: {
    ...mapGetters(['getLang']),
},
created() {
    this.getCmsList()
},
methods:{
    getCmsList(){
      marketApi.getCmsList({firstLevel:1,secondLevel:2,page:1,size:3},res=>{
        this.news = res
      })
    },
    getTitle(item){
        let title = item.titleEn
        switch(this.getLang){
            case 'zh-CN':
            title = item.titleCn
            break
            case 'cht':
            title = item.titleCht
            break
        }
        return title
    },
    getSummary(item){
        let summary = item.bodyEn
        switch(this.getLang){
            case 'zh-CN':
            summary = item.bodyCn
            break
            case 'cht':
            summary = item.bodyCht
            break
        }
        let _dom = document.createElement('div')
        _dom.innerHTML = summary
        summary = _dom.innerText
        summary = summary.length>90?summary.slice(0,90)+'...':summary
        return summary
    }
}
}
</script>

<style lang="less" scoped>
.news{
  padding: 20px 0 70px;
  color: #151720;
  background-color: #eaeaec;
  .news-header {
    line-height: 40px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    font-size: 20px;
  }
  .item > div {
      padding: 30px 18px 0;
      width: 332px;
      height: 200px;
      box-sizing: border-box;
      background: url('../../assets/img/news_bg.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      transition: all .2s ease;
      transform: translateZ(0);
      &:hover{transform:translate3d(0,-10px,0)}
      .item-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 14px;
      }
      .item-detail {
          color: #979799;
          font-size: 12px;
          line-height: 20px;
          height: 80px;
          overflow: hidden;
      }
      .item-bottom {
          margin-top: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #979799;
      }
  }
}
</style>
