/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item>广告投放管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
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
          <el-select v-model="formInline.status" placeholder="请选择所属状态">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="已失效" :value="0"></el-option>
            <el-option label="生效中" :value="1"></el-option>
            <el-option label="待生效" :value="2"></el-option>
          </el-select>
        </el-form-item>
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
            @click="addAdvert()"
            >新建
          </el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        class="mb20 aaa"
        size="small"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="id" label="序号" width="200"> </el-table-column>
        <el-table-column sortable prop="platformName" label="所在业务" width="200">
        </el-table-column>
        <el-table-column sortable prop="business" label="业务编码" width="200">
        </el-table-column>
        <el-table-column sortable prop="onThePage" label="所在页面" width="200">
        </el-table-column>
        <el-table-column sortable prop="adSlotCoding" label="广告位编码" width="200">
        </el-table-column>
        <el-table-column sortable prop="adSpaceName" label="广告位名称" width="200">
        </el-table-column>
        <el-table-column sortable prop="advertisingNo" label="广告编码" width="200">
        </el-table-column>
        <el-table-column sortable prop="adHeadline" label="广告标题" width="200">
        </el-table-column>
        <el-table-column sortable prop="effectiveTime" label="有效期" width="200">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }}至{{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="material" label="素材" width="200">
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
        <el-table-column sortable prop="status" label="广告进度" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">已失效</div>
            <div v-else-if="scope.row.status === 1">生效中</div>
            <div v-else>待生效</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="150">
        </el-table-column>
        <el-table-column align="center" label="操作" width="400px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="mini-blue-btn"
              type="primary"
              @click="editAdvert(scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              class="mini-blue-btn"
              type="primary"
              @click="goAdvertDetail(scope.row)"
              >查看详情
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
            <el-button
              size="mini"
              class="mini-blue-btn"
              type="info"
              @click="goDataChart(scope.row)"
            >
              数据分析
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 详情页面 -->
      <el-dialog :visible.sync="advertDetailVisible" width="50%" @click="closeDialog">
        <div class="edit-title">{{ title }}</div>
        <AdvertDetail ref="advertDetail"></AdvertDetail>
        <div></div>
      </el-dialog>
      <!-- 数据分析 -->
      <el-dialog :visible.sync="dataChartVisible" width="60%" @click="closeDialog">
        <div class="edit-title">{{ dataChartTitle }}</div>
        <DataChart ref="dataChart" style="width: 100%; min-height: 500px"></DataChart>
        <div></div>
      </el-dialog>
      <!-- 测试详情页面 -->
      <el-dialog :visible.sync="advertDetailTest" width="70%" @click="closeDialog">
        <div class="edit-title">{{ "测试详情" }}</div>
        <AdvertLineAdd ref="advertDetail"></AdvertLineAdd>
        <div></div>
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
import { adSchedulingList, adSchedulingDisable, advertChangeStatus } from "@/api/advert";
import { BusinessAndPageList } from "@/api/business";
import AdvertDetail from "@/components/software/AdvertDetail";
import DataChart from "@/components/advert_launch_manage/DataChart";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      advertDetailVisible: false, //控制编辑页面显示与隐藏
      advertDetailTest: false,
      dataChartVisible: false, //图表数据
      title: "查看详情",
      dataChartTitle: "图表数据分析",
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
        business: "",
        supportType: "",
        adPageCoding: "",
        page: 1,
        limit: 10,
        status: "",
        beginDate: "",
        endDate: "",
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
    this.getAllAdSpaceByRpc();
    this.getdata(this.formInline);
  },
  components: {
    AdvertDetail,
    DataChart,
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
        status: parameter.status,
        supportType: parameter.supportType,
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
        adPageCoding: parameter.adPageCoding,
        business: parameter.business,
      };
      adSchedulingList(data).then((res) => {
        this.listData = res.data.records;
        //分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    addAdvert() {
      this.$router.push({
        path: "/software/AdvertManageAdd",
      });
    },
    editAdvert(row) {
      this.$router.push({
        path: "/software/AdvertManageAdd",
        query: {
          business: row.business,
          adSlotCoding: row.adSlotCoding,
          advertisingType: row.advertisingType,
          adPageCoding: row.adPageCoding,
        },
      });
    },
    goAdvertDetail(row) {
      this.advertDetailVisible = true;
      this.$nextTick(() => {
        this.$refs.advertDetail.getDetailData(row.adSlotCoding, row.advertisingNo);
      });
    },
    goDataChart(row) {
      this.dataChartVisible = true;
      this.$nextTick(() => {
        let arr = row.startTime.split("-");
        this.$refs.dataChart.getChartData(
          row.adSlotCoding,
          row.advertisingNo,
          arr[0] + "-" + arr[1]
        );
      });
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
    changeBusiness() {
      this.formInline.adPageCoding = "";
      for (let i = 0; i < this.bAndPList.length; i++) {
        if (this.bAndPList[i].business === this.formInline.business) {
          this.inPageList = this.bAndPList[i].childVos;
          return;
        }
      }
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
    getAllAdSpaceByRpc() {
      BusinessAndPageList().then((res) => {
        this.bAndPList = res.data;
      });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    //
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
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
      this.advertDetailVisible = false;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.beginDate = "";
      this.formInline.endDate = "";
      this.formInline.supportType = "";
      this.formInline.status = "";
      this.formInline.adPageCoding = "";
      this.getdata(this.formInline);
    },
  },
};
</script>

<style scoped>
.userRole {
  width: 100%;
}
</style>
