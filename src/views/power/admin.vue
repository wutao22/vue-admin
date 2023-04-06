<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form
        ref="condition"
        :model="condition"
        label-width="80px"
        class="flex align-center padding-top-lg"
      >
        <el-form-item label="用户名">
          <el-input
            size="small"
            v-model="condition.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            size="small"
            v-model="condition.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input
            size="small"
            v-model="condition.email"
            placeholder="请输入Email"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            placeholder="请选择性别"
            v-model="condition.sex"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" @click="queryData()" size="small"
          >搜索</el-button
        >
        <el-button type="info" @click="reset()" size="small">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <Table
      :tableData="data"
      :colums="colums"
      :showFresh="true"
      :showAdd="true"
      :showDelete="true"
      @deleteItem="deleteItem"
      @addFile="addFile"
      @fresh="queryData"
      style="width: 100%"
    >
      <template v-slot:operation>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              slot="reference"
              @click="deleteItem(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="text"
              size="small"
              slot="reference"
              @click="assignCareter(scope.row.id)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </template>
    </Table>
    <!-- 分页 -->
    <div class="block margin-top flex justify-end">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>
    <!-- 新增管理员 -->
    <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()">
      <el-form :model="form" :rules="rules" ref="form" class="form">
        <el-form-item label="用户名" label-width="120px" prop="userName">
          <el-input v-model="form.userName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="Email">
          <el-input v-model="form.Email"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" prop="name">
          <el-input v-model="form.name" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px" prop="nickname">
          <el-input v-model="form.nickname" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="form.password" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="mobile">
          <el-input v-model="form.mobile" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px">
          <el-radio v-model="form.sex" label="0">男</el-radio>
          <el-radio v-model="form.sex" label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="头像" label-width="120px">
          <div class="flex align-center">
            <input
              type="file"
              ref="files"
              style="display: none"
              v-on:change="uploadFile($event)"
            />
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
            <el-button
              type="primary"
              class="margin-left"
              @click="$refs.files.click()"
              >上传</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑管理员 -->
    <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()">
      <el-form :model="rowData" :rules="rules" ref="form" class="form">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="rowData.username" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="rowData.email" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" prop="userName">
          <el-input v-model="rowData.nickName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="rowData.nickName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="password">
          <el-input v-model="rowData.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px">
          <el-radio v-model="rowData.gender" label="0">男</el-radio>
          <el-radio v-model="rowData.gender" label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="头像" label-width="120px">
          <div class="flex align-center">
            <input
              type="file"
              ref="files"
              style="display: none"
              v-on:change="editFile($event, rowData)"
            />
            <img
              v-if="rowData.avatar"
              :src="rowData.avatar"
              style="width: 100px; height: 100px"
            />
            <el-button
              type="primary"
              class="margin-left"
              @click="$refs.files.click()"
              >上传</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="showCaracter"
      @closed="closed()"
      @open="queryRole()"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="id"
          label="角色编号"
          width="180"
        ></el-table-column>
        <el-table-column prop="roleCode" label="角色编码"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="remark" label="角色备注"></el-table-column>
      </el-table>
      <div class="block margin-top flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirmRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("请输入正确邮箱"));
      }
    };
    return {
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "avatar",
          props: "avatar",
          label: "头像",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.avatar,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "username",
          props: "username",
          label: "用户名",
          width: 100,
        },
        {
          prop: "gender",
          key: "gender",
          label: "性别",
          render: (h, params) => {
            if (params.row.gender === "0") {
              return h("div", "男");
            } else {
              return h("div", "女");
            }
          },
        },
        {
          key: "nickName",
          props: "nickName",
          label: "昵称",
        },
        {
          key: "phone",
          props: "phone",
          label: "手机号",
        },
        {
          prop: "email",
          key: "email",
          label: "Email",
        },
        {
          slot: "operation",
          label: "操作",
        },
      ],
      condition: {
        // 查询条件
        username: "",
        phone: "",
        sex: "",
        email: "",
      },
      // 校验规则
      rules: {
        userName: [
          { required: true, message: "请填写用户名", trigger: "blur" },
        ],
        Email: [{ required: true, validator: checkEmail, trigger: "change" }],
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        nickname: [{ required: true, message: "请填写昵称", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
        mobile: [{ required: true, message: "请填写手机号", trigger: "blur" }],
      },
      data: [],
      rowData: [], // 编辑时一列的数据
      rowId: "",
      showAdd: false, // 添加
      showEdit: false, // 编辑
      showCaracter: false, //分配角色
      form: {
        userName: "",
        Email: "",
        name: "",
        nickname: "",
        password: "",
        mobile: "",
        sex: "1",
      }, // 添加时表单数据
      imageUrl: "",
      file: null,
      buttonType: 1, // 1为新增 2为编辑
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      tableData: [], // 分配角色表格数据
      multipleSelection: [], // 分配角色多选数据
      idString: "", // 分配角色传值id
      preview: false, // 预览图片
      url: "",
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.get("/user/queryPage", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        username: this.condition.username,
        phone: this.condition.phone,
        email: this.condition.email,
        gender: this.condition.sex,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 查询此user下的可分配的角色
    queryRole() {
      let id = JSON.parse(localStorage.getItem("userInfo")).id;
      this.get("/role/getRoleByUserId", {
        userId: id,
      }).then((res) => {
        this.selectData = res.data;
        this.selectData.forEach((key) => {
          this.tableData.forEach((row) => {
            if (row.id === key) {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        });
      });
    },
    // 查询角色列表
    roleList() {
      let id = JSON.parse(localStorage.getItem("userInfo")).id;
      this.get("/role/list", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        userId: id,
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.page.total = res.data.total;
        }
      });
    },
    // 选中数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let idArray = [];
      for (let i in val) {
        idArray[i] = val[i].id;
      }
      this.idString = idArray.join(",");
    },
    // 分配角色
    assignCareter(id) {
      this.roleList();
      this.showCaracter = true;
    },
    // 分配角色确认按钮
    confirmRole() {
      let id = JSON.parse(localStorage.getItem("userInfo")).id;
      this.post("/user/saveUserRole", {
        userId: id,
        roleIds: this.idString,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showCaracter = false;
          this.showSuccess();
          this.queryData();
          this.$router.go(0);
        }
      });
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
      this.buttonType = 1;
    },
    // 上传头像
    uploadFile(e) {
      this.imageUrl = URL.createObjectURL(e.target.files[0]);
      this.file = e.target.files[0];
    },
    // 编辑时更新头像
    editFile(e, item) {
      item.avatar = URL.createObjectURL(e.target.files[0]);
      this.file = e.target.files[0];
    },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/user/deleteSysUser", {
            idList: idList,
          }).then((res) => {
            this.queryData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editItem(row) {
      this.buttonType = 2;
      this.rowId = row.id;
      this.showEdit = true;
      this.rowData = this.copy(row);
    },
    // 预览图片
    previewImg(row) {
      this.url = row.avatar;
      this.preview = true;
    },
    closed() {
      this.showCaracter = false;
      this.showAdd = false;
      this.showEdit = false;
      this.preview = false;
      this.queryData();
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
      this.showCaracter = false;
      this.$refs["form"].resetFields();
    },
    // 查询条件重置
    reset() {
      this.condition.phone = "";
      this.condition.sex = "";
      this.condition.username = "";
      this.condition.email = "";
      this.queryData();
    },
    // 新增编辑点击确认按钮
    confirm() {
      if (this.buttonType === 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let formdata = new FormData();
            formdata.append("file", this.file);
            formdata.append("username", this.form.userName);
            formdata.append("password", this.form.password);
            formdata.append("realName", this.form.name);
            formdata.append("nickName", this.form.nickname);
            formdata.append("gender", this.form.sex);
            formdata.append("phone", this.form.mobile);
            formdata.append("email", this.form.Email);
            axios({
              method: "POST",
              url: "/api/user/insertSysUser",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: formdata,
            }).then(
              (res) => {
                if (res.data.code === 200) {
                  this.showAdd = false;
                  this.showSuccess();
                  this.queryData();
                }
              },
              (err) => {
                this.$message({
                  message: "出错了",
                  type: "error",
                });
              }
            );
          }
        });
      } else {
        let formdata = new FormData();
        formdata.append("file", this.file);
        formdata.append("id", this.rowId);
        formdata.append("username", this.rowData.username);
        formdata.append("realName", this.rowData.realName);
        formdata.append("nickName", this.rowData.nickName);
        formdata.append("gender", this.rowData.gender);
        formdata.append("phone", this.rowData.phone);
        formdata.append("email", this.rowData.email);
        axios({
          method: "POST",
          url: "/api/user/updateInfo",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formdata,
        }).then(
          (res) => {
            if (res.data.code === 200) {
              this.showEdit = false;
              this.showSuccess();
              this.queryData();
              this.getUserInfo();
            }
          },
          (err) => {
            this.$message({
              message: "出错了",
              type: "error",
            });
          }
        );
      }
    },
    getUserInfo() {
      this.get("/user/getSysUserInfo").then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        this.$router.go(0)
      });
    },
    // 选中子表格数据
    selectItem(url) {
      this.form.imgUrl = url;
    },
    // 分页
    handleSizeChange(val) {
      this.page.size = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.queryData();
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #409eff !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.form .el-input {
  width: 300px;
}
</style>