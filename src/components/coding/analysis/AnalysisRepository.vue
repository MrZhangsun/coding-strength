<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代码统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计分析</el-breadcrumb-item>
      <el-breadcrumb-item>仓库统计</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>仓库统计</h3>
    <el-select
      v-model="value"
      placeholder="请选择"
      filterable
      :filter-method="dataFilter"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  data () {
    return {
      optionsCopy: [
        {
          value: '1',
          label: 'meat'
        }, {
          value: '2',
          label: 'drink'
        }, {
          value: '3',
          label: 'food'
        }, {
          value: '4',
          label: '龙须面'
        }, {
          value: '5',
          label: '北京烤鸭'
        }
      ],
      options: [
        {
          value: '1',
          label: 'meat'
        }, {
          value: '2',
          label: 'drink'
        }, {
          value: '3',
          label: 'food'
        }, {
          value: '4',
          label: '龙须面'
        }, {
          value: '5',
          label: '北京烤鸭'
        }
      ],
      value: ''
    }
  },
  methods: {
    dataFilter (val) {
      this.value = val
      if (val) {
        this.options = this.optionsCopy.filter((item) => {
          if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else {
        this.options = this.optionsCopy
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
