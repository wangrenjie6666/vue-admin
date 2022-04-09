/** * 头部菜单 */
<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#fff"
    text-color="#0290FF"
    active-text-color="#0290FF"
    style="height: 100%"
  >
    <el-button class="buttonimg" @click="toggle(collapsed)">
      <!--      <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">-->
      <i class="iconfont icon-xingzhuang"></i>
      <!--      <i class="iconfont icon-xingzhuang"></i>-->
    </el-button>

    <div class="module-class-a">
      <div
        class="ml20"
        v-for="(item, index) in allmenu"
        :key="index"
        :class="{ color0290FF: index == navActive }"
        @click="changeNavActive(index)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="submenu">
      <div class="user-info">
        <div class="name">{{ user.username }}</div>
        <div class="img"><img src="../assets/img/header_img.png" alt="" /></div>
        <i class="el-icon-arrow-down"></i>
      </div>

      <div class="down-load">
        <div @click="content()">个人中心</div>
        <div @click="set()">密码设置</div>
        <div @click="exit()">退出登录</div>
      </div>
    </div>
  </el-menu>
</template>
<script>
import { loginout } from "../api/userMG";
export default {
  name: "navcon",
  data() {
    return {
      activeIndex: "2",
      collapsed: true,
      imgshow: require("../assets/show.png"),
      imgsq: require("../assets/sq.png"),
      user: {},
    };
  },
  //属性
  computed: {
    allmenu() {
      return this.$store.state.menuList;
    },
    navActive() {
      return this.$store.state.navActive;
    },
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.user = JSON.parse(localStorage.getItem("userdata"));
  },
  methods: {
    // 退出登录
    exit() {
      this.$confirm("退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loginout()
            .then((res) => {
              //如果请求成功就让他2秒跳转路由
              setTimeout(() => {
                this.$store.commit("logout", "false");
                this.$router.push({
                  path: "/login",
                });
                this.$message({
                  type: "success",
                  message: "已退出登录!",
                });
              }, 1000);
            })
            .catch((err) => {
              // 获取图形验证码
              this.getcode();
              this.logining = false;
              this.$message.error("退出失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    changeNavActive(index) {
      this.$store.commit({
        type: "changeNavActive",
        index,
        navClick: true,
      });
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype;
      this.$root.Bus.$emit("toggle", this.collapsed);
    },
    set() {
      if (this.$route.name == "设置") {
        return;
      }
      this.$router.push({
        path: "/personal/set",
      });
    },
    content() {
      if (this.$route.name == "个人中心") {
        return;
      }
      this.$router.push({
        path: "/personal/info",
      });
    },
  },
};
</script>
<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}

.module-class-a:focus {
  outline: none;
}

.module-class-a {
  float: left;
  height: 100%;
  display: flex;
  align-items: center;
  width: auto;

  div {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
  }
}

.user-info {
  display: flex;
  align-items: center;
  height: 44px;
  color: #409eff;

  div {
    margin-right: 10px;
  }

  i {
    transition: 0.5s;
    margin-right: 24px;
    font-size: 16px;
  }
}

.submenu:hover .user-info i {
  transform: rotate(180deg);
}

.submenu:focus {
  outline: none;
}

.submenu {
  position: relative;
  cursor: pointer;
  float: right;
  height: 72px !important;
  display: flex;
  align-items: center;

  .down-load {
    width: 176px;
    background: #fff;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    top: 72px;
    box-shadow: 0px 0px 20px rgba(77, 76, 78, 0.16);
    padding: 16px 0;
    font-weight: bold;
    color: #333;
    right: 0;
    transition: 0.5s;
    -webkit-transition: 0.5s;
    /* Safari and Chrome */
    z-index: 1000;

    div {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: center;
    }

    div:hover {
      color: #409eff;
      background: rgba(2, 144, 255, 0.15) !important;
    }

    /*padding-top: ;*/
  }
}

.submenu:hover .down-load {
  visibility: visible;
  opacity: 1;
}

.buttonimg {
  float: left;
  height: 72px;
  background-color: transparent;
  border: none;
  padding-left: 24px;
}

.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}

.showimg:active {
  border: none;
}
</style>
