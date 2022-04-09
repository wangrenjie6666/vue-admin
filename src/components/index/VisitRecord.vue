<template>
    <div class="visit">
        <div class="title">今日访问记录</div>
        <div class="info" v-for="(item,index) in 6" :key="index">
            <div class="head-name"><div class="img"><img src="../../assets/img/header_img.png" alt=""/></div><div class="name">家一广告文化有限公司</div></div>
            <div class="time">2021.21.21</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "VisitRecord"
    }
</script>

<style lang="less" scoped>
    .visit{
        padding:20px;
        .title {
            font-size: 20px;
            color: #333;
            font-weight: bold;
            margin-bottom: 40px;
        }
        .info{
            height: 42px;
            align-items: center;
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            .head-name{
                display: flex;
                height: 100%;
                align-items: center;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                .img{
                    height: 100%;
                    width: 42px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .name{
                    margin-left: 10px;
                }
            }
            .time{
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65)
         }
        }

    }
</style>