/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item>标签推荐</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="标签类型:">
          <el-select v-model="formInline.labelType" placeholder="请选择当前状态">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="用户标签" :value="1"></el-option>
            <el-option label="商品标签" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称:">
          <el-input
            size="small"
            v-model="formInline.labelName"
            placeholder="请输入标签名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="标签ID:">
          <el-input
            size="small"
            v-model="formInline.id"
            placeholder="请输入标签ID"
          ></el-input>
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
        <el-table-column sortable prop="id" label="标签ID"> </el-table-column>
        <el-table-column sortable prop="labelType" label="标签类型">
          <template slot-scope="scope">
            <div>
              {{ scope.row.labelType === 1 ? "用户标签" : "商品标签" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="labelName" label="标签名称"> </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
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
              @click="delLabel(scope.row.id)"
              >删除
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
          <el-form-item label="标签类型：" prop="labelType">
            <el-select
              size="small"
              placeholder="请选择标签类型"
              class="userRole"
              v-model="editForm.labelType"
            >
              <el-option label="用户标签" :value="1"></el-option>
              <el-option label="商品标签" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签名称：" prop="labelName">
            <el-input
              size="small"
              v-model="editForm.labelName"
              auto-complete="off"
              placeholder="请输入标签名称"
            >
            </el-input>
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
import { getLabelList, addLabel, editLabel, delLabel } from "../../api/advert.js";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加标签",
      editForm: {
        id: "",
        labelType: "",
        labelName: "",
      },
      // rules表单验证
      rules: {
        labelName: [
          {
            required: true,
            message: "请输入标签名称",
            trigger: "blur",
          },
        ],
        labelType: [
          {
            required: true,
            message: "请输入标签类型",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        labelName: "",
        labelType: "",
        id: "",
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
        start: parameter.page,
        length: parameter.limit,
        id: parameter.id,
        labelName: parameter.labelName,
        labelType: parameter.labelType,
      };
      getLabelList(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
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
        this.title = "修改标签";
        this.editForm.id = row.id;
        this.editForm.labelName = row.labelName;
        this.editForm.labelType = row.labelType;
      } else {
        this.title = "添加标签";
        this.editForm.id = "";
        this.editForm.labelName = "";
        this.editForm.labelType = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editForm.id != "") {
            editLabel(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
            });
          } else {
            addLabel(this.editForm).then((res) => {
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
    delLabel(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delLabel({
            id,
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
      this.formInline.id = "";
      this.formInline.labelName = "";
      this.formInline.labelType = "";
      this.getdata(this.formInline);
    },
    //修改使用状态
    changeStatus(platformId, useStatus) {
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

<style lang="less" scoped>
.userRole {
  width: 100%;
}
</style>
