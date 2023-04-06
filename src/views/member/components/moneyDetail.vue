<template>
  <el-dialog
    title="余额明细"
    :visible.sync="show"
    @closed="closed()"
    @open="queryData()"
  >
    <Table
      :tableData="data"
      :colums="colums"
      :showFresh="true"
      @fresh="queryData"
    ></Table>
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
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "money",
          props: "money",
          label: "余额数量",
          width: 100,
        },
        {
          key: "before",
          props: "before",
          label: "变更前余额",
        },
        {
          key: "after",
          props: "after",
          label: "变更后余额",
        },
        {
          prop: "memo",
          key: "memo",
          label: "备注",
        },
        {
          prop: "createtime",
          key: "createtime",
          label: "添加时间",
        },
      ],
      data: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      tableUrl: "",
      rowId: "",
    };
  },
  methods: {
    queryData() {
      let id = localStorage.getItem("rowId");
      this.get("/zUser/balance", {
        id: id,
        beginNum: this.page.current,
        queryNum: this.page.size,
      }).then((res) => {
        if (res.data.records) {
          this.data = res.data.records;
          this.page.total = res.data.total;
        }
      });
    },
    closed() {
      this.$emit("closed");
      localStorage.removeItem("rowId");
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