<template>
  <div>
    <div class="chart-unit">
      <h3 class="chart-title">今日活跃仓库TOP5</h3>
      <div>
        参数选择区
      </div>
      <div
        id="active-repository"
        class="row-chart"
      ></div>
    </div>
    <div class="chart-unit">
      <h3 class="chart-title">今日活跃分支TOP5</h3>
      <div>
        参数选择区
      </div>
      <div
        id="active-branch"
        class="row-chart"
      ></div>
    </div>
    <div class="chart-unit">
      <h3 class="chart-title">今日活跃作者TOP5</h3>
      <div>
        参数选择区
      </div>
      <div
        id="active-author"
        class="row-chart"
      ></div>
    </div>
  </div>
</template>
<script>
import { repositoryTop, branchTop, authorTop } from '../../api/coding/activity'

let activeRepositoryChart
let activeBranchChart
let activeAuthorChart
// let chart2
export default {
  created () {
    this.getData()
  },
  destroyed () {
    // 销毁组建,防止内存泄漏
    activeRepositoryChart.dispose()
    activeBranchChart.dispose()
    activeAuthorChart.dispose()
  },
  mounted () {
    activeRepositoryChart = this.$echarts.init(document.getElementById('active-repository'), 'infographic')
    activeBranchChart = this.$echarts.init(document.getElementById('active-branch'), 'infographic')
    activeAuthorChart = this.$echarts.init(document.getElementById('active-author'), 'infographic')
    // 使用刚指定的配置项和数据显示图表。
    activeRepositoryChart.setOption(this.activeRepositoryOptions)
    activeBranchChart.setOption(this.activeBranchOptions)
    activeAuthorChart.setOption(this.activeAuthorOptions)
    // 监听页面尺寸变化事件, 动态修改图表尺寸
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth
      activeRepositoryChart.resize()
      activeBranchChart.resize()
      activeAuthorChart.resize()
    })
    // 点击事件
    activeRepositoryChart.on('click', (params) => {
      this.$router.push('/coding/repository')
    })
  },
  data () {
    return {
      activeRepositoryOptions: {
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          right: 'center',
          bottom: 0,
          top: 'bottom',
          backgroundColor: '#ccc'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataset: {
          source: [
            ['系统', '分支数量', '开发者数量', '库龄', '活跃天数']
          ]
        },
        xAxis: {},
        yAxis: { type: 'category' },
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      },
      activeBranchOptions: {
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          right: 'center',
          bottom: 0,
          top: 'bottom',
          backgroundColor: '#ccc'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataset: {
          source: [
            ['分支', 'Commit数量']
          ]
        },
        xAxis: {},
        yAxis: { type: 'category' },
        series: [
          { type: 'bar' }
        ]
      },
      activeAuthorOptions: {
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          right: 'center',
          bottom: 0,
          top: 'bottom',
          backgroundColor: '#ccc'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataset: {
          source: [
            ['作者', '代码行数']
          ]
        },
        xAxis: {},
        yAxis: { type: 'category' },
        series: [
          { type: 'bar' }
        ]
      }
    }
  },
  methods: {
    getData () {
      const params = {
        top: 6,
        startTime: '2021-01-01 00:00:00',
        endTime: '2023-01-01 00:00:0'
      }
      // 查询仓库信息
      repositoryTop(params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          res.data.forEach(element => {
            const repository = []
            repository[0] = element.name
            repository[1] = element.totalBranches
            repository[2] = element.totalAuthors
            repository[3] = element.totalAge
            repository[4] = element.activeAge
            this.activeRepositoryOptions.dataset.source.push(repository)
          })
          // 从新绘制图表
          activeRepositoryChart.setOption(this.activeRepositoryOptions)
        })
      branchTop(params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          res.data.forEach(element => {
            const branch = []
            console.log(element)
            branch[0] = element.name
            branch[1] = element.totalCommits
            this.activeBranchOptions.dataset.source.push(branch)
          })
          // 从新绘制图表
          activeBranchChart.setOption(this.activeBranchOptions)
        })
      authorTop(params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          res.data.forEach(element => {
            const author = []
            console.log(element)
            author[0] = element.account
            author[1] = element.totalLine
            this.activeAuthorOptions.dataset.source.push(author)
          })
          // 从新绘制图表
          activeAuthorChart.setOption(this.activeAuthorOptions)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.row-chart {
  widows: 100%;
  height: 400px;
}
</style>
