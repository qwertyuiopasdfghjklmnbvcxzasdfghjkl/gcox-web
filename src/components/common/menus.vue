<template>
    <div class="menus-container">
        <ul class="top">
            <li>
                <img :src="avatarUrl"/>
            </li>
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
        </ul>
        <ul class="menu-list">
            <li class="menu-item" @click="hideVisible">
                <router-link :to="{name:'page-home'}">{{$t('public0.public206')}}<!--首页--></router-link>
            </li>
            <!--投票挖矿-->
            <li class="menu-item" @click="hideVisible">
                <router-link :to="{name:'vote_mining_index'}">
                    {{$t('business.MINING_TITLE')}}
                </router-link>
            </li>
            <li class="menu-item" @click="hideVisible">
                <router-link :to="{name:'page-iconindex'}">
                    {{$t('public.navigation_exchange')}}<!--币币交易-->
                </router-link>
            </li>
            <li class="menu-item" @click="hideVisible">
                <router-link :to="{name:'page-otc'}">
                    {{$t('public.navigation_OTC')}}
                </router-link>
            </li>
            <template v-if="getApiToken">
                <li class="menu-item" @click="hideVisible">
                    <router-link :to="{name:'page-wallet'}">
                        {{$t('account.userDigitalAssets')}}<!--我的数字资产-->
                    </router-link>
                </li>
                <li class="menu-item" @click="hideVisible">
                    <router-link :to="{name:'page-ucenter'}">
                        {{$t('public.navigation_account')}}<!--个人中心-->
                    </router-link>
                </li>
                <li class="menu-item">
                    <a @click="loginOut">
                        {{$t('public.navigation_logout')}}<!--退出-->
                    </a>
                </li>
            </template>
            <!--APP下载-->
            <li class="menu-item" v-if="!isApp">
                <router-link :to="{name:'page-download'}">
                    {{$t('public0.public212')}}
                </router-link>
            </li>
            <li class="menu-item language" :class="{unfold: languagesUnfold}" @click="languagesUnfold = !languagesUnfold">
                <a>
                    {{$t('account.user_center_language')}}<!--语言-->
                </a>
            </li>
            <li class="menu-item language-item" v-show="languagesUnfold" v-for="item in languages">
                <a @click="setLanguage(item.id)">
                    {{$t(`languages.${item.id.replace('-','')}`)}}
                </a>
            </li>
            <li class="menu-item" v-if="isApp">
                <a @click="checkUpdate">
                    {{$t('public.foot_version').format(version)}}<!--版本-->
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import utils from '@/assets/js/utils'
import langApi from '@/api/language'
import userUtils from '@/api/individual'
import avatar from '@/assets/img/touxiang.png'
import config from '@/assets/js/config'
export default {
  data () {
    return {
      avatarUrl: avatar,
      isApp: config.app,
      version:config.version,
      languages: [
        {id: 'en', name: this.$t('languages.en'), n: 4},
        {id: 'cht', name: this.$t('languages.cht'), n: 2},
        {id: 'zh-CN', name: this.$t('languages.zhCN'), n: 2}
      ],
      languagesUnfold: false,
    }
  },
  computed: {
    ...mapGetters(['getMenuVisible', 'getApiToken', 'getUserInfo'])
  },
  created () {
    this.fnDownloadHeader()
  },
  methods: {
    ...mapActions(['setMenuVisible', 'setLang', 'setApiToken']),
    openURL(tar){ //打开链接地址函数
      if(window['cordova'] && window['cordova']['InAppBrowser']){
        cordova.InAppBrowser.open(this.$t(tar), '_blank', 'location=yes')
      } else {
        window.open(this.$t(tar), '_blank')
      }
    },
    sef(){
        this.$router.push({path: '/home/system-administrator/system-addAdmini',query: {'userId': userId}});
    },
    fnDownloadHeader () {
      // 下载当前用户头像
      userUtils.downloadHeader((url) => {
        this.avatarUrl = url
      })
    },
    hideVisible () {
      this.setMenuVisible(false)
    },
    setLanguage (lang) {
        this.hideVisible()
        this.setLang(lang)
        if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(lang))) {
          this.$i18n.locale = lang
          return
        }
        console.log('change langugae')
        langApi.getLanguage(lang, (res) => {
          this.$i18n.locale = lang
          this.$i18n.setLocaleMessage(lang, res)
        })
    },
    loginOut () {
        this.hideVisible()
        // 确认退出当前帐号吗？
        MessageBox({
          title: this.$t('public0.public242'),
          message: this.$t('account.user_center_logout_confirm'),
          confirmButtonText: this.$t('otc_legal.otc_legal_confirm'),
          showCancelButton: true,
          cancelButtonText: this.$t('otc_legal.otc_legal_cancel')
        }).then(action => {
          if (action === 'confirm') {
            this.setApiToken(null)
            this.$router.push({name: 'login'})
          }
        })
    },
    checkUpdate(){
      // 检测更新
      if (window.chcp) {
        let chcp = window.chcp;
        // 检测更新
        chcp.fetchUpdate((error, data) => {
          // 表示没有更新版本，或者其他错误，详情的信息参考上面的chcp error链接
          if (error) {
            console.log('--fetchUpdate error--', error.code, error.description);
            MessageBox.alert(this.$t('lastestVersion'), this.$t('public0.public242'),{
              confirmButtonText:this.$t('ok'),
            })
            return;
          }
          // 这次更新的版本信息
          console.log('--fetchUpdate--', data, data.config);
          // 检测是否是否可以进行安装了，双重判断吧，有时候会出现有更新版本但是暂时无法安装的情况（也可以去掉这一层）
          chcp.isUpdateAvailableForInstallation((error, data) => {
            if (error) {
              console.log('No update was loaded => nothing to install');
            } else {
              // 询问用户是否更新 检测到新版本，是否更新?
              MessageBox.confirm(window.$i18n.t('public0.public279')).then(action => {
                // 更新中
                chcp.installUpdate((error) => {
                  if (error) {
                    // 更新失败
                    window.localStorage.setItem('appUpdated', 'false')
                    console.log('Failed to install the update with error code: ' + error.code);
                    console.log(error.description);
                  } else {
                    // 更新成功
                    window.localStorage.setItem('appUpdated', 'true')
                    console.log('Update installed!');
                  }
                });
              }, () =>{})
              // 对比版本号
              console.log('Current content version: ' + data.currentVersion);
              console.log('Ready to be installed:' + data.readyToInstallVersion);
            }
          });
        });
      }
    },
  }
}
</script>

<style scoped>
.menus-container{width:4.92rem;height:100vh;background-color:#EFF0F4;font-size:0.24rem;}
.menus-container /deep/ .top{display:flex;height:0.8rem;background-color:#292929;align-items:center;}
.menus-container /deep/ .top li{margin-right:0.19rem;}
.menus-container /deep/ .top li:first-child{margin:0 0.3rem;}
.menus-container /deep/ .top li a:active{color: #ffde00;}
.menus-container /deep/ .top li img{width:0.6rem;height:0.6rem;margin-top: .1rem;background-color: #0d0d0d;border-radius: 50%;}
.menus-container /deep/ .top li span.vline{display:block;height:0.25rem;width:0.02rem;background-color:#858B99;}
.menu-list{max-height:calc(100vh - 0.8rem);overflow-y:auto;overflow-x:hidden;}
.menu-list /deep/ li{height:0.8rem;line-height:0.8rem;color:#333;font-weight:500;display:flex;align-items:center;}
.menu-list /deep/ li:nth-child(odd){background-color:#FFF;}
.menu-list /deep/ li:nth-child(even){background-color:#F8F9FD;}
.menu-list /deep/ li.language{position: relative;}
.menu-list /deep/ li.language::after{content:"";position: absolute;top: 50%;right: .3rem;width: 0;height: 0;margin-top: -0.05rem;border-width: .1rem .1rem 0 .1rem;border-style: solid;border-color: #999 transparent transparent transparent;}
.menu-list /deep/ li.language.unfold::after{border-width: 0 .1rem .1rem .1rem;border-color: transparent transparent #999 transparent;}
.menu-list /deep/ li.language-item{background-color:#EFF0F4;}
.menu-list /deep/ li:active,
.menu-list /deep/ li.language-item:active{background-color: #0072fd;}
.menu-list /deep/ li.language:active::after{border-top-color: #fff;}
.menu-list /deep/ li.language.unfold:active::after{border-bottom-color: #fff;}
.menu-list /deep/ li a{display:block;width:100%;padding:0 0.3rem;color:#333;}
.menu-list /deep/ li:active a{color:#fff;}
</style>
