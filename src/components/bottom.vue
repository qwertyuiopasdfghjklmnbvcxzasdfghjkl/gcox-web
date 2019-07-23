<template>
  <div class="bottom-container">
    <div class="bottom">
      <div class="left">
        <div><img src="../assets/img/logo.svg" class="logo"></div>
        <div class="mt30">{{$t('about.slogen')}}<!-- 你最爱的名人币交易所 --></div>
        <div class="mt20 share">
          <a href="https://www.facebook.com/GCOX.Official/" target="_blank"><img src="../assets/img/facebook.svg"></a>
          <a href="https://www.linkedin.com/company/gcox-official/" target="_blank"><img src="../assets/img/linkedin.svg"></a>
          <a href="https://twitter.com/GCOX_Official" target="_blank"><img src="../assets/img/twitter.svg"></a>
          <a href="https://www.instagram.com/gcox_official/" target="_blank"><img src="../assets/img/instagram.svg"></a>
          <a href="https://medium.com/@gcoxofficial" target="_blank"><img src="../assets/img/medium.svg"></a>
          <a href="https://www.youtube.com/c/GCOXOfficial" target="_blank"><img src="../assets/img/youtube.svg"></a>
          <a href="https://vimeo.com/gcox" target="_blank"><img src="../assets/img/vimeo.svg"></a>
        </div>
        <div class="mt10">©2019 Global Crypto Offering Exchange Ltd. All Rights Reserved</div>
      </div>
      <div class="right">
        <div>
          <div dt="">关于我们</div>
          <div dd="">公司介绍</div>
        </div>
        <div>
          <div dt="">交易</div>
          <div dd="">收费表</div>
        </div>
        <div>
          <div dt="">帮助中心</div>
          <div dd="">操作指南</div>
          <div dd="">常见问题</div>
          <div dd="">API文档</div>
        </div>
        <div>
          <div dt="">条款说明</div>
          <div dd="">服务条款</div>
          <div dd="">反洗钱政策</div>
          <div dd="">安全保障</div>
          <div dd=""><a target="_blank" href="https://gcoxgroup.com/privacy_policy.html" class="link-url">隐私政策</a></div>
          <div dd=""><a target="_blank" href="https://gcoxgroup.com/wallet_tnc.html" class="link-url">钱包使用条款</a></div>
          <div dd=""><a target="_blank" href="https://gcoxgroup.com/terms_of_use.html" class="link-url">使用条款</a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name:'bottom',
  data () {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
    
  },
  watch: {
    
  },
  created () {
    
  },
  beforeDestroy () {
    
  },
  methods: {
    ...mapActions(['setApiToken', 'setLang']),
    
  }
}
</script>

<style lang="less" scoped>
.bottom-container {background-color: #151517; }
.bottom {
  width: 1190px;
  padding-top: 35px;
  padding-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  .left {
    font-size: 12px;
    line-height: 20px;
    width: 400px;
    color: #979799;
    .logo {height: 50px; display: block;}
    .share {
      display: flex;
      width: 240px;
      height: 60px;
      flex-wrap: wrap;
      justify-content: flex-start;
      a {
        display: inline-block;
        &+a{
          margin-left: 35px;
        }
        &:nth-of-type(6n) {
          margin-left: 0;
        }
        img {
          width: 18px;
          height: 16px;
        }
      }
    }
  }
  .right {
    line-height: 30px;
    display: flex;
    > div {
      margin-left: 70px;
      a {color: #979799;}
    }
    [dt] {
      color: #f1f1f2;
      font-size: 14px;
      cursor: pointer;
    }
    [dd] {
      color: #979799;
      cursor: pointer;
      font-size: 12px;
    }
  }
}
</style>
