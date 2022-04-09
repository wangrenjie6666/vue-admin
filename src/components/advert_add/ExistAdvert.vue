/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff" v-if="this.formInline.adSlotCoding != ''">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="广告标题：">
          <el-input
            size="small"
            v-model="formInline.adHeadline"
            placeholder="请输入广告名称"
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
      <div class="list-type">
        <div
          :class="{ 'active-navie': this.formInline.status === 1 ? true : false }"
          @click="goIneffect(1)"
        >
          生效中
        </div>
        <div
          :class="{ 'active-navie': this.formInline.status === 2 ? true : false }"
          @click="goIneffect(2)"
        >
          待生效
        </div>
        <div
          :class="{ 'active-navie': this.formInline.status === 0 ? true : false }"
          @click="goIneffect(0)"
        >
          已失效
        </div>
      </div>
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
        <el-table-column sortable prop="id" label="ID"> </el-table-column>
        <el-table-column sortable prop="adHeadline" label="广告标题"> </el-table-column>
        <el-table-column sortable prop="labelName" label="素材">
          <template slot-scope="scope">
            <div>
              {{ scope.row.supportType === 0 ? "图片" : "视频" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="useStatus" label="状态">
          <template slot-scope="scope">
            {{ scope.row.useStatus === 0 ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column sortable label="有效时间">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }}至{{ scope.row.endTime }}</div>
          </template>
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
              @click="adSchedulingDisable(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="60%" @click="closeDialog">
        <div class="edit-title">{{ title }}</div>
        <div>
          <OpenScreenPageAdd
            ref="openScreenPageAdd"
            @closeDialog="closeDialog"
            @cancelDialog="cancelDialog"
          />
        </div>
        <div slot="footer" class="dialog-footer"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  adSchedulingList,
  adSchedulingDisable,
  advertChangeStatus,
} from "../../api/advert.js";
import OpenScreenPageAdd from "@/components/software/OpenScreenPageAdd.vue";
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
            message: "请输入用户类型",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        business: "",
        adSlotCoding: "",
        adHeadline: "",
        status: 1,
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
  components: {
    OpenScreenPageAdd,
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */

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
        adSlotCoding: parameter.adSlotCoding,
        adHeadline: parameter.adHeadline,
        status: parameter.status,
      };

      adSchedulingList(data).then((res) => {
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
    getNullBusiness() {
      this.formInline.adSlotCoding = "";
    },
    adSchedulingDisable(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          adSchedulingDisable({
            id,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
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
    getListData(data) {
      this.formInline.business = data.business;
      this.formInline.adSlotCoding = data.adSlotCoding;
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
      let data = {
        business: this.formInline.business,
        adSlotCoding: this.formInline.adSlotCoding,
      };
      if (row != undefined && row != "undefined") {
        this.title = "修改广告";
        data.editForm = row;
      } else {
        this.title = "新增广告";
      }
      this.$nextTick(() => {
        this.$refs.openScreenPageAdd.giveData(data);
      });
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
      this.$emit("refreshData", {});
    },
    cancelDialog() {
      this.editFormVisible = false;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.adHeadline = "";
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
    goIneffect(status) {
      this.formInline.status = status;
      this.getdata(this.formInline);
    },
  },
};
</script>

<style lang="less" scoped>
.userRole {
  width: 100%;
}

.list-type {
  display: flex;

  > .active-navie {
    background: #0290ff;
  }

  > div {
    margin-right: 8px;
    padding: 10px 16px;
    border-radius: 8px 8px 0px 0px;
    color: #fff;
    cursor: pointer;
    background: #cccccc;
  }
}
</style>
