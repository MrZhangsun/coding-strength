<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>版本统计</el-breadcrumb-item>
      <el-breadcrumb-item>业务反馈</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="请输入项目名称"
            v-model="pageInfo.projectName"
            @input="onInput"
            @clear="getHistoryFeedback"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入项目代码"
            v-model="pageInfo.projectCode"
            @input="onInput"
            @clear="getHistoryFeedback"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入迭代版本"
            v-model="pageInfo.sprint"
            @input="onInput"
            @clear="getHistoryFeedback"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.online"
            clearable
            placeholder="是否延期"
            @clear="getHistoryFeedback"
            @change="getHistoryFeedback"
          >
            <el-option
              key="-1"
              label="延期"
              :value="-1"
            >
            </el-option>
            <el-option
              key="0"
              label="准时"
              :value="0"
            >
            </el-option>
            <el-option
              key="1"
              label="提前"
              :value="1"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getHistoryFeedback"
          >搜索</el-button>
        </el-col>
      </el-row>
      <!-- 发布历史列表 -->
      <el-table
        :data="historyFeedbackList"
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
          prop="projectName"
          label="项目名称"
          align="center"
        />
        <el-table-column
          prop="projectCode"
          label="项目代码"
          align="center"
        />
        <el-table-column
          prop="sprint"
          label="迭代版本"
          align="center"
        />
        <el-table-column
          prop="businessOwner"
          label="业务方"
          align="center"
        />
        <el-table-column
          prop="productManager"
          label="产品经理"
          align="center"
        />
        <el-table-column
          prop="developerManager"
          label="开发经理"
          align="center"
        />
        <el-table-column
          label="反馈列表"
          align="center"
        >
          <template slot-scope="scope">
            <el-select
              v-model="selectedInvestId[scope.row.id]"
              placeholder="查看报告"
              @change="showDetailDialog(selectedInvestId[scope.row.id])"
              clearable
            >
              <el-option
                v-for="item in scope.row.investigationIds"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
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
    <el-dialog
      ref="accountDetailDialogRef"
      :visible.sync="investDialogVisible"
      width="45%"
      title="调查问卷报告"
    >
      <ul
        class="questionList"
        v-for="(item, index) in investQuestions"
        :key="index"
      >
        <li
          :key="item.key.id"
          style="text-align:left"
        >
          问题{{index + 1}}: {{ item.key.label }}
        </li>

        <li
          v-for="val in item.value"
          :key="val.index"
          style="text-align:left"
        >
          答案{{index + 1}}: {{ val.label }}
        </li>
      </ul>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="investDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryHistoryFeedback } from '../../api/release/history'
import { queryInvestigation } from '../../api/release/feedback'

// https://blog.csdn.net/weixin_43173924/article/details/89712290
export default {
  created () {
    this.getHistoryFeedback()
  },
  data () {
    return {
      selectedInvestId: [],
      investDialogVisible: false,
      investQuestions: [],
      historyFeedbackList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    // 获取发布历史列表
    getHistoryFeedback () {
      queryHistoryFeedback(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.historyFeedbackList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    /**
     * 查询调查报告详情
     * @param 调查报告
     */
    showDetailDialog (selectedInvestId) {
      if (!selectedInvestId) {
        return
      }
      queryInvestigation(selectedInvestId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.investQuestions = res.data
          this.investDialogVisible = true
        })
    },
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getHistoryFeedback()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getHistoryFeedback()
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.questionList {
  margin: 0;
  padding: 0;
  li {
    height: 30px;
    list-style: none;
  }
  li + li {
    border-top: none;
  }
  li:first-child {
    border-radius: 4px 4px 0 0;
    background-color: #d0f5e7d5;
  }
  li:last-child {
    border-radius: 0 0 4px 4px;
    margin-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
