<template>
	<div class="block">
		<div class="title-container">{{$t('public.notice')}}<!-- 公告 --></div>
		<ul class="new">
			<li v-for="item in notice">
				<router-link :to="{name:'detail', params:{id:item.cmsInfoId, type:'notice'}}">
					<span>{{getTitle(item)}}</span>
					<em>{{new Date(item.createdAt).format('yyyy-MM-dd')}}</em>
				</router-link>
			</li>
		</ul>
		
	</div>
</template>

<script>
import { mapGetters} from 'vuex'
import marketApi from '@/api/market'
export default {
	data(){
		return {
			notice:[]
		}
	},
	computed:{
		...mapGetters(['getLang']),
	},
	created() {
	    this.getCmsList()
	},
	methods:{
	    getCmsList(){
	      marketApi.getCmsList({firstLevel:1,secondLevel:1,page:1,size:5},res=>{
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
.title-container {
    font-size: 18px;
    color: #f1f1f2;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 40px;
    box-sizing: border-box;
}
.new {
    padding-bottom: 10px;
    li {
        width: 100%;
        line-height: 20px;
        height: 40px;
        margin-top: 10px;
        padding-top: 6px;
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        box-sizing: border-box;
        &+li{border-top: 1px solid #3c3a48;}
        a {color: #f1f1f2; }
        em {
            color: #979799;
            position: absolute;
            right: 0;
            bottom: -4px;
            z-index: 1;
            font-style: normal;
        }
    }
}
</style>