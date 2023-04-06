<template>
  <!-- 添加 -->
  <el-dialog title="添加" :visible.sync="showModal" :show-close="false" @close="closed()">
    <div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="90px"
        label-position="left"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            style="width: 300px"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <div>
          <div class="flex">
            <el-form-item label="首页图片" prop="indexImg">
              <el-input
                v-model="form.indexImg"
                disabled
                style="width: 300px"
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
              v-if="form.indexImg"
              :src="form.indexImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </div>
        </div>
        <div>
          <div class="flex">
            <el-form-item label="缩略图" prop="imgZip">
              <el-input
                v-model="form.imgZip"
                disabled
                style="width: 300px"
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
              v-if="form.imgZip"
              :src="form.imgZip"
              alt=""
              style="width: 100px; height: 100px"
            />
          </div>
        </div>
        <el-form-item label="盲盒价格" prop="boxPrice">
          <el-input
            v-model="form.boxPrice"
            style="width: 300px"
            maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级概率" prop="levelMap">
          <div>
            <div class="flex">
              <div>级别</div>
              <div style="margin-left: 60px">概率（百分比）</div>
            </div>
            <el-form-item label="传说" prop="level1">
              <el-input-number
                v-model="gradeProbabilityList.level1"
                size="small"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="史诗">
              <el-input-number
                v-model="gradeProbabilityList.level2"
                size="small"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="稀有">
              <el-input-number
                v-model="gradeProbabilityList.level3"
                size="small"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="尊贵">
              <el-input-number
                v-model="gradeProbabilityList.level4"
                size="small"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="普通">
              <el-input-number
                v-model="gradeProbabilityList.level5"
                size="small"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="推荐状态" prop="status">
          <el-radio v-model="form.status" label="1">推荐</el-radio>
          <el-radio v-model="form.status" label="2">不推荐</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
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
    rowData: {
      type: Object,
    },
  },
  components: {
    chooseTable,
  },
  data() {
    return {
      showChooseModal: false,
      imgType: 1, // 1为首页图片 2 为缩略图
      file: null,
      files: null,
      gradeProbability: new Map(),
      form: {
        name: "",
        indexImg: "",
        imgZip: "",
        boxPrice: "",
        status: "1",
      },
      gradeProbabilityList: {
        level1: "",
        level2: "",
        level3: "",
        level4: "",
        level5: "",
      },
      list: [],
      // 校验规则
      rules: {
        name: [{ required: true, message: "请输入", trigger: "change" }],
        indexImg: [
          {
            required: true,
            message: "请填写上传首页图片地址",
            trigger: "change",
          },
        ],
        imgZip: [
          {
            required: true,
            message: "请填写上传缩略图片地址",
            trigger: "blur",
          },
        ],
        boxPrice: [
          { required: true, message: "请填写盲盒价格", trigger: "blur" },
        ],
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
        this.form.indexImg = window.URL.createObjectURL(this.file);
      } else {
        this.files = e.target.files[0];
        this.form.imgZip = window.URL.createObjectURL(this.files);
      }
    },
    // 选择
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
      this.$emit('closed')
      this.showModal = false;
      this.$refs["form"].resetFields();
      this.file = null;
      this.files = null;
      this.gradeProbabilityList.level1 = "";
      this.gradeProbabilityList.level2 = "";
      this.gradeProbabilityList.level3 = "";
      this.gradeProbabilityList.level3 = "";
      this.gradeProbabilityList.level4 = "";
    },
    // 点击确认按钮
    confirm() {
      let total = 0;
      // 概率
      for (let i in this.gradeProbabilityList) {
        total += this.gradeProbabilityList[i];
        this.list.push(this.gradeProbabilityList[i]);
      }
      if (total != 100) {
        this.$message({
          message: "等级概率不等于100",
          type: "error",
        });
      }
      // map
      for (let j in this.list) {
        this.gradeProbability.set(j, this.list[j]);
      }
      var obj = {};
      for (let [key, value] of this.gradeProbability) {
        obj[key] = value;
      }
      this.$refs.form.validate((valid) => {
        if (valid && total === 100) {
          let formdata = new FormData();
          if (this.files) {
            formdata.append("files", this.files);
          } else {
            formdata.append("thumbnail", this.form.imgZip);
          }
          if (this.file) {
            formdata.append("file", this.file);
          } else {
            formdata.append("img", this.form.indexImg);
          }

          formdata.append("name", this.form.name);
          formdata.append("price", this.form.boxPrice);
          formdata.append("status", this.form.status);
          formdata.append("gradeProbability", JSON.stringify(obj));
          axios({
            method: "POST",
            url: "/api/friends/insert",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: formdata,
          }).then((res) => {
            if (res.data.code === 200) {
              this.showSuccess();
              // this.$emit("closed");
              this.showModal = false;
            }
          });
        }
      });
    },
    // 选中子表格数据
    selectItem(url) {
      if (this.imgType === 1) {
        this.form.indexImg = url;
      } else {
        this.form.imgZip = url;
      }
    },
    cancel() {
      this.closed();
      this.showModal = false
      this.$emit("closed");
    },
  },
};
</script>

<style>
</style>