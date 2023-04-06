<template>
  <div>
    <el-card>
      <div
        style="
          font-size: 18px;
          font-weight: 600;
          border-bottom: 3px solid #2f80ed;
          width: 80px;
        "
        class="padding-tb-sm"
      >
        基础配置
      </div>
      <div class="margin-top-lg">
        <!-- <div style="font-size: 14px; color: red; padding: 10px 0">
          注意事项：下面表单需是整数填入非整数时会自动更新为整数,需是数字会自动保存两位小数
        </div> -->
        <div>
          <el-form
            label-position="left"
            v-for="(item, index) in config"
            :key="item.id"
          >
            <el-form-item
              :label="item.title"
              :label-width="formLabelWidth"
              v-if="
                item.title !== '会员收费管理' && item.title !== '客服二维码'
              "
              :class="{ 'bg-gray': index % 2 == 0 }"
            >
              <el-input
                v-model="item.value"
                :type="
                  item.id == 28 ||
                  item.id == 29 ||
                  item.id == 30 ||
                  item.id == 33
                    ? 'textarea'
                    : 'input'
                "
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="会员收费管理"
              v-if="item.title === '会员收费管理'"
              :label-width="formLabelWidth"
              class="bg-gray"
            >
              <div class="flex">
                <div>
                  <div class="flex">
                    <div>会员类型</div>
                    <div class="margin-left-xxl">会员费用</div>
                  </div>
                  <div
                    class="flex align-center"
                    v-for="(key, value, index) in item.zuserFeesResult"
                    :key="index"
                  >
                    <el-form-item
                      :label="
                        value == 'monthly'
                          ? '月度'
                          : value == 'quarter'
                          ? '季度'
                          : value == 'year'
                          ? '年度'
                          : ''
                      "
                      label-width="40px"
                    >
                      <input
                        autocomplete="off"
                        type="number"
                        :min="0"
                        :max="10000"
                        v-model="item.zuserFeesResult[value]"
                        class="vipInput margin-left-xxl"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-form-item>
            <div>
              <el-form-item
                label="客服二维码"
                v-if="item.title === '客服二维码'"
                :label-width="formLabelWidth"
                class="bg-gray"
              >
                <div class="flex">
                  <el-input
                    v-model="fileUrl"
                    style="width: 500px !important"
                    disabled
                  ></el-input>
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <div class="flex margin-left">
                      <el-button size="small" type="primary"
                        >点击上传</el-button
                      >
                      <el-button
                        size="small"
                        type="info"
                        @click.stop="chooseFile()"
                        >点击选择</el-button
                      >
                      <input type="file" ref="file" />
                    </div>
                  </el-upload>
                </div>
                <div>
                  <img
                    :src="fileUrl"
                    alt=""
                    style="width: 120px; height: 120px"
                    class="margin-tb"
                  />
                </div>
              </el-form-item>
            </div>
          </el-form>
          <div>
            <div class="margin-top-xxl flex align-center justify-center">
              <el-button @click="cancel()">重置</el-button>
              <el-button type="primary" @click="confirm()">确 定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 子表格 -->
    <chooseTable
      :show="showTableModal"
      @close="close"
      @selectItem="selectItem"
    ></chooseTable>
  </div>
</template>

<script>
import chooseTable from "@/components/ChooseTable";
import axios from "axios";
export default {
  components: {
    chooseTable,
  },
  data() {
    return {
      config: [],
      fileUrl: "",
      fileList: [],
      file: null,
      id: "",
      formLabelWidth: "280px",
      showTableModal: false,
      activeName: "1",
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.queryConfig();
  },
  methods: {
    queryConfig() {
      this.get("/banner/config").then((res) => {
        this.config = res.data;
        this.config.forEach((item) => {
          if (item.title === "客服二维码") {
            this.fileUrl = item.value;
          }
        });
      });
    },
    // 上传客服二维码
    handleAvatarSuccess(file) {
      this.file = file;
      this.fileUrl = URL.createObjectURL(file);
      this.config.forEach((item) => {
        if (item.title === "客服二维码") {
          item.value = this.fileUrl;
          this.id = item.id;
        }
      });
      let data = new FormData();
      data.append("id", this.id);
      data.append("file", this.file);
      axios({
        method: "POST",
        url: "/api/banner/updateUploadFile",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }).then((res) => {
        if (res.data.success) {
          this.showSuccess();
        } else {
          this.$message({
            message: "上传失败",
            type: "error",
          });
        }
      });
    },
    beforeAvatarUpload(file) {
      this.handleAvatarSuccess(file);
    },
    // 选择客服二维码文件
    chooseFile() {
      this.showTableModal = true;
    },
    close() {},
    // 选中子表格数据
    selectItem(url) {
      this.fileUrl = url;
      this.config.forEach((item) => {
        if (item.title === "客服二维码") {
          item.value = this.fileUrl;
          this.id = item.id;
        }
      });
      this.showTableModal = false;
      let data = new FormData();
      data.append("value", this.fileUrl);
      data.append("id", this.id);
      axios({
        method: "post",
        url: "/api/banner/updateUploadFile",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }).then((res) => {
        if (res.data.success) {
          this.showSuccess();
        }
      });
    },
    // 修改确定
    confirm() {
      let data = {};
      data["configList"] = this.config;
      // Object.assign(data, this.config);
      // this.post('/banner/updateConfig', {
      //   configList: data
      // }).then(res => {
      //   console.log(res)
      // })
      axios({
        method: "POST",
        dataType: "JSON",
        url: "/api/banner/updateConfig",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryConfig();
        } else {
          this.$message({
            message: "修改配置失败",
            type: "error",
          });
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.page.size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getData();
    },
  },
};
</script>

<style scoped>
.vipInput,
.uploadInput {
  width: 150px !important;
  border: 1px solid #dcdfe6;
  padding: 6px 20px;
  border-radius: 4px;
}
.uploadInput {
  width: 400px !important;
  margin-right: 10px;
  height: 40px !important;
}
.el-input,
.el-textarea__inner,
.el-textarea {
  width: 800px !important;
}
.el-form-item__label {
  text-align: justify !important;
}
.bg-gray {
  background: #f9f9f9;
  padding: 8px 0;
}
.el-form-item {
  margin-bottom: 8px;
  padding: 0 8px;
}
</style>