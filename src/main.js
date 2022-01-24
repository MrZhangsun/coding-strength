import Vue from 'vue'
import 'default-passive-events'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './fonts/iconfont.js'
import Validator from './utils/validator.js'
import axios from 'axios'
import { Loading } from 'element-ui'
import * as echarts from 'echarts'

// 配置echarts
Vue.prototype.$echarts = echarts
// 配置http请求
axios.defaults.baseURL = 'http://localhost:10110/api/'
let loading = null
const loadingSwitch = false
const loadOption = {
  fullscreen: true,
  lock: true,
  text: '拼命加载中......',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.5)'
}

// HTTP认证拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  if (loadingSwitch) {
    loading = Loading.service(loadOption)
  }

  return config
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (loading != null) {
    loading.close()
  }
  return response
},
function (error) {
  if (loading != null) {
    loading.close()
  }
  return Promise.reject(error)
})

Vue.prototype.$http = axios
Vue.prototype.Validator = Validator
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
