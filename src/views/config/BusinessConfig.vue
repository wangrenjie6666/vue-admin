/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>业务接入配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()"
            >添加</el-button
          >
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
        <el-table-column
          sortable
          prop="operationPlatformCode"
          label="业务平台ID"
          width="200"
        >
        </el-table-column>
        <el-table-column
          sortable
          prop="operationPlatformName"
          label="业务平台名称"
          width="200"
        >
        </el-table-column>
        <el-table-column sortable prop="secretKey" label="业务平台密钥" width="200">
        </el-table-column>
        <el-table-column
          sortable
          prop="isMarketingCenter"
          label="是否接入营销广告中心"
          width="200"
        >
          <template slot-scope="scope">
            <div v-show="scope.row.isMarketingCenter == 0">否</div>
            <div v-show="scope.row.isMarketingCenter == 1">是</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="state" label="状态" width="">
          <template slot-scope="scope">
            <div v-show="scope.row.state == 0">禁用</div>
            <div v-show="scope.row.state == 1">启用</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200">
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
              v-show="scope.row.state == 1"
              @click="disable(scope.row.id)"
              >禁用</el-button
            >
            <el-button
              class="mini-green-btn"
              size="mini"
              type="success"
              v-show="scope.row.state == 0"
              @click="enable(scope.row.id)"
              >启用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="30%" @click="closeDialog">
        <div class="edit-title">{{ title }}</div>
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="平台名称" prop="operationPlatformName">
            <el-input
              size="small"
              v-model="editForm.operationPlatformName"
              auto-complete="off"
              placeholder="请输入平台名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="平台密钥" prop="secretKey">
            <el-input
              size="small"
              v-model="editForm.secretKey"
              auto-complete="off"
              placeholder="请输入平台密钥"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="是否接入" prop="isMarketingCenter">
            <el-select
              size="small"
              placeholder="请选择是否接入"
              class="userRole"
              v-model="editForm.isMarketingCenter"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              size="small"
              placeholder="请选择是否禁用"
              class="userRole"
              v-model="editForm.state"
            >
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
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
  businessList,
  businessInsert,
  businessUpdate,
  businessEnable,
  businessDisable,
  businessDetail,
  businessSearch,
} from "../../api/config";

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
        secretKey: "",
        operationPlatformName: "",
        isMarketingCenter: 1,
        state: 1,
      },
      // rules表单验证
      rules: {
        operationPlatformName: [
          {
            required: true,
            message: "请输入平台名称",
            trigger: "blur",
          },
        ],
        secretKey: [
          {
            required: true,
            message: "请输入平台密钥",
            trigger: "blur",
          },
        ],
        isMarketingCenter: [
          {
            required: true,
            message: "请选择是否接入",
            trigger: "blur",
          },
        ],
        state: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
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
      };
      businessList(data).then((res) => {
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
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.id = row.id;
        this.editForm.secretKey = row.secretKey;
        this.editForm.operationPlatformName = row.operationPlatformName;
        this.editForm.isMarketingCenter = row.isMarketingCenter;
        this.editForm.state = row.state;
      } else {
        this.title = "添加";
        this.editForm.id = "";
        this.editForm.secretKey = "";
        this.editForm.operationPlatformName = "";
        this.editForm.isMarketingCenter = 1;
        this.editForm.state = 1;
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editForm.id != "") {
            businessUpdate(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "业务保存成功！",
              });
            });
          } else {
            businessInsert(this.editForm).then((res) => {
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
    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deptDelete(row.deptId)
            .then((res) => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "公司已删除!",
                });
                this.getdata(this.formInline);
              } else {
                this.$message({
                  type: "info",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("公司删除失败，请稍后再试！");
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
    disable(id) {
      this.$confirm("确定要禁用吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        businessDisable({
          id,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "禁用成功",
          });
          this.getdata(this.formInline);
        });
      });
    },
    enable(id) {
      this.$confirm("确定要启用吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        businessEnable({
          id,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "禁用成功!",
          });
          this.getdata(this.formInline);
        });
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
