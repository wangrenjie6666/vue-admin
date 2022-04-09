<template>
  <div class="main-layout">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs-class mb20">
      <el-breadcrumb-item>主菜单</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd3732 bgfff">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item label="用户名:">
          <el-input
            size="small"
            v-model="formInline.userName"
            placeholder="输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input
            size="small"
            v-model="formInline.userMobile"
            placeholder="输入手机号"
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
          <!-- <el-button size="small" type="primary" @click="handleunit()">部门设置</el-button> -->
        </el-form-item>
      </el-form>
      <!--列表 -->
      <el-table
        size="small"
        class="mb20"
        stripe
        :data="userData"
        highlight-current-row
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column align="center" sortable prop="id" label="用户id">
        </el-table-column>
        <el-table-column align="center" sortable prop="username" label="用户名">
        </el-table-column>
        <el-table-column align="center" sortable prop="roleName" label="用户角色">
        </el-table-column>
        <el-table-column align="center" sortable prop="phone" label="手机号" width="120">
        </el-table-column>
        <el-table-column align="center" sortable prop="fullname" label="用户姓名">
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          prop="lastLoginTime"
          label="最后登录时间"
          width="160"
        >
        </el-table-column>
        <el-table-column
          align="center"
          sortable
          prop="createTime"
          label="创建时间"
          width="160"
        >
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
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
              @click="resetpwd(scope.$index, scope.row)"
              >重置密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div class="page-layout">
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </div>
      <!-- 编辑界面 -->
      <el-dialog :visible.sync="editFormVisible" width="30%" @click="closeDialog('edit')">
        <div class="edit-title">{{ title }}</div>
        <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input
              size="small"
              v-model="editForm.username"
              auto-complete="off"
              placeholder="请输入用户名"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="fullname">
            <el-input
              size="small"
              v-model="editForm.fullname"
              auto-complete="off"
              placeholder="请输入姓名"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              size="small"
              v-model="editForm.roleId"
              placeholder="请选择"
              class="userRole"
            >
              <el-option
                v-for="(item, index) in allRoleList"
                :key="index"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              size="small"
              v-model="editForm.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="dialog-cancel-color" size="small" @click="closeDialog('edit')"
            >取消</el-button
          >
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
    </div>
  </div>
</template>

<script>
// 导入请求方法
import {
  userList,
  userDelete,
  allRoleList,
  userUpdate,
  userInsert,
  userResetPassword,
} from "../../api/userMG";
export default {
  name: "User",
  data() {
    return {
      loading: false,
      title: "添加用户",
      editFormVisible: false, //控制编辑页面显示与隐藏
      userData: [],
      formInline: {
        page: 1,
        limit: 10,
        deptId: "",
        userName: "",
        userMobile: "",
        isLock: "",
      },
      // 编辑与添加
      editForm: {
        id: "",
        username: "",
        fullname: "",
        roleId: "",
        phone: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        fullname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        roleId: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
            required: true,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      allRoleList: [],
    };
  },
  mounted() {
    this.getdata(this.formInline);
    this.getAllRoleList();
  },
  methods: {
    // 获取数据方法
    getdata(parameter) {
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // 获取用户列表
      let parameterdata = {
        start: parameter.page,
        username: parameter.userName,
        phone: parameter.userMobile,
        length: parameter.limit,
      };
      userList(parameterdata).then((res) => {
        this.userData = res.data.records;
        // 分页赋值
        this.pageparm.currentPage = this.formInline.page;
        this.pageparm.pageSize = this.formInline.limit;
        this.pageparm.total = res.data.total;
      });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    //搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata(this.formInline);
    },
    resetRefresh() {
      //设为初始化
      this.formInline.page = 1;
      this.formInline.limit = 10;
      this.formInline.userName = "";
      this.formInline.userMobile = "";
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改用户";
        this.editForm.id = row.id;
        this.editForm.username = row.username;
        this.editForm.fullname = row.fullname;
        this.editForm.roleId = row.roleId;
        this.editForm.phone = row.phone;
      } else {
        this.title = "添加用户";
        this.editForm.id = "";
        this.editForm.username = "";
        this.editForm.fullname = "";
        this.editForm.roleId = "";
        this.editForm.phone = "";
      }
    },
    // 编辑、添加提交方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          let data = {
            username: this.editForm.username,
            phone: this.editForm.phone,
            fullname: this.editForm.fullname,
            roleId: this.editForm.roleId,
          };
          // 请求方法
          if (this.editForm.id != "") {
            data.id = this.editForm.id;
            userUpdate(data).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "数据保存成功！",
              });
            });
          } else {
            userInsert(data).then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              this.getdata(this.formInline);
              this.$message({
                type: "success",
                message: "数据保存成功！",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == "edit") {
        this.editFormVisible = false;
      } else if (dialog == "perm") {
        this.dataAccessshow = false;
      } else if (dialog == "unit") {
        this.unitAccessshow = false;
      }
    },
    // 删除用户
    deleteUser(index, row) {
      console.log(row);
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除
          userDelete({
            id: row.id,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "数据已删除!",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("数据删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除！",
          });
        });
    },
    // 重置密码
    resetpwd(index, row) {
      // this.resetpsd.userId = row.userId
      this.$confirm("确定要重置密码吗?重置后密码是六个8", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userResetPassword({
            id: row.id,
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "重置密码成功！",
              });
              this.getdata(this.formInline);
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("重置密码失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消重置密码！",
          });
        });
    },
    //获取角色列表
    getAllRoleList() {
      this.allRoleList = [];
      allRoleList().then((res) => {
        res.data.forEach((element) => {
          let data = {
            label: element.roleDesc,
            id: element.id,
          };
          this.allRoleList.push(data);
        });
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
