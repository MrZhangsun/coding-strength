<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row
        :gutter="20"
        style="margin-bottom: 16px"
      >
        <el-col :span="12">
          <el-input
            placeholder="查找菜单"
            v-model="menuFilterText"
            @input="onInput"
            clearable
          >
            <el-button
              slot="append"
              :icon="expandIcon"
              @click="expandMenu"
            >{{this.expandText}}</el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addRootMenu"
          >添加根节点</el-button>
        </el-col>

      </el-row>

      <!-- 菜单树 -->
      <el-tree
        :data="menuTree"
        node-key="id"
        default-expand-all
        draggable
        highlight-curren
        :filter-node-method="filterNode"
        :expand-on-click-node="true"
        ref="MenuTreeRef"
        @node-drop="handleDrag"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)"
            >
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => edit(data)"
            >
              Edit
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              Delete
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-card>

    <!-- 添加菜单对话框 -->
    <el-dialog
      title="新增菜单"
      :visible.sync="addMenuDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="addMenuFormRef"
        :model="addMenuForm"
        :rules="addMenuRule"
        label-width="120px"
      >
        <el-form-item
          label="上级菜单"
          prop="parentId"
        >
          <el-input
            clearable
            placeholder="请输入上级菜单ID"
            v-model="addMenuForm.parentId"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单名称"
          prop="name"
        >
          <el-input
            clearable
            placeholder="请输入菜单名称"
            v-model="addMenuForm.name"
            @input="onInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单路径"
          prop="routePath"
        >
          <el-input
            clearable
            placeholder="请输入菜单路由"
            v-model="addMenuForm.routePath"
            @input="onInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图标类型"
          prop="icon"
        >
          <el-input
            clearable
            placeholder="eg: icon-font el-icon-data-line"
            v-model="addMenuForm.icon"
            @input="onInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="排序值"
          prop="sortNum"
        >
          <el-input-number
            v-model="addMenuForm.sortNum"
            :min="1"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="addMenuForm.type"
            clearable
            placeholder="请选择类型"
          >
            <el-option
              key="1"
              label="菜单"
              value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="按钮"
              value="2"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitAddMenuRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="addMenuDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetAddMenuForm"
        >重置</el-button>
      </span>
    </el-dialog>
    <!-- 编辑菜单对话框 -->
    <el-dialog
      title="新增菜单"
      :visible.sync="editMenuDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单项 -->
      <el-form
        ref="editMenuFormRef"
        :model="editMenuForm"
        :rules="editMenuRule"
        label-width="120px"
      >
        <el-form-item
          label="上级菜单"
          prop="parentId"
        >
          <el-input
            clearable
            placeholder="请输入上级菜单ID"
            v-model="editMenuForm.parentId"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单ID"
          prop="id"
        >
          <el-input
            clearable
            placeholder="请输入菜单ID"
            v-model="editMenuForm.id"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单名称"
          prop="name"
        >
          <el-input
            clearable
            placeholder="请输入菜单名称"
            v-model="editMenuForm.name"
            @input="onInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单路径"
          prop="routePath"
        >
          <el-input
            clearable
            placeholder="请输入菜单路由"
            v-model="editMenuForm.routePath"
            @input="onInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图标类型"
          prop="icon"
        >
          <el-input
            clearable
            placeholder="eg: icon-font el-icon-data-line"
            v-model="editMenuForm.icon"
            @input="onInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="排序值"
          prop="sortNum"
        >
          <el-input-number
            v-model="editMenuForm.sortNum"
            :min="1"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="editMenuForm.type"
            clearable
            placeholder="请选择类型"
          >
            <el-option
              key="1"
              label="菜单"
              value="1"
            >
            </el-option>
            <el-option
              key="2"
              label="按钮"
              value="2"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitEditMenuRequest"
        >确定</el-button>
        <el-button
          type="danger"
          :before-close="handleClose"
          @click="editMenuDialogVisible = false"
        >取消</el-button>
        <el-button
          type="info"
          @click="resetEditMenuForm"
        >重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryMenuTree,
  addMenu,
  editMenu,
  deleteMenuById
} from '../../api/system/menu'

// let id = 1000
export default {
  watch: {
    menuFilterText (filterText) {
      this.$refs.MenuTreeRef.filter(filterText)
    }
  },
  created () {
    this.loadingMenuTree()
  },
  data () {
    const specialCharValidator = (rule, value, callback) => {
      if (this.Validator.isContainsSpecialChar(value)) {
        return callback(new Error('名称中不能包含特殊字符'))
      }
      callback()
    }
    const menuTree = []
    return {
      menuTree: JSON.parse(JSON.stringify(menuTree)),
      addMenuDialogVisible: false,
      addMenuForm: {
        parent: {}
      },
      addMenuRule: {
        parentId: [
          { required: true, message: '请携带上级菜单ID', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        routePath: [
          { required: true, message: '请输入菜单路由地址', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入菜单图标样式', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ]
      },
      editMenuRule: {
        parentId: [
          { required: true, message: '请携带上级菜单ID', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请携带菜单ID', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { validator: specialCharValidator, trigger: 'blur' }
        ],
        routePath: [
          { required: true, message: '请输入菜单路由地址', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入菜单图标样式', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ]
      },
      editMenuDialogVisible: false,
      editMenuForm: {
        parent: {}
      },
      menuFilterText: '',
      expandSwitcher: true,
      expandText: '收起菜单',
      expandIcon: 'el-icon-arrow-up'
    }
  },

  methods: {
    /**
     * 加载菜单树
     */
    loadingMenuTree () {
      queryMenuTree().then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.menuTree = res.data
      })
    },
    /**
     * 添加节点
     * @param parent 要添加节点的父级节点
     */
    append (parent) {
      this.addMenuDialogVisible = true
      this.addMenuForm.parentId = parent.id
    },
    /**
     * 添加根菜单
     */
    addRootMenu () {
      const root = { id: 0, label: 'root', children: [] }
      this.append(root)
    },
    /**
     * 删除节点
     * @param node 菜单树
     * @param data 当前删除节点
     */
    remove (node, data) {
      this.$confirm('确定要删除当前记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        deleteMenuById(data.id).then(result => {
          if (result.code !== 200) {
            return this.$message.error(result.message)
          }
          // 前台删除
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
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

    /**
     * 所编辑的节点
     * @param node 被编辑的节点
     */
    edit (node) {
      // 回显
      this.editMenuForm.id = node.id
      this.editMenuForm.label = node.label
      this.editMenuForm.name = node.name
      this.editMenuForm.type = node.type
      this.editMenuForm.icon = node.icon
      this.editMenuForm.routePath = node.routePath
      this.editMenuForm.parentId = node.parentId
      this.editMenuForm.sortNum = node.sortNum
      // 传递node
      this.editMenuDialogVisible = true
    },
    /**
     * 新增
     */
    submitAddMenuRequest () {
      this.$refs.addMenuFormRef.validate(valid => {
        if (!valid) {
          return
        }
        // 后台新增
        this.addMenuForm.label = this.addMenuForm.name
        addMenu(this.addMenuForm).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          this.addMenuForm.id = res.data
          // 新添加的节点
          const node = {}
          node.id = this.addMenuForm.id
          node.label = this.addMenuForm.label
          node.name = this.addMenuForm.name
          node.type = this.addMenuForm.type
          node.icon = this.addMenuForm.icon
          node.routePath = this.addMenuForm.routePath
          node.parentId = this.addMenuForm.parentId
          const parentId = this.addMenuForm.parentId
          if (parentId === 0) {
            this.menuTree.push(node)
          } else {
            // 更新菜单树
            const menuTree = this.$refs.MenuTreeRef.store.root.data
            this.foreachTreeNode(parentId, menuTree, (parent) => {
              if (!parent.children) {
                this.$set(parent, 'children', [])
              }
              parent.children.push(node)
            })
          }

          // 关闭窗口,重置表单
          this.addMenuDialogVisible = false
          // 重置中间变量
          this.$refs.addMenuFormRef.resetFields()
          this.addMenuForm = {}
          // 成功提示
          this.$message.success('添加成功')
        })
      })
    },
    /**
     * 编辑
     */
    submitEditMenuRequest () {
      this.$refs.editMenuFormRef.validate(valid => {
        if (!valid) {
          return
        }
        // 后台新增
        this.editMenuForm.label = this.editMenuForm.name
        editMenu(this.editMenuForm).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }

          // 更新菜单树
          const menuId = this.editMenuForm.id
          const menuTree = this.$refs.MenuTreeRef.store.root.data
          this.foreachTreeNode(menuId, menuTree, (element) => {
            element.id = this.editMenuForm.id
            element.label = this.editMenuForm.label
            element.name = this.editMenuForm.name
            element.type = this.editMenuForm.type
            element.icon = this.editMenuForm.icon
            element.routePath = this.editMenuForm.routePath
            element.parentId = this.editMenuForm.parentId
            element.sortNum = this.editMenuForm.sortNum
          })
          // 关闭对话框
          this.editMenuDialogVisible = false
          this.$refs.editMenuFormRef.resetFields()

          // 重新加载菜单树
          this.loadingMenuTree()
          this.$message.success('编辑成功!')
        })
      })
    },
    /**
     * 递归菜单树,编辑树
     * @param {Integer} menuId 查找的菜单ID
     * @param {Array} nodes 菜单树
     * @param {Function} editHandle 回调函数
     */
    foreachTreeNode (menuId, node, editHandle) {
      const nodes = Array.from(node)
      for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index]
        if (menuId === element.id) {
          editHandle(element)
          return
        }

        const children = element.children
        if (children.length === 0) {
          continue
        }
        this.foreachTreeNode(menuId, children, editHandle)
      }
    },
    /**
     * 过滤菜单
     */
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**
     * 重置添加表单
     */
    resetAddMenuForm () {
      this.$refs.addMenuFormRef.resetFields()
    },
    /**
     * 重置新增表单
     */
    resetEditMenuForm () {
      this.$refs.editMenuFormRef.resetFields()
    },
    /**
     * 对话框关闭提示
     */
    handleClose (done) {
      this.$confirm('确定要关闭对话框?')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    /**
     * 刷新输入框
     */
    onInput () {
      this.$forceUpdate()
    },
    /**
     * 展开或折叠菜单
     */
    expandMenu () {
      this.expandSwitcher = !this.expandSwitcher
      this.expandSwitcher === true ? this.expandText = '收起菜单' : this.expandText = '打开菜单'
      this.expandText = this.expandSwitcher ? '收起菜单' : '打开菜单'
      this.expandIcon = this.expandSwitcher ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.expandNodes(this.$refs.MenuTreeRef.store.root)
    },
    /**
     * 遍历树形数据，设置每一项的expanded属性，实现展开收起
     */
    expandNodes (node) {
      node.expanded = this.expandSwitcher
      for (let i = 0; i < node.childNodes.length; i++) {
        node.childNodes[i].expanded = this.expandSwitcher
        if (node.childNodes[i].childNodes.length > 0) {
          this.expandNodes(node.childNodes[i])
        }
      }
    },
    /**
     * 拖动处理
     * @param {Object} dragNode 拖动的节点
     * @param {Object} dragEndNode 拖动结束的节点
     * @param {Object} dragType 拖动的类型
     * @param {Object} dragEvent 拖动事件
     */
    handleDrag (dragNode, dragEndNode, dragType, dragEvent) {
      const dragForm = {}
      dragForm.id = dragNode.data.id
      if (dragType === 'inner') {
        dragForm.parentId = dragEndNode.data.id
      } else {
        dragForm.parentId = dragEndNode.data.parentId
      }

      editMenu(dragForm)
    },
    /**
     * 是否允许删除
     */
    allowDrop (draggingNode, dropNode, type) {
      return false
    },
    /**
     * 是否允许拖动
     */
    allowDrag (draggingNode) {
      return true
    }
  }
}
</script>
<style lang="less" scoped>
.custom-tree-node {
  line-height: 55px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0px 30px 0 0;
}

// https://www.imooc.com/article/286102
</style>
