<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form ref="condition" :model="form" label-width="120px" class="flex align-center padding-top-lg">
        <el-form-item label="盲盒产品名">
          <el-input size="small" v-model="condition.name" placeholder="请输入盲盒产品名"></el-input>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" @click="queryData()" size="small">搜索</el-button>
        <el-button type="info" @click="reset()" size="small">重置</el-button>
      </div>
    </div>

    <Table :tableData="data" :colums="colums" :showFresh="true" :showAdd="true" :showDelete="true"
      @deleteItem="deleteItem" @addFile="addFile" @fresh="queryData">
      <template v-slot:operation>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" size="small" slot="reference" @click="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </template>
      <!-- 表格插槽 -->
      <template v-slot:rotationMap>
        <el-table-column label="盲盒产品轮播图" min-width="180px" align="center">
          <template slot-scope="scope">
            <span class="flex flex-wrap">
              <img :src="item" class="margin-lr-sm margin-tb-sm" style="width: 40px; height: 40px"
                v-for="(item, index) in scope.row.rotationMap.split(',')" :key="index" @click="previewImg(item)" />
            </span>
          </template>
        </el-table-column>
      </template>
    </Table>
    <div class="block margin-top flex justify-end">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current"
        :page-sizes="[5, 10, 20, 40]" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <!-- 新增 -->
    <boxListAdd :show="showAdd" @closed="closed()" @cancel="cancel"></boxListAdd>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()">
      <div>
        <el-form ref="form" :model="form" label-width="130px" label-position="left">
          <el-form-item label="盲盒产品名">
            <el-input v-model="rowData.name" style="width: 300px" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="盲盒产品参考价格">
            <el-input v-model="rowData.price" style="width: 300px" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item label="等级">
            <el-select placeholder="" v-model="rowData.goodsGrade" clearable style="width: 300px">
              <el-option label="传说" :value="1"></el-option>
              <el-option label="史诗" :value="2"></el-option>
              <el-option label="稀有" :value="3"></el-option>
              <el-option label="尊贵" :value="4"></el-option>
              <el-option label="普通" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <div class="flex">
              <el-form-item label="盲盒产品缩略图">
                <el-input v-model="rowData.thumbnail" style="width: 300px" disabled></el-input>
              </el-form-item>
              <div class="margin-left">
                <input type="file" ref="file" style="display: none" v-on:change="uploadFile($event, 1)" />
                <el-button type="primary" @click="$refs.file.click()">上传</el-button>
              </div>
              <div class="margin-left">
                <el-button type="info" @click="chooseGoods(1)">选择</el-button>
              </div>
            </div>
            <div style="margin-left: 15%">
              <img v-if="rowData.thumbnail" :src="rowData.thumbnail" class="padding-bottom" alt=""
                style="width: 100px; height: 100px" />
            </div>
          </div>
          <div>
            <div class="flex">
              <el-form-item label="首页产品轮播图">
                <el-input v-model="rowData.rotationMap" style="width: 300px" disabled></el-input>
              </el-form-item>
              <div class="margin-left">
                <input type="file" ref="files" multiple="multiple" style="display: none"
                  v-on:change="uploadFile($event, 2)" />
                <el-button type="primary" @click="$refs.files.click()">上传</el-button>
              </div>
              <div class="margin-left">
                <el-button type="info" @click="chooseGoods(2)">选择</el-button>
              </div>
            </div>
            <div class="flex align-center flex-wrap" style="margin-left: 15%">
              <div class="flex margin-lr-sm" style="align-items: baseline" v-for="(item, index) in fileListImg"
                :key="index">
                <div class="flex flex-direction">
                  <img v-if="item" :src="item" class="" style="width: 100px; height: 100px" />
                  <div style="
                        background-color: #409eff;
                        opacity: 0.6;
                        width: 100px;
                        height: 20px;
                        margin-bottom: 10px;
                        border-radius: 4px;
                      " class="flex justify-center align-center" @click="removeImage(item, index)">
                    <i class="el-icon-delete" style="color: white; text-align: center" />
                  </div>
                </div>
              </div>
            </div>
            <!-- <div style="margin-left: 15%">
              <img
                v-if="rowData.rotationMap"
                :src="rowData.rotationMap"
                class="padding-bottom"
                alt=""
                style="width: 100px; height: 100px"
              />
            </div> -->
          </div>

          <el-form-item label="图文详情">
            <quill-editor ref="text" v-model="rowData.content" class="editor" style="height: 200px" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer margin-top-xl">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
      <!-- 子表格 -->
      <chooseTable :show="showChooseModal" @close="closed" @selectItem="selectItem"></chooseTable>
    </el-dialog>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
  </el-card>
</template>
  
<script>
import boxListAdd from "./components/boxListAdd.vue";
import chooseTable from "@/components/ChooseTable";
import axios from "axios";
export default {
  components: {
    boxListAdd,
    chooseTable,
  },
  data() {
    return {
      showAdd: false,
      showEdit: false,
      showChooseModal: false, // 选择子表格文件框
      rowData: {},
      imgType: "",
      preview: false,
      url: "",
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "name",
          label: "盲盒产品名",
          width: 100,
        },
        {
          key: "price",
          props: "price",
          label: "盲盒产品参考价格",
        },
        {
          key: "goodsGrade",
          props: "goodsGrade",
          label: "等级",
          render: (h, params) => {
            switch (params.row.goodsGrade) {
              case 1:
                return h("div", "传说");
                break;
              case 2:
                return h("div", "史诗");
                break;
              case 3:
                return h("div", "稀有");
                break;
              case 4:
                return h("div", "尊贵");
                break;
              case 5:
                return h("div", "普通");
                break;
            }
          },
        },
        {
          prop: "thumbnail",
          key: "thumbnail",
          label: "盲盒产品缩略图",
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
          slot: "rotationMap",
          key: "rotationMap",
          label: "盲盒产品轮播图",
          // render: (h, params) => {
          //   return h("div", [
          //     h("img", {
          //       domProps: {
          //         src: params.row.rotationMap.split(','),
          //       },
          //       style: {
          //         width: "40px",
          //         height: "40px",
          //       },
          //       on: {
          //         click: () => {
          //           this.previewImg(params.row.thumbnail);
          //         },
          //       },
          //     }),
          //   ]);
          // },
        },
        {
          prop: "createTime",
          key: "createTime",
          label: "添加时间",
        },
        {
          slot: "operation",
          label: "操作",
        },
      ],
      condition: {
        name: "",
      }, // 查询条件
      file: null, //缩略图上传文件
      files: [], //轮播图上传文件
      filesList: [],
      fileListImg: [],
      data: [],
      form: {},
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
      this.get("/friends/goodsPage", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        name: this.condition.name,
      }).then((res) => {
        if (res.data.records) {
          this.data = res.data.records;
          this.page.total = res.data.total;
        }
      });
    },
    // 上传文件
    uploadFile(e, val) {
      if (val === 1) {
        this.file = e.target.files[0];
        this.rowData.thumbnail = window.URL.createObjectURL(this.file);
      } else {
        this.fileListImg = [];
        let list = e.target.files;
        list.forEach((element) => {
          this.filesList.push(element);
        });
        this.files = this.filesList;
        this.filesList.forEach((item) => {
          let url = window.URL.createObjectURL(item);
          this.fileListImg.push(url);
        });
        this.rowData.rotationMap = this.fileListImg.join(",");
        // this.rowData.rotationMap = window.URL.createObjectURL(this.files);
      }
    },
    // 删除已上传文件
    removeImage(item, index) {
      this.fileListImg.splice(index, 1);
      this.filesList.splice(index, 1);
      this.files.splice(index, 1);
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
          this.post("/friends/deleteZBoxs", {
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
      this.showEdit = true;
      this.rowData = this.copy(row);
      this.fileListImg = this.rowData.rotationMap.split(",");
    },
    // 选择文件
    chooseGoods(val) {
      this.imgType = val;
      this.showChooseModal = true;
    },
    // 取消
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
      this.preview = false;
    },
    closed() {
      this.showAdd = false;
      this.queryData();
      this.preview = false;
      this.files = [];
      this.filesList = [];
      this.file = null;
    },
    // 查询条件重置
    reset() {
      this.condition.name = "";
      this.queryData();
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
    },
    // 点击确认按钮
    confirmEdit() {
      // friends/updateZBoxs
      let formdata = new FormData();
      formdata.append("id", this.rowData.id);
      if (this.file) {
        formdata.append("file", this.file);
      } else {
        formdata.append("thumbnail", this.rowData.thumbnail);
      }
      if (this.files) {
        for (const file of this.files) {
          formdata.append("files", file);
        }
      }
      let img = [];
      this.fileListImg.forEach((item, index) => {
        if (item.substring(0, 4) !== "blob") {
          img.push(item);
        }
      });
      if (img.length != 0) {
        formdata.append("rotationMap", img.join(","));
      }
      formdata.append("name", this.rowData.name);
      formdata.append("price", this.rowData.price);
      formdata.append("goodsGrade", this.rowData.goodsGrade);
      formdata.append("content", this.rowData.content);
      axios({
        method: "POST",
        url: "/api/friends/updateZBoxs",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formdata,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showEdit = false;
          this.queryData();
          this.form.imgZip = "";
          this.form.indexImg = "";
          this.showSuccess();
        }
      });
    },
    // 选中子表格数据
    selectItem(url) {
      if (this.imgType === 1) {
        this.rowData.thumbnail = url;
      } else {
        // this.rowData.rotationMap = url;
        console.log(url);
        this.fileListImg.push(url);
        console.log(this.fileListImg);
        this.rowData.rotationMap = this.fileListImg.join(",");
      }
      this.showChooseModal = false;
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
  
<style></style>