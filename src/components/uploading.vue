<template>
  <div class="uploading">
    <div class="uploading-container">
      <p>
        <loading :size="0.6"></loading>
        <span>{{$t('public0.public188')}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import loading from '@/components/loading'
export default {
  components: {
    loading
  }
}
</script>

<style scoped>
.uploading{display: flex;justify-content: center;align-items: center;position: fixed;top: 0; right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, 0.5);}
.uploading-container{padding:0.3rem;background-color: #292929;max-width:calc(100% - 0.6rem);border-radius:0.1rem;}
.uploading-container p{min-height:0.4rem;line-height:0.4rem;font-size:0.3rem;color: #becbe8;display:flex;align-items:center;}
.uploading-container div{margin-right:0.02rem;}
</style>
