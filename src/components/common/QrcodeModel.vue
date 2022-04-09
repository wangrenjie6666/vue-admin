<template>
  <div >
    <h1 style="margin: 10px 0">二维码：</h1>
    <div>
      <vue-qr :text="qrcontent" :size="200" class="mg-qrImg"></vue-qr>
    </div>

  </div>
</template>

<script>
  import vueQr from 'vue-qr'
  export default {
        name: "QrcodeModel",
        data(){
          return {
            qrcodeHtml:'',
            imageUrl:''
          }
        },
        props:{
          qrcontent:{
            type:String,
            default:'www.baidu.com',
          }
        },
        methods:{

        },
        components:{
          vueQr,
        }

    }
</script>
<style scoped>
.mg-qrImg{
  border: 1px solid #efefef;
}
</style>
