<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="search by username" v-model="pageInfo.query" @input="onInput" @clear="getUserList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="userList" :border="true" stripe :header-cell-style="{'text-align':'center'}">
        <el-table-column type="index" label="#" align="center"/>
        <el-table-column
          prop="id"
          label="ID"
          align="center"/>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"/>
        <el-table-column
          prop="sex"
          label="性别"
          align="center">
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
          align="center"/>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"/>
        <el-table-column
          prop="active"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              @change="updateUserStatus(scope.row.id, scope.row.active)"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
          align="center">
          <template
            slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteConfirm(scope.row.id)" />
            <el-tooltip effect="dark" content="设置" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" />
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
        :total="pageInfo.total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      :before-close="handleClose">
      <!-- 表单项 https://gateway-test-a.vevor.net/bmp-pus-service/controller-uploadService/front/single/upload -->
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="120px">
        <!-- 用户头像 -->
        <el-form-item label="头像" prop="avatar">
          <!-- 头像显示 -->
          <div calss="demo-image">
            <el-image id="image" style="width:100px; height: 100px" :src="addUserForm.avatar + '?' + Date()"
              fit="cover">
            </el-image>
            <el-button type="text" title="修改头像" @click="uploadProfile = true">
              修改头像
            </el-button>
          </div>
          <!-- 上传头像弹窗 -->
          <el-dailog title="上传头像" width="420px" :visible.sync="uploadProfile" :before-close="beforeDailogClose">
            <!-- drag upload -->
            <el-upload
              class="upload-demo"
              ref="uploadRef"
              :drag="true"
              accept="image/*"
              list-type="picture"
              :multiple="false"
              :auto-upload="false"
              action="no_use"
              :http-request="uploadPicturePost"
              :on-change="onChangeUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处,<em>点击上传</em></div>
              <div class="el-upload__tip">只能上传png,不大于2MB</div>
            </el-upload>
            <!-- 图片预览子弹框 -->
            <el-dailog width="30%" title="头像预览" :visibal.sync="confirmProfile" :append-to-body="true" :before-close="beforeDailogClose">
              确认更改头像如下嘛? <br>
              <div align="center">
                <el-image style="width: 200px; height: 200px;" :src="previewImageUrl" fit=cover></el-image>
              </div>
              <div slot="footer" class="dailog-footer">
                <el-button class="confirmCancel">换一个</el-button>
                <el-button type="primary" class="confirmSubmit">确认</el-button>
              </div>
            </el-dailog>
          </el-dailog>
        </el-form-item>
        <!-- 个人信息 -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addUserForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="active">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="addUserForm.active"></el-switch>
        </el-form-item>
        <el-form-item label="个人简介" prop="introduction">
          <el-input type="textarea" placeholder="请输入个人简介, 不超过1000字"
            v-model="addUserForm.introduction"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="1000"
            show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddUserRequest">确定</el-button>
        <el-button type="danger" :before-close="handleClose"  @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="info" @click="resetAddUserForm">重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      ref="editUserDialogRef"
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed">
      <!-- 表单项 -->
      <el-form ref="editUserFormRef" :model="editUserForm" :rules="editUserFormRules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editUserForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editUserForm.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="editUserForm.age"
            :min="1"
            :max="120">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="useStatus">
          <el-switch v-model="editUserForm.useStatus"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditUserRequest">确定</el-button>
        <el-button type="danger" :before-close="handleClose"  @click="editUserDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    const SpecialCharValidator = (rule, value, callback) => {
      const regEn = /[`~!@#$%^&*()_+<>?:"{},./;']/
      const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】]/
      if (regEn.test(value) || regCn.test(value)) {
        return callback(new Error('名称中不能包含特殊字符'))
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
      avatarUrl: '',
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
      addUserFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 30, message: '请输入3~30个字符', trigger: 'blur' },
          { validator: SpecialCharValidator, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        active: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ]
      },
      editUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 30, message: '请输入3~30个字符', trigger: 'blur' },
          { validator: usernameValidator, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入3~10个字符', trigger: 'bulr' },
          { validator: usernameValidator, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.pageInfo })
      if (res.code !== 200) {
        return this.$message.error('获取用户列表数据失败!')
      }
      this.userList = res.data.list
      this.pageInfo.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getUserList()
    },
    updateUserStatus (userId, newStatus) {
      const params = {
        userId: userId,
        useStatus: newStatus
      }
      this.$http.put('/user/' + userId, params)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }
          this.$message.success('更新成功!')
        })
    },
    onInput () {
      this.$forceUpdate()
    },
    resetAddUserForm () {
      this.$refs.addUserFormRef.resetFields()
    },
    submitAddUserRequest () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('/user', this.addUserForm)
        if (res.code !== 200) {
          return this.$message.error('新增用户失败')
        }
        this.getUserList()
        this.$message.success('添加成功')
        // 成功之后,关闭对话框
        this.addUserDialogVisible = false
      })
    },
    showEditDialog (userId) {
      this.$http.get('/user/' + userId)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }
          this.editUserForm = res.data
          this.editUserDialogVisible = true
        })
    },
    submitEditUserRequest () {
      this.$refs.editUserFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http.put('/user/' + this.editUserForm.userId, this.editUserForm)
          .then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message)
            }
            this.$message.success('修改成功!')
            this.editUserDialogVisible = false
            this.getUserList()
          })
      })
    },
    handleClose (done) {
      this.$confirm('确定要关闭对话框?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    editDialogClosed () {
      this.$refs.editUserFormRef.resetFields()
    },
    showDeleteConfirm (userId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/user/' + userId)
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
    handleAvatarSuccess (res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!')
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style lang="less" scoped>
  .el-table {
    width: 100%;
    height: 100%;
  }
</style>
