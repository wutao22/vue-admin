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
        <el-form-item label="任务类型">
          <el-select
            style="width: 200px"
            placeholder="请选择任务类型"
            v-model="condition.type"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="普通任务" value="1"></el-option>
            <el-option label="中级任务" value="2"></el-option>
            <el-option label="高级任务" value="3"></el-option>
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
    <!-- 新增 -->
    <el-dialog :title="buttonType === 1 ? '添加' : '编辑'" :visible.sync="showAdd">
      <el-form
        label-position="left"
        :model="form"
        :rules="rules"
        ref="form"
        class="form"
      >
        <el-form-item label="任务标题" label-width="120px" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="任务介绍" label-width="120px" prop="introduce">
          <el-input v-model="form.introduce"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" label-width="120px" multiple prop="type">
          <el-select placeholder="请选择" v-model="form.type" clearable>
            <el-option label="普通任务" :value="1"></el-option>
            <el-option label="中级任务" :value="2"></el-option>
            <el-option label="高级任务" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消耗盒子数量" label-width="120px" prop="resumeBox">
          <el-input-number
            v-model="form.resumeBox"
            controls-position="right"
            :min="0"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="获取倍率" label-width="120px" prop="getRate">
          <el-input-number
            v-model="form.getRate"
            controls-position="right"
            :min="0"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="天数" label-width="120px" prop="days">
          <el-input-number
            v-model="form.days"
            controls-position="right"
            :min="0"
            :max="100"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
  
  <script>
export default {
  data() {
    return {
      showAdd: false,
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "title",
          props: "title",
          label: "任务标题",
          width: 100,
        },
        {
          key: "introduction",
          props: "introduction",
          label: "任务介绍",
        },
        {
          key: "type",
          props: "type",
          label: "任务类别",
          render: (h, params) => {
            switch (params.row.type) {
              case 1:
                return h("div", "普通任务");
                break;
              case 2:
                return h("div", "中级任务");
                break;
              case 3:
                return h("div", "高级任务");
                break;
            }
          },
        },
        {
          prop: "box",
          key: "box",
          label: "消耗盒子数量",
        },
        {
          prop: "multiple",
          key: "multiple",
          label: "获取倍率",
        },
        {
          prop: "day",
          key: "day",
          label: "天数",
        },
        {
          prop: "createTime",
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
      condition: {
        type: "",
      },
      // 校验规则
      rules: {
        title: [{ required: true, message: "请填写任务标题", trigger: "blur" }],
        introduce: [
          { required: true, message: "请填写任务介绍", trigger: "blur" },
        ],
        type: [{ required: true, message: "请填写任务类型", trigger: "blur" }],
        resumeBox: [
          { required: true, message: "请填写消耗盒子数量", trigger: "blur" },
        ],
        getRate: [
          { required: true, message: "请填写获得倍率", trigger: "blur" },
        ],
        days: [{ required: true, message: "请填写天数", trigger: "blur" }],
      },
      data: [],
      form: {
        title: "",
        introduce: "",
        type: null,
        resumeBox: "",
        getRate: "",
        days: "",
      },
      buttonType: 1,
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
      this.get("/task/all", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        type: this.condition.type,
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
          this.post("/task/delete", {
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
      this.form.title = row.title;
      this.form.introduce = row.introduction;
      this.form.type = row.type;
      this.form.getRate = row.multiple;
      this.form.resumeBox = row.box;
      this.form.days = row.day;
    },
    // 查询条件重置
    reset() {
      this.condition.type = null;
      this.queryData();
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
      this.$refs["form"].resetFields();
    },
    addTask() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.post("/task/insert", {
            title: this.form.title,
            introduction: this.form.introduce,
            box: this.form.resumeBox,
            multiple: this.form.getRate,
            day: this.form.days,
            type: this.form.type,
          }).then((res) => {
            if (res.data.code === 200) {
              this.showSuccess();
              this.showAdd = false;
              this.queryData();
            } else {
              this.$message({
                type: "error",
                message: res.data.message,
              });
            }
          });
        }
      });
    },
    editTask() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.post("/task/update", {
            id: this.rowId,
            title: this.form.title,
            introduction: this.form.introduce,
            box: this.form.resumeBox,
            multiple: this.form.getRate,
            day: this.form.days,
            type: this.form.type,
          }).then((res) => {
            if (res.data.code === 200) {
              this.showSuccess();
              this.showAdd = false;
              this.queryData();
            }
          });
        }
      });
    },
    // 点击确认按钮
    confirm() {
      if (this.buttonType === 1) {
        this.addTask();
      } else {
        this.editTask();
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