/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>广告推广</el-breadcrumb-item>
      <el-breadcrumb-item>广告模板管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div class="pd3732 bgfff">
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="广告名称:">
          <el-input
            size="small"
            v-model="formInline.templateName"
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
          <el-button
            class="mini-red-btn"
            size="small"
            type="primary"
            icon="el-icon-delete"
            @click="adTemplateDeleteByIds()"
            >刪除
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
        ref="multipleTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- <el-table-column prop="deleted" width="">
          <template slot-scope="scope">
            <el-switch
              active-color="#0290FF"
              inactive-color="#999999"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="adTemplateDisabled(scope.row.templateId, scope.row.status)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column sortable prop="templateName" label="广告模板名称" width="200">
        </el-table-column>
        <!-- <el-table-column sortable prop="status" label="状态">
          <template slot-scope="scope">
            <div>{{ scope.row.status === 0 ? "启用" : "禁用" }}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          sortable
          prop="previewPhoto"
          label="预览"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div
              class="img-center"
              style="width: 100%; height: 150px"
              v-if="scope.row.previewPhoto"
            >
              <el-image
                :src="scope.row.previewPhoto"
                alt=""
                class="image"
                :preview-src-list="[scope.row.previewPhoto]"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="proportionStr" label="比例" width="200">
        </el-table-column>
        <el-table-column sortable prop="sizeStr" label="尺寸" width="200">
        </el-table-column>
        <el-table-column sortable prop="lengthStr" label="大小" width="200">
        </el-table-column>
        <el-table-column sortable prop="duration" label="时长"> </el-table-column>
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
              @click="adTemplateDeleteByIds(scope.row.templateId)"
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
          <el-form-item label="形式名称" prop="templateName">
            <el-input
              size="small"
              v-model="editForm.templateName"
              auto-complete="off"
              class="w200"
              placeholder="请输入形式名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="素材类型：" prop="type">
            <el-radio-group
              v-model="editForm.type"
              style="margin-top: -10px"
              :disabled="editFormDisabled"
              @change="changeMaterialType"
            >
              <el-radio :label="0" style="margin-top: 10px">图片</el-radio>
              <el-radio :label="1" style="margin-top: 10px">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-warp">
            <el-form-item label="缩略图：" prop="thumbnailPhoto">
              <div class="image-add">
                <SetImage
                  @getImageUrl="getAbridgeImage"
                  :imageUrl="editForm.thumbnailPhoto"
                >
                  <div
                    slot="deleteIcon"
                    class="delete-icon"
                    v-show="editForm.thumbnailPhoto !== ''"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      class="delete-icon-size"
                      circle
                      @click.stop="deleteAbridgeImage()"
                    ></el-button>
                  </div>
                </SetImage>
              </div>
            </el-form-item>
            <el-form-item label="预览图：" prop="previewPhoto">
              <div class="image-add">
                <SetImage
                  @getImageUrl="getPreviewImage"
                  :imageUrl="editForm.previewPhoto"
                >
                  <div
                    slot="deleteIcon"
                    class="delete-icon"
                    v-show="editForm.previewPhoto !== ''"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      class="delete-icon-size"
                      circle
                      @click.stop="deletePreviewImage()"
                    ></el-button>
                  </div>
                </SetImage>
              </div>
            </el-form-item>
          </div>
          <div>
            <div
              class="resource-template"
              v-for="(item, index) in editForm.detailList"
              :key="index"
            >
              <div class="title" v-if="editForm.type === 0">图{{ index + 1 }}：</div>
              <div class="flex-warp-template">
                <el-form-item label="名称：" v-if="editForm.type === 0">
                  <el-input
                    size="small"
                    v-model="item.name"
                    placeholder="请输入名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="比例：">
                  <el-input
                    size="small"
                    v-model="item.propWidth"
                    auto-complete="off"
                    class="w100"
                    placeholder="请输入比例宽"
                    @change="changeMaterialProp(index)"
                    type="number"
                  >
                  </el-input>
                  <span style="margin: 0 10px">：</span>
                  <el-input
                    size="small"
                    class="w100"
                    v-model="item.propHeight"
                    auto-complete="off"
                    placeholder="请输入比例高"
                    @change="changeMaterialProp(index)"
                    type="number"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="大小：">
                  <el-input
                    size="small"
                    class="w100"
                    v-model="item.length"
                    auto-complete="off"
                    placeholder="最大不超过"
                    type="number"
                  >
                  </el-input>
                  <span style="margin: 0 10px">{{
                    editForm.type === 0 ? "KB" : "M"
                  }}</span>
                </el-form-item>
                <el-form-item label="尺寸：">
                  <el-input
                    size="small"
                    v-model="item.sizeWidth"
                    auto-complete="off"
                    class="w100"
                    placeholder="宽（像素）"
                    @change="changeMaterialSize(index)"
                    type="number"
                  >
                  </el-input>
                  <span style="margin: 0 10px">X</span>
                  <el-input
                    size="small"
                    class="w100"
                    v-model="item.sizeHeight"
                    auto-complete="off"
                    placeholder="高（像素）"
                    @change="changeMaterialSize(index)"
                    type="number"
                  >
                  </el-input>
                </el-form-item>

                <el-form-item label="时长：" v-if="editForm.type === 1">
                  <span style="margin-right: 10px">大于</span>
                  <el-input
                    size="small"
                    v-model="editForm.durationSmall"
                    auto-complete="off"
                    class="w100"
                    placeholder="秒"
                    @change="changeDuration"
                    type="number"
                  >
                  </el-input>
                  <span style="margin: 0 10px">小于</span>
                  <el-input
                    size="small"
                    class="w100"
                    v-model="editForm.durationBig"
                    auto-complete="off"
                    placeholder="秒"
                    @change="changeDuration"
                    type="number"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="视频封面大小："
                  prop="imgProportion"
                  v-if="editForm.type === 1"
                >
                  <el-input
                    size="small"
                    class="w100"
                    type="number"
                    v-model="editForm.videoCoverLength"
                    auto-complete="off"
                    placeholder="M"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="template-add-btn" v-if="editForm.type === 0">
            <el-button
              size="small"
              type="danger"
              @click="deleteMaterial"
              style="margin-left: 5px"
              :disabled="editFormDisabled"
              >删除</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="addMaterial"
              :disabled="editFormDisabled"
              >添加</el-button
            >
          </div>

          <el-form-item label="状态：" prop="status" v-show="false">
            <el-radio-group v-model="editForm.status" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
              <el-radio :label="1" style="margin-top: 10px">禁用</el-radio>
            </el-radio-group>
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
  adTemplateList,
  adTemplateAdd,
  adTemplateUpdate,
  adTemplateDeleteByIds,
  adTemplateDisabled,
} from "@/api/originality";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "新增模板管理",
      multipleSelection: "",
      deleteIconShow: true,
      editFormDisabled: false,
      editForm: {
        templateId: "",
        previewPhoto: "",
        thumbnailPhoto: "",
        templateName: "",
        status: 0,
        type: 0,
        videoCoverLength: "",
        durationBig: "",
        durationSmall: "",
        duration: "",
        detailList: [
          {
            name: "",
            proportion: "",
            sizeWidth: "",
            sizeHeight: "",
            propWidth: "",
            propHeight: "",
            size: "",
            length: "",
          },
        ],
      },
      // rules表单验证
      rules: {
        templateName: [
          {
            required: true,
            message: "请输入形式模板名称",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请输入状态",
            trigger: "blur",
          },
        ],
        previewPhoto: [
          {
            required: true,
            message: "请输入预览图",
            trigger: "blur",
          },
        ],
        thumbnailPhoto: [
          {
            required: true,
            message: "请输入缩略图",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请输入素材类型",
            trigger: "blur",
          },
        ],
        duration: [
          {
            required: true,
            message: "请输入视频时长",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        templateName: "",
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
      detailList: [],
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
        platformName: parameter.platformName,
        start: parameter.page,
        length: parameter.limit,
        templateName: parameter.templateName,
      };
      adTemplateList(data).then((res) => {
        //处理下返回回来的数据，进行交互
        this.listData = res.data.records.map((item, index) => {
          let proportionArr = [];
          let sizeArr = [];
          let lengthArr = [];
          if (item.detailList instanceof Array) {
            item.detailList.forEach((item1, index1) => {
              proportionArr.push(item1.proportion);
              sizeArr.push(item1.size);
              lengthArr.push(item1.length);
            });
            item.proportionStr = proportionArr.join(",");
            item.sizeStr = sizeArr.join(",");
            item.lengthStr = lengthArr.join(",");
          }

          return item;
        });
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    goBusinessPageList(platformCode, platformName, useStatus) {
      this.$router.push({
        path: "/business/BusinessPageList",
        query: {
          platformCode,
          platformName,
          useStatus,
        },
      });
    },
    changeMaterialType() {
      if (this.editForm.type === 1) {
        this.detailList = JSON.parse(JSON.stringify(this.editForm.detailList));
        this.editForm.detailList = [];
        this.editForm.detailList.push(this.detailList[0]);
      } else {
        this.editForm.detailList = this.detailList;
      }
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
        row = JSON.parse(JSON.stringify(row));
        this.title = "修改模板管理";
        this.editFormDisabled = true;
        this.editForm.templateId = row.templateId;
        this.editForm.status = row.status;
        this.editForm.templateName = row.templateName;
        this.editForm.previewPhoto = row.previewPhoto;
        this.editForm.thumbnailPhoto = row.thumbnailPhoto;
        this.editForm.type = row.type;
        this.editForm.videoCoverLength = row.videoCoverLength;
        let durationArr = row.duration.split("-");
        this.editForm.duration = row.duration;
        this.editForm.durationSmall = durationArr[0];
        this.editForm.durationBig = durationArr[1];
        row.detailList = row.detailList.map((item, index) => {
          let proparr = item.proportion.split(":");
          let sizearr = item.size.split("x");
          item.propWidth = proparr[0];
          item.propHeight = proparr[1];
          item.sizeWidth = sizearr[0];
          item.sizeHeight = sizearr[1];
          return item;
        });
        this.editForm.detailList = row.detailList;
      } else {
        this.editFormDisabled = false;
        this.title = "添加模板管理";
        this.editForm.duration = "";
        this.editForm.durationSmall = "";
        this.editForm.durationBig = "";
        this.editForm.videoCoverLength = "";
        this.editForm.templateId = "";
        this.editForm.status = 0;
        this.editForm.templateName = "";
        this.editForm.previewPhoto = "";
        this.editForm.thumbnailPhoto = "";
        this.editForm.type = 0;
        this.editForm.detailList = [
          {
            name: "",
            proportion: "",
            sizeWidth: "",
            sizeHeight: "",
            propWidth: "",
            propHeight: "",
            size: "",
            length: "",
          },
        ];
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          let jdg = true;
          let isInt = true;
          let reg = /^[1-9]\d*$/;
          if (this.editForm.type === 0) {
            this.editForm.detailList.map((item, index) => {
              if (
                item.name == "" ||
                item.proportion == "" ||
                item.size == "" ||
                item.length == ""
              ) {
                jdg = false;
                return;
              }

              if (
                !reg.test(item.propWidth) ||
                !reg.test(item.propHeight) ||
                !reg.test(item.sizeWidth) ||
                !reg.test(item.sizeHeight) ||
                !reg.test(item.length)
              ) {
                isInt = false;
                return;
              }
            });
          } else {
            this.editForm.detailList.map((item, index) => {
              if (item.proportion == "" || item.size == "" || item.length == "") {
                jdg = false;
                return;
              }
              if (
                !reg.test(item.propWidth) ||
                !reg.test(item.propHeight) ||
                !reg.test(item.sizeWidth) ||
                !reg.test(item.sizeHeight) ||
                !reg.test(item.length)
              ) {
                isInt = false;
                return;
              }
            });
            if (this.editForm.duration === "" || this.editForm.videoCoverLength === "") {
              jdg = false;
            }
            if (
              !reg.test(this.editForm.durationSmall) ||
              !reg.test(this.editForm.durationBig) ||
              !reg.test(this.editForm.videoCoverLength)
            ) {
              isInt = false;
            }
          }

          if (!jdg) {
            this.$message.error("请把图片或视频模板填写完善");
            return;
          }
          if (!isInt) {
            this.$message.error("模板数据(比例、大小、尺寸、时长、封面大小)只能是正整数");
            return;
          }

          if (this.editForm.templateId != "") {
            adTemplateUpdate(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "广告模板保存成功！",
              });
            });
          } else {
            adTemplateAdd(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "添加成功!",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除广告模板
    adTemplateDeleteByIds(templateId) {
      let ids = [];
      if (templateId !== undefined && templateId !== null) {
        ids.push(templateId);
      } else {
        if (this.multipleSelection === "") {
          this.$message.info("请勾选要删除的目标");
          return;
        }
        ids = this.multipleSelection.split(",");
      }
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          adTemplateDeleteByIds({
            ids,
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
    addMaterial() {
      if (this.editForm.detailList.length >= 3) {
        this.$message.info("图片模板数目最大为3个");
        return;
      }
      this.editForm.detailList.push({
        name: "",
        proportion: "",
        sizeWidth: "",
        sizeHeight: "",
        propWidth: "",
        propHeight: "",
        size: "",
        length: "",
      });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.templateName = "";
      this.getdata(this.formInline);
    },
    //修改使用状态
    adTemplateDisabled(templateId, status) {
      let data = {
        templateId,
        status,
      };
      adTemplateDisabled(data)
        .then((res) => {
          this.$message.success("修改成功");
        })
        .catch((res) => {
          this.getdata(this.formInline);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = "";
      val.forEach((item, index) => {
        if (index != 0) {
          this.multipleSelection += ",";
        }
        this.multipleSelection += item.templateId;
      });
    },
    getAbridgeImage(data) {
      this.editForm.thumbnailPhoto = data.imageUrl;
    },
    getPreviewImage(data) {
      this.editForm.previewPhoto = data.imageUrl;
    },
    deleteAbridgeImage() {
      this.editForm.thumbnailPhoto = "";
    },
    deletePreviewImage() {
      this.editForm.previewPhoto = "";
    },
    changeMaterialProp(index) {
      if (
        this.editForm.detailList[index].propWidth != "" &&
        this.editForm.detailList[index].propHeight != ""
      ) {
        this.editForm.detailList[index].proportion =
          this.editForm.detailList[index].propWidth +
          ":" +
          this.editForm.detailList[index].propHeight;
      }
    },
    changeMaterialSize(index) {
      if (
        this.editForm.detailList[index].sizeWidth != "" &&
        this.editForm.detailList[index].sizeHeight != ""
      ) {
        this.editForm.detailList[index].size =
          this.editForm.detailList[index].sizeWidth +
          "x" +
          this.editForm.detailList[index].sizeHeight;
      }
    },
    changeDuration() {
      if (this.editForm.durationBig != "" && this.editForm.durationSmall != "") {
        this.editForm.duration =
          this.editForm.durationSmall + "-" + this.editForm.durationBig;
      }
    },
    deleteMaterial() {
      if (this.editForm.detailList.length <= 1) {
        this.$message.info("至少保留一个图片模板");
        return;
      }
      this.editForm.detailList.splice(this.editForm.detailList.length - 1, 1);
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

.resource-template {
  .title {
    width: 120px;
    text-align: right;
    padding-right: 12px;
  }

  .flex-warp-template {
    max-width: 800px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    > .el-form-item {
      min-width: 360px;
      margin-left: 40px;
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

.template-add-btn {
  width: 164px;
  display: flex;
  margin-bottom: 36px;
  align-items: center;
  flex-direction: row-reverse;
}

.flex-warp {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 24px;

  .image-add {
    width: 314px;
    height: 118px;
    // border-radius: 2px;
    border: 1px solid #efefef;

    .image-choice-radio {
      position: absolute;
      right: 15px;
      bottom: 0px;
    }
  }
}
</style>
