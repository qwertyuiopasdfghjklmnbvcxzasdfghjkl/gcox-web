// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import axios from 'axios' // 处理http请求
import store from '@/store' // 状态管理
import vueTap from 'v-tap' // 让事件绑定支持tap事件
import VueI18n from 'vue-i18n' // 多语言处理模块
import methods from '@/api/methods' // 根目录公共函数
import VConsole   from 'vconsole' // 手机调试，生产环境去除
import VeeValidate from 'vee-validate' // 验证
import LangZh from '@/assets/js/lang/zh-CN'
import LangTW from '@/assets/js/lang/cht'
import LangEN from '@/assets/js/lang/en'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '@/components/dialog'
import '@/components/confirm'
import '@/assets/js/vee-validate'
import 'swiper/dist/css/swiper.css'
import '@/assets/css/style.css'
import {
  Button,
  Range,
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Popup,
  Switch,
  InfiniteScroll,
  Loadmore
} from 'mint-ui' // 导入公共组件集合
require('./api/directive') // 引入全局自定义指令集
require('./api/filter') // 引入全局自定义过滤器

// import langApi from '@/api/language' // 语言包

// 公共页面组件
import cpMask from '@/components/common/mask' // 遮罩组件
import cpTopBack from '@/components/common/top_back' // 头部回退组件

// 引入prototype
import '@/assets/js/prototype'

Vue.use(vueTap)
Vue.use(VueI18n)

Vue.use(VeeValidate, {
  events: null
})

Vue.component(cpMask.name, cpMask)
Vue.component(cpTopBack.name, cpTopBack)

Vue.component(Button.name, Button)
Vue.component(Range.name, Range)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Popup.name, Popup)
Vue.component(Switch.name, Switch)
Vue.component(Loadmore.name, Loadmore)
Vue.use(InfiniteScroll)
Vue.use(VueAwesomeSwiper)

// var vConsole = new VConsole()

// 请求加入随机参数
var $ajax = axios.create({
  params: {
    _r: new Date().getTime()
  }
})

Vue.prototype.$ajax = $ajax
Vue.config.productionTip = false

let i18n = window.$i18n = new VueI18n({
  locale: window.localStorage.getItem('lang') || 'en',
  messages: {
    'zh-CN': LangZh,
    'cht': LangTW,
    'en': LangEN
  }
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {
    App
  },
  methods: methods
})
