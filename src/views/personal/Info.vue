<template>
  <div class="main-layout">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item :to="{ path: $indexurl }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
    <div class="title">个人中心</div>
    <div class="mg">
      <div class="">
        <span class="c999999">用户id:</span><span class="ml5">{{userdata.id}}</span>
      </div>
      <div class="mt20">
        <span class="c999999">用户姓名:</span><span class="ml5">{{userdata.username}}</span>
      </div>
      <div class="mt20">
        <span class="c999999">管理员权限:</span><span class="ml5">{{userdata.roleName}}</span>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import {usersDetail} from '@/api/userMG'
    export default {
        name: "info",
        data(){
          return{
              userdata:{

              }
          }
        },
      created(){
          let id=JSON.parse(localStorage.getItem('userdata')).id;
          this.getdata(id);
      },
      methods:{
          getdata(id){
            let data={
                id,
            }
            usersDetail(data).then(res=>{
                this.userdata=res.data;
                console.log(this.userdata);
            })
          }
        }
    }
</script>

<style scoped>
  .title{
    font-size: 22px;
    font-weight: bold;
    margin: 25px 0;
  }
  .mg{
    /*padding: 40px;*/
    /*border: 1px solid #efefef;*/
    width: 500px;
  }
  .c999999{
    color: #999;
  }
  .ml5{
    margin-left: 5px;
  }
</style>
