import Vue from 'vue'
import Loading from './loading'
import utils from '@/assets/js/utils'

window.$ajaxLoading = function (opts) {
  opts = opts || {}
  if (!opts.id) {
    opts.id = 'loading'
  }
  if (opts.id && document.getElementById(opts.id)) {
    return
  }
  utils.setDialog(Loading, {show: true}, opts)
}

window.$loadingClose = function (opt) {
  utils.setDialog(Loading, {show: false})
}

// export default Loading
