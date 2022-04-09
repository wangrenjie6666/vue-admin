<template>
  <div class="stock">
    <div class="title">广告库</div>
    <div class="video">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          <div class="swiper-slide">Slide 4</div>
          <div class="swiper-slide">Slide 5</div>
          <div class="swiper-slide">Slide 6</div>
          <div class="swiper-slide">Slide 7</div>
          <div class="swiper-slide">Slide 8</div>
          <div class="swiper-slide">Slide 9</div>
          <div class="swiper-slide">Slide 10</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  name: "Stock",
  data() {
    return {
      swiperOption: {
        loop: false,
        loopFillGroupWithBlank: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  mounted() {
    // new Swiper ('.swiper-container', {
    //     slidesPerView: 4,
    //     paginationClickable: true,
    //     spaceBetween: 30
    // })
  },
};
</script>

<style scoped lang="less">
.stock {
  padding: 20px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.video {
  margin-bottom: 20px;
}
.swiper-container {
  width: 100%;
  height: 210px;
  margin: 0px auto;
}
.swiper-wrapper {
  cursor: pointer;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  width: 60%;
  border: 1px solid black;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.swiper-slide:nth-child(2n) {
  width: 40%;
}
.swiper-slide:nth-child(3n) {
  width: 20%;
}
</style>
<!--<template>-->
<!--    <div class="about">-->
<!--        <div class="swiper-container">-->
<!--            <div class="swiper-wrapper">-->
<!--                <div class="swiper-slide" >Slide 1</div>-->
<!--                <div class="swiper-slide">Slide 2</div>-->
<!--                <div class="swiper-slide">Slide 3</div>-->
<!--                <div class="swiper-slide">Slide 4</div>-->
<!--                <div class="swiper-slide">Slide 5</div>-->
<!--                <div class="swiper-slide">Slide 6</div>-->
<!--                <div class="swiper-slide">Slide 7</div>-->
<!--                <div class="swiper-slide">Slide 8</div>-->
<!--                <div class="swiper-slide">Slide 9</div>-->
<!--                <div class="swiper-slide">Slide 10</div>-->
<!--            </div>-->
<!--            &lt;!&ndash; Add Pagination &ndash;&gt;-->
<!--&lt;!&ndash;            <div class="swiper-pagination"></div>&ndash;&gt;-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--    import Swiper from 'swiper'-->
<!--    export default {-->
<!--        name:'About',-->
<!--        data(){-->
<!--            return {-->
<!--            }-->
<!--        },-->
<!--        mounted() {-->
<!--            new Swiper ('.swiper-container', {-->
<!--                // loop: true,-->
<!--                // // 如果需要分页器-->
<!--                // pagination: '.swiper-pagination',-->
<!--                // // 如果需要前进后退按钮-->
<!--                // nextButton: '.swiper-button-next',-->
<!--                // prevButton: '.swiper-button-prev',-->
<!--                // 如果需要滚动条-->
<!--                // scrollbar: '.swiper-scrollbar',-->
<!--                //如果需要自动切换海报-->
<!--                // autoplay: {-->
<!--                //   delay: 1000,//时间 毫秒-->
<!--                //   disableOnInteraction: false,//用户操作之后是否停止自动轮播默认true-->
<!--                // },-->
<!--                // pagination: '.swiper-pagination',-->
<!--                slidesPerView: 4,-->
<!--                // centeredSlides: true,-->
<!--                paginationClickable: true,-->
<!--                spaceBetween: 30-->
<!--            })-->
<!--        }-->
<!--    }-->
<!--</script>-->

<!--<style lang="less" scoped>-->
<!--    /*.swiper-container{*/-->
<!--    /*    height: 500px;*/-->
<!--    /*    width: 100%;*/-->
<!--    /*    .swiper-wrapper{*/-->
<!--    /*        .swiper-slide{*/-->
<!--    /*            width: 100%;*/-->
<!--    /*            height: 100%;*/-->
<!--    /*            background-color: #42b983;*/-->
<!--    /*            text-align: center;*/-->
<!--    /*            line-height: 500px;*/-->
<!--    /*        }*/-->
<!--    /*    }*/-->
<!--    /*}*/-->
<!--    .swiper-container {-->
<!--        width: 100%;-->
<!--        height: 210px;-->
<!--        margin: 20px auto;-->
<!--    }-->
<!--    .swiper-wrapper{-->
<!--        cursor: pointer;-->
<!--    }-->
<!--    .swiper-slide {-->
<!--        text-align: center;-->
<!--        font-size: 18px;-->
<!--        background: #fff;-->
<!--        width: 60%;-->
<!--        border: 1px solid black;-->

<!--        /* Center slide text vertically */-->
<!--        display: -webkit-box;-->
<!--        display: -ms-flexbox;-->
<!--        display: -webkit-flex;-->
<!--        display: flex;-->
<!--        -webkit-box-pack: center;-->
<!--        -ms-flex-pack: center;-->
<!--        -webkit-justify-content: center;-->
<!--        justify-content: center;-->
<!--        -webkit-box-align: center;-->
<!--        -ms-flex-align: center;-->
<!--        -webkit-align-items: center;-->
<!--        align-items: center;-->
<!--    }-->
<!--    .swiper-slide:nth-child(2n) {-->
<!--        width: 40%;-->
<!--    }-->
<!--    .swiper-slide:nth-child(3n) {-->
<!--        width: 20%;-->
<!--    }-->
<!--</style>-->
