<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between">
      <el-form
        ref="condition"
        :model="condition"
        class="flex padding-top margin-right"
        label-position="left" 
      >
        <el-form-item label="id" label-width="40px">
          <el-input
            size="small"
            v-model="condition.id"
            placeholder="请输入id"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类名称" label-width="80px" class="margin-lr">
          <el-input
            size="small"
            v-model="condition.name"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加时间" label-width="80px">
          <el-date-picker
            v-model="condition.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            @change="changeTime()"
            style="width: 250px"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" size="small" @click="queryData()"
          >搜索</el-button
        >
        <el-button type="info" size="small" @click="reset()">重置</el-button>
      </div>
    </div>
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
        <el-table-column label="操作" align="center">
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
    <!-- 新增文件框 -->
    <el-dialog
      title="添加"
      :visible.sync="showAdd"
      @closed="closed()"
      @open="queryPid()"
    >
      <div>
        <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
          <el-form-item label="父id" label-width="90px" prop="faId" class="father">
            <el-select placeholder="请选择" v-model="form.faId" clearable>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in faList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称" label-width="90px" prop="name">
            <el-input
              placeholder="请输入分类名称"
              v-model="form.name"
            ></el-input>
          </el-form-item>
          <div>
            <div class="flex">
              <el-form-item label="分类图片" prop="imgUrl">
                <el-input v-model="form.imgUrl" disabled></el-input>
              </el-form-item>
              <div class="margin-left">
                <input
                  type="file"
                  ref="file"
                  style="display: none"
                  v-on:change="uploadFile($event)"
                />
                <el-button type="primary" @click="$refs.file.click()"
                  >上传</el-button
                >
              </div>
              <div class="margin-left">
                <el-button type="info" @click="chooseGoods()">选择</el-button>
              </div>
            </div>
            <div style="margin-left: 10%">
            <img
              v-if="form.imgUrl"
              :src="form.imgUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </div>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
      <!-- 子表格 -->
      <chooseTable
        :show="showChooseModal"
        @close="close"
        @selectItem="selectItem"
      ></chooseTable>
    </el-dialog>
    <!-- 编辑文件框 -->
    <el-dialog
      title="编辑"
      :visible.sync="showEdit"
      @closed="closed()"
      @open="queryPid()"
    >
      <div>
        <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
          <el-form-item label="父id" label-width="90px" prop="faId" class="father">
            <el-select placeholder="请选择" v-model="form.faId" clearable>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in faList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称" label-width="90px" prop="name">
            <el-input
              placeholder="请输入分类名称"
              v-model="form.name"
            ></el-input>
          </el-form-item>
          <div>
            <div class="flex">
              <el-form-item label="分类图片" prop="imgUrl">
                <el-input v-model="form.imgUrl" disabled></el-input>
              </el-form-item>
              <div class="margin-left">
                <input
                  type="file"
                  ref="file"
                  style="display: none"
                  v-on:change="uploadFile($event)"
                />
                <el-button type="primary" @click="$refs.file.click()"
                  >上传</el-button
                >
              </div>
              <div class="margin-left">
                <el-button type="info" @click="chooseGoods()">选择</el-button>
              </div>
            </div>
            <div style="margin-left: 10%">
            <img
              v-if="form.imgUrl"
              :src="form.imgUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </div>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed">取 消</el-button>
        <el-button type="primary" @click="confirm()" :disabled="disabled">确 定</el-button>
      </div>
      <!-- 子表格 -->
      <chooseTable
        :show="showChooseModal"
        @close="close"
        @selectItem="selectItem"
      ></chooseTable>
    </el-dialog>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
  </el-card>
</template>
  
  <script>
import axios from "axios";
import chooseTable from "@/components/ChooseTable";
export default {
  components: {
    chooseTable,
  },
  data() {
    return {
      colums: [
        // {
        //   type: 'selection'
        // },
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "pid",
          props: "pid",
          label: "父ID",
          width: 100,
        },
        {
          key: "name",
          props: "name",
          label: "分类名称",
        },
        {
          key: "image",
          props: "image",
          label: "分类图片",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.image,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previreImg(params.row);
                  },
                },
              }),
            ]);
          },
        },
        {
          prop: "createTime",
          key: "createTime",
          label: "添加时间",
          render: (h, params) => {
            return h("div", this.dateTimeFormat(params.row.createTime));
          },
        },
        {
          prop: "updateTime",
          key: "updateTime",
          label: "更新时间",
          render: (h, params) => {
            return h("div", this.dateTimeFormat(params.row.updateTime));
          },
        },
        {
          slot: "operation",
          label: "操作",
        },
      ],
      data: [],
      files: null, // 新增上传的file
      showAdd: false,
      showEdit: false,
      preview: false,
      url: "",
      showChooseModal: false,
      faList: [], // 查询的父类id
      form: {
        name: "",
        imgUrl: "",
        faId: "", // 新增编辑表单数据
      },
      condition: {
        id: "",
        name: "",
        time: [],
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: "请选择关联类型", trigger: "change" },
        ],
        faId: [{ required: false, message: "请选择父id", trigger: "change" }],
        imgUrl: [
          { required: true, message: "请填写上传图片地址", trigger: "blur" },
        ],
      },
      buttonType: "", // 1为编辑 2为新增
      rowId: "", // 编辑一列的id
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      disabled: false
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    // 查询首页数据
    queryData() {
      this.get("/goodsManagement/queryAll", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        id: this.condition.id,
        name: this.condition.name,
        startTime: this.condition.time[0],
        endTime: this.condition.time[1],
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 查询相关商品id
    queryPid() {
      this.get("/goodsManagement/queryPid").then((res) => {
        this.faList = res.data;
      });
    },
    // 处理查询条件时间
    changeTime() {
      this.condition.time[0] = this.condition.time[0] + " " + "00:00:00";
      this.condition.time[1] = this.condition.time[1] + " " + "23:59:59";
    },
    // 上传图片
    uploadFile(e) {
      this.files = e.target.files[0];
      this.form.imgUrl = window.URL.createObjectURL(this.files);
    },
    // 预览查看图片
    previreImg(row) {
      this.url = row.image;
      this.preview = true;
    },
    // 选择
    chooseGoods() {
      this.showChooseModal = true;
    },
    // 选择框dialog关闭回调
    close() {
      this.showChooseModal = false;
    },
    // 外部修改新增框关闭
    closed() {
      this.form.name = "";
      this.form.imgUrl = "";
      this.form.faId = "";
      this.url = ''
      this.preview = false;
      this.showEdit = false
    },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/goodsManagement/deleteZGoodsCategory", {
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
    // 编辑
    editItem(row) {
      this.buttonType = 1;
      this.showEdit = true;
      this.form.name = row.name;
      this.form.imgUrl = row.image;
      this.form.faId = row.pid;
      this.rowId = row.id;
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
      this.showAdd = true;
      this.buttonType = 2;
    },
    cancel() {
      this.showAdd = false;
    },
    // 查询条件重置
    reset() {
      this.condition.id = "";
      this.condition.name = "";
      this.condition.time = [];
      this.queryData();
    },
    // 点击确认按钮
    confirm() {
      // buttonType为1调编辑接口 为2调新增接口
      this.disabled = true
      if (this.buttonType === 2) {
        this.$refs.forms.validate((valid) => {
          if (valid) {
            let data = new FormData();
            if (this.files) {
              data.append("file", this.files);
            }
            data.append("id", this.form.faId);
            data.append("name", this.form.name);
            data.append("image", this.form.imgUrl);
            axios({
              method: "POST",
              url: "/api/goodsManagement/insertZGoodsCategory",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: data,
            }).then((res) => {
              console.log(res)
              if (res.data.code === 200) {
                this.showSuccess();
                this.queryData();
                this.showAdd = false;
                this.disabled = false
              }
            });
          }
        });
      } else if (this.buttonType === 1) {
        this.$refs.forms.validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append("id", this.rowId);
            if (this.files) {
              data.append("file", this.files);
            }
            data.append("pid", this.form.faId);
            data.append("name", this.form.name);
            data.append("image", this.form.imgUrl);
            axios({
              method: "POST",
              url: "/api/goodsManagement/updateZGoodsCategory",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: data,
            }).then((res) => {
              if (res.data.code === 200) {
                this.showSuccess();
                this.queryData();
                this.showEdit = false;
                this.disabled = false
              }
            });
          }
        });
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
  .form .el-input,  .form .el-select{
  width: 300px !important;
}
.form{
  position: relative;
}

.father::after {
  content: '不选择则新增父Id为0的分类';
  position: absolute;
  right: 38%;
  top: 6%;
  color: cornflowerblue;
}
</style>
  