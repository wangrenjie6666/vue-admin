<template>
  <div class="main">
    <div class="title">欢迎登录诚聊帮广告系统</div>
    <div class="login-type">
      <!--                    <div class="note" :class="{active:active==1}" @click="active=1"><span>短信</span><span>登录</span></div>-->
      <div class="password" :class="{ active: active == 2 }" @click="active = 2">
        <span>密码</span><span>登录</span>
      </div>
    </div>
    <el-form
      label-position="left"
      :model="userForm"
      :rules="active == 1 ? noteRules : passwordRules"
      ref="userForm"
      label-width="0px"
      class="demo-userForm login-container"
    >
      <div v-show="active == 1">
        <el-form-item prop="phone" class="mb32">
          <el-input
            class="user-input"
            type="text"
            v-model="userForm.phone"
            auto-complete="off"
            placeholder="请输入你的手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="note" class="mb32 get-code-btn-f">
          <div class="get-code-btn">获取验证码</div>
          <el-input
            class="user-input"
            type="password"
            v-model="userForm.note"
            auto-complete="off"
            placeholder="请输入你的验证码"
            @keyup.enter.native="submitForm(active)"
          ></el-input>
        </el-form-item>
      </div>
      <div v-show="active == 2">
        <el-form-item prop="account" class="mb32">
          <el-input
            class="user-input"
            type="text"
            v-model="userForm.account"
            auto-complete="off"
            placeholder="请输入您的手机号/账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="get-code-btn-f" style="margin-bottom: 0px">
          <div class="password-eye">
            <i class="password-eye"> </i>
          </div>
          <el-input
            class="user-input"
            type="password"
            v-model="userForm.password"
            auto-complete="off"
            placeholder="请输入您的密码"
            @keyup.enter.native="submitForm(active)"
          ></el-input>
        </el-form-item>
        <div class="lost-text" @click="goLostPassword">忘记密码?</div>
      </div>
      <SlideBar class="mb60" :success-fun="successFun" />
      <el-form-item class="mb20" style="width: 100%">
        <el-button
          class="user-button"
          type="primary"
          style="width: 100%"
          @click="submitForm(active)"
          :loading="logining"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <!--        <div class="register-text"><span>还没账号？</span><span @click="goRegister()">立即注册</span></div>-->
  </div>
</template>

<script>
import SlideBar from "../../components/silde_bar/SlideBar";
import { login, getVerificationCode } from "@/api/userMG";
export default {
  name: "Login",
  components: {
    SlideBar,
  },
  data() {
    return {
      active: 2,
      logining: false,
      provingResult: false,
      userForm: {
        account: "",
        phone: "",
        password: "",
        note: "",
      },
      passwordRules: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
      noteRules: {
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
        ],
        note: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(active) {
      if (this.logining) return;
      if (!this.provingResult) {
        this.$message.error("请滑动滚动条进行验证");
        return;
      }
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.logining = true;
          let data = {};
          data.username = active == 1 ? this.userForm.phone : this.userForm.account;
          data.password = active == 1 ? this.userForm.note : this.userForm.password;
          login(data)
            .then((res) => {
              this.$message.success("登录成功！");
              //缓存token
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("userdata", JSON.stringify(res.data.user));
              this.$store.commit("login", "true");
              setTimeout(() => {
                this.logining = false;
                this.$router.push({
                  path: this.$indexurl,
                });
              }, 1000);
            })
            .catch((res) => {
              this.logining = false;
            });
        } else {
          this.logining = false;
          return false;
        }
      });
    },
    goRegister() {
      this.$router.push({
        path: "/register",
      });
    },
    goLostPassword() {
      this.$router.push({
        path: "/lostpassword",
      });
    },
    successFun() {
      this.provingResult = true;
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

    .active {
      color: #000000;
      font-weight: bold;

      span:nth-child(1) {
        border-bottom: 2px solid #0290ff;
        opacity: 1;
      }
    }

    .password,
    .note {
      cursor: pointer;
      display: flex;

      span {
        display: block;
        padding-bottom: 5px;
      }
    }

    .password {
      /*margin-left: 46px;*/
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

  .lost-text {
    padding: 15px 0;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.85);
    text-align: right;
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
