<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计分析</el-breadcrumb-item>
      <el-breadcrumb-item>分支统计</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表区 -->
    <el-card>
      <!-- 检索区 -->
      <el-row
        :gutter="20"
        class="row-search"
      >
        <el-col :span="3">
          <el-select
            v-model="pageInfo.repositoryId"
            placeholder="仓库名称"
            @clear="clearRepositorySelect"
            @change="getBranchList"
            filterable
            clearable
            :filter-method="filterRepository"
          >
            <el-option
              v-for="item in repositories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="分支名称"
            v-model="pageInfo.name"
            @input="onInput"
            @clear="getBranchList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.mergedStatus"
            placeholder="合并状态"
            @clear="clearRepositorySelect"
            @change="getBranchList"
            clearable
          >
            <el-option
              :key="1"
              label="Merged"
              :value="1"
            />
            <el-option
              :key="0"
              label="No-Merged"
              :value="0"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @click="getBranchList"
            @clear="getBranchList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="getBranchList"
          >搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            size="medium"
            type="primary"
            @click="toRankPage"
          >分支排名</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        :data="branchList"
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
          prop="name"
          label="分支名称"
          align="center"
        />
        <el-table-column
          prop="repositoryName"
          label="所属仓库"
          align="center"
        />
        <el-table-column
          prop="age"
          label="年龄/days"
          align="center"
        />
        <el-table-column
          prop="activeAge"
          label="活跃天数"
          align="center"
        />
        <el-table-column
          prop="totalCommits"
          label="提交总数"
          align="center"
        />
        <el-table-column
          prop="totalAuthors"
          label="作者总数"
          align="center"
        />
        <el-table-column
          prop="totalFiles"
          label="文件总数"
          align="center"
        />
        <el-table-column
          prop="totalLineOfCode"
          label="代码行数"
          align="center"
        />
        <el-table-column
          prop="lastStatisticTime"
          label="上次统计"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            {{ scope.row.lastStatisticTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="mergedStatus"
          label="合并状态"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.mergedStatus === 1 ? 'Merged':'No-Merged'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140px"
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
            <el-tooltip
              effect="dark"
              content="点击同步"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="info"
                size="mini"
                :icon="scope.row.collectStatus === 1 ? 'el-icon-loading' : ''"
                :disabled="(scope.row.collectStatus === 1 && scope.row.mergedStatus === 0 )? true : false"
                @click="collectBranch(scope.row.id, scope.row)"
              >
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="scope.row.collectStatus !== 1"
                >
                  <use xlink:href="#icon-tongbu1"></use>
                </svg>
              </el-button>
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
    </el-card>
    <!-- 对话框 -->
    <!-- Commit详情 -->
    <el-dialog
      ref="branchDetailDialogRef"
      :visible.sync="branchDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="分支详情"
        :column="4"
        direction="horizontals"
        border
        colon
        :labelStyle="detailLabelStyle"
        :contentStyle="detailContentStyle"
      >
        <el-descriptions-item
          label="ID"
          :span="2"
        >{{detailBranchForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="所属仓库"
          :span="2"
        >{{detailBranchForm.repositoryName}}</el-descriptions-item>
        <el-descriptions-item
          label="分支名称"
          :span="4"
        >{{detailBranchForm.name}}</el-descriptions-item>
        <el-descriptions-item
          label="年龄/day"
          :span="2"
        >{{detailBranchForm.age}}</el-descriptions-item>
        <el-descriptions-item
          label="活跃天数"
          :span="2"
        >{{detailBranchForm.age}} days, active days {{detailBranchForm.activeAge}} ({{ Math.round(detailBranchForm.activeAge * 100 / detailBranchForm.age) }}%)</el-descriptions-item>
        <el-descriptions-item
          label="提交总数"
          :span="2"
        >{{detailBranchForm.totalCommits}}</el-descriptions-item>
        <el-descriptions-item
          label="作者总数"
          :span="4"
        >{{detailBranchForm.totalAuthors}}</el-descriptions-item>
        <el-descriptions-item
          label="文件总数"
          :span="2"
        >{{detailBranchForm.totalFiles}}</el-descriptions-item>
        <el-descriptions-item
          label="代码行数"
          :span="2"
        >{{detailBranchForm.totalLineOfCode}}</el-descriptions-item>
        <el-descriptions-item
          label="上次统计"
          :span="4"
        >
          <template>
            {{detailBranchForm.lastStatisticTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="创建人"
          :span="2"
        >{{detailBranchForm.createdBy}}</el-descriptions-item>
        <el-descriptions-item
          label="创建时间"
          :span="2"
        >
          <template>
            {{detailBranchForm.createdTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="更新人"
          :span="2"
        >{{detailBranchForm.updatedBy}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="2"
        >
          <template>
            {{detailBranchForm.updatedTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="删除状态"
          :span="2"
        >
          <el-switch
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            v-model="detailBranchForm.delete"
            disabled
          ></el-switch>
        </el-descriptions-item>
        <el-descriptions-item
          label="禁用状态"
          :span="2"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="detailBranchForm.active"
            disabled
          ></el-switch>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="branchDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryByConditions,
  queryById as queryBranchById
} from '../../../api/coding/branch'
import { queryAll } from '../../../api/coding/repository'
import { collectBranchById } from '../../../api/coding/collect'
export default {
  created () {
    this.getRepositoryList()
    this.getBranchList()
  },
  data () {
    return {
      branchList: [],
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
      detailBranchForm: {},
      branchDetailDialogVisible: false,
      repositories: [],
      repositoryCopy: []
    }
  },
  methods: {
    /**
     * 查询提交列表
     */
    getBranchList () {
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
          this.branchList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    /**
     * 查询详情
     * @param rowId branch主键ID
     */
    showDetailDialog (rowId) {
      this.branchDetailDialogVisible = true
      queryBranchById(rowId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.detailBranchForm = res.data
        })
    },
    /**
     * 分页单位调整,重新刷新列表
     * @param newSize 分页单位调整
     */
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getBranchList()
    },
    /**
     * 下一页
     * @param newPage 下一页
     */
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getBranchList()
    },
    /**
     * 强制刷新输入框,解决无法输入问题
     */
    onInput () {
      this.$forceUpdate()
    },
    /**
     * 根据仓库名称过滤仓库
     */
    filterRepository (value) {
      if (value) {
        this.repositories = this.repositoryCopy.filter((item) => {
          if (!!~item.name.indexOf(value) || !!~item.name.toUpperCase().indexOf(value.toUpperCase())) {
            return true
          }
        })
      } else {
        this.repositories = this.repositoryCopy
      }
    },
    /**
     * 查询仓库列表
     */
    getRepositoryList () {
      queryAll()
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          if (!res.data.list || res.data.list.length <= 0) {
            return this.$message.info('暂无仓库数据')
          }
          this.repositories = res.data.list
          this.repositoryCopy = res.data.list
        })
    },
    /**
     * 重新给仓库列表赋值
     */
    clearRepositorySelect () {
      // 下拉框重新赋值操作
      this.repositories = this.repositoryCopy
    },
    /**
     * 分支同步
     * @param {Integer} branchId 分支ID
     */
    collectBranch (branchId, row) {
      row.collectStatus = 1
      collectBranchById(branchId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
        })
    },
    /**
     * 跳转到排名页面
     */
    toRankPage () {
      this.$router.push('/home/rank')
    }
  }
}
</script>
<style lang="less" scoped>
.row-analysis {
  padding-bottom: 5px;
}
.row-search {
  padding-bottom: 12px;
}
</style>
