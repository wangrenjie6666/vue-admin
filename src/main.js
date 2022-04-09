import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 引入icon
import './assets/icon/iconfont.css'
Vue.config.productionTip = false
//引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入轮播swiper
// import 'swiper/dist/css/swiper.min.css'
// import 'swiper/dist/js/swiper.min'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// Vue.use(VueAwesomeSwiper, /* { default options with global component } */)

// 引入自定义组件。index.js是组件的默认入口
import CustomComponents from '@/components/common/index.js'
Vue.use(CustomComponents);
Vue.use(ElementUI);
//全局可用函数
import * as common from './utils/common'
Vue.prototype.$common = common
import 'default-passive-events'
//首页路由
Vue.prototype.$indexurl = '/index'
// 过滤器
import * as custom from './utils/util'
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})
let a = 0;
// 路由拦截器
router.beforeEach((to, from, next) => {
  if (to.matched.length != 0) {

    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限

      if (Boolean(localStorage.getItem("userInfo"))) { // 通过vuex state获取当前的user是否存在

        store.commit({
          type: 'changeRouterUrl',
          url: to.path
        })
        next();
      } else {
        store.commit({
          type: 'changeRouterUrl',
          url: '/login'
        })
        next({
          path: '/login',
          query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    } else {

      if (Boolean(localStorage.getItem("userInfo"))) { // 判断是否登录
        if (to.path != "/" && to.path != "/login") { //判断是否要跳到登录界面
          store.commit({
            type: 'changeRouterUrl',
            url: to.path
          })
          next();
        } else {
          /**
           * 防刷新，如果登录，修改路由跳转到登录页面，修改路由为登录后的首页
           */
          store.commit({
            type: 'changeRouterUrl',
            url: '/index'
          })
          next({
            path: '/index'
          })
        }
      } else {
        store.commit({
          type: 'changeRouterUrl',
          url: to.path
        })
        next();
      }
    }
  } else {
    store.commit({
      type: 'changeRouterUrl',
      url: '/login'
    })
    next({
      path: '/login',
      query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
    })
  }
})

new Vue({
  router,
  store,
  data: {
    // 空的实例放到根组件下，所有的子组件都能调用
    Bus: new Vue()
  },
  render: h => h(App)
}).$mount('#app')

