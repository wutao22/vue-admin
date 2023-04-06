<template>
  <div>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="show" v-if="show">
      <el-form :model="editForm">
        <el-form-item label="类别" :label-width="formLabelWidth">
          <el-input v-model="editForm.category" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物理路径" :label-width="formLabelWidth">
          <el-input v-model="editForm.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宽度" :label-width="formLabelWidth">
          <el-input v-model="editForm.imagewidth" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="高度" :label-width="formLabelWidth">
          <el-input v-model="editForm.imageheight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片类型" :label-width="formLabelWidth">
          <el-input v-model="editForm.imagetype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片帧数" :label-width="formLabelWidth">
          <el-input v-model="editForm.imageframes" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件名" :label-width="formLabelWidth">
          <el-input v-model="editForm.finenamme" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Mime类型" :label-width="formLabelWidth">
          <el-input v-model="editForm.minetype" autocomplete="off"></el-input>
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
  </div>
</template>

<script>
export default {
    props: {
        show:{
            type: Boolean
        },
        rowData: {
          type: Array
        }
    },
  data() {
    return {
      editForm: {
        category: "",
        url: '',
        imagewidth: '',
        imageheight: '',
        imagetype: '',
        imageframes: '',
        finenamme: '',
        minetype: '',
        extparam: '',
        uploadtime: '',
        storage: ''
      },
      formLabelWidth: "100px",
    };
  },
  methods: {
    cancel () {
        this.$emit('cancel')
    },
    confirm () {
        this.$emit('confirm')
    }
  },
};
</script>

<style>
</style>