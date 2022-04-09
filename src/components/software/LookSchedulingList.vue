/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/software/AdvertManage' }"
        >业务对接管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>广告排期</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mb20 pd2435 businessinfo">
      <div class="title">广告位信息</div>
      <div class="detail">
        <div>
          <span>广告位编码:</span><span>{{ infoData.adSlotCoding }}</span>
        </div>
        <div>
          <span>所属业务:</span><span>{{ infoData.business }}</span>
        </div>
        <div>
          <span>所属页面:</span><span>{{ infoData.onThePage }}</span>
        </div>
        <div>
          <span>支持类型:</span
          ><span>{{ infoData.supportType === 0 ? "图片" : "视频" }}</span>
        </div>
        <div>
          <span>最大数量:</span><span>{{ infoData.maximumNumber }}</span>
        </div>
        <div>
          <span>尺寸:</span><span>{{ infoData.adSlotSize }}</span>
        </div>
        <div>
          <span>描述:</span><span>{{ infoData.description }}</span>
        </div>
      </div>
    </div>

    <div class="pd3732 bgfff">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="广告标题:">
          <el-input
            size="small"
            v-model="formInline.adHeadline"
            auto-complete="off"
            placeholder="请输入广告标题"
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
      <div class="list-type">
        <div class="all" @click="goIneffect('')">全部</div>
        <div class="ineffect" @click="goIneffect(1)">生效中</div>
        <div class="pending-failure" @click="goIneffect(2)">待生效</div>
        <div class="Invalid" @click="goIneffect(0)">已失效</div>
      </div>
      <el-table
        size="small"
        :data="listData"
        class="mb20"
        stripe
        highlight-current-row
        v-loading="loading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="id" label="排序" width="100"> </el-table-column>
        <el-table-column sortable prop="adSlotCoding" label="广告编号"> </el-table-column>
        <el-table-column sortable prop="adHeadline" label="广告标题"> </el-table-column>
        <!-- <el-table-column sortable prop="linkObject" label="链接对象"> </el-table-column> -->
        <el-table-column sortable prop="useStatus" label="状态">
          <template slot-scope="scope">
            {{ scope.row.useStatus === 0 ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="status" label="广告进度">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">已失效</div>
            <div v-else-if="scope.row.status === 1">生效中</div>
            <div v-else>待生效</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="material" label="素材">
          <template slot-scope="scope">
            {{ scope.row.supportType === 0 ? "图片" : "视频" }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="remark" label="描述"> </el-table-column>
        <el-table-column sortable label="有效时间">
          <template slot-scope="scope">
            {{ scope.row.startTime }}-{{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="goAdvertDetail(scope.row)"
              >广告详情
            </el-button>
            <el-button
              size="mini"
              class="mini-red-btn"
              type="danger"
              @click="adSchedulingDisable(scope.row.id)"
              >删除
            </el-button>
            <el-button
              v-if="scope.row.useStatus === 0"
              size="mini"
              class="mini-red-btn"
              type="danger"
              @click="advertChangeStatus(scope.row.id, 1)"
              >禁用
            </el-button>
            <el-button
              v-else
              size="mini"
              class="mini-green-btn"
              type="danger"
              @click="advertChangeStatus(scope.row.id, 0)"
            >
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    </div>
    <!-- 详情页面 -->
    <el-dialog :visible.sync="advertDetailVisible" width="50%" @click="closeDialog">
      <div class="edit-title">{{ title }}</div>
      <AdvertDetail ref="advertDetail"></AdvertDetail>
      <div></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  adSchedulingList,
  adSchedulingDisable,
  advertChangeStatus,
} from "@/api/advert.js";
import AdvertDetail from "@/components/software/AdvertDetail";
export default {
  data() {
    return {
      nshow: true, //switch开启
      savedata: "",
      fshow: false, //switch关闭
      loading: false, //是显示加载
      advertDetailVisible: false, //控制编辑页面显示与隐藏
      title: "查看详情",
      businessList: [],
      // rules表单验证
      formInline: {
        page: 1,
        limit: 10,
        business: "",
        onThePage: "",
        adSlotCoding: "",
        supportType: "",
        status: "",
        beginDate: "",
        endDate: "",
        adHeadline: "",
      },
      infoData: {
        business: "",
        onThePage: "",
        adSlotCoding: "",
        supportType: "",
        status: "",
        maximumNumber: "",
        description: "",
        adSlotSize: "",
        adSpaceName: "",
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
  components: {
    AdvertDetail,
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.formInline.business = this.$route.query.business;
    this.formInline.onThePage = this.$route.query.onThePage;
    this.formInline.adSlotCoding = this.$route.query.adSlotCoding;
    this.formInline.supportType = parseInt(this.$route.query.supportType);
    this.assignmentInfoData(this.$route.query);
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
        adSlotCoding: parameter.adSlotCoding,
        supportType: parameter.supportType,
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
        status: parameter.status,
        adHeadline: parameter.adHeadline,
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
    //重置
    resetRefresh() {
      //设为初始化
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.beginDate = "";
      this.formInline.endDate = "";
      this.formInline.adHeadline = "";
      this.getdata(this.formInline);
    },
    goIneffect(status) {
      this.formInline.status = status;
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
    goAdvertDetail(row) {
      this.advertDetailVisible = true;
      this.$nextTick(() => {
        this.$refs.advertDetail.getDetailData(row.adSlotCoding, row.advertisingNo);
      });
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
    advertChangeStatus(id, useStatus) {
      this.$confirm("确定要执行次操作吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          advertChangeStatus({
            id,
            useStatus,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "执行成功!",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.$message.error("数据执行失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消执行",
          });
        });
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
    businessPageDelete(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          businessPageDelete({
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
    businessPageUpdateState(id, state) {
      let desc = state == true ? "确定要启用吗？" : "确定要禁用吗？";
      this.$confirm(desc, "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          businessPageUpdateState({
            id,
            flag: state,
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
    //赋值数据
    assignmentInfoData(query) {
      this.infoData.business = query.business;
      this.infoData.onThePage = query.onThePage;
      this.infoData.adSlotCoding = query.adSlotCoding;
      this.infoData.supportType = parseInt(query.supportType);
      this.infoData.status = query.status;
      this.infoData.maximumNumber = query.maximumNumber;
      this.infoData.description = query.description;
      this.infoData.adSlotSize = query.adSlotSize;
      this.infoData.adSpaceName = query.adSpaceName;
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
    flex-wrap: wrap;

    > div {
      margin-right: 118px;
      font-size: 14px;
      margin-top: 10px;

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

.list-type {
  display: flex;

  > div {
    margin-right: 8px;
    padding: 10px 16px;
    border-radius: 8px 8px 0px 0px;
    color: #fff;
    cursor: pointer;
  }

  .ineffect {
    background: #0290ff;
  }

  .all {
    background: #67c23a;
  }

  .pending-failure {
    background: #ff5f74;
  }

  .Invalid {
    background: #cccccc;
  }
}
</style>
