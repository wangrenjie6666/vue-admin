/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/business/BusinessDockConfig' }"
        >业务对接管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>页面列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mb20 pd2435 businessinfo">
      <div class="title">业务信息</div>
      <div class="detail">
        <div>
          <span>业务名称:</span><span>{{ infoData.platformName }}</span>
        </div>
        <div>
          <span>业务编码:</span> <span>{{ infoData.platformCode }}</span>
        </div>
        <div>
          <span>状态:</span><span>{{ infoData.useStatus === 0 ? "启用" : "禁用" }}</span>
        </div>
      </div>
    </div>

    <div class="pd3732 bgfff">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="页面名称:">
          <el-input
            size="small"
            v-model="formInline.onThePage"
            auto-complete="off"
            placeholder="请输入用户页面名称"
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
        <el-table-column sortable prop="onThePage" label="页面名称"> </el-table-column>
        <el-table-column sortable prop="adPageCoding" label="页面编码"> </el-table-column>
        <el-table-column sortable prop="deleted" label="开屏页">
          <template slot-scope="scope">
            <div v-show="scope.row.pageType === 1">是</div>
            <div v-show="scope.row.pageType === 2">否</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="time" label="状态">
          <template slot-scope="scope">
            <div v-show="scope.row.status === 0">启用</div>
            <div v-show="scope.row.status === 1">禁用</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="description" label="描述" width="200">
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="mini-red-btn"
              size="mini"
              v-if="scope.row.status == 0"
              @click="updateAdPageStatus(scope.row.id, 1)"
              >禁用
            </el-button>
            <el-button
              class="mini-green-btn"
              size="mini"
              v-else
              @click="updateAdPageStatus(scope.row.id, 0)"
              >启用
            </el-button>
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              @click="deleteAdPageById(scope.row.adPageCoding)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    </div>
    <!-- 编辑界面 -->
  </div>
</template>

<script>
import { getAdPageList, deleteAdPageById, updateAdPageStatus } from "@/api/business.js";

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
        business: "",
        onThePage: "",
      },
      infoData: {
        platformCode: "",
        platformName: "",
        deleted: "",
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
    this.formInline.business = this.$route.query.platformCode;
    this.infoData.platformCode = this.$route.query.platformCode;
    this.infoData.platformName = this.$route.query.platformName;
    this.infoData.useStatus = parseInt(this.$route.query.useStatus);
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
        business: parameter.business,
        onThePage: parameter.onThePage,
      };
      getAdPageList(data).then((res) => {
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
    //重置
    resetRefresh() {
      //设为初始化
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.onThePage = "";
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
    // 删除
    deleteAdPageById(adPageCoding) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAdPageById({
            adPageCoding,
            business: this.formInline.business,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "数据已删除!",
            });
            this.getdata(this.formInline);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateAdPageStatus(id, status) {
      let desc = status === 0 ? "确定要启用吗？" : "确定要禁用吗？";
      this.$confirm(desc, "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateAdPageStatus({
            id,
            business: this.formInline.business,
            status,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getdata(this.formInline);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.main-layout {
  display: flex;
  height: 100%;
  flex-direction: column;

  > div:nth-child(2) {
    flex: 0 !important;
  }

  > div:nth-child(3) {
    flex: 1 !important;
  }
}

.businessinfo {
  background: #fff;

  .title {
    width: 56px;
    height: 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.85);
    opacity: 1;
  }

  .detail {
    margin-top: 16px;
    display: flex;
    flex-direction: row;

    > div {
      margin-right: 118px;
      font-size: 14px;

      span:nth-child(1) {
        color: rgba(0, 0, 0, 0.45);
        margin-right: 5px;
      }

      span:nth-child(2) {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: bold;
      }
    }
  }
}
</style>
