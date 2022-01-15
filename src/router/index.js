import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/system/Login.vue'
import Home from '../components/system/Home.vue'
import Welcome from '../components/system/Welcome.vue'
import Repository from '../components/coding/Repository.vue'
import Reporter from '../components/coding/Reporter.vue'
import Analysis from '../components/coding/Analysis.vue'
import Logger from '../components/coding/Logger.vue'
import Menu from '../components/system/Menu.vue'
import Account from '../components/system/Account.vue'
import User from '../components/system/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '系统入口',
    redirect: '/login'
  },
  {
    name: '登录',
    path: '/login',
    component: Login
  },
  {
    name: '主页',
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: '首页',
        path: '/welcome',
        component: Welcome
      }
    ]
  },
  {
    name: '代码统计',
    path: '/coding',
    component: Home,
    children: [
      {
        name: '仓库配置',
        path: 'repository',
        component: Repository
      },
      {
        name: '统计报表',
        path: 'reporter',
        component: Reporter
      },
      {
        name: '统计分析',
        path: 'analysis',
        component: Analysis
      },
      {
        name: '统计日志',
        path: 'logger',
        component: Logger
      }
    ]
  },
  {
    name: '系统管理',
    path: '/system',
    component: Home,
    children: [
      {
        name: '菜单管理',
        path: 'menu',
        component: Menu
      },
      {
        name: '账号管理',
        path: 'account',
        component: Account
      },
      {
        name: '用户管理',
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
