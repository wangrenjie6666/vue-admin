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
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="allChoice" @change="changeAllChoice"></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isChocie"
              @change="handleSelectionChange()"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column sortable prop="id" label="广告ID"> </el-table-column>
        <el-table-column sortable prop="advertisingName" label="广告名称">
        </el-table-column>
        <el-table-column sortable label="广告视频地址">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content" style="color: #fff; max-width: 500px">
                {{ scope.row.mp4url }}
              </div>
              <div class="tool-tip">{{ scope.row.mp4url }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable prop="erWeiMaUrl" label="二维码链接地址">
        </el-table-column>
        <el-table-column sortable prop="operationPlatformName" label="适用平台">
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    </div>
  </div>
</template>

<script>
import { advertList2 } from "@/api/advert";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      deleteIconShow: true,
      allChoice: false,
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加广告",
      multipleSelection: [],
      existIds: "",
      clickPageStatus: false,
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
        advertisingListId: "",
        advertisingName: "",
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
        advertisingListId: parameter.advertisingListId,
        advertisingName: parameter.advertisingName,
      };
      advertList2(data).then((res) => {
        this.listData = res.data.records.map((item) => {
          item.isChocie = false;
          return item;
        });
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
        this.$nextTick(() => {
          this.changemultipleData();
        });
      });
    },
    changemultipleData() {
      this.listData = this.listData.map((item) => {
        this.multipleSelection.map((item1) => {
          if (item1.id === item.id) {
            item.isChocie = true;
            return true;
          }
        });
        return item;
      });
    },
    changeAllChoice() {
      this.listData = this.listData.map((item, index) => {
        item.isChocie = this.allChoice;
        return item;
      });
      this.handleSelectionChange();
    },
    getMultipleData() {
      if (this.multipleSelection.length > 0 && this.multipleSelection.length <= 5) {
        return this.multipleSelection;
      }
      if (this.multipleSelection.length === 0) {
        this.$message.info("至少选择一个视频广告");
        return false;
      }
      if (this.multipleSelection.length > 5) {
        this.$message.info("视频广告不得超过5个");
        return false;
      }
    },
    giveData(type, materialType = "") {
      this.formInline.advertisingType = type;
      this.formInline.materialType = materialType;
      this.getdata(this.formInline);
    },
    // 分页插件事件
    callFather(parm) {
      this.clickPageStatus = true;
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.allChoice = false;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    handleSelectionChange() {
      //当前页面id
      let pageIdsArr = [];
      //当前选中id
      let pageChoiceIdsArr = [];
      //所有视频的id
      let multipleSelectIds = [];
      this.multipleSelection; //多选按钮所有数据

      this.listData.forEach((item, index) => {
        if (item.isChocie) pageChoiceIdsArr.push(item.id);
      });
      this.listData.forEach((item, index) => {
        pageIdsArr.push(item.id);
      });
      this.multipleSelection.forEach((item, index) => {
        multipleSelectIds.push(item.id);
      });
      //取差集
      let a = new Set(pageIdsArr);
      let b = new Set(pageChoiceIdsArr);
      let c = new Set(multipleSelectIds);

      let differenceAB = Array.from(new Set([...a].filter((x) => !b.has(x))));

      let differenceBC = Array.from(new Set([...b].filter((x) => !c.has(x))));

      if (this.multipleSelection.length > 0) {
        for (let i = this.multipleSelection.length - 1; i >= 0; i--) {
          differenceAB.some((item, index) => {
            if (item === this.multipleSelection[i].id) {
              this.multipleSelection.splice(i, 1);
              return true;
            }
          });
        }
      }
      this.listData.forEach((item, index) => {
        differenceBC.forEach((item1, index1) => {
          if (item.id === item1) {
            this.multipleSelection.push(item);
          }
        });
      });
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
    transferData(advertList) {
      this.multipleSelection = JSON.parse(JSON.stringify(advertList));
      this.getdata(this.formInline);
    },
  },
};
</script>

<style lang="less" scoped>
.tool-tip {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
