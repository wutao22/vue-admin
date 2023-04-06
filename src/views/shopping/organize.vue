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
    <el-dialog :title="buttonType === 1? '添加' : '编辑'" :visible.sync="showAdd" @closed="closed()">
      <el-form :model="form" :rules="rules" ref="form" class="form">
        <el-form-item label="父ID" label-width="120px" multiple prop="fatherId">
          <el-select placeholder="请选择" v-model="form.fatherId" clearable>
            <el-option
              v-for="(item, index) in data"
              :key="index"
              :label="item.name"
              :value="item.pid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分类名称"
          label-width="120px"
          placeholder="请输入分类名称"
          prop="name"
        >
          <el-input v-model="form.name" maxlength="20"></el-input>
        </el-form-item>
        <div>
          <div class="flex">
            <el-form-item
              label="分类图片"
              label-width="120px"
              prop="categoryImg"
            >
              <el-input v-model="form.categoryImg" disabled></el-input>
            </el-form-item>
            <div class="margin-left">
              <input
                type="file"
                ref="files"
                style="display: none"
                v-on:change="uploadFile($event)"
              />
              <el-button type="primary" @click="$refs.files.click()"
                >上传</el-button
              >
            </div>
            <div class="margin-left">
              <el-button type="info" @click="chooseGoods()">选择</el-button>
            </div>
          </div>
          <div class="padding-bottom" style="margin-left: 13%">
            <img
              v-if="form.categoryImg"
              :src="form.categoryImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 子表格 -->
    <chooseTable
      :show="showChooseModal"
      @close="close"
      @selectItem="selectItem"
    ></chooseTable>
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
      showAdd: false,
      showChooseModal: false,
      file: null,
      preview: false,
      url: "",
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 150,
        },
        {
          key: "name",
          props: "name",
          label: "分类名称",
          width: 250,
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
                    this.previewImg(params.row.image);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "createTime",
          props: "createTime",
          label: "添加时间",
          render: (h, params) => {
            return h("div", this.dateTimeFormat(params.row.createTime));
          },
        },
        {
          slot: "operation",
        },
      ],
      data: [],
      // 校验规则
      rules: {
        fatherId: [
          { required: true, message: "请选择父级id", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        categoryImg: [
          { required: true, message: "请填写上传图片地址", trigger: "blur" },
        ],
      },
      buttonType: 1, // 1新增 2编辑
      rowId: "",
      form: {
        fatherId: "",
        categoryImg: "",
        name: "",
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
      this.get("/goods/all", {
        beginNum: this.page.current,
        queryNum: this.page.size,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
      this.buttonType = 1;
    },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/goods/delete", {
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
      this.showAdd = true;
      this.form.name = row.name;
      this.form.categoryImg = row.image;
      this.form.fatherId = row.pid;
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
    },
    // 点击确认按钮
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.buttonType === 1) {
            let formdata = new FormData();
            if (this.file) {
              formdata.append("file", this.file);
            } else {
              formdata.append("image", this.form.categoryImg);
            }
            formdata.append("name", this.form.name);
            formdata.append("pid", this.form.fatherId);

            axios({
              method: "POST",
              url: "/api/goods/insert",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: formdata,
            }).then((res) => {
              if (res.data.code === 200) {
                this.queryData();
                this.showSuccess();
                this.showAdd = false;
              }
            });
          } else {
            let formdata = new FormData();
            if (this.file) {
              formdata.append("file", this.file);
            } else {
              formdata.append("image", this.form.categoryImg);
            }
            formdata.append("name", this.form.name);
            formdata.append("pid", this.form.fatherId);
            formdata.append("id", this.rowId);
            axios({
              method: "POST",
              url: "/api/goods/update",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: formdata,
            }).then((res) => {
              if (res.data.code === 200) {
                this.queryData();
                this.showSuccess();
                this.showAdd = false;
              }
            });
          }
        }
      });
    },
    // 选中子表格数据
    selectItem(url) {
      this.form.categoryImg = url;
    },
    // 上传图片
    uploadFile(e) {
      this.file = e.target.files[0];
      this.form.categoryImg = window.URL.createObjectURL(this.file);
    },
    // 选择子表格数据
    chooseGoods() {
      this.showChooseModal = true;
    },
    // 选择框dialog关闭回调
    close() {
      this.showChooseModal = false;
    },
    // 外部修改新增框关闭
    closed() {
      this.showAdd = false;
      this.form.fatherId = "";
      this.categoryImg = "";
      this.form.name = "";
      // this.$refs["form"].resetFields();
      this.preview = false;
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
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
.form .el-input,  .form .el-select{
  width: 300px !important;
}
</style>