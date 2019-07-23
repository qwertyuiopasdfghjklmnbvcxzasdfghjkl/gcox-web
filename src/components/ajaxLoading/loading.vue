<template>
  <div v-if="show" class="loading">
    <div class="cont">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
           preserveAspectRatio="xMidYMid" class="lds-ring">
        <circle cx="50" cy="50" fill="none" r="40" stroke="none" stroke-width="10"></circle>
        <circle cx="50" cy="50" fill="none"
                r="40" stroke="#409eff" stroke-width="5" stroke-linecap="round" transform="rotate(44.6958 50 50)">
          <animateTransform attributeName="transform" type="rotate" calcMode="linear"
                            values="0 50 50;180 50 50;720 50 50"
                            keyTimes="0;0.5;1" dur="1.6s" begin="0s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="stroke-dasharray" calcMode="linear"
                   values="25.132741228718345 226.1946710584651;150.79644737231007 100.53096491487338;25.132741228718345 226.1946710584651"
                   keyTimes="0;0.5;1" dur="1.6" begin="0s" repeatCount="indefinite"></animate>
        </circle>
      </svg>
      <p v-html="text"></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    props: ['text', 'show'],
    data () {
      return {}
    },
    watch: {
      show (bool) {
        if (bool === false) {
          this.$emit('removeDialog')
        }
      }
    },
    created () {
    //  有问题 不能用
    },
    methods: {
    }
  }
</script>

<style scoped lang="less">
  .loading {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .cont {
      svg {
        width: 50px;
      }

      p {
        color: #409eff;
        line-height: 26px;
      }
    }
  }
</style>
