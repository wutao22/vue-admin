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
        <el-form-item label="推荐状态">
          <el-select
            placeholder="请选择状态"
            v-model="condition.status"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="待处理" value="1"></el-option>
            <el-option label="已通过" value="2"></el-option>
            <el-option label="已驳回" value="3"></el-option>
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
      @fresh="queryData"
    >
      <!-- 表格插槽 -->
      <template v-slot:status>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.status === 1"
              >待处理</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.status === 2">已通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">已驳回</el-tag>
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
</template>
    
    <script>
export default {
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
          key: "mobile",
          props: "mobile",
          label: "手机号",
          width: 100,
        },
        {
          key: "money",
          props: "money",
          label: "提现金额",
          width: 120,
        },
        {
          prop: "trueMoney",
          key: "trueMoney",
          label: "实到金额",
        },
        {
          prop: "commissionScale",
          key: "commissionScale",
          label: "手续费比例",
        },
        {
          slot: "status",
          label: "状态",
        },
        {
          prop: "reason",
          key: "reason",
          label: "驳回原因",
        },
        {
          prop: "zfbAccount",
          key: "zfbAccount",
          label: "账户",
        },
        {
          prop: "createTime",
          key: "createTime",
          label: "添加时间",
          render: (h,params) => {
            return h('div', this.dateTimeFormat(params.row.createTime))
          }
        },
      ],
      data: [],
      form: {},
      condition: {
        status: ""
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      rowId: "",
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.get("/task/zWithdrawal", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        status: this.condition.status
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },

    closed() {
      this.queryData();
    },
    // 查询条件重置
    reset() {
      this.condition.status = "";
      this.queryData();
    },
    // 点击确认按钮
    confirm() {},
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
    
    <style>
</style>