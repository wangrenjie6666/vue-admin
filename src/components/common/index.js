import Pagination from './Pagination.vue'
import QrcodeModel from "./QrcodeModel";
import SetImage from './SetImage.vue'
import SetVideo from './SetVideo.vue'
// 这里是重点
const CustomComponents = {
    install(Vue){
        Vue.component('Pagination',Pagination)
        Vue.component('QrcodeModel',QrcodeModel)
        Vue.component('SetImage',SetImage)
        Vue.component('SetVideo',SetVideo) 
    }
}

// 导出组件
export default CustomComponents