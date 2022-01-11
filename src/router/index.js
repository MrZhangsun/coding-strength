import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Auto redirect to login if not login',
    redirect: '/login'
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Home',
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
