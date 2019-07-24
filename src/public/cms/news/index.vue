<template>
  <div class="content">
    <ul class="ul-nav">
      <li>
        <router-link :to="{name: 'new'}">
          <i></i>
          <span>{{$t('usercontent.user79')}}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'notice'}">
          <i></i>
          <span>{{$t('usercontent.user80')}}</span>
        </router-link>
      </li>
    </ul>
    <div class="right-cont">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: {
      showNav: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {}
    }
  }
</script>

<style scoped lang="less">
  .content {
    width: 1200px;
    margin: 0 auto;
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .ul-nav {
      width: 180px;
      /*flex: 1;*/
      background: #19181c;

      a {
        display: block;
        font-size: 14px;
        line-height: 42px;
        overflow: hidden;
        padding-left: 16px;
        position: relative;

        span {
          display: block;
          width: 100%;
          height: 100%;
          float: left;
          border-bottom: 2px solid hsla(240, 4%, 89%, .1);
          color: #f1f1f2;
        }

        i {
          background: transparent;
          display: block;
          width: 8px;
          height: 4px;
          position: absolute;
          left: 0;
          top: 18px;
        }

        &.router-link-active {
          span {
            color: #00a0e9;
            border-bottom: 2px solid #00a0e9;
          }

          i {
            background: #00a0e9;
          }
        }
      }
    }

    .right-cont {
      width: 1010px;
      /*flex: 1;*/
    }
  }
</style>
