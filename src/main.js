import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import echarts from 'echarts'
import '@/styles/index.scss' // global css
import '@/assets/styles.css'
import Axios from 'axios'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
// import '@/permission' // permission control
// 工具方法
import {
  get, Format, post, uploadFile, copy, dateTimeFormat, formatDate, uploadMoreFile, previewing, downloadFile, downloadExcel, showSuccess, getUserInfo, dispatchEventStroage
} from './assets/common/service.js'
import {Message } from 'element-ui'

import Table from '@/components/Table'
import imageModal from '@/components/imageModal'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'

import 'quill/dist/quill.snow.css'

import 'quill/dist/quill.bubble.css'
import * as qiniu from 'qiniu-js'

Vue.use(qiniu)
Vue.use(VueQuillEditor)
Vue.use(dispatchEventStroage)
Vue.component('Table', Table)
Vue.component('imageModal', imageModal)
// set ElementUI lang to EN
Vue.use(ElementUI)

Vue.prototype.get = get
Vue.prototype.post = post
Vue.prototype.getUserInfo = getUserInfo
Vue.prototype.uploadFile = uploadFile
Vue.prototype.uploadMoreFile = uploadMoreFile
Vue.prototype.copy = copy
Vue.prototype.formatDate = formatDate
Vue.prototype.dateTimeFormat = dateTimeFormat
Vue.prototype.showSuccess = showSuccess
Vue.prototype.$Message = Message
// Vue.prototype.$Spin = Spin
// Vue.prototype.$Modal = Modal
// Vue.prototype.decimal = decimal
// Vue.config.productionTip = false
Vue.prototype.Format = Format
Vue.prototype.previewing = previewing
Vue.prototype.downloadFile = downloadFile
Vue.prototype.downloadExcel = downloadExcel

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
