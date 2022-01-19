<template>
  <el-container class="home_container">
    <el-header>
      <div class="logo-div">
        <img
          src="../../assets/logo.png"
          alt=""
        >
        <span>Coding Strength Top</span>
      </div>
      <div class="logout-div">
        <div
          class="avatar-div"
          @click="isDisplayLogout = (isDisplayLogout == 'block' ? 'none' : 'block')"
        >
          <el-avatar
            :src="this.globalAvatar"
            icon="el-icon-user-solid"
            :size="35"
          >
          </el-avatar>
        </div>
        <span class="username">{{this.globalUsername}}</span>
        <el-button
          class="logoutBtn"
          :style="{'display': isDisplayLogout}"
          @click="logout"
        >退出</el-button>
      </div>
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
    this.globalUsername = window.sessionStorage.getItem('username')
    this.globalAvatar = window.sessionStorage.getItem('avatar')
  },

  data () {
    return {
      menuTree: [],
      isColloaspMenu: false,
      colloaspFlag: '#icon-Right-1',
      defaultActive: '/home11',
      isDisplayLogout: 'none',
      globalUsername: '',
      globalAvatar: ''
    }
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功!')
    },
    loadMenuTree () {
      this.$http.get('/system/menus')
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.message)
          }
          this.menuTree = res.data.data
        })
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
  height: 200px;
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  align-items: center;
}
.logo-div {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  height: 100%;
  width: 230px;
  font-size: 18px;
  color: rgb(252, 235, 5);
}
.logout-div {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 150px;
}
.avatar-div {
  padding: 10px;
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
.logoutBtn {
  position: fixed;
  top: 60px;
}
</style>
