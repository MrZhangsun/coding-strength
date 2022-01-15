import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/system/Login.vue'
import Home from '../components/system/Home.vue'
import Welcome from '../components/system/Welcome.vue'
import User from '../components/system/User.vue'

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'Welcome',
        path: '/welcome',
        component: Welcome
      },
      {
        name: 'User',
        path: 'user',
        component: User
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由访问拦截器
router.beforeEach((to, from, next) => {
  // to : 将要访问的路径
  // from: 从哪个页面来
  // next: 放行
  if (to.path === '/login') {
    return next()
  }

  // 拦截认证
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }

  // 放行
  next()
})
export default router
