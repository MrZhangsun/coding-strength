<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>仓库配置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            placeholder="请输入项目名称"
            v-model="pageInfo.name"
            @input="onInput"
            @clear="getRepositoryList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入仓库地址"
            v-model="pageInfo.url"
            @input="onInput"
            @clear="getRepositoryList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="pageInfo.status"
            clearable
            placeholder="请选择状态"
            @clear="getRepositoryList"
            @change="getRepositoryList"
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
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getRepositoryList"
          >搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addRepositoryDialogVisible = true"
          >添加仓库</el-button>
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
          prop="url"
          label="地址"
          width="330px"
          align="left"
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
              @change="updateRepositoryStatus(scope.row.id, scope.row.status)"
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
          <el-input
            v-model="addRepositoryForm.name"
            disabled
            placeholder="自动填充"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="仓库地址"
          prop="url"
        >
          <el-input
            v-model="addRepositoryForm.url"
            @blur="autoWriteRepositoryName(addRepositoryForm.url)"
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
            v-model="addRepositoryForm.status"
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
          <el-input
            v-model="editRepositoryForm.name"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="仓库地址"
          prop="url"
        >
          <el-input v-model="editRepositoryForm.url"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="editRepositoryForm.status"
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
    <!-- 代码仓库详情对话框 -->
    <el-dialog
      ref="detailRepositoryDialogRef"
      :visible.sync="detailRepositoryDialogVisible"
      width="50%"
    >
      <el-descriptions
        class="margin-top"
        title="仓库详情"
        :column="4"
        direction="horizontals"
        border
        colon
        :labelStyle="detailLabelStyle"
        :contentStyle="detailContentStyle"
      >
        <el-descriptions-item
          label="仓库编号"
          :span="2"
        >{{detialRepositoryForm.id}}</el-descriptions-item>
        <el-descriptions-item
          label="项目名称"
          :span="2"
        >{{detialRepositoryForm.name}}</el-descriptions-item>
        <el-descriptions-item
          label="仓库地址"
          :span="4"
        >{{detialRepositoryForm.url}}</el-descriptions-item>
        <el-descriptions-item
          label="仓库账号"
          :span="2"
        >{{detialRepositoryForm.username}}</el-descriptions-item>
        <el-descriptions-item
          label="账号密码"
          :span="2"
        >{{detialRepositoryForm.password}}</el-descriptions-item>
        <el-descriptions-item
          label="贡献者数量"
          :span="2"
        >{{detialRepositoryForm.totalAuthors}}</el-descriptions-item>
        <el-descriptions-item
          label="分支数量"
          :span="2"
        >{{detialRepositoryForm.totalBranches}}</el-descriptions-item>
        <el-descriptions-item
          label="项目周期"
          :span="4"
        >
          {{detialRepositoryForm.totalAge}} days, {{detialRepositoryForm.activeAge}} active days ({{detialRepositoryForm.activeAge * 100 / detialRepositoryForm.totalAge}}%)
        </el-descriptions-item>
        <el-descriptions-item
          label="统计时间"
          :span="4"
        >
          {{detialRepositoryForm.updatedTime | dateFormat}}
        </el-descriptions-item>
        <el-descriptions-item
          label="解析状态"
          :span="4"
        >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            v-model="detialRepositoryForm.status"
            disabled
          ></el-switch>
        </el-descriptions-item>
        <el-descriptions-item
          label="项目简介"
          :span="4"
        >{{detialRepositoryForm.description}}</el-descriptions-item>
      </el-descriptions>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="detailRepositoryDialogVisible = false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '../../utils/upload'
import {
  queryRepositoryById,
  deleteRepositoryById,
  addRepository,
  editRepository,
  queryByConditions
} from '../../api/coding/repository'
export default {
  created () {
    this.getRepositoryList()
  },
  data () {
    // git@code.aliyun.com:vevorcenter/vevor-center.git
    // https://code.aliyun.com/vevorcenter/vevor-center.git
    const urlValidator = (rule, value, callback) => {
      const isUrl = this.Validator.isSshRepositoryURL(value)
      if (!isUrl) {
        return callback(new Error('请输入SSH协议的地址'))
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
      detailRepositoryDialogVisible: false,
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
      detialRepositoryForm: {
        id: '',
        name: '',
        url: '',
        username: '',
        password: '',
        status: '',
        description: '',
        totalAuthors: '',
        totalBranches: '',
        totalAge: '',
        avtiveAge: '',
        updatedTime: ''
      },
      detailLabelStyle: {
        width: '100px',
        'text-align': 'left'
      },
      detailContentStyle: {
        'font-size': '12px'
      },
      addRepositoryFormRules: {
        url: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' },
          { validator: urlValidator, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否启用', trigger: 'blur' }
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
        status: [
          { required: true, message: '是否启用', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取代码仓库列表
    getRepositoryList () {
      queryByConditions(this.pageInfo)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.repositoryList = res.data.list
          this.pageInfo.total = res.data.total
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
      editRepository(repositoryId, params)
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
    resetAddRepositoryForm () {
      this.$refs.addRepositoryFormRef.resetFields()
    },
    // 新增请求
    submitAddRepositoryRequest () {
      this.$refs.addRepositoryFormRef.validate(valid => {
        if (!valid) {
          return
        }
        addRepository(this.addRepositoryForm)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
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
      queryRepositoryById(repositoryId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.editRepositoryForm = res.data
          this.editRepositoryDialogVisible = true
        })
    },
    // 详情对话框
    showDetailDialog (repositoryId) {
      queryRepositoryById(repositoryId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.detialRepositoryForm = res.data
          this.detailRepositoryDialogVisible = true
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
        deleteRepositoryById(repositoryId)
          .then(res => {
            if (res.code !== 200) {
              return this.$message.error(res.message)
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
    /**
     * 自动补充仓库名称
     * @param repositoryUrl 仓库地址
     */
    autoWriteRepositoryName (repositoryUrl) {
      const isUrl = this.Validator.isGitRepositoryUrl(repositoryUrl)
      if (!isUrl) {
        return null
      }

      const parts = repositoryUrl.split('/')
      let repositoryName = parts[parts.length - 1]
      repositoryName = repositoryName.slice(0, -4)
      this.addRepositoryForm.name = repositoryName
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
