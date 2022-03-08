import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/system/Login'
import Home from '../views/system/Home'
import Rank from '../views/coding/Rank'
import Graph from '../views/coding/Graph'
import Repository from '../views/coding/Repository'
import Reporter from '../views/coding/Reporter'
import Analysis from '../views/coding/Analysis'
import Inspect from '../views/coding/Inspect'
import AnalysisRepository from '../views/coding/analysis/AnalysisRepository'
import AnalysisBranch from '../views/coding/analysis/AnalysisBranch'
import AnalysisAuthor from '../views/coding/analysis/AnalysisAuthor'
import Logger from '../views/coding/Logger'
import Author from '../views/coding/Author'
import Menu from '../views/system/Menu'
import Account from '../views/system/Account'
import User from '../views/system/User'
import SystemLogger from '../views/system/Logger'
import Feedback from '../views/release/Feedback'
import History from '../views/release/History'
import Investigation from '../views/release/Investigation'
import Statistic from '../views/performance/Statistic'
import Indicator from '../views/performance/Indicator'
import PerformanceReporter from '../views/performance/PerformanceReporter'

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
    redirect: '/home/rank',
    children: [
      {
        name: '排名动态',
        path: 'rank',
        component: Rank
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
        name: '代码检视',
        path: 'inspect',
        component: Inspect
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
    name: '版本统计',
    path: '/release',
    component: Home,
    children: [
      {
        name: '发布历史',
        path: 'history',
        component: History
      },
      {
        name: '业务反馈',
        path: 'feedback',
        component: Feedback
      },
      {
        name: '调研报告',
        path: 'investigation',
        component: Investigation
      }
    ]
  },
  {
    name: '绩效管理',
    path: '/performance',
    component: Home,
    children: [
      {
        name: '考核指标',
        path: 'indicator',
        component: Indicator
      },
      {
        name: '绩效统计',
        path: 'statistic',
        component: Statistic
      },
      {
        name: '绩效报告',
        path: 'reporter',
        component: PerformanceReporter
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

  if (to.path.startsWith('/api')) {
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
