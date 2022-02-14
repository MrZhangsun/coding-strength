<template>
  <div>
    <h3>统计仓库分支、作者、天数、活跃天数</h3>
    <div
      id="repository"
      class="row-chart"
    ></div>
    <h3>今日活跃仓库TOP5</h3>
    <div
      id="active-repository"
      class="row-chart"
    ></div>
    <h3>今日活跃分支TOP5</h3>
    <div
      id="active-branch"
      class="row-chart"
    ></div>
    <h3>今日活跃AUTHOR TOP5</h3>
    <div
      id="active-author"
      class="row-chart"
    ></div>
    <h3>仓库增长趋势</h3>
    <div
      id="active-author"
      class="row-chart"
    ></div>
  </div>
</template>
<script>
import { repositoryTop, branchTop, authorTop } from '../../api/coding/activity'
let repositoryStatisticChart
let activeRepositoryChart
// let chart2
export default {
  created () {
    this.getData()
  },
  destroyed () {
    // 销毁组建,防止内存泄漏
    // repositoryStatisticChart.dispose()
    // activeRepositoryChart.dispose()
  },
  mounted () {
    repositoryStatisticChart = this.$echarts.init(document.getElementById('repository'), 'infographic')
    activeRepositoryChart = this.$echarts.init(document.getElementById('active-repository'), 'infographic')
    // 使用刚指定的配置项和数据显示图表。
    repositoryStatisticChart.setOption(this.repositoryOptions)
    activeRepositoryChart.setOption(this.activeRepositoryOptions)
    // 监听页面尺寸变化事件, 动态修改图表尺寸
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth
      repositoryStatisticChart.resize()
      activeRepositoryChart.resize()
    })
    repositoryStatisticChart.on('click', (params) => {
      this.$router.push('/coding/repository')
    })
  },
  data () {
    return {
      activeRepositoryOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        dataset: {
          source: [
            ['system', 'Commits'],
            ['业务系统', 3],
            ['中台', 4],
            ['接口中心', 3],
            ['公共', 1],
            ['工具', 3]
          ]
        },
        series: [
          {
            type: 'bar'
          }
        ]
      },
      repositoryOptions: {
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
          source: []
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
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
      repositoryTop(params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          const title = ['system', '分支数量', '开发者数量', '库龄', '活跃天数']
          this.repositoryOptions.dataset.source.push(title)
          this.repositoryOptions.dataset.source.push(res.data)
        })
      authorTop(params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
        })
      branchTop(params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
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
