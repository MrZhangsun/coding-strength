<template>
  <el-container class="home_container">
    <el-header>
      <div class="title">
        <img
          src="../../assets/logo.png"
          alt=""
        >
        <span>代码统计系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      >退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isColloaspMenu ? '64px' : '175px'">
        <div
          class="collaspBtn"
          @click="collaspMenu"
        >
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use :xlink:href="colloaspFlag"></use>
          </svg>
        </div>
        <el-menu
          :unique-opened="true"
          :router="true"
          :collapse="isColloaspMenu"
          :collapse-transition="false"
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu
            :index="menu.id + ''"
            v-for="menu in menuTree "
            :key="menu.id"
          >
            <template slot="title">
              <i :class="menu.icon"></i>
              <span>{{menu.name}}</span>
            </template>

            <el-menu-item
              @click="clickMenuItem(item.routePath)"
              :index="item.routePath"
              v-for="item in menu.children"
              :key="item.id"
            >
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
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
      colloaspFlag: '#icon-Right-1',
      defaultActive: '/home11'
    }
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功!')
    },
    async loadMenuTree () {
      const { data: res } = await this.$http.get('/system/menus')
      if (res.code !== 200) {
        return this.$message.error('获取菜单失败!')
      }

      this.menuTree = res.data
    },
    collaspMenu () {
      this.isColloaspMenu = !this.isColloaspMenu
      this.colloaspFlag = this.isColloaspMenu ? '#icon-Right-1' : '#icon-Left-1'
    },
    clickMenuItem (activePath) {
      this.defaultActive = activePath
    }
  }
}

</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #333744;
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
  padding-top: 20px;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
}
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
.el-menu {
  border-right: none;
}
.collaspBtn {
  background-color: #333744;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
}
.title {
  padding-left: 20px;
}
</style>
