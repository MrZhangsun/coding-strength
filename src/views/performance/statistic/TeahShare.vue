<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>绩效管理</el-breadcrumb-item>
      <el-breadcrumb-item>绩效统计</el-breadcrumb-item>
      <el-breadcrumb-item>技术分享</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="请输入标题"
            v-model="pageInfo.title"
            @input="onInput"
            @clear="getSharingList"
            @change="getSharingList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入分享者姓名"
            v-model="pageInfo.teacher"
            @input="onInput"
            @clear="getSharingList"
            @change="getSharingList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.sharingLevel"
            clearable
            placeholder="分享范围"
            @clear="getSharingList"
            @change="getSharingList"
          >
            <el-option
              key="1"
              label="公司级"
              :value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="部门级"
              :value="2"
            >
            </el-option>
            <el-option
              key="3"
              label="团队级"
              :value="3"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.sharingType"
            clearable
            placeholder="分享类型"
            @clear="getSharingList"
            @change="getSharingList"
          >
            <el-option
              key="1"
              label="技术类型"
              :value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="业务类型"
              :value="2"
            >
            </el-option>
            <el-option
              key="3"
              label="其他类型"
              :value="3"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="queryDateTimePicker"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getSharingList"
            @clear="getSharingList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="showAddSharingDialog"
          >记录</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        :data="sharingList"
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
          prop="title"
          label="标题"
          align="center"
        />
        <el-table-column
          prop="teacher"
          label="分享者"
          align="center"
        />
        <el-table-column
          prop="sharingLevel"
          label="分享范围"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sharingLevel == '1'">公司级</span>
            <span v-if="scope.row.sharingLevel == '2'">部门级</span>
            <span v-if="scope.row.sharingLevel == '3'">团队级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="分享积分"
          align="center"
        />
        <el-table-column
          prop="sharingType"
          label="分享类型"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sharingType == '1'">技术类型</span>
            <span v-if="scope.row.sharingType == '2'">业务类型</span>
            <span v-if="scope.row.sharingType == '3'">其他类型</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sharingTime"
          label="分享时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.startTime | dateFormat }} - {{ scope.row.endTime | dateFormat('hh:mm:ss') }}
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
              content="复制反馈链接"
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
      <!-- 添加对话框 -->
      <el-dialog
        title="新增技术分享"
        :visible.sync="addSharingDialogVisible"
        width="50%"
        :before-close="handleClose"
        @closed="addDialogClosed"
      >
        <!-- 表单项 -->
        <el-form
          ref="addSharingFormRef"
          :model="addSharingForm"
          :rules="addSharingFormRules"
          label-width="120px"
        >
          <el-row
            align="left"
            :gutter="30"
          >
            <el-col :span="24">
              <el-form-item
                label="分享标题"
                prop="title"
              >
                <el-input
                  placeholder="请输入分享标题"
                  v-model="addSharingForm.title"
                  @input="onInput"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="分享类型"
                prop="sharingType"
              >
                <el-select
                  v-model="addSharingForm.sharingType"
                  filterable
                  clearable
                  placeholder="请选择分享类型"
                >
                  <el-option
                    :key="1"
                    label="技术类型"
                    :value="1"
                  >
                  </el-option>
                  <el-option
                    :key="2"
                    label="业务类型"
                    :value="2"
                  >
                  </el-option>
                  <el-option
                    :key="3"
                    label="其他类型"
                    :value="3"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="分享范围"
                prop="sharingLevel"
              >
                <el-select
                  v-model="addSharingForm.sharingLevel"
                  filterable
                  clearable
                  placeholder="请选择分享范围"
                >
                  <el-option
                    :key="1"
                    label="公司级"
                    :value="1"
                  >
                  </el-option>
                  <el-option
                    :key="2"
                    label="部门级"
                    :value="2"
                  >
                  </el-option>
                  <el-option
                    :key="3"
                    label="团队级"
                    :value="3"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="分享者"
                prop="teacher"
              >
                <el-input
                  placeholder="请输入分享者姓名"
                  v-model="addSharingForm.teacher"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="分享摘要"
                prop="summary"
              >
                <el-input
                  type="textarea"
                  placeholder="请输入分享摘要, 不超过1000字"
                  v-model="addSharingForm.summary"
                  :autosize="{ minRow: 5, maxRow: 10 }"
                  :maxlength="1000"
                  show-word-limit
                  @input="onInput"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="分享时间"
                prop="sharingTime"
              >
                <el-date-picker
                  v-model="addDateTimePicker"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy-MM-dd hh:mm:ss"
                  value-format="yyyy-MM-dd hh:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="反馈报告"
                prop="investigationId"
              >
                <el-select
                  v-model="addSharingForm.investigationId"
                  filterable
                  clearable
                  placeholder="请选择要绑定的报告"
                >
                  <el-option
                    v-for="item in investigationOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <!-- 按钮 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitAddSharingRequest"
          >确定</el-button>
          <el-button
            type="danger"
            :before-close="handleClose"
            @click="addSharingDialogVisible = false"
          >取消</el-button>
          <el-button
            type="info"
            @click="resetAddSharingForm"
          >重置</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog
        title="新增发布历史"
        :visible.sync="editSharingDialogVisible"
        width="50%"
        :before-close="handleClose"
        @closed="editDialogClosed"
      >
        <!-- 表单项 -->
        <el-form
          ref="editSharingFormRef"
          :model="editSharingForm"
          :rules="editSharingFormRules"
          label-width="120px"
        >
          <el-row
            align="left"
            :gutter="30"
          >
            <el-col :span="24">
              <el-form-item
                label="分享标题"
                prop="title"
              >
                <el-input
                  placeholder="请输入分享标题"
                  v-model="editSharingForm.title"
                  @input="onInput"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="分享类型"
                prop="sharingType"
              >
                <el-select
                  v-model="editSharingForm.sharingType"
                  filterable
                  clearable
                  placeholder="请选择分享类型"
                >
                  <el-option
                    :key="1"
                    label="技术类型"
                    :value="1"
                  >
                  </el-option>
                  <el-option
                    :key="2"
                    label="业务类型"
                    :value="2"
                  >
                  </el-option>
                  <el-option
                    :key="3"
                    label="其他类型"
                    :value="3"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="分享者"
                prop="teacher"
              >
                <el-input
                  placeholder="请输入分享者姓名"
                  v-model="editSharingForm.teacher"
                  @input="onInput"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="分享摘要"
                prop="summary"
              >
                <el-input
                  type="textarea"
                  placeholder="请输入分享摘要, 不超过1000字"
                  v-model="editSharingForm.summary"
                  :autosize="{ minRow: 5, maxRow: 10 }"
                  maxlength="1000"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="分享时间"
                prop="sharingTime"
              >
                <el-date-picker
                  v-model="editDateTimePicker"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy-MM-dd hh:mm:ss"
                  value-format="yyyy-MM-dd hh:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="反馈报告"
                prop="investigationId"
              >
                <el-select
                  v-model="editSharingForm.investigationId"
                  filterable
                  clearable
                  placeholder="请选择要绑定的报告"
                >
                  <el-option
                    v-for="item in investigationOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 按钮 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitEditSharingRequest"
          >确定</el-button>
          <el-button
            type="danger"
            :before-close="handleClose"
            @click="editSharingDialogVisible = false"
          >取消</el-button>
          <el-button
            type="info"
            @click="resetEditSharingForm"
          >重置</el-button>
        </span>
      </el-dialog>
      <!-- 分享详情 -->
      <el-dialog
        ref="sharingDetailDialogRef"
        :visible.sync="sharingDetailDialogVisible"
        width="50%"
      >
        <el-descriptions
          class="margin-top"
          title="技术分享详情"
          :column="4"
          direction="horizontals"
          border
          colon
          :labelStyle="detailLabelStyle"
          :contentStyle="detailContentStyle"
        >
          <el-descriptions-item
            label="分享主题"
            :span="2"
          >{{detailSharingForm.title}}</el-descriptions-item>
          <el-descriptions-item
            label="ID"
            :span="2"
          >{{detailSharingForm.id}}</el-descriptions-item>

          <el-descriptions-item
            label="分享范围"
            :span="2"
          >{{detailSharingForm.sharingLevel === 1 ? '公司级' : (detailSharingForm.sharingLevel === 2 ? '部门级' : '团队级')}}</el-descriptions-item>
          <el-descriptions-item
            label="分享类型"
            :span="2"
          >{{detailSharingForm.sharingType === 1 ? '技术类型' : (detailSharingForm.sharingType === 2 ? '业务类型' : '其他类型')}}</el-descriptions-item>
          <el-descriptions-item
            label="分享摘要"
            :span="4"
          >{{detailSharingForm.summary}}</el-descriptions-item>
          <el-descriptions-item
            label="分享时间"
            :span="2"
          >
            {{detailSharingForm.startTime | dateFormat("YYYY-MM-DD HH:mm:ss")}} ~ {{detailSharingForm.endTime | dateFormat("YYYY-MM-DD HH:mm:ss")}}
          </el-descriptions-item>

          <el-descriptions-item
            label="反馈报告"
            :span="2"
          >
            {{detailSharingForm.investigationId === null ? '未绑定' : '《' + detailSharingForm.investigationName +'》'}}
          </el-descriptions-item>
          <el-descriptions-item
            label="创建人"
            :span="2"
          >{{detailSharingForm.createdBy}}</el-descriptions-item>
          <el-descriptions-item
            label="创建时间"
            :span="2"
          >
            <template>
              {{detailSharingForm.createdTime | dateFormat}}
            </template>
          </el-descriptions-item>
          <el-descriptions-item
            label="更新人"
            :span="2"
          >{{detailSharingForm.updatedBy}}</el-descriptions-item>
          <el-descriptions-item
            label="更新时间"
            :span="2"
          >
            <template>
              {{detailSharingForm.updatedTime | dateFormat}}
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
              v-model="detailSharingForm.delete"
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
              v-model="detailSharingForm.active"
              disabled
            ></el-switch>
          </el-descriptions-item>
          <el-descriptions-item
            label="评分统计"
            :span="2"
          >{{detailSharingForm.updatedBy}}</el-descriptions-item>
          <el-descriptions-item
            label="反馈列表"
            :span="2"
          >
            <el-select
              placeholder="查看报告"
              @change="showFeedbackDialog(selectedInvestId)"
              v-model="selectedInvestId"
            >
              <el-option
                v-for="item in investigationIds"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
        <!-- 按钮 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="danger"
            @click="sharingDetailDialogVisible = false"
          >返回</el-button>
        </span>
      </el-dialog>
      <!-- 问卷显示对话框 -->
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
    </el-card>
  </div>
</template>
<script>
import {
  addSharing,
  deleteSharingById,
  querySharingById,
  editSharing,
  queryByConditions,
  checkSharingInvestBinding
} from '../../../api/performance/sharing'
import {
  queryByConditions as queryInvestigations,
  queryInvestigationById
} from '../../../api/release/investigation'
import {
  queryFeedbackUrl,
  queryInvestigation,
  queryObjectFeedbacks
} from '../../../api/release/feedback'
export default {
  created () {
    this.getSharingList()
  },
  data () {
    // 时间校验
    const addDateTimePickerValidator = (rule, value, callback) => {
      if (this.addDateTimePicker && this.addDateTimePicker[0] && this.addDateTimePicker[1]) {
        this.addSharingForm.startTime = this.addDateTimePicker[0]
        this.addSharingForm.endTime = this.addDateTimePicker[1]
        callback()
      } else {
        return callback(new Error('请输入选择分享时间'))
      }
    }
    // 时间校验
    const editDateTimePickerValidator = (rule, value, callback) => {
      if (this.editDateTimePicker && this.editDateTimePicker[0] && this.editDateTimePicker[1]) {
        this.editSharingForm.startTime = this.editDateTimePicker[0]
        this.editSharingForm.endTime = this.editDateTimePicker[1]
        callback()
      } else {
        return callback(new Error('请输入选择分享时间'))
      }
    }
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        title: '',
        startTime: '',
        endTime: ''
      },
      selectedInvestId: '',
      investQuestions: [],
      investigationIds: [],
      queryDateTimePicker: [],
      addDateTimePicker: [],
      editDateTimePicker: [],
      addSharingDialogVisible: false,
      editSharingDialogVisible: false,
      sharingDetailDialogVisible: false,
      investDialogVisible: false,
      sharingList: [],
      addSharingForm: {},
      editSharingForm: {},
      detailSharingForm: {},
      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      addSharingFormRules: {
        title: [
          { required: true, message: '请输入分享主题', trigger: 'blur' },
          { max: 100, message: '主题长度不能超过100个字符', trigger: 'blur' }
        ],
        sharingLevel: [
          { required: true, message: '请选择分享范围', trigger: 'blur' }
        ],
        sharingType: [
          { required: true, message: '请选择分享类型', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请输入分享者姓名', trigger: 'blur' }
        ],
        sharingTime: [
          { validator: addDateTimePickerValidator, required: true, trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入分享摘要', trigger: 'blur' }
        ]
      },
      editSharingFormRules: {
        title: [
          { required: true, message: '请输入分享主题', trigger: 'blur' },
          { max: 100, message: '主题长度不能超过100个字符', trigger: 'blur' }
        ],
        sharingLevel: [
          { required: true, message: '请选择分享范围', trigger: 'blur' }
        ],
        sharingType: [
          { required: true, message: '请选择分享类型', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请输入分享者姓名', trigger: 'blur' }
        ],
        sharingTime: [
          { validator: editDateTimePickerValidator, required: true, trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入分享摘要', trigger: 'blur' }
        ]
      },
      investigationOptions: []
    }
  },
  methods: {
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getSharingList()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getSharingList()
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    },
    // 重置新增表单
    resetAddSharingForm () {
      this.$refs.addSharingFormRef.resetFields()
    },
    // 重置编辑表单
    resetEditSharingForm () {
      this.$refs.editSharingFormRef.resetFields()
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
    addDialogClosed () {
      this.$refs.addSharingFormRef.resetFields()
    },
    // 对话框关闭, 清空数据
    editDialogClosed () {
      this.$refs.editSharingFormRef.resetFields()
    },
    // 查询分享列表
    getSharingList () {
      if (this.queryDateTimePicker && this.queryDateTimePicker[0] && this.queryDateTimePicker[1]) {
        this.pageInfo.startTime = this.queryDateTimePicker[0]
        this.pageInfo.endTime = this.queryDateTimePicker[1]
      } else {
        this.pageInfo.startTime = ''
        this.pageInfo.endTime = ''
      }
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.sharingList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    showAddSharingDialog () {
      this.addSharingDialogVisible = true
      this.loadInvestigation()
    },
    // 添加分享
    submitAddSharingRequest () {
      if (this.addDateTimePicker && this.addDateTimePicker[0] && this.addDateTimePicker[1]) {
        this.addSharingForm.startTime = this.addDateTimePicker[0]
        this.addSharingForm.endTime = this.addDateTimePicker[1]
      } else {
        this.addSharingForm.startTime = ''
        this.addSharingForm.endTime = ''
      }

      this.$refs.addSharingFormRef.validate(valid => {
        if (!valid) {
          return
        }
        // 添加技术分享
        addSharing(this.addSharingForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.getSharingList()
            this.$message.success('添加成功')
            // 成功之后,关闭对话框
            this.addSharingDialogVisible = false
            this.$refs.addSharingFormRef.resetFields()
          })
      })
    },
    // 显示编辑对话框
    showEditDialog (sharingId) {
      querySharingById(sharingId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.editDateTimePicker[0] = res.data.startTime
          this.editDateTimePicker[1] = res.data.endTime
          this.editSharingForm = res.data
          this.editSharingDialogVisible = true
        })

      this.loadInvestigation()
    },
    // 删除分享
    showDeleteConfirm (sharingId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSharingById(sharingId)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }

            this.getSharingList()
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
    },
    // 分享详情
    showDetailDialog (sharingId) {
      // 查询详情
      querySharingById(sharingId)
        .then(res => {
          if (res.code !== 200) {
            return new Error('查询技术分享详情失败')
          }
          this.detailSharingForm = res.data
          // 判断是否已经绑定报告
          const investigationId = res.data.investigationId
          if (investigationId != null) {
            queryInvestigationById(investigationId)
              .then(res => {
                if (res.code !== 200) {
                  this.detailSharingForm.investigationName = '未绑定'
                } else {
                  this.detailSharingForm.investigationName = res.data.name
                }

                // 显示详情对话框
                this.sharingDetailDialogVisible = true
              })
          }
        })
      queryObjectFeedbacks('sharing', sharingId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.investigationIds = res.data
        })
    },
    // 编辑提交
    submitEditSharingRequest () {
      this.$refs.editSharingFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        editSharing(this.editSharingForm.id, this.editSharingForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.$message.success('修改成功!')
            this.editSharingDialogVisible = false
            this.getSharingList()
          })
      })
    },
    /**
     * 生成反馈链接
     */
    generateFeedbackUrl (sharingId) {
      // 1. 检查报告是否绑定
      checkSharingInvestBinding(sharingId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          if (res.data) {
            // 已经绑定
            this.theQueryFeedbackUrl(sharingId, false)
          } else {
            // 未绑定报告
            this.$confirm('当前版本还没有绑定调研问题, 是否采用默认问题? ', '友情提示', {
              confirmButtonText: '默认',
              cancelButtonText: '绑定',
              type: 'warning'
            }).then(() => {
              this.theQueryFeedbackUrl(sharingId, true)
            }).catch(() => {
              this.showEditDialog(sharingId)
            })
          }
        })
    },
    /**
     * 查询报告链接地址
     */
    theQueryFeedbackUrl (sharingId, defaultInvest) {
      // 2. 是否采用默认链接
      queryFeedbackUrl('sharing', sharingId, defaultInvest)
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
    * 查询调查报告详情
    * @param 调查报告
    */
    showFeedbackDialog (selectedInvestId) {
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
