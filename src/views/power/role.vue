<template>
  <el-card>
    <Table
      :tableData="data"
      :colums="colums"
      :showFresh="true"
      :showAdd="true"
      :showDelete="true"
      @deleteItem="deleteItem"
      @addFile="addFile"
      @fresh="queryData"
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
              @click="assignPermisstion(scope.row.id)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </template>
    </Table>
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
    <!-- 添加 -->
    <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色编码" label-width="120px" multiple prop="userCode">
          <el-input v-model="form.userCode" style="width: 300px;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" label-width="120px" prop="userName">
          <el-input v-model="form.userName" style="width: 300px;" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px" prop="userDesc">
          <el-input type="textarea" v-model="form.userDesc" style="width: 300px;" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="showAssign" @closed="closed()">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色权限" label-width="120px" prop="userDesc">
          <el-tree
            :data="treedata"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="defaultProps"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAssign = false">取 消</el-button>
        <el-button type="primary" @click="assignComfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      showAdd: false,
      showAssign: false,
      treedata: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 校验规则
      rules: {
        userCode: [
          { required: true, message: "请填写角色编号", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        userDesc: [{ required: true, message: "请填写角色描述", trigger: "blur" }]
      },
      colums: [
        {
          key: "id",
          label: "角色编号",
          width: 80,
        },
        {
          key: "roleCode",
          props: "roleCode",
          label: "角色编码"
        },
        {
          key: "roleName",
          props: "roleName",
          label: "角色名称",
        },
        {
          key: "remark",
          props: "remark",
          label: "角色备注",
        },
        {
          slot: 'operation'
        }
      ],
      buttonType: 1,
      rowId: '',
      data: [],
      form: {
        userCode: '',
        userName: '',
        userDesc: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      let id = JSON.parse(localStorage.getItem('userInfo')).id
      this.get("/role/list", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        userId: id
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
      this.buttonType = 1
    },
    // 分配权限
    assignPermisstion (id) {
      this.showAssign = true
      this.rowId = id
      let userId = JSON.parse(localStorage.getItem('userInfo')).id
      this.queryPermisTree(userId)
    },
    // 通过id获取节点
    getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      queryPermisTree (userId) {
        this.get('/permission/getPermissionTree', {
          userId: userId,
          roleId: this.rowId
        }).then(res => {
            
          if(res.code === 200) {
            if(res.data.checkList) {
              this.$refs.tree.setCheckedKeys(res.data.checkList)
            }
            if (res.data.permissionList.length != 0) {
              this.treedata = res.data.permissionList
            }
          }
        })
      },
      assignComfirm () {
        this.getCheckedKeys()
        this.post('/role/saveRolePermission', {
          roleId: this.rowId,
          list: this.$refs.tree.getCheckedKeys().join(',')
        }).then(res => {
          if(res.data.code === 200) {
            this.showSuccess()
            this.showAssign = false 
            this.queryData()
          }
        }, err => {
          this.$message({
            message: '出错了',
            type: "error",
          });
        })
      },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/role/delete", {
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
    handleCheckChange () {
      // console.log(this.treedata)
    },
    // 编辑
    editItem(row) {
      this.rowId = row.id
      this.buttonType = 2
      this.showAdd = true
      this.form.userCode = row.roleCode
      this.form.userName = row.roleName
      this.form.userDesc = row.remark
    },
    cancel() {
      this.showAdd = false;
      this.$refs["form"].resetFields();
    },
    closed () {
      this.$refs["form"].resetFields();
      this.queryData()
    },
    // 点击确认按钮
    confirm() {
      if (this.buttonType === 1) {
        this.$refs.form.validate((valid) => {
        if(valid) {
          this.post('/role/insert', {
            roleCode: this.form.userCode,
            roleName: this.form.userName,
            remark: this.form.userDesc
          }).then(res => {
            if(res.data.code === 200) {
              this.showSuccess()
              this.showAdd = false
            }
          })
        }
      })
      } else {
        this.$refs.form.validate((valid) => {
        if(valid) {
          this.post('/role/update', {
            id: this.rowId,
            roleCode: this.form.userCode,
            roleName: this.form.userName,
            remark: this.form.userDesc
          }).then(res => {
            if(res.data.code === 200) {
              this.showSuccess()
              this.showAdd = false
            }
          })
        }
      })
      }
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

<style>
</style>