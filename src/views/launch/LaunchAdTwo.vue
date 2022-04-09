/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第一步</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第二步</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <Stepbox :active="active" />
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="所属区域">
          <el-select
            v-model="formInline.oneLevelAreaId"
            placeholder="请选择"
            @change="oneChangeArea()"
          >
            <el-option label="全部" :value="0"></el-option>
            <el-option
              :label="item.areaName"
              :value="item.id"
              v-for="(item, index) in oneTreeList"
              :key="index"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="formInline.twoLevelAreaId"
            placeholder="请选择"
            @change="twoChangeArea()"
          >
            <el-option label="全部" :value="0"></el-option>
            <el-option
              :label="item.areaName"
              :value="item.id"
              v-for="(item, index) in twoTreeList"
              :key="index"
            >
            </el-option>
          </el-select>
          <el-select v-model="formInline.threeLevelAreaId" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
            <el-option
              :label="item.areaName"
              :value="item.id"
              v-for="(item, index) in threeTreeList"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="equAddress">
          <el-input
            size="small"
            v-model="formInline.equAddress"
            auto-complete="off"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="formInline.equipKey" placeholder="请选择设备">
            <el-option label="全部" value=""></el-option>
            <el-option label="设备IMEI" value="imei"></el-option>
            <el-option label="设备识别码" value="equNo"></el-option>
            <el-option label="设备名称" value="equName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="equAddress">
          <el-input
            size="small"
            v-model="formInline.equContent"
            auto-complete="off"
            placeholder="请输入设备"
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
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        size="small"
        :data="listData"
        highlight-current-row
        v-loading="loading"
        border
        stripe
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="id" label="设备ID"> </el-table-column>
        <el-table-column sortable prop="imei" label="设备IMEI" min-width="180">
        </el-table-column>
        <el-table-column sortable prop="equNo" label="设备识别码"> </el-table-column>
        <el-table-column sortable prop="equName" label="设备名称"> </el-table-column>
        <el-table-column sortable prop="areaName" label="所属区域"> </el-table-column>
        <el-table-column sortable prop="equAddress" label="设备详细地址">
        </el-table-column>
        <el-table-column sortable prop="equStatus" label="设备状态">
          <template slot-scope="scope">
            <div v-show="scope.row.equStatus == 1">离线</div>
            <div v-show="scope.row.equStatus == 0">在线</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="handleChoice(scope.$index, scope.row.id, 1)"
              v-show="scope.row.choice == 0"
              >选择</el-button
            >
            <el-button
              class="mini-red-btn"
              size="mini"
              @click="handleChoice(scope.$index, scope.row.id, 0)"
              v-show="scope.row.choice == 1"
              >取消选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <h3 style="margin: 20px 0">已选择设备列表</h3>
      <el-table :data="selectedList" stripe style="width: 100%">
        <el-table-column prop="id" label="设备ID" width="180"> </el-table-column>
        <el-table-column prop="imei" label="设备IMEI" width="180"> </el-table-column>
        <el-table-column prop="equNo" label="设备识别码" width="180"> </el-table-column>
        <el-table-column prop="equName" label="设备名称" width="180"> </el-table-column>
      </el-table>
      <div class="sumbit-btn">
        <el-button size="" @click="cancel()">上一步</el-button>
        <el-button size="" type="primary" @click="nextStep()">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import {advertList} from '@/api/advert'
import Stepbox from "@/components/Stepbox";
import { equipmentList, areaTreeList } from "@/api/equipment";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      selectedList: [],
      editForm: {
        id: "",
        ruleName: "",
        advertisingListId: "",
        cycle: 1,
        state: 1,
      },
      areaTreeList: [],
      oneTreeList: [],
      twoTreeList: [],
      threeTreeList: [],
      active: 1,
      // rules表单验证
      rules: {
        ruleName: [
          {
            required: true,
            message: "请输入平台名称",
            trigger: "blur",
          },
        ],
        advertisingListId: [
          {
            required: true,
            message: "请选择自适应平台",
            trigger: "blur",
          },
        ],
        cycle: [
          {
            required: true,
            message: "请选择投放周期",
            trigger: "change",
          },
        ],
        state: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        platform: 0,
        oneLevelAreaId: 0,
        twoLevelAreaId: 0,
        threeLevelAreaId: 0,
        equipKey: "",
        equAddress: "",
        equContent: "",
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
    Stepbox,
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.checkReLoad();
    this.getdata(this.formInline);
    this.getAreaTreeList();
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
        oneLevelAreaId: parameter.oneLevelAreaId,
        twoLevelAreaId: parameter.twoLevelAreaId,
        threeLevelAreaId: parameter.threeLevelAreaId,
        equAddress: parameter.equAddress,
      };
      if (parameter.equipKey != "") {
        data[parameter.equipKey] = parameter.equContent;
      }
      if (data.oneLevelAreaId == 0) {
        data.oneLevelAreaId = "";
      }
      if (data.twoLevelAreaId == 0) {
        data.twoLevelAreaId = "";
      }
      if (data.threeLevelAreaId == 0) {
        data.threeLevelAreaId = "";
      }
      equipmentList(data).then((res) => {
        if (this.selectedList.length > 0) {
          this.listData = res.data.records.map((item) => {
            item.choice = 0;
            this.selectedList.some((item1, index1) => {
              if (item1.id == item.id) {
                item["choice"] = 1;
                return true;
              }
            });
            return item;
          });
        } else {
          this.listData = res.data.records.map((item) => {
            item["choice"] = 0;
            return item;
          });
        }

        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    handleChoice(index, id, status) {
      this.$set(this.listData[index], "choice", status);
      if (status == 1) {
        this.selectedList.push(this.listData[index]);
      } else {
        this.selectedList.some((item, index1) => {
          console.log(item.id, id);
          if (item.id == id) {
            this.selectedList.splice(index1, 1);
            return;
          }
        });
      }
    },
    getAreaTreeList() {
      areaTreeList().then((res) => {
        this.areaTreeList = res.data;
        this.areaTreeList.forEach((item, index) => {
          this.oneTreeList.push(item);
        });
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
    nextStep() {
      if (this.selectedList.length < 1) {
        this.$message.error("请先选择要投放的设备");
        return;
      }
      let arrids = [];
      this.selectedList.forEach((item) => {
        arrids.push(item.id);
      });
      let strids = arrids.toString();
      //记录到vuex
      let data = {
        equipmentIds: strids,
        selectedEQList: this.selectedList,
      };
      //先放到vuex上
      this.$store.commit("saveLaunchAd", data);
      this.$router.push({
        path: "/launch/launchAdThree",
      });
    },
    checkReLoad() {
      let launchdata = this.$store.state.launchAdData;
      let judge = true;
      for (let obj in launchdata) {
        if (launchdata[obj] != "") {
          return false;
        }
      }
      if (judge) {
        this.$message.warning("重载数据出错，正在返回");
        this.$router.push({
          path: "/launch/launchAd",
        });
      }
    },
    cancel() {
      this.$router.push({
        path: "/launch/LaunchAdOne",
      });
    },
    //一级响应
    oneChangeArea() {
      let id = this.formInline.oneLevelAreaId;
      this.formInline.twoLevelAreaId = 0;
      this.formInline.threeLevelAreaId = 0;
      this.twoTreeList = [];
      this.threeTreeList = [];
      this.oneTreeList.some((item, index) => {
        if (item.id == id) {
          this.twoTreeList = item.children;
          return true;
        }
      });
    },
    //二级响应
    twoChangeArea() {
      let id = this.formInline.twoLevelAreaId;
      this.formInline.threeLevelAreaId = 0;
      this.threeTreeList = [];
      this.twoTreeList.some((item, index) => {
        if (item.id == id) {
          this.threeTreeList = item.children;
          return true;
        }
      });
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.oneLevelAreaId = 0;
      this.formInline.twoLevelAreaId = 0;
      this.formInline.threeLevelAreaId = 0;
      this.formInline.equName = "";
      this.formInline.equipKey = "";
      this.formInline.equContent = "";
      this.formInline.equAddress = "";
      this.formInline.equStatus = "";
      this.getdata(this.formInline);
    },
  },
};
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}

.userRole {
  width: 100%;
}

.sumbit-btn {
  margin-top: 40px;
  text-align: center;
}
</style>
