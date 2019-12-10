<template>
  <div class="bottom-container">
    <div class="bottom">
      <div class="left">
        <div><img src="../assets/img/logo.svg" class="logo"></div>
        <div class="mt30">{{$t('about.slogen')}}<!-- 你最爱的名人币交易所 --></div>
        <div class="mt20 share">
          <a href="https://www.facebook.com/GCOX.Official/" target="_blank"><img src="../assets/img/facebook.svg"></a>
          <a href="https://www.linkedin.com/company/gcox-official/" target="_blank"><img
            src="../assets/img/linkedin.svg"></a>
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
          <div dt="" class="title">
            <router-link :to="{name: 'about'}">{{$t('usercontent.user92')}}</router-link><!--关于我们--></div>
          <div dd="" v-for="item in about">
            <router-link :to="{name: 'footDetail',params:{id: item.cmsInfoId, type:'about'}}">
              {{getLang==='zh-CN'?item.titleCn:item.titleEn}}
            </router-link>
          </div>
        </div>
        <div>
          <div dt="" class="title">
            <router-link :to="{name: 'deal'}">{{$t('usercontent.user93')}}</router-link><!--交易--></div>
          <div dd="" v-for="item in deal">
            <router-link :to="{name: 'footDetail',params:{id: item.cmsInfoId, type:'deal'}}">
              {{getLang==='zh-CN'?item.titleCn:item.titleEn}}
            </router-link>
          </div>
        </div>
        <div>
          <div dt="" class="title">
            <router-link :to="{name: 'help'}">{{$t('usercontent.user94')}}</router-link><!--帮助中心--></div>
          <div dd="" v-for="item in help">
            <router-link :to="{name: 'footDetail',params:{id: item.cmsInfoId, type:'help'}}">
              {{getLang==='zh-CN'?item.titleCn:item.titleEn}}
            </router-link>
          </div>
        </div>
        <div>
          <div dt="" class="title">
            <router-link :to="{name: 'clause'}">{{$t('usercontent.user95')}}</router-link><!--条款说明--></div>
          <div dd="" v-for="item in clause">
            <router-link :to="{name: 'footDetail',params:{id: item.cmsInfoId,type:'clause'}}">
              {{getLang==='zh-CN'?item.titleCn:item.titleEn}}
            </router-link>
          </div>
          <div dd="">
            <a target="_blank" href="https://gcoxgroup.com/privacy_policy.html" class="link-url">
              {{$t('usercontent.foot-policy')}}</a></div>
          <div dd=""><a target="_blank" href="https://gcoxgroup.com/wallet_tnc.html" class="link-url">{{$t('usercontent.wallet-rule')}}</a>
          </div>
          <div dd=""><a target="_blank" href="https://gcoxgroup.com/terms_of_use.html" class="link-url">{{$t('usercontent.use-rule')}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import market from '../api/market'

  export default {
    name: 'bottom',
    data () {
      return {
        about: [],
        deal: [],
        help: [],
        clause: [],
      }
    },
    computed: {
      ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
    },
    watch: {},
    created () {
      this.getList()
      //console.log(this.getLang)
    },
    beforeDestroy () {

    },
    methods: {
      ...mapActions(['setApiToken', 'setLang']),
      getList () {
        market.getCmsList(
          {
            firstLevel: 2,
            state: 1
          },
          res => {
            res.filter(data => {
              if (data.secondLevel === 3) {
                this.about.push(data)
              } else if (data.secondLevel === 4) {
                this.deal.push(data)
              } else if (data.secondLevel === 5) {
                this.help.push(data)
              } else if (data.secondLevel === 6) {
                this.clause.push(data)
              }
            })
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .bottom-container {
    background-color: #151517;
  }

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

      .logo {
        height: 50px;
        display: block;
      }

      .share {
        display: flex;
        width: 240px;
        height: 60px;
        flex-wrap: wrap;
        justify-content: flex-start;

        a {
          display: inline-block;

          & + a {
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
        margin-left: 50px;

        a {
          color: #979799;
          display: inline-block;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

      }

      [dt] {
        color: #f1f1f2;
        font-size: 14px;
        cursor: pointer;

        a {
          color: #ffffff;
        }
      }

      [dd] {
        color: #979799;
        cursor: pointer;
        font-size: 12px;
      }
    }
  }
</style>
