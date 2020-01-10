<template>
    <div class="dialog">
        <p class="title">{{$t('user.area_chioce')}}<!-- 选择一个区 --></p>
        <img class="banner" src="../../assets/img/jump_banner.png">
        <p class="mt60 text-center fs26">{{$t('user.goto_sg_site')}}<!-- 转到GCOX新加坡站点 --></p>
        <p class="mt25 text-center dark">{{$t('user.curr_pos_sg')}}<!-- 您当前的位置：新加坡 --></p>
        <p class="mt15 dark text-center">{{$t('user.goto_desc')}}<!-- 美洲地区针对美洲的用户进行了优化，为了您的舒适，我们建议您使用你所在地的网站 --></p>
        <p class="text-center"><button class="mt40 gobtn" type="button" onclick="location.href = 'https://gcox.sg'">{{$t('shop.continue')}}<!-- 继续→ --></button></p>
        <p class="text-center mt70"><a href="javascript:;" @click="closeDialog">{{$t('user.curr_stay')}}<!-- 留在当前地区的网站上 --></a></p>
    </div>
</template>

<script>
import userApi from '@/api/individual'
export default {
  data () {
    return {
      
    }
  },
  methods: {
    closeDialog () {
      this.$emit('removeDialog')
    },
  }
}
</script>

<style scoped>
.dark {color: #B6C4CA;}
.dialog {width: 880px;background-color: #2E2E2E; color: #EDF7FB; padding-bottom: 20px;}
.title {font-size: 16px; padding: 15px 22px;}
.banner {display: block; max-width: 100%;}
.gobtn {line-height: 43px; padding-left: 25px; padding-right: 25px; font-size: 16px; color: #fff; background: linear-gradient(top, #16B6FF,#006593); cursor: pointer;}
</style>
