<template>
  <div class="chart" style="width: 100%; height: 100%">
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="图表时间:">
        <el-col :span="11">
          <el-date-picker
            type="month"
            placeholder="选择查看月份"
            v-model="formInline.beginDate"
            style="width: 300px"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div ref="chart1" style="width: 100%; min-height: 300px" class="mt20"></div>
    <div ref="chart2" style="width: 100%; min-height: 300px" class="mt20"></div>
  </div>
</template>

<script>
import { advertChartData } from "@/api/advert";
export default {
  name: "AdvertChart",
  data() {
    return {
      formInline: {
        beginDate: "",
        adSlotCoding: "",
        advertisingNo: "",
      },
      data1: {
        color: ["#80FFA5"],
        title: {
          text: "广告累计浏览量",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          left: "1%",
          right: "2%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Date",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgba(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [120, 282, 111, 234, 220, 340, 528, 123, 156, 452, 456, 123],
          },
        ],
      },
      data2: {
        color: ["#80FFA5"],
        title: {
          text: "广告累计访问量",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          left: "1%",
          right: "2%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Date2",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgba(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: [120, 282, 111, 234, 220, 340, 528, 123, 156, 452, 456, 123],
          },
        ],
      },
    };
  },
  mounted() {
    this.myChart1 = this.$echarts.init(this.$refs.chart1);
    this.myChart2 = this.$echarts.init(this.$refs.chart2);
    // myChart.setOption(this.data);
  },
  methods: {
    search() {
      this.getChartData(
        this.formInline.adSlotCoding,
        this.formInline.advertisingNo,
        this.formInline.beginDate
      );
    },
    getChartData(adSlotCoding, advertisingNo, yearMonth) {
      this.formInline.beginDate = yearMonth;
      this.formInline.adSlotCoding = adSlotCoding;
      this.formInline.advertisingNo = advertisingNo;
      let arr = yearMonth.split("-");
      let days = this.$common.getMonthDays(arr[0], arr[1]);
      let data = {
        adSlotCoding,
        advertisingNo,
        startTime: yearMonth + "-01",
        endTime: yearMonth + "-" + days,
      };

      advertChartData(data).then((res) => {
        let ViewsDays = [];
        let ViewsData = [];
        let visitDays = [];
        let visitData = [];
        for (let i = 1; i <= days; i++) {
          if (i % 5 === 0) {
            ViewsDays.push(i);
            visitDays.push(i);
          } else {
            ViewsDays.push("");
            visitDays.push("");
          }
          if (res.data.adBrowseCountList[i - 1].browseCount !== null) {
            ViewsData.push(res.data.adBrowseCountList[i - 1].browseCount);
          } else {
            ViewsData.push(0);
          }

          if (res.data.accessCountList[i - 1].counts !== null) {
            visitData.push(res.data.accessCountList[i - 1].counts);
          } else {
            visitData.push(0);
          }
        }
        this.$set(this.data1.xAxis[0], "data", ViewsDays);
        this.$set(this.data2.xAxis[0], "data", visitDays);
        this.$set(this.data1.series[0], "data", ViewsData);
        this.$set(this.data2.series[0], "data", visitData);
        this.myChart1.setOption(this.data1);
        this.myChart2.setOption(this.data2);
      });
    },
  },
};
</script>

<style scoped></style>
