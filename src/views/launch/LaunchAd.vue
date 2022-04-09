<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>硬件投放</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告</el-breadcrumb-item>
      <el-breadcrumb-item>投放广告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <div class="mt40 title">请选择广告投放的业务平台</div>
      <el-form label-width="" :model="editForm" :rules="rules" ref="editForm">
        <div class="list-mg">
          <el-form-item label="" prop="cycle">
            <el-radio-group v-model="editForm.business" class="advert-name-mg">
              <el-radio
                v-for="(item, index) in listData"
                :key="index"
                :value="item.id"
                :label="item.id"
              >
                <div class="advert-name">
                  {{ item.operationPlatformName }}
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="广告名称：" prop="advertisingName">
          <el-input
            size="small"
            class="w200"
            v-model="editForm.advertisingName"
            auto-complete="off"
            placeholder="请输入广告名称"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="sumbit-btn">
        <el-button size="" type="" @click="startLaunch('editForm')">开始投放</el-button>
        <el-button size="" @click="cancel()">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { businessSearch } from "@/api/config.js";
export default {
  name: "LaunchAd",
  data() {
    return {
      editForm: {
        business: 0,
        advertisingName: "",
      },
      rules: {
        advertisingName: [
          {
            required: true,
            message: "请输入广告名称",
            trigger: "blur",
          },
        ],
      },
      listData: [],
    };
  },
  created() {
    this.getdata();
  },
  watch: {
    $route(to, from) {
      if (from.name == "投放广告(第四步)" && to.name == "投放广告") {
        location.reload();
      }
    },
  },
  methods: {
    getdata() {
      businessSearch().then((res) => {
        this.listData = res.data.list;
      });
    },
    startLaunch(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          let data = {
            advertisingListId: this.editForm.business,
            advertisingName: this.editForm.advertisingName,
          };
          if (data.advertisingListId == 0) {
            this.$message.warning("必须选择一个业务平台投放");
            return;
          }
          this.$store.commit("saveLaunchAd", data);
          this.$router.push({
            path: "/launch/LaunchAdOne",
          });
        }
      });
    },
    cancel() {
      location.reload();
    },
  },
};
</script>

<style scoped>
* {
  color: #666;
  box-sizing: border-box;
}

.title {
  font-size: 25px;
}

.advert-name-mg {
  display: flex;
  flex-wrap: wrap;
  margin-left: 40px;
}

.list-mg {
  width: 920px;
  padding-right: 40px;
  border: 1px solid #efefef;
  margin-top: 30px;
  margin-bottom: 30px;
}
.w200 {
  width: 600px;
}

.advert-name {
  margin-top: 20px;
  display: inline-block;

  width: 360px;
  height: 120px;
  background-color: rgba(242, 242, 242, 1);
  text-align: center;
  line-height: 120px;
}

.sumbit-btn {
  width: 920px;
  margin-top: 40px;
  text-align: center;
}
</style>
