<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计分析</el-breadcrumb-item>
      <el-breadcrumb-item>仓库分析</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row
        :gutter="20"
        class="row-search"
      >
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
        <el-col :span="3">
          <el-button type="primary">仓库排名</el-button>
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
          prop="totalBranches"
          label="分支数量"
          align="center"
        />
        <el-table-column
          prop="totalAuthors"
          label="作者数量"
          align="center"
        />
        <el-table-column
          prop="totalAge"
          label="年龄/day"
          align="center"
        />
        <el-table-column
          prop="activeAge"
          label="活跃天数/day"
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
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
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
              content="点击同步"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="info"
                size="mini"
                :icon="scope.row.collectStatus === 1 ? 'el-icon-loading' : ''"
                :disabled="scope.row.collectStatus === 1 ? true : false"
                @click="collectRepository(scope.row.id, scope.row)"
              >
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="scope.row.collectStatus === 0"
                >
                  <use xlink:href="#icon-tongbu1"></use>
                </svg>
              </el-button>
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
      />
    </el-card>

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
import {
  queryRepositoryById,
  queryByConditions
} from '../../../api/coding/repository'
import { collectRepositoryById } from '../../../api/coding/collect'
export default {
  created () {
    this.getRepositoryList()
  },
  data () {
    return {
      repositoryList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        query: ''
      },
      detailRepositoryDialogVisible: false,
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
    // 强制刷新输入框,解决无法输入问题
    onInput () {
      this.$forceUpdate()
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
    /**
     * 仓库同步
     * @param {Integer} repositoryId 仓库ID
     */
    collectRepository (repositoryId, row) {
      row.collectStatus = 1
      collectRepositoryById(repositoryId)
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
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
.row-analysis {
  padding-bottom: 5px;
}
.row-search {
  padding-bottom: 12px;
}
</style>
