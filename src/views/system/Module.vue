/** * 系统管理 菜单管理 */
<template>
    <div class="main-layout">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
            <el-breadcrumb-item>主菜单</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 主体内容 -->
        <div class="pd3732 bgfff">
            <el-row>
                <!-- title -->
                <div class="modt-box bgfff">菜单管理</div>
                <el-col :span="4"> </el-col>
                <el-col :span="6">
                    <div class="mod-btnbox">
                        <el-button size="small" type="primary" @click="openModule()">菜单展开</el-button>
                        <!--          <el-button size="small" type="primary" @click="compressModule()">全部压缩</el-button>-->
                    </div>
                    <!-- <el-tree class="treeclass" ref="tree" :data="treeData" default-expand-all="" :props="defaultProps" @node-click="nodeclick" @check-change="handleClick" check-strictly node-key="id" show-checkbox></el-tree> -->
                    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" class="treeclass"
                        :default-expanded-keys="openList" node-key="id"></el-tree>

                </el-col>
                <el-col :span="18">
                    <div class="mod-btnbox">
                        <el-button size="small" type="primary" icon="el-icon-plus" @click="addModule">添加</el-button>
                    </div>
                    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                        <el-form-item label="菜单名称" prop="moduleName">
                            <el-input size="small" v-model="form.moduleName"></el-input>
                        </el-form-item>
                        <el-form-item label="父级菜单" prop="parentId">
                            <el-select size="small" v-model="form.parentId" placeholder="请选择" class="selectw">
                                <el-option v-for="parm in fmenu" :key="parm.id" :label="parm.name+' ('+parm.mark+')'"
                                    :value="parm.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="菜单KEY" prop="moduleKey">
                            <el-input size="small" v-model="form.moduleKey"></el-input>
                        </el-form-item>
                        <el-form-item label="图标" prop="moduleIcon">
                            <el-select size="small" v-model="form.moduleIcon" placeholder="请选择" class="selectw">
                                <el-option v-for="(item,index) in iconList" :key="index" :label="item.icon"
                                    :value="item.icon"><i :class="item.icon"></i> <span>{{item.icon}}</span></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="URL" prop="moduleUrl">
                            <el-input size="small" v-model="form.moduleUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序" prop="moduleOrder">
                            <el-input size="small" v-model="form.moduleOrder"></el-input>
                        </el-form-item>
                        <el-form-item label="是否菜单" prop="isModule">
                            <el-radio-group v-model="form.isModule">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="2">不是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="saveModule('form')">保存</el-button>
                            <el-button size="small" type="primary" v-show="showdelete" @click="deleteModule">删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        ModuleList,
        ModuleNodes,
        // ModuleSave,
        ModuleDelete,
        ModuleEdit,
        ModuleAdd,
    } from "../../api/userMG";
    export default {
        data() {
            return {
                showdelete: false,
                treeData: [],
                iconList: this.$common.getIconData(),
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                openList: [],
                form: {
                    addUser: "",
                    editUser: "",
                    addTime: "",
                    editTime: "",
                    moduleId: "",
                    parentId: "",
                    moduleLevel: "",
                    systemNo: "",
                    isLeaf: "",
                    fullIndex: "",
                    moduleIcon: "",
                    moduleOrder: "",
                    moduleName: "",
                    moduleNotes: "",
                    moduleUrl: "",
                    moduleKey: '',
                    isModule: 2,
                },
                // rules表单验证
                rules: {
                    parentId: [{
                        required: true,
                        message: "请选择父级菜单",
                        trigger: "blur",
                    }, ],
                    moduleName: [{
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "blur",
                    }, ],
                    moduleIcon: [{
                        required: true,
                        message: "请输入菜单图标",
                        trigger: "blur",
                    }, ],
                    moduleUrl: [{
                        required: true,
                        message: "请输入URL",
                        trigger: "blur",
                    }, ],
                    moduleOrder: [{
                        required: true,
                        message: "请输入菜单顺序",
                        trigger: "blur",
                    }, ],
                    isModule: [{
                        required: true,
                        message: "请选择正确的选项",
                        trigger: "change",
                    }, ],
                    moduleKey: [{
                        required: true,
                        message: "请输入菜单唯一标志KEY",
                        trigger: "blur",
                    }, ],
                },
                fmenu: [],
            };
        },
        /**
         * 创建完毕
         */

        created() {
            this.getdata();
            this.getmenu();

        },

        /**
         * 里面的方法只有被调用才会执行
         */
        methods: {
            //获取点击列表的数据
            handleNodeClick(data) {
                if (data.id == 1) {
                    this.addModule();
                    return;
                }

                this.showdelete = true;
                this.form.moduleName = data.name;
                this.form.moduleOrder = data.sort;
                this.form.moduleUrl = data.resUrl;
                this.form.moduleKey = data.mark;
                this.form.isModule = data.type;
                this.form.moduleIcon = data.icons;
                this.form.parentId = data.parentId;
                this.form.moduleId = data.id;
            },
            // 获取数据
            getdata() {
                ModuleList()
                    .then(res => {
                        this.treeData = res.data;
                    })
                    .catch(err => {
                        this.loading = false
                        this.$message.error('菜单管理列表失败，请稍后再试！')
                    })
            },
            // 添加
            addModule() {
                this.showdelete = false;
                this.form.addUser = "";
                this.form.editUser = "";
                this.form.addTime = "";
                this.form.editTime = "";
                this.form.moduleId = "";
                this.form.parentId = "";
                this.form.moduleLevel = "";
                this.form.systemNo = "";
                this.form.isLeaf = "";
                this.form.fullIndex = "";
                this.form.moduleIcon = "";
                this.form.moduleOrder = "";
                this.form.moduleName = "";
                this.form.moduleNotes = "";
                this.form.moduleUrl = "";
                this.form.moduleKey = "";
                this.form.isModule = 2;

            },
            // 获取父级菜单
            getmenu() {
                ModuleNodes().then((res) => {
                        this.fmenu = res.data;
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error("父级菜单列表获取失败，请稍后再试！");
                    });
            },
            // 复选变单选
            handleClick(data, checked, node) {
                if (checked) {
                    this.$refs.tree.setCheckedNodes([]);
                    this.$refs.tree.setCheckedNodes([data]);
                    this.showdelete = true;
                } else {}
            },
            // 点击节点
            nodeclick(arr, node, self) {
                ModuleGet(arr.id)
                    .then((res) => {
                        this.form = res.data.data;
                        this.$refs.tree.setCheckedNodes([]);
                        this.$refs.tree.setCheckedNodes([arr]);
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error("用户管理获取失败，请稍后再试！");
                    });
            },
            // 保存菜单
            saveModule(editData) {
                this.$refs[editData].validate((valid) => {
                    if (valid) {
                        let data = {
                            name: this.form.moduleName,
                            resUrl: this.form.moduleUrl,
                            mark: this.form.moduleKey,
                            type: this.form.isModule,
                            parentId: this.form.parentId,
                            sort: this.form.moduleOrder,
                            icons: this.form.moduleIcon,
                        }
                        if (this.form.moduleId != '') {
                            data.id = this.form.moduleId;
                            ModuleEdit(data)
                                .then((res) => {
                                    this.$message.success('菜单编辑成功');
                                    location.reload();
                                })
                                .catch((err) => {
                                    this.$message.error("菜单管理列表保存失败，请稍后再试！");
                                });

                        } else {
                            ModuleAdd(data)
                                .then((res) => {
                                    this.$message.success('菜单添加成功');
                                    location.reload();
                                })
                                .catch((err) => {
                                    this.$message.error("菜单管理列表保存失败，请稍后再试！");
                                });
                        }

                    } else {
                        return false;
                    }
                });
            },
            openModule() {
                this.openList = [1, 2, 3, 4, 5, 6, 7];
            },
            compressModule() {
                this.openList = [];
            },

            // 删除菜单
            deleteModule() {
                ModuleDelete({
                        id: this.form.moduleId
                    })
                    .then((res) => {
                        // this.getdata();
                        // this.getmenu();
                        this.$message.success("菜单管理列表删除成功！");
                        location.reload();
                    })
            },
        },
    };
</script>

<style>
    .user-search {
        margin-top: 20px !important;
    }

    .user-search td {
        margin-top: 20px !important;
    }

    .userRole {
        width: 100%;
    }

    .el-table__expanded-cell {
        padding: 0px !important;
        margin: 0px !important;
    }

    .modt-box {
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: #f0f2f5;
        text-align: center;
        color: #334157;
        margin-bottom: 20px;
        font-size: 24px;
    }

    .mod-btnbox {
        margin-bottom: 20px;
    }

    .treeclass {
        border: 1px solid #f3f3f3;
        padding-top: 20px;
        padding-bottom: 20px;
        padding: 20px;
    }

    .selectw {
        width: 100%;
    }
</style>