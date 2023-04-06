<template>
  <!-- 添加 -->
  <el-dialog title="添加" :visible.sync="showModal" @closed="closed()">
    <div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        label-position="left"
      >
        <el-form-item label="盲盒产品名" prop="name">
          <el-input
            v-model="form.name"
            style="width: 300px"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="盲盒产品参考价格" prop="price">
          <el-input
            v-model="form.price"
            style="width: 300px"
            maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="goodsGrade">
          <el-select placeholder="" v-model="form.goodsGrade" clearable>
            <el-option label="传说" value="1"></el-option>
            <el-option label="史诗" value="2"></el-option>
            <el-option label="稀有" value="3"></el-option>
            <el-option label="尊贵" value="4"></el-option>
            <el-option label="普通" value="5"></el-option>
          </el-select>
        </el-form-item>
        <div>
          <div class="flex">
            <el-form-item label="盲盒产品缩略图" prop="productzipimg">
              <el-input
                v-model="form.productzipimg"
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
          <div style="margin-left: 15%">
            <img
              v-if="form.productzipimg"
              :src="form.productzipimg"
              class="padding-bottom"
              alt=""
              style="width: 100px; height: 100px"
            />
          </div>
        </div>
        <div>
          <div class="flex">
            <el-form-item label="首页产品轮播图" prop="imglunbo">
              <el-input
                v-model="form.imglunbo"
                style="width: 300px"
                disabled
              ></el-input>
            </el-form-item>
            <div class="margin-left">
              <input
                type="file"
                ref="files"
                multiple="multiple"
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
          <div class="flex align-center flex-wrap" style="margin-left: 15%">
            <div
              class="flex margin-lr-sm"
              style="align-items: baseline"
              v-for="(item, index) in fileListImg"
              :key="index"
            >
              <div class="flex flex-direction">
                <img
                  v-if="item"
                  :src="item"
                  class=""
                  alt=""
                  style="width: 100px; height: 100px"
                />
                <div
                  style="
                    background-color: #409eff;
                    opacity: 0.6;
                    width: 100px;
                    height: 20px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                  "
                  class="flex justify-center align-center"
                  @click="removeImage(item, index)"
                >
                  <i
                    class="el-icon-delete"
                    style="color: white; text-align: center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-form-item label="图文详情" prop="content">
          <quill-editor
            ref="text"
            v-model="form.content"
            class="editor"
            :options="editorOption"
            style="height: 100px"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer margin-top-xl">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </div>
    <!-- 子表格 -->
    <chooseTable
      :show="showChooseModal"
      @close="close"
      @selectItem="selectItem"
    ></chooseTable>
  </el-dialog>
</template>
  
  <script>
import chooseTable from "@/components/ChooseTable";
import axios from "axios";
export default {
  props: {
    show: {
      type: Boolean,
    },
  },
  components: {
    chooseTable,
  },
  data() {
    return {
      editorOption: {},
      showChooseModal: false,
      imgType: 1,
      file: null,
      files: [], // 轮播图文件
      filesList: [], // 轮播图回显
      fileListImg: [],
      form: {
        name: "",
        productzipimg: "",
        imglunbo: "",
        price: "",
        status: "1",
        goodsGrade: "",
      },
      // 校验规则
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        imglunbo: [
          { required: true, message: "请选择上传图片", trigger: "blur" },
        ],
        productzipimg: [
          { required: true, message: "请填写上传图片地址", trigger: "blur" },
        ],
        price: [{ required: true, message: "请填写盲盒价格", trigger: "blur" }],
        goodsGrade: [{ required: true, message: "请选择等级", trigger: "change" }],
      },
    };
  },
  computed: {
    showModal: {
      get() {
        return this.show;
      },
      set(v) {
        return v;
      },
    },
  },
  methods: {
    // 上传图片
    uploadFile(e, val) {
      if (val === 1) {
        this.file = e.target.files[0];
        this.form.productzipimg = window.URL.createObjectURL(this.file);
      } else {
        this.files = e.target.files
        this.fileListImg = []
        let list = e.target.files;
        list.forEach((element) => {
          console.log(element);
          this.filesList.push(element);
        });
        this.files = this.filesList;
        this.filesList.forEach((item) => {
          let url = window.URL.createObjectURL(item);
          this.fileListImg.push(url);
        });
        this.form.imglunbo = this.fileListImg.join(",");
        // this.form.imglunbo =  window.URL.createObjectURL(this.files);
      }
    },
    removeImage(item, index) {
      this.fileListImg.splice(index, 1);
      this.filesList.splice(index, 1);
      this.files.splice(index, 1);
    },
    // 选择子表格数据
    chooseGoods(val) {
      this.imgType = val;
      this.showChooseModal = true;
    },
    // 选择框dialog关闭回调
    close() {
      this.showChooseModal = false;
    },
    // 外部修改新增框关闭
    closed() {
      // this.form.resetFields();
      this.form.name = "";
      this.form.productzipimg = "";
      this.form.imglunbo = "";
      this.form.boxPrice = "";
      this.form = {};
      this.$emit("closed");
      this.showModal = false;
      this.files = [];
      this.fileListImg = [];
      this.filesList = [];
      this.file = null;
    },
    // 点击确认按钮
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formdata = new FormData();
          if (this.file) {
            formdata.append("file", this.file);
          } else {
            formdata.append("thumbnail", this.form.productzipimg);
          }
          if (this.files) {
            for(const file of this.files) {
              formdata.append('files', file)
            }
          }
          let img = []
          this.fileListImg.forEach((item, index) => {
            if (item.substring(0,4) !== 'blob') {
              img.push(item)
            }
          })
          if (img.length != 0) {
            formdata.append("rotationMap", img.join(","));
          }
          formdata.append("name", this.form.name);
          formdata.append("price", this.form.price);
          formdata.append("goodsGrade", this.form.goodsGrade);
          formdata.append("content", this.form.content);
          axios({
            method: "POST",
            url: "/api/friends/insertZBoxs",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: formdata,
          }).then(
            (res) => {
              if (res.data.code === 200) {
                this.$emit("closed");
                this.showModal = false;
                this.form.imglunbo = "";
                this.form.productzipimg = "";
                this.showSuccess();
              } else {
                this.$message({
                  message: res.data.message,
                  type: "error",
                });
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
    },
    // 选中子表格数据
    selectItem(url) {
      if (this.imgType === 1) {
        this.form.productzipimg = url;
      } else {
        // this.form.imglunbo = url;
        this.fileListImg.push(url);
        this.form.imglunbo = this.fileListImg.join(",");
      }
    },
    cancel() {
      this.$emit("cancel");
      this.files = []
      this.fileListImg = []
      this.filesList = []
      // this.form = {};
      this.$refs["form"].resetFields();
    },
  },
};
</script>
  
  <style scoped>
.el-select {
  width: 300px;
}
</style>