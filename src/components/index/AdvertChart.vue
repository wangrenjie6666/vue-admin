<template>
    <div class="chart" style="width: 100%;height: 100%">
        <div ref="chart" style="width: 100%;height: 100%">
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdvertChart",
        data(){
          return{
              data:{
                  color: ['#80FFA5',],
                  title: {
                      text: '投放量'
                  },
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'cross',
                          label: {
                              backgroundColor: '#6a7985'
                          }
                      }
                  },
                  grid: {
                      left: '1%',
                      right: '2%',
                      bottom: '1%',
                      containLabel: true
                  },
                  xAxis: [
                      {
                          type: 'category',
                          boundaryGap: false,
                          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
                      }
                  ],
                  yAxis: [
                      {
                          type: 'value'
                      }
                  ],
                  series: [
                      {
                          name: 'Line 2',
                          type: 'line',
                          stack: '总量',
                          smooth: true,
                          lineStyle: {
                              width: 0
                          },
                          showSymbol: false,
                          areaStyle: {
                              opacity: 0.8,
                              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                  offset: 0,
                                  color: 'rgba(0, 221, 255)'
                              }, {
                                  offset: 1,
                                  color: 'rgba(77, 119, 255)'
                              }])
                          },
                          emphasis: {
                              focus: 'series'
                          },
                          data: [120, 282, 111, 234, 220, 340, 528,123,156,452,456,123]
                      },
                  ]
              }
          }
        },
        mounted(){
            let myChart = this.$echarts.init(this.$refs.chart);
            myChart.setOption(this.data)

        }
    }
</script>

<style scoped>

</style>