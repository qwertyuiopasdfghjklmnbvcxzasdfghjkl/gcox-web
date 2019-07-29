<template>
  <div class="cont">
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
        id: null
      }
    },
    computed: {
      ...mapGetters(['getLang'])
    },
    watch: {
      '$route' (e) {
        console.log(e)
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
          } else {
            this.data = res.bodyEn
          }
        })
      }
    }
  }
</script>

<style scoped>
  .cont {
    background-color: #19181c;
    width: 100%;
    min-height: 300px;
    overflow: hidden;
    color: #ffffff;
    padding: 20px;
    margin-bottom: 50px;
    padding-bottom: 30px;
  }
</style>
