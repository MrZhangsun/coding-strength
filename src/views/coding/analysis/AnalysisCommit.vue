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
            @change="getCommitList"
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
            @clear="getCommitList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="Commit ID"
            v-model="pageInfo.commitId"
            @input="onInput"
            @clear="getCommitList"
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
            @click="getCommitList"
            @clear="getCommitList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getCommitList"
          >搜索</el-button>
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
          >时间分析</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-analysis"
          >人效分析</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-analysis"
          >仓库分析</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-analysis"
          >分支分析</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        :data="commitList"
        :border="true"
        stripe
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column
          type="index"
          label="#"
          align="center"
        />
        <el-table-column
          prop="id"
          label="ID"
          align="center"
        />
        <el-table-column
          prop="commitId"
          label="Commit ID"
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
          prop="author"
          label="作者"
          align="center"
        />
        <el-table-column
          prop="commitTime"
          label="提交时间"
          align="center"
          width="185px"
        >
          <template slot-scope="scope">
            {{ scope.row.commitTime | dateFormat }}
          </template>
        </el-table-column>
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
          prop="commitFiles"
          label="影响文件"
          align="center"
        />
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
    <!-- Commit详情 -->
    <el-dialog
      ref="commitDetailDialogRef"
      :visible.sync="commitDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="Commit详情"
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
        >{{detailCommitForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="Commit ID"
          :span="2"
        >{{detailCommitForm.commitId}}</el-descriptions-item>
        <el-descriptions-item
          label="所属仓库"
          :span="2"
        >{{detailCommitForm.repositoryName}}</el-descriptions-item>
        <el-descriptions-item
          label="所属分支"
          :span="2"
        >{{detailCommitForm.branchName}}</el-descriptions-item>
        <el-descriptions-item
          label="添加行"
          :span="2"
        >{{detailCommitForm.addLines}}</el-descriptions-item>
        <el-descriptions-item
          label="删除行"
          :span="2"
        >{{detailCommitForm.removeLines}}</el-descriptions-item>
        <el-descriptions-item
          label="有效行"
          :span="2"
        >{{detailCommitForm.addLines - detailCommitForm.removeLines}}</el-descriptions-item>
        <el-descriptions-item
          label="提交文件"
          :span="4"
        >{{detailCommitForm.commitFiles}}</el-descriptions-item>
        <el-descriptions-item
          label="作者"
          :span="2"
        >{{detailCommitForm.author}}</el-descriptions-item>
        <el-descriptions-item
          label="提交时间"
          :span="2"
        >
          <template>
            {{detailCommitForm.commitTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="创建人"
          :span="2"
        >{{detailCommitForm.createBy}}</el-descriptions-item>
        <el-descriptions-item
          label="创建时间"
          :span="2"
        >
          <template>
            {{detailCommitForm.createTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="更新人"
          :span="2"
        >{{detailCommitForm.updateBy}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="2"
        >
          <template>
            {{detailCommitForm.updateTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="提交注释"
          :span="4"
        >
          <template>
            {{detailCommitForm.comment | contentLimit(100)}}
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
            v-model="detailCommitForm.delete"
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
            v-model="detailCommitForm.active"
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
          @click="commitDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryByConditions,
  queryById as queryCommitById
} from '../../../api/coding/commit'
import { queryAll } from '../../../api/coding/repository'
import { queryByRepositoryId } from '../../../api/coding/branch'
export default {
  created () {
    this.getRepositoryList()
    this.getCommitList()
  },
  data () {
    return {
      commitList: [],
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
      detailCommitForm: {},
      commitDetailDialogVisible: false,
      repositories: [],
      repositoryCopy: [],
      branches: [],
      brancheCopy: []
    }
  },
  methods: {
    /**
     * 查询提交列表
     */
    getCommitList () {
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
          this.commitList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    /**
     * 查询详情
     * @param rowId commit主键ID
     */
    showDetailDialog (rowId) {
      this.commitDetailDialogVisible = true
      queryCommitById(rowId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.detailCommitForm = res.data
        })
    },
    /**
     * 分页单位调整,重新刷新列表
     * @param newSize 分页单位调整
     */
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getCommitList()
    },
    /**
     * 下一页
     * @param newPage 下一页
     */
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getCommitList()
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
      this.getCommitList()
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
