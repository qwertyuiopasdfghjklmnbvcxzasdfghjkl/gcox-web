<template>
  <div class="page">
    <cp-top-back :back="false" :showLogo="true"></cp-top-back>
    <div class="mailbox">
        <div class="mailbox-title">{{$t('public.withdrawal_confirm')}}<!--提币确认--></div>
        <div class="mailbox-cont">
            <img class="mailbox-img" src="../../assets/img/email/lianjieshixiao.png" />
            <p class="mailbox-p">{{$t('public.invalid_link')}}<!--链接已失效--></p>
            <a class="mailbox-a" href="javascript:;" @click="closeWin">{{$t('public.close_window')}}<!--关闭窗口--></a>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeWin () {
      window.opener = null
      window.close()
    }
  }
}
</script>

<style scoped>
.mailbox{width:100%;height:calc(100% - 0.8rem);margin:0 auto;padding-top:0.1rem;overflow-y:auto;padding:0 0.3rem 0.3rem 0.3rem;}
.mailbox-title{height:0.8rem;line-height:0.8rem;color:#becbe8;text-indent:0.3rem;background-color: #0d0d0d;font-size:0.24rem;}
.mailbox-cont{display: flex;flex-flow: column;justify-content: center;align-items: center;padding:0.3rem;min-height:6rem;background-color: #292929;}
.mailbox-p{margin:0.3rem 0;font-size:0.3rem;color: #fdb902;}
.mailbox-a{display: inline-block;min-width:2rem;height:0.6rem;padding:0 0.3rem;line-height:0.6rem;font-size:0.24rem;color: #fff;text-align: center;background-color: #fdb902;border-radius:0.08rem;}
.mailbox-a:hover{background-color: #fdb902;}
</style>

