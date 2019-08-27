<template>
    <div class="cont">
      <p class="top">{{$t('account.note')}}</p>
      <div class="bar">
        <span class="bar-vol"></span>
        <label class="bar-cont">
          <i></i>
          <span></span>
        </label>
        <p>{{$t('account.target-amount')}}: </p>
      </div>
      <p class="bottom">{{$t('account.progress-time').format('a','s')}}</p>
    </div>
</template>

<script>
  export default {
    name: 'progress-bar'
  }
</script>

<style scoped lang="less">
.cont{
  position: absolute;
  right: 0;
  width: 500px;
  .bar{
    display: flex;
    position: relative;
    justify-content: space-between;
    .bar-cont{
      position: absolute;
      background: #353535;
      height: 14px;
      width: 360px;
      left: 0;
      top: 0;
      i{
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #000;
        width: 100px;
      }
    }
  }
}
</style>
