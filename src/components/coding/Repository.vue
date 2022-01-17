<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>仓库配置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="search by repository name"
            v-model="pageInfo.query"
            @input="onInput"
            @clear="getRepositoryList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRepositoryList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addRepositoryDialogVisible = true"
          >添加代码库</el-button>
        </el-col>
      </el-row>
      <!-- 代码仓库列表 -->
      <el-table
        :data="repositoryList"
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
          label="项目名称"
          align="center"
        />
        <el-table-column
          prop="username"
          label="账号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          width="185px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              @change="updateRepositoryStatus(scope.row.id, scope.row.active)"
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
              content="设置"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
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

    <!-- 添加代码仓库对话框 -->
    <el-dialog
      title="新增代码仓库"
      :visible.sync="addRepositoryDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addRepositoryFormRef"
        :model="addRepositoryForm"
        :rules="addRepositoryFormRules"
        label-width="120px"
      >
        <!-- 仓库信息 -->
        <el-form-item
          label="项目名称"
          prop="name"
        >
          <el-input v-model="addRepositoryForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="仓库地址"
          prop="url"
        >
          <el-input v-model="addRepositoryForm.url"></el-input>
        </el-form-item>
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="addRepositoryForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="addRepositoryForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="addRepositoryForm.active"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="仓库简介"
          prop="description"
        >
          <el-input
            type="textarea"
            placeholder="请输入仓库简介, 不超过500字"
            v-model="addRepositoryForm.description"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="500"
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
          @click="submitAddRepositoryRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addRepositoryDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddRepositoryForm"
        >重置</el-button>
      </span>
    </el-dialog>

    <!-- 编辑代码仓库对话框 -->
    <el-dialog
      ref="editRepositoryDialogRef"
      title="编辑代码仓库"
      :visible.sync="editRepositoryDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed"
    >
      <!-- 表单项 -->
      <el-form
        ref="editRepositoryFormRef"
        :model="editRepositoryForm"
        :rules="editRepositoryFormRules"
        label-width="120px"
      >
        <!-- 仓库信息 -->
        <el-form-item
          label="项目名称"
          prop="name"
        >
          <el-input v-model="editRepositoryForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="仓库地址"
          prop="url"
        >
          <el-input v-model="editRepositoryForm.url"></el-input>
        </el-form-item>
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="editRepositoryForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="editRepositoryForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="editRepositoryForm.active"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="仓库简介"
          prop="description"
        >
          <el-input
            type="textarea"
            placeholder="请输入仓库简介, 不超过500字"
            v-model="editRepositoryForm.description"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="500"
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
          @click="submitEditRepositoryRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="editRepositoryDialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '../../utils/upload.js'

export default {
  created () {
    this.getRepositoryList()
  },
  data () {
    // git@code.aliyun.com:vevorcenter/vevor-center.git
    // https://code.aliyun.com/vevorcenter/vevor-center.git
    const urlValidator = (rule, value, callback) => {
      const repositoryUrlRegx = /^(http(s)?:\/\/([^/]+?\/){2}|git@[^:]+:[^/]+?\/).*?.git$/
      const isUrl = repositoryUrlRegx.test(value)

      console.log(isUrl)
      if (!isUrl) {
        return callback(new Error('请输入合法的Git仓库URL'))
      }
      callback()
    }
    return {
      repositoryList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        query: ''
      },
      addRepositoryDialogVisible: false,
      editRepositoryDialogVisible: false,
      avatarUrl: '',
      avatarPreviewUrl: '',
      // 上传头像对话框显示与否
      uploadProfile: false,
      confirmProfile: false,
      addRepositoryForm: {
        name: '',
        url: '',
        username: '',
        password: '',
        status: '',
        description: ''
      },
      editRepositoryForm: {
        name: '',
        url: '',
        username: '',
        password: '',
        status: '',
        description: ''
      },
      addRepositoryFormRules: {
        url: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' },
          { validator: urlValidator, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否启用', trigger: 'change' }
        ]
      },
      editRepositoryFormRules: {
        url: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' },
          { validator: urlValidator, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否启用', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 获取代码仓库列表
    getRepositoryList () {
      this.$http.get('/coding/repositories', { params: this.pageInfo })
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }
          this.repositoryList = res.data.data.list
          this.pageInfo.total = res.data.data.total
        })
    },
    // 分页单位调整,重新刷新列表
    handleSizeChange (newSize) {
      this.pageInfo.pageSize = newSize
      this.getRepositoryList()
    },
    // 下一页
    handleCurrentChange (newPage) {
      this.pageInfo.pageNum = newPage
      this.getRepositoryList()
    },
    // 更新代码仓库状态
    updateRepositoryStatus (repositoryId, newStatus) {
      const params = {
        id: repositoryId,
        status: newStatus
      }
      this.$http.put('/coding/repository/' + repositoryId, params)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }
          this.$message.success('更新成功!')
        })
    },
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
    },
    // 重置新增表单
    resetAddRepositoryForm () {
      this.$refs.addRepositoryFormRef.resetFields()
    },
    // 新增请求
    submitAddRepositoryRequest () {
      this.$refs.addRepositoryFormRef.validate(valid => {
        if (!valid) {
          return
        }
        this.$http.post('/coding/repository', this.addRepositoryForm)
          .then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message)
            }
            this.getRepositoryList()
            this.$message.success('添加成功')
            // 成功之后,关闭对话框
            this.addRepositoryDialogVisible = false
            this.$refs.addRepositoryFormRef.resetFields()
          })
      })
    },
    // 显示编辑对话框
    showEditDialog (repositoryId) {
      this.$http.get('/coding/repository/' + repositoryId)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }
          this.editRepositoryForm = res.data.data
          this.editRepositoryDialogVisible = true
        })
    },
    // 编辑提交
    submitEditRepositoryRequest () {
      this.$refs.editRepositoryFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http.put('/coding/repository/' + this.editRepositoryForm.id, this.editRepositoryForm)
          .then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message)
            }
            this.$message.success('修改成功!')
            this.editRepositoryDialogVisible = false
            this.getRepositoryList()
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
      this.$refs.editRepositoryFormRef.resetFields()
    },
    // 显示删除确认框
    showDeleteConfirm (repositoryId) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/coding/repository/' + repositoryId)
          .then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.message)
            }

            this.getRepositoryList()
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
    uploadAvatarRequest (file) {
      uploadFile(file, '/coding-strength', false)
      const requestParams = new FormData()
      const headers = {
        'Content-Type': 'multipart/form-data'
      }
      requestParams.append('file', file.file)
      requestParams.append('path', '/coding-strength')
      requestParams.append('uniqueName', false)
      this.$http.post('https://gateway-test-a.vevor.net/bmp-pus-service/controller-uploadService/front/single/upload', requestParams, headers)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }

          this.addRepositoryForm.avatar = res.data.data.uri
          // 关闭，并清空列表
          this.confirmProfile = false
          this.uploadProfile = false
          this.$refs.uploadRef.clearFiles()
          // this.reload()
          return this.$message.success('上传成功')
        }).catch(error => {
          console.error(error)
        })
      return false
    },
    onChangeUpload (file) {
      // 预保存上传的图片
      this.previewImgURL = URL.createObjectURL(file.raw)
      this.confirmProfile = true // 预览图片
      console.log(this.previewImgURL)
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
