import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/system/Login.vue'
import Home from '../views/system/Home.vue'
import Activity from '../views/coding/Activity.vue'
import Graph from '../views/coding/Graph.vue'
import Repository from '../views/coding/Repository.vue'
import Reporter from '../views/coding/Reporter.vue'
import Analysis from '../views/coding/Analysis.vue'
import AnalysisRepository from '../views/coding/analysis/AnalysisRepository.vue'
import AnalysisBranch from '../views/coding/analysis/AnalysisBranch.vue'
import AnalysisAuthor from '../views/coding/analysis/AnalysisAuthor.vue'
import Logger from '../views/coding/Logger.vue'
import Author from '../views/coding/Author.vue'
import Menu from '../views/system/Menu.vue'
import Account from '../views/system/Account.vue'
import User from '../views/system/User.vue'
import SystemLogger from '../views/system/Logger.vue'

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
    name: '首页',
    path: '/home',
    component: Home,
    redirect: '/home/top',
    children: [
      {
        name: '代码动态',
        path: 'top',
        component: Activity
      },
      {
        name: 'Git Graph',
        path: 'graph',
        component: Graph
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
        component: Analysis,
        children: [
          {
            name: '仓库统计',
            path: 'repository',
            component: AnalysisRepository
          },
          {
            name: '分支统计',
            path: 'branch',
            component: AnalysisBranch
          },
          {
            name: '作者统计',
            path: 'author',
            component: AnalysisAuthor
          }
        ]
      },
      {
        name: '作者关联',
        path: 'author',
        component: Author
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
      },
      {
        name: '系统日志',
        path: 'logger',
        component: SystemLogger
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
