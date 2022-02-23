<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计分析</el-breadcrumb-item>
      <el-breadcrumb-item>作者统计</el-breadcrumb-item>
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
            @change="onSelectRepository"
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
          <el-select
            v-model="pageInfo.branchId"
            placeholder="分支名称"
            @clear="clearRepositorySelect"
            @change="getAuthorList"
            filterable
            clearable
            :filter-method="filterRepository"
          >
            <el-option
              v-for="item in branches"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="作者"
            v-model="pageInfo.author"
            @input="onInput"
            @clear="getAuthorList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            range-separator="To"
            start-placeholder="统计开始"
            end-placeholder="统计结束"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getAuthorList"
            @clear="getAuthorList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getAuthorList"
          >搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">排名</el-button>
        </el-col>
      </el-row>
      <!-- 分析区 -->
      <el-row
        :gutter="20"
        class="row-analysis"
      >
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-analysis"
          >分支分析</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-analysis"
          >本库分析</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-analysis"
          >全库分析</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        :data="authorList"
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
          prop="account"
          label="用户名"
          align="center"
        />
        <el-table-column
          prop="email"
          label="E-Mail"
          align="center"
        />
        <el-table-column
          prop="repositoryName"
          label="所属仓库"
          align="center"
        />
        <el-table-column
          prop="branchName"
          label="所属分支"
          align="center"
        />
        <el-table-column
          prop="joinBranchTime"
          label="首次提交时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.joinBranchTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCommits"
          label="分支提交总数"
          align="center"
        />
        <el-table-column
          prop="addLines"
          label="添加行"
          align="center"
        />
        <el-table-column
          prop="removeLines"
          label="删除行"
          align="center"
        />
        <el-table-column
          label="有效行"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.addLines - scope.row.removeLines}}
          </template>
        </el-table-column>
        <el-table-column
          prop="changedFiles"
          label="影响文件"
          align="center"
        />
        <el-table-column
          prop="lastStatisticTime"
          label="最新统计时间"
          align="center"
          width="185px"
        >
          <template slot-scope="scope">
            {{ scope.row.lastStatisticTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
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
    </el-card>
    <!-- 对话框 -->
    <!-- Author详情 -->
    <el-dialog
      ref="authorDetailDialogRef"
      :visible.sync="authorDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="作者详情"
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
        >{{detailAuthorForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="姓名"
          :span="2"
        >{{detailAuthorForm.name}}</el-descriptions-item>
        <el-descriptions-item
          label="账号"
          :span="2"
        >{{detailAuthorForm.account}}</el-descriptions-item>
        <el-descriptions-item
          label="邮箱"
          :span="2"
        >{{detailAuthorForm.email}}</el-descriptions-item>
        <el-descriptions-item
          label="所在仓库"
          :span="2"
        >{{detailAuthorForm.repositoryName}}</el-descriptions-item>
        <el-descriptions-item
          label="所在分支"
          :span="2"
        >{{detailAuthorForm.branchName}}</el-descriptions-item>
        <el-descriptions-item
          label="首次提交时间"
          :span="2"
        >
          <template>
            {{detailAuthorForm.joinBranchTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="总提交"
          :span="2"
        >{{detailAuthorForm.totalCommits}}</el-descriptions-item>
        <el-descriptions-item
          label="添加行"
          :span="2"
        >{{detailAuthorForm.addLines}}</el-descriptions-item>
        <el-descriptions-item
          label="删除行"
          :span="2"
        >{{detailAuthorForm.removeLines}}</el-descriptions-item>
        <el-descriptions-item
          label="有效行"
          :span="2"
        >{{detailAuthorForm.addLines - detailAuthorForm.removeLines}}</el-descriptions-item>
        <el-descriptions-item
          label="影响文件"
          :span="2"
        >{{detailAuthorForm.changedFiles}}</el-descriptions-item>

        <el-descriptions-item
          label="统计ID"
          :span="2"
        >{{detailAuthorForm.collectId}}</el-descriptions-item>

        <el-descriptions-item
          label="统计状态"
          :span="2"
        >
          {{detailAuthorForm.collectStatus === 0 ? '已完成' : '统计中'}}
        </el-descriptions-item>
        <el-descriptions-item
          label="触发方式"
          :span="2"
        >{{detailAuthorForm.collectorTriggerMethod}}</el-descriptions-item>
        <el-descriptions-item
          label="统计时间"
          :span="2"
        >
          <template>
            {{detailAuthorForm.lastStatisticTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="创建人"
          :span="2"
        >{{detailAuthorForm.createdBy}}</el-descriptions-item>
        <el-descriptions-item
          label="创建时间"
          :span="2"
        >
          <template>
            {{detailAuthorForm.createdTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="更新人"
          :span="2"
        >{{detailAuthorForm.updatedBy}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="2"
        >
          <template>
            {{detailAuthorForm.updatedTime | dateFormat}}
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
            v-model="detailAuthorForm.delete"
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
            v-model="detailAuthorForm.active"
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
          @click="authorDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryByConditions,
  queryById as queryAuthorById
} from '../../../api/coding/author'
import { queryAll } from '../../../api/coding/repository'
import { queryByRepositoryId } from '../../../api/coding/branch'
export default {
  created () {
    this.getRepositoryList()
    this.getAuthorList()
  },
  data () {
    return {
      authorList: [],
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
      detailAuthorForm: {},
      authorDetailDialogVisible: false,
      repositories: [],
      repositoryCopy: [],
      branches: [],
      brancheCopy: []
    }
  },
  methods: {
    /**
     * 查询作者列表
     */
    getAuthorList () {
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
          this.authorList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    /**
     * 查询详情
     * @param rowId author主键ID
     */
    showDetailDialog (rowId) {
      this.authorDetailDialogVisible = true
      queryAuthorById(rowId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.detailAuthorForm = res.data
        })
    },
    /**
     * 分页单位调整,重新刷新列表
     * @param newSize 分页单位调整
     */
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getAuthorList()
    },
    /**
     * 下一页
     * @param newPage 下一页
     */
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getAuthorList()
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
            return this.$message.info('暂无数据')
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
     * 当选择了仓库之后
     * @param repositoryId 选中的仓库ID
     */
    onSelectRepository (repositoryId) {
      if (repositoryId) {
        this.getBranchListByRepositoryId(repositoryId)
      }
      this.getAuthorList()
    },
    /**
     * 根据仓库名称过滤仓库
     */
    filterBranch (value) {
      if (value) {
        this.branches = this.brancheCopy.filter((item) => {
          if (!!~item.name.indexOf(value) || !!~item.name.toUpperCase().indexOf(value.toUpperCase())) {
            return true
          }
        })
      } else {
        this.branches = this.brancheCopy
      }
    },
    /**
     * 查询仓库列表
     */
    getBranchListByRepositoryId (repositoryId) {
      queryByRepositoryId(repositoryId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          if (!res.data || res.data.length <= 0) {
            return this.$message.info('暂无数据')
          }
          this.branches = res.data
          this.brancheCopy = res.data
        })
    },
    /**
     * 重新给仓库列表赋值
     */
    clearBranchSelect () {
      // 下拉框重新赋值操作
      this.branches = this.brancheCopy
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
