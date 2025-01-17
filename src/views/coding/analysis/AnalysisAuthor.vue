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
            placeholder="用户名"
            v-model="pageInfo.account"
            @input="onInput"
            @clear="getAuthorList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="2">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="getAuthorList"
          >搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="medium"
            @click="toRankPage"
          >作者排名</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-analysis"
            @click="analysisBranch"
          >作者分析</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        :data="authorList"
        :border="true"
        ref="authorListRef"
        stripe
        :header-cell-style="{'text-align':'center'}"
        @select="select"
        @select-all="selectAll"
      >
        >
        <el-table-column
          type="selection"
          prop="id"
          label="ID"
          align="center"
        />
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.name === null"
              style="color: red"
            >未关联</span>
            <span
              v-else
              style="color: green"
            >{{scope.row.name}}</span>
          </template>
        </el-table-column>
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
          prop="totalCommits"
          label="分支提交总数"
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
            <el-tooltip
              effect="dark"
              content="关联作者"
              :enterable="false"
              placement="top"
            >
              <el-button
                style="background-color: #67C23A;"
                icon="el-icon-connection"
                size="mini"
                @click="showLinkAuthorDialog(scope.row)"
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
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
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

    <!-- 作者关联 -->
    <el-dialog
      ref="linkUserDialogRef"
      :visible.sync="linkUserDialogVisible"
      width="40%"
      title="作者关联"
    >
      <el-form
        ref="linkUserFormRef"
        :model="linkUserForm"
        :rules="linkUserFormRules"
        label-width="120px"
      >
        <el-form-item
          label="关联方式"
          prop="method"
        >
          <el-radio-group v-model="linkUserForm.method">
            <el-radio :label="1">A: 为 {{linkUserForm.account}} 账号关联</el-radio>
            <el-radio :label="2">B: 为 {{linkUserForm.email | contentLimit(10)}} 邮箱关联</el-radio>
            <el-radio :label="3">A 且 B</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="关联作者"
          prop="userId"
        >
          <el-select
            v-model="linkUserForm.userId"
            filterable
            clearable
            placeholder="请选择作者"
          >
            <el-option
              v-for="item in userForSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
          找不到用户? <router-link to="/system/user">添加</router-link>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitLinkUserRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="linkUserDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>

    <!-- 作者分析 -->
    <el-dialog
      ref="authorAnalysisDialogRef"
      :visible.sync="authorAnalysisDialogVisible"
      width="60%"
      title="作者分析"
      @open="open()"
    >
      <el-descriptions
        class="margin-top"
        :column="8"
        direction="horizontals"
        border
        colon
        :labelStyle="detailLabelStyle"
        :contentStyle="detailContentStyle"
      >
        <el-descriptions-item
          label="作者姓名"
          :span="2"
        >{{authorAnalysisResult.name}}</el-descriptions-item>
        <el-descriptions-item
          label="作者账号"
          :span="2"
        >{{authorAnalysisResult.account}}</el-descriptions-item>
        <el-descriptions-item
          label="作者邮箱"
          :span="4"
        >{{authorAnalysisResult.email}}</el-descriptions-item>
        <el-descriptions-item
          label="参与仓库"
          :span="2"
        >
          <el-popover
            placement="right"
            title="仓库列表"
            trigger="hover"
            width="300px"
          >
            <el-table :data="authorAnalysisResult.totalRepositories">
              <el-table-column
                property="id"
                label="ID"
              ></el-table-column>
              <el-table-column
                property="name"
                label="仓库名称"
              ></el-table-column>
              <el-table-column
                property="url"
                label="仓库地址"
              ></el-table-column>
            </el-table>
            <span
              slot="reference"
              style="color:blue"
            >{{authorAnalysisResult.totalRepositories.length}}</span>
          </el-popover>
        </el-descriptions-item>
        <el-descriptions-item
          label="参与分支"
          :span="2"
        >
          <el-popover
            placement="right"
            title="仓库列表"
            trigger="hover"
            width="300px"
          >
            <el-table :data="authorAnalysisResult.totalBranches">
              <el-table-column
                property="id"
                label="ID"
              ></el-table-column>
              <el-table-column
                property="name"
                label="仓库名称"
              ></el-table-column>
              <el-table-column
                property="url"
                label="仓库地址"
              ></el-table-column>
            </el-table>
            <span
              slot="reference"
              style="color:blue"
            >{{authorAnalysisResult.totalBranches.length}}</span>
          </el-popover>
        </el-descriptions-item>
        <el-descriptions-item
          label="提交总数"
          :span="2"
        >总共{{authorAnalysisResult.totalCommits}}次, 公司平均提交次数{{authorAnalysisResult.averageCommits}}</el-descriptions-item>
        <el-descriptions-item
          label="总代码量"
          :span="2"
        >{{authorAnalysisResult.totalAddLines}} rows add, {{authorAnalysisResult.totalRemoveLines}} rows remove</el-descriptions-item>
        <el-descriptions-item
          label="活动分布"
          :span="8"
        >
          <div
            id="author-activities"
            style="height:200px"
          ></div>
        </el-descriptions-item>
        <el-descriptions-item
          label="排名统计"
          :span="8"
        >
          <el-tabs
            type="card"
            @tab-click="switchTab"
            v-model="currentTab"
          >
            <el-tab-pane label="今日榜">
              <span style="color: red; padding-left:10px">
                我的排名: {{ myRank.rank }} (提交总数: {{myRank.totalCommits}}, 添加行数: {{myRank.totalAddLines}}, 删除行数: {{myRank.totalRemoveLines}}, 有效行数: {{myRank.totalSaveLines}})
              </span>
              <ul
                class="infinite-list"
                v-infinite-scroll="load"
                style="overflow:auto"
                v-if="authorAnalysisResult.authorRanks.length !== 0"
              >
                <li
                  v-for="(rank, index) in authorAnalysisResult.authorRanks"
                  :key="index"
                  class="infinite-list-item"
                >第{{index + 1}}名: {{ rank.account }} (提交总数: {{rank.totalCommits}}, 添加行数: {{rank.totalAddLines}}, 删除行数: {{rank.totalRemoveLines}}, 有效行数: {{rank.totalSaveLines}})</li>
              </ul>
              <span v-else>
                暂无数据
              </span>
            </el-tab-pane>
            <el-tab-pane label="本周榜">
              <span style="color: red; padding-left:10px">
                我的排名: {{ myRank.rank }} (提交总数: {{myRank.totalCommits}}, 添加行数: {{myRank.totalAddLines}}, 删除行数: {{myRank.totalRemoveLines}}, 有效行数: {{myRank.totalSaveLines}})
              </span>
              <ul
                class="infinite-list"
                v-infinite-scroll="load"
                style="overflow:auto"
                v-if="authorAnalysisResult.authorRanks.length !== 0"
              >
                <li
                  v-for="(rank, index) in authorAnalysisResult.authorRanks"
                  :key="index"
                  class="infinite-list-item"
                >第{{index + 1}}名: {{ rank.account }} (提交总数: {{rank.totalCommits}}, 添加行数: {{rank.totalAddLines}}, 删除行数: {{rank.totalRemoveLines}}, 有效行数: {{rank.totalSaveLines}})</li>
              </ul>
              <span v-else>
                暂无数据
              </span>
            </el-tab-pane>
            <el-tab-pane label="本月榜">
              <span style="color: red; padding-left:10px">
                我的排名: {{ myRank.rank }} (提交总数: {{myRank.totalCommits}}, 添加行数: {{myRank.totalAddLines}}, 删除行数: {{myRank.totalRemoveLines}}, 有效行数: {{myRank.totalSaveLines}})
              </span>
              <ul
                class="infinite-list"
                v-infinite-scroll="load"
                style="overflow:auto"
                v-if="authorAnalysisResult.authorRanks.length !== 0"
              >
                <li
                  v-for="(rank, index) in authorAnalysisResult.authorRanks"
                  :key="index"
                  class="infinite-list-item"
                >第{{index + 1}}名: {{ rank.account }} (提交总数: {{rank.totalCommits}}, 添加行数: {{rank.totalAddLines}}, 删除行数: {{rank.totalRemoveLines}}, 有效行数: {{rank.totalSaveLines}})</li>
              </ul>
              <span v-else>
                暂无数据
              </span>
            </el-tab-pane>
            <el-tab-pane label="本季榜">
              <span style="color: red; padding-left:10px">
                我的排名: {{ myRank.rank }} (提交总数: {{myRank.totalCommits}}, 添加行数: {{myRank.totalAddLines}}, 删除行数: {{myRank.totalRemoveLines}}, 有效行数: {{myRank.totalSaveLines}})
              </span>
              <ul
                class="infinite-list"
                v-infinite-scroll="load"
                style="overflow:auto"
                v-if="authorAnalysisResult.authorRanks.length !== 0"
              >
                <li
                  v-for="(rank, index) in authorAnalysisResult.authorRanks"
                  :key="index"
                  class="infinite-list-item"
                >第{{index + 1}}名: {{ rank.account }} (提交总数: {{rank.totalCommits}}, 添加行数: {{rank.totalAddLines}}, 删除行数: {{rank.totalRemoveLines}}, 有效行数: {{rank.totalSaveLines}})</li>
              </ul>
              <span v-else>
                暂无数据
              </span>
            </el-tab-pane>
            <el-tab-pane label="历史榜">
              <span>
                开发中...
              </span>
            </el-tab-pane>
          </el-tabs>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="onCloseAuthorAnalysis"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryByConditions,
  queryById as queryAuthorById,
  linkUser,
  authorAnalysis
} from '../../../api/coding/author'
import { queryByConditions as queryUsers } from '../../../api/system/user'
import { queryAll } from '../../../api/coding/repository'
import { queryByRepositoryId } from '../../../api/coding/branch'
import moment from 'moment'
import { getDateRange } from '../../../utils/date'
let authorActivityChart
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
      userForSelect: [],
      linkUserForm: {
        email: '',
        account: '',
        id: '',
        userId: '',
        method: ''
      },
      linkUserFormRules: {
        method: [
          { required: true, message: '请选择关联方式', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选择关联用户', trigger: 'change' }
        ]
      },
      authorDetailDialogVisible: false,
      linkUserDialogVisible: false,
      authorAnalysisDialogVisible: false,
      repositories: [],
      repositoryCopy: [],
      branches: [],
      brancheCopy: [],
      selectRow: undefined,
      authorAnalysisResult: {
        name: '',
        totalBranches: [],
        totalRepositories: [],
        authorRanks: []

      },
      authorAnalysisOptions: {
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
            ['提交时间', '添加行', '移除行', '影响文件']
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
      count: 10,
      loading: false,
      currentTab: 0,
      tabStatisticStartTime: '',
      tabStatisticEndTime: '',
      myRank: {
        rank: 0,
        totalCommits: 0,
        totalAddLines: 0,
        totalRemoveLines: 0,
        totalSaveLines: 0
      }
    }
  },
  computed: {
    noMore () {
      return this.count >= 20
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    },
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
    handleClose (done) {
      this.$confirm('确定要关闭对话框?')
        .then(_ => {
          done()
        })
        .catch(_ => { })
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
    },
    /**
     * 跳转到排名页面
     */
    toRankPage () {
      this.$router.push('/home/rank')
    },
    /**
     * 打开对话框
     */
    showLinkAuthorDialog (row) {
      this.linkUserDialogVisible = true
      const query = {
        pageNum: 1,
        pageSize: 10000
      }
      this.linkUserForm.email = row.email
      this.linkUserForm.account = row.account
      this.linkUserForm.authorId = row.id
      queryUsers(query)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.userForSelect = res.data.list
        })
    },
    /**
     * 关联作者
     */
    submitLinkUserRequest () {
      this.$refs.linkUserFormRef.validate(valid => {
        if (!valid) {
          return
        }
        linkUser(this.linkUserForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.$message.success('关联成功')
            // 成功之后,关闭对话框
            this.linkUserDialogVisible = false
            this.getAuthorList()
            this.$refs.linkUserFormRef.resetFields()
          })
      })
    },
    /**
     * 单选
     */
    select (selection, row) {
      if (selection.length === 1) {
        this.selectRow = selection[0]
      } else if (selection.length > 1) {
        // 去除选中
        const delRow = selection.shift()
        this.$refs.authorListRef.toggleRowSelection(delRow, false)

        // 选中赋值
        this.selectRow = selection[selection.length - 1]
      } else {
        this.selectRow = undefined
      }
    },
    /**
     * 全选/全不选
     */
    selectAll (selection) {
      if (selection.length > 1) {
        this.selectRow = selection[0]
        selection.length = 1
      } else {
        this.selectRow = undefined
      }
    },
    /**
     * 作者分析
     */
    analysisBranch () {
      if (!this.selectRow) {
        return this.$message.error('请选择一条记录进行分析')
      }
      if (this.selectRow.length > 1) {
        return this.$message.error('只能选择一条记录')
      }
      const today = getDateRange(new Date(), 0, true)
      const todayStart = today[0]
      const todayEnd = today[1]
      this.tabStatisticStartTime = todayStart + ' 00:00:00'
      this.tabStatisticEndTime = todayEnd + ' 23:59:59'
      this.queryAuthorAnalysis()
    },
    queryAuthorAnalysis () {
      const conditions = {
        account: this.selectRow.account,
        email: this.selectRow.email,
        startTime: this.tabStatisticStartTime,
        endTime: this.tabStatisticEndTime
      }
      authorAnalysis(conditions)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.authorAnalysisResult = res.data
          this.authorAnalysisDialogVisible = true
          this.authorAnalysisResult.name = this.selectRow.name

          // 统计当前作者排名
          this.myRank = {
            rank: 0,
            totalCommits: 0,
            totalAddLines: 0,
            totalRemoveLines: 0,
            totalSaveLines: 0
          }
          const authorRanks = this.authorAnalysisResult.authorRanks
          if (authorRanks !== undefined && authorRanks.length > 0) {
            for (let i = 0; i < authorRanks.length; i++) {
              const rank = authorRanks[i]
              if (this.selectRow.account === rank.account && this.selectRow.email === rank.email) {
                this.myRank = rank
                this.myRank.rank = i + 1
              }
            }
          }

          // 清空上次的结果
          const length = this.authorAnalysisOptions.dataset.source.length
          if (length > 1) {
            this.authorAnalysisOptions.dataset.source.splice(1, length - 1)
          }

          res.data.activities.forEach(element => {
            const commit = []
            const commitTimeStr = moment(element.commitTime).format('YYYY-MM-DD hh:mm:ss')
            commit[0] = commitTimeStr
            commit[1] = element.addLines
            commit[2] = element.removeLines
            commit[3] = element.commitFiles
            this.authorAnalysisOptions.dataset.source.push(commit)
          })
          // 从新绘制图表
          authorActivityChart.setOption(this.authorAnalysisOptions)
        })
    },
    open () {
      this.$nextTick(() => {
        const dom = document.getElementById('author-activities')
        authorActivityChart = this.$echarts.init(dom, 'infographic')
        authorActivityChart.setOption(this.authorAnalysisOptions)
        // 监听页面尺寸变化事件, 动态修改图表尺寸
        window.addEventListener('resize', () => {
          this.screenWidth = window.innerWidth
          this.screenHeight = window.innerHeight
          const resize = {
            width: this.screenWidth,
            height: this.screenHeight
          }
          authorActivityChart.resize(resize)
        })
      })
    },
    onCloseAuthorAnalysis () {
      this.authorAnalysisDialogVisible = false
      // 销毁组建,防止内存泄漏
      authorActivityChart.dispose()
    },
    /**
     * 排行榜切换
     */
    switchTab () {
      const now = new Date()
      // 获取今天的日期
      if (this.currentTab === '0') {
        const today = getDateRange(now, 0, true)
        const todayStart = today[0]
        const todayEnd = today[1]
        this.tabStatisticStartTime = todayStart + ' 00:00:00'
        this.tabStatisticEndTime = todayEnd + ' 23:59:59'
        this.queryAuthorAnalysis()
      } else if (this.currentTab === '1') {
        // 获取本周
        const curWeek = getDateRange(now, 7, true)
        const curWeekStart = curWeek[0]
        const curWeekEnd = curWeek[1]
        this.tabStatisticStartTime = curWeekStart + ' 00:00:00'
        this.tabStatisticEndTime = curWeekEnd + ' 23:59:59'
        this.queryAuthorAnalysis()
      } else if (this.currentTab === '2') {
        // 获取本月
        const curMonth = getDateRange(now, 30, true)
        const curMonthStart = curMonth[0]
        const curMonthEnd = curMonth[1]
        this.tabStatisticStartTime = curMonthStart + ' 00:00:00'
        this.tabStatisticEndTime = curMonthEnd + ' 23:59:59'
        this.queryAuthorAnalysis()
      } else if (this.currentTab === '3') {
        // 获取本季度
        const curQuarter = getDateRange(now, 90, true)
        const curQuarterStart = curQuarter[0]
        const curQuarterEnd = curQuarter[1]
        this.tabStatisticStartTime = curQuarterStart + ' 00:00:00'
        this.tabStatisticEndTime = curQuarterEnd + ' 23:59:59'
        this.queryAuthorAnalysis()
      } else {
        // 获取历史
        this.tabStatisticStartTime = ''
        this.tabStatisticEndTime = ''
      }
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
.infinite-list {
  overflow: auto;
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
  .infinite-list-item {
    display: flex;
    align-items: center;
    height: 50px;
    background: #e8f3fe;
    margin: 10px;
    color: #7dbcfc;
  }
}
</style>
