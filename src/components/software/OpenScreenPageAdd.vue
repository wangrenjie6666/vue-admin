<template>
  <div>
    <div class="advert-title">
      <div class="cape"></div>
      <div class="name">广告位信息</div>
    </div>
    <div class="advert-info">
      <div>
        <span>广告位编码：</span><span>{{ info.adSlotCoding }}</span>
      </div>
      <div>
        <span>广告位名称：</span><span>{{ info.adSpaceName }}</span>
      </div>
      <div>
        <span>所属业务：</span><span>{{ info.platformName }}</span>
      </div>
      <div>
        <span>所属页面：</span><span>{{ info.onThePage }}</span>
      </div>
      <div>
        <span>支持类型：</span><span>{{ info.supportType === 0 ? "图片" : "视频" }}</span>
      </div>
      <div>
        <span>最大数量:</span><span>{{ info.maximumNumber }}</span>
      </div>
      <div>
        <span>图片尺寸/视频大小：</span><span>{{ info.adSlotSize }}</span>
      </div>
      <div>
        <span>描述：</span><span>{{ info.description }}</span>
      </div>
    </div>
    <!--广告位信息-->
    <div class="detail-title">
      <div class="cape"></div>
      <div class="name">广告位信息</div>
    </div>
    <div class="form-class">
      <el-button class="set-shop-advert" type="primary" @click="goAdvertBase"
        >设置商业广告</el-button
      >
      <div class="advert-info-save">
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="广告标题" prop="adHeadline">
            <el-input
              size="small"
              class="w500"
              v-model="editForm.adHeadline"
              auto-complete="off"
              placeholder="请输入广告标题"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="广告副标题："
            prop="repeatTitle"
            v-if="info.advertisingType === 2"
          >
            <el-input
              size="small"
              class="w500"
              v-model="editForm.repeatTitle"
              auto-complete="off"
              placeholder="请输入广告副标题"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="跳转页类型" prop="jumpPageType">
            <el-radio-group v-model="editForm.jumpPageType" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">下载链接跳转</el-radio>
              <el-radio :label="1" style="margin-top: 10px">网页跳转</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="editForm.jumpPageType === 0">
            <el-form-item label="IOS：">
              <el-input
                size="small"
                class="w200"
                v-model="editForm.iosJumpAddress"
                auto-complete="off"
                placeholder="请输入IOS下载地址"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="安卓：">
              <el-input
                size="small"
                class="w200"
                v-model="editForm.androidJumpAddress"
                auto-complete="off"
                placeholder="请输入安卓下载地址"
              >
              </el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="链接跳转">
              <el-input
                size="small"
                class="w200"
                v-model="editForm.jumpAddress"
                auto-complete="off"
                placeholder="请输入链接跳转地址"
              >
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="素材类型" prop="supportType">
            <el-radio-group v-model="editForm.supportType" style="margin-top: -10px">
              <el-radio
                :label="0"
                style="margin-top: 10px"
                v-if="editForm.supportType === 2 || editForm.supportType === 0"
                >图片</el-radio
              >
              <el-radio
                :label="1"
                style="margin-top: 10px"
                v-if="editForm.supportType === 2 || editForm.supportType === 1"
                >视频</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label="editForm.supportType === 0 ? '图片内容：' : '视频：'"
            prop="urlList"
          >
            <div>
              <div>
                <div v-if="editForm.supportType === 0" class="url-class">
                  <div
                    class="image-add"
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
                    class="image-add"
                    v-if="info.maximumNumber > editForm.urlList.length"
                  >
                    <SetImage @getImageUrl="getImageUrl" :imageUrl="''"> </SetImage>
                  </div>
                </div>
                <div class="url-class" v-else-if="editForm.supportType === 1">
                  <div class="image-add">
                    <SetImage
                      @getImageUrl="getVideoCoverUrl"
                      :imageUrl="editForm.videoCoverUrl"
                    >
                      <div
                        slot="deleteIcon"
                        class="delete-icon"
                        v-show="editForm.videoCoverUrl !== ''"
                      >
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          class="delete-icon-size"
                          circle
                          @click.stop="deleteVideoUrl()"
                        ></el-button>
                      </div>
                    </SetImage>
                    <div style="text-align: center">（上传视频封面）</div>
                  </div>

                  <div class="video-add">
                    <SetVideo @getVideoUrl="getVideoUrl" :videoUrl="editForm.urlList[0]">
                    </SetVideo>
                    <div style="text-align: center">(上传视频)</div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              size="small"
              class="w500"
              v-model="editForm.description"
              auto-complete="off"
              placeholder="请输入备注"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="状态" prop="useStatus">
            <el-radio-group v-model="editForm.useStatus" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
              <el-radio :label="1" style="margin-top: 10px">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="info.advertisingType !== 2">
            <el-form-item label="倒计时时长" prop="openScreenTime">
              <el-input
                size="small"
                v-model="editForm.openScreenTime"
                auto-complete="off"
                class="w100"
                placeholder="倒计时时长"
                style="margin-right: 20px"
              >
              </el-input
              >秒
            </el-form-item>
            <el-form-item label="倒计时开屏状态" prop="openScreenStatus">
              <el-radio-group
                v-model="editForm.openScreenStatus"
                style="margin-top: -10px"
              >
                <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
                <el-radio :label="1" style="margin-top: 10px">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!--定向投放-->
    <div class="directional-title">
      <div class="cape"></div>
      <div class="name">定向投放</div>
    </div>
    <div class="form-class">
      <div class="advert-info-save">
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editPosition">
          <el-form-item label="区域：">
            <div class="btn">
              <span
                :class="{ 'region-active': LaunchType === 0 ? true : false }"
                @click="changeLaunchType(0)"
                >不限</span
              >
              <span
                :class="{ 'region-active': LaunchType === 1 ? true : false }"
                @click="changeLaunchType(1)"
                >按区域</span
              >
            </div>
            <div class="block mt20" v-if="LaunchType === 1">
              <el-cascader
                v-model="areaListValue"
                :options="options"
                :props="props"
                clearable
                size="medium "
                style="width: 500px"
                @change="changeCascader"
                ref="cascader"
              >
              </el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="日期:" prop="endTime" style="width: 500px">
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
        </el-form>
      </div>
    </div>
    <div class="save-padding">
      <el-button type="" @click="canCelReturn()">取消</el-button>
      <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
    </div>
    <!-- 编辑界面 -->
    <el-dialog
      :visible.sync="adSchedulingVisible"
      width="60%"
      append-to-body
      @click="closeDialog"
    >
      <div class="edit-title">{{ title }}</div>
      <div>
        <AdScheduling ref="adScheduling" />
      </div>
    </el-dialog>
    <!-- 广告库界面 -->
    <el-dialog
      :visible.sync="advertVisible"
      width="60%"
      @click="closeDialogAdvert"
      append-to-body
    >
      <div class="edit-title">{{ advertTitle }}</div>
      <div>
        <AdvertBase ref="advertBase" @giveAdvertData="giveAdvertData" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllAdSpaceByRpc,
  adSchedulingAddSad,
  adSchedulingUpdateSad,
} from "../../api/advert.js";
import AdScheduling from "@/components/advert_add/AdScheduling.vue";
import AdvertBase from "@/components/advert_add/AdvertBase.vue";
export default {
  name: "NewAdvertAdminAdvertlinkadd",
  data() {
    return {
      editForm: {
        id: "",
        videoCoverUrl: "",
        urlList: [],
        adHeadline: "",
        areaLocationList: [],
        openScreenTime: "",
        openScreenStatus: 0,
        supportType: 0,
        startTime: "",
        endTime: "",
        description: "",
        useStatus: "",
        jumpPageType: 1,
        jumpAddress: "",
        androidJumpAddress: "",
        iosJumpAddress: "",
        repeatTitle: "",
      },
      areaListValue: [],
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
      rules: {
        adHeadline: [
          {
            required: true,
            message: "请输入广告标题",
            trigger: "blur",
          },
        ],
        areaLocation: [
          {
            required: true,
            message: "请输入投放区域",
            trigger: "blur",
          },
        ],
        openScreenTime: [
          {
            required: true,
            message: "开屏时长使用状态",
            trigger: "blur",
          },
        ],
        openScreenStatus: [
          {
            required: true,
            message: "请输入广告类型",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请输入开始时间",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请输入结束时间",
            trigger: "blur",
          },
        ],
        description: [
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
        // jumpPageType: [
        //   {
        //     required: true,
        //     message: "请输入跳转页类型",
        //     trigger: "blur",
        //   },
        // ],
        radResourceList: [
          {
            required: true,
            message: "存放资源文件",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "请输入广告素材url地址",
            trigger: "blur",
          },
        ],
        jumpAddress: [
          {
            required: true,
            message: "跳转地址",
            trigger: "blur",
          },
        ],
        androidJumpAddress: [
          {
            required: true,
            message: "安卓跳转地址",
            trigger: "blur",
          },
        ],
        iosJumpAddress: [
          {
            required: true,
            message: "ios跳转地址",
            trigger: "blur",
          },
        ],
        repeatTitle: [
          {
            required: true,
            message: "请输入副标题",
            trigger: "blur",
          },
        ],
      },
      title: "排期查询",
      adSchedulingVisible: false,
      advertTitle: "广告库",
      advertVisible: false,
      LaunchType: 0,
      options: [],
      deleteIconShow: true,
      props: {
        label: "name",
        value: "id",
        children: "list",
        multiple: true,
      },
      info: {
        onThePage: "",
        business: "",
        adSlotCoding: "",
        adSpaceName: "",
        maximumNumber: "",
        supportType: 0,
        adSlotSize: "",
        description: "",
        pageType: "",
        platformName: "",
        advertisingType: 0,
      },
    };
  },
  computed: {
    regionList() {
      return this.$store.state.regionList;
    },
  },
  components: {
    AdScheduling,
    AdvertBase,
  },
  mounted() {
    console.log(this.regionList);
    this.options = this.regionList;
  },

  methods: {
    giveData(dataForm) {
      let data = {
        business: dataForm.business,
        adSlotCoding: dataForm.adSlotCoding,
      };
      getAllAdSpaceByRpc(data).then((res) => {
        if (res.data.list.length > 0) {
          this.info.onThePage = res.data.list[0].onThePage;
          this.info.adSlotCoding = res.data.list[0].adSlotCoding;
          this.info.adSpaceName = res.data.list[0].adSpaceName;
          this.info.maximumNumber = res.data.list[0].maximumNumber;
          this.info.supportType = res.data.list[0].supportType;

          if (this.info.supportType !== "" && this.info.supportType !== null) {
            this.editForm.supportType = this.info.supportType;
          }
          this.info.adSlotSize = res.data.list[0].adSlotSize;
          this.info.description = res.data.list[0].description;
          this.info.pageType = res.data.list[0].pageType;
          this.info.platformName = res.data.list[0].platformName;
          this.info.advertisingType = res.data.list[0].advertisingType;
          this.info.business = res.data.list[0].business;
          if (dataForm.editForm) {
            this.detailEditFormData(dataForm.editForm);
          } else {
            this.clearEditFormData();
          }
        }
      });
    },
    deleteVideoUrl() {
      this.editForm.videoCoverUrl = "";
    },
    detailEditFormData(editForm) {
      if (editForm.radResourceList === null || editForm.radResourceList.length === 0) {
        editForm.radResourceList = [];
        editForm.radResourceList.push({
          videoCoverUrl: "",
          jumpPageType: "",
          jumpAddress: "",
          androidJumpAddress: "",
          iosJumpAddress: "",
        });
      }
      this.editForm.id = editForm.id;
      this.editForm.repeatTitle = editForm.repeatTitle;
      this.editForm.urlList = [];
      this.editForm.videoCoverUrl = editForm.radResourceList[0].videoCoverUrl;
      editForm.radResourceList.forEach((item, index) => {
        this.editForm.urlList.push(item.url);
      });
      this.editForm.adHeadline = editForm.adHeadline;

      this.areaListValue = [];
      let list = [];
      if (editForm.areaLocationList.length > 0) {
        editForm.areaLocationList.forEach((item, index) => {
          list.push([item.provinceId, item.cityId, item.areaId]);
        });
        this.$nextTick(() => {
          this.areaListValue = list;
        });
      }

      if (editForm.areaLocationList.length <= 0) {
        this.LaunchType = 0;
      } else {
        this.LaunchType = 1;
      }
      this.editForm.openScreenTime = editForm.openScreenTime;
      this.editForm.openScreenStatus = editForm.openScreenStatus;
      this.editForm.supportType = editForm.supportType;
      this.editForm.startTime = editForm.startTime;
      this.editForm.endTime = editForm.endTime;
      this.editForm.description = editForm.description;
      this.editForm.useStatus = editForm.useStatus;
      this.editForm.jumpPageType = editForm.radResourceList[0].jumpPageType;
      this.editForm.jumpAddress = editForm.radResourceList[0].jumpAddress;
      this.editForm.androidJumpAddress = editForm.radResourceList[0].androidJumpAddress;
      this.editForm.iosJumpAddress = editForm.radResourceList[0].iosJumpAddress;
    },
    clearEditFormData() {
      this.editForm.id = "";
      this.editForm.videoCoverUrl = "";
      this.editForm.repeatTitle = "";
      this.editForm.urlList = [];
      this.editForm.adHeadline = "";
      this.editForm.areaLocationList = [];
      this.areaListValue = [];
      this.editForm.openScreenTime = "";
      this.editForm.openScreenStatus = 0;
      this.editForm.startTime = "";
      this.editForm.endTime = "";
      this.editForm.description = "";
      this.editForm.useStatus = 0;
      this.editForm.jumpPageType = 0;
      this.editForm.jumpAddress = "";
      this.editForm.androidJumpAddress = "";
      this.editForm.iosJumpAddress = "";
    },
    changeLaunchType(type) {
      this.LaunchType = type;
      if (type === 0) {
        this.editForm.areaLocationList = [];
      }
    },
    //获取图片类型
    getImageUrl(data) {
      if (data.index != null && data.index >= 0) {
        this.$set(this.editForm.urlList, data.index, data.imageUrl);
      } else {
        this.editForm.urlList.push(data.imageUrl);
      }
    },
    changeCascader(data) {
      this.areaListValue = data;
    },
    getVideoCoverUrl(data) {
      this.editForm.videoCoverUrl = data.imageUrl;
    },
    getVideoUrl(data) {
      this.editForm.urlList = [];
      this.editForm.urlList.push(data.url);
    },
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          //获取投放区域数据
          this.editForm.areaLocationList = [];
          this.$refs["editPosition"].validate((valid) => {
            if (valid) {
              this.areaListValue.forEach((item, index) => {
                let areaObj = {};
                areaObj.provinceId = item[0];
                areaObj.cityId = item[1];
                areaObj.areaId = item[2];
                this.editForm.areaLocationList.push(areaObj);
              });
              this.editForm.radResourceList = [];
              for (var i = 0; i < this.editForm.urlList.length; i++) {
                this.editForm.radResourceList.push({
                  url: this.editForm.urlList[i],
                  jumpPageType: this.editForm.jumpPageType,
                  jumpAddress: this.editForm.jumpAddress,
                  androidJumpAddress: this.editForm.androidJumpAddress,
                  iosJumpAddress: this.editForm.iosJumpAddress,
                  videoCoverUrl: this.editForm.videoCoverUrl,
                });
              }
              let data = this.editForm;
              data.business = this.info.business;
              data.adSlotCoding = this.info.adSlotCoding;
              data.advertisingType = this.info.advertisingType;
              if (this.editForm.id != "") {
                adSchedulingUpdateSad(data).then((res) => {
                  this.$message({
                    type: "success",
                    message: "编辑成功!",
                  });
                  this.$emit("closeDialog");
                });
              } else {
                adSchedulingAddSad(data).then((res) => {
                  this.$message({
                    type: "success",
                    message: "新增成功！",
                  });
                  this.$emit("closeDialog");
                });
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    canCelReturn() {
      this.$emit("cancelDialog");
    },
    goScheduling() {
      this.adSchedulingVisible = true;
      this.$nextTick(() => {
        this.$refs.adScheduling.getDateTime(
          this.editForm.startTime,
          this.editForm.endTime,
          this.info.adSlotCoding
        );
      });
    },
    closeDialog() {
      this.adSchedulingVisible = false;
    },
    deleteImage(index) {
      this.editForm.urlList.splice(index, 1);
    },
    goAdvertBase() {
      this.advertVisible = true;
      this.$nextTick(() => {
        this.$refs.advertBase.giveData(this.info.advertisingType, this.info.supportType);
      });
    },
    giveAdvertData(data) {
      this.advertVisible = false;
      this.$message.success("选择成功！");
      this.editForm.adHeadline = data.advertisingName;
      this.editForm.urlList = data.urlList;
      this.editForm.description = data.description;
      this.editForm.jumpPageType = data.jumpPageType;
      this.editForm.jumpAddress = data.jumpAddress;
      this.editForm.androidJumpAddress = data.androidJumpAddress;
      this.editForm.iosJumpAddress = data.androidJumpAddress;
      this.editForm.videoCoverUrl = data.videoCoverUrl;
    },
    closeDialogAdvert() {
      this.adSchedulingVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.advert-info-save {
  .btn {
    display: flex;
    padding-top: 10px;

    > span {
      width: 58px;
      height: 22px;
      border: 1px solid #999999;
      cursor: pointer;
      align-items: center;
      display: flex;
      justify-content: center;
      color: #999999;
    }

    .region-active {
      background: #1890ff;
      color: #fff;
    }

    > span:nth-child(2) {
      margin-left: 20px;
    }
  }
}

.advert-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9e9e9;

  .cape {
    width: 2px;
    height: 16px;
    background: #0290ff;
    opacity: 1;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    margin-left: 3px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.advert-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 24px;

  > div {
    width: 33%;
    display: flex;
    align-items: center;
    margin-top: 16px;

    > span:nth-child(1) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      width: 40%;
    }

    > span:nth-child(2) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
      width: 60%;
    }

    > span {
      display: inline-block;

      vertical-align: middle;
    }
  }
}

.detail-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  margin-top: 32px;
  border-bottom: 1px solid #e9e9e9;

  .cape {
    width: 2px;
    height: 16px;
    background: #0290ff;
    opacity: 1;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    margin-left: 3px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.form-class {
  margin-top: 24px;

  .advert-info-save {
    margin-top: 24px;
    padding-bottom: 32px;

    .save-padding {
      padding-left: 32px;
    }
  }
}

.directional-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9e9e9;

  .cape {
    width: 2px;
    height: 16px;
    background: #0290ff;
    opacity: 1;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    margin-left: 3px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.image-add {
  width: 200px;
  height: 300px;
  // border-radius: 2px;
  border: 1px solid #efefef;

  .image-choice-radio {
    position: absolute;
    right: 15px;
    bottom: 0px;
  }
}

.video-add {
  margin-left: 40px !important;
  width: 314px;
  height: 420px;
  // border-radius: 4px;
  border: 1px solid #efefef;

  .image-choice-radio {
    position: absolute;
    right: 15px;
    bottom: 0px;
  }
}

.url-class {
  display: flex;
  // align-items: center;
  flex-wrap: wrap;

  > div {
    margin-left: 15px;
    margin-bottom: 15px;
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

.w500 {
  width: 500px;
}

.w100 {
  width: 100px;
}

.w200 {
  max-width: 400px;
}

.look-scheduling {
  position: absolute;
  right: -70px;
  color: #0290ff;
  cursor: pointer;
}
</style>
