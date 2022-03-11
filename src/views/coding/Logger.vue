<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计日志</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 检索区 -->
      <el-row
        :gutter="20"
        class="row-search"
      >
        <el-col :span="4">
          <el-input
            placeholder="当前位置"
            v-model="pageInfo.currentPosition"
            @input="onInput"
            @clear="getLoggerList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="pageInfo.collectorTriggerMethod"
            clearable
            placeholder="触发方式"
            @clear="getLoggerList"
            @change="getLoggerList"
          >
            <el-option
              key="0"
              label="定时触发"
              value="SCHEDULE"
            >
            </el-option>
            <el-option
              key="1"
              label="页面触发"
              value="WEB_API"
            >
            </el-option>
            <el-option
              key="2"
              label="Webhook触发"
              value="WEBHOOK"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="pageInfo.collectStatus"
            clearable
            placeholder="同步状态"
            @clear="getLoggerList"
            @change="getLoggerList"
          >
            <el-option
              key="0"
              label="已完成"
              value="0"
            >
            </el-option>
            <el-option
              key="1"
              label="执行中"
              value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="已失败"
              value="2"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getLoggerList"
            @clear="getLoggerList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getLoggerList"
          >搜索</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        :data="loggerList"
        :border="true"
        stripe
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column
          prop="id"
          label="ID"
          align="center"
        />
        <el-table-column
          prop="collectType"
          label="解析类型"
          align="center"
        />
        <el-table-column
          prop="collectorTriggerMethod"
          label="触发方式"
          align="center"
        />
        <el-table-column
          prop="collectId"
          label="批次编号"
          align="center"
        />
        <el-table-column
          prop="currentPosition"
          label="当前位置"
          align="center"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.startTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.endTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="更新时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.updatedTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="collectStatus"
          label="运行状态"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.collectStatus === 1"
              style="color: blue"
            >运行中</span>
            <span
              v-else-if="scope.row.collectStatus === 0"
              style="color: green"
            >已完成</span>
            <span
              v-else
              style="color: red"
            >解析失败</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组建 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.pageNum"
        :page-sizes="[10, 50, 100, 200, 500, 1000]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import {
  queryByConditions,
  queryById
} from '../../api/coding/logger'

export default {
  created () {
    this.getLoggerList()
  },
  data () {
    return {
      loggerList: [],
      dateTimePicker: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: '',
        endTime: ''
      },
      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      detailLoggerForm: {},
      loggerDetailDialogVisible: false
    }
  },
  methods: {
    /**
     * 查询作者列表
     */
    getLoggerList () {
      if (this.dateTimePicker && this.dateTimePicker[0] && this.dateTimePicker[1]) {
        this.pageInfo.startTime = this.dateTimePicker[0]
        this.pageInfo.endTime = this.dateTimePicker[1]
      } else {
        this.pageInfo.startTime = ''
        this.pageInfo.endTime = ''
      }
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.loggerList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    /**
     * 查询详情
     * @param rowId author主键ID
     */
    showDetailDialog (rowId) {
      this.loggerDetailDialogVisible = true
      queryById(rowId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.detailLoggerForm = res.data
        })
    },
    /**
     * 分页单位调整,重新刷新列表
     * @param newSize 分页单位调整
     */
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getLoggerList()
    },
    /**
     * 下一页
     * @param newPage 下一页
     */
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getLoggerList()
    },
    /**
     * 强制刷新输入框,解决无法输入问题
     */
    onInput () {
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
