/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="广告名称:">
          <el-input
            size="small"
            v-model="formInline.advertisingName"
            placeholder="请输入广告名称:"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告类型:">
          <el-select
            v-model="formInline.advertisingType"
            placeholder="请选择当前状态"
            disabled
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="开屏" :value="0"></el-option>
            <el-option label="轮播图" :value="1"></el-option>
            <el-option label="外链" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材类型:">
          <el-select
            v-model="formInline.materialType"
            placeholder="请选择当前状态"
            disabled
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="图片" :value="0"></el-option>
            <el-option label="视频" :value="1"></el-option>
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
        <el-table-column sortable prop="id" label="广告ID"> </el-table-column>
        <el-table-column sortable prop="advertisingName" label="广告名称">
        </el-table-column>
        <el-table-column sortable prop="advertisingType" label="广告类型">
          <template slot-scope="scope">
            <div v-if="scope.row.advertisingType === 0">开屏页</div>
            <div v-else-if="scope.row.advertisingType === 1">轮播图</div>
            <div v-else-if="scope.row.advertisingType === 2">外链</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="imgSize" label="尺寸/大小/字符">
        </el-table-column>
        <el-table-column sortable prop="createTime" label="素材">
          <template slot-scope="scope">
            <div>
              {{ scope.row.materialType === 0 ? "图片" : "视频" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="description" label="描述"> </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="mini-green-btn"
              size="mini"
              @click="goChioce(scope.$index, scope.row)"
              >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    </div>
  </div>
</template>

<script>
import {
  searchAdLibrary,
  addAdLibraryAd,
  editLibraryAd,
  deleteAdLibraryAd,
  editAdLabel,
  delAdLabel,
} from "../../api/advert.js";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      deleteIconShow: true,
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加广告",
      editForm: {
        id: "",
        advertisingName: "",
        advertisingType: 0,
        materialType: 0,
        urlList: [],
        videoCoverUrl: "",
        jumpAddress: [],
        jumpPageType: 1,
        androidJumpAddress: "",
        adSlotSizeHeight: "",
        adSlotSizeLong: "",
        iosJumpAddress: "",
        description: "",
        adHeadline: "",
        adSubtitle: "",
        imgSize: "",
        imgProportion: "",
      },
      formInline: {
        page: 1,
        limit: 10,
        advertisingType: "",
        advertisingName: "",
        materialType: "",
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
  created() {},

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
        advertisingName: parameter.advertisingName,
        advertisingType: parameter.advertisingType,
        materialType: parameter.materialType,
      };
      searchAdLibrary(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    giveData(type, materialType = "") {
      this.formInline.advertisingType = type;
      this.formInline.materialType = materialType;
      this.getdata(this.formInline);
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
    deleteImage(index) {
      this.editForm.urlList.splice(index, 1);
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.advertisingName = "";
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
    //刷新url
    refreshUrlList() {
      this.editForm.urlList = [];
      this.editForm.videoCoverUrl = "";
    },
    goChioce(index, row) {
      this.$emit("giveAdvertData", row);
    },
  },
};
</script>

<style lang="less" scoped></style>
