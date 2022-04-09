/** * 基础菜单 商品管理 */
<template>
  <div class="flex-class">
    <!-- 新建广告-->
    <div>
      <el-button icon="el-icon-plus" type="primary" class="add-btn" @click="handleEdit"
        >新建创意</el-button
      >
    </div>
    <div class="main-layout">
      <!-- 搜索筛选 -->
      <div class="pd3732 bgfff">
        <el-form :inline="true" :model="formInline" class="user-search">
          <el-form-item label="创意名称:">
            <el-input
              size="small"
              v-model="formInline.originalityName"
              placeholder="请输入创意名称"
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
          <el-table-column align="center" prop="deleted" label="" width="">
            <template slot-scope="scope">
              <el-switch
                active-color="#0290FF"
                inactive-color="#999999"
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="changeStatus(scope.row.id, scope.row.status)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column sortable prop="originalityName" label="创意名称" width="200">
          </el-table-column>
          <el-table-column sortable prop="status" label="状态" width="200">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status === 0 ? "启用" : "禁用" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="exposure"
            label="预览图"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div
                class="father-image"
                v-if="scope.row.adOriginalityDetailList[0].type === 0"
              >
                <div
                  style="
                    width: 100%;
                    height: 150px;
                    position: relative;
                    margin-left: 20px;
                  "
                  v-for="(item, index) in scope.row.adOriginalityDetailList"
                  :key="index"
                >
                  <el-image
                    :src="item.url"
                    alt=""
                    class="image"
                    :preview-src-list="[item.url]"
                  ></el-image>

                  <!--            <img :src="scope.row.picFront" alt="" class="image" >-->
                </div>
              </div>
              <div v-else>视频资源</div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="exposure"
            label="曝光量"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column sortable prop="hits" label="点击量" width="200">
          </el-table-column>
          <el-table-column sortable prop="clickThroughRate" label="点击率" width="200">
          </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" width="200">
          </el-table-column>
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
                @click="deleteOriginalityById(scope.row.id)"
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
          @close="closeDialog"
          :close-on-click-modal="false"
        >
          <div class="edit-title">{{ title }}</div>
          <el-form
            v-if="stepType === 0"
            label-width="180px"
            :model="editForm"
            :rules="rules"
            ref="editForm"
          >
            <el-form-item label="选择已有的广告:" prop="id">
              <el-select
                v-model="editForm.id"
                placeholder="请选择当前广告"
                style="width: 400px"
                @change="getAdvertInfo"
                :disabled="editFormDisabled"
              >
                <el-option label="请选择广告" :value="''"></el-option>
                <el-option
                  :label="item.adName"
                  :value="item.id"
                  v-for="(item, index) in allAdvertList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-if="this.editForm.id != ''">
              <el-form-item label="广告版位:">
                <span> {{ advertInfo.platformNameStr }}</span>
              </el-form-item>
              <el-form-item label="定向:">
                <div v-if="advertInfo.areaPosition">
                  {{ advertInfo.areaPosition }}
                </div>
                <div v-else>不限</div>
              </el-form-item>
              <el-form-item label="投放日期:">
                <div>
                  {{
                    this.advertInfo.startTime
                      ? this.advertInfo.startTime + "至" + this.advertInfo.endTime
                      : "无期限"
                  }}
                </div>
              </el-form-item>
            </div>
          </el-form>
          <AddOriginality
            ref="addOriginality"
            v-if="stepType === 1"
            @dialogtq="dialogtq"
          />
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeDialog">取消</el-button>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              class="title"
              @click="submitForm('editForm')"
              v-show="stepType === 0"
              >下一步
            </el-button>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              class="title"
              v-show="stepType === 1"
              @click="submitFormStep2('editForm')"
              >保存
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAdOriginalityList,
  deleteOriginalityById,
  updateAdOriginalityStatus,
  getAllAdData,
  adExtensionGetList,
} from "@/api/originality";
import AddOriginality from "./AddOriginality.vue";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      allAdvertList: [],
      editFormDisabled: false,
      advertInfo: {
        platformNameStr: "",
        areaLocationList: [],
        startTime: "",
        endTime: "",
        adSpaceNameList: [],
        adExtensionList: [],
      },
      deliverInfo: {
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
      stepType: 0,
      editForm: {
        id: "",
        adOriginalityId: "",
      },
      // rules表单验证
      rules: {
        id: [
          {
            required: true,
            message: "请选择当前广告",
            trigger: "change",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        originalityName: "",
        adId: "",
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
    this.getAllAdData();
  },
  components: {
    AddOriginality,
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
        originalityName: parameter.originalityName,
        start: parameter.page,
        length: parameter.limit,
        adId: parameter.adId,
      };
      getAdOriginalityList(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    getAllAdData() {
      getAllAdData().then((res) => {
        this.allAdvertList = res.data;
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
    //获取当前广告信息
    getAdvertInfo() {
      if (this.editForm.id != "") {
        adExtensionGetList({ adId: this.editForm.id }).then((res) => {
          if (res.data.records.length <= 0) return;
          this.advertInfo = res.data.records[0];
        });
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
    dialogtq() {
      this.editFormVisible = false;
      this.stepType = 0;
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改创意";
        this.editFormDisabled = true;
        this.editForm.adOriginalityId = row.id;
        this.editForm.id = row.adId;
        this.deliverInfo.id = row.adId;
        this.deliverInfo.adOriginalityId = row.id;
        this.deliverInfo.templateId = row.templateId;
        // console.log(row.templateId, 999999);
        this.deliverInfo.mainTitle = row.mainTitle;
        this.deliverInfo.subtitle = row.subtitle;
        this.deliverInfo.jumpAddress = row.jumpAddress;
        this.deliverInfo.jumpPageType = row.jumpPageType;
        this.deliverInfo.androidJumpAddress = row.androidJumpAddress;
        this.deliverInfo.iosJumpAddress = row.iosJumpAddress;
        this.deliverInfo.originalityName = row.originalityName;
        this.deliverInfo.imgUrlList = [];
        if (row.adOriginalityDetailList.length <= 0) return;
        row.adOriginalityDetailList.forEach((item, index) => {
          if (item.type === 0) {
            this.deliverInfo.type = 0;
            this.deliverInfo.imgUrlList.push(item.url);
            this.deliverInfo.videoUrl = "";
            this.deliverInfo.videoCoverUrl = "";
          } else {
            this.deliverInfo.type = 1;
            this.deliverInfo.videoUrl = item.url;
            this.deliverInfo.videoCoverUrl = item.videoCoverUrl;
            this.deliverInfo.imgUrlList = [];
          }
        });
        this.getAdvertInfo();
        //获取
      } else {
        this.title = "新增创意";
        this.editFormDisabled = false;
        this.editForm.id = "";
        this.editForm.adOriginalityId = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.stepType = 1;
          this.templateDataQue = [];
          let obj = {};
          for (let i = 0; i < this.advertInfo.adExtensionList.length; i++) {
            if (!obj[this.advertInfo.adExtensionList[i].templateId]) {
              this.templateDataQue.push(this.advertInfo.adExtensionList[i]);
              obj[this.advertInfo.adExtensionList[i].templateId] = true;
            }
          }
          this.$nextTick(() => {
            this.$refs.addOriginality.receiveData(
              this.templateDataQue,
              this.editForm.id,
              1,
              this.editForm.adOriginalityId,
              this.deliverInfo,
              this.title === "修改创意" ? "edit" : "add"
            );
          });
        } else {
          return false;
        }
      });
    },
    // 删除公司
    deleteOriginalityById(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOriginalityById({
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
    transmitData(id) {
      this.formInline.adId = id;
      setTimeout(() => {
        this.getdata(this.formInline);
      }, 200);
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
      this.$nextTick(() => {
        this.stepType = 0;
      });
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.originalityName = "";
      this.getdata(this.formInline);
    },
    //修改使用状态
    changeStatus(id, status) {
      let data = {
        id,
        status,
      };
      updateAdOriginalityStatus(data)
        .then((res) => {
          this.$message.success("修改成功");
        })
        .catch((res) => {
          this.getdata(this.formInline);
        });
    },
    submitFormStep2() {
      this.$refs.addOriginality.submitForm("editForm");
    },
  },
};
</script>

<style lang="less" scoped>
.userRole {
  width: 100%;
}

.flex-class {
  display: flex;
  flex-direction: column;
  height: 100%;

  > div:nth-child(2) {
    flex: 1;
    background: #fff;
  }
}
.father-image {
  display: flex;
  align-items: center;
  width: auto;
}

.add-btn {
  width: 160px;
  height: 50px;
}
</style>
