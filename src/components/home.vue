<template>
<el-container class="home_container">
  <el-header>
    <div>
      <img src="../assets/logo.png" alt="">
      <span>代码统计系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>一级菜单1</span>
        </template>
        <el-submenu index="1-1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>一级菜单1-1</span>
          </template>
          <el-menu-item index="1-1-1">
            <i class="el-icon-menu"></i>
            <span>菜单项1-1-1</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="1-2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>菜单项1-2</span>
          </template>
        </el-menu-item>
        <el-menu-item index="1-3">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>菜单项1-3</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span>一级菜单2</span>
      </el-menu-item>
    </el-menu>
    </el-aside>
    <el-main>
      Main
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功!')
    }
  }
}

</script>

<style lang="less" scoped>
  .home_container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    color: #fff;
    text-align: left;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    font-size: 20px;
    > div {
      display: flex;
      justify-content: flex-start;
      height: 100%;
      > span {
        margin-left: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    color: #fff;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #eaedf1;
    color: #000;
    text-align: center;
    line-height: 160px;
  }
</style>
