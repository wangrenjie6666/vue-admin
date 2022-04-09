/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>广告库</el-breadcrumb-item>
      <el-breadcrumb-item>广告库</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="适用平台">
          <el-select v-model="formInline.advertisingListId" placeholder="请选择适用平台">
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="parm in businessList"
              :key="parm.id"
              :label="parm.operationPlatformName"
              :value="parm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告名称">
          <el-input
            size="small"
            v-model="formInline.advertisingName"
            auto-complete="off"
            placeholder="请输入广告名称"
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
            >重置</el-button
          >
          <el-button
            class="reload-add-btn"
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="handleEdit()"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        size="small"
        class="mb20"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="id" label="广告ID" width="100"> </el-table-column>
        <el-table-column sortable prop="advertisingName" label="广告名称" width="200">
        </el-table-column>
        <el-table-column sortable label="广告视频地址" width="200">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content" style="color: #fff; max-width: 500px">
                {{ scope.row.mp4url }}
              </div>
              <div class="tool-tip">{{ scope.row.mp4url }}</div>
            </el-tooltip>
          </template>
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
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <!--          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">二维码</el-button>-->
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              @click="deleteAdvert(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog
        :visible.sync="editFormVisible"
        width="60%"
        @click="closeDialog"
        :close-on-click-modal="false"
      >
        <div class="edit-title">{{ title }}</div>
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="广告名称" prop="advertisingName">
            <el-input
              size="small"
              v-model="editForm.advertisingName"
              auto-complete="off"
              placeholder="请输入广告名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="二维码链接地址" prop="erWeiMaUrl">
            <el-input
              size="small"
              v-model="editForm.erWeiMaUrl"
              auto-complete="off"
              placeholder="请输入二维码地址"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="适用平台" prop="advertisingListId">
            <el-select
              size="small"
              v-model="editForm.advertisingListId"
              placeholder="请选择"
              class="selectw"
            >
              <el-option :label="'请选择'" :value="''"></el-option>
              <el-option
                v-for="parm in businessList"
                :key="parm.id"
                :label="parm.operationPlatformName"
                :value="parm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视频广告" prop="mp4url">
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button
            size="small"
            type="primary"
            :loading="loading"
            class="title"
            @click="submitForm('editForm')"
            >保存
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { advertList2, advertSave, advertInsert1, advertDelete } from "@/api/advert";
import { businessSearch } from "@/api/config.js";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      businessList: [],
      editForm: {
        id: "",
        mp4url: "",
        advertisingName: "",
        erWeiMaUrl: "",
        advertisingListId: "",
        md5Encrypt: "",
        fileSize: "",
      },
      global: {
        company: {
          showVideoPath: "",
        },
      },
      headers: {
        token: localStorage.getItem("token"),
      },
      uploadUrl: this.$baseURL + "guanggao/uploadFile", //你要上传视频到你后台的地址
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      isShowUploadVideo: false, //显示上传按钮
      // rules表单验证
      rules: {
        advertisingName: [
          {
            required: true,
            message: "请选择广告名称",
            trigger: "blur",
          },
        ],
        erWeiMaUrl: [
          {
            required: true,
            message: "请选择二维码地址",
            trigger: "blur",
          },
        ],
        mp4url: [
          {
            required: true,
            message: "请上传视频",
            trigger: "blur",
          },
        ],
        advertisingListId: [
          {
            required: true,
            message: "请选择业务平台 ",
            trigger: "change",
          },
        ],
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
    this.getBusinessList();
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
      advertList2(parameter).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },

    getBusinessList() {
      businessSearch().then((res) => {
        this.businessList = res.data.list;
      });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.id = row.id;
        this.editForm.mp4url = row.mp4url;
        this.editForm.advertisingName = row.advertisingName;
        this.editForm.erWeiMaUrl = row.erWeiMaUrl;
        this.editForm.advertisingListId = row.advertisingListId;
        this.global.company.showVideoPath = this.editForm.mp4url;
        this.isShowUploadVideo = true;
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        this.editForm.md5Encrypt = row.md5Encrypt;
        this.editForm.fileSize = row.fileSize;
      } else {
        this.title = "添加";
        this.editForm.id = "";
        this.editForm.mp4url = "";
        this.editForm.advertisingName = "";
        this.editForm.erWeiMaUrl = "";
        this.editForm.advertisingListId = "";
        this.global.company.showVideoPath = "";
        this.isShowUploadVideo = false;
        this.videoFlag = "";
        this.videoUploadPercent = "";
        this.editForm.md5Encrypt = "";
        this.editForm.fileSize = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editForm.id != "") {
            advertSave(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "配置保存成功！",
              });
            });
          } else {
            advertInsert1(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "配置新增成功！",
              });
            });
          }
        } else {
          return false;
        }
      });
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    deleteAdvert(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        advertDelete({
          id,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功！",
          });
          this.getdata(this.formInline);
        });
      });
    },
    enable(id) {
      this.$confirm("确定要启用吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        LaunchEnable({
          id,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "禁用成功!",
          });
          this.getdata(this.formInline);
        });
      });
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
        this.editForm.fileSize = res.data.fileSize;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    resetRefresh() {
      //设为初始化
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.advertisingListId = "";
      this.formInline.advertisingName = "";
      this.getdata(this.formInline);
    },
  },
};
</script>

<style scoped>
.userRole {
  width: 100%;
}

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

.tool-tip {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
