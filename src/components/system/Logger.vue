<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统日志</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="24">
        <el-col :span="2">
          <el-select
            v-model="pageInfo.method"
            clearable
            placeholder="请选择请求方式"
            @clear="getLoggerList"
            @change="getLoggerList"
          >
            <el-option
              key="1"
              label="GET"
              value="GET"
            >
            </el-option>
            <el-option
              key="2"
              label="POST"
              value="POST"
            >
            </el-option>
            <el-option
              key="3"
              label="PUT"
              value="PUT"
            >
            </el-option>
            <el-option
              key="4"
              label="DELETE"
              value="DELETE"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-input
            placeholder="请输入接口路径"
            v-model="pageInfo.path"
            @input="onInput"
            @clear="getLoggerList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-input
            placeholder="请输入处理器"
            v-model="pageInfo.methodRef"
            @input="onInput"
            @clear="getLoggerList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-input
            placeholder="关键字"
            v-model="pageInfo.description"
            @input="onInput"
            @clear="getLoggerList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-input
            placeholder="IP地址"
            v-model="pageInfo.address"
            @input="onInput"
            @clear="getLoggerList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-input
            placeholder="操作人"
            v-model="pageInfo.createdBy"
            @input="onInput"
            @clear="getLoggerList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @click="getLoggerList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getLoggerList"
          >搜索</el-button>
        </el-col>
      </el-row>
      <!-- 账号列表 -->
      <el-table
        :data="loggerList"
        :border="true"
        stripe
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column
          type="index"
          label="#"
          align="center"
          width="80px"
        />
        <el-table-column
          prop="id"
          label="ID"
          align="center"
          width="80px"
        />
        <el-table-column
          prop="method"
          label="请求方式"
          align="center"
          width="120px"
        />
        <el-table-column
          prop="path"
          label="请求路径"
          align="left"
        />
        <el-table-column
          prop="methodRef"
          label="处理器"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.methodRef | contentLimit(30) }}
            <router-link :to="'index'">more</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="left"
        >
          <template slot-scope="scope">
            {{ scope.row.description | contentLimit(60) }}
            <router-link :to="'index'">more</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="IP地址"
          align="center"
        />
        <el-table-column
          prop="createdBy"
          label="操作人"
          align="center"
        />
        <el-table-column
          prop="createdTime"
          label="创建时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="详情"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-info"
                size="mini"
                @click="showDetailDialog(scope.row.id)"
              />
            </el-tooltip>
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
      <!-- 日志详情 -->
      <el-dialog
        :visible.sync="loggerDetailDialogVisible"
        width="50%"
      >
        <el-descriptions
          class="margin-top"
          title="日志详情"
          :column="4"
          direction="horizontals"
          border
          colon
          :labelStyle="detailLabelStyle"
          :contentStyle="detailContentStyle"
          ref="loggerDetailDialogRef"
        >
          <el-descriptions-item
            label="日志ID"
            :span="2"
          >{{detailLoggerForm.id}}</el-descriptions-item>
          <el-descriptions-item
            label="请求方式"
            :span="2"
          >{{detailLoggerForm.method}}</el-descriptions-item>
          <el-descriptions-item
            label="IP地址"
            :span="2"
          >{{detailLoggerForm.address}}</el-descriptions-item>
          <el-descriptions-item
            label="接口路径"
            :span="2"
          >{{detailLoggerForm.path}}</el-descriptions-item>
          <el-descriptions-item
            label="操作人"
            :span="2"
          >{{detailLoggerForm.createdBy}}</el-descriptions-item>
          <el-descriptions-item
            label="创建时间"
            :span="2"
          >
            <template>
              {{detailLoggerForm.createdTime | dateFormat}}
            </template>
          </el-descriptions-item>
          <el-descriptions-item
            label="处理器"
            :span="4"
          >{{detailLoggerForm.methodRef}}</el-descriptions-item>
          <el-descriptions-item
            label="请求体"
            :span="4"
          >
            {{detailLoggerForm.requestBody}}
          </el-descriptions-item>
          <el-descriptions-item
            label="请求头"
            :span="4"
          >
            {{detailLoggerForm.requestHeader}}
          </el-descriptions-item>
          <el-descriptions-item
            label="响应体"
            :span="4"
          >
            {{detailLoggerForm.responseBody}}
          </el-descriptions-item>
          <el-descriptions-item
            label="响应头"
            :span="4"
          >
            {{detailLoggerForm.responseHeader}}
          </el-descriptions-item>
          <el-descriptions-item
            label="描述"
            :span="4"
          >{{detailLoggerForm.description}}</el-descriptions-item>
        </el-descriptions>
        <!-- 按钮 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="danger"
            @click="backToList"
          >返回</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { queryByConditions, queryById } from '../../api/system/logger'
export default {
  created () {
    this.getLoggerList()
  },

  data () {
    return {
      loggerList: [],
      dateTimePicker: [],
      loggerDetailDialogVisible: false,
      detailLoggerForm: {},
      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: '',
        endTime: ''
      }
    }
  },

  methods: {
    /**
     * 查询日志列表
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
    backToList () {
      this.loggerDetailDialogVisible = false
    },
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getAccountList()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getAccountList()
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
