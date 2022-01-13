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
          prop="userId"
          label="ID"
          align="center"/>
        <el-table-column
          prop="username"
          label="账号"
          width="185px"
          align="center"/>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"/>
        <el-table-column
          prop="age"
          label="年龄"
          align="center"/>
        <el-table-column
          prop="gender"
          label="性别"
          align="center"/>
        <el-table-column
          prop="useStatus"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.useStatus" @change="updateUserStatus(scope.row.userId, scope.row.useStatus)"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
          align="center">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" />
            <el-button type="danger" icon="el-icon-delete" size="mini" />
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
      <!-- 表单项 -->
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="addUserForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addUserForm.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="addUserForm.age"
            :min="1"
            :max="120">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="useStatus">
          <el-switch v-model="addUserForm.useStatus"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddUserRequest">确定</el-button>
        <el-button type="danger" :before-close="handleClose"  @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="info" @click="resetAddUserForm">重置</el-button>
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
    const usernameValidator = (rule, value, callback) => {
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
      addUserForm: {
        username: '',
        nickName: '',
        name: '',
        gender: '',
        age: 0,
        useStatus: true
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' },
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
      if (res.status !== 200) {
        return this.$message.error('获取用户列表数据失败!')
      }
      this.userList = res.data
      this.pageInfo.total = res.total
    },
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getUserList()
    },
    async updateUserStatus (userId, newStatus) {
      const params = {
        userId: userId,
        useStatus: newStatus
      }
      const { data: res } = await this.$http.put('/user/' + userId, params)
      if (res.status !== 200) {
        return this.$message.error('状态更新失败!')
      }

      this.$message.success('更新成功!')
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
        if (res.status !== 200) {
          return this.$message.error('新增用户失败')
        }
        this.getUserList()
        this.$message.success('添加成功')
        // 成功之后,关闭对话框
        this.addUserDialogVisible = false
      })
    },
    handleClose (done) {
      this.$confirm('确定要关闭对话框?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
