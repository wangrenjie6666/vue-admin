<template>
    <div class="main">
        <div class="left">
            <AdvertReport/>
        </div>
        <div class="right">
            <VisitRecord />
        </div>
    </div>
</template>

<script>
    import VisitRecord from "../../components/index/VisitRecord";
    import AdvertReport from "../../components/index/AdvertReport";
    export default {
        name: "Index",
        components:{
            VisitRecord,
            AdvertReport
        }
    }
</script>

<style scoped lang="less">
.main{
    width: 100%;
    /*background-color:#fff!important;*/
    height: 100%;
    display: flex;
    justify-content:space-between;
    .left{
        width: 73%;
        height: 100%;
    }
    .right{
        min-height: 100%;
        overflow: auto;
        width: 26%;
        background: #fff;
    }
}
</style>