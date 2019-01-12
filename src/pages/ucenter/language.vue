<template>
  <div class="page">
    <cp-top-back :backPage="'my'">
    </cp-top-back>

    <div class="two">
      <div class="inner">
        <h1>{{$t('account.user_center_language')}}<!--语言--></h1>
        <section v-for="item in languages" :key="item.id" class="item-section">
          <p @click="setLanguage(item.id)"><span>{{item.name}}</span><span :class="{'right-icon':getCurLang.id==item.id}"></span></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import langApi from '@/api/language'
export default {
  name: 'page-language',
  data () {
    return {
      languages: [
        {id: 'en', name: 'English', n: 4},
        {id: 'cht', name: '中文繁體', n: 2},
        {id: 'zh-CN', name: '中文简体', n: 2}
        // {id: 'ko', name: '한국어', n: 4},
        // {id: 'ja', name: '日本語', n: 2},
        // {id: 'ru', name: 'русский', n: 4}
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
    getCurLang () {
      var lang = this.languages[0]
      this.languages.forEach((item) => {
        if (item.id === this.getLang) {
          lang = item
        }
      })
      return lang
    }
  },
  methods: {
    ...mapActions(['setApiToken', 'setLang', 'addOtcSocketEvent', 'removeOtcSocketEvent']),
    setLanguage (lang) {
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
    }
  }
}
</script>

<style lang="less" scoped>
  .right-icon{
    display: inline-block;
    width: .23rem;
    height: .15rem;
    float: right;
    background: url('../../assets/img/v.png') no-repeat center;
    background-size: 100% 100%;
    margin-top: .45rem;
  }
  .two{
    &>.inner{
      padding: .2rem .3rem;
    }
  }

  .item-section:nth-of-type(1){
     margin-top: .6rem;
  }
  .item-section:nth-of-type(n+1){
    p{
      span{
        i.circular{
          color: red;
          margin-left:.1rem;
        }
      }
      span:nth-of-type(1){
        i{
          font-size: .2rem;
          color: #8089a3;
          font-style: normal;

        }
      }
      span:nth-of-type(2){
        float: right;
        font-size: .26rem;
        color: #8089a3;
      }
    }
  }
  .item-section:nth-of-type(2){
  }
  .item-section:nth-of-type(5){
  }
  .item-section{
    background-color: #292929;
    padding:0 .2rem;
    font-size: .3rem;
    p{
      color: #cbd4ec;
      line-height: 1rem;
    }
  }
  .item-section{
    margin-top: .2rem;
  }


  .usericon{
    i{
      color: white;
      position: relative;
      top: -0.2rem;
    }
    position: relative;
    top: .2rem;
    text-align: center;
    width: .64rem;
    height: .64rem;
    display: inline-block;
    background: url("../../assets/img/i_o.png") no-repeat center;
    background-size: 100% 100%;
  }
  .header{
    font-size: .32rem;
    color: #cbd4ec;
  }
</style>
