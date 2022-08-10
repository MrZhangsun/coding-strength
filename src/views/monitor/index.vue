<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>指标</el-breadcrumb-item>
      <el-breadcrumb-item>指标监控</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClickActive(activeName)">
        <template v-for="(item,index) in tabPaneDataList">
          <el-tab-pane :key="index" :label="item.key" :name="item.key">
            <div v-if="item.value">
              <el-tabs v-model="activeNameType" tab-position="left" @tab-click="handleClick">
                <template v-for="(items,indexs) in (item.value)">
                  <el-tab-pane :key="indexs" :label="items.indicatorName" :name="items.id + ''" :lazy="true">
                    <div class="selectClass" v-if="items.dimensionShow == 1">
                      <el-radio-group v-model="valueDate" @change="radioChange(items,valueDate)">
                        <el-radio-button v-for="(i,index) in options" :key="index" :label="i.label">
                          {{ i.name }}
                        </el-radio-button>
                      </el-radio-group>
                    </div>
                    <div v-loading="loading">
                      <div :id="`chart${items.indicatorName}`" style="width:100%;height:500px;"></div>
                    </div>
                  </el-tab-pane>
                </template>
              </el-tabs>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  indicators,
  indicatorId,
  indicatorIdBar,
  indicatorIdPie
} from '../../api/monitor/index'
export default {
  data () {
    return {
      activeName: '0',
      chartDomDefault: '',
      chartDomColumn: '',
      chartCircular: '',
      activeNameType: 'broken',
      // 单选框模式的筛选条件
      valueDate: '',
      options: [{
        label: 'DAY',
        name: '日'
      }, {
        label: 'WEEK',
        name: '周'
      }, {
        label: 'MONTH',
        name: '月'
      }, {
        label: 'SEASON',
        name: '季'
      }, {
        label: 'YEAR',
        name: '年'
      }, {
        label: 'clear',
        name: '重置'
      }],
      // 日期范围模式的筛选条件
      dateTime: '',
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一年',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tabPaneData: [
        {
          name: '0',
          label: '客服系统',
          tabPaneNextData: [
            {
              name: 'broken',
              label: '映射管理增量',
              chartType: 'broken',
              option: {
                timeline: {
                  data: [1, 2, 3, 4],
                  label: {
                    formatter: function (s) { return '第' + s + '页' }
                  },
                  autoPlay: false,
                  playInterval: 1000,
                  tooltip: { formatter: function (s) { return '第' + s.value + '页' } }
                },
                title: {
                  text: 'Stacked Line'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                },
                grid: {
                  y2: 80
                },
                calculable: true,
                toolbox: {
                  feature: {
                    saveAsImage: {}
                  }
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: 'Email',
                    type: 'line',
                    stack: 'Total',
                    data: [120, 132, 101, 134, 90, 230, 210]
                  },
                  {
                    name: 'Union Ads',
                    type: 'line',
                    stack: 'Total',
                    data: [220, 182, 191, 234, 290, 330, 310]
                  },
                  {
                    name: 'Video Ads',
                    type: 'line',
                    stack: 'Total',
                    data: [150, 232, 201, 154, 190, 330, 410]
                  },
                  {
                    name: 'Direct',
                    type: 'line',
                    stack: 'Total',
                    data: [320, 332, 301, 334, 390, 330, 320]
                  },
                  {
                    name: 'Search Engine',
                    type: 'line',
                    stack: 'Total',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                  }
                ]
              }
            },
            {
              name: 'never',
              label: '测试增量',
              chartType: 'broken',
              option: {
                xAxis: {},
                yAxis: {},
                series: [
                  {
                    symbolSize: 20,
                    data: [
                      [10.0, 8.04],
                      [8.07, 6.95],
                      [13.0, 7.58],
                      [9.05, 8.81],
                      [11.0, 8.33],
                      [14.0, 7.66],
                      [13.4, 6.81],
                      [10.0, 6.33],
                      [14.0, 8.96],
                      [12.5, 6.82],
                      [9.15, 7.2],
                      [11.5, 7.2],
                      [3.03, 4.23],
                      [12.2, 7.83],
                      [2.02, 4.47],
                      [1.05, 3.33],
                      [4.05, 4.96],
                      [6.03, 7.24],
                      [12.0, 6.26],
                      [12.0, 8.84],
                      [7.08, 5.82],
                      [5.02, 5.68]
                    ],
                    type: 'scatter'
                  }
                ]
              }
            },
            {
              name: 'circular',
              label: 'lsiting管理增量',
              chartType: 'circular',
              option: {
                color: ['#5470C6', '#91CC75', '#EE6666'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross'
                  }
                },
                grid: {
                  right: '20%'
                },
                toolbox: {
                  feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                  }
                },
                legend: {
                  data: ['Evaporation', 'Precipitation', 'Temperature']
                },
                xAxis: [
                  {
                    type: 'category',
                    axisTick: {
                      alignWithLabel: true
                    },
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: 'Evaporation',
                    position: 'right',
                    alignTicks: true,
                    axisLine: {
                      show: true,
                      lineStyle: {
                        color: '#5470C6'
                      }
                    },
                    axisLabel: {
                      formatter: '{value} ml'
                    }
                  },
                  {
                    type: 'value',
                    name: 'Precipitation',
                    position: 'right',
                    alignTicks: true,
                    offset: 80,
                    axisLine: {
                      show: true,
                      lineStyle: {
                        color: '#5470C6'
                      }
                    },
                    axisLabel: {
                      formatter: '{value} ml'
                    }
                  },
                  {
                    type: 'value',
                    name: '温度',
                    position: 'left',
                    alignTicks: true,
                    axisLine: {
                      show: true,
                      lineStyle: {
                        color: '#5470C6'
                      }
                    },
                    axisLabel: {
                      formatter: '{value} °C'
                    }
                  }
                ],
                series: [
                  {
                    name: 'Evaporation',
                    type: 'bar',
                    data: [
                      2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                    ]
                  },
                  {
                    name: 'Precipitation',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: [
                      2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                    ]
                  },
                  {
                    name: 'Temperature',
                    type: 'line',
                    yAxisIndex: 2,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                  }
                ]
              }
            },
            {
              name: 'column',
              label: 'review增量',
              chartType: 'column',
              option: {
                title: {
                  text: 'Referer of a Website',
                  subtext: 'Fake Data',
                  left: 'center'
                },
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [
                  {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: [
                      { value: 1048, name: 'Search Engine' },
                      { value: 735, name: 'Direct' },
                      { value: 580, name: 'Email' },
                      { value: 484, name: 'Union Ads' },
                      { value: 300, name: 'Video Ads' }
                    ],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          name: '1',
          label: '刊登系统',
          tabPaneNextData: [
            {
              name: 'edit',
              label: '映射管理增量',
              chartType: 'broken',
              option: {
                title: {
                  text: 'Referer of a Website',
                  subtext: 'Fake Data',
                  left: 'center'
                },
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [
                  {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: [
                      { value: 1048, name: 'Search Engine' },
                      { value: 735, name: 'Direct' },
                      { value: 580, name: 'Email' },
                      { value: 484, name: 'Union Ads' },
                      { value: 300, name: 'Video Ads' }
                    ],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }
            },
            {
              name: 'add',
              label: '测试增量',
              chartType: 'broken',
              option: {
                xAxis: {},
                yAxis: {},
                series: [
                  {
                    symbolSize: 20,
                    data: [
                      [10.0, 8.04],
                      [8.07, 6.95],
                      [13.0, 7.58],
                      [9.05, 8.81],
                      [11.0, 8.33],
                      [14.0, 7.66],
                      [13.4, 6.81],
                      [10.0, 6.33],
                      [14.0, 8.96],
                      [12.5, 6.82],
                      [9.15, 7.2],
                      [11.5, 7.2],
                      [3.03, 4.23],
                      [12.2, 7.83],
                      [2.02, 4.47],
                      [1.05, 3.33],
                      [4.05, 4.96],
                      [6.03, 7.24],
                      [12.0, 6.26],
                      [12.0, 8.84],
                      [7.08, 5.82],
                      [5.02, 5.68]
                    ],
                    type: 'scatter'
                  }
                ]
              }
            }
          ]
        },
        {
          name: '2',
          label: '广告系统',
          tabPaneNextData: []
        },
        {
          name: '3',
          label: '图片工作台',
          tabPaneNextData: []
        },
        {
          name: '4',
          label: '优惠卷系统',
          tabPaneNextData: []
        }
      ],
      tabPaneDataList: []
    }
  },
  destroyed () {
  },
  mounted () {
    this.getMainData()
  },
  methods: {
    radioChange (i, e) {
      if (e === 'clear') {
        if (i.chartType === 1) {
          indicatorId((i.id))
            .then(res => {
              const arr = res.data
              if (arr) {
                this.initChartList(arr, i.indicatorName)
              }
            })
        }
        if (i.chartType === 2) {
          indicatorIdPie((i.id))
            .then(res => {
              const arr = res.data
              if (arr) {
                this.initChartList(arr, i.indicatorName)
              }
            })
        }
        if (i.chartType === 3) {
          indicatorIdBar((i.id))
            .then(res => {
              const arr = res.data
              if (arr) {
                this.initChartList(arr, i.indicatorName)
              }
            })
        }
      } else {
        if (i.chartType === 1) {
          const data = {
            dimension: e,
            indicatorId: i.id,
            pageSize: 10,
            currentPageMaxId: ''
          }
          indicatorId((i.id), data)
            .then(res => {
              const arr = res.data
              if (arr) {
                this.initChartList(arr, i.indicatorName)
              }
            })
        }
        if (i.chartType === 2) {
          const data = {
            dimension: e,
            indicatorId: i.id,
            pageSize: 10,
            currentPageMaxId: ''
          }
          indicatorIdPie((i.id), data)
            .then(res => {
              const arr = res.data
              if (arr) {
                this.initChartList(arr, i.indicatorName)
              }
            })
        }
        if (i.chartType === 3) {
          const data = {
            dimension: e,
            indicatorId: i.id,
            pageSize: 10,
            currentPageMaxId: ''
          }
          indicatorIdBar((i.id), data)
            .then(res => {
              const arr = res.data
              if (arr) {
                this.initChartList(arr, i.indicatorName)
              }
            })
        }
      }
    },
    getMainData () {
      indicators()
        .then(res => {
          this.tabPaneDataList = res.data
        })
    },
    getindicatorId (e, o) {
      indicatorId(e)
        .then(res => {
          const arr = res.data
          if (arr) {
            this.initChartList(arr, o)
          }
        })
    },
    getindicatorIdBar (e, o) {
      indicatorIdBar(e)
        .then(res => {
          const arr = res.data
          if (arr) {
            this.initChartList(arr, o)
          }
        })
    },
    getindicatorIdPie (e, o) {
      indicatorIdPie(e)
        .then(res => {
          const arr = res.data
          if (arr) {
            this.initChartList(arr, o)
          }
        })
    },
    dateTimeFocus () {
      this.loading = false
    },
    dateTimeChange () {
      this.loading = true
      if ((this.dateTime).length > 0) {
        this.loading = false
      }
    },
    initChartList (arrs, name) {
      this.$nextTick(() => {
        setTimeout(() => {
          const arr = this.tabPaneDataList
          arr.forEach((q, w) => {
            if ((q.value).length > 0) {
              (q.value).forEach((i, o) => {
                if (name === i.indicatorName) {
                  const myChart = this.$echarts.init(document.getElementById(`chart${i.indicatorName}`))
                  q.value[o].option = arrs
                  if (i.chartType === 1 || i.chartType === 3) {
                    q.value[o].option.dataZoom = [
                      {
                        width: '15',
                        type: 'slider',
                        show: false,
                        xAxisIndex: [0],
                        left: 33,
                        bottom: 40,
                        height: 20,
                        start: 0,
                        showDataShadow: false,
                        showDetail: false,
                        end: 50
                      },
                      {
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 0.25
                      }
                    ]
                  } else if (i.chartType === 2) {
                    q.value[o].option.tooltip = {
                      trigger: 'item',
                      formatter: function (params) {
                        return params.value.name + ' : ' + params.value.value + ' (' + params.percent + '%)'
                      }
                    }
                  }
                  myChart.setOption(q.value[o].option, true)
                  this.$forceUpdate()
                }
              })
            }
          })
        }, 0)
      })
    },
    handleClickActive () {},
    handleClick (e) {
      const dataList = this.tabPaneDataList
      this.valueDate = ''
      dataList.forEach(i => {
        if (i.value) {
          (i.value).forEach(l => {
            if (l.indicatorName === e.label) {
              if (l.chartType === 1) {
                this.getindicatorId((e.name) * 1, e.label)
              }
              if (l.chartType === 2) {
                this.getindicatorIdPie((e.name) * 1, e.label)
              }
              if (l.chartType === 3) {
                this.getindicatorIdBar((e.name) * 1, e.label)
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.main{
  padding: 10px 10px;
  height: 100%;
  background-color: white;
}
.selectClass{
  width: 100%;
  text-align: left;
  padding-bottom: 10px;
  padding-left: 30px;
}
</style>
