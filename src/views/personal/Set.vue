<template>
  <div class="main-layout">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item :to="{ path: $indexurl }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>密码设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
    <div class="title">密码设置：</div>
    <el-form label-width="100px" ref="editForm" :model="editForm" :rules="rules"  style="width: 600px">
      <el-form-item label="密码:" prop="password">
        <el-input size="small" v-model="editForm.password" auto-complete="off" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="newpassword">
        <el-input size="small" v-model="editForm.newpassword" auto-complete="off" type="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码:" prop="renewpassword">
        <el-input size="small" v-model="editForm.renewpassword" type="password" placeholder="请输入重复新密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="submitForm('editForm')" :loading="logining">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
    import {loginout,updatePassword } from '@/api/userMG'
    export default {
        name: "set",
        data(){
            return {
              logining:false,
              editForm:{
                password:'',
                newpassword:'',
                renewpassword:'',
              },
              rules: {
                password: [{
                  required: true,
                  message: '请输入密码',
                  trigger: 'blur'
                }],
                newpassword: [{
                  required: true,
                  message: '请输入新密码',
                  trigger: 'blur'
                }],
                renewpassword: [{
                  required: true,
                  message: '请重复输入新密码',
                  trigger: 'blur'
                }],
              },
            }
        },
      methods:{
        submitForm(formName){
          this.$refs[formName].validate(valid => {
            if (valid) {

              if(this.editForm.newpassword != this.editForm.renewpassword){
                  this.$message.error('新密码必须要与重复新密码一致')
                  return;
              }
              this.logining=true;
              let data = {
                password: this.editForm.password,
                newPassword: this.editForm.newpassword,
              }
              updatePassword(data).then(res => {
                this.$message.success('修改成功！');
                //缓存token
                this.logining = false;
                setTimeout(()=>{
                  loginout()
                    .then(res => {
                      this.$store.commit('logout', 'false')
                      this.$router.push({ path: '/login' })
                    }).catch(res=>{
                      this.$message.error('退出登录失败')
                  })
                },2000)
              }).catch(res => {
                this.logining = false
                return false;
              })
            }else{
              this.$message.error('请输入所有密码！')
            }
          })
        }
      }
    }
</script>

<style scoped>
  .title{
    font-weight: bold;
    font-size: 22px;
    margin: 25px 0;
  }
</style>
