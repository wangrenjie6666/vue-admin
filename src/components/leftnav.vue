/** * 左边菜单 */
<template>
  <el-menu
    :collapse="collapsed"
    collapse-transition
    router
    :default-active="$route.path"
    unique-opened
    class="el-menu-vertical-demo"
    background-color="#fff   "
    text-color="#333"
    active-text-color="#0290FF"
  >
    <div class="logobox" :class="{ 'logobox-all': !collapsed }">
      <img class="logoimg" :src="collapsed ? logo : logoAll" alt="" />
      <div v-show="!collapsed">诚聊帮广告</div>
    </div>
    <div v-for="menu in allmenu" :key="menu.id">
      <el-submenu :index="menu.name" v-if="menu.children != null">
        <template slot="title">
          <i :class="menu.icons" class="iconfont1"></i>
          <span>{{ menu.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="chmenu in menu.children"
            :index="chmenu.resUrl"
            :key="chmenu.id"
          >
            <i :class="chmenu.icons" class="iconfont1"></i>
            <span>{{ chmenu.name }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item :index="menu.resUrl" v-else>
        <i :class="menu.icons" class="iconfont1"></i>
        <span slot="title">{{ menu.name }}</span>
      </el-menu-item>
    </div>
  </el-menu>
</template>
<script>
import { getTreeUserResources } from "../api/userMG";
export default {
  name: "leftnav",
  data() {
    return {
      logoAll: require("../assets/img/new_logo.png"),
      logo: require("../assets/img/new_logo.png"),
      collapsed: false,
      indexdata: {
        icons: "el-icon-menu",
        id: 232132132131232121312321321321313,
        name: "首页",
        resUrl: "/",
        children: [
          {
            checked: false,
            children: null,
            icons: "el-icon-menu",
            id: 2321321321312321213123213213213132312,
            mark: "yonghuguanli_2",
            name: "首页",
            resUrl: "/index",
            sort: 8,
            type: 1,
          },
        ],
      },
    };
  },
  computed: {
    allmenu() {
      return this.$store.state.menuList[this.$store.state.navActive].children;
    },
  },
  // 创建完毕状态(里面是操作)
  created() {
    // 监听
    this.$root.Bus.$on("toggle", (value) => {
      this.collapsed = !value;
    });
  },
  methods: {},
};
</script>
<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 224px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0px;
}

.el-menu-bg {
  background-color: #fff !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 32px;
  /*color: #9d9d9d;*/
  text-align: center;
  margin: 24px 20px 48px 20px;

  img {
    height: 100%;
  }
}

.el-menu--collapse > div > .el-submenu > .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

.iconfont1 {
  vertical-align: middle;
  margin-right: 5px !important;
  width: 24px !important;
  text-align: center !important;
  font-size: 18px !important;
}
.logobox-all {
  display: flex;
  align-items: center;
  > div:nth-child(2) {
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    line-height: 0px;
    color: #1a1a1a;
    opacity: 1;
    margin-left: 10px;
  }
}

/*.logoimg {*/
/*  height: 40px;*/
/*    */
/*}*/
</style>
