<template>
  <div class="page-top">
    <span class="btn-back" v-if="!showLogo && back" v-tap="{methods: jump}"></span>
    <span class="left" v-if="showLogo" @click="$router.push('/home')">
      <img src="../../assets/img/cdcc/LOGO.png"/>
    </span>
    <slot></slot>
    <ul class="right" v-if="showRight">
      <template v-if="!getApiToken">
        <li>
          <router-link :to="{name:'login'}">{{$t('login_register.login')}}<!--登录--></router-link>
        </li>
        <li>
          <span class="vline"></span>
        </li>
        <li>
          <router-link :to="{name:'page-register'}">{{$t('login_register.register')}}<!--注册--></router-link>
        </li>
      </template>
      <li v-if="showMenu">
        <i @click="showVisible"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'cp-top-back',
  props: {
    back: {
      type: Boolean,
      default: true
    },
    backPage: {
      type: String,
      default: 'back'
    },
    showRight: {
      type: Boolean,
      default: true
    },
    showLogo: {
      type: Boolean,
      default: false
    },
    showMenu: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['getMenuVisible', 'getApiToken', 'getUserInfo'])
  },
  methods: {
    ...mapActions(['setMenuVisible']),
    showVisible () {
      this.setMenuVisible(true)
    },
    jump () {
      switch (this.backPage) {
        case 'login': // 返回登录页面
          this.$router.push({name: 'login'})
          break
        case 'exchange': // 返回币币交易页面
          this.$router.push({name: 'page-iconindex'})
          break
        case 'otc': // 返回OTC页面
          this.$router.push({name: 'page-otc'})
          break
        case 'wallet': // 返回钱包页面
          this.$router.push({name: 'page-wallet'})
          break
        case 'my': // 返回个人中心页面
          this.$router.push({name: 'page-ucenter'})
          break
        case 'back': // 返回上一个页面
        default:
          this.$router.back()
          break
      }
    }
  }
}
</script>

<style scoped>
.page-top{position: relative;height: .8rem;background:#0c151d;font-size:0.24rem;}
.page-top.line{border-bottom: 1px solid #E4E5E7;}
.page-top /deep/ .left{display:flex;height:100%;align-items:center;}
.page-top /deep/ .left img{width:1.7rem;height:0.39rem;margin-left:0.45rem;}
.page-top /deep/ .btn-back{position: absolute;top: .2rem;left: .3rem;width: .4rem;height: .4rem;background: url(../../assets/img/icon-return@3x.png) no-repeat center center / contain;}
.page-top /deep/ .btn-back:active{background-image: url(../../assets/img/icon-return-active@3x.png);}
.page-top /deep/ h1{height: .8rem;font-size: .32rem;line-height: .8rem;color: #fff;text-align: center;}
.page-top /deep/ .right{position:absolute;height:100%;display:flex;right:0;top:0px;align-items:center;}
.page-top /deep/ .right li{margin-right:0.19rem;}
.page-top /deep/ .right li:last-child{margin:0 0.3rem 0 0.11rem;}
.page-top /deep/ .right li:last-child img{width:0.36rem;height:0.38rem;}
.page-top /deep/ .right li a:active{color: #ffde00;}
.page-top /deep/ .right li i{display: block;width: .4rem;height: .4rem;background: url(../../assets/img/cdcc/caidan@3x.png) no-repeat center center / contain;}
.page-top /deep/ .right li i:active{background-image: url(../../assets/img/cdcc/caidan@3x.png);}
.page-top /deep/ .right li span.vline{display:block;height:0.2rem;width:0.02rem;background-color:#ccc;}
</style>
