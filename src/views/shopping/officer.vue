<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form ref="condition" :model="form" label-width="80px" class="flex align-center padding-top-lg">
        <el-form-item label="名称">
          <el-input size="small" v-model="condition.name" placeholder="请输入名称" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="上/下架">
          <el-select placeholder="请选择" v-model="condition.status" @change="queryData()" clearable size="small">
            <el-option label="上架" value="2"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐状态">
          <el-select placeholder="请选择状态" v-model="condition.recommendStatus" @change="queryData()" clearable size="small">
            <el-option label="推荐" value="2"></el-option>
            <el-option label="不推荐" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" @click="queryData()" size="small">搜索</el-button>
        <el-button type="info" @click="reset()" size="small">重置</el-button>
      </div>
    </div>
    <Table :tableData="data" :colums="colums" :showFresh="true" :showAdd="true" @addFile="addFile" @fresh="queryData">
      <!-- 表格插槽 -->
      <template v-slot:carouselImage>
        <el-table-column label="盲盒产品轮播图" min-width="180px" align="center">
          <template slot-scope="scope">
            <span class="flex flex-wrap">
              <img :src="item" class="margin-lr-sm margin-tb-sm" style="width: 40px; height: 40px"
                v-for="(item, index) in scope.row.carouselImage.split(',')" :key="index" @click="previewImg(item)" />
            </span>
          </template>
        </el-table-column>
      </template>
      <template v-slot:operation>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-slot:status>
        <el-table-column label="上/下架" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.status" :active-value="2" :inactive-value="1"
              @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </template>
      <template v-slot:recommendStatus>
        <el-table-column label="推荐状态" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.recommendStatus" :active-value="2" :inactive-value="1"
              @change="changeReStatus(scope.row)"></el-switch>
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
    <!-- 添加 -->
    <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()" @open="queryGoods()">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="一级分类" label-width="90px" multiple prop="cidOne">
          <el-select placeholder="请选择" v-model="form.cidOne" clearable style="width: 300px" @change="queryTwo()">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupOne" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="90px" multiple prop="cidTwo">
          <el-select placeholder="请选择" v-model="form.cidTwo" clearable style="width: 300px">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupTwo" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" label-width="90px" prop="name">
          <el-input v-model="form.name" style="width: 300px"></el-input>
        </el-form-item>
        <div>
          <div class="flex">
            <el-form-item label="产品缩略图" class="flex" prop="thumbnailImage">
              <el-input v-model="form.thumbnailImage" disabled style="width: 300px"></el-input>
            </el-form-item>
            <div class="margin-left">
              <input type="file" ref="file" style="display: none" v-on:change="uploadFile($event, 1)" />
              <el-button type="primary" @click="$refs.file.click()">上传</el-button>
            </div>
            <div class="margin-left">
              <el-button type="info" @click="chooseGoods(1)">选择</el-button>
            </div>
          </div>
          <div class="padding-bottom" style="margin-left: 10%">
            <img v-if="form.thumbnailImage" :src="form.thumbnailImage" alt="" style="width: 100px; height: 100px" />
          </div>
        </div>
        <div>
          <div class="flex">
            <el-form-item label="产品轮播图" class="flex" prop="carouselImage">
              <el-input v-model="form.carouselImage" disabled style="width: 300px"></el-input>
            </el-form-item>
            <div class="margin-left">
              <input type="file" ref="files" style="display: none" multiple="multiple"
                v-on:change="uploadFile($event, 2)" />
              <el-button type="primary" @click="$refs.files.click()">上传</el-button>
            </div>
            <div class="margin-left">
              <el-button type="info" @click="chooseGoods(2)">选择</el-button>
            </div>
          </div>
          <div class="flex align-center flex-wrap" style="margin-left: 10% !important">
            <div class="flex margin-lr-sm" style="align-items: baseline" v-for="(item, index) in fileListImg"
              :key="index">
              <div class="flex flex-direction">
                <img v-if="item" :src="item" class="" alt="" style="width: 100px; height: 100px" />
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
        </div>

        <el-form-item label="规格">
          <div class="flex justify-around w6 margin-left-xl">
            <div>规格名称</div>
            <div>参考价格</div>
            <div>盒子数量</div>
            <div>库存</div>
          </div>
          <div class="flex justify-around w6" style="margin-left: 85px" v-for="(item, index) in specList" :key="index">
            <el-input v-model="item.specname" size="small" class="margin-lr-sm"></el-input>
            <el-input v-model="item.specprice" size="small" class="margin-lr-sm"></el-input>
            <el-input v-model="item.boxnum" size="small" class="margin-lr-sm"></el-input>
            <el-input v-model="item.storage" size="small" class="margin-lr-sm"></el-input>
            <div class="flex">
              <i class="el-icon-delete margin-top margin-left" style="font-size: 18px"
                @click="deleteColums(item, index)"></i>
            </div>
          </div>
          <div>
            <el-button type="primary" size="mini" class="margin-sm" style="margin-left: 90px"
              @click="addToColums(item)">追加</el-button>
          </div>
        </el-form-item>
        <el-form-item label="出售开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"
            style="width: 300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出售结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"
            style="width: 300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图文详情" prop="content">
          <quill-editor ref="text" v-model="form.content" class="editor margin-left-xxl" style="height: 300px" />
        </el-form-item>
        <el-form-item label="上/下架" class="margin-top-xxl">
          <el-radio v-model="form.status" label="1">下架</el-radio>
          <el-radio v-model="form.status" label="2">上架</el-radio>
        </el-form-item>
        <el-form-item label="推荐状态">
          <el-radio v-model="form.recommendStatus" label="1">不推荐</el-radio>
          <el-radio v-model="form.recommendStatus" label="2">推荐</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer margin-top-xl">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="showEdit" @close="close()" @open="queryGoods()">
      <el-form :model="rowData" :rules="rules" ref="form">
        <el-form-item label="一级分类" label-width="80px" multiple prop="firstGroup">
          <el-select placeholder="请选择" v-model="rowData.cidOne" clearable style="width: 300px" @change="queryEditTwo()">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupOne" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="80px" multiple prop="secondGroup">
          <el-select placeholder="请选择" v-model="rowData.cidTwo" clearable style="width: 300px">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupTwo" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" label-width="80px" prop="title">
          <el-input v-model="rowData.name" style="width: 300px"></el-input>
        </el-form-item>
        <div>
          <div class="flex">
            <el-form-item label="产品缩略图" class="flex" prop="productImgZip">
              <el-input v-model="rowData.thumbnailImage" style="width: 300px" disabled></el-input>
            </el-form-item>
            <div class="margin-left">
              <input type="file" ref="file" style="display: none" v-on:change="uploadEditFile($event, 1)" />
              <el-button type="primary" @click="$refs.file.click()">上传</el-button>
            </div>
            <div class="margin-left">
              <el-button type="info" @click="chooseGoods(1)">选择</el-button>
            </div>
          </div>
          <div class="padding-bottom" style="margin-left: 10%">
            <img v-if="rowData.thumbnailImage" :src="rowData.thumbnailImage" alt="" style="width: 100px; height: 100px" />
          </div>
        </div>
        <div>
          <div class="flex">
            <el-form-item label="产品轮播图" class="flex" prop="thumbnail">
              <el-input v-model="rowData.carouselImage" style="width: 300px" disabled></el-input>
            </el-form-item>
            <div class="margin-left">
              <input type="file" ref="files" multiple="multiple" style="display: none"
                v-on:change="uploadEditFile($event, 2)" />
              <el-button type="primary" @click="$refs.files.click()">上传</el-button>
            </div>
            <div class="margin-left">
              <el-button type="info" @click="chooseGoods(2)">选择</el-button>
            </div>
          </div>
          <div class="flex align-center flex-wrap" style="margin-left: 10%">
            <div class="flex margin-lr-sm" style="align-items: baseline" v-for="(item, index) in fileListImg"
              :key="index">
              <div class="flex flex-direction">
                <img v-if="item" :src="item" class="" alt="" style="width: 100px; height: 100px" />
                <div style="
                      background-color: #409eff;
                      opacity: 0.6;
                      width: 100px;
                      height: 20px;
                      margin-bottom: 10px;
                      border-radius: 4px;
                    " class="flex justify-center align-center" @click="removeEditImage(item, index)">
                  <i class="el-icon-delete" style="color: white; text-align: center" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-form-item label="规格">
          <div class="flex justify-around w6">
            <div>规格名称</div>
            <div>参考价格</div>
            <div>盒子数量</div>
            <div>库存</div>
          </div>
          <div class="flex justify-around w6" style="margin-left: 75px" v-for="(item, index) in editSpec" :key="index">
            <el-input v-model="item.specname" size="small" class="margin-lr-sm"></el-input>
            <el-input v-model="item.specprice" size="small" class="margin-lr-sm"></el-input>
            <el-input v-model="item.boxnum" size="small" class="margin-lr-sm"></el-input>
            <el-input v-model="item.storage" size="small" class="margin-lr-sm"></el-input>
            <div class="flex">
              <i class="el-icon-delete margin-top margin-left" style="font-size: 18px"
                @click="deleteEditColums(item, index)"></i>
            </div>
          </div>
          <div>
            <el-button type="primary" size="mini" class="margin-sm" style="margin-left: 80px"
              @click="addToEditColums(item)">追加</el-button>
          </div>
        </el-form-item>
        <el-form-item label="出售开始时间" prop="saleStartTime">
          <el-date-picker v-model="rowData.startTime" type="datetime" placeholder="选择日期" style="width: 300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出售结束时间" prop="saleEndTime">
          <el-date-picker v-model="rowData.endTime" type="datetime" placeholder="选择日期" style="width: 300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图文详情" prop="content">
          <quill-editor ref="text" v-model="rowData.content" class="editor margin-left-xxl" style="height: 300px" />
        </el-form-item>
        <el-form-item label="上/下架" class="margin-top-xxl">
          <el-radio v-model="rowData.status" label="1">下架</el-radio>
          <el-radio v-model="rowData.status" label="2">上架</el-radio>
        </el-form-item>
        <el-form-item label="推荐状态">
          <el-radio v-model="rowData.recommendStatus" label="1">不推荐</el-radio>
          <el-radio v-model="rowData.recommendStatus" label="2">推荐</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer margin-top-xl">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
    <!-- 子表格 -->
    <chooseTable :show="showChooseModal" @close="showChooseModal = false" @selectItem="selectItem"></chooseTable>
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
      showEdit: false,
      showChooseModal: false, // 选择子表格文件框
      preview: false,
      url: "",
      file: null,
      files: [], // 轮播图文件
      filesList: [], // 轮播图回显
      fileListImg: [],
      imgType: 1,
      btnType: 1, // 1为新增 2为编辑
      condition: {
        name: "",
        status: "",
        recommendStatus: "",
      },
      // 校验规则
      rules: {
        cidOne: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        cidTwo: [
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
        name: [{ required: true, message: "请填写产品名称", trigger: "blur" }],
        thumbnailImage: [
          { required: true, message: "请上传产品缩略图", trigger: "blur" },
        ],
        carouselImage: [
          { required: true, message: "请上传产品轮播图", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请填写开售时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请填写停售时间", trigger: "blur" },
        ],
      },
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "thumbnailImage",
          props: "thumbnailImage",
          label: "产品缩略图",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.thumbnailImage,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.thumbnailImage);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "name",
          props: "name",
          label: "产品名称",
        },
        {
          slot: "carouselImage",
        },
        {
          prop: "cidOneName",
          key: "cidOneName",
          label: "一级分类名",
        },
        {
          prop: "categoryName",
          key: "categoryName",
          label: "二级分类名",
        },
        {
          slot: "status",
          label: "上/下架",
        },
        {
          slot: "recommendStatus",
          label: "推荐状态",
        },
        {
          prop: "createTime",
          key: "createTime",
          label: "添加时间",
        },
        {
          slot: "operation",
        },
      ],
      specList: [
        {
          specname: "",
          specprice: "",
          boxnum: "",
          storage: "",
        },
      ],
      formItem: {
        specname: "",
        specprice: "",
        boxnum: "",
        storage: "",
      },
      data: [],
      rowData: {},
      form: {
        thumbnailImage: "",
        carouselImage: "",
        cidOne: "",
        cidTwo: "",
        name: "",
        startTime: "",
        endTime: "",
        content: "",
        status: "2",
        recommendStatus: "2",
      },
      groupOne: [], // 一级分类
      groupTwo: [], // 二级分类
      editSpec: [], // 编辑时规格
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
      this.get("/goods/query", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        name: this.condition.name,
        status: this.condition.status,
        recommendStatus: this.condition.recommendStatus,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 查询一级分类
    queryGoods() {
      this.get("/goods/one").then((res) => {
        if (res.data) {
          this.groupOne = res.data;
          this.queryEditTwo();
        }
      });
    },
    // 查询二级分类
    queryTwo() {
      this.get("/goods/two", {
        id: this.form.cidOne,
      }).then((res) => {
        this.groupTwo = res.data;
      });
    },
    queryEditTwo() {
      this.get("/goods/two", {
        id: this.rowData.cidOne,
      }).then((res) => {
        this.groupTwo = res.data;
      });
    },
    // 上传图片
    uploadFile(e, flag) {
      if (flag === 1) {
        this.file = e.target.files[0];
        this.form.thumbnailImage = window.URL.createObjectURL(this.file);
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
        this.form.carouselImage = this.fileListImg.join(",");
        // this.form.carouselImage = window.URL.createObjectURL(this.files);
      }
    },
    // 删除批量上传图片
    removeImage(item, index) {
      this.fileListImg.splice(index, 1);
      this.filesList.splice(index, 1);
      this.files.splice(index, 1);
    },
    // 编辑上传文件
    uploadEditFile(e, flag) {
      if (flag === 1) {
        this.file = e.target.files[0];
        this.rowData.thumbnailImage = window.URL.createObjectURL(this.file);
      } else {
        this.files = e.target.files[0];
        this.fileListImg = [];
        let list = e.target.files;
        list.forEach((element) => {
          this.filesList.push(element);
        });
        this.files = this.filesList;
        // 上传图片回显
        this.filesList.forEach((item) => {
          let url = window.URL.createObjectURL(item);
          this.fileListImg.push(url);
        });
        this.rowData.carouselImage = this.fileListImg.join(",");
        // this.rowData.carouselImage = window.URL.createObjectURL(this.files);
      }
    },
    // 删除批量上传图片
    removeEditImage(item, index) {
      this.fileListImg.splice(index, 1);
      this.filesList.splice(index, 1);
      this.files.splice(index, 1);
    },
    editCancel() {
      this.showEdit = false
      this.fileListImg = []
      this.files = []
      this.filesList = []
    },
    // 选择文件
    chooseGoods(val) {
      this.imgType = val;
      this.showChooseModal = true;
    },
    // 新增
    addFile(val) {
      this.showAdd = val;
      this.btnType = 1;
    },
    // 追加
    addToColums(item) {
      this.formItem = {};
      this.specList.push(this.formItem);
    },
    // 删除规格
    deleteColums(item, index) {
      this.specList.splice(index, 1);
    },
    // 编辑追加规格列表
    addToEditColums(item) {
      this.formItem = {};
      this.editSpec.push(this.formItem);
    },
    // 编辑删除规格列表
    deleteEditColums(item, index) {
      this.editSpec.splice(index, 1);
    },
    // 编辑
    editItem(row) {
      this.btnType = 2;
      // console.log(row);
      this.get("/goods/queryGoods", {
        id: row.id,
      }).then((res) => {
        if (res.code === 200) {
          this.rowData = res.data;
          let jsonobj = JSON.parse(res.data.specs);
          const map = new Map();
          for (const k of Object.keys(jsonobj)) {
            map.set(k, jsonobj[k]);
            // console.log(map)
            this.editSpec = [...map.values()];
          }
        }
      });
      this.showEdit = true;
      this.rowData = this.copy(row);
      this.fileListImg = this.rowData.carouselImage.split(",");
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
      this.form.thumbnailImage = "";
      this.form.carouselImage = "";
      this.form.cidOne = "";
      this.form.cidTwo = "";
      this.form.name = "";
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.content = "";
      this.form.status = "2";
      this.form.recommendStatus = "2";
      this.specList[0].specname = "";
      this.specList[0].specprice = "";
      this.specList[0].boxnum = "";
      this.specList[0].storage = "";
    },
    close() {
      this.showEdit = false;
      this.files = [];
      this.fileListImg = [];
      this.filesList = [];
    },
    closed() {
      this.preview = false;
      this.showAdd = false;
      // this.showEdit = false
      this.form.thumbnailImage = "";
      this.form.carouselImage = "";
      this.form.cidOne = "";
      this.form.cidTwo = "";
      this.form.name = "";
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.content = "";
      this.form.status = "2";
      this.form.recommendStatus = "2";
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
    },
    // 修改状态
    changeStatus(row) {
      this.post("/goods/updateStatus", {
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
      this.post("/goods/updateRecommendStatus", {
        id: row.id,
        status: row.recommendStatus,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
    },
    // 查询条件重置
    reset() {
      this.condition.name = "";
      this.condition.status = "";
      this.condition.recommendStatus = "";
      this.queryData();
    },
    // 点击确认按钮
    confirm() {
      let specMap = new Map();
      for (let i in this.specList) {
        specMap.set(i, this.specList[i]);
      }
      // 转为字符串
      var obj = {};
      for (let [key, value] of specMap) {
        obj[key] = value;
      }
      let data = new FormData();
      if (this.file) {
        data.append("file", this.file);
      } else {
        data.append("thumbnailImage", this.form.productzipimg);
      }
      if (this.files) {
        for (const file of this.files) {
          data.append("files", file);
        }
      }
      let img = [];
      this.fileListImg.forEach((item, index) => {
        if (item.substring(0, 4) !== "blob") {
          img.push(item);
        }
      });
      if (img.length != 0) {
        data.append("carouselImage", img.join(","));
      }
      data.append("cidOne", this.form.cidOne);
      data.append("cidTwo", this.form.cidTwo);
      data.append("name", this.form.name);
      data.append("specs", JSON.stringify(obj));
      data.append("startTime", this.dateTimeFormat(this.form.startTime));
      data.append("endTime", this.dateTimeFormat(this.form.endTime));
      data.append("content", this.form.content);
      data.append("status", this.form.status);
      data.append("recommendStatus", this.form.recommendStatus);
      axios({
        method: "POST",
        url: "/api/goods/insertGoods",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
          this.showAdd = false;
        }
      });
    },
    // 编辑确认修改
    confirmEdit() {
      let specMap = new Map();
      for (let i in this.editSpec) {
        specMap.set(i, this.editSpec[i]);
      }
      // 转为字符串
      var obj = {};
      for (let [key, value] of specMap) {
        obj[key] = value;
      }
      let data = new FormData();
      if (this.file) {
        data.append("file", this.file);
      } else {
        data.append("thumbnailImage", this.rowData.thumbnailImage);
      }
      if (this.files) {
        for (const file of this.files) {
          data.append("files", file);
        }
      }
      let img = [];
      this.fileListImg.forEach((item, index) => {
        if (item.substring(0, 4) !== "blob") {
          img.push(item);
        }
      });
      if (img.length != 0) {
        data.append("carouselImage", img.join(","));
      }
      data.append("id", this.rowData.id);
      data.append("cidOne", this.rowData.cidOne);
      data.append("cidTwo", this.rowData.cidTwo);
      data.append("name", this.rowData.name);
      data.append("specs", JSON.stringify(obj));
      data.append("startTime", this.dateTimeFormat(this.rowData.startTime));
      data.append("endTime", this.dateTimeFormat(this.rowData.endTime));
      data.append("content", this.rowData.content);
      data.append("status", this.rowData.status);
      data.append("recommendStatus", this.rowData.recommendStatus);
      axios({
        method: "POST",
        url: "/api/goods/updateGoods",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
          this.showEdit = false;
        }
      });
    },
    // 选中子表格数据
    selectItem(url) {
      if (this.btnType === 1) {
        if (this.imgType === 1) {
          this.form.thumbnailImage = url;
        } else {
          // this.form.carouselImage = url;
          this.fileListImg.push(url);
          this.form.carouselImage = this.fileListImg.join(",");
        }
      } else {
        if (this.imgType === 1) {
          this.rowData.thumbnailImage = url;
        } else {
          // this.rowData.carouselImage = url;
          this.fileListImg.push(url);
          this.rowData.carouselImage = this.fileListImg.join(",");
        }
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
  
<style scoped></style>