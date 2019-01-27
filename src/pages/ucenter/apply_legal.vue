<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('seller_apply.seller_agency_apply')}}<!--商家申请--></h1>
    </cp-top-back>

    <div class="page-main content">
      <div class="apply-rule">
        <h2>《OTC服务协议》</h2>
        <p>OTC服务协议</p>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/individual'
export default {
  name: 'page-apply-legal',
  data () {
    return{
      
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.popul70{
  width: 80%;
  border-radius: .1rem;
  overflow: hidden;
}
.header-right{
  float: right;
  font-size: .26rem;
}
.page{
  background: #fff;
  color:#000;
}
.page-main{
  margin: 0 0 1.2rem;
  .apply-rule{
    padding: .2rem .3rem;
    font-size: 0.3rem;
    line-height: .42rem;
    h2{
      font-size: .32rem;
      font-weight: 600;
      padding: .2rem 0;
    }
    p{
      padding: .05rem 0;
    }
    
  }
}
</style>
