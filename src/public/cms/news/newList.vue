<template>
  <div class="cont">
    <p class="navigation">{{$t('usercontent.user80')}}</p>
    <ul class="list-main">
      <li v-for="item in list">
        <router-link :to="{name: 'detail',params:{id: item.cmsInfoId,type:'new'}}">
          <p>{{getLang==='zh-CN'?item.titleCn:item.titleEn}}</p>
          <span>{{new Date(item.updatedAt).format()}}</span>
        </router-link>
      </li>
    </ul>
    <page :pageIndex="page" :pageSize="size" :total="total" @changePageIndex="changePage"></page>
    <loading v-if="loading"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import market from '../../../api/market'
  import page from '@/components/page'
  import loading from '@/components/loading'
  import {mapGetters} from 'vuex'

  export default {
    name: 'list',
    components: {
      page,
      loading
    },
    computed: {
      ...mapGetters(['getLang','getSiteType'])
    },
    data () {
      return {
        list: [],
        page: 1,
        size: 10,
        total: null,
        loading: false
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        this.loading = true
        let data = {
          firstLevel: 1,
          secondLevel: 2,
          state: 1,
          page: this.page,
          size: this.size,
          siteType:this.getSiteType
        }
        market.getCmsList(data, (res, total) => {
          //console.log(res)
          this.list = res.filter(res => {
            if (res.state === 1) {
              return res
            }
          })

          this.list = res
          this.total = total
          this.loading = false
        }, msg => {
          this.loading = false
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      changePage (e) {
        this.page = e
        this.getList()
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./news";

</style>
