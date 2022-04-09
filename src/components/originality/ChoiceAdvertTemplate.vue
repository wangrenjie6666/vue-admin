<template>
  <div>
    <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
      <!--广告位信息-->
      <div class="detail-title">
        <div class="cape"></div>
        <div class="name">广告版位</div>
      </div>
      <!-- 轮播图广告版位 -->
      <div class="advert-position">
        <div class="advert-info">
          <div class="advert-info" v-for="(item, index) in adPositionList" :key="index">
            <div v-if="item.adPageList.length > 0">
              <span>{{ item.platformName }}</span
              ><span style="margin-left: 10px"
                >(默认<span class="red">{{ item.adPageList.length }}</span
                >个广告场景)</span
              >
            </div>
            <div style="margin-top: 34px">
              <el-checkbox-group v-model="checkList" @change="changeValueCheck">
                <el-checkbox
                  v-for="(item1, index1) in item.adPageList"
                  :key="index1"
                  :label="item1.adPageId"
                  >{{ item1.onThePage }}</el-checkbox
                >
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
                <el-image
                  fit="cover"
                  :src="item"
                  alt="暂无图片"
                  :preview-src-list="[item]"
                ></el-image
              ></swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
            <el-image v-else fit="cover" :src="''" alt="暂无图片"></el-image>
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
      <el-form-item label="广告名称:">
        <el-input
          size="small"
          class="w500"
          v-model="editForm.adName"
          placeholder="广告名称"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "NewAdvertAdminChoiceadverttemplate",

  data() {
    return {
      editForm: {
        id: "",
        platformCode: "",
        platformName: "",
        remark: "",
      },
      rules: {
        platformCode: [
          {
            required: true,
            message: "请输入业务编码",
            trigger: "blur",
          },
        ],
        platformName: [
          {
            required: true,
            message: "请输入业务名称",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    getAdPositionList() {
      getAdPositionList().then((res) => {
        this.adPositionList = res.data.businessList;
      });
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
      width: 226px;
      height: 419px;
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .advert-info {
    flex: 1;
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
