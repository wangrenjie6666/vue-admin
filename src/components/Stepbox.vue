<template>
  <el-steps :space="500" :active="active" simple class="progress-bar">
    <el-step title="选择上传投放的广告" icon="el-icon-edit"></el-step>
    <el-step title="选择投放的设备" icon="el-icon-upload"></el-step>
    <el-step title="填写投放时间" icon="el-icon-upload"></el-step>
    <el-step title="确认投放信息" icon="el-icon-picture"></el-step>
  </el-steps>
</template>

<script>
    export default {
        name: "Stepbox",
        data(){
            return {

            }
        },
        props:{
          active:{
              type:Number,
              default:0,
          },
        }
    }
</script>

<style scoped>

</style>
