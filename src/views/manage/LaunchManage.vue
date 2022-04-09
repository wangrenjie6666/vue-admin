/**
* 基础菜单 商品管理
*/
<template>
    <div class="main-layout">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
            <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
            <el-breadcrumb-item>设备广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>投放管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pd3732 bgfff">
            <el-table class="mb20" size="small" stripe :data="listData" highlight-current-row v-loading="loading" border
                element-loading-text="拼命加载中" style="width: 100%;">
                <el-table-column sortable prop="subjectId" label="记录id" width="">
                </el-table-column>
                <el-table-column sortable prop="advertisingName" label="广告名称" width="200">
                </el-table-column>
                <el-table-column sortable prop="createTime" label="投放时间" width="200">
                </el-table-column>
                <el-table-column sortable prop="userName" label="投放用户" width="">
                </el-table-column>
                <el-table-column sortable prop="userPhone" label="投放手机号" width="200">
                </el-table-column>
                <el-table-column sortable prop="putStatus" label="投放状态" width="">
                    <template slot-scope="scope">
                        <div v-show="scope.row.putStatus==1">成功</div>
                        <div v-show="scope.row.putStatus==2">失败</div>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="sysUserName" label="操作人" width="200">
                </el-table-column>
                <el-table-column sortable prop="operationPlatformName" label="所属平台" width="200">
                </el-table-column>
                <el-table-column sortable prop="createTime" label="操作时间" width="200">
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button class="mini-blue-btn" size="mini" @click="goLaunchManage()"
                            v-show="scope.row.putStatus==2">人工投放</el-button>
                        <el-button class="mini-red-btn" size="mini" @click="deleteAdert(scope.row.subjectId)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
        </div>
    </div>
</template>

<script>
    import {
        selectEquAdManagerList,
        advertisingListDelete
    } from '@/api/equipment'
    export default {
        data() {
            return {
                nshow: true, //switch开启
                fshow: false, //switch关闭
                loading: false, //是显示加载
                editFormVisible: false, //控制编辑页面显示与隐藏
                title: '添加',
                businessList: [],
                formInline: {
                    page: 1,
                    limit: 10,
                    date1: '',
                    date2: '',
                    employStatus: 0,
                    equiptid: '',
                    name: '',
                    adress: '',
                    equipStatus: '',
                },
                listData: [], //用户数据
                // 分页参数
                pageparm: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 10
                }
            }
        },

        /**
         * 数据发生改变
         */

        /**
         * 创建完毕
         */
        created() {
            this.formInline.imei = this.$route.query.imei;
            this.formInline.equipmentId = this.$route.query.id;
            this.getdata(this.formInline)
            // this.getBusinessList();
        },

        /**
         * 里面的方法只有被调用才会执行
         */
        methods: {
            // 获取公司列表
            getdata(parameter) {

                /***
                 * 调用接口，注释上面模拟数据 取消下面注释
                 */
                let data = {
                    start: parameter.page,
                    length: parameter.limit,
                    imei: parameter.imei
                }
                selectEquAdManagerList(data)
                    .then(res => {
                        this.listData = res.data.list;
                        // 分页赋值
                        this.pageparm.currentPage = this.formInline.page
                        this.pageparm.pageSize = this.formInline.limit
                        this.pageparm.total = res.data.count
                    })
            },
            getBusinessList() {
                businessSearch().then(res => {
                    this.businessList = res.data.list;
                })
            },
            // 分页插件事件
            callFather(parm) {
                this.formInline.page = parm.currentPage
                this.formInline.limit = parm.pageSize
                this.getdata(this.formInline)
            },
            // 搜索事件
            search() {
                this.formInline.page = 1;
                this.getdata(this.formInline)
            },
            goLaunchAdvert() {
                this.$router.push({
                    path: '/launch/LaunchAd'
                })
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true
                if (row != undefined && row != 'undefined') {
                    this.title = '修改'
                    this.editForm.id = row.id
                    this.editForm.ruleName = row.ruleName
                    this.editForm.advertisingListId = row.advertisingListId
                    this.editForm.cycle = row.cycle
                    this.editForm.state = row.state

                } else {
                    this.title = '添加'
                    this.editForm.id = ''
                    this.editForm.ruleName = ''
                    this.editForm.advertisingListId = ''
                    this.editForm.cycle = 1
                    this.editForm.state = 1
                }
            },
            // 编辑、增加页面保存方法
            submitForm(editData) {
                this.$refs[editData].validate(valid => {
                    if (valid) {
                        if (this.editForm.id != '') {
                            LaunchUpdate(this.editForm).then(res => {
                                this.editFormVisible = false
                                this.loading = false
                                this.getdata(this.formInline)
                                this.$message({
                                    type: 'success',
                                    message: '配置保存成功！'
                                })
                            })
                        } else {
                            LaunchInsert(this.editForm).then(res => {
                                this.editFormVisible = false
                                this.loading = false
                                this.getdata(this.formInline)
                                this.$message({
                                    type: 'success',
                                    message: '配置新增成功！'
                                })
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            // 删除
            deleteAdert(subjectId) {
                this.$confirm('确定要删除吗?', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        subjectId,
                        equipmentId: this.formInline.equipmentId,
                        imei: this.formInline.imei
                    }
                    advertisingListDelete(data).then(res => {
                        this.$message.success('删除成功！')
                        this.getdata(this.formInline)
                    })
                })

            },
            // 关闭编辑、增加弹出框
            closeDialog() {
                this.editFormVisible = false
            },
            disable(id) {
                this.$confirm('确定要禁用吗?', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    LaunchDisable({
                        id
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '禁用成功'
                        })
                        this.getdata(this.formInline)
                    })
                })

            },
            enable(id) {
                this.$confirm('确定要启用吗?', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    LaunchEnable({
                        id
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '禁用成功!'
                        })
                        this.getdata(this.formInline)
                    })
                })
            },
            goLaunchManage() {
                this.$router.push('/manage/LaunchManage')
            },
            goScheduleManage() {
                this.$router.push('/manage/ScheduleManage');
            }
        }
    }
</script>

<style scoped>
    .userRole {
        width: 100%;
    }
</style>