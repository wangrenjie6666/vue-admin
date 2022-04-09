/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item>业务对接管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="业务名称:">
          <el-input
            size="small"
            v-model="formInline.platformName"
            placeholder="请输入业务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="formInline.useStatus" placeholder="请选择当前状态">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间:">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="formInline.beginDate"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1" style="text-align: center">--</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="formInline.endDate"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
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
          <el-button
            class="reload-add-btn"
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="handleEdit()"
            >新建
          </el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        class="mb20"
        size="small"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="platformName" label="业务名称" width="200">
        </el-table-column>
        <el-table-column sortable prop="platformCode" label="业务编码" width="200">
        </el-table-column>
        <el-table-column sortable prop="resourceCount" label="包含页面" width="200">
        </el-table-column>
        <el-table-column sortable align="center" prop="deleted" label="状态" width="">
          <template slot-scope="scope">
            <el-switch
              active-text="启用"
              inactive-text="禁用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.useStatus"
              :active-value="0"
              :inactive-value="1"
              @change="changeStatus(scope.row.platformId, scope.row.useStatus)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              @click="BusinessDelete(scope.row.platformId)"
              >删除
            </el-button>
            <el-button
              class="mini-green-btn"
              size="mini"
              type="success"
              @click="
                goBusinessPageList(
                  scope.row.platformCode,
                  scope.row.platformName,
                  scope.row.useStatus
                )
              "
            >
              页面列表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="30%" @click="closeDialog">
        <div class="edit-title">{{ title }}</div>
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="业务名称" prop="platformName">
            <el-input
              size="small"
              v-model="editForm.platformName"
              auto-complete="off"
              placeholder="请输入平台名称"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="editForm.platformId" label="业务编码" prop="platformCode">
            <el-input
              size="small"
              v-model="editForm.platformCode"
              auto-complete="off"
              disabled
              placeholder="请输入业务编码"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="接入方式描述">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入描述方式"
              v-model="editForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button
            size="small"
            type="primary"
            :loading="loading"
            class="title"
            @click="submitForm('editForm')"
            >保存
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  businessPlatformList,
  businessPlatformAdd,
  businessPlatformUpdate,
  businessPlatformDelete,
  BusinessDisableAndEnable,
} from "../../api/business";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        id: "",
        platformCode: "",
        platformName: "",
        remark: "",
      },
      // rules表单验证
      rules: {
        platformCode: [
          {
            required: true,
            message: "请输入业务编码",
            trigger: "blur",
          },
        ],
        platformName: [
          {
            required: true,
            message: "请输入业务名称",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        platformName: "",
        useStatus: "",
        beginDate: "",
        endDate: "",
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
        platformName: parameter.platformName,
        start: parameter.page,
        length: parameter.limit,
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
        useStatus: parameter.useStatus,
      };
      businessPlatformList(data).then((res) => {
        this.listData = res.data.list;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.count;
      });
    },
    goBusinessPageList(platformCode, platformName, useStatus) {
      this.$router.push({
        path: "/business/BusinessPageList",
        query: {
          platformCode,
          platformName,
          useStatus,
        },
      });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改业务";
        this.editForm.platformId = row.platformId;
        this.editForm.platformCode = row.platformCode;
        this.editForm.platformName = row.platformName;
        this.editForm.remark = row.remark;
      } else {
        this.title = "添加业务";
        this.editForm.platformId = "";
        this.editForm.platformCode = "";
        this.editForm.platformName = "";
        this.editForm.remark = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editForm.platformId != "") {
            businessPlatformUpdate(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "业务保存成功！",
              });
            });
          } else {
            businessPlatformAdd(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "业务新增成功！",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除公司
    BusinessDelete(platformId) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          businessPlatformDelete({
            platformId,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "数据已删除!",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.$message.error("数据删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.beginDate = "";
      this.formInline.endDate = "";
      this.formInline.platformName = "";
      this.formInline.deleted = "";
      this.formInline.useStatus = "";
      this.getdata(this.formInline);
    },
    //修改使用状态
    changeStatus(platformId, useStatus) {
      console.log(useStatus);
      let data = {
        platformId,
        useStatus,
      };
      BusinessDisableAndEnable(data)
        .then((res) => {
          this.$message.success("修改成功");
        })
        .catch((res) => {
          this.getdata(this.formInline);
        });
    },
  },
};
</script>

<style scoped>
.userRole {
  width: 100%;
}
</style>
