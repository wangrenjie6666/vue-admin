/**
* 基础菜单 商品管理
*/
<template>
    <div class="main-layout">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
            <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
            <el-breadcrumb-item>设备广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>设备广告</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="pd3732 bgfff">
            <!-- 搜索筛选 -->
            <el-form :inline="true" :model="formInline" class="user-search">
                <el-form-item label="">
                    <el-select v-model="formInline.equipKey" placeholder="请选择设备名称">
                        <el-option label="设备IMEI" value="imei"></el-option>
                        <el-option label="设备名称" value="equName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input size="small" v-model="formInline.equContent" auto-complete="off" placeholder="请输入设备">
                    </el-input>
                </el-form-item>
                <el-form-item label="详细地址:" prop="operationPlatformName">
                    <el-input size="small" v-model="formInline.equAddress" auto-complete="off" placeholder="请输入详细地址">
                    </el-input>
                </el-form-item>
                <el-form-item label="设备状态:" prop="operationPlatformName">
                    <el-select v-model="formInline.equStatus" placeholder="请选择适用平台">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="在线" :value="0"></el-option>
                        <el-option label="离线" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    <el-button class="reload-add-btn" size="small" type="primary" icon="el-icon-refresh"
                        @click="resetRefresh()">重置</el-button>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table class="mb20" size="small" stripe :data="listData" highlight-current-row v-loading="loading" border
                element-loading-text="拼命加载中" style="width: 100%;">
                <el-table-column sortable prop="id" label="设备ID" width="">
                </el-table-column>
                <el-table-column sortable prop="imei" label="设备IMEI" width="200">
                </el-table-column>
                <el-table-column sortable prop="equNo" label="设备识别码" width="200">
                </el-table-column>
                <el-table-column sortable prop="typeName" label="设备名称" width="">
                </el-table-column>
                <el-table-column sortable prop="typeName" label="设备类型" width="">
                </el-table-column>
                <el-table-column sortable prop="areaName" label="所属区域" width="200">
                </el-table-column>
                <el-table-column sortable prop="equAddress" label="设备详细地址" width="200">
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button class="button-class mini-blue-btn" size="mini" v-if="scope.row.equNo !=null"
                            @click="seeQrcode(scope.row.equNo)">查看二维码</el-button>
                        <el-button class="button-class mini-red-btn" size="mini" type="primary"
                            @click="goLaunchManage(scope.row.imei,scope.row.id)">投放管理</el-button>
                        <el-button class="button-class reload-add-btn" size="mini"
                            @click="goScheduleManage(scope.row.id)">排期管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
            <el-dialog :visible.sync="editFormVisible" width="75%" @click='closeDialog("edit")'>
                <div class="edit-title">{{title}}</div>
                <div>
                    <div class="block">
                        <span class="demonstration">选择投放的时间：</span>
                        <el-date-picker v-model="timeData.datePicker" type="month" value-format="yyyy-MM"
                            placeholder="选择月">
                        </el-date-picker>
                        <el-button size="small" type="primary" icon="el-icon-search"
                            @click="searchSchedule(timeData.datePicker,timeData.id)" style="margin-left: 10px">搜索
                        </el-button>
                    </div>
                    <div class="date-list">
                        <div class="date" v-for="(item1,index1) in timeData.daysarr" :key="index1">
                            <div v-show="item1.type==1" class="date-type1">
                                <div style="font-size: 20px">{{item1.day}}日</div>
                                <div class="mt20" style="color: rgba(0, 0, 0, 0.65);">空闲</div>
                            </div>
                            <div v-show="item1.type==2" class="date-type2">
                                <div style="font-size: 20px">{{item1.day}}日</div>
                                <div class="mt20">占用</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <!-- 查看二维码 -->
            <el-dialog :visible.sync="qrcodeVisible" width="30%" @click='closeDialog()'>
                <div class="edit-title">{{qrcodeTitle}}</div>
                <QrcodeModel :qrcontent="qrContent" ref="qrcode" />
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {
        getEquList
    } from '@/api/advert.js'
    import {
        getTimeAndEquIds
    } from '@/api/equipment'
    export default {
        data() {
            return {
                nshow: true, //switch开启
                fshow: false, //switch关闭
                loading: false, //是显示加载
                editFormVisible: false, //控制编辑页面显示与隐藏
                qrcodeTitle: '查看二维码',
                qrcodeVisible: false,
                qrContent: '',
                title: '排期管理',
                businessList: [],
                timeData: {
                    daysarr: [],
                    datePicker: ''
                },
                formInline: {
                    page: 1,
                    limit: 10,
                    equipKey: 'equName',
                    equStatus: '',
                    equAddress: '',
                    equContent: ''
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
            this.getdata(this.formInline)
            // this.getBusinessList();
        },

        /**
         * 里面的方法只有被调用才会执行
         */
        methods: {
            // 获取公司列表
            getdata(parameter) {
                let data = {
                    start: parameter.page,
                    length: parameter.limit,
                    equAddress: parameter.equAddress,
                    equStatus: parameter.equStatus
                }
                if (parameter.equipKey != '') {
                    data[parameter.equipKey] = parameter.equContent;
                }
                /***
                 * 调用接口，注释上面模拟数据 取消下面注释
                 */
                getEquList(data)
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
                this.formInline.page = 1
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
            //显示编辑界面
            seeQrcode(qrcode) {
                if (qrcode == null) {
                    this.qrContent = '';
                } else {
                    this.qrContent = qrcode;
                }
                this.$nextTick(() => {
                    this.qrcodeVisible = true
                })
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
            resetRefresh() {
                this.formInline.page = 1;
                this.formInline.limit = 10;
                this.formInline.equStatus = '';
                this.formInline.equipKey = 'equName';
                this.formInline.equAddress = '';
                this.formInline.equContent = '';
                this.getdata(this.formInline)

            },
            goLaunchManage(imei, id) {
                console.log(1111);
                this.$router.push({
                    path: '/manage/LaunchManage',
                    query: {
                        imei,
                        id
                    }
                })
            },
            goScheduleManage(id) {
                this.editFormVisible = true;
                let yearMonth = this.$common.getYearMonth();
                this.getScheduleData(yearMonth, id);
            },
            getScheduleData(yearMonth, id) {
                let days = this.getLaunchDateList(yearMonth);
                let data = {
                    equipmentIds: id,
                    startTime: yearMonth + '-01',
                    endTime: yearMonth + '-' + days,
                }
                getTimeAndEquIds(data).then(res => {
                    let daysarr = [];

                    for (let i = 0; i < days; i++) {
                        daysarr.push({
                            day: i + 1,
                            type: 1
                        })
                        if (res.data[0].simpleTimeList) {
                            res.data[0].simpleTimeList.forEach(item1 => {
                                if (parseInt(item1.split('-')[2]) == i + 1) {
                                    daysarr[i].type = 2;
                                }
                            })
                        }
                    }
                    this.timeData.id = id;
                    this.timeData.daysarr = daysarr;
                    this.timeData.datePicker = yearMonth;
                })
            },
            getLaunchDateList(date) {
                let arrdate = date.split('-');
                let days = this.$common.getMonthDays(arrdate[0], arrdate[1]);
                return days;
            },
            searchSchedule(date, id) {
                this.getScheduleData(date, id)
            },
        }
    }
</script>

<style scoped>
    .button-class {
        margin-bottom: 6px !important;
        margin-top: 6px !important;
    }

    .userRole {
        width: 100%;
    }

    .date-list {
        display: flex;
        flex-wrap: wrap;
    }

    .date {
        width: 244px;
        height: 120px;
        text-align: center;
        /*padding: 5px;*/

        color: #fff;
        margin-left: 20px;
        margin-top: 20px;
        cursor: pointer;
    }

    .date-type1 {
        width: 100%;
        height: 100%;
        background: #F0F2F5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #000;
    }

    .date-type2 {
        width: 100%;
        height: 100%;
        background: #FFA816;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

    }

    .date-type3 {
        background: #409EFF;
    }
</style>