/** * 系统管理 角色管理 */
<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>主菜单</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="搜索：">
          <el-input
            size="small"
            v-model="formInline.roleName"
            placeholder="输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
          <el-button
            class="reload-add-btn"
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="resetRefresh()"
            >重置</el-button
          >
          <el-button
            class="reload-add-btn"
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="handleEdit()"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        size="small"
        class="mb20"
        :data="listData"
        stripe
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column sortable prop="roleId" label="角色id"> </el-table-column>
        <el-table-column sortable prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column sortable prop="roleNo" label="角色描述"> </el-table-column>
        <el-table-column sortable prop="createTime" label="添加时间"> </el-table-column>
        <el-table-column sortable prop="updateTime" label="修改时间"> </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              class="mini-blue-btn"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              class="mini-red-btn"
              size="mini"
              type="danger"
              @click="deleteUser(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              class="mini-green-btn"
              size="mini"
              type="success"
              @click="menuAccess(scope.$index, scope.row)"
              >菜单权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="30%" @click="closeDialog('edit')">
        <div class="edit-title">{{ title }}</div>
        <el-form label-width="120px" :model="editForm" ref="editForm" :rules="rules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              size="small"
              v-model="editForm.roleName"
              auto-complete="off"
              placeholder="请输入角色名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleNo">
            <el-input
              size="small"
              v-model="editForm.roleNo"
              auto-complete="off"
              placeholder="请输入角色描述"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('edit')">取消</el-button>
          <el-button
            size="small"
            type="primary"
            :loading="loading"
            class="title"
            @click="submitForm('editForm')"
            >保存
          </el-button>
        </div>
      </el-dialog>
      <!-- 菜单权限 -->
      <el-dialog
        title="菜单权限"
        :visible.sync="menuAccessshow"
        width="30%"
        @click="closeDialog('perm')"
      >
        <el-tree
          :data="treeData"
          :show-checkbox="true"
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="checkedKeysData"
          :props="defaultProps"
          :check-strictly="true"
          ref="tree"
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('perm')">取消</el-button>
          <el-button
            size="small"
            type="primary"
            :loading="loading"
            class="title"
            @click="menuPermSave"
            >保存
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  roleList,
  roleDelete,
  roleInsert,
  roleUpdate,
  roleResources,
  ModuleList,
  getCheckedKeysData,
} from "../../api/userMG";

export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      menuAccessshow: false, //控制数据权限显示与隐藏
      treeData: [],
      checkedKeysData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      title: "添加",
      editForm: {
        roleId: "",
        systemNo: "",
        roleNo: "",
        roleName: "",
        token: localStorage.getItem("logintoken"),
      },
      // rules 表单验证
      rules: {
        roleNo: [
          {
            required: true,
            message: "请输入角色代码",
            trigger: "blur",
          },
        ],
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
        token: localStorage.getItem("logintoken"),
      },
      // 删除
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 数据权限
      RoleRight: [],
      RoleRightProps: {
        children: "children",
        label: "name",
      },
      // 选中
      checkmenu: [],
      //参数role
      saveroleId: "",
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {},
  /**
   * 数据发生改变
   */

  watch: {},

  /**
   * 创建完毕
   */

  created() {
    this.getdata(this.formInline);
  },

  mounted() {
    //获取角色列表
    //  this.getdata();
  },

  /**
   * 里面的方法只有被调用才会执行
   */

  methods: {
    // 获取角色列表
    getdata(parameter) {
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      let parameterdata = {
        start: parameter.page,
        length: parameter.limit,
        roleDesc: parameter.roleName,
      };
      roleList(parameterdata)
        .then((res) => {
          this.loading = false;
          if (res.success == false) {
            this.$message({
              type: "info",
              message: res.msg,
            });
          } else {
            this.listData = [];
            res.data.records.forEach((element) => {
              let data = {};
              // data.editTime = element.createTime;
              data.roleId = element.id;
              data.roleName = element.roleDesc;
              data.roleNo = element.roleDescribe;
              data.updateTime = element.updateTime;
              data.createTime = element.createTime;
              this.listData.push(data);
            });
            // 分页赋值

            this.pageparm.currentPage = this.formInline.page;
            this.pageparm.pageSize = this.formInline.limit;
            this.pageparm.total = res.data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("获取角色列表失败，请稍后再试！");
        });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.roleId = row.roleId;
        this.editForm.systemNo = row.systemNo;
        this.editForm.roleNo = row.roleNo;
        this.editForm.roleName = row.roleName;
      } else {
        this.title = "添加";
        this.editForm.roleId = "";
        this.editForm.systemNo = "";
        this.editForm.roleNo = "";
        this.editForm.roleName = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          let data = {
            roleDesc: this.editForm.roleName,
            roleDescribe: this.editForm.roleNo,
          };
          if (this.editForm.roleId != "") {
            data.id = this.editForm.roleId;
            roleUpdate(data).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "角色新增成功",
              });
            });
          } else {
            roleInsert(data).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "角色保存成功！",
              });
            });
          }

          // roleSave(this.editForm)
          //   .then(res => {
          //     this.editFormVisible = false
          //     this.loading = false
          //     if (res.success) {
          //       this.getdata(this.formInline)
          //       this.$message({
          //         type: 'success',
          //         message: '角色保存成功！'
          //       })
          //     } else {
          //       this.$message({
          //         type: 'info',
          //         message: res.msg
          //       })
          //     }
          //   })
          //   .catch(err => {
          //     this.editFormVisible = false
          //     this.loading = false
          //     this.$message.error('角色保存失败，请稍后再试！')
          //   })
        } else {
          return false;
        }
      });
    },
    // 删除角色
    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            id: row.roleId,
          };
          roleDelete(data)
            .then((res) => {
              this.$message({
                type: "success",
                message: "角色已删除！",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("角色删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 数据权限
    menuAccess(index, row) {
      this.saveroleId = row.roleId;
      ModuleList({
        roleId: row.roleId,
      })
        .then((res) => {
          this.$message({
            type: "success",
            message: "获取权限成功",
          });
          getCheckedKeysData({
            roleId: row.roleId,
          }).then((resdata) => {
            this.checkedKeysData = resdata.data;
          });
          this.treeData = res.data;
          this.menuAccessshow = true;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("获取权限失败，请稍后再试！");
        });
    },
    // 选中菜单
    changemenu(arr) {
      let change = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
          change.push(arr[i].id);
        }
      }
      this.checkmenu = change;
    },
    // tree 递归
    changeArr(list) {
      var temptree = [],
        tree = [],
        items = [];
      for (var i in list) {
        if (!temptree[list[i].id]) {
          var trow = {
            id: list[i].id,
            pId: list[i].pId,
            name: list[i].name,
            open: list[i].open,
            checked: list[i].checked,
            children: [],
          };
          temptree[list[i].id] = trow;
          items.push(trow);
        }
        if (list[i].uid > 0) {
          temptree[list[i].id]["children"].push({
            id: list[i].id,
            pId: list[i].pId,
            name: list[i].name,
            open: list[i].open,
            checked: list[i].checked,
            children: [],
          });
        }
      }

      for (var j in items) {
        if (temptree[items[j].pId]) {
          temptree[items[j].pId]["children"].push(temptree[items[j].id]);
        } else {
          tree.push(temptree[items[j].id]);
        }
      }
      temptree = null;
      items = null;
      return tree;
    },
    // 菜单权限-保存
    menuPermSave() {
      let parm = {
        roleId: this.saveroleId,
        resourcesId: "",
      };
      let node = this.$refs.tree.getCheckedNodes();
      let moduleIds = [];
      if (node.length != 0) {
        for (let i = 0; i < node.length; i++) {
          moduleIds.push(node[i].id);
        }

        parm.resourcesId = moduleIds.toString();
      }
      roleResources(parm)
        .then((res) => {
          this.$message({
            type: "success",
            message: "权限保存成功",
          });
          this.menuAccessshow = false;
          this.getdata(this.formInline);
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("权限保存失败，请稍后再试！");
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == "edit") {
        this.editFormVisible = false;
      } else if (dialog == "perm") {
        this.menuAccessshow = false;
      }
    },
    resetRefresh() {
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.roleName = "";
      this.getdata(this.formInline);
    },
  },
};
</script>

<style scoped>
.userRole {
  width: 100%;
}
</style>
