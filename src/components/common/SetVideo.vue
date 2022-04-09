<template>
  <div style="width: 100%; height: 100%">
    <el-upload
      class="avatar-uploader"
      :class="{ 'avatar-uploader-class': videoUrl === '' ? true : false }"
      :action="uploadUrl"
      :show-file-list="false"
      accept=".mp4"
      :headers="headers"
      :on-success="handleVideoSuccess"
      :before-upload="beforeUploadVideo"
      :on-progress="uploadVideoProcess"
    >
      <video
        v-if="videoUrl != '' && !videoFlag"
        :src="videoUrl"
        class="avatar video-avatar"
        controls="controls"
      >
        您的浏览器不支持视频播放
      </video>
      <i
        v-else-if="videoUrl == '' && !videoFlag"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
      <slot name="limit"></slot>
      <el-progress
        v-if="videoFlag == true"
        type="circle"
        :percentage="videoUploadPercent"
        style="margin-top: 30px; margin-left: auto; margin-right: auto"
      >
      </el-progress>
      <el-button
        class="video-btn"
        slot="trigger"
        size="small"
        v-if="isShowUploadVideo"
        type="primary"
        >选取视频文件
      </el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    videoUrl: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      headers: {
        token: localStorage.getItem("token"),
      },
      uploadUrl: this.$baseURL + "bpdList/uploadFile", //你要上传视频到你后台的地址
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      isShowUploadVideo: false, //显示上传按钮
    };
  },
  watch: {
    videoUrl: {
      immediate: true,
      handler(newvalue) {
        if (newvalue != "" && newvalue) {
          this.isShowUploadVideo = true;
        } else {
          this.isShowUploadVideo = false;
        }
      },
    },
  },
  methods: {
    beforeUploadVideo(file) {
      console.log(file);
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (["video/mp4"].indexOf(file.type) == -1) {
        //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("上传视频大小不能超过50MB哦!");
        return false;
      }
      this.isShowUploadVideo = false;
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res.code == 200) {
        this.$message.success("上传成功！");
        this.$emit("getVideoUrl", {
          url: res.data.mp4url,
        });
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
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

.avatar-uploader {
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
}

.avatar-uploader-class {
  /* margin-bottom: 20px; */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader-class >>> .el-upload {
  height: 100%;
}

/deep/.avatar-uploader .el-upload {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  width: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 20px 0;
  justify-content: center;
  align-items: center;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 40px;
  color: #8c939d;
  max-width: 314px;
  max-height: 420px;
  display: flex;
  justify-items: center;
  justify-content: center;
}

.avatar {
  max-width: 314px;
  max-height: 420px;
  display: block;
}

.video-avatar {
  /* max-width: 314px;
  max-height: 420px; */
  width: 100%;
  height: 100%;
}

.tool-tip {
  max-width: 314px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
