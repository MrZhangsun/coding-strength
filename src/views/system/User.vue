<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="请输入姓名"
            v-model="pageInfo.name"
            @input="onInput"
            @clear="getUserList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入手机"
            v-model="pageInfo.mobile"
            @input="onInput"
            @clear="getUserList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入邮箱"
            v-model="pageInfo.email"
            @input="onInput"
            @clear="getUserList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.active"
            clearable
            placeholder="请选择状态"
            @clear="getUserList"
            @change="getUserList"
          >
            <el-option
              key="1"
              label="启用"
              value="1"
            >
            </el-option>
            <el-option
              key="0"
              label="禁用"
              value="0"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.sex"
            clearable
            placeholder="请选择性别"
            @clear="getUserList"
            @change="getUserList"
          >
            <el-option
              key="0"
              label="未知"
              value="0"
            >
            </el-option>
            <el-option
              key="1"
              label="男"
              value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="女"
              value="2"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getUserList"
          >搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addUserDialogVisible = true"
          >添加</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="userList"
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
          prop="name"
          label="姓名"
          align="center"
        />
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '0'">未知</span>
            <span v-if="scope.row.sex == '1'">男</span>
            <span v-if="scope.row.sex == '2'">女</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机"
          width="185px"
          align="center"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
        />
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
              @change="updateUserStatus(scope.row.id, scope.row.active)"
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

    <!-- 添加用户对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addUserFormRef"
        :model="addUserForm"
        :rules="addUserFormRules"
        label-width="120px"
      >
        <!-- 用户头像 -->
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
                v-if="addUserForm.avatar"
                :src="addUserForm.avatar"
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
          label="姓名"
          prop="name"
        >
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          prop="sex"
        >
          <el-radio-group v-model="addUserForm.sex">
            <el-radio label="0">未知</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="active"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="addUserForm.active"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="个人简介"
          prop="introduction"
        >
          <el-input
            type="textarea"
            placeholder="请输入个人简介, 不超过1000字"
            v-model="addUserForm.introduction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
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
          @click="submitAddUserRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addUserDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddUserForm"
        >重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      ref="editUserDialogRef"
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed"
    >
      <!-- 表单项 -->
      <el-form
        ref="editUserFormRef"
        :model="editUserForm"
        :rules="editUserFormRules"
        label-width="120px"
      >
        <!-- 用户头像 -->
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
                v-if="editUserForm.avatar"
                :src="editUserForm.avatar"
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
          label="姓名"
          prop="name"
        >
          <el-input v-model="editUserForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          prop="sex"
        >
          <el-radio-group v-model="editUserForm.sex">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="active"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="editUserForm.active"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="个人简介"
          prop="introduction"
        >
          <el-input
            type="textarea"
            placeholder="请输入个人简介, 不超过1000字"
            v-model="editUserForm.introduction"
            :autosize="{ minRow: 10, maxRow: 10 }"
            maxlength="1000"
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
          @click="submitEditUserRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="editUserDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>

    <!-- 用户详情 -->
    <el-dialog
      ref="userDetailDialogRef"
      :visible.sync="userDetailDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="用户详情"
        :column="4"
        direction="horizontals"
        border
        colon
        :labelStyle="detailLabelStyle"
        :contentStyle="detailContentStyle"
      >
        <el-descriptions-item
          label="用户ID"
          :span="2"
        >{{detailUserForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="头像"
          :span="2"
        >
          <div class="avatar">
            <img
              v-if="detailUserForm.avatar"
              :src="detailUserForm.avatar"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-user avatar-uploader-icon"
            ></i>
          </div>
        </el-descriptions-item>
        <el-descriptions-item
          label="姓名"
          :span="2"
        >{{detailUserForm.name}}</el-descriptions-item>
        <el-descriptions-item
          label="性别"
          :span="2"
        >
          <el-radio-group v-model="detailUserForm.sex">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          label="手机号"
          :span="2"
        >{{detailUserForm.mobile}}</el-descriptions-item>
        <el-descriptions-item
          label="邮箱"
          :span="2"
        >{{detailUserForm.email}}</el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          :span="4"
        >
          <el-date-picker
            v-model="detailUserForm.updatedTime"
            type="datetime"
            placeholder="Select date and time"
            default-time="12:00:00"
            disabled
          >
          </el-date-picker>
        </el-descriptions-item>
        <el-descriptions-item
          label="状态"
          :span="4"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="detailUserForm.active"
            disabled
          ></el-switch>
        </el-descriptions-item>
        <el-descriptions-item
          label="个人简介"
          :span="4"
        >{{detailUserForm.introduction}}</el-descriptions-item>
      </el-descriptions>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="userDetailDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '../../utils/upload'
import {
  queryUserById,
  deleteUserById,
  addUser,
  editUser,
  queryByConditions
} from '../../api/system/user'
export default {
  created () {
    this.getUserList()
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
    // 手机号码校验
    const mobileValidator = (rule, value, callback) => {
      const result = this.Validator.isPhone(value)
      if (!result) {
        return callback(new Error('请输入合法的手机号码'))
      }
      callback()
    }
    // 邮箱校验
    const emailValidator = (rule, value, callback) => {
      const result = this.Validator.isEmail(value)
      if (!result) {
        return callback(new Error('请输入合法的邮箱'))
      }
      callback()
    }
    return {
      userList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        query: ''
      },
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      userDetailDialogVisible: false,
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
      addUserForm: {
        name: '',
        sex: '',
        mobile: '',
        email: '',
        active: 0,
        introduction: '',
        avatar: ''
      },
      editUserForm: {
        name: '',
        sex: '',
        mobile: '',
        email: '',
        active: 0,
        introduction: '',
        avatar: ''
      },
      detailUserForm: {
        name: '',
        sex: '',
        mobile: '',
        email: '',
        active: 0,
        introduction: '',
        avatar: ''
      },
      addUserFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2~30个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
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
      editUserFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2~30个字符', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
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
    // 获取用户列表
    getUserList () {
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.userList = res.data.list
          this.pageInfo.total = res.data.total
        })
    },
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getUserList()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getUserList()
    },
    // 更新用户状态
    updateUserStatus (userId, newStatus) {
      const params = {
        id: userId,
        active: newStatus
      }
      editUser(userId, params)
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
    resetAddUserForm () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 新增请求
    submitAddUserRequest () {
      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) {
          return
        }
        addUser(this.addUserForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.getUserList()
            this.$message.success('添加成功')
            // 成功之后,关闭对话框
            this.addUserDialogVisible = false
            this.$refs.addUserFormRef.resetFields()
          })
      })
    },
    // 显示编辑对话框
    showEditDialog (userId) {
      queryUserById(userId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.editUserForm = res.data
          this.editUserDialogVisible = true
        })
    },
    // 编辑提交
    submitEditUserRequest () {
      this.$refs.editUserFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        editUser(this.editUserForm.id, this.editUserForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }
            this.$message.success('修改成功!')
            this.editUserDialogVisible = false
            this.getUserList()
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
      this.$refs.editUserFormRef.resetFields()
    },
    // 显示删除确认框
    showDeleteConfirm (userId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserById(userId)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
            }

            this.getUserList()
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
    // 用户详情
    showDetailDialog (userId) {
      // 查询详情
      queryUserById(userId).then(res => {
        if (res.code !== 200) {
          return new Error('查询用户详情失败')
        }
        this.detailUserForm = res.data
        // 显示详情对话框
        this.userDetailDialogVisible = true
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

          this.addUserForm.avatar = res.data.uri
          // 关闭，并清空列表
          this.confirmProfile = false
          this.uploadProfile = false
          this.$refs.addAvatarRef.clearFiles()
          // this.reload()
          return this.$message.success('上传成功')
        }).catch(error => {
          return this.$message.error(error)
        })
    },
    // 自定义上传方法
    editUploadAvatarRequest (file) {
      uploadFile(file.file, '/coding-strength', false)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.editUserForm.avatar = res.data.uri
          // 关闭，并清空列表
          this.confirmProfile = false
          this.uploadProfile = false
          this.$refs.editAvatarRef.clearFiles()
          // this.reload()
          return this.$message.success('上传成功')
        }).catch(error => {
          return this.$message.error(error)
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
