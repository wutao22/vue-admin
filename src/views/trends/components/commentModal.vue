<template>
  <el-dialog
    title="查看评论"
    :visible.sync="show"
    @closed="closed()"
    @open="queryComment()"
  >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="avatar" label="用户头像" width="180">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar"
            alt=""
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称"
        width="180"
      ></el-table-column>
      <el-table-column prop="content" label="评论文字内容"></el-table-column>
      <el-table-column prop="url" label="图片/视频">
        <template slot-scope="scope">
          <img :src="scope.row.url" alt="" style="width: 40px; height: 40px" />
        </template>
      </el-table-column>
    </el-table>
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
         <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    id: {
      type: Number,
    },
  },
  data() {
    return {
      tableData: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
        preview: false,
      url: "", // 预览图片链接
    };
  },
  methods: {
    queryComment() {
      this.get("/task/trendsComment", {
        id: this.id,
        beginNum: this.page.current,
        queryNum: this.page.size,
      }).then((res) => {
        this.tableData = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 分页
    handleSizeChange(val) {
       
      this.page.size = val;
      this.queryComment();
    },
    handleCurrentChange(val) {
       
      this.page.current = val;
      this.queryComment();
    },
    closed() {
      this.$emit("closed");
    },
  },
};
</script>

<style>
</style>