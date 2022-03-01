<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>版本统计</el-breadcrumb-item>
      <el-breadcrumb-item>业务反馈</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <ul class="file-list">
        <li
          v-for="(f, index) of files"
          :key="index"
        >
          <span>[文件{{index + 1}}] {{f}}</span>
          <span
            class="copy-btn"
            v-clipboard:copy="f"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
// https://blog.csdn.net/weixin_43173924/article/details/89712290
export default {
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      files: ['fsfsdfsdfs', 'sdfffffffsd']
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    // 复制成功时的回调函数
    onCopy (e) {
      this.$message.success('内容已复制到剪切板！')
    },
    // 复制失败时的回调函数
    onError (e) {
      this.$message.error('抱歉，复制失败！')
    }
  }
}
</script>
