import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 用户登录.注册，忘记密码页面
const User = () => import('@/views/User')
const Login = () => import('@/views/login/Login')
const Register = () => import('@/views/register/Register')

const LostPassword = () => import('@/views/lostpassword/LostPassword')
//首页
const index = () => import('@/views/index')
const Index = () => import('@/views/index/Index')
/**
 * 系统管理
 * @constructor
 */
//用户管理
const UserManage = () => import('@/views/system/User')
//角色管理
const Role = () => import('@/views/system/Role')
//菜单
const Module = () => import('@/views/system/Module')
//操作日志
const Log = () => import('@/views/system/Log')

/**
 * 系统配置
 * @
 */
//业务接入配置
const BusinessConfig = () => import('@/views/config/BusinessConfig')
//投放周期配置
const LaunchConfig = () => import('@/views/config/LaunchConfig')

/**
 * 设备广告管理
 */
//设备广告管理
const EquipmentManage = () => import('@/views/manage/EquipmentManage');
//投放管理
const LaunchManage = () => import('@/views/manage/LaunchManage');
//排期管理
const ScheduleManage = () => import('@/views/manage/ScheduleManage');

/**
 * 投放广告
 */
//投放广告
const LaunchAd = () => import('@/views/launch/LaunchAd');
//投放广告1
const LaunchAdOne = () => import('@/views/launch/LaunchAdOne');
//投放广告2
const LaunchAdTwo = () => import('@/views/launch/LaunchAdTwo');
//投放广告3
const LaunchAdThree = () => import('@/views/launch/LaunchAdThree');
//投放广告4
const LaunchAdFour = () => import('@/views/launch/LaunchAdFour');


/**
 * 投放广告记录
 */
//投放广告记录
const LaunchRecord = () => import('@/views/advert_record/LaunchRecord');
//默认广告管理
const DefaultAdvert = () => import('@/views/advert_record/DefaultAdvert');

/**
 * 广告库
 */
//广告库
const AdvertDepot = () => import('@/views/advert_depot/AdvertDepot');

/**
 * 个人中心
 *
 */
//个人中心
const Info = () => import('@/views/personal/Info');

//设置
const Set = () => import('@/views/personal/Set');

/***
* 软件投放
* 业务对接管理
* @author renjie
*/
const BusinessDockConfig = () => import('@/views/business/BusinessDockConfig')

//页面列表
const BusinessPageList = () => import('@/views/business/PageList')

//广告位管理
const AdvertManage = () => import('@/views/software/AdvertManage')

//广告位管理-查看排期
const LookSchedulingList = () => import('@/components/software/LookSchedulingList')

//广告位管理-新增广告
const AdvertManageAdd = () => import('@/components/software/AdvertManageAdd')
//广告位管理-编辑广告
const AdvertManageEdit = () => import('@/components/software/AdvertManageEdit')

//广告投放管理-页面列表
const AdvertManagePageList = () => import('@/views/advert_launch_manage/AdvertManagePageList')

//标签推荐-用户标签管理
const UserLabelManage = () => import('@/views/label_recommend/UserLabelManage')
//标签推荐-标签管理
const LabelManage = () => import('@/views/label_recommend/LabelManage')
//标签推荐-广告库管理
const AdvertLibraryManage = () => import('@/views/label_recommend/AdvertLibraryManage')
/***
* 广告推广
* @author renjie
*/
//广告推广
const AdvertSpread = () => import('@/views/originality/AdvertSpread')

//广告模板管理
const AdvertTemplateManage = () => import('@/views/originality/AdvertTemplateManage')
//广告活动管理
const AdvertActivity = () => import('@/views/advert_activity/AdvertActivity')



const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
        path: '/',
        name: '',
        redirect: '/login',
        hidden: true,
        meta: {
            requireAuth: false
        }
    },
    /**
     *用户登录注册忘记密码
     */
    {
        path: '/user',
        name: '用户',
        component: User,
        hidden: true,
        redirect: '/login', // 设置默认打开的页面
        meta: {
            requireAuth: false
        },
        children: [
            {
                path: '/login',
                name: '登录',
                component: Login,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: '/register',
                name: '注册',
                component: Register,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: '/lostpassword',
                name: '找回密码',
                component: LostPassword,
                meta: {
                    requireAuth: false
                }
            },
        ],
    },
    /**
     * 首页
     */
    {
        path: '/index1',
        name: '',
        hidden: true,
        component: index,
        meta: {
            requireAuth: false
        },
        children: [
            {
                path: '/index',
                name: '首页',
                component: Index,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/personal/info',
                name: '个人中心',
                component: Info,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/personal/set',
                name: '设置',
                component: Set,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/system/user',
                name: '用户列表',
                component: UserManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/system/role',
                name: '角色管理',
                component: Role,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/system/module',
                name: '菜单管理',
                component: Module,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/system/log',
                name: '操作日志',
                component: Log,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/config/BusinessConfig',
                name: '业务接入配置',
                component: BusinessConfig,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/config/LaunchConfig',
                name: '投放周期配置',
                component: LaunchConfig,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/manage/EquipmentManage',
                name: '设备广告管理',
                component: EquipmentManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/manage/LaunchManage',
                name: '投放管理',
                component: LaunchManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/manage/ScheduleManage',
                name: '排期管理',
                component: ScheduleManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/launch/LaunchAd',
                name: '投放广告',
                component: LaunchAd,
                meta: {
                    requireAuth: true,
                    keepAlive: true
                }
            },
            {
                path: '/launch/LaunchAdOne',
                name: '投放广告(第一步)',
                component: LaunchAdOne,
                meta: {
                    requireAuth: true,
                    keepAlive: true
                }
            },
            {
                path: '/launch/LaunchAdTwo',
                name: '投放广告(第二步)',
                component: LaunchAdTwo,
                meta: {
                    requireAuth: true,
                    keepAlive: true
                }
            },
            {
                path: '/launch/LaunchAdThree',
                name: '投放广告(第三步)',
                component: LaunchAdThree,
                meta: {
                    requireAuth: true,
                    keepAlive: true
                }
            },
            {
                path: '/launch/LaunchAdFour',
                name: '投放广告(第四步)',
                component: LaunchAdFour,
                meta: {
                    requireAuth: true,
                    keepAlive: true
                }
            },
            {
                path: '/advert_record/LaunchRecord',
                name: '广告投放记录',
                component: LaunchRecord,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/advert_record/DefaultAdvert',
                name: '默认广告管理',
                component: DefaultAdvert,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/advert_depot/AdvertDepot',
                name: '广告库',
                component: AdvertDepot,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/business/BusinessDockConfig',
                name: '业务对接管理',
                component: BusinessDockConfig,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/business/BusinessPageList',
                name: '页面列表',
                component: BusinessPageList,
                meta: {
                    requireAuth: true
                }
            },

            {
                path: '/software/AdvertManage',
                name: '广告位管理',
                component: AdvertManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/software/LookSchedulingList',
                name: '查看排期',
                component: LookSchedulingList,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/software/AdvertManageAdd',
                name: '广告位管理-新增广告',
                component: AdvertManageAdd,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/software/AdvertManageEdit',
                name: '广告位管理-编辑广告',
                component: AdvertManageEdit,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/advert_launch_manage/page_list',
                name: '广告位管理-新增广告',
                component: AdvertManagePageList,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/label_recommend/UserLabelManage',
                name: '用户标签管理',
                component: UserLabelManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/label_recommend/LabelManage',
                name: '标签管理',
                component: LabelManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/label_recommend/AdvertLibraryManage',
                name: '广告库管理',
                component: AdvertLibraryManage,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/originality/AdvertSpread',
                name: '广告推广',
                component: AdvertSpread,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/originality/AdvertTemplateManage',
                name: '广告模板管理',
                component: AdvertTemplateManage,
                meta: {
                    requireAuth: true
                }
            },
            {

                path: '/advert_activity/AdvertActivity',
                name: '广告活动管理',
                component: AdvertActivity,
                meta: {
                    requireAuth: true
                }
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    // base: process.env.BASE_ULR,
    routes
})




export default router
