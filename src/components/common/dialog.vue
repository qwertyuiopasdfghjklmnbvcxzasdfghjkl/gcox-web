<template>
  <div>
    <div class="dialog-wrap">
      <div class="dialog-cover" v-if="isShow" @click="closeMyself"></div>
      <transition name="drop">
        <div class="dialog-content" v-if="isShow">
          <slot>empty</slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {

      }
    },
    methods: {
      closeMyself () {
        this.$emit('on-close')
      }
    }
  }
</script>

<style scoped>
.drop-enter-active {
  transition: all .5s ease;
}
.drop-leave-active {
  transition: all .3s ease;
}
.drop-enter {
  transform: translateY(-5rem);
}
.drop-leave-active {
  transform: translateY(-5rem);
}
.dialog-cover {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background-color: #000;
  opacity: .3;
}
.dialog-content {
  position: fixed;
  top: 20%;
  left: 5%;
  width: 90%;
  z-index: 11;
  padding: .4rem;
  background-color: #e6edf4;
}
</style>
