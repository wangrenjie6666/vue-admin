/** * 基础菜单 商品管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>广告推广</el-breadcrumb-item>
      <el-breadcrumb-item>广告形式</el-breadcrumb-item>
    </el-breadcrumb>
    <!--广告方式-->
    <div class="advert-way">
      <div :class="{ 'advert-Way-choice': advertWay === 0 }" @click="changeAdvertWay(0)">
        广告
      </div>
      <div :class="{ 'advert-Way-choice': advertWay === 1 }" @click="changeAdvertWay(1)">
        广告创意
      </div>
    </div>

    <!--广告列表-->
    <div class="advert-table">
      <AdvertList v-if="advertWay === 0" @goOriginalityList="goOriginalityList" />
      <OriginalityList ref="originalityList" v-else />
    </div>
  </div>
</template>
<script>
import AdvertList from "@/components/originality/AdvertList.vue";
import OriginalityList from "@/components/originality/OriginalityList.vue";
export default {
  data() {
    return {
      advertWay: 0,
    };
  },
  methods: {
    changeAdvertWay(type) {
      this.advertWay = type;
    },
    goOriginalityList(data) {
      this.advertWay = 1;
      this.$nextTick(() => {
        this.$refs.originalityList.transmitData(data.id);
      });
    },
  },
  components: {
    AdvertList,
    OriginalityList,
  },
};
</script>

<style scoped>
.userRole {
  width: 100%;
}

.advert-way {
  padding: 30px;
  padding-left: 32px;
  background: #fff;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.advert-Way-choice {
  color: #0290ff !important;
  border-bottom: 2px solid #0290ff;
}

.main-layout > div:nth-child(2) {
  flex: 0;
}

.advert-way > div:nth-child(2) {
  margin-left: 116px;
}

.advert-way > div {
  cursor: pointer;
  font-size: 18px;
  color: rgba(141, 94, 94, 0.65);
  font-weight: 500;
  padding-bottom: 4px;
}

.advert-table {
  flex: 1;
  /* background: #fff; */
}
</style>
