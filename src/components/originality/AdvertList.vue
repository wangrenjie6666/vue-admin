/** * 基础菜单 商品管理 */
<template>
  <div class="flex-class">
    <!-- 新建广告-->
    <div>
      <el-button class="add-btn" icon="el-icon-plus" type="primary" @click="handleEdit"
        >新建广告</el-button
      >
    </div>
    <div class="main-layout">
      <!-- 搜索筛选 -->
      <div class="pd3732 bgfff">
        <el-form :inline="true" :model="formInline" class="user-search">
          <el-form-item label="广告名称:">
            <el-input
              size="small"
              v-model="formInline.adName"
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
                @change="adExtensionDisabled(scope.row.id, scope.row.status)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column sortable prop="adName" label="广告名称" width="200">
            <template slot-scope="scope">
              <div
                style="color: #409eff; cursor: pointer"
                @click="goOriginalityList(scope.row.id)"
              >
                {{ scope.row.adName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable prop="status" label="状态" width="200">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status === 0 ? "启用" : "禁用" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable prop="exposure" label="曝光量" width="200">
          </el-table-column>
          <el-table-column sortable prop="hits" label="点击量" width="200">
          </el-table-column>
          <el-table-column sortable prop="clickThroughRate" label="点击率" width="200">
          </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" width="200">
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="200">
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
                @click="adExtensionDelete(scope.row.id)"
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
          <div>
            <el-form
              v-if="stepType === 0"
              label-width="120px"
              :model="editForm"
              :rules="rules"
              ref="editForm"
            >
              <!--广告位信息-->
              <div class="detail-title">
                <div class="cape"></div>
                <div class="name">广告版位</div>
              </div>
              <!-- 轮播图广告版位 -->
              <div class="advert-position">
                <div class="advert-info">
                  <div
                    class="advert-info advert-info_a mt20"
                    :class="{ choiceIndex: item.choiceIndex }"
                    v-for="(item, index) in adPositionList"
                    :key="index"
                    @click="choiceAll(index, $event)"
                  >
                    <div v-if="item.adPageList.length > 0">
                      <span>{{ item.platformName }}</span
                      ><span style="margin-left: 10px"
                        >(共<span class="red">{{ item.adPageList.length }}</span
                        >个广告场景)</span
                      >
                    </div>
                    <div class="mt20">
                      <el-checkbox-group
                        v-model="checkList"
                        @change="changeValueCheck(index)"
                        :disabled="isEdit"
                      >
                        <span
                          v-for="(item1, index1) in item.adPageList"
                          :key="index1"
                          @click.stop
                          style="margin-right: 20px"
                        >
                          <el-checkbox :label="item1.adPageId" style="margin-top: 10px">{{
                            item1.onThePage
                          }}</el-checkbox>
                        </span>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
                <div class="advert-rotation">
                  <div style="text-align: center; margin-bottom: 5px">广告模板图</div>
                  <div class="advert-tp-image">
                    <swiper
                      class="swiper"
                      :options="swiperOption"
                      v-if="RotationUrlList.length > 0"
                    >
                      <swiper-slide v-for="(item, index) in RotationUrlList" :key="index">
                        <div class="">
                          <el-image :src="item" alt="暂无图片"></el-image>
                        </div>
                      </swiper-slide>
                      <div
                        class="swiper-pagination"
                        slot="pagination"
                        style="bottom: 0"
                      ></div>
                      <div class="swiper-button-prev" slot="button-prev"></div>
                      <div class="swiper-button-next" slot="button-next"></div>
                    </swiper>
                    <el-image v-else fit="cover" :src="''" alt="暂无图片">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
              </div>
              <!--定向投放-->
              <div class="detail-title">
                <div class="cape"></div>
                <div class="name">定向投放</div>
              </div>
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
              <el-form-item label="广告名称:" prop="adName">
                <el-input
                  size="small"
                  class="w500"
                  v-model="editForm.adName"
                  placeholder="广告名称"
                ></el-input>
              </el-form-item>
            </el-form>
            <AddOriginality
              ref="addOriginality"
              v-if="stepType === 1"
              @dialogtq="dialogtq"
            />
          </div>
          <div slot="footer" class="dialog-footer" v-if="stepType === 0">
            <el-button size="small" @click="closeDialog">取消</el-button>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              class="title"
              @click="submitForm('editForm')"
              >{{ this.isEdit === true ? "保存" : "下一步" }}
            </el-button>
          </div>
          <div slot="footer" class="dialog-footer" v-else-if="stepType === 1">
            <el-button size="small" @click="closeDialog">取消</el-button>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              class="title"
              @click="submitFormStep2('editForm')"
              >保存
            </el-button>
          </div>
        </el-dialog>
        <!-- 编辑界面 -->
        <el-dialog
          :visible.sync="adSchedulingVisible"
          width="60%"
          append-to-body
          @click="closeDialogAdSchedulingVisible"
        >
          <div class="edit-title">{{ title }}</div>
          <div>
            <NewAdScheduling ref="adScheduling" />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  adExtensionGetList,
  adExtensionAddSad,
  getAdScheduleList,
  adExtensionUpdate,
  getAdPositionList,
  adExtensionDelete,
  adExtensionDisabled,
} from "@/api/originality.js";
import { sprAreaList } from "@/api/advert.js";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import Lunbo from "./lunbo.vue";
import ChoiceAdvertTemplate from "./ChoiceAdvertTemplate.vue";
import AddOriginality from "./AddOriginality.vue";
import NewAdScheduling from "@/components/advert_add/NewAdScheduling.vue";
export default {
  data() {
    return {
      swiperOption: {
        loop: false,
        loopFillGroupWithBlank: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      choiceIndex: "",
      RotationUrlList: [],
      areaListValue: [],
      isEdit: false,
      templateDataQue: [],
      templateData: [],
      options: [],
      props: {
        label: "name",
        value: "id",
        children: "list",
        multiple: true,
      },
      adSchedulingVisible: false,
      LaunchType: 0,
      stepType: 0,
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
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      adPositionList: [],
      title: "添加",
      editForm: {
        id: "",
        startTime: "",
        endTime: "",
        adName: "",
        adExtensionList: [],
        areaLocationList: [],
      },
      // rules表单验证
      rules: {
        adName: [
          {
            required: true,
            message: "请输入广告名称",
            trigger: "blur",
          },
        ],
      },
      checkList: [],
      formInline: {
        page: 1,
        limit: 10,
        adName: "",
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
    this.getAdPositionList();
  },
  computed: {
    regionList() {
      return this.$store.state.regionList;
    },
  },
  components: {
    Lunbo,
    Swiper,
    SwiperSlide,
    ChoiceAdvertTemplate,
    AddOriginality,
    NewAdScheduling,
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
        adName: parameter.adName,
      };
      adExtensionGetList(data).then((res) => {
        this.listData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
        if (this.$store.state.regionList.length === 0) {
          sprAreaList().then((res) => {
            this.$store.commit({
              type: "changeRegionList",
              list: res.data,
            });
          });
        }
      });
    },
    goOriginalityList(id) {
      this.$emit("goOriginalityList", { id });
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
    getAdPositionList() {
      getAdPositionList().then((res) => {
        this.adPositionList = res.data.businessList;
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
    judgeChoiceIndex(index) {
      let arr = this.adPositionList[index].adPageList.map((item1, index1) => {
        return item1.adPageId;
      });
      let a = new Set(arr);
      let b = new Set(this.checkList);
      let intersect = [...new Set([...a].filter((x) => b.has(x)))];
      if (intersect.length === 0) {
        this.adPositionList[index].choiceIndex = false;
      } else if (intersect.length === arr.length) {
        this.adPositionList[index].choiceIndex = true;
      }
      console.log(intersect, arr);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.options = this.regionList;
      this.adPositionList = this.adPositionList.map((item) => {
        item.choiceIndex = false;
        return item;
      });
      if (row != undefined && row != "undefined") {
        this.title = "修改广告";
        this.isEdit = true;
        this.editForm.id = row.id;
        this.editForm.adName = row.adName;
        this.editForm.startTime = row.startTime;
        this.editForm.endTime = row.endTime;
        this.editForm.adExtensionList = row.adExtensionList;
        this.editForm.areaLocationList = row.areaLocationList;
        this.areaListValue = [];
        //地区数据
        row.areaLocationList.forEach((item, index) => {
          let areaArr = [];
          areaArr.push(item.provinceId);
          areaArr.push(item.cityId);
          areaArr.push(item.areaId);
          this.areaListValue.push(areaArr);
        });
        if (row.areaLocationList.length <= 0) {
          this.LaunchType = 0;
        } else {
          this.LaunchType = 1;
        }
        //广告版本数据
        let pageIds = [];

        row.adExtensionList.forEach((item, index) => {
          pageIds.push(item.adPageId);
        });
        this.checkList = [...new Set(pageIds)];
        this.changeValueCheck();
      } else {
        this.title = "新增广告";
        this.isEdit = false;
        this.editForm.id = "";
        this.editForm.adName = "";
        this.editForm.startTime = "";
        this.editForm.endTime = "";
        this.editForm.adExtensionList = [];
        this.editForm.areaLocationList = [];
        this.areaListValue = [];
        this.checkList = [];
        this.RotationUrlList = [];
      }
    },
    changeValueCheck(index) {
      let templateUrlList = [];
      let advertIds = [];
      let templateIds = [];
      this.templateData = [];
      this.editForm.adExtensionList = [];
      this.checkList.forEach((item, index) => {
        this.adPositionList.forEach((item1, index1) => {
          item1.adPageList.forEach((item2, index2) => {
            if (item2.adPageId === item) {
              item2.adSpaceList.forEach((item3, index3) => {
                templateUrlList.push(item3.previewPhoto);
                this.editForm.adExtensionList.push({
                  platformId: item1.platformId,
                  adPageId: item2.adPageId,
                  adSpaceId: item3.adSpaceId,
                  templateId: item3.templateId,
                });
                this.templateData.push({
                  templateId: item3.templateId,
                  templateName: item3.templateName,
                  thumbnailPhoto: item3.thumbnailPhoto,
                  previewPhoto: item3.previewPhoto,
                  adTemplateDetailList: item3.adTemplateDetailList,
                  type: item3.type,
                });
                advertIds.push(item3.adSpaceId);
                templateIds.push(item3.templateId);
              });
            }
          });
        });
      });
      // console.log(templateUrlList, advertIds, templateIds, 99999);
      templateUrlList = [...new Set(templateUrlList)];
      advertIds = [...new Set(advertIds)];
      templateIds = [...new Set(templateIds)];
      this.RotationUrlList = templateUrlList.filter((x) => x);
      this.templateDataQue = [];
      let obj = {};
      for (let i = 0; i < this.templateData.length; i++) {
        if (!obj[this.templateData[i].templateId]) {
          this.templateDataQue.push(this.templateData[i]);
          obj[this.templateData[i].templateId] = true;
        }
      }
      if (!index) return;
      let arr = this.adPositionList[index].adPageList.map((item1, index1) => {
        return item1.adPageId;
      });
      let a = new Set(arr);
      let b = new Set(this.checkList);
      let intersect = [...new Set([...a].filter((x) => b.has(x)))];
      if (intersect.length === 0) {
        this.adPositionList[index].choiceIndex = false;
      } else if (intersect.length === arr.length) {
        this.adPositionList[index].choiceIndex = true;
      }
    },
    choiceAll(index, event) {
      // if (event.currentTarget === event.target) {
      // this.choiceIndex = index;
      // this.adPositionList[index].forEach((item, index) => {
      //checkList
      // item.adPageList.forEach((item1,index1)=>{
      // })
      if (this.isEdit) return;
      this.adPositionList[index].choiceIndex = this.adPositionList[index].choiceIndex
        ? false
        : true;
      if (this.adPositionList[index].choiceIndex) {
        let arr = [];
        this.adPositionList[index].adPageList.forEach((item, index) => {
          let judge = false;
          this.checkList.map((item1, index1) => {
            if (item.adPageId === item1) {
              judge = true;
              return;
            }
          });
          if (!judge) {
            arr.push(item.adPageId);
          }
        });
        this.checkList.push(...arr);
      } else {
        if (this.checkList.length === 0) {
          return;
        }
        let arr = this.adPositionList[index].adPageList.map((item, index) => {
          return item.adPageId;
        });
        let a = new Set(this.checkList);
        let b = new Set(arr);
        this.checkList = [...new Set([...a].filter((x) => !b.has(x)))];
      }
      this.changeValueCheck();
      // });
      // }
    },
    closeDialogAdSchedulingVisible() {
      this.adSchedulingVisible = false;
    },
    changeCascader(data) {
      this.areaListValue = data;
    },
    goScheduling() {
      if (this.editForm.startTime === "" || this.editForm.endTime === "") {
        this.$message.info("请先输入时间");
        return;
      }
      this.adSchedulingVisible = true;
      this.$nextTick(() => {
        this.$refs.adScheduling.getDateTime(
          this.editForm.startTime,
          this.editForm.endTime
        );
      });
    },
    changeLaunchType(type) {
      this.LaunchType = type;
      if (type === 0) {
        this.editForm.areaLocationList = [];
      }
    },
    goStep() {
      this.stepType = 1;
    },
    returnStep() {
      this.stepType = 0;
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          if (this.editForm.adExtensionList.length <= 0) {
            this.$message.info("广告版位选择不能为空");
            return;
          }
          this.editForm.areaLocationList = [];
          this.areaListValue.forEach((item, index) => {
            let areaObj = {};
            areaObj.provinceId = item[0];
            areaObj.cityId = item[1];
            areaObj.areaId = item[2];
            this.editForm.areaLocationList.push(areaObj);
          });
          if (
            ((this.editForm.startTime === "" || !this.editForm.startTime) &&
              (this.editForm.endTime === "" || !this.editForm.endTime)) ||
            (this.editForm.startTime != "" && this.editForm.endTime != "")
          ) {
          } else {
            this.$message.info("请完善投放日期填写");
            return;
          }
          if (this.editForm.id != "") {
            adExtensionUpdate(this.editForm).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "广告编辑成功",
              });
            });
          } else {
            adExtensionAddSad(this.editForm).then((res) => {
              // this.editFormVisible = false;
              // this.loading = false;
              // this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "广告新增成功",
              });
              this.getdata(this.formInline);
              this.stepType = 1;
              this.$nextTick(() => {
                this.$refs.addOriginality.receiveData(this.templateDataQue, res.data.id);
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除公司
    adExtensionDelete(id) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          adExtensionDelete({
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
      this.stepType = 0;
      this.editFormVisible = false;
    },
    dialogtq() {
      this.editFormVisible = false;
      this.stepType = 0;
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.adName = "";
      this.getdata(this.formInline);
    },
    //修改使用状态
    adExtensionDisabled(id, status) {
      let data = {
        id,
        status,
      };
      adExtensionDisabled(data)
        .then((res) => {
          this.$message.success("修改成功");
        })
        .catch((res) => {
          this.getdata(this.formInline);
        });
    },
    //保存第二步;
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
/deep/.image-slot {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}
.choiceIndex {
  background: #b5dfff !important;
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
.w500 {
  width: 500px;
}

.w100 {
  width: 100px;
}

.w200 {
  max-width: 400px;
}

.add-btn {
  width: 160px;
  height: 50px;
}
.advert-position {
  display: flex;
  margin-right: 50px;
  .advert-rotation {
    margin-left: 50px;
    .advert-tp-image {
      width: 326px;
      height: 440px;
      .el-image {
        margin-left: 50px;
        width: 226px;
        height: 419px;
      }
    }
  }
  .advert-info {
    flex: 1;
  }
  .advert-info_a {
    cursor: pointer;
    padding: 5px;
  }
  .advert-info_a:hover {
    background: #dbefff;
    cursor: pointer;
  }
}
.red {
  color: #ff5f74;
}
.detail-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  margin-top: 32px;
  // border-bottom: 1px solid #e9e9e9;

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
.swiper {
  width: 100%;
  height: 100%;
}

.look-scheduling {
  position: absolute;
  right: -70px;
  color: #0290ff;
  cursor: pointer;
}
</style>
