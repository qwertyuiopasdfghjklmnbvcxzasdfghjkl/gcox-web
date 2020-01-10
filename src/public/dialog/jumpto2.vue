<template>
    <div class="dialog">
        <p class="title text-center">{{$t(key?'user.go_main_soon':'user.go_sg_soon')}}</p>
        <p class="mt40 text-center dark">{{$t(key?'user.no_sg_user':'user.yes_sg_user')}}<a :href="url" target="_self">{{key?'GCOX.COM':'GCOX.SG'}}</a>{{$t('user.site')}}</p>
        <p class="text-center mt80"><a :href="url" target="_self" class="gobtn">{{$t('user.goto_rightnow')}}({{time}}S)</a></p>
    </div>
</template>

<script>

export default {
  props:['key'],
  data () {
    return {
      time:20,
      url:this.key?'https://gcox.com':'https://gcox.sg'
    }
  },
  mounted(){
    let timeOut = () => {
      this.time--
      if (this.time === 0) {
        location.href = this.url
        return
      }
      setTimeout(timeOut, 1000)
    }
    setTimeout(timeOut, 1000)
  },
}
</script>

<style scoped>
.dark {color: #B6C4CA;}
.dialog {width: 880px;background-color: #2E2E2E; color: #EDF7FB; padding-top: 55px; padding-bottom: 65px;}
.title {font-size: 26px;}
.gobtn {display: inline-block;line-height: 43px; padding-left: 25px; padding-right: 25px; font-size: 16px; color: #fff; background: linear-gradient(top, #16B6FF,#006593); cursor: pointer;}
</style>
