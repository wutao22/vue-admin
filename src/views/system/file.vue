<template>
  <div>
    <el-card class="">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0"> </el-tab-pane>
        <el-tab-pane label="分类一" name="1"></el-tab-pane>
        <el-tab-pane label="分类二" name="2"></el-tab-pane>
        <el-tab-pane label="自定义" name="3"></el-tab-pane>
        <el-tab-pane label="未归类" name="4"></el-tab-pane>
      </el-tabs>
      <!-- 搜索条件 -->
      <div class="flex justify-between align-center">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          class="flex padding-top"
        >
          <el-form-item label="类型">
            <el-select
              size="small"
              placeholder="请选择类型"
              v-model="form.category"
              @change="getData()"
              clearable
            >
              <el-option label="分类一" value="1"></el-option>
              <el-option label="分类二" value="2"></el-option>
              <el-option label="自定义" value="3"></el-option>
              <el-option label="未归类" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件名">
            <el-input
              size="small"
              v-model="form.fileName"
              placeholder="请输入文件名"
            ></el-input>
          </el-form-item>
          <el-form-item label="图片类型">
            <el-select
              size="small"
              placeholder="请选择类型"
              v-model="form.imgType"
              clearable
              @change="getData()"
            >
              <el-option label="PNG" value="PNG"></el-option>
              <el-option label="JPG" value="JPG"></el-option>
              <el-option label="GIF" value="GIF"></el-option>
              <el-option label="GPEG" value="GPEG"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              size="small"
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="getData()"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="flex justify-center align-center">
          <el-button type="primary" size="small" @click="getData()"
            >搜索</el-button
          >
          <el-button type="info" size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <Table
        :tableData="data"
        :colums="colums"
        :showFresh="true"
        :showAdd="true"
        :showDelete="true"
        :showGroup="true"
        @deleteItem="deleteItem"
        @addFile="addFile"
        @groupClassify="groupClassify"
        @fresh="getData"
      >
        <template v-slot:operation>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="editItem(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
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
    </el-card>
    <!-- 添加附件Modal -->
    <addModal :show="showAdd" @cancel="cancel"></addModal>
    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="showEdit"
      v-if="showEdit"
      @closed="cancel"
    >
      <el-form :model="editForm">
        <el-form-item label="类别" :label-width="formLabelWidth">
          <el-input v-model="editForm.classify" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物理路径" :label-width="formLabelWidth">
          <el-input v-model="editForm.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宽度" :label-width="formLabelWidth">
          <el-input v-model="editForm.imagewidth" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.imageheight"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片类型" :label-width="formLabelWidth">
          <el-input v-model="editForm.imagetype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片帧数" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.imageframes"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件名" :label-width="formLabelWidth">
          <el-input v-model="editForm.filename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Mime类型" :label-width="formLabelWidth">
          <el-input v-model="editForm.mimetype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="透传数据" :label-width="formLabelWidth">
          <el-input v-model="editForm.extparam" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传时间" :label-width="formLabelWidth">
          <el-input v-model="editForm.uploadtime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="存储引擎" :label-width="formLabelWidth">
          <el-input v-model="editForm.storage" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 归类 -->
    <el-dialog title="归类" :visible.sync="showGroup" width="30%" center>
      <el-form ref="form" :model="form" label-width="80px" class="flex">
        <el-form-item label="类型">
          <el-select placeholder="请选择类型" v-model="groupType" clearable>
            <el-option label="分类一" value="1"></el-option>
            <el-option label="分类二" value="2"></el-option>
            <el-option label="自定义" value="3"></el-option>
            <el-option label="未归类" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="comfirmGroup()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
  </div>
</template>

<script>
// import editModal from "./components/editModal.vue";
import { thisTypeAnnotation } from "babel-types";
import axios from "axios";
import addModal from "./components/addModal.vue";
export default {
  components: {
    addModal,
  },
  data() {
    return {
      activeName: "0",
      data: [],
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
          key: "classify",
          props: "classify",
          label: "类别",
          width: 100,
          render: (h, params) => {
            switch (params.row.classify) {
              case "1":
                return h("div", "分类一");
                break;
              case "2":
                return h("div", "分类二");
                break;
              case "3":
                return h("div", "自定义");
                break;
              case "4":
                return h("div", "未归类");
                break;
            }
          },
        },
        {
          key: "otherId",
          label: "预览",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.url,
                },
                style: {
                  width: "100px",
                  height: "50px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.url);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "filename",
          props: "filename",
          label: "文件名",
        },
        {
          key: "filesize",
          props: "filesize",
          label: "文件大小",
          sortable: true,
        },
        {
          key: "imagewidth",
          props: "imagewidth",
          label: "宽度",
          sortable: true,
        },
        {
          key: "imageheight",
          props: "imageheight",
          label: "高度",
          sortable: true,
        },
        {
          key: "imagetype",
          props: "imagetype",
          label: "图片类型",
        },
        // {
        //   props: "",
        //   label: "存储引擎",
        // },
        {
          key: "mimetype",
          props: "mimetype",
          label: "Mime类型",
        },
        {
          key: "extparam",
          props: "extparam",
          label: "创建日期",
        },
        {
          slot: "operation",
          label: "操作",
        },
      ],
      showAdd: false,
      showEdit: false,
      showGroup: false,
      fileUrl: "", // 第三方
      localFileUrl: "", //本地
      form: {},
      editForm: {
        classify: "",
        url: "",
        imagewidth: "",
        imageheight: "",
        imagetype: "",
        imageframes: "",
        filename: "",
        mimetype: "",
        extparam: "",
        uploadtime: "",
        storage: "",
      },
      form: {
        category: "",
        imgType: "",
        fileName: "",
      },
      date: [],
      formLabelWidth: "100px",
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      preview: false,
      url: "", // 预览图片链接
      groupType: "",
      groupIds: "",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 全部数据
    getData() {
      this.get("/zAttachment/all", {
        startNumber: this.page.current,
        queryNumber: this.page.size,
        filename: this.form.fileName,
        imagetype: this.form.imgType,
        typeFlag: this.form.category,
        startTime: this.date[0],
        endTime: this.date[1],
      }).then((r) => {
        this.data = r.data.records;
        this.page.total = r.data.total;
      });
    },
    handleClick(tab, event) {
      this.page.current = 1;
      this.page.size = 10;
      this.page.total = 0;
      if (tab.index == 0) {
        this.getData();
      } else {
        this.getTabData(tab.index);
      }
    },
    getTabData(index) {
      this.get("/zAttachment/typeFlag", {
        typeFlag: index,
        startNumber: this.page.current,
        queryNumber: this.page.size,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 条件查询
    queryByCondition(con) {},
    // 删除文件
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/zAttachment/delete", {
            idList: idList,
          }).then((res) => {
            this.getData();
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
    // 添加文件
    addFile(val) {
      this.showAdd = val;
    },
    // 编辑文件
    editItem(val) {
      this.showEdit = true;
      this.editForm = this.copy(val);
    },
    // 归类
    groupClassify(id) {
      // console.log(id)
      this.groupIds = id;
      this.showGroup = true;
    },
    // 确认归类
    comfirmGroup() {
      if (this.groupType) {
        this.post("/zAttachment/updateType", {
          idList: this.groupIds,
          typeFlag: this.groupType,
        }).then((res) => {
          if (res.data.code === 200) {
            this.showSuccess();
            this.showGroup = false;
            this.getData();
          }
        });
      } else {
        this.$message({
          type: "info",
          message: "请选择归类类型",
        });
      }
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
      this.showGroup = false;
      this.getData();
    },
    // 外部修改新增框关闭
    closed() {
      this.preview = false;
      this.url = "";
      this.getData();
    },
    reset() {
      this.form.category = "";
      this.form.imgType = "";
      this.form.fileName = "";
      this.date = [];
      this.getData();
    },
    confirm() {
      this.showAdd = false;
      this.showEdit = false;
      axios({
        method: "POST",
        url: "/api/zAttachment/update",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: this.editForm,
      }).then((res) => {
        if (res.data.code === 200) {
          if (this.activeName === "0") {
            this.getData();
          } else {
            this.getTabData(this.activeName);
          }
          this.showSuccess();
        } else {
          this.$message({
            message: res.data.message || '失败',
            type: "error",
          });
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.page.size = val;
      if (this.activeName === "0") {
        this.getData();
      } else {
        this.getTabData(this.activeName);
      }
    },
    handleCurrentChange(val) {
      this.page.current = val;
      if (this.activeName === "0") {
        this.getData();
      } else {
        this.getTabData(this.activeName);
      }
    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>