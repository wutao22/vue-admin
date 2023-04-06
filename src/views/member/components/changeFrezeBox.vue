<template>
  <el-dialog title="冻结盲果变更" :visible.sync="show" @closed="closed()">
    <el-form :rules="rules" :model="form" ref="form">
      <el-form-item label="添加/减少" label-width="120px" multiple prop="type">
        <el-select placeholder="请选择" v-model="form.type" clearable>
          <el-option label="添加" value="1"></el-option>
          <el-option label="减少" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="冻结盲果数量" label-width="120px" prop="boxNum">
        <el-input-number
          v-model="form.boxNum"
          maxlength="10"
          style="width: 200px"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closed()">取 消</el-button>
      <el-button type="primary" @click="comfirm()">确 定</el-button>
    </span>
  </el-dialog>
</template>
    
    <script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    fruit: {
      type: Number,
    },
  },
  data() {
    return {
      form: {
        type: "",
        boxNum: 0,
      },
      // 校验规则
      rules: {
        type: [
          { required: true, message: "请选择添加或减少", trigger: "change" },
        ],
        boxNum: [{ required: true, message: "请填写数量", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    comfirm() {
      let id = localStorage.getItem("rowId");
      if (this.form.type === "2" && this.form.boxNum > this.fruit) {
        this.$message({
          message: "减少冻结盲果数量大于已有数量",
          type: "error",
        });
      } else {
        this.$refs.form.validate((valid) => {
          if (valid && this.form.boxNum < this.fruit) {
            this.post("/zUser/change", {
              id: id,
              flag: this.form.type,
              freezeBlindFruit: this.fruit,
              num: this.form.boxNum,
            }).then((res) => {
              if (res.data.code === 200) {
                this.showSuccess();
                this.$emit("closed");
                this.form.type = "";
                this.form.boxNum = "";
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error",
                });
              }
            });
          }
        });
      }
    },
    closed() {
      this.form.type = "";
      this.form.boxNum = "";
      this.$emit("closed");
      localStorage.removeItem("rowId");
    },
  },
};
</script>
    
    <style scoped>
</style>