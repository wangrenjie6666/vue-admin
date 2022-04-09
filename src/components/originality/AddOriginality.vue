<template>
  <div>
    <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
      <el-form-item label="广告创意：" prop="templateId">
        <div class="advert-temp-list">
          <div
            class="temp-box"
            v-for="(item, index) in templateDataQue"
            :key="index"
            :class="{ 'temp-chocie': index === tempChoiceIndex }"
            @click="choiceTemplateData(index, item)"
          >
            <div class="sl-image">
              <el-image
                fit="cover"
                :src="item.thumbnailPhoto"
                alt="暂无图片"
                style="width: 100%; height: 100%"
              ></el-image>
            </div>
            <div class="detai-info">{{ item.templateName }}</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="创意图片" prop="imgUrlList" v-if="this.editForm.type === 0">
        <div class="url-class">
          <div
            class="image-add"
            v-for="(item, index) in editForm.adTemplateDetailList"
            :key="index"
          >
            <SetImage
              @getImageUrl="getImageUrl"
              :imageUrl="editForm.imgUrlList[index]"
              :index="index"
            >
              <div
                slot="deleteIcon"
                class="delete-icon"
                v-show="editForm.imgUrlList[index] != ''"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  class="delete-icon-size"
                  circle
                  @click.stop="deleteImage(index)"
                ></el-button>
              </div>
              <div
                slot="limit"
                class="image-limit"
                v-show="editForm.imgUrlList[index] === ''"
              >
                <div>
                  <div>尺寸:{{ item.size }}</div>
                  <div>比例:{{ item.proportion }}</div>
                  <div>最大不超过：{{ item.length }}KB</div>
                </div>
              </div>
            </SetImage>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="视频封面" prop="videoCoverUrl" v-if="this.editForm.type === 1">
        <div class="image-add">
          <SetImage @getImageUrl="getVideoCoverUrl" :imageUrl="editForm.videoCoverUrl">
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
          <!-- <div style="text-align: center">（上传视频封面）</div> -->
        </div>
      </el-form-item>
      <el-form-item
        label="创意视频"
        prop="videoUrl"
        class="mt20"
        v-if="this.editForm.type === 1"
      >
        <div class="video-add">
          <SetVideo @getVideoUrl="getVideoUrl" :videoUrl="editForm.videoUrl">
            <div slot="limit" class="video-limit" v-show="editForm.videoUrl === ''">
              <div>
                <div>尺寸:{{ editForm.adTemplateDetailList[0].size }}</div>
                <div>比例:{{ editForm.adTemplateDetailList[0].proportion }}</div>
                <div>最大不超过：{{ editForm.adTemplateDetailList[0].length }}M</div>
                <div>时长：{{ editForm.adTemplateDetailList[0].duration }}秒</div>
              </div>
            </div>
          </SetVideo>
          <!-- <div style="text-align: center">(上传视频)</div> -->
        </div>
      </el-form-item>
      <el-form-item class="mt20" label="主标题" prop="mainTitle">
        <el-input
          size="small"
          v-model="editForm.mainTitle"
          auto-complete="off"
          placeholder="请输入主标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input
          size="small"
          v-model="editForm.subtitle"
          auto-complete="off"
          placeholder="请输入副标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="创意名称" prop="originalityName">
        <el-input
          size="small"
          v-model="editForm.originalityName"
          auto-complete="off"
          placeholder="请输入创意名称"
        ></el-input>
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
    </el-form>
  </div>
</template>

<script>
import {
  adExtensionAddSad,
  addAdOriginality,
  updateAdOriginality,
} from "@/api/originality.js";
export default {
  name: "NewAdvertAdminAddoriginality",

  data() {
    return {
      editForm: {
        id: "",
        adOriginalityId: "",
        templateId: "",
        mainTitle: "",
        subtitle: "",
        jumpAddress: "",
        jumpPageType: 1,
        androidJumpAddress: "",
        iosJumpAddress: "",
        originalityName: "",
        type: "",
        videoUrl: "",
        videoCoverUrl: "",
        imgUrlList: [],
        adTemplateDetailList: [],
      },
      // rules表单验证
      rules: {
        templateId: [
          {
            required: true,
            message: "请选择入模板",
            trigger: "blur",
          },
        ],
        mainTitle: [
          {
            required: true,
            message: "请输入主标题名称",
            trigger: "blur",
          },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
        ],
        subtitle: [
          {
            required: true,
            message: "请输入副标题名称",
            trigger: "blur",
          },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
        ],
        originalityName: [
          {
            required: true,
            message: "请输入创意名称",
            trigger: "blur",
          },
        ],
        videoUrl: [
          {
            required: true,
            message: "请输入创意视频图",
            trigger: "blur",
          },
        ],
        videoCoverUrl: [
          {
            required: true,
            message: "请输入创意视频封面图",
            trigger: "blur",
          },
        ],
        imgUrlList: [
          {
            required: true,
            message: "请输入图片地址列表",
            trigger: "blur",
          },
        ],
      },
      templateDataQue: [],
      tempChoiceIndex: "",
      type: 0,
    };
  },

  mounted() {},

  methods: {
    receiveData(
      templateDataQue,
      id,
      type = 0,
      adOriginalityId = "",
      receiveData = {},
      saveType = "add"
    ) {
      this.templateDataQue = templateDataQue;
      this.editForm.id = id;
      this.type = type;
      this.editForm.adOriginalityId = adOriginalityId;
      if (type === 1 && saveType === "edit") {
        this.editForm.id = receiveData.id;
        this.editForm.adOriginalityId = receiveData.adOriginalityId;
        this.editForm.templateId = receiveData.templateId;
        this.editForm.mainTitle = receiveData.mainTitle;
        this.editForm.subtitle = receiveData.subtitle;
        this.editForm.jumpAddress = receiveData.jumpAddress;
        this.editForm.jumpPageType = receiveData.jumpPageType;
        this.editForm.androidJumpAddress = receiveData.androidJumpAddress;
        this.editForm.iosJumpAddress = receiveData.iosJumpAddress;
        this.editForm.originalityName = receiveData.originalityName;
        this.editForm.type = receiveData.type;
        this.editForm.imgUrlList = receiveData.imgUrlList;
        this.editForm.videoUrl = receiveData.videoUrl;
        this.editForm.videoCoverUrl = receiveData.videoCoverUrl;
        this.templateDataQue.map((item, index) => {
          if (item.templateId === this.editForm.templateId) {
            this.editForm.adTemplateDetailList = item.adTemplateDetailList;
            this.tempChoiceIndex = index;
            return;
          }
        });
      }
      this.templateDataQue = this.templateDataQue.filter((x) => x.thumbnailPhoto);
    },
    choiceTemplateData(index, item) {
      this.tempChoiceIndex = index;
      this.editForm.templateId = item.templateId;
      this.editForm.type = item.type;
      this.editForm.adTemplateDetailList = item.adTemplateDetailList;
      this.editForm.imgUrlList = [];
      item.adTemplateDetailList.forEach((item, index) => {
        this.editForm.imgUrlList.push("");
      });
    },
    getVideoCoverUrl(data) {
      this.editForm.videoCoverUrl = data.imageUrl;
    },
    getVideoUrl(data) {
      this.editForm.videoUrl = data.url;
    },
    //获取图片类型
    getImageUrl(data) {
      if (data.index != null && data.index >= 0) {
        this.$set(this.editForm.imgUrlList, data.index, data.imageUrl);
      }
    },
    deleteVideoUrl() {
      this.editForm.videoCoverUrl = "";
    },
    deleteImage(index) {
      this.$set(this.editForm.imgUrlList, index, "");
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        let imageIsexit = true;
        if (valid) {
          if (this.editForm.type === 0) {
            this.editForm.imgUrlList.map((item, index) => {
              if (item === "") {
                imageIsexit = false;
              }
            });
            if (!imageIsexit) {
              this.$message.info("请先上传完成创意图片");
              return;
            }
          }

          if (this.type === 1) {
            this.detailOriginality();
            return;
          }

          if (this.editForm.id != "") {
            adExtensionAddSad(this.editForm).then((res) => {
              this.$emit("dialogtq", {});
              this.$message({
                type: "success",
                message: "新增成功！",
              });
            });
          } else {
            adExtensionAddSad(this.editForm).then((res) => {
              this.$emit("dialogtq", {});
              this.$message({
                type: "success",
                message: "新增成功！",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    detailOriginality() {
      if (this.editForm.adOriginalityId != "") {
        updateAdOriginality(this.editForm).then((res) => {
          this.$emit("dialogtq", {});
          this.$message({
            type: "success",
            message: "编辑成功！",
          });
        });
      } else {
        addAdOriginality;
        addAdOriginality(this.editForm).then((res) => {
          this.$emit("dialogtq", {});
          this.$message({
            type: "success",
            message: "新增成功！",
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.advert-orig {
  .title {
    margin-bottom: 13px;
  }
}

.advert-temp-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .temp-chocie {
    border: 1px solid #0290ff !important;
    background: rgba(2, 144, 255, 0.2) !important;
    // font-weight: bold !important;
  }
  .temp-box {
    width: 282px;
    height: 135px;
    margin-bottom: 15px;
    border: 1px solid #d9d9d9;
    opacity: 1;
    border-radius: 4px;
    margin-right: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .sl-image {
      width: 54px;
      height: 96px;
      border: 1px solid #dfe2e5;
      opacity: 1;
      border-radius: 4px;
    }
    .detai-info {
      margin-left: 24px;
    }
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
.image-limit,
.video-limit {
  position: absolute;
  bottom: 10px;
  width: 100%;
  > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    color: #f56c6c;
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
</style>
