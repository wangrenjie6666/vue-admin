/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>主菜单</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="开始结束时间:">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="开始时间"
              v-model="formInline.beginDate"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1" style="text-align: center">--</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="结束时间"
              v-model="formInline.endDate"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="用户id:">
          <el-input
            size="small"
            v-model="formInline.userId"
            auto-complete="off"
            placeholder="请输入用户id"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="用户名:">
          <el-input
            size="small"
            v-model="formInline.username"
            auto-complete="off"
            placeholder="请输入完整用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
          <el-button
            class="reload-add-btn"
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="resetRefresh()"
          >
            重置</el-button
          >
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        size="small"
        :data="listData"
        class="mb20"
        stripe
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <!--      <el-table-column sortable prop="id" label="日志ID"  width="100">-->
        <!--      </el-table-column>-->
        <el-table-column sortable prop="username" label="用户名"> </el-table-column>
        <el-table-column sortable prop="apiId" label="接口id"> </el-table-column>
        <el-table-column sortable prop="userId" label="请求用户ID"> </el-table-column>
        <el-table-column sortable prop="time" label="请求时间"> </el-table-column>
        <el-table-column sortable prop="fullUri" label="请求地址" width="200">
        </el-table-column>
        <el-table-column sortable prop="userAgent" label="设备信息" width="200">
        </el-table-column>
        <el-table-column sortable prop="clientIp" label="客户端ip"> </el-table-column>
        <el-table-column sortable prop="totalTime" label="接口耗时毫秒">
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    </div>
    <!-- 编辑界面 -->
  </div>
</template>

<script>
import { userLog } from "@/api/userMG.js";
export default {
  data() {
    return {
      nshow: true, //switch开启
      savedata: "",
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "查看详情",
      businessList: [],
      // rules表单验证
      formInline: {
        page: 1,
        limit: 10,
        beginDate: "",
        endDate: "",
        userId: "",
        username: "",
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {},
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline);
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
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
        userId: parameter.userId,
        username: parameter.username,
      };
      userLog(data).then((res) => {
        this.listData = res.data.list;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.count;
      });
    },
    // 分页插件事件
    callFather(parm) {
      console.log(parm);
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    //重置
    resetRefresh() {
      //设为初始化
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.beginDate = "";
      this.formInline.endDate = "";
      this.formInline.userId = "";
      this.formInline.username = "";
      this.getdata(this.formInline);
    },
    goDetail(subjectId) {
      let data = {
        subjectId,
      };
      advertDetail(data).then((res) => {
        res.data.equipmentListVos.forEach((item, index) => {
          item.daydata = [];
          item.timeList = item.dayStr.split(",");
        });
        // this.savedata=savedata;
        this.savedata = res.data;
      });
      this.editFormVisible = true;
    },
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    // 编辑、增加页面保存方法
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
  },
};
</script>

<style scoped></style>
