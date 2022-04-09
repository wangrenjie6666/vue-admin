<template>
  <div style="width: 100%; height: 100%">
    <el-upload
      class="avatar-uploader"
      :class="[imageUrl !== '' ? 'active' : 'disActive']"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img
        :class="[imageUrl !== '' ? 'active' : 'disActive']"
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
      />
      <i v-else class="el-icon-plus avatar-uploader-icon"> </i>
      <slot name="limit"></slot>
      <slot name="deleteIcon"></slot>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadUrl: this.$baseURL + "bpdList/uploadFile",
    };
  },
  props: {
    imgurltype: {
      default: "",
      type: String,
    },
    imageUrl: {
      default: "",
      type: String,
    },
    index: {
      default: null,
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      let imageUrl = res.data.mp4url;
      this.$emit("getImageUrl", {
        imageUrl,
        imgurtlype: this.imgurltype,
        index: this.index,
      });
    },
    beforeAvatarUpload(file) {
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg ";
      const isGIF = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!(isJPG == true || isPNG == true || isJPEG == true || isGIF == true)) {
        this.$message.error("上传图片只能是 JPG、PNG、JEPG、GIF!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
/deep/.avatar-uploader {
  width: 100%;
  height: 100%;
}

/deep/.avatar-uploader .el-upload {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  width: 100%;
  height: 100%;
}

/deep/.avatar-uploader-icon {
  font-size: 34px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/deep/.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
