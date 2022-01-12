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
    <el-aside :width="isColloaspMenu ? '64px' : '175px'">
      <el-button class="collaspBtn" @click="collaspMenu">{{colloaspFlag}}</el-button>
      <el-menu
        :unique-opened="true"
        :collapse="isColloaspMenu"
        :collapse-transition="false"
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu :index="menu.id + ''" v-for="menu in menuTree " :key="menu.id">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span>{{menu.menuName}}</span>
          </template>

          <el-menu-item v-for="item in menu.children" :key="item.id">
            <i class="el-icon-location"></i>
            <span>{{item.menuName}}</span>
          </el-menu-item>

        </el-submenu>
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
  created () {
    this.loadMenuTree()
  },

  data () {
    return {
      menuTree: [],
      isColloaspMenu: false,
      colloaspFlag: '<<<'
    }
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功!')
    },
    async loadMenuTree () {
      const { data: res } = await this.$http.get('/menus')
      if (res.status !== 200) {
        return this.$message.error('获取菜单失败!')
      }

      this.menuTree = res.data
      console.log(res.data)
    },
    collaspMenu () {
      this.isColloaspMenu = !this.isColloaspMenu
      this.colloaspFlag = this.isColloaspMenu ? '>>>' : '<<<'
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
  }
  .el-main {
    background-color: #eaedf1;
    color: #000;
    text-align: center;
    line-height: 160px;
  }
  .icon-font {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
  .collaspBtn {
    width: 100%;
    padding: 10px;
    text-align: center;
    background-color: #6a6d77;
    color: #fff;
    border-radius: 0px;
    cursor: pointer;
    letter-spacing: 0.1em;
    line-height: 24px;
    font-size: 18px;
    border-color: #6a6d77;
  }
</style>
