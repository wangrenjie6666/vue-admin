<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/advert_launch_manage/page_list' }"
        >广告列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>新增广告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="layout-main">
      <div class="add-left">
        <div class="choice-advert-type">
          <div
            :class="{ 'active-advert': editForm.advertisingType === 0 }"
            @click="changeAdvertType(0)"
          >
            开屏页广告
          </div>
          <div
            :class="{ 'active-advert': editForm.advertisingType === 1 }"
            @click="changeAdvertType(1)"
          >
            轮播图广告
          </div>
          <div
            :class="{ 'active-advert': editForm.advertisingType === 2 }"
            @click="changeAdvertType(2)"
          >
            外链广告
          </div>
        </div>
        <div class="belogng">
          <span>投放业务：</span>
          <el-select
            v-model="info.business"
            placeholder="请选择"
            @change="changeBusiness()"
            :disabled="editFormDisabled"
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
            :disabled="editFormDisabled"
            v-model="info.adPageCoding"
            placeholder="请选择"
            @change="changePage()"
          >
            <el-option
              v-for="(item, index) in childVos"
              :key="index"
              :label="item.onThePage"
              :value="item.adPageCoding"
            >
            </el-option>
          </el-select>
        </div>
        <div class="mt20">
          <span>广告位：</span>
          <el-select
            v-model="info.adSlotCoding"
            placeholder="请选择"
            @change="getdata"
            :disabled="editFormDisabled"
          >
            <div v-for="(item, index) in advertisingSpaceList" :key="index">
              <el-option
                :label="item.adSpaceName"
                :value="item.adSlotCoding"
                v-if="editForm.advertisingType === item.advertisingType"
              >
              </el-option>
            </div>
          </el-select>
        </div>
        <!-- 根据不同广告类型，展示不同广告 -->
        <div
          class="advert-screen"
          :class="{ 'advert-chocie': this.info.adSlotCoding !== '' }"
          v-if="editForm.advertisingType === 0"
        >
          <div>
            <div></div>
            <div class="mt24">开屏广告位</div>
          </div>
        </div>
        <div class="advert-rotation" v-else-if="editForm.advertisingType === 1">
          <div
            class="rotation-list"
            :class="{
              'active-rotation': index === rotationIndex ? true : false,
            }"
            v-for="(item, index) in radList"
            :key="index"
            @click="goRenderList(index)"
          >
            <div class="advert-info">
              <div class="name">轮播图{{ index + 1 }}</div>
            </div>
          </div>
          <div
            class="rotation-list"
            :class="{
              'active-rotation':
                (this.radList.length === rotationIndex ? true : false) &&
                this.info.adSlotCoding !== '',
            }"
            v-if="radList.length < info.maximumNumber"
            @click="goNewRenderList(radList.length)"
          >
            <div class="advert-info">
              <div class="name"><i class="el-icon-plus"></i></div>
            </div>
          </div>
        </div>
        <div
          class="advert-link"
          :class="{ 'advert-chocie': this.info.adSlotCoding !== '' }"
          v-else-if="editForm.advertisingType === 2"
        >
          <div>
            <div></div>
            <div class="mt24">外链广告位</div>
          </div>
        </div>
      </div>

      <div class="add-right">
        <div class="advert-info-t">广告位信息</div>
        <div class="advert-screen" v-if="editForm.advertisingType === 0">
          <ExistAdvert ref="existAdvert" @refreshData="refreshData" />
        </div>
        <div class="advert-rotation" v-if="editForm.advertisingType === 1">
          <RotationAdvert ref="rotationAdvert" @refreshData="refreshData" />
        </div>
        <div class="advert-link" v-if="editForm.advertisingType === 2">
          <ExistAdvert ref="existAdvert" @refreshData="refreshData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  adSchedulingAddSad,
  getAllAdSpaceByRpc,
  adSchedulingTimeList,
  sprAreaList,
} from "../../api/advert.js";

import { BusinessAndPageList } from "@/api/business";
import ExistAdvert from "@/components/advert_add/ExistAdvert.vue";
import RotationAdvert from "@/components/advert_add/RotationAdvert.vue";

export default {
  created() {
    this.getBusinessAndPageList();
    this.detailAdvertPlace();
    this.getSprAreaList();
  },
  mounted() {},
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
        advertisingType: 0,
      },
      info: {
        business: "",
        onThePage: "",
        adSlotCoding: "",
        adSpaceName: "",
        adPageCoding: "",
        maximumNumber: "",
        supportType: "",
        adSlotSize: "",
        description: "",
      },
      radList: [],
      rotationIndex: 0,
      advertisingSpaceList: [],
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
      editFormDisabled: false,
      listData: [],
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
  components: {
    ExistAdvert,
    RotationAdvert,
  },
  methods: {
    getSprAreaList() {},
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
        adPageCoding: this.info.adPageCoding,
        adSlotCoding: this.info.adSlotCoding,
      };
      this.rotationIndex = 0;
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
          this.info.business = res.data.list[0].business;
          this.info.platformName = res.data.list[0].platformName;

          switch (this.editForm.advertisingType) {
            case 0:
              this.$refs.existAdvert.getListData(data);
              break;
            case 1:
              this.$refs.rotationAdvert.getListData(this.info);
              this.radList = res.data.list[0].radList;
              if (!res.data.list[0].radList) {
                this.radList = [];
                this.$refs.rotationAdvert.getEditRefresh();
              } else {
                this.radList = res.data.list[0].radList;
                this.$refs.rotationAdvert.getEditData(this.radList[this.rotationIndex]);
              }
              break;
            case 2:
              this.$refs.existAdvert.getListData(this.info);
              break;
          }
        }
      });
    },
    goRenderList(index) {
      this.rotationIndex = index;
      this.$refs.rotationAdvert.getEditData(this.radList[this.rotationIndex]);
    },
    goNewRenderList(index) {
      this.rotationIndex = index;
      this.$refs.rotationAdvert.getEditRefresh();
    },
    //初始化数据
    initializeData() {},
    changeBusiness() {
      this.childVos = [];
      this.advertisingSpaceList = [];
      if (this.editForm.advertisingType === 1) this.$refs.rotationAdvert.getEditRefresh();
      this.radList = [];
      this.info.adPageCoding = "";
      this.info.adSlotCoding = "";
      for (let i = 0; i < this.bAndPList.length; i++) {
        if (this.bAndPList[i].business === this.info.business) {
          this.childVos = this.bAndPList[i].childVos;
          return;
        }
      }
    },
    changePage() {
      this.radList = [];
      if (this.editForm.advertisingType === 1) this.$refs.rotationAdvert.getEditRefresh();
      this.advertisingSpaceList = [];
      this.info.adSlotCoding = "";
      for (let i = 0; i < this.childVos.length; i++) {
        if (this.childVos[i].adPageCoding === this.info.adPageCoding) {
          this.advertisingSpaceList = this.childVos[i].advertisingSpaceList;
        }
      }
    },
    getBusinessAndPageList() {
      BusinessAndPageList().then((res) => {
        this.bAndPList = res.data;
        if (this.$store.state.regionList.length === 0) {
          sprAreaList().then((res) => {
            this.$store.commit({
              type: "changeRegionList",
              list: res.data,
            });
            this.isEdit();
          });
        } else {
          this.isEdit();
        }
      });
    },
    isEdit() {
      let data = this.$route.query;
      if (data.business) {
        this.editForm.advertisingType = parseInt(data.advertisingType);
        this.$nextTick(() => {
          this.info.business = data.business;
          this.changeBusiness();
          this.editFormDisabled = true;
          this.info.adPageCoding = data.adPageCoding;
          this.changePage();
          this.info.adSlotCoding = data.adSlotCoding;
          this.getdata();
        });
      }
    },
    deleteImage(index) {
      this.editForm.urlList.splice(index, 1);
      this.editForm.radResourceList.splice(index, 1);
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
          jumpPageType: 1,
          androidJumpAddress: "",
          iosJumpAddress: "",
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
        androidJumpAddress: "",
        iosJumpAddress: "",
      });
    },
    changeAdvertType(type) {
      if (this.editFormDisabled) return;

      this.editForm.advertisingType = type;
      this.info.business = "";
      this.info.adPageCoding = "";
      this.info.adSlotCoding = "";
      this.childVos = [];
      this.advertisingSpaceList = [];
      this.radList = [];
      if (this.editForm.advertisingType === 0 || this.editForm.advertisingType === 2) {
        this.$nextTick(() => {
          this.$refs.existAdvert.getNullBusiness();
        });
      }
    },
    closeDialog() {},
    refreshData() {
      this.getdata();
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
      padding-top: 30px;
      border-top: 1px solid #e9e9e9;
    }

    .advert-screen,
    .advert-link {
      width: 100%;
      height: 500px;
      margin-top: 20px;
      border: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      > div {
        > div {
          text-align: center;
        }
      }
    }

    .advert-chocie {
      border: 1px solid #0290ff !important;
      background: rgba(2, 144, 255, 0.2) !important;
      font-weight: bold !important;
    }

    .advert-rotation {
      margin-top: 20px;

      .rotation-list {
        width: 100%;
        height: 216px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-bottom: 20px;

        > .advert-info {
          .name {
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
          }
        }
      }

      .active-rotation {
        border: 1px solid #0290ff !important;
        background: rgba(2, 144, 255, 0.2) !important;
        font-weight: bold !important;
      }
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

.choice-advert-type {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 25px;

  .active-advert {
    color: #0290ff;
  }

  > div {
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
