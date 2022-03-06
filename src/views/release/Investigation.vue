<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>版本统计</el-breadcrumb-item>
      <el-breadcrumb-item>调研报告</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选条件 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="请输入项目名称"
            v-model="pageInfo.projectName"
            @input="onInput"
            @clear="getInvestigationList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入项目代码"
            v-model="pageInfo.projectCode"
            @input="onInput"
            @clear="getInvestigationList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入迭代版本"
            v-model="pageInfo.sprint"
            @input="onInput"
            @clear="getInvestigationList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.online"
            clearable
            placeholder="是否延期"
            @clear="getInvestigationList"
            @change="getInvestigationList"
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
            @click="getInvestigationList"
          >搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addInvestigationDialogVisible = true"
          >添加报告</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addInvestigationDialogVisible = true"
          >添加问题</el-button>
        </el-col>
      </el-row>
      <!-- 调研报告列表 -->
      <el-table
        :data="InvestigationList"
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
          label="标题"
          align="center"
        />
        <el-table-column
          prop="description"
          label="摘要"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.description | contentLimit(10)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">版本反馈</span>
            <span v-if="scope.row.type !== 1">暂不支持</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="创建时间"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.createdTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="更新时间"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.updatedTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="230px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="编辑"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="showDeleteConfirm(scope.row.id)"
              />
            </el-tooltip>
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
              content="绑定问题"
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

    <!-- 添加调研报告对话框 -->
    <el-dialog
      title="新增调研报告"
      :visible.sync="addInvestigationDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addInvestigationFormRef"
        :model="addInvestigationForm"
        :rules="addInvestigationFormRules"
        label-width="120px"
      >
        <el-form-item
          label="标题"
          prop="name"
        >
          <el-input
            placeholder="请给你的调研报告取个名字"
            v-model="addInvestigationForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="摘要"
          prop="description"
        >
          <el-input
            placeholder="请简单描述一下报告调研方向"
            v-model="addInvestigationForm.description"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="addInvestigationForm.type"
            clearable
            placeholder="请选择报告类型"
          >
            <el-option
              key="1"
              label="版本反馈"
              :value="1"
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
          @click="submitAddInvestigationRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addInvestigationDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddInvestigationForm"
        >重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑调研报告对话框 -->
    <el-dialog
      ref="editInvestigationDialogRef"
      title="编辑调研报告"
      :visible.sync="editInvestigationDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed"
    >
      <!-- 表单项 -->
      <el-form
        ref="editInvestigationFormRef"
        :model="editInvestigationForm"
        :rules="editInvestigationFormRules"
        label-width="120px"
      >
        <el-form-item
          label="标题"
          prop="name"
        >
          <el-input
            placeholder="请给你的调研报告取个名字"
            v-model="editInvestigationForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="摘要"
          prop="description"
        >
          <el-input
            placeholder="请简单描述一下报告调研方向"
            v-model="editInvestigationForm.description"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="editInvestigationForm.type"
            clearable
            placeholder="请选择报告类型"
          >
            <el-option
              key="1"
              label="版本反馈"
              :value="1"
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
          @click="submitEditInvestigationRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="editInvestigationDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>

    <!-- 调研报告详情 -->
    <el-dialog
      ref="investigationDetailDialogRef"
      :visible.sync="investigationDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="调研报告详情"
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
        >{{detailInvestigationForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="类型"
          :span="2"
        >
          <el-radio-group
            disabled
            v-model="detailInvestigationForm.type"
          >
            <el-radio :label="1">版本反馈</el-radio>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          label="标题"
          :span="4"
        >{{detailInvestigationForm.name}}</el-descriptions-item>
        <el-descriptions-item
          label="摘要"
          :span="4"
        >{{detailInvestigationForm.description}}</el-descriptions-item>
        <el-descriptions-item
          label="创建人"
          :span="2"
        >{{detailInvestigationForm.createdBy}}</el-descriptions-item>
        <el-descriptions-item
          label="创建时间"
          :span="2"
        >
          <template>
            {{detailInvestigationForm.createdTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="更新人"
          :span="2"
        >{{detailInvestigationForm.updatedBy}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="2"
        >
          <template>
            {{detailInvestigationForm.updatedTime | dateFormat}}
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
            v-model="detailInvestigationForm.delete"
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
            v-model="detailInvestigationForm.active"
            disabled
          ></el-switch>
        </el-descriptions-item>
        <el-descriptions-item
          label="问题列表"
          :span="4"
        >
          <el-collapse
            v-model="activeNames"
            @change="handleChange"
          >
            <el-collapse-item
              title="问题一"
              name="1"
            >
              <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
              <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
            </el-collapse-item>
            <el-collapse-item
              title="问题二"
              name="2"
            >
              <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
              <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
            </el-collapse-item>
            <el-collapse-item
              title="问题三"
              name="3"
            >
              <div>Simplify the process: keep operating process simple and intuitive;</div>
              <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
              <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
            </el-collapse-item>
            <el-collapse-item
              title="问题四"
              name="4"
            >
              <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
              <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
            </el-collapse-item>
          </el-collapse>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="investigationDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryInvestigationById,
  deleteInvestigationById,
  addInvestigation,
  editInvestigation,
  queryByConditions
} from '../../api/release/investigation'

import {
  queryFeedbackUrl,
  checkInvestBinding
} from '../../api/release/feedback'

export default {
  created () {
    this.getInvestigationList()
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
    return {
      InvestigationList: [],
      dateTimePicker: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      addInvestigationDialogVisible: false,
      editInvestigationDialogVisible: false,
      investigationDetailDialogVisible: false,

      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      addInvestigationForm: {
      },
      editInvestigationForm: {
      },
      detailInvestigationForm: {
      },
      addInvestigationFormRules: {
        name: [
          { required: true, message: '请输入调研报告名称', trigger: 'blur' },
          { min: 3, max: 60, message: '请输入3~60个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ]
      },
      editInvestigationFormRules: {
        name: [
          { required: true, message: '请输入调研报告名称', trigger: 'blur' },
          { min: 3, max: 60, message: '请输入3~60个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取调研报告列表
    getInvestigationList () {
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.InvestigationList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getInvestigationList()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getInvestigationList()
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    },
    // 重置新增表单
    resetAddInvestigationForm () {
      this.$refs.addInvestigationFormRef.resetFields()
    },
    // 新增请求
    submitAddInvestigationRequest () {
      this.$refs.addInvestigationFormRef.validate(valid => {
        if (!valid) {
          return
        }
        addInvestigation(this.addInvestigationForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.getInvestigationList()
            this.$message.success('添加成功')
            // 成功之后,关闭对话框
            this.addInvestigationDialogVisible = false
            this.$refs.addInvestigationFormRef.resetFields()
          })
      })
    },
    // 显示编辑对话框
    showEditDialog (investigationId) {
      queryInvestigationById(investigationId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.dateTimePicker[0] = res.data.startDate
          this.dateTimePicker[1] = res.data.releaseDate
          this.editInvestigationForm = res.data
          this.editInvestigationDialogVisible = true
        })
    },
    // 编辑提交
    submitEditInvestigationRequest () {
      this.$refs.editInvestigationFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        editInvestigation(this.editInvestigationForm.id, this.editInvestigationForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.$message.success('修改成功!')
            this.editInvestigationDialogVisible = false
            this.getInvestigationList()
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
      this.$refs.editInvestigationFormRef.resetFields()
    },
    // 显示删除确认框
    showDeleteConfirm (investigationId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInvestigationById(investigationId)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }

            this.getInvestigationList()
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
    // 调研报告详情
    showDetailDialog (investigationId) {
      // 查询详情
      queryInvestigationById(investigationId).then(res => {
        if (res.code !== 200) {
          return new Error('查询调研报告详情失败')
        }
        this.detailInvestigationForm = res.data
        // 显示详情对话框
        this.investigationDetailDialogVisible = true
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
              this.$router.push('/release/investigation')
            })
          }
        })
    },

    /**
     * 查询报告链接地址
     */
    theQueryFeedbackUrl (releaseId, defaultInvest) {
      console.log(releaseId, defaultInvest)
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
