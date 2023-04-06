<template>
  <div>
    <el-dialog
      title="添加"
      :visible.sync="showModal"
      v-if="show"
      @close="cancel()"
      :show-close="false"
    >
      <el-form :model="form" :rules="rules" class="flex" ref="form">
        <!-- <el-form-item label="上传到本地" :label-width="formLabelWidth">
          <el-input v-model="localFileUrl" autocomplete="off"></el-input>
          <div class="flex align-center">
            <el-select
              v-model="localType"
              placeholder="请选择一个类别"
              class="margin-top"
            >
              <el-option label="分类一" value="1"></el-option>
              <el-option label="分类二" value="2"></el-option>
              <el-option label="自定义" value="3"></el-option>
              <el-option label="未归类" value="4"></el-option>
            </el-select>
            <el-upload
              action="#"
              class="avatar-uploader margin-top margin-left"
              :show-file-list="false"
              :on-success="handleLocalSuccess"
              :before-upload="beforeLocalUpload"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </el-form-item> -->
        <el-form-item
          label="上传到第三方"
          :label-width="formLabelWidth"
          prop="fileUrl"
        >
          <el-input
            v-model="form.fileUrl"
            autocomplete="off"
            disabled
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <div class="flex align-center">
          <el-form-item prop="otherType">
            <el-select
              v-model="form.otherType"
              placeholder="请选择一个类别"
              class="margin-left"
            >
              <el-option label="分类一" value="1"></el-option>
              <el-option label="分类二" value="2"></el-option>
              <el-option label="自定义" value="3"></el-option>
              <el-option label="未归类" value="4"></el-option>
            </el-select>
            <input
              type="file"
              ref="files"
              accept="image/jpg, image/png, image/gif, image/jpeg"
              style="display: none"
              v-on:change="uploadFile($event)"
            />
            <el-button
              type="primary"
              @click="$refs.files.click()"
              class="margin-left"
              >上传</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <div style="margin-left: 13%">
        <img
          v-if="form.fileUrl"
          :src="form.fileUrl"
          alt=""
          style="width: 100px; height: 100px"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        fileUrl: "",
        otherType: "",
      },
      file: null,
      formLabelWidth: "120px",
      // fileUrl: "", // 第三方
      // localFileUrl: "", //本地
      // localType: "",
      // otherType: "",
      // 校验规则
      rules: {
        otherType: [
          { required: true, message: "请选择类别", trigger: "change" },
        ],
        fileUrl: [
          { required: true, message: "请填写上传图片地址", trigger: "blur" },
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
    uploadFile(e) {
      console.log(e);
      let h = e.target.value.split(".")[1];
      if (h === "webp") {
        this.$message({
          type: "error",
          message: "不支持webp格式文件!!",
        });
      } else {
        this.file = e.target.files[0];
        this.form.fileUrl = window.URL.createObjectURL(this.file);
      }
    },
    // 第三方上传
    handleOtherSuccess(file) {
      this.fileUrl = URL.createObjectURL(file);
      this.file = file;
    },
    beforeOtherUpload(file) {
      this.handleOtherSuccess(file);
    },
    // // 本地上传
    // handleLocalSuccess(file) {
    //   console.log(file)
    //   this.localFileUrl = URL.createObjectURL(file);
    //   let data = new FormData();
    //   data.append("storageType", 1);
    //   data.append("file", file);
    //   data.append("classify", this.localType);
    //   data.append("isAdmin", 1);
    //   if (this.localType && this.localFileUrl) {
    //     axios({
    //       method: "POST",
    //       url: "/api/zAttachment/upload",
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //       data: data,
    //     }).then((res) => {
    //       if (res.data.code === 200) {
    //         this.showSuccess();
    //       }
    //     });
    //   } else {
    //     this.$message({
    //       type: "success",
    //       message: "请上传并选择分类!",
    //     });
    //   }
    // },
    // beforeLocalUpload(file) {
    //   this.handleLocalSuccess(file);
    // },
    cancel() {
      this.form.fileUrl = "";
      this.form.otherType = "";
      this.file = null;
      // this.$refs["form"].resetFields();
      this.showModal = false;
      this.$emit("cancel");
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = new FormData();
          data.append("storageType", 2);
          data.append("file", this.file);
          data.append("classify", this.form.otherType);
          data.append("isAdmin", 1);
          if (this.form.otherType) {
            axios({
              method: "POST",
              url: "/api/zAttachment/upload",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: data,
            }).then((res) => {
              if (res.data.code === 200) {
                this.showSuccess();
                this.$emit("cancel");
                this.showModal = false;
                this.cancel();
              } else {
                this.$message({
                  message: "添加失败",
                  type: "error",
                });
              }
            });
          } else {
            this.$message({
              type: "success",
              message: "请选择分类!",
            });
          }
        }
      });
    },
  },
};
</script>

<style>
</style>