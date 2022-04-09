<template>
  <div class="login-page">
    <div class="base-user-shape">
      <div class="left">
        <img src="../assets/img/bg.png" alt="" />
      </div>
      <div class="right">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
.login-page {
  background: #f0f2f5;
  width: 100%;
  min-height: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
