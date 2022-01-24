<template>
  <div>
    <h3> Welcome to Coding Strength</h3>
    <h3> 当日、本周、本月、本季度统计图</h3>
    <h3> 活跃仓库, 活跃分支</h3>
    <h3> 活跃Author</h3>

    <div
      id="main"
      style="width: 600px;height:400px;"
    ></div>
  </div>
</template>
<script>
export default {
  mounted () {
    this.draw()
  },
  data () {
    return {
      options: {

      }
    }
  },
  methods: {
    draw () {
      const myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
