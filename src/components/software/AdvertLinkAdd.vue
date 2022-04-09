<template>
  <div>
    <div class="advert-title">
      <div class="cape"></div>
      <div class="name">广告位信息</div>
    </div>
    <div class="advert-info">
      <div><span>广告位编码：</span><span>AD_SHJ_banner</span></div>
      <div><span>广告位名称：</span><span>开屏广告</span></div>
      <div><span>所属业务：</span><span>现索管家</span></div>
      <div><span>所属页面：</span><span>开屏页</span></div>
      <div><span>支持类型：</span><span>图片</span></div>
      <div><span>最大数量:</span><span>6</span></div>
      <div><span>图片尺寸/视频大小：</span><span>300*600</span></div>
      <div><span>描述：</span><span>这是一个描述</span></div>
    </div>
    <!--广告位信息-->
    <div class="detail-title">
      <div class="cape"></div>
      <div class="name">广告位信息</div>
    </div>
    <div class="form-class">
      <el-button class="set-shop-advert" type="primary">设置商业广告</el-button>
      <div class="advert-info-save">
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="广告名称" prop="adName">
            <el-input
              size="small"
              v-model="editForm.adName"
              auto-complete="off"
              placeholder="请输入广告名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="广告标题">
            <el-radio-group v-model="editForm.jumpPageType" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">下载链接跳转</el-radio>
              <el-radio :label="1" style="margin-top: 10px">网页跳转</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="">
            <el-input
              size="small"
              v-model="editForm.adName"
              auto-complete="off"
              placeholder="请输入跳转链接：http://"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="素材类型">
            <el-radio-group v-model="editForm.jumpPageType" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">图片</el-radio>
              <el-radio :label="1" style="margin-top: 10px">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              size="small"
              v-model="editForm.adName"
              auto-complete="off"
              placeholder="请输入备注"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="editForm.jumpPageType" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
              <el-radio :label="1" style="margin-top: 10px">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="倒计时时长">
            <el-input
              size="small"
              v-model="editForm.adName"
              auto-complete="off"
              placeholder="倒计时时长"
            >
            </el-input
            >秒
            <el-radio-group v-model="editForm.jumpPageType" style="margin-top: -10px">
              <el-radio :label="0" style="margin-top: 10px">启用</el-radio>
              <el-radio :label="1" style="margin-top: 10px">禁止</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--定向投放-->
    <div class="directional-title">
      <div class="cape"></div>
      <div class="name">定向投放</div>
    </div>
    <div class="form-class">
      <div class="advert-info-save">
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="区域">
            <div>
              <span>不限</span>
              <span>按区域</span>
            </div>
            <div class="block">
              <el-cascader :options="options" :props="props" clearable></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="日期:" prop="endTime">
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
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewAdvertAdminAdvertlinkadd",

  data() {
    return {
      editForm: {},
      rules: {},
      options: [],
      props: {},
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.advert-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9e9e9;

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

.advert-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 24px;

  > div {
    width: 33%;
    display: flex;
    align-items: center;
    margin-top: 16px;

    > span:nth-child(1) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      width: 40%;
    }

    > span:nth-child(2) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
      width: 60%;
    }

    > span {
      display: inline-block;

      vertical-align: middle;
    }
  }
}

.detail-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  margin-top: 32px;
  border-bottom: 1px solid #e9e9e9;

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

.form-class {
  margin-top: 24px;

  .advert-info-save {
    margin-top: 24px;
    width: 500px;
    padding-bottom: 32px;

    .save-padding {
      padding-left: 32px;
    }
  }
}

.directional-title {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9e9e9;

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
</style>
