import axios from 'axios'
import JsCookies from 'js-cookie'
import config from '@/assets/js/config'
import userApi from './user'
import Vue from 'vue'

const DOMAIN = process.env.NODE_ENV === 'development' ? `http://${config.domain}:80/` : '/'

axios.defaults.baseURL = DOMAIN
axios.defaults.timeout = 100000


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  var apiToken = JsCookies.get('api_token')
  let lang = localStorage.getItem('lang') || 'en'
  apiToken && (config.headers.common['api_token'] = apiToken)
  config.headers.common['uuid'] = userApi.uuid
  config.headers.common['lang'] = lang

  // 在发送请求之前做些什么
  // Vue.$ajaxLoading()
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

function requireLogin(response) {
  console.error(response.config.url)
  //console.log('用户不存在，退出登录')
  // 用户不存在，退出登录
  window.localStorage.removeItem('userInfo')
  JsCookies.remove('api_token')
  Vue.$confirmDialog({
    id: 'please_login_again',
    showCancel: false,
    content: window.$i18n.t(`error_code.LOGIN_AGAIN`), // 请重新登录
    okCallback: () => {
      window.vm.$router.push({name:'login'})
      window.location.reload()
    }
  })
}

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // Vue.$ajaxLoading().close()
  if (typeof response.data === 'string') {
    let error = {response: response}
    return Promise.reject(error)
  }
  if ((response.data && response.data.rst === 401) || response.status === 403 || response.status === 401) {
    requireLogin(response);
    return null
  }
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  console.error(error)
  let response = error.response;
  if (response.status === 403 || response.status === 401) {
    requireLogin(response);
  }
  if (response.status === 500 && typeof response.data === "string" && response.data.toLowerCase.indexOf("token") >= 0) {
    requireLogin(response);
  } else if(response.status === 500){
     Vue.$koallTipBox({icon: 'notification', message: window.$i18n.t(`error_code.server_deserted`)})
    return Promise.resolve('')
  }

  return Promise.reject(error)
})

let api = {}
api.domain = DOMAIN

const get = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.get(url, {
    params: data
  }).then((res) => {
    if (!res) {
      return
    }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.get = get

const post = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.post(url, data).then((res) => {
    if (!res) {
      return
    }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.post = post

const del = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.delete(url, {
    data: data
  }).then((res) => {
    if (!res) {
      return
    }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.delete = del

const put = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.put(url, data).then((res) => {
    if (!res) {
      return
    }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.put = put

const postForm = function (url, data, success, error) {
  if (typeof data === 'function') {
    error = success
    success = data
    data = {}
  }
  axios.post(url, data).then((res) => {
    if (!res) {
      return
    }
    success && success(res.data)
  }).catch((res) => {
    console.warn(res)
    error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res)
  })
}
api.postForm = postForm

export default api
