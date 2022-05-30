<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>绩效管理</el-breadcrumb-item>
      <el-breadcrumb-item>考核指标</el-breadcrumb-item>
    </el-breadcrumb>

    <h3>
      <el-button icon="el-icon-loading">考核指标规划中</el-button>
    </h3>

    <ul>
      <li>代码量</li>
      <li>缺陷数量</li>
      <li>请假时长</li>
      <li>加班时长</li>
      <li>工时饱和度</li>
      <li>技术分享</li>
      <li>社区贡献</li>
    </ul>
  </div>
</template>
<script>
export default {

  data () {
    return {}
  },
  methods: {
  }
}
</script>
