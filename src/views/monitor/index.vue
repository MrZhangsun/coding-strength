<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>指标</el-breadcrumb-item>
      <el-breadcrumb-item>指标显示</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClickActive(activeName)">
        <template v-for="(item,index) in tabPaneData">
          <el-tab-pane :key="index" :label="item.label" :name="item.name">
            <div v-if="item.tabPaneNextData">
              <el-tabs v-model="activeNameType" tab-position="left" @tab-click="handleClick">
                <template v-for="(items,indexs) in (item.tabPaneNextData)">
                  <el-tab-pane :key="indexs" :label="items.label" :name="items.name" :lazy="true">
                    <div class="selectClass">
                      <el-radio-group v-model="valueDate">
                        <el-radio-button v-for="(i,index) in options" :key="index" :label="i.label">
                          {{ i.name }}
                        </el-radio-button>
                      </el-radio-group>
                      <!-- <el-date-picker
                        v-model="dateTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @focus="dateTimeFocus"
                        @change="dateTimeChange"
                        :picker-options="pickerOptions">
                      </el-date-picker> -->
                    </div>
                    <div v-loading="loading">
                      <div :id="`chart${items.name}`" style="width:100%;height:500px;"></div>
                    </div>
                    <!-- <div v-if="items.chartType === 'broken'">
                      <div :id="`chart${indexs}`" style="width:100%;height:500px;">
                      </div>
                    </div>
                    <div v-if="items.chartType === 'circular'">
                      <div :id="`chart${indexs}`" style="width:100%;height:500px;">
                      </div>
                    </div>
                    <div v-if="items.chartType === 'column'">
                      <div :id="`chart${indexs}`" style="width:100%;height:500px;">
                      </div>
                    </div> -->
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
        label: 'day',
        name: '日'
      }, {
        label: 'week',
        name: '周'
      }, {
        label: 'month',
        name: '月'
      }, {
        label: 'quarter',
        name: '季度'
      }, {
        label: 'year',
        name: '年'
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
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
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
      ]
    }
  },
  destroyed () {
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.defaultChart(0)
    // })
    setTimeout(() => {
      this.initChart()
    }, 0)
  },
  methods: {
    dateTimeFocus () {
      this.loading = false
    },
    dateTimeChange () {
      this.loading = true
      if ((this.dateTime).length > 0) {
        this.loading = false
      }
    },
    initChart () {
      this.$nextTick(() => {
        setTimeout(() => {
          const arr = this.tabPaneData
          arr.forEach((q, w) => {
            if ((q.tabPaneNextData).length > 0) {
              (q.tabPaneNextData).forEach((i, o) => {
                const myChart = this.$echarts.init(document.getElementById(`chart${i.name}`))
                myChart.setOption(q.tabPaneNextData[o].option, true)
              })
            }
          })
        }, 0)
      })
    },
    defaultChart (indexs) {
      this.chartDomDefault = this.$echarts.init(document.getElementById(`chart${indexs}`))
      var option
      var abs = [
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
      option = JSON.parse(JSON.stringify({
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
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
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
        series: []
      }))
      option.series = abs
      this.chartDomDefault.setOption(option)
    },
    circularChart (indexs) {
      this.chartCircular = this.$echarts.init(document.getElementById(`chart${indexs}`))
      var option
      option = {
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
      this.chartCircular.setOption(option)
    },
    columnChart (indexs) {
      this.chartDomColumn = this.$echarts.init(document.getElementById(`chart${indexs}`))
      const colors = ['#5470C6', '#91CC75', '#EE6666']
      var option
      option = {
        color: colors,
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
      this.chartDomColumn.setOption(option)
    },
    handleClickActive () {},
    handleClick (e) {
      // 办法2
      this.$nextTick(() => {
        this.initChart()
      })
      // if (this.activeNameType === 'circular') {
      //   this.$nextTick(() => {
      //     this.circularChart(e.index)
      //   })
      // } else if (this.activeNameType === 'column') {
      //   this.$nextTick(() => {
      //     this.columnChart(e.index)
      //   })
      // } else {
      //   this.$nextTick(() => {
      //     this.defaultChart(e.index)
      //   })
      // }
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
