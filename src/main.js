// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import store from '@/vuex'
import Vtip from '@/assets/js/vtip.min'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '@/components/dialog'
import '@/components/confirm'
import '@/components/ajaxLoading'
import '@/components/messageTipBox'
import '@/assets/js/vee-validate'
import '../node_modules/hopscotch/dist/css/hopscotch.min.css'
import 'vtip/lib/index.min.css'
import '@/assets/css/style.css'
import '@/assets/css/mian.css'
import 'swiper/dist/css/swiper.css'
import langApi from '@/api/language'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'

import loading from '@/components/loading'

import VueClipboard from 'vue-clipboard2'

Vue.use(VeeValidate)
Vue.use(VueI18n)
Vue.use(Vtip.directive)
Vue.use(VueAwesomeSwiper)
Vue.component('v-chart', ECharts)
Vue.use(VueClipboard)
Vue.component('loading', loading)

let i18n = window.$i18n = new VueI18n({
  locale: 'en',
  messages: {
    'zh-CN': null,
    'en': null
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
let lang = window.localStorage.getItem('lang') || 'en'
let tar = document.getElementsByTagName('title')
if (lang === 'en') {
  tar[0].innerText = 'GCOX - Global Crypto Offering Exchange'
} else {
  tar[0].innerText = 'GCOX-比特币以太坊专业数字货币交易网站'
}
langApi.getLanguage(lang, (res) => {
  i18n.locale = lang
  // res.usercontent = gjh.usercontent
  i18n.setLocaleMessage(lang, res)
  window.vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {App}
  })
}, (msg) => {
  window.vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {App}
  })
  console.error(msg)
})
