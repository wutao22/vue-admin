<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between">
      <el-form
        ref="condition"
        :model="condition"
        label-width="20px"
        class="flex padding-top margin-right"
        label-position="left"
      >
        <el-form-item label="id">
          <el-input
            size="small"
            v-model="condition.id"
            placeholder="请输入id"
            style="width: 200px"
          ></el-input>
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
    <!-- 新增选择文件框 -->
    <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()">
      <div>
        <el-form
          ref="forms"
          :model="form"
          :rules="rules"
          label-width="90px"
          class="form"
        >
          <el-form-item label="关联类型" prop="reType">
            <el-select
              placeholder="请选择类型"
              v-model="form.reType"
              @change="queryRelate()"
              clearable
            >
              <el-option label="盲盒产品" value="1"></el-option>
              <el-option label="开心抢购商品" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联商品id" label-width="90px" prop="relateId">
            <el-select placeholder="请选择" v-model="form.relateId" clearable>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in relateList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <div>
            <div class="flex">
              <el-form-item label="图片地址" prop="imgUrl">
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
            <div class="margin-left-xxl">
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
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()">
      <div>
        <el-form
          ref="forms"
          :model="form"
          :rules="rules"
          label-width="90px"
          class="form"
        >
          <el-form-item label="关联类型" prop="reType">
            <el-select
              placeholder="请选择类型"
              v-model="form.reType"
              @change="queryRelate()"
              clearable
            >
              <el-option label="盲盒产品" value="1"></el-option>
              <el-option label="开心抢购商品" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联商品id" label-width="90px" prop="relateId">
            <el-select placeholder="请选择" v-model="form.relateId" clearable>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in relateList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <div>
            <div class="flex">
              <el-form-item label="图片地址" prop="imgUrl">
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
            <div class="margin-left-xxl">
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
          key: "type",
          props: "type",
          label: "关联类型",
          render: (h, params) => {
            if (params.row.type === 1) {
              return h("div", "盲盒产品");
            } else {
              return h("div", "开心抢购商品");
            }
          },
        },
        {
          key: "otherId",
          props: "otherId",
          label: "关联商品id",
        },
        {
          key: "url",
          props: "url",
          label: "图片地址",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.url,
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
          label: "创建时间",
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
      showTableModal: false,
      showChooseModal: false,
      relateList: [], // 查询的相关联的
      form: {
        id: "",
        reType: "",
        imgUrl: "",
        relateId: "", // 新增编辑表单数据
      },
      condition: {
        id: "",
      },
      // 校验规则
      rules: {
        reType: [
          { required: true, message: "请选择关联类型", trigger: "change" },
        ],
        relateId: [
          { required: true, message: "请选择关联id", trigger: "change" },
        ],
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
    };
  },
  mounted() {
    this.queryData();
    this.getUserInfo();
  },
  methods: {
    // 查询首页数据
    queryData() {
      this.get("/banner/all", {
        startNumber: this.page.current,
        queryNumber: this.page.size,
        id: this.condition.id,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 查询相关商品id
    queryRelate() {
      this.get("/banner/type", {
        type: this.reType,
      }).then((res) => {
        this.relateList = res.data;
      });
    },
    // 上传图片
    uploadFile(e) {
      this.files = e.target.files[0];
      this.form.imgUrl = window.URL.createObjectURL(this.files);
    },
    // 预览查看图片
    previreImg(row) {
      this.url = row.url;
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
      this.form.imgUrl = "";
      this.form.reType = "";
      this.form.relateId = "";
      // this.$refs["forms"].resetFields();
      this.preview = false;
      this.showAdd = false;
      this.showEdit = false;
    },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/banner/delete", {
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
      this.form.reType = row.type;
      this.form.imgUrl = row.url;
      this.form.relateId = row.otherId;
      this.rowId = row.id;
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
      this.buttonType = 2;
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
      this.form.reType = "";
      this.form.imgUrl = "";
      this.form.relateId = "";
    },
    // 查询条件重置
    reset() {
      this.condition.id = "";
      this.queryData();
    },
    // 点击确认按钮
    confirm() {
      // buttonType为1调编辑接口 为2调新增接口
      if (this.buttonType === 2) {
        this.$refs.forms.validate((valid) => {
          if (valid) {
            let data = new FormData();
            if (this.files) {
              data.append("file", this.files);
            } else {
              data.append("url", this.form.imgUrl);
            }
            data.append("otherId", this.form.relateId);
            data.append("type", this.form.reType);
            axios({
              method: "POST",
              url: "/api/banner/insert",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: data,
            }).then((res) => {
              if (res.data.code === 200) {
                this.showSuccess();
                this.queryData();
                this.showEdit = false;
                this.files = null;
              } else {
                this.$message({
                  message: res.data.message || "失败",
                  type: "error",
                });
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
            } else {
              data.append("url", this.form.imgUrl);
            }
            data.append("otherId", this.form.relateId);
            data.append("type", this.form.reType);
            axios({
              method: "POST",
              url: "/api/banner/update",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: data,
            }).then((res) => {
              if (res.data.code === 200) {
                this.showSuccess();
                this.queryData();
                this.showTableModal = false;
                this.files = null;
              } else {
                this.$message({
                  message: res.data.message || "失败",
                  type: "error",
                });
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

<style scoped>
.form .el-input,
.form .el-select {
  width: 300px !important;
}
</style>
