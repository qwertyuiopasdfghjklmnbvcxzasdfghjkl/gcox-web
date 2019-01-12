<template>
  <div class="wrap">
    <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
      <router-view :class="['frames']"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style lang="less" scoped>
.frames {
  height: 100vh;
}
</style>
