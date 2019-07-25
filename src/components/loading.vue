<template>
  <div class="loading">
    <svg width="50px" height="50px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
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
  </div>
</template>

<script>
  export default {
    props: {
      size: {
        default: 64
      }
    }
  }
</script>

<style scoped>
  .loading {
    padding-top: 28px;
    padding-bottom: 28px;
    line-height: 0;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
</style>
