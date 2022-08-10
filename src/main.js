import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './plugins/clipboard'
import './assets/css/global.css'
import './fonts/iconfont.js'
import './fonts/iconfont.css'
import Validator from './utils/validator'
import axios from 'axios'
import { Loading } from 'element-ui'
import * as echarts from 'echarts'
import moment from 'moment'
import baseURL from './config/baseUrl'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll)

/**
 * 全局日期格式化
 */
Vue.prototype.moment = moment
Vue.filter('dateFormat', (dateStr, pattern = 'YYYY-MM-DD hh:mm:ss') => {
  if (dateStr) {
    return moment(dateStr).format(pattern)
  }
  return dateStr
})

/**
 * 内容宽度过滤器,超过款对, 显示省略号
 * @param value 需要处理的文本
 * @param limit 需要限制的字符长度
 */
Vue.filter('contentLimit', function (value, limit) {
  if (!value) {
    return ''
  }
  if (value.length <= limit - 3) {
    return value
  }
  return value.slice(0, limit) + '...'
})

/**
 * 配置echarts
 */
Vue.prototype.$echarts = echarts

/**
 * 配置http请求
 */
axios.defaults.baseURL = baseURL
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
