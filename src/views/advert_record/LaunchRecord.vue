/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>设备广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
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
        <el-form-item label="适用平台:">
          <el-select
            v-model="formInline.operationPlatformName"
            placeholder="请选择适用平台"
          >
            <el-option label="全部" :value="''"></el-option>
            <el-option
              :label="item.operationPlatformName"
              v-for="(item, index) in businessList"
              :key="index"
              :value="item.operationPlatformName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--      <el-form-item label="设备imei:" >-->
        <!--        <el-input size="small" v-model="formInline.imei" auto-complete="off"-->
        <!--                  placeholder="请输入imei"></el-input>-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="设备名称:">-->
        <!--        <el-input size="small" v-model="formInline.equName" auto-complete="off"-->
        <!--                  placeholder="请输入设备名称"></el-input>-->
        <!--      </el-form-item>-->
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
            >重置</el-button
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
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="subjectId" label="广告ID" width="100">
        </el-table-column>
        <el-table-column sortable prop="advertisingname" label="广告名称" width="200">
        </el-table-column>
        <!--      <el-table-column sortable prop="username" label="投放用户" width="200">-->
        <!--      </el-table-column>-->
        <el-table-column
          sortable
          prop="operationPlatformName"
          label="适用平台"
          width="200"
        >
        </el-table-column>
        <el-table-column sortable prop="createTime" label="提交时间" width="200">
        </el-table-column>
        <el-table-column sortable label="投放状态">
          <template slot-scope="scope">
            <div v-if="scope.row.useStatus == 1">未开始</div>
            <div v-else-if="scope.row.useStatus == 2">进行中</div>
            <div v-else-if="scope.row.useStatus == 3">已撤销</div>
            <div v-else>已结束</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              type="primary"
              v-if="scope.row.useStatus == 2"
              @click="sentCommand(scope.row.subjectId)"
              >立即下发</el-button
            >
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              v-if="scope.row.useStatus == 1"
              @click="updateAdvert(scope.row.subjectId)"
              >广告下线</el-button
            >
            <el-button
              class="mini-red-btn"
              size="mini"
              type="warning"
              v-if="scope.row.useStatus == 2"
              @click="updateAdvert(scope.row.subjectId)"
              >撤销</el-button
            >
            <el-button
              class="mini-green-btn"
              size="mini"
              @click="goDetail(scope.row.subjectId)"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog
        :title="title"
        :visible.sync="editFormVisible"
        width="60%"
        @click="closeDialog"
      >
        <table
          border="0"
          cellspacing="0"
          cellpadding="5"
          v-for="(item, index) in savedata.advertisingCopyList"
          :key="index"
        >
          <tr>
            <th>广告名称:</th>
            <td>{{ item.advertisingName }}</td>
            <th>二维码链接地址:</th>
            <td>{{ item.erWeiMaUrl }}</td>
          </tr>
          <tr>
            <th>视频广告：</th>
            <td>
              <div class="vodeo-class" @click="goVideo(item.mp4url)">
                <i class="el-icon-video-play video-icon"></i>
              </div>
            </td>
          </tr>
        </table>
        <table border="0" cellspacing="0" cellpadding="5" class="mt20 table-3">
          <tbody v-for="(item, index) in savedata.equipmentListVos" :key="index">
            <tr>
              <th>设备id:</th>
              <td>{{ item.equipmentId }}</td>
              <th>设备IMEI:</th>
              <td>
                <el-tooltip placement="top">
                  <div slot="content" style="color: #fff">{{ item.imei }}</div>
                  <div class="tool-tip">{{ item.imei }}</div>
                </el-tooltip>
              </td>
              <th>设备识别码:</th>
              <td>
                <el-tooltip placement="top">
                  <div slot="content" style="color: #fff">{{ item.equNo }}</div>
                  <div class="tool-tip">{{ item.equNo }}</div>
                </el-tooltip>
              </td>
              <th>设备名称:</th>
              <td>
                <el-tooltip placement="top">
                  <div slot="content" style="color: #fff">{{ item.equName }}</div>
                  <div class="tool-tip">{{ item.equName }}</div>
                </el-tooltip>
              </td>
            </tr>
            <tr>
              <th style="vertical-align: top; padding-top: 40px">
                <div>投放时间:</div>
              </th>
              <td style="overflow: visible">
                <!--            <div class="year-time">{{item.yearStr}}-{{item.monthStr}}</div>-->
                <div
                  class="date-mg"
                  style="vertical-align: top; width: 600px; height: 300px; overflow: auto"
                >
                  <div
                    class="date"
                    v-for="(item1, index1) in item.simpleTimeList"
                    :key="index1"
                  >
                    <div class="colorfff">
                      <span class="colorfff">{{ item1 }}</span
                      ><span class="colorfff"></span>
                    </div>
                    <!--                <div class="colorfff"><span class="colorfff">00:00</span>~<span class="colorfff">24:00</span></div>-->
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { advertList, advertDetail, advertUpdate } from "@/api/advert";
import { sentCommand } from "@/api/equipment.js";
import { businessSearch } from "@/api/config.js";

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
        imei: "",
        operationPlatformName: "",
        equName: "",
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
    this.getBusinessList();
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
        imei: parameter.imei,
        operationPlatformName: parameter.operationPlatformName,
        equName: parameter.equName,
      };
      advertList(data).then((res) => {
        this.listData = res.data.list;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.count;
      });
    },
    getBusinessList() {
      businessSearch().then((res) => {
        this.businessList = res.data.list;
      });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    goVideo(url) {
      window.open(url, "_blank");
    },
    sentCommand(subjectId) {
      this.$confirm("是否要立即下发此广告?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        sentCommand({
          subjectId,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "下发成功!！",
          });
          this.getdata(this.formInline);
        });
      });
    },
    updateAdvert(subjectId) {
      this.$confirm("确定要此广告状态进行修改吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        advertUpdate({
          subjectId,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "更改成功！",
          });
          this.getdata(this.formInline);
        });
      });
    },
    //重置
    resetRefresh() {
      //设为初始化
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.beginDate = "";
      this.formInline.endDate = "";
      this.formInline.imei = "";
      this.formInline.operationPlatformName = "";
      this.formInline.equName = "";
      this.getdata(this.formInline);
    },
    goDetail(subjectId) {
      let data = {
        subjectId,
      };
      advertDetail(data).then((res) => {
        // res.data.equipmentListVos.forEach((item,index)=>{
        //   item.daydata=[];
        //   item.timeList=item.dayStr.split(',');
        // })
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

<style scoped>
.userRole {
  width: 100%;
}

.year-time {
  width: 105px;
  height: 43px;
  padding: 5px;
  background: #efefef;
  text-align: center;
  line-height: 43px;
}

.date {
  margin-right: 20px;
  width: 105px;
  height: 43px;
  line-height: 43px;
  margin-top: 10px;
  text-align: center;
  padding: 5px;
  color: #fff;
  background: #409eff;
}

table {
  border: 1px #ccc solid;
  width: 100%;
  text-align: left;
  padding: 20px;
}

table th {
  color: #999;
  font-weight: 500;
}

table tr {
  margin-top: 20px;
  padding: 20px;
}

.colorfff {
  color: #fff;
}

table td {
  padding: 20px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vodeo-class {
  width: 120px;
  height: 120px;
  background: black;
  line-height: 150px;
  text-align: center;
  cursor: pointer;
}

.video-icon {
  font-size: 40px;
  color: #fff;
}

.table-3 {
  display: block;
  max-height: 500px;
  overflow-y: auto;
}

.date-mg {
  display: flex;
  flex-wrap: wrap;
}

.tool-tip {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
