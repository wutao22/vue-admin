<template>
  <el-dialog
    title="产品列表"
    :visible.sync="show"
    @closed="closed()"
    @open="queryData()"
  >
    <Table
      :tableData="data"
      :colums="colums"
      :showFresh="true"
      @fresh="queryData"
    >
      <template v-slot:img>
        <el-table-column label="缩略图">
          <template slot-scope="scope">
            <img :src="scope.row.thumbnail" alt="" style="width: 50px;height: 50px;" />
          </template>
        </el-table-column>
      </template>
    </Table>
  </el-dialog>
</template>
    
    <script>
export default {
  props: {
    show: {
      type: Boolean,
    }
  },
  data() {
    return {
      colums: [
        {
          key: "otherId",
          props: "otherId",
          label: "商品主键id",
        },
        {
          key: "spec",
          props: "spec",
          label: "规格",
          width: 100,
        },
        {
          key: "name",
          props: "name",
          label: "产品名称",
        },
        {
          key: "price",
          props: "price",
          label: "参考价格",
        },
        {
          slot: "img",
          label: "缩略图",
        },
      ],
      data: [],
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
      let id = localStorage.getItem("rowId") || 0;
      this.get("/zUser/product", {
        id: id,
        beginNum: this.page.current,
        queryNum: this.page.size,
      }).then((res) => {
        if(res.data) {
            this.data.push(res.data);
        }
        // this.page.total = res.data.total;
      });
    },
    closed() {
      this.$emit("closed");
      localStorage.removeItem("rowId");
      this.data = []
      this.page.current = 1;
      this.page.size = 10;
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
    
    <style>
</style>