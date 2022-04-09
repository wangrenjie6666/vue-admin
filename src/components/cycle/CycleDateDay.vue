<template>
  <div class="date-list">
    <div class="date" v-for="(item1,index1) in dateList" :key="index1">
      <div v-show="item1.type==1" class="date-type1" @click="changeDateType(index,index1,3)">
        <div><span>{{item1.day}}日：</span><span>空闲</span></div>
        <div><span>00:00</span>~<span>24:00</span></div>
      </div>
      <div v-show="item1.type==2" class="date-type2">
        <div><span>{{item1.day}}日：</span><span>已占用</span></div>
        <div><span>00:00</span>~<span>24:00</span></div>
      </div>
      <div v-show="item1.type==3" class="date-type3" @click="changeDateType(index,index1,1)">
        <div><span>{{item1.day}}日：</span><span>已选择</span></div>
        <div><span>00:00</span>~<span>24:00</span></div>
      </div>
      <div v-show="item1.type==4" class="date-type4">
        <div><span>{{item1.day}}日：</span><span>已失效</span></div>
        <div><span>00:00</span>~<span>24:00</span></div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "CycleDate",
      props:{
        dateList:{
          default:[],
        },
        index:{

        }
      },
      methods:{
        changeDateType(index,index1,type){
          let data={
            index,
            index1,
            type
          }
          this.$emit('changeDateType',data)
        }
      }
    }
</script>
<style scoped>
  .date-list {
    display: flex;
    flex-wrap: wrap;
    /*max-width: 1000px;*/
  }
  .date {
    width: 160px;
    height: 43px;
    text-align: center;
    color: #fff;
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
  }

  .date-type1 {
    background: #F0F2F5;
    color: #666;
  }

  .date-type2 {
    background: #FFA816;
    color: #fff;
  }

  .date-type3 {
    background: #FFFFFF;
    border: 1px solid #0290FF;
    color: #0290FF;
  }
  .date-type4 {
    background: #F56C6C;
  }
</style>
