<template>
  <div class="cont">
    <h4 class="title" v-html="title"></h4>
    <small class="small" v-html="small"></small>
    <div v-html="data"></div>
  </div>
</template>

<script>
  import market from '../../../api/market'
  import {mapGetters} from 'vuex'

  export default {
    name: 'detail',
    data () {
      return {
        data: null,
        title: null,
        small: null,
        id: null
      }
    },
    computed: {
      ...mapGetters(['getLang'])
    },
    watch: {
      '$route' (e) {
        console.log(e)
      },
      getLang(){
        this.getDetail()
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getDetail()
    },
    methods: {
      getDetail () {
        market.getCmsDetail(this.id, res => {
          console.log(res)
          if (this.getLang === 'zh-CN') {
            this.data = res.bodyCn
            this.title = res.titleCn
            this.small = new Date(res.updatedAt).format()
          } else {
            this.data = res.bodyEn
            this.title = res.titleEn
            this.small = new Date(res.updatedAt).format()
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    background-color: #19181c;
    width: 950px;
    min-height: 300px;
    overflow: hidden;
    color: #ffffff;
    padding: 30px;
    margin-bottom: 50px;
    padding-bottom: 50px;
    &>.title{
      font-size: 18px;
      text-align: center;
      line-height: 34px;
      color: #ffffff;
    }
    &>.small{
      text-align: center;
      display: block;
      padding: 10px;
    }
  }
</style>
