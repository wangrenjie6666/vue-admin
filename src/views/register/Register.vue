<template>
  <div class="main">
    <div class="title">欢迎登录诚聊帮广告系统</div>
    <div class="login-type">
      <div class="register"><span>账号</span><span>注册</span></div>
    </div>
    <el-form
      label-position="left"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <el-form-item prop="username" class="mb32">
        <el-input
          class="user-input"
          type="text"
          v-model="ruleForm.username"
          auto-complete="off"
          placeholder="请输入你的手机号"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="mb32 get-code-btn-f">
        <div class="get-code-btn">获取验证码</div>
        <el-input
          class="user-input"
          type="password"
          v-model="ruleForm.password"
          auto-complete="off"
          placeholder="请输入你的验证码"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" class="get-code-btn-f" style="margin-bottom: 0px">
        <div class="password-eye">
          <i class="password-eye"> </i>
        </div>
        <el-input
          class="user-input"
          type="password"
          v-model="ruleForm.password"
          auto-complete="off"
          placeholder="设置密码6-16位字符，包含字母和数字"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
        <div class="policy">
          <div>
            <el-checkbox class="user-checkbox" v-model="checked"></el-checkbox>
          </div>
          <div class="policy-text">
            <span>我已阅读并同意</span><span class="service">服务协议</span><span>和</span
            ><span class="privacy">隐私协议</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="mb20" style="width: 100%">
        <el-button
          class="user-button"
          type="primary"
          style="width: 100%"
          @click="submitForm('ruleForm')"
          :loading="logining"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
    <div class="register-text">
      <span>已有账号？</span><span @click="goLogin">立即登录</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  components: {},
  data() {
    return {
      active: 1,
      logining: false,
      ruleForm: {},
      rules: {},
    };
  },
  methods: {
    submitForm() {},
    goLogin() {
      this.$router.push({
        path: "/user/login",
      });
    },
  },
};
</script>

<style scoped lang="less">
.main {
  width: 368px;
  margin-left: 130px;

  .title {
    margin-top: 80px;
    font-size: 24px;
    color: #000;
    font-weight: bold;
    line-height: 33px;
  }

  .login-type {
    display: flex;
    font-size: 16px;
    margin-top: 40px;
    color: rgba(0, 0, 0, 0.45);

    .register {
      color: #000000;
      font-weight: bold;

      span:nth-child(1) {
        border-bottom: 2px solid #0290ff;
        opacity: 1;
      }

      cursor: pointer;
      display: flex;

      span {
        display: block;
        padding-bottom: 5px;
      }
    }
  }

  .login-container {
    margin-top: 40px;
  }

  .get-code-btn-f {
    position: relative;

    .get-code-btn {
      position: absolute;
      right: 0;
      color: #409eff;
      z-index: 100;
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      font-weight: bold;
    }
  }

  .policy {
    margin-top: 5px;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.85);
    text-align: left;
    display: flex;
    margin-bottom: 20px;

    .policy-text {
      margin-left: 10px;

      .service,
      .privacy {
        color: #409eff;
        font-weight: bold;
      }
    }
  }

  .register-text {
    text-align: center;

    span:nth-child(2) {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
