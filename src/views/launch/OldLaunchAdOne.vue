<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第一步</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <Stepbox :active="active" />
      <el-form
        label-width="140px"
        :model="editForm1"
        :rules="rules1"
        ref="editForm1"
        class="mt20"
      >
        <el-form-item label="广告类型:" prop="adType">
          <el-radio-group v-model="editForm1.adType">
            <el-radio :label="1">上传广告</el-radio>
            <el-radio :label="2">从广告库中选择</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form
        label-width="140px"
        :model="editForm"
        :rules="rules"
        ref="editForm"
        class="mt20"
        v-show="editForm1.adType == 1"
      >
        <el-form-item label="广告名称:" prop="advertisingName">
          <el-input
            size="small"
            v-model="editForm.advertisingName"
            auto-complete="off"
            placeholder="请输入广告名称"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="视频广告:" prop="mp4url">
          <el-upload
            class="avatar-uploader el-upload--text"
            :action="uploadUrl"
            :show-file-list="false"
            accept=".mp4"
            :headers="headers"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
          >
            <video
              v-if="this.global.company.showVideoPath != '' && !videoFlag"
              :src="this.global.company.showVideoPath"
              class="avatar video-avatar"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </video>
            <i
              v-else-if="this.global.company.showVideoPath == '' && !videoFlag"
              class="el-icon-plus avatar-uploader-icon"
            ></i>
            <el-progress
              v-if="videoFlag == true"
              type="circle"
              :percentage="videoUploadPercent"
              style="margin-top: 30px"
            ></el-progress>
            <el-button
              class="video-btn"
              slot="trigger"
              size="small"
              v-if="isShowUploadVideo"
              type="primary"
              >选取文件
            </el-button>
          </el-upload>
          <P v-if="isShowUploadVideo" class="text">请保证视频格式正确，且不超过30M</P>
          <p>视频分辨率最适合为16:9</p>
        </el-form-item>
        <el-form-item label="二维码链接地址:" prop="erWeiMaUrl">
          <el-input
            size="small"
            v-model="editForm.erWeiMaUrl"
            auto-complete="off"
            placeholder="请输入二维码链接地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-table
        size="small"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
        v-show="editForm1.adType == 2"
      >
        <el-table-column sortable prop="id" label="广告ID" width="200"> </el-table-column>
        <el-table-column sortable prop="advertisingName" label="广告名称" width="200">
        </el-table-column>
        <el-table-column sortable prop="mp4url" label="广告视频地址" width="200">
        </el-table-column>
        <el-table-column sortable prop="erWeiMaUrl" label="二维码链接地址" width="200">
        </el-table-column>
        <el-table-column
          sortable
          prop="operationPlatformName"
          label="适用平台"
          width="200"
        >
        </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="handleChoice(scope.$index, scope.row, 1)"
              v-show="scope.row.ischoice == 0"
              >选择</el-button
            >
            <el-button
              class="mini-red-btn"
              size="mini"
              @click="handleChoice(scope.$index, scope.row.id, 0)"
              v-show="scope.row.ischoice == 1"
              >取消选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div v-show="editForm1.adType == 2">
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </div>

      <div class="sumbit-btn">
        <el-button size="" @click="cancel()">上一步</el-button>
        <el-button size="" type="primary" @click="nextStep('editForm')">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { advertInsert, advertList2 } from "../../api/advert";
import Stepbox from "@/components/Stepbox";
export default {
  name: "LaunchAdOne",
  data() {
    return {
      global: {
        company: {
          showVideoPath: "",
        },
      },
      active: 0,
      loading: false, //是显示加载
      listData: [],
      headers: {
        token: localStorage.getItem("token"),
      },
      uploadUrl: this.$baseURL + "guanggao/uploadFile", //你要上传视频到你后台的地址
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      isShowUploadVideo: false, //显示上传按钮
      editForm: {
        erWeiMaUrl: "",
        mp4url: "",
        advertisingName: "",
        advertId: "",
        index: "",
      },
      editForm1: {
        adType: 1,
      },
      rules1: {
        adType: [
          {
            required: true,
            message: "请输入平台类型",
            trigger: "change",
          },
        ],
      },
      rules: {
        advertisingName: [
          {
            required: true,
            message: "请输入广告名称",
            trigger: "blur",
          },
        ],
        mp4url: [
          {
            required: true,
            message: "请先把广告视频上传",
            trigger: "change",
          },
        ],
        erWeiMaUrl: [
          {
            required: true,
            message: "请输入二维码链接地址",
            trigger: "blur",
          },
        ],
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      formInline: {
        page: 1,
        limit: 10,
      },
    };
  },
  created() {
    this.checkReLoad();
  },
  mounted() {
    this.listData = this.getdata(this.formInline.page);
  },
  components: {
    Stepbox,
  },
  methods: {
    getdata(parameter) {
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      let data = {
        start: parameter.page,
        length: parameter.limit,
      };
      advertList2(data).then((res) => {
        this.listData = res.data.records.map((item) => {
          item.ischoice = 0;
          return item;
        });
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    handleChoice(index, data, status) {
      if (status == 1) {
        this.editForm.advertId = data.id;
        this.editForm.index = index;
      } else {
        this.editForm.advertId = "";
      }
      this.listData.forEach((item) => {
        item.ischoice = 0;
      });
      this.$set(this.listData[index], "ischoice", status);
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    beforeUploadVideo(file) {
      const isLt20M = file.size / 1024 / 1024 < 100;
      if (["video/mp4"].indexOf(file.type) == -1) {
        //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("上传视频大小不能超过100MB哦!");
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
        this.global.company.showVideoPath = res.data.mp4url;
        this.editForm.mp4url = res.data.mp4url;
        this.editForm.md5Encrypt = res.data.md5Encrypt;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    checkReLoad() {
      let launchdata = this.$store.state.launchAdData;
      let judge = true;
      for (let obj in launchdata) {
        if (launchdata[obj] != "") {
          return false;
        }
      }
      if (judge) {
        this.$message.warning("重载数据出错，正在返回");
        this.$router.push({
          path: "/launch/launchAd",
        });
      }
    },
    nextStep(editForm) {
      if (this.editForm1.adType == 1) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            let data = {
              erWeiMaUrl: this.editForm.erWeiMaUrl,
              mp4url: this.editForm.mp4url,
              advertisingName: this.editForm.advertisingName,
              md5Encrypt: this.editForm.md5Encrypt,
            };
            //先放到vuex上
            this.$store.commit("saveLaunchAd", data);
            this.$router.push({
              path: "/launch/LaunchAdTwo",
            });
          }
        });
      } else {
        if (this.editForm.advertId != "") {
          //先放到vuex上
          let data = {
            advertisingId: this.editForm.advertId,
            mp4url: this.listData[this.editForm.index].mp4url,
            erWeiMaUrl: this.listData[this.editForm.index].erWeiMaUrl,
            advertisingName: this.listData[this.editForm.index].advertisingName,
            md5Encrypt: this.listData[this.editForm.index].md5Encrypt,
          };
          this.$store.commit("saveLaunchAd", data);
          this.$router.push({
            path: "/launch/LaunchAdTwo",
          });
        } else {
          this.$message.error("请选择其中的广告库");
        }
      }
    },
    cancel() {
      this.$router.push({
        path: "/launch/LaunchAd",
      });
    },
  },
};
</script>
<style scoped>
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.video-avatar {
  width: 400px;
  height: 200px;
}

.sumbit-btn {
  margin-top: 40px;
  text-align: center;
}
</style>
