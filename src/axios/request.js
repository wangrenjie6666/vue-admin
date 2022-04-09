import axios from 'axios'
import store from '@/store';
import router from '@/router';
import { Loading, Message } from 'element-ui' // 这里我是使用elementUI的组件来给提示
import Vue from 'vue';
import echarts from "echarts";
let loadingInstance = null // 加载全局的loading
//公共baseURL
Vue.prototype.$baseURL = process.env.NODE_ENV === 'production' ? 'http://test.com/' : 'http://test.com/' //根据自己配置的反向代理去设置不同环境的baeUrl;

const instance = axios.create({ //创建axios实例，在这里可以设置请求的默认配置
    timeout: 15000, // 设置超时时间12s
    baseURL: Vue.prototype.$baseURL,
})
// 文档中的统一设置post请求头
instance.defaults.headers['Content-Type'] = 'application/json'
let httpCode = { //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
    400: '(400)请求参数错误',
    401: '(401)权限不足, 请重新登录',
    403: '(403)服务器拒绝本次访问',
    404: '参数错误或资源未找到',
    500: '(500)内部服务器错误',
    501: '(501)服务器不支持该请求中使用的方法',
    502: '(502)网关错误',
    504: '(504)网关超时'
}

/** 添加请求拦截器 **/
instance.interceptors.request.use(config => {
    /**
     * 在这里：可以根据业务需求可以在发送请求之前做些什么。
     * config.headers['token'] = sessionStorage.getItem('token') || ''
     */
    config.headers['token'] = localStorage.getItem('token') || '';
    loadingInstance = Loading.service({ // 发起请求时加载全局loading，请求失败或有响应时会关闭
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    return config
}, error => {
    // 对请求错误做些什么
    console.log('请求错误，原因：', error)
    return Promise.reject(error)
})

/** 添加响应拦截器  **/
instance.interceptors.response.use(response => {
    loadingInstance.close()
    if (response.data.code === 200) { // 响应结果里的status: 200是我与后台的约定
        return Promise.resolve(response.data)
    } else if (response.data.code == 40000) {
        router.push({ path: '/login' })
    } else {
        Message({
            message: response.data.msg,
            type: 'error'
        })
        setTimeout(() => {
            if (response.data.code == 401) {
                store.commit('logout', 'false')
                router.push({ path: '/login' })
            }
        }, 2000)
        return Promise.reject(response.data.msg)
    }
}, error => {
    loadingInstance.close()
    if (error.response) {
        /**
         * 在这里：可以根据业务需求可以在请求失败后做什么。
         * 根据请求失败的http状态码去给用户相应的提示
         */
        let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
        Message({
            message: tips,
            type: 'error'
        })
        return Promise.reject(error)
    } else {
        Message({
            message: '请求失败',
            type: 'error'
        })
        return Promise.reject(new Error('请求失败'))
    }
})

/* 统一封装get请求 */
export const get = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
