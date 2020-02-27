<template>
    <div class="cont">
      <div>
        <img src="../assets/img/error.png">
        <p>{{$t('usercontent.error')}}</p>
        <a href="https://gcox.com/mycenter/authentication" target="_self" class="back">Back</a>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'error'
  }
</script>

<style scoped lang="less">
.cont{
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  text-align: center;
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  p{
    font-size: 18px;
    color: #e73f36;
  }
  .back{
    background: #363f41;
    color: #ffffff;
    display: inline-block;
    margin: 50px auto;
    padding: 4px 20px;
    border-radius: 20px;
  }
}
</style>
