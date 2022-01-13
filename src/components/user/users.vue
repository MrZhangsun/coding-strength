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
          <el-input placeholder="请输入">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
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
            <el-switch v-model="scope.row.useStatus"/>
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
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
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
