import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/public'
import exchange from './exchange'
import otc from './otc'
import cms from './cms'
import login from '@/public/login'
import register from '@/public/register'
import findpwd from '@/public/findpwd'
import acm from '@/public/acm'
import Market from '@/public/market'
import Withdrawsuccess from '@/public/email/withdrawsuccess'
import Linkinvalid from '@/public/email/linkinvalid'
import mycenter from '@/public/mycenter'
import Activation from '@/public/email/activation'
import Activationsuccess from '@/public/email/activationsuccess'
import account from '../public/account'
import error from '../public/error'
import success from '../public/success'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index
    },
    {
      path: '/acm',
      name: 'acm',
      component: acm
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {noEntry: true}
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/findpwd',
      name: 'findpwd',
      component: findpwd,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/sendemail/:email',
      name: 'sendemail',
      component: Activation,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/activationsuccess',
      name: 'activationsuccess',
      component: Activationsuccess,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/withdrawsuccess',
      name: 'withdrawsuccess',
      component: Withdrawsuccess,
      meta: {goHome: true}
    },
    {
      path: '/linkinvalid',
      name: 'linkinvalid',
      component: Linkinvalid,
      meta: {goHome: true}
    },
    {
      path: '/mycenter',
      name: 'mycenter',
      component: mycenter,
      meta: {login: true}
    },
    {
      path: '/mycenter/:menu',
      name: 'mycenter_menu',
      component: mycenter,
      meta: {login: true}
    },
    {
      path: '/account',
      name: 'account',
      component: account,
      meta: {login: true}
    },
    {
      path: '/account/:menu',
      name: 'account_menu',
      component: account,
      meta: {login: true}
    },
    {
      path: '/market',
      name: 'market',
      component: Market
    },
    {
      path: '/error',
      name: 'error',
      component: error
    },
    {
      path: '/success',
      name: 'success',
      component: success
    },
    {
      path: '*',
      redirect: {
        name: 'home'
      }
    }
  ].concat(exchange, otc, cms)
})
