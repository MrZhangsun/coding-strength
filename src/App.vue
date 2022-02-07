<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
/* 菜单折叠样式 */
.el-menu--collapse > .el-menu-item .el-submenu__icon-arrow,
.el-menu--collapse
  > .sub-menu
  > .el-submenu
  > .el-submenu__title
  .el-submenu__icon-arrow {
  display: none;
}
.el-menu--collapse > .el-menu-item span,
.el-menu--collapse > .sub-menu > .el-submenu > .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>
