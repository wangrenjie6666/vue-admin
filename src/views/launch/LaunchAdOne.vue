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
      <div>
        <div class="title">请选择需要投放的广告</div>
      </div>
      <!-- 请需要投放的广告 -->
      <div class="advert-launch">
        <div class="name">视频广告：</div>

        <div class="advert-list-mg">
          <div class="advert-list-ct" v-for="(item, index) in advertList" :key="index">
            <video :src="item.mp4url" class="video" controls="controls">
              您的浏览器不支持视频播放
            </video>
            <div class="info">
              <div class="name">{{ item.advertisingName }}</div>
              <div class="func" @click="deleteAdvertList(index)">
                <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
          <div class="advert-list" @click="goChoiceAdvert">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>
      <div class="sumbit-btn">
        <el-button size="" @click="cancel()">上一步</el-button>
        <el-button size="" type="primary" @click="nextStep('editForm')">下一步</el-button>
      </div>
    </div>

    <!-- 编辑界面 -->
    <el-dialog :visible.sync="choiveAdvertVisible" width="60%" @click="closeDialog">
      <div class="edit-title">{{ title }}</div>
      <div><AdvertList ref="advertList"></AdvertList></div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="batchEnter">批量确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Stepbox from "@/components/Stepbox";
import AdvertList from "@/components/hardware/AdvertList";
export default {
  name: "NewAdvertAdminLaunchadone",
  components: {
    Stepbox,
  },
  data() {
    return {
      active: 0,
      choiveAdvertVisible: false,
      title: "请选择投放的广告",
      advertList: [],
    };
  },
  created() {
    this.checkReLoad();
  },
  components: {
    AdvertList,
    Stepbox,
  },
  mounted() {},

  methods: {
    goChoiceAdvert() {
      this.choiveAdvertVisible = true;
      this.$nextTick(() => {
        this.$refs.advertList.transferData(this.advertList);
      });
    },
    closeDialog() {
      this.choiveAdvertVisible = false;
    },
    deleteAdvertList(index) {
      this.advertList.splice(index, 1);
    },
    batchEnter() {
      let multipleData = JSON.parse(
        JSON.stringify(this.$refs.advertList.getMultipleData())
      );
      if (multipleData) {
        this.advertList = multipleData;
        this.choiveAdvertVisible = false;
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
    nextStep() {
      if (this.advertList.length <= 0) {
        this.$message("至少选择一个广告视频");
        return;
      }
      let data = this.advertList;
      this.$store.commit("saveAdvertList", data);
      this.$router.push({
        path: "/launch/LaunchAdTwo",
      });
    },
    cancel() {
      this.$router.push({
        path: "/launch/LaunchAd",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  padding-top: 32px;
  font-size: 20px;
  font-weight: 400;

  color: rgba(0, 0, 0, 0.85);
  opacity: 1;
}
.sumbit-btn {
  margin-top: 93px;
  text-align: center;
}
.advert-launch {
  display: flex;
  margin-top: 20px;
  .name {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    opacity: 1;
  }
  .advert-list-mg {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-bottom: 32px;
    }
    .advert-list {
      width: 352px;
      height: 266px;
      margin-right: 32px;
      border: 1px solid #d9d9d9;
      opacity: 1;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      cursor: pointer;
    }
    .advert-list-ct {
      width: 100%;
      width: 352px;
      height: 266px;
      margin-right: 32px;
      border: 1px solid #d9d9d9;
      opacity: 1;
      border-radius: 8px;
      cursor: pointer;
      .video {
        width: 352px;
        height: 198px;
        border-radius: 8px;
      }
      .info {
        display: flex;
        height: calc(100% - 198px);
        align-items: center;
        justify-content: space-between;
        .name {
          margin-left: 24px;
          font-size: 16px;
          font-weight: bold;
        }
        .func {
          margin-right: 26px;
          font-size: 20px;
        }
      }
    }
  }
}
.dialog-footer {
  display: flex;
  flex-direction: row-reverse;
}
</style>
