<template>
    <div class="dialog">
        <p class="title text-center">即将转到新加坡地区的网站</p>
        <p class="mt40 text-center dark">您是新加坡用户，根据相关政策要求，请使用<a href="https://gcox.sg" target="_self">GCOX.SG</a>网站</p>
        <p class="text-center mt80"><button class="gobtn" type="button" onclick="location.href = 'https://gcox.sg'">立即跳转({{time}}S)</button></p>
    </div>
</template>

<script>

export default {
  data () {
    return {
      time:20
    }
  },
  mounted(){
    let timeOut = () => {
      this.time--
      if (this.time === 0) {
        location.href = 'https://gcox.sg'
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
.gobtn {line-height: 43px; padding-left: 25px; padding-right: 25px; font-size: 16px; color: #fff; background: linear-gradient(top, #16B6FF,#006593); cursor: pointer;}
</style>
