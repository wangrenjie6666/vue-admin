/**
* 基础菜单 商品管理
*/
<template>
    <div class="main-layout">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
            <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
            <el-breadcrumb-item>系统配置</el-breadcrumb-item>
            <el-breadcrumb-item>投放周期配置</el-breadcrumb-item>
        </el-breadcrumb>
        <!--列表-->
        <div class="pd3732 bgfff">
            <el-table class="mb20" size="small" :data="listData" stripe highlight-current-row v-loading="loading" border
                element-loading-text="拼命加载中" style="width: 100%;">
                <el-table-column sortable prop="id" label="规则id">
                </el-table-column>
                <el-table-column sortable prop="ruleName" label="规则名称">
                </el-table-column>
                <el-table-column sortable prop="cycleName" label="周期">
                </el-table-column>
                <el-table-column sortable prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column sortable prop="state" label="状态">
                    <template slot-scope="scope">
                        <div v-show="scope.row.state==0">禁用</div>
                        <div v-show="scope.row.state==1">正常</div>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button class="mini-red-btn" size="mini" type="danger" v-show="scope.row.state==1"
                            @click="disable(scope.row.id)">禁用</el-button>
                        <el-button class="mini-green-btn" size="mini" type="success" v-show="scope.row.state==0"
                            @click="enable(scope.row.id)">启用</el-button>
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
        LaunchList,
        LaunchInsert,
        LaunchUpdate,
        LaunchEnable,
        LaunchDisable,
        LaunchDetail,
        businessSearch
    } from '../../api/config'
    export default {
        data() {
            return {
                nshow: true, //switch开启
                fshow: false, //switch关闭
                loading: false, //是显示加载
                editFormVisible: false, //控制编辑页面显示与隐藏
                title: '添加',
                businessList: [],
                editForm: {
                    id: '',
                    ruleName: '',
                    advertisingListId: '',
                    cycle: 1,
                    state: 1,
                },
                formInline: {
                    page: 1,
                    limit: 10,
                },
                // 删除部门
                seletedata: {
                    ids: '',
                    token: localStorage.getItem('logintoken')
                },
                userparm: [], //搜索权限
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
            this.getdata(this.formInline)
            this.getBusinessList();
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
                }
                LaunchList(data)
                    .then(res => {
                        this.listData = res.data.records;
                        // 分页赋值
                        this.pageparm.currentPage = this.formInline.page
                        this.pageparm.pageSize = this.formInline.limit
                        this.pageparm.total = res.data.total
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
            // 删除公司
            deleteUser(index, row) {
                this.$confirm('确定要删除吗?', '信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        deptDelete(row.deptId)
                            .then(res => {
                                if (res.success) {
                                    this.$message({
                                        type: 'success',
                                        message: '公司已删除!'
                                    })
                                    this.getdata(this.formInline)
                                } else {
                                    this.$message({
                                        type: 'info',
                                        message: res.msg
                                    })
                                }
                            })
                            .catch(err => {
                                this.loading = false
                                this.$message.error('公司删除失败，请稍后再试！')
                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
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
            }
        }
    }
</script>

<style scoped>
    .user-search {
        margin-top: 20px;
    }

    .userRole {
        width: 100%;
    }
</style>