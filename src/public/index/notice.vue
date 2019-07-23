<template>
    <div class="w1200 notice ui-flex">
      <div class="ui-flex-1 ui-flex">
        <div class="item ui-flex-1 ellipsis" v-for="item in notice">
          <i class="item-icon"></i>
          <router-link :to="{name:'noticeDetail', params:{id:item.cmsInfoId}}">{{getTitle(item)}}</router-link>
        </div>
      </div>
      <router-link :to="{name:'notice'}" tag="div" class="more">{{$t('exchange.advanced_more')}} >><!-- 更多 --></router-link>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
import marketApi from '@/api/market'
export default{
data(){
    return {
        notice:[]
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
      marketApi.getCmsList({firstLevel:1,secondLevel:1,page:1,size:3},res=>{
        this.notice = res
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
    }
}
}
</script>
<style lang="less" scoped="">
.notice {
  height: 46px;
  line-height: 46px;
  overflow: hidden;
  font-size: 12px;
  .more {
      cursor: pointer;
      color: #979799;
  }
  .item + .item {
    margin-left: 10px;
  }
  .item-icon {
    width: 25px;
    height: 46px;
    background: url('../../assets/img/icon_notice.png') no-repeat 0;
    background-size: 16px 16px;
    display: inline-block;
    vertical-align: middle;
  }
  a {
    color: #f1f1f2;
    &:hover {text-decoration: underline;}
  }
}
</style>