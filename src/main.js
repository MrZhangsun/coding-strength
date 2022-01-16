import Vue from 'vue'
import 'default-passive-events'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './fonts/iconfont.js'
import Validator from './utils/validator.js'
import axios from 'axios'

// 配置http请求
axios.defaults.baseURL = 'http://localhost:10110/api/'

// HTTP认证拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.Validator = Validator
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
