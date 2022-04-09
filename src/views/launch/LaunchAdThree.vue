<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第一步</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第二步</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告第三步</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <Stepbox :active="active" />
      <h1 class="htitle">请选择设备投放的时间:</h1>
      <div class="list-mg">
        <div v-for="(item,index) in listData" :key="index" class="mt40">
          <!--设备内容-->
          <div>
            <span class="equip-nav">设备ID:</span><span>{{item.id}}</span>
            <span class="equip-nav">设备识别码:</span><span>{{item.equNo}}</span>
            <span class="equip-nav">设备名称:</span><span>{{item.equName ==null ? '暂无' : item.equName}}</span>
          </div>
          <!--投放周期-->
          <div>
            <div class="block mt20">
              <span class="demonstration">投放周期：</span>
              <el-select v-model="item.cycleType" placeholder="请选择投放周期" @change="changeCycleType(index)">
                <el-option v-for="(item1,index1) in launchList" :key="index1" :value="item1.type"
                  :label="item1.cycleName"></el-option>
              </el-select>
              <span class="demonstration ml20" v-if="item.cycleType !=''">选择投放时间：</span>
              <el-date-picker v-if="item.cycleType==1" v-model="item.datePicker" type="month" value-format="yyyy-MM"
                placeholder="请先选择月份" @change="datePickerChange(item.datePicker,item.cycleType,item.id,index)">
              </el-date-picker>
              <el-date-picker v-else-if="item.cycleType==2" v-model="item.datePicker" type="year" value-format="yyyy"
                placeholder="请先选择年份" @change="datePickerChange(item.datePicker,item.cycleType,item.id,index)">
              </el-date-picker>
              <el-date-picker v-else-if="item.cycleType==3" v-model="item.datePicker" type="year" value-format="yyyy"
                placeholder="请先选择年份" @change="datePickerChange(item.datePicker,item.cycleType,item.id,index)">
              </el-date-picker>
            </div>
            <div class="mt20">
              <CycleDateDay v-if="item.cycleType==1" :dateList="item.dateList" :index="index"
                @changeDateType="changeDateType" class="mb20" />
              <CycleDateMonth v-else-if="item.cycleType==2" :dateList="item.dateList" :index="index"
                :cycleType="item.cycleType" @changeDateType="changeDateType" class="mb20" />
              <CycleDateQuarter v-else-if="item.cycleType==3" :dateList="item.dateList" :index="index"
                :cycleType="item.cycleType" @changeDateType="changeDateType" class="mb20" />
            </div>
            <div class="ml20" v-if="item.cycleType==2 || item.cycleType==3">
              <div><span>共选择 <span class="red">{{item.choiceDays}}</span>天</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sumbit-btn mt40">
        <el-button size="" @click="cancel()">上一步</el-button>
        <el-button size="" type="primary" @click="nextStep()">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getTimeAndEquIds
  } from '@/api/equipment'
  import {
    LaunchList
  } from '../../api/config'
  import Stepbox from '@/components/Stepbox'
  import CycleDateDay from "../../components/cycle/CycleDateDay";
  import CycleDateMonth from "../../components/cycle/CycleDateMonth";
  import CycleDateQuarter from "../../components/cycle/CycleDateQuarter";
  export default {
    name: "LaunchAdThree",
    data() {
      return {
        active: 2,
        launchList: [],
        listData: [],
      }
    },
    created() {
      this.checkReLoad()
      this.getConfigData();
      this.getListData();
    },
    computed: {
      equipids() {
        return this.$store.state.launchAdData.equipmentIds;
      }
    },
    watch: {
      equipids(newval) {
        let arr = newval.split(',');
        let deleteArr = [];
        this.listData.forEach((item, index) => {
          let judge = false;
          arr.forEach((item1, index1) => {
            if (item.id == item1) {
              judge = true;
            }
          })
          if (!judge) {
            deleteArr.push(item.id);
          }
        })
        //去除多余设备投放数组id
        this.deleteSurplusEqId(deleteArr);
        //新增新的数组id
        arr.forEach((item, index) => {
          let judge = false;
          this.listData.forEach((item1, index1) => {
            if (item1.id == item) {
              judge = true;
            }
          })
          if (!judge) {
            this.addNewSeletedData(item)
          }
        })

      }
    },
    methods: {
      getListData() {
        let listData = JSON.stringify(this.$store.state.launchAdData.selectedEQList);
        listData = JSON.parse(listData);
        listData.forEach((item, index) => {
          item.cycleType = '';
          item.datePicker = '';
          item.dateList = [];
          item.choiceDays = 0;
          item.employDays = 0;
        })
        this.listData = listData;
      },
      getConfigData() {
        LaunchList().then(res => {
          //进行数据渲染处理
          let newList = [];
          this.launchList = res.data.records.forEach((item, index) => {
            if (item.state == 1) {
              item.type = item.cycle;
              newList.push(item)
            }
          })
          console.log(newList);
          this.launchList = newList;
        })
      },
      checkReLoad() {
        let launchdata = this.$store.state.launchAdData;
        let judge = true;
        for (let obj in launchdata) {
          if (launchdata[obj] != '') {
            return false;
          }
        }
        if (judge) {
          this.$message.warning('重载数据出错，正在返回')
          this.$router.push({
            path: '/launch/launchAd'
          })
        }
      },
      datePickerChange(date, cycleType, id, index) {
        id += '';
        let days = ''
        let startTime = '';
        let endTime = '';
        switch (cycleType) {
          case 1:
            days = this.getLaunchDateList(date);
            startTime = date + '-01'
            endTime = date + '-' + days
            break;
          case 2:
            startTime = date + '-01-01'
            endTime = date + '-12-31'
            break;
          case 3:
            startTime = date + '-01-01'
            endTime = date + '-12-31'
            break;
        }
        let data = {
          startTime,
          endTime,
          type: cycleType,
          equipmentIds: id
        }
        getTimeAndEquIds(data).then(res => {
          let list = res.data[0].simpleTimeList;
          let handleListData = this.$common.cycleDataHandle(list, cycleType, days, date);
          this.$set(this.listData[index], 'dateList', handleListData)
          this.$set(this.listData[index], 'choiceDays', 0)
        })
      },
      getLaunchDateList(date) {
        let arrdate = date.split('-');
        let days = this.$common.getMonthDays(arrdate[0], arrdate[1]);
        return days;
      },
      changeCycleType(index) {
        this.$set(this.listData[index], 'datePicker', '')
        this.$set(this.listData[index], 'dateList', [])
        this.$set(this.listData[index], 'choiceDays', 0)
        this.$set(this.listData[index], 'employDays', 0)
      },
      changeDateType(data) {
        let type = data.type
        let index = data.index
        let index1 = data.index1
        this.$set(this.listData[index].dateList[index1], 'type', type);
        if (data.cycleType && data.type == 3) {
          let employDays = this.listData[index].dateList[index1].list.length;
          let days = this.listData[index].dateList[index1].lengthday;
          this.$set(this.listData[index], 'choiceDays', this.listData[index].choiceDays + days);
          this.$set(this.listData[index], 'employDays', this.listData[index].employDays + employDays);
        } else if (data.cycleType && data.type == 1) {
          let employDays = this.listData[index].dateList[index1].list.length;
          let days = this.listData[index].dateList[index1].lengthday;
          this.$set(this.listData[index], 'choiceDays', this.listData[index].choiceDays - days);
          this.$set(this.listData[index], 'employDays', this.listData[index].employDays - employDays);
        }
      },
      addNewSeletedData(id) {
        let list = JSON.parse(JSON.stringify(this.$store.state.launchAdData.selectedEQList));
        list.some((item, index) => {
          if (item.id == id) {
            item.cycleType = '';
            item.datePicker = '';
            item.dateList = [];
            item.choiceDays = 0;
            item.employDays = 0;
            this.listData.push(item)
            return true;
          }
        })
      },
      deleteSurplusEqId(deleteArr) {
        this.listData.forEach((item, index) => {
          deleteArr.forEach(item1 => {
            if (item1 == item.id) {
              this.listData.splice(index, 1);
            }
          })
        })
      },
      cancel() {
        this.$router.push({
          path: '/launch/launchAdTwo'
        })
      },
      nextStep() {
        let judge = true;
        let equipmentDTOList = [];
        this.listData.forEach((item, index) => {
          equipmentDTOList.push({
            equId: item.id,
            equNo: item.equNo,
            imei: item.imei,
            equName: item.equName,
          })
          equipmentDTOList[index].timeList = [];
          equipmentDTOList[index].cycleType = item.cycleType;
          equipmentDTOList[index].datePicker = item.datePicker;
          equipmentDTOList[index].choiceDays = item.choiceDays;
          item.dateList.forEach(item1 => {
            let day = item1.day;
            if (item1.type == 3) {
              equipmentDTOList[index].timeList.push(item1);
            }
          })
          if (equipmentDTOList[index].timeList.length == 0) {
            judge = false;
          }
        })
        if (!judge) {
          this.$message.error('所有的设备都需要选择好日期投放广告')
          return;
        }
        let data = {
          equipmentDTOList,
        }
        this.$store.commit('saveLaunchAd', data);
        this.$router.push({
          path: '/launch/launchAdFour'
        })
      },
    },
    components: {
      Stepbox,
      CycleDateDay,
      CycleDateMonth,
      CycleDateQuarter
    },

  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
    font-size: 14px;
  }

  .htitle {
    font-size: 18px;
    margin: 15px 0;
    margin-top: 20px;
  }

  .equip-nav {
    color: #999999;
    margin-right: 5px;
    margin-left: 20px;
  }

  .equip-nav:nth-child(1) {
    margin-left: 0;
  }
</style>