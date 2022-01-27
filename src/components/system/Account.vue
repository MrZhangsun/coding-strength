<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="请输入账号"
            v-model="pageInfo.username"
            @input="onInput"
            @clear="getAccountList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入钉钉ID"
            v-model="pageInfo.dingtalkId"
            @input="onInput"
            @clear="getAccountList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.type"
            clearable
            placeholder="请选择内外网"
            @clear="getAccountList"
            @change="getAccountList"
          >
            <el-option
              key="1"
              label="内网"
              value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="外网"
              value="2"
            >
            </el-option>
            <el-option
              key="3"
              label="第三方"
              value="3"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.lock"
            clearable
            placeholder="请选择状态"
            @clear="getAccountList"
            @change="getAccountList"
          >
            <el-option
              key="0"
              label="正常"
              value="0"
            >
            </el-option>
            <el-option
              key="1"
              label="锁定"
              value="1"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getAccountList"
          >搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addAccountDialogVisible = true"
          >添加</el-button>
        </el-col>
      </el-row>
      <!-- 账号列表 -->
      <el-table
        :data="accountList"
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
          prop="username"
          label="账号"
          align="center"
        />
        <el-table-column
          prop="dingtalkId"
          label="钉钉ID"
          align="center"
        />
        <el-table-column
          prop="type"
          label="类型"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type == '1'">内网</span>
            <span v-if="scope.row.type == '2'">外网</span>
            <span v-if="scope.row.type == '3'">第三方</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          align="center"
        />
        <el-table-column
          prop="passwordUpd"
          label="修改密码时间"
          align="center"
          width="185px"
        >
          <template slot-scope="scope">
            {{ scope.row.passwordUpd | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="active"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.active"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              @change="updateAccountStatus(scope.row.id, scope.row.active)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
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

    <!-- 添加账号对话框 -->
    <el-dialog
      title="新增账号"
      :visible.sync="addAccountDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addAccountFormRef"
        :model="addAccountForm"
        :rules="addAccountFormRules"
        label-width="120px"
      >
        <!-- 账号头像 -->
        <el-form-item
          label="头像"
          prop="avatar"
          style="height: 80px"
        >
          <el-upload
            class="avatar-uploader"
            action="no_use"
            :http-request="addUploadAvatarRequest"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-change="onChangeUpload"
            ref="addAvatarRef"
            :drag="false"
            accept="image/png, image/jpeg"
            list-type="picture"
            :multiple="false"
            :auto-upload="true"
          >
            <div class="avatar">
              <img
                v-if="addAccountForm.avatarUrl"
                :src="addAccountForm.avatarUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </div>
          </el-upload>
        </el-form-item>
        <!-- 个人信息 -->
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input
            v-model="addAccountForm.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="钉钉ID"
          prop="dingtalkId"
        >
          <el-input
            v-model="addAccountForm.dingtalkId"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="账号类型"
          prop="type"
        >
          <el-radio-group v-model="addAccountForm.type">
            <el-radio :label="1">内网</el-radio>
            <el-radio :label="2">外网</el-radio>
            <el-radio :label="3">第三方</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addAccountForm.password"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="active"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="addAccountForm.active"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            type="textarea"
            placeholder="请输入备注, 不超过300字"
            v-model="addAccountForm.introduction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="300"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitAddAccountRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addAccountDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddAccountForm"
        >重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑账号对话框 -->
    <el-dialog
      title="编辑账号"
      :visible.sync="editAccountDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="editAccountFormRef"
        :model="editAccountForm"
        :rules="editAccountFormRules"
        label-width="120px"
      >
        <!-- 账号头像 -->
        <el-form-item
          label="头像"
          prop="avatar"
          style="height: 80px"
        >
          <el-upload
            class="avatar-uploader"
            action="no_use"
            :http-request="editUploadAvatarRequest"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-change="onChangeUpload"
            ref="editAvatarRef"
            :drag="false"
            accept="image/png, image/jpeg"
            list-type="picture"
            :multiple="false"
            :auto-upload="true"
          >
            <div class="avatar">
              <img
                v-if="editAccountForm.avatarUrl"
                :src="editAccountForm.avatarUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </div>
          </el-upload>
        </el-form-item>
        <!-- 个人信息 -->
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input
            v-model="editAccountForm.username"
            clearable
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="钉钉ID"
          prop="dingtalkId"
        >
          <el-input
            v-model="editAccountForm.dingtalkId"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="账号类型"
          prop="type"
        >
          <el-radio-group v-model="editAccountForm.type">
            <el-radio :label="1">内网</el-radio>
            <el-radio :label="2">外网</el-radio>
            <el-radio :label="3">第三方</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="editAccountForm.password"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="active"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="editAccountForm.active"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            type="textarea"
            placeholder="请输入备注, 不超过300字"
            v-model="editAccountForm.remark"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="300"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitEditAccountRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="editAccountDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>

    <!-- 账号详情 -->
    <el-dialog
      ref="accountDetailDialogRef"
      :visible.sync="accountDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="账号详情"
        :column="4"
        direction="horizontals"
        border
        colon
        :labelStyle="detailLabelStyle"
        :contentStyle="detailContentStyle"
      >
        <el-descriptions-item
          label="账号ID"
          :span="2"
        >{{detailAccountForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="头像"
          :span="2"
        >
          <div class="avatar">
            <img
              v-if="detailAccountForm.avatarUrl"
              :src="detailAccountForm.avatarUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-account avatar-uploader-icon"
            ></i>
          </div>
        </el-descriptions-item>
        <el-descriptions-item
          label="账号"
          :span="2"
        >{{detailAccountForm.username}}</el-descriptions-item>
        <el-descriptions-item
          label="类型"
          :span="2"
        >
          <el-radio-group v-model="detailAccountForm.type">
            <el-radio :label="1">内网</el-radio>
            <el-radio :label="2">外网</el-radio>
            <el-radio :label="3">第三方</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          label="钉钉ID"
          :span="2"
        >{{detailAccountForm.dingtalkId}}</el-descriptions-item>
        <el-descriptions-item
          label="密码"
          :span="2"
        >{{detailAccountForm.password}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="4"
        >
          <template>
            {{detailAccountForm.updatedTime | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="密码更新"
          :span="4"
        >
          <template>
            {{detailAccountForm.passwordUpd | dateFormat}}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="状态"
          :span="4"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="detailAccountForm.active"
            disabled
          ></el-switch>
        </el-descriptions-item>
        <el-descriptions-item
          label="备注"
          :span="4"
        >{{detailAccountForm.remark}}</el-descriptions-item>
      </el-descriptions>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="accountDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '../../utils/upload.js'
import {
  queryAccountById,
  deleteAccountById,
  addAccount,
  editAccount,
  queryByConditions
} from '../../api/system/account'
export default {
  created () {
    this.getAccountList()
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
      accountList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        query: ''
      },
      addAccountDialogVisible: false,
      editAccountDialogVisible: false,
      accountDetailDialogVisible: false,
      avatarUrl: '',
      avatarPreviewUrl: '',
      // 上传头像对话框显示与否
      uploadProfile: false,
      confirmProfile: false,
      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      addAccountForm: {},
      editAccountForm: {},
      detailAccountForm: {},
      addAccountFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2~30个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        dingtalkId: [
          { required: false },
          { min: 2, max: 30, message: '请输入2~30个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '账号类型', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '请输入6~30个字符', trigger: 'blur' }
        ],
        active: [
          { required: true, message: '是否启用', trigger: 'blur' }
        ],
        introduction: [
          { required: false }
        ],
        avatar: [
          { required: false }
        ]
      },
      editAccountFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2~30个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        dingtalkId: [
          { required: false },
          { min: 2, max: 30, message: '请输入2~30个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '账号类型', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '请输入6~30个字符', trigger: 'blur' }
        ],
        active: [
          { required: true, message: '是否启用', trigger: 'blur' }
        ],
        introduction: [
          { required: false }
        ],
        avatar: [
          { required: false }
        ]
      }
    }
  },
  methods: {
    // 获取账号列表
    getAccountList () {
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.accountList = res.data.list
          this.pageInfo.total = res.data.total
        })
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
    // 更新账号状态
    updateAccountStatus (accountId, newStatus) {
      const params = {
        id: accountId,
        active: newStatus
      }
      editAccount(accountId, params)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.$message.success('更新成功!')
        })
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    },
    // 重置新增表单
    resetAddAccountForm () {
      this.$refs.addAccountFormRef.resetFields()
    },
    // 新增请求
    submitAddAccountRequest () {
      this.$refs.addAccountFormRef.validate(valid => {
        if (!valid) {
          return
        }
        addAccount(this.addAccountForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.getAccountList()
            this.$message.success('添加成功')
            // 成功之后,关闭对话框
            this.addAccountDialogVisible = false
            this.$refs.addAccountFormRef.resetFields()
          })
      })
    },
    // 显示编辑对话框
    showEditDialog (accountId) {
      queryAccountById(accountId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.editAccountForm = res.data
          this.editAccountDialogVisible = true
        })
    },
    // 编辑提交
    submitEditAccountRequest () {
      this.$refs.editAccountFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        editAccount(this.editAccountForm.id, this.editAccountForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.$message.success('修改成功!')
            this.editAccountDialogVisible = false
            this.getAccountList()
          })
      })
    },
    // 日期格式化
    dateFormat (dateTime) {
      console.log(dateTime)
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
      this.$refs.editAccountFormRef.resetFields()
    },
    // 显示删除确认框
    showDeleteConfirm (accountId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccountById(accountId)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }

            this.getAccountList()
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
    // 账号详情
    showDetailDialog (accountId) {
      // 查询详情
      queryAccountById(accountId).then(res => {
        if (res.code !== 200) {
          return new Error('查询账号详情失败')
        }
        this.detailAccountForm = res.data
        // 显示详情对话框
        this.accountDetailDialogVisible = true
      })
    },
    // 头像上传
    handleAvatarSuccess (res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw)
    },
    // 头像上传前校验
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!')
      }
      return isLt2M
    },
    // 自定义上传方法
    addUploadAvatarRequest (file) {
      uploadFile(file.file, '/coding-strength', false)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.addAccountForm.avatarUrl = res.data.uri
          console.log(this.addAccountForm)
          console.log(res.data)
          // 关闭，并清空列表
          this.confirmProfile = false
          this.uploadProfile = false
          this.$refs.addAvatarRef.clearFiles()
          return this.$message.success('上传成功')
        }).catch(error => {
          console.error(error)
        })
    },
    editUploadAvatarRequest (file) {
      uploadFile(file.file, '/coding-strength', false)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.editAccountForm.avatarUrl = res.data.uri
          // 关闭，并清空列表
          this.confirmProfile = false
          this.uploadProfile = false
          this.$refs.editAvatarRef.clearFiles()
          return this.$message.success('上传成功')
        }).catch(error => {
          console.error(error)
        })
    },
    onChangeUpload (file) {
      // 预保存上传的图片
      this.previewImgURL = URL.createObjectURL(file.raw)
      // 预览图片
      this.confirmProfile = true
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
