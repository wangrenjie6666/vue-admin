<template>
  <div class="jc-component__range">
    <div class="jc-range" :class="rangeStatus ? 'success' : ''">
      <div class="jc-range-cover" :style="{ width: jcRangeCoverWidth + 'px' }"></div>
      <i @mousedown="rangeMove" :class="startIcon"></i>
      <div style="z-index: 1998">
        <div v-if="rangeStatus">{{ successText }}</div>
        <div style="color: #c0c4cc" v-else>{{ startText }}</div>
        <!--                {{rangeStatus?successText:startText}}-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 成功之后的函数
    successFun: {
      type: Function,
    },
    //成功图标
    successIcon: {
      type: String,
      default: "el-icon-success",
    },
    //成功文字
    successText: {
      type: String,
      default: "验证成功",
    },
    //开始的图标
    startIcon: {
      type: String,
      default: "el-icon-d-arrow-right",
    },
    //开始的文字
    startText: {
      type: String,
      default: "请按滑块滑动进行验证",
    },
    //失败之后的函数
    errorFun: {
      type: Function,
    },
    //或者用值来进行监听
    status: {
      type: String,
    },
  },
  name: "Silder",
  data() {
    return {
      rangeStatus: "",
      jcRangeCoverWidth: 0,
    };
  },
  methods: {
    rangeMove(e) {
      let ele = e.target;
      let startX = e.clientX;
      let eleWidth = ele.offsetWidth;
      let parentWidth = ele.parentElement.offsetWidth;
      let MaxX = parentWidth - eleWidth;
      if (this.rangeStatus) {
        //不运行
        return false;
      }
      document.onmousemove = (e) => {
        let endX = e.clientX;
        this.disX = endX - startX;
        if (this.disX <= 0) {
          this.disX = 0;
        }
        if (this.disX >= MaxX - eleWidth) {
          //减去滑块的宽度,体验效果更好
          this.disX = MaxX;
        }
        ele.style.transition = ".1s all";
        ele.style.transform = "translateX(" + this.disX + "px)";
        e.preventDefault();
        this.jcRangeCoverWidth = this.disX;
      };
      document.onmouseup = () => {
        if (this.disX !== MaxX) {
          this.jcRangeCoverWidth = 0;
          ele.style.transition = ".5s all";
          ele.style.transform = "translateX(0)";
          //执行成功的函数
          this.errorFun && this.errorFun();
        } else {
          this.rangeStatus = true;
          if (this.status) {
            this.$parent[this.status] = true;
          }
          //执行成功的函数
          this.successFun && this.successFun();
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
};
</script>
<style scoped lang="less">
.jc-range {
  background-color: #f0f2f5;
  position: relative;
  font-size: 16px;
  transition: 1s all;
  user-select: none;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 54px;

  /*no*/
  .jc-range-cover {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    width: 0;
    z-index: 1000;
    background: #409eff;
  }
}

.jc-range i {
  position: absolute;
  left: 0;
  width: 60px;
  /*no*/
  font-size: 20px;
  font-weight: bold;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  color: #409eff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1999;
}

.jc-range.success {
  /*background-color: #409EFF;*/
  /*color: #fff;*/
}

.jc-range.success i {
  color: #409eff;
}
</style>
