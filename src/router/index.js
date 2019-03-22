import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import guide from '@/pages/guide'
import home from '@/pages/home'
import login from '@/pages/login'
import findPwd from '@/pages/findPwd'/*找回密码*/
import twoverify from '@/pages/twoverify'/*二次认证*/
import register from '@/pages/register'
import market from '@/pages/icontrading/market'
import kline from '@/pages/icontrading/kline'
import download from '@/pages/download'
import ResetPwd from '@/pages/resetpwd'
import withdrawsuccess from '@/pages/email/withdrawsuccess'
import linkinvalid from '@/pages/email/linkinvalid'
import activation from '@/pages/email/activation'
import activationsuccess from '@/pages/email/activationsuccess'

import icontrading from '@/pages/icontrading/index'
import otc from '@/pages/otc/index'
import otcAppeal from '@/pages/otc/appeal'
import otcChat from '@/pages/otc/chat'
import otcOrderDetail from '@/pages/otc/orderdetail'
import otcAdUpdate from '@/pages/otc/createorder'
import wallet from '@/pages/wallet/index'
import trading from '@/pages/wallet/trading'
import topup from '@/pages/wallet/topup'
import withdrawal from '@/pages/wallet/withdrawal'

/*个人中心*/
import ucenter from '@/pages/ucenter/index'
import realname from '@/pages/ucenter/realname'
import realnameInfo from '@/pages/ucenter/realnameInfo'
import otherRealnameInfo from '@/pages/ucenter/otherRealnameInfo'
import msg from '@/pages/ucenter/msg'
import about from '@/pages/ucenter/about'
import help from '@/pages/ucenter/help'
import saft from '@/pages/ucenter/saft'
import apply from '@/pages/ucenter/apply'
import apply_form from '@/pages/ucenter/apply_form'
import apply_legal from '@/pages/ucenter/apply_legal'
import merchant_manager from '@/pages/ucenter/merchantManage'
import editPwd from '@/pages/ucenter/editPwd'
import bindgoogle from '@/pages/ucenter/bindgoogle'
import myInfo from '@/pages/ucenter/myInfo'/*我的资料*/
import setUp from '@/pages/ucenter/setUp'/*设置*/
import language from '@/pages/ucenter/language'/*语言*/
import bankset from '@/pages/ucenter/bankset'/*银行卡收款设置*/
import payment from '@/pages/ucenter/payment'/*支付宝收款设置*/
import WeChat from '@/pages/ucenter/WeChat'/*微信收款设置*/
import paypal from '@/pages/ucenter/paypal'/*PayPal收款设置*/
import payway from '@/pages/ucenter/payway'/*收款方式设置*/
import un_or_bindphone from '@/pages/ucenter/un_or_bindphone'/*解除/绑定短信验证*/
import invite from '@/pages/ucenter/invite'
import transRecord from '@/pages/ucenter/trans_record'
import transDetail from '@/pages/ucenter/trans_detail'

import voteMiningIndex from '@/pages/vote_mining/index' /*投票挖矿*/
import voteMiningProfit from '@/pages/vote_mining/profit'

Vue.use(Router)

import index from '@/pages/index'

// const Foo = r => require.ensure([], ()=>r(require('../components/foo.vue')), 'group-foo')
// const Bar = r => require.ensure([], ()=>r(require('../components/bar.vue')), 'group-foo')
// 文件分开打包组件引用方法

const scrollBehavior = (to, from, savedPosition) => { // 滚动行为
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0
      position.y = 0
    }
    return position
  }
}

const router = new Router({
  linkActiveClass: 'active',
  base: __dirname,
  //mode: 'history', // 启用HTML5 history模式，可以使用pushState和replaceState来管理记录
  scrollBehavior,
  routes: [
    {
      path: '/kline/:market?', // K线图页面
      name: kline.name,
      component: kline
    },
    {
      path: '/market/:market?', // 交易市场页面
      name: market.name,
      component: market
    },
    {
      path: '/guide', // 引导页面
      name: guide.name,
      component: guide
    },
    {
      path: '/login', // 登录页面
      name: login.name,
      component: login,
      meta: {noEntry: true}
    },
    {
      path: '/twoverify', // 二次验证页面
      name: twoverify.name,
      component: twoverify,
      meta: {noEntry: true}
    },
    {
      path: '/un_or_bindphone', // 绑定与解绑手机短信页面
      name: un_or_bindphone.name,
      component: un_or_bindphone
    },
    {
      path: '/register', // 注册页面
      name: register.name,
      component: register,
      meta: {noEntry: true}
    },
    {
      path: '/findpwd', // 找回密码
      name: findPwd.name,
      component: findPwd,
      meta: {noEntry: true}
    },
    {
      path: '/download', // 下载页面
      name: download.name,
      component: download
    },
    {
      path: '/resetpwd',
      name: 'resetpwd',
      component: ResetPwd,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/sendemail/:email',
      name: 'sendemail',
      component: activation,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/activationsuccess',
      name: 'activationsuccess',
      component: activationsuccess,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/withdrawsuccess',
      name: 'withdrawsuccess',
      component: withdrawsuccess,
      meta: {goHome: true}
    },
    {
      path: '/linkinvalid',
      name: 'linkinvalid',
      component: linkinvalid,
      meta: {goHome: true}
    },
    {
      path: '/', name: index.name, component: index,
      redirect:{ name: home.name },
      children:[
        { path: 'home', name:home.name, component: home }, // 首页
        { path: 'icontrading', name:icontrading.name, component: icontrading }, // 币币交易
        { path: 'otc/:tab?', name:otc.name, component: otc }, // otc
        { path: 'wallet', name:wallet.name, component: wallet, meta: {login: true} }, // 钱包
        { path: 'ucenter', name:ucenter.name, component: ucenter, meta: {login: true} } // 我的
      ]},
    /*实名认证*/
    {
      path: '/realname',
      name: realname.name,
      component: realname,
      meta: {login: true}
    },
    /*身份证认证*/
    {
      path: '/realnameInfo',
      name: realnameInfo.name,
      component: realnameInfo,
      meta: {login: true}
    },
    /*其它证件认证*/
    {
      path: '/otherRealnameInfo',
      name: otherRealnameInfo.name,
      component: otherRealnameInfo,
      meta: {login: true}
    },
    /*消息*/
    {
      path: '/msg',
      name: msg.name,
      component: msg,
      meta: {login: true}
    },
    /*关于我们*/
    {
      path: '/about',
      name: about.name,
      component: about,
      meta: {login: true}
    },
    /*帮助中心*/
    {
      path: '/help',
      name: help.name,
      component: help,
      meta: {login: true}
    },
    /*安全中心*/
    {
      path: '/saft',
      name: saft.name,
      component: saft,
      meta: {login: true}
    },
    /*个人中心--商家申请*/
    {
      path: '/merchant_apply',
      name: apply.name,
      component: apply,
      meta: {login: true}
    },
    /*个人中心--商家申请表*/
    {
      path: '/merchant_apply/form',
      name: apply_form.name,
      component: apply_form,
      meta: {login: true}
    },
    /*个人中心--商家申请条款*/
    {
      path: '/apply_legal',
      name: apply_legal.name,
      component: apply_legal,
      meta: {login: true}
    },
    /*个人中心--商家管理*/
    {
      path: '/merchant_manager',
      name: merchant_manager.name,
      component: merchant_manager,
      meta: {login: true}
    },
    /*修改密码*/
    {
      path: '/editPwd',
      name: editPwd.name,
      component: editPwd,
      meta: {login: true}
    },
    /*绑定谷歌认证*/
    {
      path: '/bindgoogle',
      name: bindgoogle.name,
      component: bindgoogle,
      meta: {login: true}
    },
    /*个人中心--首页*/
    {
      path: '/myInfo',
      name: myInfo.name,
      component: myInfo,
      meta: {login: true}
    },
    /*个人中心--设置*/
    {
      path: '/setUp',
      name: setUp.name,
      component: setUp,
      meta: {login: true}
    },
    /*个人中心--语言选择*/
    {
      path: '/language',
      name: language.name,
      component: language,
      meta: {login: true}
    },
    /*个人中心--银行卡收款设置*/
    {
      path: '/bankset',
      name: bankset.name,
      component: bankset,
      meta: {login: true}
    },
    /*个人中心--支付宝收款设置*/
    {
      path: '/payment',
      name: payment.name,
      component: payment,
      meta: {login: true}
    },
    /*个人中心--微信收款设置*/
    {
      path: '/WeChat',
      name: WeChat.name,
      component: WeChat,
      meta: {login: true}
    },
    /*个人中心--PayPal收款设置*/
    {
      path: '/paypal',
      name: paypal.name,
      component: paypal,
      meta: {login: true}
    },
    /*个人中心--收款方式*/
    {
      path: '/payway',
      name: payway.name,
      component: payway,
      meta: {login: true}
    },
    /*个人中心--邀请页*/
    {
      path: '/invite',
      name: invite.name,
      component: invite,
      meta: {login: true}
    },
    /*个人中心--交易记录*/
    {
      path: '/trans-record',
      name: transRecord.name,
      component: transRecord,
      meta: {login: true}
    },
    /*个人中心--交易记录详情*/
    {
      path: '/trans-record-detail/:id',
      name: transDetail.name,
      component: transDetail,
      meta: {login: true}
    },

    /*OTC 相关页面--start*/
    {
      path: '/otc-appeal/:orderNumber',
      name: otcAppeal.name,
      component: otcAppeal,
      meta: {login: true}
    },
    {
      path: '/otc-orderdetail/:orderId',
      name: otcOrderDetail.name,
      component: otcOrderDetail,
      meta: {login: true}
    },
    {
      path: '/otc-chat/:orderId',
      name: otcChat.name,
      component: otcChat,
      meta: {login: true}
    },
    {
      path: '/otc-update/:orderId?',
      name: otcAdUpdate.name,
      component: otcAdUpdate,
      meta: {login: true}
    },
    /*OTC 相关页面--end*/

    /*钱包相关页面--start*/
    {
      path: '/trading/:symbol', // 类型 etc btc
      name: trading.name,
      component: trading,
      meta: {login: true}
    },
    {
      path: '/topup/:symbol', // 充值
      name: topup.name,
      component: topup,
      meta: {login: true}
    },
    {
      path: '/withdrawal/:symbol', // 提现
      name: withdrawal.name,
      component: withdrawal,
      meta: {login: true}
    },

    /*投票挖矿相关页面--end*/
    {
      path: '/vote_mining/index',
      name: voteMiningIndex.name,
      component: voteMiningIndex
    },
    {
      path: '/vote_mining/profit',
      name: voteMiningProfit.name,
      component: voteMiningProfit,
      meta: {login: true}
    },

    /*钱包相关页面--end*/
    {path: "*", redirect: {name: 'index'}} // 未知页面转向首页
  ]
})

/**
 * @desc 全局监听路由变化
 */
router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  store.commit('updateHistoryLength') // 变化时更新路由切换长度
  next()
})

export default router
