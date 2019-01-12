<template>
    <div class="header">
        <div class="left">
            <img src="../../assets/img/cdcc/LOGO.png"/>
        </div>
        <ul class="right">
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
            <li v-if="getApiToken">
                <a>{{getUserInfo.username}}</a>
            </li>
            <li>
                <img v-tap="{methods:showVisible}" src="../../assets/img/cdcc/caidan@3x.png"/>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['getMenuVisible', 'getApiToken', 'getUserInfo'])
  },
  methods: {
    ...mapActions(['setMenuVisible']),
    showVisible () {
      this.setMenuVisible(true)
    }
  }
}
</script>

<style scoped>
.header{width:100%;height:0.8rem;display:flex;justify-content:space-between;background:#292929;align-items:center;}
.header /deep/ .left{margin-left:0.45rem;}
.header /deep/ .left img{width:1.7rem;height:0.39rem;}
.header /deep/ .right{display:flex;align-items:center;}
.header /deep/ .right li{margin-right:0.19rem;}
.header /deep/ .right li:last-child{margin:0 0.3rem 0 0.11rem;}
.header /deep/ .right li:last-child img{width:0.36rem;height:0.38rem;}
.header /deep/ .right li span.vline{display:block;height:0.25rem;width:0.02rem;background-color:#858B99;}
</style>
