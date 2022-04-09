<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  computed: {
    goRouterUrl() {
      return this.$store.state.goRouterUrl;
    },
  },
  watch: {
    goRouterUrl: {
      handler(newName, oldName) {
        if (this.$store.state.menuList.length <= 1) {
          let a = setInterval(() => {
            if (this.$store.state.menuList.length > 1) {
              clearInterval(a);

              this.detailRouterUrl(this.$store.state.menuList, newName);
            }
          }, 100);
        } else {
          this.detailRouterUrl(this.$store.state.menuList, newName);
        }
      },
      immediate: true,
    },
  },
  methods: {
    detailRouterUrl(menuList, newName) {
      let urlArry = [];

      for (let i = 0; i < menuList.length; i++) {
        for (let j = 0; j < menuList[i].children.length; j++) {
          if (menuList[i].children[j].children === null) {
            urlArry.push([menuList[i].children[j].resUrl, i]);
          } else {
            for (let k = 0; k < menuList[i].children[j].children.length; k++) {
              urlArry.push([menuList[i].children[j].children[k].resUrl, i]);
            }
          }
        }
      }
      for (let i = 0; i < urlArry.length; i++) {
        if (urlArry[i][0] == newName) {
          this.$store.commit({
            type: "changeNavActive",
            index: urlArry[i][1],
            routeName: this.$route.path,
          });
        }
      }
    },
  },
};
</script>
<style lang="less">
/*@import url("../assets/css/common.less");*/
@import "assets/css/common.less";

html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  touch-action: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
