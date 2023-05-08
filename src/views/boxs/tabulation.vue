<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form
        ref="condition"
        :model="form"
        label-width="80px"
        class="flex align-center padding-top-lg"
      >
        <el-form-item label="名称">
          <el-input
            size="small"
            v-model="condition.name"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="上/下架">
          <el-select
            placeholder="请选择"
            v-model="condition.status"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐状态">
          <el-select
            placeholder="请选择状态"
            v-model="condition.recommendStatus"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="不推荐" value="1"></el-option>
            <el-option label="推荐" value="2"></el-option>
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
            <el-button type="text" size="small" @click="addGoods(scope.row)"
              >添加商品</el-button
            >
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
      <template v-slot:recommendStatus>
        <el-table-column label="推荐状态">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.recommendStatus"
              :active-value="2"
              :inactive-value="1"
              @change="changeReStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </template>
      <template v-slot:status>
        <el-table-column label="上/下架">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              :active-value="1"
              :inactive-value="-1"
              @change="changeStatus(scope.row)"
            ></el-switch>
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
    <addDialog :show="showAdd" @closed="closed" :rowData="rowData"></addDialog>
    <!-- 增加产品 -->
    <addProduct :show="showProduct" :id="id" @closed="closed"></addProduct>
    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="showEdit"
      @closed="closed()"
      @open="queryEditRow()"
    >
      <div>
        <el-form
          ref="form"
          :model="form"
          label-width="90px"
          label-position="left"
        >
          <el-form-item label="名称">
            <el-input v-model="rowData.name" style="width: 300px"></el-input>
          </el-form-item>
          <div>
            <div class="flex">
              <el-form-item label="首页图片">
                <el-input
                  v-model="rowData.img"
                  style="width: 300px"
                  disabled
                ></el-input>
              </el-form-item>
              <div class="margin-left">
                <input
                  type="file"
                  ref="file"
                  style="display: none"
                  v-on:change="uploadFile($event, 1)"
                />
                <el-button type="primary" @click="$refs.file.click()"
                  >上传</el-button
                >
              </div>
              <div class="margin-left">
                <el-button type="info" @click="chooseGoods(1)">选择</el-button>
              </div>
            </div>
            <div class="margin-left-xxl padding-bottom">
              <img 
                :src="rowData.img"
                alt=""
                style="width: 100px; height: 100px"
              />
            </div>
          </div>
          <div>
            <div class="flex">
              <el-form-item label="缩略图">
                <el-input
                  v-model="rowData.thumbnail"
                  style="width: 300px"
                  disabled
                ></el-input>
              </el-form-item>
              <div class="margin-left">
                <input
                  type="file"
                  ref="files"
                  style="display: none"
                  v-on:change="uploadFile($event, 2)"
                />
                <el-button type="primary" @click="$refs.files.click()"
                  >上传</el-button
                >
              </div>
              <div class="margin-left">
                <el-button type="info" @click="chooseGoods(2)">选择</el-button>
              </div>
            </div>
            <div class="margin-left-xxl padding-bottom">
              <img
                :src="rowData.thumbnail"
                alt=""
                style="width: 100px; height: 100px"
              />
            </div>
          </div>
          <el-form-item label="盲盒价格">
            <el-input v-model="rowData.price" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="等级概率">
            <div>
              <div class="flex">
                <div>级别</div>
                <div style="margin-left: 60px">概率（百分比）</div>
              </div>
              <div v-for="(key, value, index) in gradeProbability" :key="index">
                <el-form-item
                  :label="
                    index == 0
                      ? '传说'
                      : index === 1
                      ? '史诗'
                      : index == 2
                      ? '稀有'
                      : index === 3
                      ? '尊贵'
                      : index === 4
                      ? '普通'
                      : ''
                  "
                >
                  <el-input-number
                    v-model="gradeProbability[value]"
                    size="small"
                    controls-position="right"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-form-item>
              </div>
              <!-- <el-form-item label="史诗">
                <el-input-number
                  v-model="form.levelMap.level2"
                  size="small"
                  controls-position="right"
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="稀有">
                <el-input-number
                  v-model="form.levelMap.level3"
                  size="small"
                  controls-position="right"
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="尊贵">
                <el-input-number
                  v-model="form.levelMap.level4"
                  size="small"
                  controls-position="right"
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="普通">
                <el-input-number
                  v-model="form.levelMap.level5"
                  size="small"
                  controls-position="right"
                  :min="0"
                  :max="100"
                ></el-input-number>
              </el-form-item> -->
            </div>
          </el-form-item>
          <el-form-item label="推荐状态">
            <el-radio v-model="rowData.recommendStatus" :label="1"
              >推荐</el-radio
            >
            <el-radio v-model="rowData.recommendStatus" :label="2"
              >不推荐</el-radio
            >
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
    <!-- 子表格 -->
    <chooseTable
      :show="showChooseModal"
      @close="close"
      @selectItem="selectItem"
    ></chooseTable>
  </el-card>
</template>
  
  <script>
import axios from "axios";
import addDialog from "./components/addDialog.vue";
import addProduct from "./components/addProduct.vue";
import chooseTable from "@/components/ChooseTable";
export default {
  components: {
    addDialog,
    addProduct,
    chooseTable,
  },
  data() {
    return {
      showAdd: false, // 添加框显示隐藏
      showProduct: false, // 增加产品框
      showEdit: false,
      showChooseModal: false,
      imgType: 1, // 1为首页图片 2 为缩略图
      preview: false,
      url: "", // 预览图片链接
      id: 0,
      colums: [
        // {
        //   type: 'selection'
        // },
        {
          key: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "name",
          label: "名称",
          width: 100,
        },
        {
          key: "otherId",
          label: "首页图片",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.img,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.img);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "url",
          label: "缩略图",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.thumbnail,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.thumbnail);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "price",
          label: "盲盒价格",
        },
        {
          slot: "status",
          label: "上/下架",
        },
        {
          slot: "recommendStatus",
          key: "recommendStatus",
          label: "推荐状态",
        },
        {
          key: "createTime",
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
      condition: {
        // 查询条件
        name: "",
        status: "",
        recommendStatus: "",
      },
      form: {
        // 表单数据
        name: "",
        indexImg: "",
        imgZip: "",
        boxPrice: "",
        levelMap: {
          level1: "",
          level2: "",
          level3: "",
          level4: "",
          level5: "",
        },
        status: "1",
      },
      file: null, // 首页图片文件
      files: null, // 缩略图文件
      gradeProbability: {},
      rowData: {}, // 编辑时那一列的数据 传给子组件
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
      this.get("friends/zBoxs", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        name: this.condition.name,
        recommendStatus: this.condition.recommendStatus,
        status: this.condition.status,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 上传图片
    uploadFile(e, flag) {
      // 1为首页图片 2 为缩略图
      if (flag === 1) {
        this.file = e.target.files[0];
        this.rowData.img =  window.URL.createObjectURL(this.file)
        // this.rowData.img = e.target.value;
      } else {
        this.files = e.target.files[0];
        this.rowData.thumbnail = window.URL.createObjectURL(this.files)
      }
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
    },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/friends/delete", {
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
      this.rowData = row;
      this.showEdit = true;
    },
    queryEditRow() {
      this.get("/friends/queryZBoxsById", {
        id: this.rowData.id,
      }).then((res) => {
        this.rowData = res.data;
        this.gradeProbability = JSON.parse(res.data.gradeProbability);
      });
    },
    addGoods(row) {
      this.id = row.id;
      this.showProduct = true;
    },
    // 选择
    chooseGoods(val) {
      this.imgType = val;
      this.showChooseModal = true;
    },
    // 选中子表格数据
    selectItem(url) {
      if (this.imgType === 1) {
        this.rowData.img = url;
      } else {
        this.rowData.thumbnail = url;
      }
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
    },
    // 查询条件重置
    reset() {
      this.condition.name = "";
      this.condition.recommendStatus = "";
      this.condition.status = "";
      this.queryData();
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
    },
    // 修改状态
    changeStatus(row) {
      this.post("/friends/updateStatus", {
        id: row.id,
        status: row.status,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
    },
    // 修改推荐状态
    changeReStatus(row) {
      this.post("/friends/updateRecommendStatus", {
        id: row.id,
        status: row.recommendStatus,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
    },
    // 选择
    chooseGoods() {
      this.showChooseModal = true;
    },
    // 选择框dialog关闭回调
    close() {
      this.showChooseModal = false;
      this.showAdd;
      this.preview = false;
    },
    // 外部修改新增框关闭
    closed() {
      this.showAdd = false;
      this.showProduct = false;
      this.preview = false;
      this.rowData = {};
      this.gradeProbability = {};
      this.queryData();
    },
    // 编辑时点击确认按钮
    confirmEdit() {
      // 等级概率
      let total = 0;
      for (let [key, value] in this.gradeProbability) {
        console.log(this.gradeProbability[key]);
        total += this.gradeProbability[key];
      }
      if (total != 100) {
        this.$message({
          message: "等级概率不等于100",
          type: "error",
        });
        return;
      }
      let formdata = new FormData();
      if (this.files) {
        formdata.append("files", this.files);
      } else {
        formdata.append("thumbnail", this.rowData.thumbnail);
      }
      if (this.file) {
        formdata.append("file", this.file);
      } else {
        formdata.append("img", this.rowData.img);
      }
      formdata.append("id", this.rowData.id);
      formdata.append("name", this.rowData.name);
      formdata.append("price", this.rowData.price);
      formdata.append("status", this.rowData.status);
      formdata.append(
        "gradeProbability",
        JSON.stringify(this.gradeProbability)
      );
      axios({
        method: "POST",
        url: "/api/friends/update",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formdata,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.showEdit = false;
          this.queryData();
        }
      });
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
</style>