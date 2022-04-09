/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item>广告活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="创建时间:">
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
        <el-form-item label="状态:">
          <el-select v-model="formInline.processStatus" placeholder="请选择当前状态">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="投放中 " :value="1"></el-option>
            <el-option label="审核未通过" :value="2"></el-option>
          </el-select>
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
        class="mb20"
        size="small"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="phone" label="用户账号" width="200">
        </el-table-column>
        <el-table-column sortable prop="size" label="图片大小" width="200">
        </el-table-column>
        <el-table-column sortable prop="url" label="广告图片" width="200">
          <template slot-scope="scope">
            <div
              class="img-center"
              style="width: 100%; height: 150px"
              v-if="scope.row.url"
            >
              <el-image
                :src="scope.row.url"
                alt=""
                class="image"
                :preview-src-list="[scope.row.url]"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="pixel" label="图片像素" width="200">
        </el-table-column>
        <el-table-column sortable prop="proportion" label="比例" width="200">
        </el-table-column>
        <el-table-column sortable prop="address" label="落地页地址" width="200">
        </el-table-column>
        <el-table-column sortable prop="applyTime" label="申请时间" width="200">
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column sortable prop="processStatus" label="状态" width="">
          <template slot-scope="scope">
            <div v-if="scope.row.processStatus === 0">审核中</div>
            <div v-else-if="scope.row.processStatus === 1">投放中</div>
            <div v-else-if="scope.row.processStatus === 2">审核未通过</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="300" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              v-if="scope.row.processStatus === 0"
              @click="advertActivityVerify(scope.row.id, 1)"
              >通过
            </el-button>
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              v-if="scope.row.processStatus === 0"
              @click="advertActivityVerify(scope.row.id, 2)"
              >拒绝
            </el-button>
            <a :href="scope.row.url" download="下载图片" target="blank">查看图片大图</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="30%" @click="closeDialog">
        <div class="edit-title">{{ title }}</div>
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="拒绝原因：" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入拒绝原因"
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
            >确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { advertActivityList, advertActivityVerify } from "@/api/advert_activity";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "拒绝原因",
      editForm: {
        remark: "",
        id: "",
      },
      // rules表单验证
      rules: {
        remark: [
          {
            required: true,
            message: "拒绝原因必须说明",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        processStatus: "",
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
        start: parameter.page,
        length: parameter.limit,
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
        processStatus: parameter.processStatus,
      };
      advertActivityList(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
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
      this.title = "修改业务";
      this.editForm.remark = "";
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          advertActivityVerify({
            id: this.editForm.id,
            processStatus: 2,
            remark: this.editForm.remark,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.editFormVisible = false;
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.$message.error("数据操作失败，请稍后再试！");
            });
        }
      });
    },
    // 删除公司
    advertActivityVerify(id, processStatus) {
      this.$confirm("确定要执行此操作吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (processStatus === 2) {
            this.editFormVisible = true;
            this.editForm.id = id;
            return;
          }
          advertActivityVerify({
            id,
            processStatus,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.$message.error("数据操作失败，请稍后再试！");
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
      this.formInline.processStatus = "";
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
a {
  text-decoration: none;
  color: #66b1ff;
}
</style>
