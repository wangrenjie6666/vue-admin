/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item>广告投放管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="所在业务:">
          <el-select
            v-model="formInline.business"
            placeholder="请选择所在业务"
            @change="changeBusiness()"
          >
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="(item, index) in bAndPList"
              :key="index"
              :label="item.platformName"
              :value="item.business"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在页面:">
          <el-select v-model="formInline.adPageCoding" placeholder="请选择所在页面">
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="(item, index) in inPageList"
              :key="index"
              :label="item.onThePage"
              :value="item.adPageCoding"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支持类型:">
          <el-select v-model="formInline.supportType" placeholder="请选择支持类型">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="视频" :value="1"></el-option>
            <el-option label="图片" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="formInline.beginDate"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1" style="text-align: center">--</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="结束日期"
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
        <el-table-column sortable prop="platformName" label="业务名称"> </el-table-column>
        <el-table-column sortable prop="business" label="业务编码"> </el-table-column>
        <el-table-column sortable prop="onThePage" label="所在页面"> </el-table-column>
        <el-table-column sortable prop="adSlotCoding" label="广告位编码">
        </el-table-column>
        <el-table-column sortable prop="adSpaceName" label="广告位名称">
        </el-table-column>
        <el-table-column sortable prop="createTime" label="支持类型">
          <template slot-scope="scope">
            <div v-if="scope.row.supportType === 0">图片</div>
            <div v-else>视频</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="maximumNumber" label="最大数量">
        </el-table-column>
        <el-table-column sortable prop="adSlotSize" label="广告位尺寸"> </el-table-column>
        <el-table-column sortable label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">启用</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="description" label="描述"> </el-table-column>
        <el-table-column sortable prop="creationTime" label="创建时间"> </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="lookScheduling(scope.$index, scope.row)"
            >
              查看排期
            </el-button>

            <el-button
              class="mini-red-btn"
              size="mini"
              v-if="scope.row.status == 0"
              @click="pageDisableAndEnable(scope.row, 1)"
              >禁用
            </el-button>
            <el-button
              class="mini-green-btn"
              size="mini"
              v-else
              @click="pageDisableAndEnable(scope.row, 0)"
              >启用
            </el-button>
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              @click="pageListDelete(scope.row)"
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
          <el-form-item label="业务名称" prop="platformName">
            <el-input
              size="small"
              v-model="editForm.platformName"
              auto-complete="off"
              placeholder="请输入平台名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务编码" prop="platformCode">
            <el-input
              size="small"
              v-model="editForm.platformCode"
              auto-complete="off"
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
import { getAllAdSpaceByRpc } from "../../api/advert.js";
import {
  BusinessAndPageList,
  pageDisableAndEnable,
  pageListDelete,
} from "@/api/business";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      bAndPList: [],
      inPageList: [],
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
            message: "请输入platformCode",
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
        business: "",
        adPageCoding: "",
        supportType: "",
        status: "",
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
    this.getBusinessAndPageList();
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
        // platformName: parameter.platformName,
        start: parameter.page,
        length: parameter.limit,
        business: parameter.business,
        adPageCoding: parameter.adPageCoding,
        supportType: parameter.supportType,
        status: parameter.status,
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
      };
      getAllAdSpaceByRpc(data).then((res) => {
        this.listData = res.data.list;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.count;
      });
    },
    getBusinessAndPageList() {
      BusinessAndPageList().then((res) => {
        this.bAndPList = res.data;
      });
    },
    changeBusiness() {
      this.formInline.adPageCoding = "";
      if (this.formInline.business === "") {
        return;
      }
      for (let i = 0; i < this.bAndPList.length; i++) {
        if (this.bAndPList[i].business === this.formInline.business) {
          this.inPageList = this.bAndPList[i].childVos;
          return;
        }
      }
    },
    goBusinessPageList(platformCode, platformName, deleted) {
      this.$router.push({
        path: "/business/BusinessPageList",
        query: {
          platformCode,
          platformName,
          deleted,
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
    //查看排期
    lookScheduling(index, row) {
      // return;
      this.$router.push({
        path: "/software/LookSchedulingList",
        query: {
          business: row.business,
          onThePage: row.onThePage,
          adSlotCoding: row.adSlotCoding,
          supportType: row.supportType,
          status: row.status,
          maximumNumber: row.maximumNumber,
          description: row.description,
          adSlotSize: row.adSlotSize,
          adSpaceName: row.adSpaceName,
        },
      });
    },
    goAdvertManageAdd(index, row) {
      if (row.childList) {
        row.childList = JSON.stringify(row.childList);
      }
      this.$router.push({
        query: row,
        path: "/software/AdvertManageAdd",
      });
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
      this.formInline.supportType = "";
      this.formInline.status = "";
      this.formInline.adPageCoding = "";
      this.formInline.business = "";
      this.getdata(this.formInline);
    },
    pageDisableAndEnable(row, status) {
      let desc = status === 0 ? "确定要启用吗？" : "确定要禁用吗？";
      this.$confirm(desc, "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          pageDisableAndEnable({
            id: row.id,
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
    // 删除
    pageListDelete(row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          pageListDelete({
            adSlotCoding: row.adSlotCoding,
            business: row.business,
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
  },
};
</script>

<style scoped>
.userRole {
  width: 100%;
}
</style>
