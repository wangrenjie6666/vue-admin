<template>
  <div>
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="创建时间:">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formInline.beginDate"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          >
            ></el-date-picker
          >
        </el-col>
        <el-col class="line" :span="1" style="text-align: center">--</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formInline.endDate"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          >
            ></el-date-picker
          >
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
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
      border
      element-loading-text="拼命加载中"
      style="width: 100%"
    >
      <el-table-column sortable prop="id" label="序号"> </el-table-column>
      <el-table-column sortable prop="adName" label="广告名称"> </el-table-column>
      <el-table-column sortable prop="status" label="广告状态">
        <template slot-scope="scope">
          <div>
            {{ scope.row.status === 0 ? "启用" : "禁用" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="startTime" label="广告开始时间"> </el-table-column>
      <el-table-column sortable prop="endTime" label="广告结束时间"> </el-table-column>
      <el-table-column sortable prop="exposure" label="曝光量"> </el-table-column>
      <el-table-column sortable prop="hits" label="点击量"> </el-table-column>
      <el-table-column sortable prop="clickThroughRate" label="点击率"> </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
import { getAdScheduleList } from "@/api/advert.js";
export default {
  name: "NewAdvertAdminAdscheduling",
  data() {
    return {
      listData: [],
      formInline: {
        beginDate: "",
        endDate: "",
        page: 1,
        limit: 10,
      },
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },

  mounted() {},

  methods: {
    getdata(parameter) {
      let data = {
        start: parameter.page,
        length: parameter.limit,
        beginDate: parameter.beginDate,
        endDate: parameter.endDate,
      };
      getAdScheduleList(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    getDateTime(beginDate, endDate) {
      this.formInline.beginDate = beginDate;
      this.formInline.endDate = endDate;
      this.getdata(this.formInline);
    },
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
  },
};
</script>

<style lang="less" scoped></style>
