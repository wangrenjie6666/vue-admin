<template>
  <div class="main-layout">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第一步</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第二步</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第三步</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第四步</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <Stepbox :active="active" />
      <div class="title">确认投放的信息</div>
      <div>
        <table
          border="0"
          cellspacing="0"
          cellpadding="5"
          v-for="(item, index) in savedata.advertList"
          :key="index"
        >
          <tr>
            <th>广告名称:</th>
            <td>{{ item.advertisingName }}</td>
            <th>二维码链接地址:</th>
            <td>{{ item.erWeiMaUrl }}</td>
          </tr>
          <tr>
            <th>视频广告：</th>
            <td>
              <div class="vodeo-class" @click="goVideo(item.mp4url)">
                <i class="el-icon-video-play video-icon"></i>
              </div>
            </td>
          </tr>
        </table>
        <table border="0" cellspacing="0" cellpadding="5" class="mt20 table-3">
          <tbody v-for="(item, index) in savedata.equipmentDTOList" :key="index">
            <tr>
              <th>设备id:</th>
              <td :title="item.equId">
                <el-tooltip placement="top">
                  <div slot="content" style="color: #fff">{{ item.equId }}</div>
                  <div>{{ item.equId }}</div>
                </el-tooltip>
              </td>
              <th>设备IMEI:</th>
              <td>
                <el-tooltip placement="top">
                  <div slot="content" style="color: #fff">{{ item.imei }}</div>
                  <div class="tool-tip">{{ item.imei }}</div>
                </el-tooltip>
              </td>
              <th>设备识别码:</th>
              <td>
                <el-tooltip placement="top">
                  <div slot="content" style="color: #fff">{{ item.equNo }}</div>
                  <div class="tool-tip">{{ item.equNo }}</div>
                </el-tooltip>
              </td>
              <th>设备名称:</th>
              <td>{{ item.equName }}</td>
            </tr>
            <tr style="width: 100%">
              <th>投放时间：</th>
              <td style="overflow: visible" v-if="item.cycleType == 1">
                <div class="year-time">{{ item.datePicker }}</div>
                <div class="date-mg" style="width: 600px">
                  <div
                    class="date"
                    v-for="(item1, index1) in item.timeList"
                    :key="index1"
                  >
                    <div class="">
                      <span class="">{{ item1.day }}日：</span
                      ><span class="colorfff">已选择</span>
                    </div>
                    <div class="">
                      <span class="">00:00</span>~<span class="colorfff">24:00</span>
                    </div>
                  </div>
                </div>
              </td>
              <td style="overflow: visible" v-else-if="item.cycleType == 2">
                <div class="year-time">{{ item.datePicker }}</div>
                <div class="date-mg" style="width: 600px">
                  <div
                    class="date"
                    v-for="(item1, index1) in item.timeList"
                    style="line-height: 43px"
                    :key="index1"
                  >
                    <div class="">
                      <span class="">{{ item1.key }}月</span>
                    </div>
                  </div>
                </div>
                <p style="margin: 10px 0">
                  共 <span style="color: #0290ff">{{ item.choiceDays }}</span
                  >天
                </p>
              </td>
              <td style="overflow: visible" v-else-if="item.cycleType == 3">
                <div class="year-time">{{ item.datePicker }}</div>
                <div class="date-mg" style="width: 600px">
                  <div
                    class="date"
                    v-for="(item1, index1) in item.timeList"
                    style="line-height: 43px"
                    :key="index1"
                  >
                    <div class="">
                      <span class="">第{{ item1.key }}季度</span>
                    </div>
                  </div>
                </div>
                <p style="margin: 10px 0">
                  共 <span style="color: #0290ff">{{ item.choiceDays }}</span
                  >天
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="sumbit-btn">
          <el-button class="" size="" @click="cancel()">上一步</el-button>
          <el-button class="colorfff" size="" type="primary" @click="nextStep()"
            >投放</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { insertLaunch } from "@/api/equipment";
import Stepbox from "@/components/Stepbox";
export default {
  name: "LaunchAdFour",
  created() {
    this.checkReLoad();
    this.detailData(JSON.parse(JSON.stringify(this.$store.state.launchAdData)));
  },
  data() {
    return {
      active: 3,
      savedata: {},
    };
  },
  computed: {
    equipmentDTOList() {
      return this.$store.state.launchAdData.equipmentDTOList;
    },
    launchAdData() {
      return this.$store.state.launchAdData;
    },
  },
  watch: {
    launchAdData(newdata) {
      this.detailData(JSON.parse(JSON.stringify(this.$store.state.launchAdData)));
    },
    equipmentDTOList(newdata) {
      this.detailData(JSON.parse(JSON.stringify(this.$store.state.launchAdData)));
    },
  },
  components: {
    Stepbox,
  },

  methods: {
    detailData(savedata) {
      this.savedata = savedata;
      console.log(this.savedata);
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
    goVideo(url) {
      window.open(url, "_blank");
    },
    transFormDateData(data, time) {
      let arr = [];
      let str = "";
      for (let i = 0; i < data.length; i++) {
        str = time;
        str += data[i].day < 10 ? "-0" + data[i].day : "-" + data[i].day;
        arr.push(str);
      }
      return arr;
    },
    transFormMonthData(data, time) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(...this.$common.noEmployMonthData(time, data[i].key, data[i].list));
      }
      return arr;
    },
    transFormQuarterData(data, time) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(...this.$common.noEmployQuarterData(time, data[i].key, data[i].list));
      }
      return arr;
    },
    transFormData(data) {
      for (let i = 0; i < data.equipmentDTOList.length; i++) {
        switch (data.equipmentDTOList[i].cycleType) {
          case 1:
            data.equipmentDTOList[i].timeList = this.transFormDateData(
              data.equipmentDTOList[i].timeList,
              data.equipmentDTOList[i].datePicker
            );
            break;
          case 2:
            data.equipmentDTOList[i].timeList = this.transFormMonthData(
              data.equipmentDTOList[i].timeList,
              data.equipmentDTOList[i].datePicker
            );
            break;
          case 3:
            data.equipmentDTOList[i].timeList = this.transFormQuarterData(
              data.equipmentDTOList[i].timeList,
              data.equipmentDTOList[i].datePicker
            );
            break;
        }
        data.equipmentDTOList[i].recordType = data.equipmentDTOList[i].cycleType;
      }
      let adIdList = [];
      data.advertList.forEach((item, index) => {
        adIdList.push(item.id);
      });
      data.adIdList = adIdList;
      return data;
    },
    nextStep() {
      let data = JSON.parse(JSON.stringify(this.$store.state.launchAdData));

      data = this.transFormData(data);

      insertLaunch(data).then((res) => {
        this.$message.success("保存成功");
        setTimeout(() => {
          this.$router.push({
            path: "/launch/LaunchAd",
          });
        }, 1000);
      });
    },
    cancel() {
      this.$router.push({
        path: "/launch/launchAdThree",
      });
    },
  },
};
</script>

<style scoped>
* {
  color: #333;
}

.year-time {
  width: 105px;
  height: 43px;
  /*padding: 5px;*/
  background: #efefef;
  text-align: center;
  line-height: 43px;
}

.date {
  margin-right: 20px;
  width: 140px;
  height: 43px;
  background: #ffffff;
  border: 1px solid #0290ff;
  margin-top: 10px;
  text-align: center;
}

.date span {
  color: #0290ff !important;
}

.sumbit-btn {
  margin-top: 40px;
  width: 1000px;
  text-align: center;
}

.title {
  font-size: 18px;
  color: #666;
  margin: 20px 0;
}

table {
  /*border:1px #ccc solid;*/
  width: 100%;
  text-align: left;
  padding: 20px;
}

table th {
  color: #999;
  font-weight: 500;
}

table tr {
  margin-top: 20px;
  padding: 20px;
}

.colorfff {
  color: #fff;
}

table td {
  padding: 20px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vodeo-class {
  width: 120px;
  height: 120px;
  background: black;
  line-height: 150px;
  text-align: center;
  cursor: pointer;
}

.video-icon {
  font-size: 40px;
  color: #fff;
}

.table-3 {
  display: block;
  max-height: 500px;
  overflow-y: auto;
}

.date-mg {
  display: flex;
  flex-wrap: wrap;
}

.tool-tip {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
