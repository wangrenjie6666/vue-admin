<template>
  <div style="padding-left: 32px">
    <div class="advert-info">
      <div>
        <span>广告位编码：</span><span>{{ info.adPageCoding }}</span>
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
    <div v-if="this.info.adSlotCoding != ''">
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
            <el-form-item label="广告标题：" prop="adHeadline">
              <el-input
                size="small"
                v-model="editForm.adHeadline"
                auto-complete="off"
                placeholder="请输入广告标题"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="广告素材：" prop="url">
              <div class="image-add">
                <SetImage @getImageUrl="getVideoCoverUrl" :imageUrl="editForm.url">
                  <div slot="deleteIcon" class="delete-icon" v-show="editForm.url !== ''">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      class="delete-icon-size"
                      circle
                      @click.stop="deleteImage()"
                    ></el-button>
                  </div>
                </SetImage>
              </div>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                size="small"
                v-model="editForm.description"
                auto-complete="off"
                placeholder="请输入备注"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="useStatus">
              <el-radio-group v-model="editForm.useStatus" style="margin-top: -10px">
                <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
                <el-radio :label="1" style="margin-top: 10px">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="跳转页类型：" prop="jumpPageType">
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
              <el-form-item label="链接跳转：">
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
          </el-form>
        </div>
      </div>
      <div class="save-padding">
        <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
      </div>
    </div>

    <!-- 编辑界面 -->
    <el-dialog :visible.sync="adSchedulingVisible" width="60%" @click="closeDialog"
      >closeDialog
      <div class="edit-title">{{ title }}</div>
      <div>
        <AdScheduling ref="adScheduling" />
      </div>
    </el-dialog>
    <!-- 广告库界面 -->
    <el-dialog :visible.sync="advertVisible" width="60%" @click="closeDialogAdvert">
      <div class="edit-title">{{ advertTitle }}</div>
      <div>
        <AdvertBase ref="advertBase" @giveAdvertData="giveAdvertData" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AdScheduling from "@/components/advert_add/AdScheduling.vue";
import AdvertBase from "@/components/advert_add/AdvertBase.vue";
import { addRotationChartAd, editRotationChartAd } from "@/api/advert.js";
export default {
  name: "NewAdvertAdminAdvertlinkadd",
  data() {
    return {
      editForm: {
        id: "",
        adHeadline: "",
        url: "",
        description: "",
        useStatus: 0,
        startTime: "",
        endTime: "",
        jumpPageType: 0,
        jumpAddress: "",
        androidJumpAddress: "",
        iosJumpAddress: "",
        radResourceList: [],
      },
      advertVisible: false,
      adSchedulingVisible: false,
      advertTitle: "广告库",
      title: "查询排期",
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
        url: [
          {
            required: true,
            message: "请输入广告素材",
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
            message: "请输入广告标题",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请输入日期",
            trigger: "blur",
          },
        ],
      },
      options: [],
      props: {},
      radResourceList: [],

      info: {
        onThePage: "",
        adSlotCoding: "",
        adSpaceName: "",
        maximumNumber: "",
        supportType: "",
        adSlotSize: "",
        description: "",
        pageType: "",
        platformName: "",
      },
    };
  },
  components: {
    AdScheduling,
    AdvertBase,
  },
  mounted() {},

  methods: {
    getListData(info) {
      console.log(info);
      this.info = info;
    },
    getVideoCoverUrl(data) {
      this.editForm.url = data.imageUrl;
    },
    deleteImage() {
      this.editForm.url = "";
    },
    getEditData(editForm) {
      this.editForm.adHeadline = editForm.adHeadline;
      this.editForm.url = editForm.radResourceList[0].url;
      this.editForm.description = editForm.description;
      this.editForm.useStatus = editForm.useStatus;
      this.editForm.startTime = editForm.startTime;
      this.editForm.endTime = editForm.endTime;
      this.editForm.jumpPageType = editForm.radResourceList[0].jumpPageType;
      this.editForm.jumpAddress = editForm.radResourceList[0].jumpAddress;
      this.editForm.androidJumpAddress = editForm.radResourceList[0].androidJumpAddress;
      this.editForm.iosJumpAddress = editForm.radResourceList[0].androidJumpAddress;
      this.editForm.id = editForm.id;
    },
    getEditRefresh() {
      this.editForm.id = "";
      this.editForm.adHeadline = "";
      this.editForm.url = "";
      this.editForm.description = "";
      this.editForm.useStatus = 0;
      this.editForm.startTime = "";
      this.editForm.endTime = "";
      this.editForm.jumpPageType = 1;
      this.editForm.jumpAddress = "";
      this.editForm.androidJumpAddress = "";
      this.editForm.iosJumpAddress = "";
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
    closeDialogAdvert() {
      this.adSchedulingVisible = false;
    },
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.editForm.radResourceList = [];
          this.editForm.radResourceList.push({
            url: this.editForm.url,
            jumpPageType: this.editForm.jumpPageType,
            jumpAddress: this.editForm.jumpAddress,
            androidJumpAddress: this.editForm.androidJumpAddress,
            iosJumpAddress: this.editForm.iosJumpAddress,
          });
          let data = this.editForm;
          data.business = this.info.business;
          data.adSlotCoding = this.info.adSlotCoding;
          if (this.editForm.id != "") {
            editRotationChartAd(data).then((res) => {
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
              this.$emit("refreshData", {});
            });
          } else {
            addRotationChartAd(data).then((res) => {
              this.$message({
                type: "success",
                message: "新增成功！",
              });
              this.$emit("refreshData", {});
            });
          }
        } else {
          return false;
        }
      });
    },
    goAdvertBase() {
      this.advertVisible = true;
      this.$nextTick(() => {
        this.$refs.advertBase.giveData(1, 0);
      });
    },
    giveAdvertData(data) {
      this.advertVisible = false;
      this.$message.success("选择成功！");
      this.editForm.adHeadline = data.advertisingName;
      this.editForm.url = data.urlList[0];
      this.editForm.description = data.description;
      this.editForm.jumpPageType = data.jumpPageType;
      this.editForm.jumpAddress = data.jumpAddress;
      this.editForm.androidJumpAddress = data.androidJumpAddress;
      this.editForm.iosJumpAddress = data.androidJumpAddress;
    },
  },
};
</script>

<style lang="less" scoped>
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
    width: 32%;
    display: flex;
    align-items: center;
    margin-top: 16px;
    margin-right: 5px;

    > span:nth-child(1) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      width: 35%;
    }

    > span:nth-child(2) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
      width: 65%;
    }

    > span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }
  }
}

.image-add {
  width: 340px;
  height: 200px;
  // border-radius: 2px;
  border: 1px solid #efefef;

  .image-choice-radio {
    position: absolute;
    right: 15px;
    bottom: 0px;
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
    width: 500px;

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

.save-padding {
  padding-left: 32px;
  margin-bottom: 20px;
}

.delete-icon {
  position: absolute;
  right: 0;
  top: 0;
}

.delete-icon-size {
  font-size: 12px;
}

.look-scheduling {
  position: absolute;
  right: -70px;
  color: #0290ff;
  cursor: pointer;
}
</style>
