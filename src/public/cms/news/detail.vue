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
        this.getDetail()
      },
      getLang(){
        this.getDetail()
      }
    },
    created () {
      this.getDetail()
    },
    methods: {
      getDetail () {
        this.id = this.$route.params.id
        market.getCmsDetail(this.id, res => {

          if (this.getLang === 'zh-CN') {
            this.data = res.bodyCn
            this.title = res.titleCn
            this.small = new Date(res.updatedAt).format()
            console.log('1')
          } else {
            this.data = res.bodyEn
            this.title = res.titleEn
            this.small = new Date(res.updatedAt).format()
            console.log('2')
          }
          console.log(this.title,this.small)
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
    ul{
      list-style-type: initial;
    }
    ol{
      list-style-type: decimal;
    }
    a{
      color: #00B5FF;
    }
  }
</style>
