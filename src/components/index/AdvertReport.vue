<template>
    <div class="report">
        <div class="times">
            <div>
                <div><i class="iconfont icon-tf"></i></div>
                <div>广告投放次数</div>
                <div>862</div>
            </div>
            <div>
                <div><i class="iconfont icon-a-zu1127"></i></div>
                <div>广告点赞次数</div>
                <div>862</div>
            </div>
            <div>
                <div><i class="iconfont icon-pf"></i></div>
                <div>广告评分次数</div>
                <div>862</div>
            </div>
            <div>
                <div><i class="iconfont icon-pm"></i></div>
                <div>广告播放排名</div>
                <div>862</div>
            </div>
        </div>
        <div class="advert-chart">
            <AdvertChart/>
        </div>
        <div class="stock">
            <Stock />
        </div>
    </div>
</template>

<script>
    import AdvertChart from "./AdvertChart";
    import Stock from "./Stock";
    export default {
        name: "AdvertReport",
        components:{
            AdvertChart,
            Stock
        }
    }
</script>

<style scoped lang="less">
  .report{
      .times{
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          >div{
              font-size: 20px;
              /*font-weight: bold;*/
              color: #333;
              padding: 18px;
              background: #fff;
              width: 24%;
              >div{
                  display: flex;
                  margin-bottom: 10px;
                  justify-content: center;
              }
          }
      }

  }
.icon-a-zu1127,.icon-tf,.icon-pf,.icon-pm{
    font-size: 54px!important;
    font-weight: normal!important;
}
  .icon-tf{
      color: #32BB71;
  }
  .icon-a-zu1127{
      color: #0290FF;
  }
  .icon-pf{
      color: #FFA816;
  }
  .icon-pm{
      color: #FF5F74;
  }
  .advert-chart{
    background: #fff;
    padding: 20px;
    height: 400px;
    margin-bottom: 24px;
    overflow: auto;
  }
  .stock{
      background: #fff;
  }

</style>