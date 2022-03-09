<template>
  <div>
    <div class="chart-condition">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select
            v-model="conditions.top"
            clearable
            placeholder="请选择前几名"
            @clear="clearToSelect"
            @change="getData"
          >
            <el-option
              v-for="item in topOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            :picker-options="statisticTimeRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @click="getData"
            @clear="getData"
            @change="getData"
            align="right"
          >
          </el-date-picker>
        </el-col>
      </el-row>
    </div>
    <div class="chart-container">
      <div class="chart-unit">
        <h3 class="chart-title">仓库排名 TOP{{this.conditions.top + ''}}</h3>
        <div
          id="active-repository"
          class="row-chart"
        ></div>
      </div>
      <div class="chart-unit">
        <h3 class="chart-title">分支排名 TOP{{this.conditions.top + ''}}</h3>
        <div
          id="active-branch"
          class="row-chart"
        ></div>
      </div>
      <div class="chart-unit">
        <h3 class="chart-title">作者排名 TOP{{this.conditions.top + ''}}</h3>
        <div
          id="active-author"
          class="row-chart"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { repositoryTop, branchTop, authorTop } from '../../api/coding/rank'
import moment from 'moment'
let activeRepositoryChart
let activeBranchChart
let activeAuthorChart

export default {
  created () {
    // 默认值
    this.conditions.top = 10
    // 上一个月
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    const current = new Date()
    // 格式化
    const lastMonthtStr = moment(lastMonth).format('YYYY-MM-DD hh:mm:ss')
    const currentStr = moment(current).format('YYYY-MM-DD hh:mm:ss')

    this.conditions.endTime = currentStr
    this.conditions.startTime = lastMonthtStr
    this.dateTimePicker[0] = this.conditions.startTime
    this.dateTimePicker[1] = this.conditions.endTime
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
      this.screenHeight = window.innerHeight
      const resize = {
        width: this.screenWidth,
        height: this.screenHeight
      }
      activeRepositoryChart.resize(resize)
      activeBranchChart.resize(resize)
      activeAuthorChart.resize(resize)
    })
    // 点击事件
    activeRepositoryChart.on('click', (params) => {
      this.$router.push('/coding/repository')
    })
  },
  data () {
    return {
      conditions: {
        top: 10,
        startTime: '2021-01-01 00:00:00',
        endTime: '2023-01-01 00:00:0'
      },
      dateTimePicker: [],
      topOptions: [{
        value: 10,
        label: '前10名(默认)'
      }, {
        value: 30,
        label: '前30名'
      }, {
        value: 50,
        label: '前50名'
      }, {
        value: 100,
        label: '前100名'
      }, {
        value: 150,
        label: '前150名'
      }, {
        value: 200,
        label: '前200名'
      }, {
        value: 1000,
        label: '前1000名'
      }],
      statisticTimeRange: {
        shortcuts: [{
          text: '上一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上一个季度',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      screenWidth: 0,
      screenHeight: 0,
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
        yAxis: {},
        xAxis: { type: 'category' },
        series: [
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            realtime: true,
            start: 30,
            end: 70,
            top: 20
          }
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
            ['分支', '提交数量', '作者数量', '文件数量', '代码行数']
          ]
        },
        yAxis: {},
        xAxis: { type: 'category' },
        series: [
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            realtime: true,
            start: 30,
            end: 70,
            top: 20
          }
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
            ['作者', '提交总数', '添加行数', '移除行数', '代码行数', '影响文件']
          ]
        },
        yAxis: {},
        xAxis: { type: 'category' },
        series: [
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          },
          {
            type: 'bar',
            barWidth: 20
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            realtime: true,
            start: 30,
            end: 70,
            top: 20
          }
        ]
      }
    }
  },
  methods: {
    getData () {
      if (this.dateTimePicker && this.dateTimePicker[0] && this.dateTimePicker[1]) {
        this.conditions.startTime = this.dateTimePicker[0]
        this.conditions.endTime = this.dateTimePicker[1]
      } else {
        this.conditions.startTime = '2000-01-01 00:00:00'
        this.conditions.endTime = '2023-01-01 00:00:00'
      }
      if (!this.conditions.top) {
        this.conditions.top = 10
      }

      // 查询仓库信息
      repositoryTop(this.conditions)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          // 清空上次的结果
          const length = this.activeRepositoryOptions.dataset.source.length
          if (length > 1) {
            this.activeRepositoryOptions.dataset.source.splice(1, length - 1)
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
      branchTop(this.conditions)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          // 清空上次的结果
          const length = this.activeBranchOptions.dataset.source.length
          if (length > 1) {
            this.activeBranchOptions.dataset.source.splice(1, length - 1)
          }

          res.data.forEach(element => {
            const branch = []
            branch[0] = element.name
            branch[1] = element.totalCommits
            branch[2] = element.totalAuthors
            branch[3] = element.totalFiles
            branch[4] = element.totalLineOfCode
            this.activeBranchOptions.dataset.source.push(branch)
          })
          // 从新绘制图表
          activeBranchChart.setOption(this.activeBranchOptions)
        })
      authorTop(this.conditions)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          // 清空上次的结果
          const length = this.activeAuthorOptions.dataset.source.length
          if (length > 1) {
            this.activeAuthorOptions.dataset.source.splice(1, length - 1)
          }

          res.data.forEach(element => {
            const author = []
            author[0] = element.account
            author[1] = element.totalCommits
            author[2] = element.totalAddLines
            author[3] = element.totalRemoveLines
            author[4] = element.totalSaveLines
            author[5] = element.totalChangeFiles
            this.activeAuthorOptions.dataset.source.push(author)
          })
          // 从新绘制图表
          activeAuthorChart.setOption(this.activeAuthorOptions)
        })
    },
    clearToSelect (e) {
      console.log('clear')
    }
  }
}
</script>
<style lang="less" scoped>
.row-chart {
  width: 100%;
  height: 800px;
}
</style>
