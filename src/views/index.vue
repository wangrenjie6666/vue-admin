<template>
  <!-- <el-container class="index-con">
      <el-header class="index-header">
        <navcon></navcon>
      </el-header>
      <el-container class="index-con">
        <el-aside :class="showclass">
          <leftnav></leftnav>
        </el-aside>
        <el-container class="main-con">
          <el-main clss="index-main">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container> -->
  <el-container class="index-con">
    <el-aside :class="showclass">
      <leftnav></leftnav>
    </el-aside>
    <el-container class="main-con">
      <el-header class="index-header">
        <navcon></navcon>
      </el-header>
      <el-main class="index-main">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入组件
import navcon from "../components/navcon";
import leftnav from "../components/leftnav.vue";

export default {
  name: "index",
  data() {
    return {
      showclass: "asideshow",
      showtype: false,
    };
  },
  // 注册组件
  components: {
    navcon,
    leftnav,
  },
  created() {
    //得到数据
    this.getdata();
    // 监听
    this.$root.Bus.$on("toggle", (value) => {
      if (value) {
        this.showclass = "asideshow";
      } else {
        setTimeout(() => {
          this.showclass = "aside";
        }, 300);
      }
    });
  },
  methods: {
    getdata() {
      this.$store.dispatch("getMenuList");
    },
  },
  beforeUpdate() {},
  // 挂载前状态(里面是操作)
  beforeMount() {},
};
</script>
<style>
.index-con {
  height: auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-width: 1400px;
  overflow: auto;
}

.aside {
  width: 73px !important;
  height: 100%;
  /*border: 1px solid #efefef;*/
  background-color: #fff;
  margin: 0px;
}

.asideshow {
  width: 224px !important;
  height: 100%;
  background-color: #fff;
  /*border: 1px solid #efefef;*/
  margin: 0px;
}

.index-header {
  /*border-left: 2px solid #333;*/
  padding: 0px;
}

.index-header {
  height: 72px !important;
}

.index-main {
  padding: 20px;
  background: #f0f2f5;
}
</style>
