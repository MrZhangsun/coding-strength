<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务术语</el-breadcrumb-item>
      <el-breadcrumb-item>名词检索</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input
            placeholder="按照简称检索"
            v-model="pageInfo.shortName"
            @input="onInput"
            @clear="getTerminologyList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="按照全称检索"
            v-model="pageInfo.fullName"
            @input="onInput"
            @clear="getTerminologyList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="按照关键字检索"
            v-model="pageInfo.keywords"
            @input="onInput"
            @clear="getTerminologyList"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="addTerminologyForm.platform"
            clearable
            placeholder="按照平台检索"
            @clear="getTerminologyList"
            @change="getTerminologyList"
          >
            <el-option
              key="0"
              label="亚马逊"
              value="0"
            />
            <el-option
              key="1"
              label="eBay"
              value="1"
            />
            <el-option
              key="2"
              label="沃尔玛"
              value="2"
            />
            <el-option
              key="3"
              label="速卖通"
              value="4"
            />
            <el-option
              key="5"
              label="独立站"
              value="5"
            />
            <el-option
              key="6"
              label="通用"
              value="6"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getTerminologyList"
          >搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addTerminologyDialogVisible = true"
          >添加词条</el-button>
        </el-col>
      </el-row>
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
      >
        <el-collapse-item
          title="SKU(Stock Keeping Unit)"
          name="1"
        >
          <div>SKU全称为Stock Keeping Unit（库存量单位），即库存进出计量的基本单元，可以是以件，盒，托盘等为单位。SKU这是对于大型连锁超市DC（配送中心）物流管理的一个必要的方法。现在已经被引申为产品统一编号的简称，每种产品均对应有唯一的SKU号。单品：对一种商品而言，当其品牌、型号、配置、等级、花色、包装容量、单位、生产日期、保质期、用途、价格、产地等属性中任一属性与其他商品存在不同时，可称为一个单品。 [1] </div>
        </el-collapse-item>
        <el-collapse-item
          title="Feedback"
          name="2"
        >
          <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
          <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
        </el-collapse-item>
        <el-collapse-item
          title="Efficiency"
          name="3"
        >
          <div>Simplify the process: keep operating process simple and intuitive;</div>
          <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
          <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
        </el-collapse-item>
        <el-collapse-item
          title="Controllability"
          name="4"
        >
          <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
          <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <!-- 添加发布历史对话框 -->
    <el-dialog
      title="新增词条"
      :visible.sync="addTerminologyDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addTerminologyFormRef"
        :model="addTerminologyForm"
        :rules="addTerminologyFormRules"
        label-width="120px"
      >
        <el-form-item
          label="全称"
          prop="fullName"
        >
          <el-input
            placeholder="请输入词条全称"
            v-model="addTerminologyForm.fullName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="简称"
          prop="shortName"
        >
          <el-input
            placeholder="请输入词条简称"
            v-model="addTerminologyForm.shortName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属平台"
          prop="platform"
        >
          <el-select
            v-model="addTerminologyForm.platform"
            clearable
            placeholder="请输选择所属平台"
            @clear="getTerminologyList"
            @change="getTerminologyList"
          >
            <el-option
              key="0"
              label="亚马逊"
              value="0"
            />
            <el-option
              key="1"
              label="eBay"
              value="1"
            />
            <el-option
              key="2"
              label="沃尔玛"
              value="2"
            />
            <el-option
              key="3"
              label="速卖通"
              value="4"
            />
            <el-option
              key="5"
              label="独立站"
              value="5"
            />
            <el-option
              key="6"
              label="通用"
              value="6"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="名词释义"
          prop="introduction"
        >
          <!-- <el-input
            type="textarea"
            placeholder="请输入名词释义, 不超过2000字"
            :autosize="{ minRow: 5, maxRow: 10 }"
            maxlength="2000"
            v-model="addTerminologyForm.introduction"
            show-word-limit
          ></el-input> -->
          <textarea id="uTinymce"></textarea>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitAddTerminologyRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addTerminologyDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddTerminologyForm"
        >重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tinymce from 'tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'

window.tinymce.baseURL = `${window.location.origin}/js/tinymce`
tinymce.init({
  selector: '#uTinymce',
  height: 500
})

export default {
  data () {
    return {
      activeNames: ['1'],
      addTerminologyDialogVisible: false,
      pageInfo: {
        name: ''
      },
      addTerminologyForm: {},
      addTerminologyFormRules: {}
    }
  },
  methods: {
    handleChange (val) {
      console.log(val)
    },
    getTerminologyList () {

    },
    // 对话框关闭提示
    handleClose (done) {
      this.$confirm('确定要关闭对话框?')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    onInput () {
      this.$forceUpdate()
    },
    resetAddTerminologyForm () {

    },
    submitAddTerminologyRequest () {

    }
  }
}
</script>
