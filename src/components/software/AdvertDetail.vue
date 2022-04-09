<template>
  <div>
    <h3>投放广告信息</h3>
    <div class="detail mt20">
      <div>
        <span>广告编码：</span><span>{{ advertDetail.advertisingNo }}</span>
      </div>
      <div>
        <span>广告名称：</span><span>{{ advertDetail.adSpaceName }}</span>
      </div>
      <div>
        <span>所在业务：</span><span>{{ advertDetail.business }}</span>
      </div>
      <div>
        <span>所在页面：</span><span>{{ advertDetail.onThePage }}</span>
      </div>
      <div>
        <span>有效日期：</span
        ><span>{{ advertDetail.startTime }}-{{ advertDetail.endTime }}</span>
      </div>
      <div>
        <span>支持类型：</span
        ><span>{{ advertDetail.supportType === 0 ? "图片" : "视频" }}</span>
      </div>
      <div>
        <span>最大数量：</span><span>{{ advertDetail.maximumNumber }}</span>
      </div>
      <div>
        <span>图片尺寸/视频大小：</span><span>{{ advertDetail.adSlotSize }}</span>
      </div>
      <div>
        <span>描述：</span><span>{{ advertDetail.description }}</span>
      </div>
      <!--      <div style="width: 100%" class="image"><span>用户头像：</span><span class="head-image"><img :src="advertDetail.headPic" alt="用户头像"></span></div>-->
    </div>
    <h3>广告详情</h3>
    <div class="detail mt20">
      <div>
        <span>广告标题：</span><span>{{ advertDetail.adHeadline }}</span>
      </div>
      <!-- <div>
        <span>链接地址：</span><span>{{ advertDetail.jumpPageUrl }}</span>
      </div> -->
      <div>
        <span>素材类型：</span
        ><span>{{ advertDetail.supportType === 0 ? "图片" : "视频" }}</span>
      </div>
      <div>
        <span>有效期间</span
        ><span>{{ advertDetail.startTime + "-" + advertDetail.endTime }}</span>
      </div>
      <div>
        <span>备注：</span><span>{{ advertDetail.remark }}</span>
      </div>
      <div>
        <span>状态:</span
        ><span>{{ advertDetail.useStatus === 0 ? "启用" : "禁用" }}</span>
      </div>
      <div>
        <span>创建时间:</span><span>{{ advertDetail.createTime }}</span>
      </div>
      <div>
        <span>广告位类型:</span>
        <span v-if="advertDetail.advertisingType === 0"> 开屏 </span>
        <span v-else-if="advertDetail.advertisingType === 1"> 轮播图 </span>
        <span v-else-if="advertDetail.advertisingType === 2"> 外链 </span>
      </div>
      <!--      <div style="width: 100%" class="image"><span>用户头像：</span><span class="head-image"><img :src="advertDetail.headPic" alt="用户头像"></span></div>-->
    </div>
    <h3>投放资源: {{ advertDetail.supportType === 0 ? "图片" : "视频" }}</h3>

    <div v-if="advertDetail.supportType === 0" class="image-class mt20">
      <div>
        <div class="image-flex1">
          <div
            class="image-flex"
            v-for="(item, index) in advertDetail.radResourceList"
            :key="index"
          >
            <div style="width: 100%; height: 150px; position: relative" class="mt10">
              <el-image
                :src="item.url"
                alt=""
                class="image1"
                :preview-src-list="[item.url]"
              ></el-image>
              <!-- <img :src="item.url" alt="" class="image1" /> -->
            </div>
            <div v-if="item.jumpPageType === 1">
              链接地址：{{ item.jumpAddress ? item.jumpAddress : "暂无信息" }}
            </div>
            <div v-else-if="item.jumpPageType === 0">
              <div>
                安卓地址：{{
                  item.androidJumpAddress ? item.androidJumpAddress : "暂无信息"
                }}
              </div>
              <div>
                IOS地址：{{ item.iosJumpAddress ? item.iosJumpAddress : "暂无信息" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="video-class" v-else>
      <div style="width: 300px; height: 200px">
        <el-image
          :src="advertDetail.radResourceList[0].videoCoverUrl"
          alt=""
          style="width: 100%; height: 150px; position: relative"
          class="mt10"
          :preview-src-list="[advertDetail.radResourceList[0].videoCoverUrl]"
        ></el-image>
      </div>
      <div style="margin-left: 30px">
        <video
          :src="advertDetail.radResourceList[0].url"
          class="avatar video-avatar"
          controls="controls"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import { adSchedulingSelectByNo } from "@/api/advert";
export default {
  name: "UserDetail",
  data() {
    return {
      advertDetail: {
        radResourceList: [
          {
            url: "",
            videoCoverUrl: "",
          },
        ],
      },
    };
  },
  methods: {
    getdata(row) {
      this.advertDetail = row;
    },
    getDetailData(adSlotCoding, advertisingNo) {
      let data = {
        adSlotCoding,
        advertisingNo,
      };
      adSchedulingSelectByNo(data).then((res) => {
        if (res.data.radResourceList.length === 0) {
          res.data.radResourceList.push({
            url: "",
            videoCoverUrl: "",
          });
        }
        this.advertDetail = res.data;
      });
    },
  },
};
</script>

<style scoped lang="less">
.image1 {
  max-width: none;
  max-height: 100%;
  width: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: 0;

  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  vertical-align: middle;
}

.detail {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.detail > div {
  width: 50%;
  margin-bottom: 25px;
}

.detail > div > span {
  display: inline-block;
  text-align: left;
}

.detail > div > span:nth-child(1) {
  color: #999;
  min-width: 120px;
  text-align: right;
}

.detail > div > span:nth-child(2) {
  margin-left: 15px;
}

.image {
  display: flex;
}

.image > span {
  display: block !important;
}

.image-class {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .image {
    margin-right: 20px;
  }
}

.head-image {
  width: 80px;
  height: 80px;
  /*border-radius: 80px;*/
  border: 1px solid #efefef;
}

.head-image img {
  width: 80px;
  height: 80px;
  /*border-radius: 80px;*/
  border: 1px solid #efefef;
}

.identity img {
  width: 200px;
  height: 100px;
  border: 1px solid #efefef;
  margin-right: 15px;
}

.avatar {
  width: 314px;
  height: 420px;
  display: block;
}

.video-avatar {
  width: 314px;
  height: 420px;
  border: 1px solid #efefef;
}

.image-flex1 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.image-flex {
  width: 300px;
  padding: 20px;
  margin-right: 20px;
  margin-top: 8px;

  > div:nth-child(1) {
    cursor: pointer;
    border: 1px solid #efefef;
    margin-bottom: 10px;
  }
}

.video-class {
  display: flex;
  align-items: center;
}

.image {
  max-width: none;
  max-height: 100%;
  width: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: 0;
  transform: translate(-50%, -50%);
  vertical-align: middle;
}
</style>
