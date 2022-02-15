<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计日志</el-breadcrumb-item>
    </el-breadcrumb>

    <h3>代码统计日志组建</h3>
    <div style="height: 300px;">
      <el-steps direction="vertical">
        <el-step
          @click.native="handleClick"
          title="Step 1"
          description="descriptiondescriptiondescriptiondescription"
        />
      </el-steps>
    </div>

    <el-dialog>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created () {

  },
  data () {
    return {
      items: []
    }
  },
  methods: {
    handleClick (value) {
      console.log(value)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
