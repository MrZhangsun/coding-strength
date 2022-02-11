<template>
  <div>
    <template v-for="menu in subMenus">
      <el-submenu
        v-if="menu.children && menu.children.length > 0"
        :key="menu.id"
        :index="menu.routePath"
      >
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{menu.name}}</span>
        </template>
        <SubMenu
          :subMenus="menu.children"
          mode="vertical"
        />
      </el-submenu>
      <el-menu-item
        v-else
        :key="menu.id"
        :index="menu.routePath"
      >
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{menu.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>
<script>

import SubMenu from './SubMenu'
export default {
  name: 'SubMenu',
  components: {
    SubMenu
  },
  props: {
    subMenus: {
      type: Array
    },
    mode: {
      type: String,
      default: 'horizontal'
    }
  }
}
</script>
<style lang="less" scoped>
.icon-font {
  margin-right: 10px;
}
.icon {
  width: 0.8em;
  height: 0.8em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
