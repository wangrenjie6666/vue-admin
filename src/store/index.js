import Vue from 'vue';
import Vuex from 'vuex';
import { getTreeUserResources } from '../api/userMG'
import router from '../router'
import da from "element-ui/src/locale/lang/da";

Vue.use(Vuex);
// 登录验证
export default new Vuex.Store({
  state: {
    user: false,
    menuList: [{ children: [] }],
    navActive: 0,
    goRouterUrl: '',
    regionList: [],
    launchAdData: {
      advertisingName: '',
      mp4url: '',
      advertisingType: '',//广告类型
      erWeiMaUrl: '',
      advertisingListId: '',//业务平台id
      // userName:'',
      // userPhone:'',
      equipmentDTOList: '',
      advertisingId: '',//广告id
      equipmentIds: '',
      md5Encrypt: '',
      selectedEQList: '',
      advertList: '',
    },
  },
  mutations: {
    // 登录
    login(state, user) {
      state.user = user;
      localStorage.setItem("userInfo", user);
    },
    // 退出
    logout(state, user) {
      state.user = "";
      localStorage.setItem("userInfo", "");
      localStorage.setItem("token", "");
    },
    //存放存放广告data
    saveLaunchAd(state, data) {
      for (let obj in state.launchAdData) {
        for (let obj1 in data) {
          if (obj1 == obj) {
            state.launchAdData[obj] = data[obj1];
          }
        }
      }
    },
    //存放视频列表
    saveAdvertList(state, data) {
      state.launchAdData.advertList = data;

    },
    //清空广告存放放
    emptyLaunchAd(state) {
      for (let obj in state.launchAdData) {
        state.launchAdData[obj] = '';
      }
    },
    //改变导航头部活跃状态
    changeNavActive(state, payload) {
      state.navActive = payload.index;
      if (!payload.navClick) return;
      Vue.nextTick(() => {
        if (state.menuList[state.navActive].children[0].children && state.menuList[state.navActive].children[0].children.length > 0) {

          router.push({
            path: state.menuList[state.navActive].children[0].children[0].resUrl
          })
        } else {
          if (payload.routeName === state.menuList[state.navActive].children[0].resUrl) {
            return;
          }
          router.push({
            path: state.menuList[state.navActive].children[0].resUrl
          })
        }
      })


    },
    //改变路由地址
    changeRouterUrl(state, payload) {
      state.goRouterUrl = payload.url;
    },
    //改变地区地址
    changeRegionList(state, payload) {
      state.regionList = payload.list;
    }
  },
  actions: {
    getMenuList({ commit, state }) {
      getTreeUserResources().then(res => {
        state.menuList = res.data;
      }
      )
    }
  }
})
