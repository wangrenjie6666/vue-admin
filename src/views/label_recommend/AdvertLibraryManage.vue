/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>软件投放</el-breadcrumb-item>
      <el-breadcrumb-item>标签推荐</el-breadcrumb-item>
      <el-breadcrumb-item>广告库管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="广告名称:">
          <el-input
            size="small"
            v-model="formInline.advertisingName"
            placeholder="请输入广告名称:"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告类型:">
          <el-select v-model="formInline.advertisingType" placeholder="请选择当前状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="开屏" :value="0"></el-option>
            <el-option label="轮播图" :value="1"></el-option>
            <el-option label="外链" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材类型:">
          <el-select v-model="formInline.materialType" placeholder="请选择当前状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="图片" :value="0"></el-option>
            <el-option label="视频" :value="1"></el-option>
          </el-select>
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
          >
            重置</el-button
          >
          <el-button
            class="reload-add-btn"
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="handleEdit()"
            >新建
          </el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        class="mb20"
        size="small"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="id" label="广告ID"> </el-table-column>
        <el-table-column sortable prop="advertisingName" label="广告名称">
        </el-table-column>
        <el-table-column sortable prop="advertisingType" label="广告类型">
          <template slot-scope="scope">
            <div v-if="scope.row.advertisingType === 0">开屏页</div>
            <div v-else-if="scope.row.advertisingType === 1">轮播图</div>
            <div v-else-if="scope.row.advertisingType === 2">外链</div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="imgSize" label="尺寸/大小/字符">
        </el-table-column>
        <el-table-column sortable prop="createTime" label="素材">
          <template slot-scope="scope">
            <div>
              {{ scope.row.materialType === 0 ? "图片" : "视频" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="labelList" label="标签">
          <template slot-scope="scope">
            <div>
              <el-tag
                v-for="(item, index) in scope.row.labelList"
                :key="index"
                closable
                @close="handleClose(scope.row.id, item.id)"
              >
                {{ item.labelName }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="description" label="描述"> </el-table-column>
        <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
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
              @click="deleteAdLibraryAd(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="60%" @click="closeDialog">
        <div class="edit-title">{{ title }}</div>

        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="广告类型：" prop="advertisingType" style="width: 100%">
            <el-radio-group
              v-model="editForm.advertisingType"
              style="margin-top: -10px"
              @change="changeMaterialType"
            >
              <el-radio :label="0" style="margin-top: 10px">开屏</el-radio>
              <el-radio :label="1" style="margin-top: 10px">轮播图</el-radio>
              <el-radio :label="2" style="margin-top: 10px">外链</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="素材类型：" prop="materialType" style="width: 100%">
            <el-radio-group
              v-model="editForm.materialType"
              style="margin-top: -10px"
              @change="refreshUrlList"
            >
              <el-radio :label="0" style="margin-top: 10px">图片</el-radio>
              <el-radio
                v-if="this.editForm.advertisingType !== 1"
                :label="1"
                style="margin-top: 10px"
                >视频</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="广告名称：" prop="advertisingName">
            <el-input
              size="small"
              class="w200"
              v-model="editForm.advertisingName"
              auto-complete="off"
              placeholder="请输入广告名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            :label="editForm.materialType === 0 ? '图片内容：' : '视频：'"
            prop="urlList"
          >
            <div>
              <div v-if="editForm.advertisingType === 1">
                <div class="image-add">
                  <SetImage @getImageUrl="getImageUrl" :imageUrl="editForm.urlList[0]">
                    <div
                      slot="deleteIcon"
                      class="delete-icon"
                      v-show="editForm.urlList[0]"
                    >
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
              </div>
              <div v-else>
                <div v-if="editForm.materialType === 0" class="url-class">
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
                  <div class="image-add">
                    <SetImage @getImageUrl="getImageUrl" :imageUrl="''"> </SetImage>
                  </div>
                </div>
                <div class="url-class" v-else-if="editForm.materialType === 1">
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
          <el-form-item label="尺寸：" prop="imgSize">
            <el-input
              size="small"
              v-model="editForm.adSlotSizeLong"
              auto-complete="off"
              class="w100"
              placeholder="长（像素）"
              @keyup.native="changeAdSlotSize"
              type="number"
            >
            </el-input>
            <span style="margin: 0 10px">X</span>
            <el-input
              size="small"
              class="w100"
              v-model="editForm.adSlotSizeHeight"
              auto-complete="off"
              placeholder="宽（像素）"
              @keyup.native="changeAdSlotSize"
              type="number"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="比例：" prop="imgProportion">
            <el-input
              size="small"
              class="w100"
              v-model="editForm.imgProportion"
              auto-complete="off"
              placeholder="16:9"
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

          <el-form-item label="描述：">
            <el-input
              type="textarea"
              class="w200"
              :rows="4"
              placeholder="请输入描述"
              v-model="editForm.remark"
            ></el-input>
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
import {
  searchAdLibrary,
  addAdLibraryAd,
  editLibraryAd,
  deleteAdLibraryAd,
  editAdLabel,
  delAdLabel,
} from "../../api/advert.js";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      deleteIconShow: true,
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加广告",
      editForm: {
        id: "",
        advertisingName: "",
        advertisingType: 0,
        materialType: 0,
        urlList: [],
        videoCoverUrl: "",
        jumpAddress: [],
        jumpPageType: 1,
        androidJumpAddress: "",
        adSlotSizeHeight: "",
        adSlotSizeLong: "",
        iosJumpAddress: "",
        description: "",
        adHeadline: "",
        adSubtitle: "",
        imgSize: "",
        imgProportion: "",
      },
      // rules表单验证
      rules: {
        materialType: [
          {
            required: true,
            message: "请输入广告类型",
            trigger: "blur",
          },
        ],
        advertisingType: [
          {
            required: true,
            message: "请输入素材类型",
            trigger: "blur",
          },
        ],
        advertisingName: [
          {
            required: true,
            message: "请输入广告名称",
            trigger: "blur",
          },
        ],
        urlList: [
          {
            required: true,
            message: "请输入图片内容",
            trigger: "blur",
          },
        ],
        imgSize: [
          {
            required: true,
            message: "请输入图片尺寸",
            trigger: "blur",
          },
        ],
        imgProportion: [
          {
            required: true,
            message: "请输入比例",
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
      formInline: {
        page: 1,
        limit: 10,
        advertisingType: "",
        advertisingName: "",
        materialType: "",
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
      let data = {
        start: parameter.page,
        length: parameter.limit,
        advertisingName: parameter.advertisingName,
        advertisingType: parameter.advertisingType,
        materialType: parameter.materialType,
      };
      searchAdLibrary(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
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
    deleteImage(index) {
      this.editForm.urlList.splice(index, 1);
    },
    deleteVideoUrl() {
      this.editForm.videoCoverUrl = "";
    },
    changeAdSlotSize() {
      if (this.editForm.adSlotSizeLong != "" && this.editForm.adSlotSizeHeight != "") {
        this.editForm.imgSize =
          this.editForm.adSlotSizeLong + "x" + this.editForm.adSlotSizeHeight;
      }
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        row = JSON.parse(JSON.stringify(row));
        this.title = "修改广告";
        this.editForm.id = row.id;
        this.editForm.advertisingName = row.advertisingName;
        this.editForm.advertisingType = row.advertisingType;
        this.editForm.materialType = row.materialType;
        this.editForm.urlList = row.urlList;
        this.editForm.videoCoverUrl = row.videoCoverUrl;
        this.editForm.jumpAddress = row.jumpAddress;
        this.editForm.jumpPageType = row.jumpPageType;
        this.editForm.androidJumpAddress = row.androidJumpAddress;
        this.editForm.iosJumpAddress = row.iosJumpAddress;
        this.editForm.description = row.description;
        this.editForm.adHeadline = row.adHeadline;
        this.editForm.adSubtitle = row.adSubtitle;
        this.editForm.imgSize = row.imgSize;
        this.editForm.imgProportion = row.imgProportion;
        this.editForm.adSlotSizeLong = row.adSlotSizeLong;
        this.editForm.adSlotSizeHeight = row.adSlotSizeHeight;
        if (this.editForm.imgSize) {
          let arr = this.editForm.imgSize.split("x");
          this.editForm.adSlotSizeLong = arr[0];
          this.editForm.adSlotSizeHeight = arr[1];
        }
      } else {
        this.title = "添加广告";
        this.editForm.id = "";
        this.editForm.advertisingName = "";
        this.editForm.advertisingType = 0;
        this.editForm.materialType = 0;
        this.editForm.urlList = [];
        this.editForm.videoCoverUrl = "";
        this.editForm.jumpAddress = "";
        this.editForm.jumpPageType = 1;
        this.editForm.androidJumpAddress = "";
        this.editForm.iosJumpAddress = "";
        this.editForm.description = "";
        this.editForm.adHeadline = "";
        this.editForm.adSubtitle = "";
        this.editForm.imgSize = "";
        this.editForm.imgProportion = "";
        this.editForm.adSlotSizeLong = 0;
        this.editForm.adSlotSizeHeight = 0;
      }
    },
    handleClose(adLibraryId, labelId) {
      this.$confirm("确定要删除标签吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delAdLabel({
            adLibraryId,
            labelId,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "数据已删除!",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.$message.error("数据删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editForm.id != "") {
            editLibraryAd(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
            });
          } else {
            addAdLibraryAd(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "广告新增成功！",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除公司
    deleteAdLibraryAd(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAdLibraryAd({
            id,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "数据已删除!",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.$message.error("数据删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.advertisingName = "";
      this.formInline.advertisingType = "";
      this.formInline.materialType = "";
      this.getdata(this.formInline);
    },
    //修改使用状态
    changeStatus(platformId, useStatus) {
      let data = {
        platformId,
        useStatus,
      };
      BusinessDisableAndEnable(data)
        .then((res) => {
          this.$message.success("修改成功");
        })
        .catch((res) => {
          this.getdata(this.formInline);
        });
    },
    //刷新url
    refreshUrlList() {
      this.editForm.urlList = [];
      this.editForm.videoCoverUrl = "";
    },
    changeMaterialType() {
      if (this.editForm.advertisingType === 1) this.editForm.materialType = 0;
    },
    //获取图片类型
    getImageUrl(data) {
      if (data.index != null && data.index >= 0) {
        this.$set(this.editForm.urlList, data.index, data.imageUrl);
      } else {
        this.editForm.urlList.push(data.imageUrl);
      }
    },
    getVideoCoverUrl(data) {
      this.editForm.videoCoverUrl = data.imageUrl;
    },
    getVideoUrl(data) {
      this.editForm.urlList = [];
      this.editForm.urlList.push(data.url);
    },
  },
};
</script>

<style lang="less" scoped>
.userRole {
  width: 100%;
}

.w100 {
  width: 100px;
}

.w200 {
  max-width: 400px;
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
</style>
