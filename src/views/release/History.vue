<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>版本统计</el-breadcrumb-item>
      <el-breadcrumb-item>发布历史</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选条件 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="请输入项目名称"
            v-model="pageInfo.projectName"
            @input="onInput"
            @clear="getHistoryList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入项目代码"
            v-model="pageInfo.projectCode"
            @input="onInput"
            @clear="getHistoryList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入迭代版本"
            v-model="pageInfo.sprint"
            @input="onInput"
            @clear="getHistoryList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.online"
            clearable
            placeholder="是否延期"
            @clear="getHistoryList"
            @change="getHistoryList"
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
            @click="getHistoryList"
          >搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="showAddHistoryDialog"
          >添加</el-button>
        </el-col>
      </el-row>
      <!-- 发布历史列表 -->
      <el-table
        :data="historyList"
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
          prop="online"
          label="是否按时上线"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.online == '-1'">延期</span>
            <span v-if="scope.row.online == '0'">按时</span>
            <span v-if="scope.row.online == '1'">提前</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="230px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteConfirm(scope.row.id)"
            />
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
              content="生成反馈链接"
              :enterable="false"
              placement="top"
            >
              <el-button
                style="background-color: #67C23A;"
                icon="el-icon-link"
                size="mini"
                @click="generateFeedbackUrl(scope.row.id)"
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

    <!-- 添加发布历史对话框 -->
    <el-dialog
      title="新增发布历史"
      :visible.sync="addHistoryDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addHistoryFormRef"
        :model="addHistoryForm"
        :rules="addHistoryFormRules"
        label-width="120px"
      >
        <!-- 个人信息 -->
        <el-form-item
          label="项目名称"
          prop="projectName"
        >
          <el-input
            placeholder="eg: 刊登系统"
            v-model="addHistoryForm.projectName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="项目代码"
          prop="projectCode"
        >
          <el-input
            placeholder="eg: PRM"
            v-model="addHistoryForm.projectCode"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="迭代版本"
          prop="sprint"
        >
          <el-input
            placeholder="eg: 1.1.0"
            v-model="addHistoryForm.sprint"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="业务方"
          prop="businessOwner"
        >
          <el-input
            placeholder="eg: 花花,草草"
            v-model="addHistoryForm.businessOwner"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="产品经理"
          prop="productManager"
        >
          <el-input
            placeholder="eg: 花花"
            v-model="addHistoryForm.productManager"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开发经理"
          prop="developerManager"
        >
          <el-input
            placeholder="eg: 花花"
            v-model="addHistoryForm.developerManager"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新增内容"
          prop="newFunction"
        >
          <el-input
            type="textarea"
            placeholder="请输入新增内容, 不超过1000字"
            v-model="addHistoryForm.newFunction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="修复内容"
          prop="fixFunction"
        >
          <el-input
            type="textarea"
            placeholder="请输入修复内容, 不超过1000字"
            v-model="addHistoryForm.fixFunction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="优化内容"
          prop="optFunction"
        >
          <el-input
            type="textarea"
            placeholder="请输入优化内容, 不超过1000字"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            v-model="addHistoryForm.optFunction"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="研发周期"
          prop="timeRange"
        >
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="上线时间"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="是否延期"
          prop="online"
        >
          <el-radio-group v-model="addHistoryForm.online">
            <el-radio :label="-1">延期</el-radio>
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">提前</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="时间偏差"
          prop="onlineDays"
        >
          <el-input
            placeholder="延期或者提前上线时间,正常上线填: 0"
            v-model="addHistoryForm.onlineDays"
            :value="0"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="反馈报告"
          prop="investigationId"
        >
          <el-select
            v-model="addHistoryForm.investigationId"
            filterable
            clearable
            placeholder="请选择要绑定的报告"
          >
            <el-option
              v-for="item in investigationOptions"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitAddHistoryRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addHistoryDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddHistoryForm"
        >重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑发布历史对话框 -->
    <el-dialog
      ref="editHistoryDialogRef"
      title="编辑发布历史"
      :visible.sync="editHistoryDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed"
    >
      <!-- 表单项 -->
      <el-form
        ref="editHistoryFormRef"
        :model="editHistoryForm"
        :rules="editHistoryFormRules"
        label-width="120px"
      >
        <!-- 个人信息 -->
        <el-form-item
          label="项目名称"
          prop="projectName"
        >
          <el-input
            placeholder="eg: 刊登系统"
            v-model="editHistoryForm.projectName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="项目代码"
          prop="projectCode"
        >
          <el-input
            placeholder="eg: PRM"
            v-model="editHistoryForm.projectCode"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="迭代版本"
          prop="sprint"
        >
          <el-input
            placeholder="eg: 1.1.0"
            v-model="editHistoryForm.sprint"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="业务方"
          prop="businessOwner"
        >
          <el-input
            placeholder="eg: 花花,草草"
            v-model="editHistoryForm.businessOwner"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="产品经理"
          prop="productManager"
        >
          <el-input
            placeholder="eg: 花花"
            v-model="editHistoryForm.productManager"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开发经理"
          prop="developerManager"
        >
          <el-input
            placeholder="eg: 花花"
            v-model="editHistoryForm.developerManager"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新增内容"
          prop="newFunction"
        >
          <el-input
            type="textarea"
            placeholder="请输入新增内容, 不超过1000字"
            v-model="editHistoryForm.newFunction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="修复内容"
          prop="fixFunction"
        >
          <el-input
            type="textarea"
            placeholder="请输入修复内容, 不超过1000字"
            v-model="editHistoryForm.fixFunction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="优化内容"
          prop="optFunction"
        >
          <el-input
            type="textarea"
            placeholder="请输入优化内容, 不超过1000字"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            v-model="editHistoryForm.optFunction"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="研发周期"
          prop="timeRange"
        >
          <el-date-picker
            v-model="dateTimePicker"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="上线时间"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="是否延期"
          prop="online"
        >
          <el-radio-group v-model="editHistoryForm.online">
            <el-radio :label="-1">延期</el-radio>
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">提前</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="时间偏差"
          prop="onlineDays"
        >
          <el-input
            placeholder="延期或者提前上线时间,正常上线填: 0"
            v-model="editHistoryForm.onlineDays"
            :value="0"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="反馈报告"
          prop="investigationId"
        >
          <el-select
            v-model="editHistoryForm.investigationId"
            filterable
            clearable
            placeholder="请选择要绑定的报告"
          >
            <el-option
              v-for="item in investigationOptions"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitEditHistoryRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="editHistoryDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>

    <!-- 发布历史详情 -->
    <el-dialog
      ref="historyDetailDialogRef"
      :visible.sync="historyDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="发布历史详情"
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
        >{{detailHistoryForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="迭代版本"
          :span="2"
        >{{detailHistoryForm.sprint}}</el-descriptions-item>
        <el-descriptions-item
          label="项目名称"
          :span="2"
        >{{detailHistoryForm.projectName}}</el-descriptions-item>
        <el-descriptions-item
          label="项目代码"
          :span="2"
        >{{detailHistoryForm.projectCode}}</el-descriptions-item>
        <el-descriptions-item
          label="业务方"
          :span="4"
        >{{detailHistoryForm.businessOwner}}</el-descriptions-item>
        <el-descriptions-item
          label="产品经理"
          :span="2"
        >{{detailHistoryForm.productManager}}</el-descriptions-item>
        <el-descriptions-item
          label="开发经理"
          :span="2"
        >{{detailHistoryForm.developerManager}}</el-descriptions-item>
        <el-descriptions-item
          label="版本周期"
          :span="2"
        >
          {{detailHistoryForm.startDate | dateFormat("YYYY-MM-DD")}} ~ {{detailHistoryForm.releaseDate | dateFormat("YYYY-MM-DD")}}
        </el-descriptions-item>
        <el-descriptions-item
          label="是否延期"
          :span="2"
        >
          <el-radio-group
            disabled
            v-model="detailHistoryForm.online"
          >
            <el-radio :label="-1">延期</el-radio>
            <el-radio :label="0">按时</el-radio>
            <el-radio :label="1">提前</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          label="新增内容"
          :span="4"
        >{{detailHistoryForm.newFunction}}</el-descriptions-item>
        <el-descriptions-item
          label="更新内容"
          :span="4"
        >{{detailHistoryForm.fixFunction}}</el-descriptions-item>
        <el-descriptions-item
          label="优化内容"
          :span="4"
        >{{detailHistoryForm.optFunction}}</el-descriptions-item>
        <el-descriptions-item
          label="反馈报告"
          :span="4"
        >
          {{detailHistoryForm.description === null ? '未绑定' : '《' + detailHistoryForm.description +'》'}}
        </el-descriptions-item>
        <el-descriptions-item
          label="创建人"
          :span="2"
        >{{detailHistoryForm.createdBy}}</el-descriptions-item>
        <el-descriptions-item
          label="创建时间"
          :span="2"
        >
          <template>
            {{detailHistoryForm.createdTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="更新人"
          :span="2"
        >{{detailHistoryForm.updatedBy}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="2"
        >
          <template>
            {{detailHistoryForm.updatedTime | dateFormat}}
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
            v-model="detailHistoryForm.delete"
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
            v-model="detailHistoryForm.active"
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
          @click="historyDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryHistoryById,
  deleteHistoryById,
  addHistory,
  editHistory,
  queryByConditions
} from '../../api/release/history'

import {
  queryFeedbackUrl,
  checkInvestBinding
} from '../../api/release/feedback'

import {
  queryByConditions as queryInvestigations
} from '../../api/release/investigation'

export default {
  created () {
    this.getHistoryList()
  },
  data () {
    // 特殊字符校验
    const specialCharValidator = (rule, value, callback) => {
      const regEn = /[`~!@#$%^&*()_+<>?:"{},./;']/
      const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】]/
      if (regEn.test(value) || regCn.test(value)) {
        return callback(new Error('名称中不能包含特殊字符'))
      }
      callback()
    }
    // 时间校验
    const addDateTimePickerValidator = (rule, value, callback) => {
      if (this.dateTimePicker && this.dateTimePicker[0] && this.dateTimePicker[1]) {
        this.addHistoryForm.startDate = this.dateTimePicker[0]
        this.addHistoryForm.releaseDate = this.dateTimePicker[1]
        callback()
      } else {
        return callback(new Error('请输入选择研发周期'))
      }
    }
    const editDateTimePickerValidator = (rule, value, callback) => {
      if (this.dateTimePicker && this.dateTimePicker[0] && this.dateTimePicker[1]) {
        this.editHistoryForm.startDate = this.dateTimePicker[0]
        this.editHistoryForm.releaseDate = this.dateTimePicker[1]
        callback()
      } else {
        return callback(new Error('请输入选择研发周期'))
      }
    }
    return {
      investigationOptions: [],
      historyList: [],
      dateTimePicker: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        query: ''
      },
      addHistoryDialogVisible: false,
      editHistoryDialogVisible: false,
      historyDetailDialogVisible: false,

      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      addHistoryForm: {
      },
      editHistoryForm: {
      },
      detailHistoryForm: {
      },
      addHistoryFormRules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 60, message: '请输入3~60个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        projectCode: [
          { required: true, message: '请输入项目代码(三字码)', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        sprint: [
          { required: true, message: '请输入迭代版本号', trigger: 'blur' }
        ],
        businessOwner: [
          { required: false, message: '请输入需求业务方', trigger: 'blur' }
        ],
        productManager: [
          { required: true, message: '请输入产品经理姓名', trigger: 'blur' }
        ],
        developerManager: [
          { required: true, message: '请输入开发经理姓名', trigger: 'blur' }
        ],
        online: [
          { required: true, message: '请输入选择是否按时上线', trigger: 'blur' }
        ],
        onlineDays: [
          { required: true, message: '请输入上线时间差距', trigger: 'blur' }
        ],
        timeRange: [
          { validator: addDateTimePickerValidator, required: true, trigger: 'change' }
        ]
      },
      editHistoryFormRules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 60, message: '请输入3~60个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        projectCode: [
          { required: true, message: '请输入项目代码(三字码)', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        sprint: [
          { required: true, message: '请输入迭代版本号', trigger: 'blur' }
        ],
        businessOwner: [
          { required: false, message: '请输入需求业务方', trigger: 'blur' }
        ],
        productManager: [
          { required: true, message: '请输入产品经理姓名', trigger: 'blur' }
        ],
        developerManager: [
          { required: true, message: '请输入开发经理姓名', trigger: 'blur' }
        ],
        online: [
          { required: true, message: '请输入选择是否按时上线', trigger: 'blur' }
        ],
        onlineDays: [
          { required: true, message: '请输入上线时间差距', trigger: 'blur' }
        ],
        timeRange: [
          { validator: editDateTimePickerValidator, required: true, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 获取发布历史列表
    getHistoryList () {
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.historyList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getHistoryList()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getHistoryList()
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    },
    // 重置新增表单
    resetAddHistoryForm () {
      this.$refs.addHistoryFormRef.resetFields()
    },
    // 新增请求
    submitAddHistoryRequest () {
      if (this.dateTimePicker && this.dateTimePicker[0] && this.dateTimePicker[1]) {
        this.addHistoryForm.startDate = this.dateTimePicker[0]
        this.addHistoryForm.releaseDate = this.dateTimePicker[1]
      } else {
        this.addHistoryForm.startTime = ''
        this.addHistoryForm.releaseDate = ''
      }
      this.$refs.addHistoryFormRef.validate(valid => {
        if (!valid) {
          return
        }
        addHistory(this.addHistoryForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.getHistoryList()
            this.$message.success('添加成功')
            // 成功之后,关闭对话框
            this.addHistoryDialogVisible = false
            this.$refs.addHistoryFormRef.resetFields()
          })
      })
    },
    // 显示编辑对话框
    showEditDialog (historyId) {
      queryHistoryById(historyId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.dateTimePicker[0] = res.data.startDate
          this.dateTimePicker[1] = res.data.releaseDate
          this.editHistoryForm = res.data
          this.editHistoryDialogVisible = true
        })

      this.loadInvestigation()
    },
    // 编辑提交
    submitEditHistoryRequest () {
      this.$refs.editHistoryFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        editHistory(this.editHistoryForm.id, this.editHistoryForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.$message.success('修改成功!')
            this.editHistoryDialogVisible = false
            this.getHistoryList()
          })
      })
    },
    // 对话框关闭提示
    handleClose (done) {
      this.$confirm('确定要关闭对话框?')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 对话框关闭, 清空数据
    editDialogClosed () {
      this.$refs.editHistoryFormRef.resetFields()
    },
    // 显示删除确认框
    showDeleteConfirm (historyId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteHistoryById(historyId)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }

            this.getHistoryList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 发布历史详情
    showDetailDialog (historyId) {
      // 查询详情
      queryHistoryById(historyId).then(res => {
        if (res.code !== 200) {
          return new Error('查询发布历史详情失败')
        }
        this.detailHistoryForm = res.data
        // 显示详情对话框
        this.historyDetailDialogVisible = true
      })
    },
    /**
     * 生成反馈链接
     */
    generateFeedbackUrl (releaseId) {
      // 1. 检查报告是否绑定
      checkInvestBinding(releaseId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          if (res.data) {
            // 已经绑定
            this.theQueryFeedbackUrl(releaseId, false)
          } else {
            // 未绑定报告
            this.$confirm('当前版本还没有绑定调研问题, 是否采用默认问题? ', '友情提示', {
              confirmButtonText: '默认',
              cancelButtonText: '绑定',
              type: 'warning'
            }).then(() => {
              this.theQueryFeedbackUrl(releaseId, true)
            }).catch(() => {
              this.showEditDialog(releaseId)
            })
          }
        })
    },

    /**
     * 查询报告链接地址
     */
    theQueryFeedbackUrl (releaseId, defaultInvest) {
      // 2. 是否采用默认链接
      queryFeedbackUrl(releaseId, defaultInvest)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.$copyText(res.data)
            .then(res => {
              this.$message.success('链接已经复制到剪切板!')
            }).catch(error => {
              return this.$message.error(error)
            })
        })
    },

    /**
     * 添加对话框展示
     */
    showAddHistoryDialog () {
      this.addHistoryDialogVisible = true
      this.loadInvestigation()
    },

    /**
     * 加载报告下拉框
     */
    loadInvestigation () {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = 10000
      queryInvestigations(this.pageInfo)
        .then(res => {
          this.loading = false
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.investigationOptions = res.data.list
          console.log(this.investigationOptions)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  width: 100%;
  height: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
  background-color: #fff;
  border: 1px dashed #0f0d0d;
  border-radius: 6px;
}
</style>
