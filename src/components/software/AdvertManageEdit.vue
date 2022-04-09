<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/advert_launch_manage/page_list' }"
        >广告列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>编辑广告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mt24 layout-main">
      <div class="add-left">
        <div class="belogng">
          <span>投放业务：</span>
          <el-select
            disabled
            v-model="info.business"
            placeholder="请选择"
            @change="changeBusiness()"
          >
            <el-option
              v-for="(item, index) in bAndPList"
              :key="index"
              :label="item.platformName"
              :value="item.business"
            >
            </el-option>
          </el-select>
        </div>
        <div class="mt20">
          <span>投放页面：</span>
          <el-select
            v-model="info.onThePage"
            placeholder="请选择"
            @change="changePage()"
            disabled
          >
            <el-option
              v-for="(item, index) in childVos"
              :key="index"
              :label="item.onThePage"
              :value="item.onThePage"
            >
            </el-option>
          </el-select>
        </div>
        <div class="mt20">
          <span>广告位：</span>
          <el-select
            v-model="info.adSpaceName"
            placeholder="请选择"
            @change="getdata"
            disabled
          >
            <el-option
              v-for="(item, index) in adSpaceName"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>

        <div v-if="info.supportType === 0">
          <div
            class="avdert-place-add mt24"
            :class="{ pageTypeClass: info.pageType === 1 }"
            v-for="(item, index) in editForm.urlList"
            :key="index"
          >
            <SetImage @getImageUrl="getImageUrl" :imageUrl="item" :index="index">
              <div slot="deleteIcon" class="delete-icon" v-show="deleteIconShow">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  class="delete-icon-size"
                  circle
                  @click.stop="deleteImage(index)"
                ></el-button>
              </div>
            </SetImage>
          </div>
          <div
            class="avdert-place-add mt24"
            :class="{ pageTypeClass: info.pageType === 1 }"
          >
            <SetImage @getImageUrl="getImageUrl" :imageUrl="''"> </SetImage>
          </div>
        </div>
        <div v-else-if="info.supportType === 1">
          <div class="advert-video-upload mt24">
            <SetVideo @getVideoUrl="getVideoUrl" :videoUrl="advertVideoSetUrl">
            </SetVideo>
          </div>
        </div>
      </div>

      <div class="add-right">
        <div class="advert-info-t">广告位信息</div>
        <div class="advert-info-m">
          <div>
            <div>广告位编码：</div>
            <div>{{ info.adSlotCoding }}</div>
          </div>
          <div>
            <div>广告位名称：</div>
            <div>{{ info.adSpaceName }}</div>
          </div>
          <div>
            <div>所属业务：</div>
            <div>{{ info.business }}</div>
          </div>
          <div>
            <div>所属页面:</div>
            <div>{{ info.onThePage }}</div>
          </div>
          <div>
            <div>支持类型:</div>
            <div>{{ info.supportType == 1 ? "视频" : "图片" }}</div>
          </div>
          <div>
            <div>最大数量:</div>
            <div>{{ info.maximumNumber }}</div>
          </div>
          <div>
            <div>图片尺寸/视频大小：</div>
            <div>{{ info.adSlotSize }}</div>
          </div>
          <div>
            <div>描述：</div>
            <div>{{ info.description }}</div>
          </div>
        </div>
        <div class="advert-info-d">广告位详情</div>
        <div class="advert-info-save">
          <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
            <el-form-item label="广告标题" prop="adHeadline">
              <el-input
                size="small"
                v-model="editForm.adHeadline"
                auto-complete="off"
                placeholder="请输入广告标题"
              >
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="长期有效">
              <el-radio-group v-model="editForm.putaway" style="margin-top: -10px">
                <el-radio :label="1" style="margin-top: 10px">是</el-radio>
                <el-radio :label="0" style="margin-top: 10px">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="日期:" prop="endTime">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="开始时间"
                  v-model="editForm.startTime"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-col>
              <el-col class="line" :span="1" style="text-align: center">--</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="结束时间"
                  v-model="editForm.endTime"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-col>
              <div class="look-scheduling" @click="goScheduling">查询此排期</div>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入描述方式"
                v-model="editForm.remark"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="useStatus">
              <el-radio-group v-model="editForm.useStatus" style="margin-top: -10px">
                <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
                <el-radio :label="1" style="margin-top: 10px">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-for="(item, index) in editForm.radResourceList" :key="index">
              <el-form-item
                :label="(info.supportType === 1 ? '视频' : '图片') + +(index + 1)"
              >
                <el-radio-group v-model="item.jumpPageType" style="margin-top: -10px">
                  <el-radio :label="0" style="margin-top: 10px">下载链接跳转</el-radio>
                  <el-radio :label="1" style="margin-top: 10px">网页跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="item.jumpPageType === 1">
                <el-form-item label="跳转链接">
                  <el-input
                    size="small"
                    v-model="item.jumpAddress"
                    auto-complete="off"
                    placeholder="请输入跳转链接"
                  >
                  </el-input>
                </el-form-item>
              </div>
              <div v-else-if="item.jumpPageType === 0">
                <el-form-item label="安卓下载地址">
                  <el-input
                    size="small"
                    v-model="item.androidJumpAddress"
                    auto-complete="off"
                    placeholder="请输入安卓下载地址"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="苹果下载地址">
                  <el-input
                    size="small"
                    v-model="item.iosJumpAddress"
                    auto-complete="off"
                    placeholder="请输入苹果下载地址"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="save-padding">
            <el-button type="" @click="canCelReturn()">取消</el-button>
            <el-button type="primary" @click="submitForm('editForm')">保存 </el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑界面 -->
    <el-dialog :visible.sync="adSchedulingVisible" width="60%" @click="closeDialog">
      <div class="edit-title">{{ title }}</div>
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
          <el-table-column sortable prop="advertisingNo" label="广告编号">
          </el-table-column>
          <el-table-column sortable prop="adHeadline" label="广告标题"> </el-table-column>
          <el-table-column sortable prop="jumpPageUrl" label="链接对象">
          </el-table-column>
          <el-table-column sortable prop="resourceCount" label="有效期">
            <template slot-scope="scope">
              {{ scope.row.startTime }}-{{ scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column sortable prop="remark" label="备注"> </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  adSchedulingUpdateSad,
  getAllAdSpaceByRpc,
  adSchedulingTimeList,
  adSchedulingSelectByNo,
} from "../../api/advert.js";

import { BusinessAndPageList } from "@/api/business";
export default {
  created() {
    this.getBusinessAndPageList();
    this.detailAdvertPlace();
  },
  data() {
    return {
      editForm: {
        adHeadline: "",
        startTime: "",
        endTime: "",
        remark: "",
        useStatus: "",
        jumpPageType: "",
        jumpPageUrl: "",
        urlList: [],
        radResourceList: [],
        adSlotCoding: "",
        business: "",
        onThePage: "",
      },
      info: {
        business: "",
        onThePage: "",
        adSlotCoding: "",
        adSpaceName: "",
        maximumNumber: "",
        supportType: "",
        adSlotSize: "",
        description: "",
      },
      childVos: [],
      adSpaceName: [],
      bAndPList: [],
      //日期禁用可选时间
      pickerOptions: {
        disabledDate(date) {
          let zero = new Date().setHours(0, 0, 0, 0);
          if (date.getTime() < zero) {
            return true;
          }
          return false;
        },
      },
      formInline: {
        beginDate: "",
        endDate: "",
        page: 1,
        limit: 10,
      },
      listData: [],
      adSchedulingVisible: false,
      deleteIconShow: true,
      title: "查询排期",
      inPageList: [],
      imagesList: [],
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      imageChoiceradio: 0,
      advertVideoSetUrl: "",
      advertImageSetUrl: "",
      rules: {
        adHeadline: [
          {
            required: true,
            message: "请输入广告标题",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请输入时间",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        useStatus: [
          {
            required: true,
            message: "请输入状态",
            trigger: "blur",
          },
        ],
        jumpPageType: [
          {
            required: true,
            message: "请输入跳转页类型",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    detailAdvertPlace() {
      if (this.info.supportType === 1) {
        if (this.info.childList) {
          this.advertVideoSetUrl = JSON.parse(this.info.childList)[0].url;
        }
      } else {
        if (this.info.childList) {
          this.imagesList = JSON.parse(this.info.childList);
        }
      }
    },
    getdata() {
      let data = {
        business: this.info.business,
        onThePage: this.info.onThePage,
        adSpaceName: this.info.adSpaceName,
      };
      //
      getAllAdSpaceByRpc(data).then((res) => {
        if (res.data.list.length > 0) {
          this.info.onThePage = res.data.list[0].onThePage;
          this.info.adSlotCoding = res.data.list[0].adSlotCoding;
          this.info.adSpaceName = res.data.list[0].adSpaceName;
          this.info.maximumNumber = res.data.list[0].maximumNumber;
          this.info.supportType = res.data.list[0].supportType;
          this.info.adSlotSize = res.data.list[0].adSlotSize;
          this.info.description = res.data.list[0].description;
          this.info.pageType = res.data.list[0].pageType;
          //   this.initializeData();
        }
      });
    },

    //初始化数据
    initializeData(data) {
      if (this.info.supportType === 1) {
        this.advertVideoSetUrl = data.radResourceList[0].url;
        this.editForm.radResourceList = [];
      } else {
        this.editForm.urlList = [];
      }
      data.radResourceList.forEach((item, index) => {
        this.editForm.urlList.push(item.url);
        this.editForm.radResourceList.push({
          url: item.url,
          iosJumpAddress: item.iosJumpAddress,
          jumpPageType: item.jumpPageType,
          androidJumpAddress: item.androidJumpAddress,
          jumpAddress: item.jumpAddress,
        });
      });
      this.editForm.adHeadline = data.adHeadline;
      this.editForm.startTime = data.startTime;
      this.editForm.endTime = data.endTime;
      this.editForm.remark = data.remark;
      this.editForm.useStatus = data.useStatus;
      this.editForm.jumpPageType = data.jumpPageType;
    },
    changeBusiness() {
      this.childVos = [];
      this.adSpaceName = [];
      this.info.onThePage = "";
      this.info.adSpaceName = "";
      for (let i = 0; i < this.bAndPList.length; i++) {
        if (this.bAndPList[i].business === this.info.business) {
          this.childVos = this.bAndPList[i].childVos;
          return;
        }
      }
    },
    changePage() {
      this.adSpaceName = [];
      this.info.adSpaceName = "";
      for (let i = 0; i < this.childVos.length; i++) {
        if (this.childVos[i].onThePage === this.info.onThePage) {
          this.adSpaceName = this.childVos[i].adSpaceName;
          return;
        }
      }
    },
    getBusinessAndPageList() {
      BusinessAndPageList().then((res) => {
        this.bAndPList = res.data;
        //获取详情信息
        adSchedulingSelectByNo({
          adSlotCoding: this.$route.query.adSlotCoding,
          advertisingNo: this.$route.query.advertisingNo,
        }).then((res) => {
          this.info.business = res.data.business;
          this.info.onThePage = res.data.onThePage;
          this.info.adSpaceName = res.data.adSpaceName;
          this.getdata();
          this.initializeData(res.data);
        });
      });
    },
    renderData() {},
    deleteImage(index) {
      this.editForm.urlList.splice(index, 1);
      this.editForm.radResourceList.splice(index, 1);
    },
    //查询此排期
    goScheduling() {
      if (this.info.adSlotCoding == "") {
        this.$message.error("请依次选择投放业务、投放页面、广告位");
        return;
      } else if (this.editForm.startTime == "" || this.editForm.endTime == "") {
        this.$message.error("请选择投放时间");
        return;
      }
      this.adSchedulingVisible = true;
      this.formInline.beginDate = this.editForm.startTime;
      this.formInline.endDate = this.editForm.endTime;
      let data = {
        beginDate: this.editForm.startTime,
        endDate: this.editForm.endTime,
        adSlotCoding: this.info.adSlotCoding,
      };
      adSchedulingTimeList(data).then((res) => {
        this.listData = res.data.list;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.count;
      });
    },
    search() {
      let data = {
        beginDate: this.formInline.beginDate,
        endDate: this.formInline.endDate,
        adSlotCoding: this.info.adSlotCoding,
      };
      adSchedulingTimeList(data).then((res) => {
        this.listData = res.data.list;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.count;
      });
    },
    //获取图片类型
    getImageUrl(data) {
      if (data.index != null && data.index >= 0) {
        this.$set(this.editForm.urlList, data.index, data.imageUrl);
      } else {
        if (this.editForm.urlList.length === this.info.maximumNumber) {
          this.$message.info("已上传到最大数量了!");
          return;
        }
        this.editForm.radResourceList.push({
          url: data.imageUrl,
          jumpAddress: "",
        });
        this.editForm.urlList.push(data.imageUrl);
      }
    },
    getVideoUrl(data) {
      this.advertVideoSetUrl = data.url;
      this.editForm.urlList = [];
      this.editForm.radResourceList = [];
      this.editForm.urlList.push(data.url);
      this.editForm.radResourceList.push({
        url: data.url,
        jumpAddress: "",
      });
    },
    closeDialog() {},
    submitForm(editData) {
      if (this.info.adSlotCoding == "") {
        this.$message.error("请选择投放业务与页面");
        return;
      } else if (this.editForm.startTime == "" || this.editForm.endTime == "") {
        this.$message.error("请选择投放时间");
        return;
      } else if (this.editForm.urlList.length === 0) {
        this.$message.error("投放广告的视频或者图片不能为空");
        return;
      }
      this.$refs[editData].validate((valid) => {
        if (valid) {
          let data = {
            adHeadline: this.editForm.adHeadline,
            startTime: this.editForm.startTime,
            endTime: this.editForm.endTime,
            remark: this.editForm.remark,
            useStatus: this.editForm.useStatus,
            jumpPageType: this.editForm.jumpPageType,
            // jumpPageUrl: this.editForm.jumpPageUrl,
            // urlList: this.editForm.urlList,
            radResourceList: this.editForm.radResourceList,
            adSlotCoding: this.info.adSlotCoding,
            business: this.info.business,
            onThePage: this.info.onThePage,
            supportType: this.info.supportType,
            adSpaceName: this.info.adSpaceName,
            adSlotSize: this.info.adSlotSize,
            maximumNumber: this.info.maximumNumber,
            id: this.$route.query.id,
            advertisingNo: this.$route.query.advertisingNo,
          };
          adSchedulingUpdateSad(data).then((res) => {
            this.$message.success("操作成功！");
            this.$router.push({
              path: "/advert_launch_manage/page_list",
            });
          });
        }
      });
    },
    canCelReturn() {
      this.$router.push({
        path: "/software/AdvertManage",
      });
    },
    getRadioEditFormData(index) {
      // adSchedulingAddSad(this.editForm).then((res) => {});
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
  },
};
</script>

<style lang="less" scoped>
.layout-main {
  display: flex;

  .add-left {
    width: 370px;
    background: #fff;
    padding: 37px 24px 37px 32px;

    > div {
      > span {
        display: inline-block;
        min-width: 80px;
      }
    }

    .belogng {
      display: flex;
      align-items: center;
    }

    .advert-place-p {
      width: 314px;
      height: 196px;
      border-radius: 4px;
      border: 1px solid #999999;

      .image {
        height: 118px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .desc {
        padding-left: 16px;

        .p-title {
          margin-top: 10px;
          color: rgba(0, 0, 0, 0.85);
          font-size: 20px;
          font-weight: bold;
          line-height: 28px;
          height: 28px;
        }

        .extra {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.25);
          font-weight: 400;
        }

        position: relative;
      }
    }

    .avdert-place-add {
      width: 314px;
      height: 196px;
      border-radius: 4px;
      border: 1px solid #999999;

      .image-choice-radio {
        position: absolute;
        right: 15px;
        bottom: 0px;
      }
    }

    .pageTypeClass {
      width: 314px !important;
      height: 420px !important;
    }

    .advert-video-upload {
      width: 314px;
      height: 420px;
      border-radius: 4px;
      border: 1px solid #999999;
      cursor: pointer;
    }
  }

  .add-right {
    flex: 1;
    background: #fff;
    margin-left: 20px;
  }

  .advert-info-t {
    padding: 32px 32px 16px 32px;
    border-bottom: 1px solid #e9e9e9;
  }

  .advert-info-d {
    padding: 32px 32px 16px 32px;
    border-bottom: 1px solid #e9e9e9;
  }

  .advert-info-m {
    padding-left: 32px;
    padding-top: 8px;
    display: flex;
    flex-wrap: wrap;

    > div {
      width: 30%;
      margin-top: 16px;
      display: inline-block;

      > div {
        display: inline-block;
        vertical-align: bottom;
        text-align: left;
      }
    }
  }

  .look-scheduling {
    position: absolute;
    right: -70px;
    color: #0290ff;
    cursor: pointer;
  }

  .advert-info-save {
    margin-top: 24px;
    width: 500px;
    padding-bottom: 32px;

    .save-padding {
      padding-left: 32px;
    }
  }
}

.delete-icon {
  position: absolute;
  right: 0;
  top: 0;
}

.delete-icon-size {
  font-size: 12px;
}
</style>
