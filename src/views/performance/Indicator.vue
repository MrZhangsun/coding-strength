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

    <el-form
      ref="indicator"
      :model="indicator"
      label-width="100px"
    >
      <el-row
        :gutter="20"
        v-for="(item,index) in indicator.items"
        :key="index"
      >
        <el-col :span="2">
          <el-form-item
            label="序号"
            :prop="'items.'+index+'.sort'"
          >
            <el-select
              v-model="item.sort"
              clearable
              placeholder="请选择问题类型"
            >
              <el-option
                key="1"
                label="单选"
                :value="1"
              />
              <el-option
                key="2"
                label="多选"
                :value="2"
              />
              <el-option
                key="3"
                label="文本框"
                :value="3"
              />
              <el-option
                key="4"
                label="文本域"
                :value="4"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item
            label="选项"
            :prop="'items.'+index+'.jtcygxdm'"
          >
            <el-input v-model="item.jtcygxdm"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button
              type="danger"
              size="small"
              plain
              @click="removeRow(index)"
            >
              删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :span="6"
          :push="18"
        >
          <el-form-item>
            <el-button
              size="small"
              @click="addBuyerInformation"
            >新增购房人基本信息</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
<script>
export default {

  data () {
    return {
      indicator: {
        items: [
        ]
      }
    }
  },
  methods: {
    // 新增购房人基本信息
    addBuyerInformation () {
      const that = this
      that.indicator.items.push({})
    },
    // 删除购房人基本信息
    removeRow (index) {
      if (index >= 0) {
        this.indicator.items.splice(index, 1)
      }
    }
  }
}
</script>
