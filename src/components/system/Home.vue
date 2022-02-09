<template>
  <el-container class="home_container">
    <el-header>
      <div class="logo-div">
        <img
          src="../../assets/logo.png"
          alt=""
          style="margin-right:10px; height: 55px;"
        >
        <span>
          <b style="color: yellow; font-size:20px;">C</b>oding
          <b style="color: red; font-size:20px;">S</b>trength
          <b style="color: blue; font-size:20px;">T</b>OP
        </span>
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
        <span class="username">{{this.globalUsername | contentLimit(10)}}</span>
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
          class="el-menu-vertical"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <SubMenu
            class="sub-menu"
            :subMenus="menuTree"
            mode="vertical"
          />
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SubMenu from './SubMenu'
export default {
  components: {
    SubMenu
  },
  created () {
    this.loadMenuTree()
    this.globalUsername = window.sessionStorage.getItem('username')
    this.globalAvatar = window.sessionStorage.getItem('avatar')
  },

  data () {
    return {
      menuTree: [],
      isColloaspMenu: false,
      colloaspFlag: '#icon-Left-1',
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
  width: 250px;
  font-size: 18px;
  line-height: 60px;
  color: rgb(255, 255, 255);
}
.logout-div {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 150px;
  color: rgb(245, 221, 8);
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
.el-icon-arrow-down:before {
  content: '';
}
.el-submenu__icon-arrow {
  color: black;
}
.el-submenu {
  .el-submenu-title {
    display: flex;
    align-items: center;
    color: black !important;
    padding-left: 25px;
    span {
      padding: 0 10px;
    }
    .el-icon-location {
      position: static;
      margin: 0px;
      color: #013c807e;
    }
    span {
      font-size: 18px;
    }
    i {
      font-size: 18px;
    }
    .el-icon-arrow-down {
      position: static;
      margin: 0px;
      font-size: 18px;
      span {
        font-size: 18px;
      }
      i {
        font-size: 18px;
      }
    }
  }
}
</style>
