<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form ref="condition" :model="form" label-width="80px" class="flex align-center padding-top-lg">
        <el-form-item label="推荐状态">
          <el-select placeholder="请选择状态" v-model="condition.status" @change="queryData()" clearable size="small">
            <el-option label="待处理" value="1"></el-option>
            <el-option label="已通过" value="2"></el-option>
            <el-option label="已驳回" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" @click="queryData()" size="small">搜索</el-button>
        <el-button type="info" @click="reset()" size="small">重置</el-button>
      </div>
    </div>

    <Table :tableData="data" :colums="colums" :showFresh="true" @fresh="queryData">
      <!-- 表格插槽 -->
      <template v-slot:status>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.status === 1">待处理</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">已通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">已驳回</el-tag>
          </template>
        </el-table-column>
      </template>
      <template v-slot:operation>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="aggre(scope.row)" v-if="scope.row.status === 1">同意</el-button>
            <el-button type="text" size="small" slot="reference" @click="reject(scope.row.id)"
              v-if="scope.row.status === 1">拒绝</el-button>
          </template>
        </el-table-column>
      </template>
    </Table>
    <div class="block margin-top flex justify-end">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current"
        :page-sizes="[5, 10, 20, 40]" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <el-dialog title="拒绝申请" :visible.sync="showReject" @closed="closed()">
      <div>
        <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
          <el-form-item label="拒绝原因" label-width="90px" prop="reason">
            <el-input type="textarea" autosize placeholder="请输入拒绝原因" v-model="form.reason" style="width: 400px;"
              maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed">取 消</el-button>
        <el-button type="primary" @click="confirmReject()" :disabled="disabled">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
    
<script>
import axios from 'axios';
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
          width: 120,
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
          render: (h, params) => {
            return h('div', this.dateTimeFormat(params.row.createTime))
          }
        },
        {
          slot: "operation",
          label: "操作"
        }
      ],
      data: [],
      form: {
        reason: ''
      },
      disabled: false,
      rowId: '',
      condition: {
        status: ""
      },
      showReject: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      // 校验规则
      rules: {
        reason: [
          { required: true, message: "请输入拒绝申请原因", trigger: "blur" },
        ]
      },
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
    // 同意申请
    aggre(row) {
      this.$confirm("此操作将同意该提现申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios({
          url: '/api/task/updateZWithdrawalStatus',
          method: 'post',
          data: {
            id: row.id,
            status: 2
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.queryData()
            this.showSuccess()
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消",
        });
      });
    },
    // 拒绝申请
    reject(row) {
      // 3
      this.showReject = true
      this.rowId = row
    },
    // 确认拒绝按钮
    confirmReject() {
      this.$refs.forms.validate(valid => {
        if (valid) {
          this.disabled = true
          axios({
            url: '/api/task/updateZWithdrawalStatus',
            method: 'post',
            data: {
              id: this.rowId,
              status: 3,
              reason: this.form.reason
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.queryData()
              this.showSuccess()
              this.showReject = false
            }
          })
        }
      })
    },
    closed() {
      this.queryData();
      this.showReject = false
      this.form.reason = ''
      this.disabled = false
    },
    // 查询条件重置
    reset() {
      this.condition.status = "";
      this.queryData();
    },
    // 点击确认按钮
    confirm() { },
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
    
<style></style>