<template>
  <el-card>
    <div class="flex justify-between">
      <el-form
        ref="condition"
        :model="condition"
        class="flex padding-top margin-right flex-wrap align-center"
        label-position="left"
      >
        <el-form-item
          label="联系人手机号"
          label-width="100px"
          class="margin-lr"
        >
          <el-input
            size="small"
            v-model="condition.mobile"
            placeholder="请输入联系人手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" label-width="100px" class="margin-lr">
          <el-input
            size="small"
            v-model="condition.name"
            placeholder="请输入联系人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="场景" label-width="50px">
          <el-select
            placeholder="请选择"
            v-model="condition.ground"
            clearable
            @change="queryData()"
            size="small"
          >
            <el-option label="盲盒商城" value="1"></el-option>
            <el-option label="开心抢购" value="2"></el-option>
            <el-option label="盲果商城" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" label-width="80px">
          <el-select
            placeholder="请选择支付方式"
            v-model="condition.payType"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="余额" value="3"></el-option>
            <el-option label="盒子支付" value="4"></el-option>
            <el-option label="盲果支付" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" label-width="80px">
          <el-select
            placeholder="请选择订单状态"
            v-model="condition.orderType"
            @change="queryData()"
            clearable
            size="small"
          >
            <el-option label="待支付" value="1"></el-option>
            <el-option label="待发货" value="2"></el-option>
            <el-option label="已发货" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
            <el-option label="已退款" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间" label-width="100px">
          <el-date-picker
            v-model="condition.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width: 200px"
            @change="changeTime()"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" size="small" @click="queryData()"
          >搜索</el-button
        >
        <el-button type="info" size="small" @click="reset()">重置</el-button>
      </div>
    </div>
    <Table
      :tableData="data"
      :colums="colums"
      :showFresh="true"
      @fresh="queryData"
    >
      <!-- 表格插槽 -->
      <template v-slot:ground>
        <el-table-column label="场景">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.type === 2">开心抢购</el-tag>
            <el-tag type="primary" v-else-if="scope.row.type === 1"
              >盲盒商城</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.type === 3"
              >盲果商城</el-tag
            >
          </template>
        </el-table-column>
      </template>
      <template v-slot:paytype>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.payType === 1">微信</el-tag>
            <el-tag type="warning" v-else-if="scope.row.payType === 2"
              >支付宝</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.payType === 3"
              >余额</el-tag
            >
            <el-tag type="primary" v-else-if="scope.row.payType === 4"
              >盒子支付</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.payType === 5"
              >盲果支付</el-tag
            >
          </template>
        </el-table-column>
      </template>
      <template v-slot:orderstatus>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.orderStatus === 1"
              >待支付</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.orderStatus === 2"
              >待发货</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.orderStatus === 3"
              >已发货</el-tag
            >
            <el-tag type="primary" v-else-if="scope.row.orderStatus === 4"
              >已完成</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.orderStatus === 5"
              >已退款</el-tag
            >
          </template>
        </el-table-column>
      </template>
      <template v-slot:oparetion>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="sendGoods(scope.row)"
              v-if="scope.row.orderStatus === 2"
              >发货</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="receipt(scope.row)"
              v-if="scope.row.orderStatus === 3"
              >确认收货</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="queryGoodList(scope.row.id)"
              >产品列表</el-button
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
    <!-- 商品列表 -->
    <goodsList :show="showGoods" @closed="closed"></goodsList>
    <!-- 发货 -->
    <el-dialog title="发货" :visible.sync="showSend" @closed="closed()">
      <el-form v-model="form" :rules="rules" ref="form">
        <el-form-item label="物流公司" label-width="120px" multiple prop="deliver">
          <el-select placeholder="请选择" v-model="form.deliver" clearable style="width: 250px;">
            <el-option
              v-for="(item, index) in company"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" label-width="120px" prop="deliNum">
          <el-input v-model="form.deliNum" maxlength="25"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closed()">取 消</el-button>
        <el-button type="primary" @click="comfirmSend()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
    
    <script>
import goodsList from "./components/goodsList.vue";
export default {
  components: {
    goodsList,
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
          key: "userId",
          props: "userId",
          label: "用户ID",
          width: 100,
        },
        {
          key: "orderSn",
          props: "orderSn",
          label: "订单号",
          width: 120,
        },
        {
          prop: "box",
          key: "box",
          label: "盒子数量",
        },
        {
          prop: "blindFruit",
          key: "blindFruit",
          label: "盲果",
        },
        {
          prop: "price",
          key: "price",
          label: "支付价格",
        },
        {
          prop: "receivingTel",
          key: "receivingTel",
          label: "联系人手机号",
        },
        {
          prop: "receivingName",
          key: "receivingName",
          label: "联系人姓名",
        },
        {
          prop: "receivingAddress",
          key: "receivingAddress",
          label: "联系人地址",
        },
        {
          slot: "ground",
        },
        {
          slot: "paytype",
          label: "支付方式",
        },
        {
          slot: "orderstatus",
          label: "订单状态",
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
          slot: "oparetion",
          label: "操作",
        },
      ],
      company: [
        "圆通速递",
        "韵达快递",
        "中通快递",
        "中通快递",
        "申通快递",
        "百世快递",
        "德邦快递",
        "天天快递",
        "极兔速递",
        "邮政快递包裹",
        "顺丰速运",
        "京东物流",
        "EMS",
        "德邦",
        "中通快运",
        "丰网速运",
        "邮政标准快递",
      ],
      data: [],
      showGoods: false,
      showSend: false,
      form: {
        deliver: "", // 快递公司
        deliNum: "", // 快递单号
      },
       // 校验规则
       rules: {
        deliver: [
          { required: true, message: "请选择快递公司", trigger: "blur" },
        ],
        deliNum: [
          { required: false, message: "请填写快递单号", trigger: "blur" },
        ],
      },
      condition: {
        mobile: "",
        name: "",
        ground: "",
        payType: "",
        orderType: "",
        time: [],
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
      this.get("/zUser/order", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        receivingTel: this.condition.mobile,
        receivingName: this.condition.name,
        type: this.condition.ground,
        payType: this.condition.payType,
        orderStatus: this.condition.orderType,
        startTime: this.condition.time[0],
        endTime: this.condition.time[1], 
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 确认收货
    receipt(row) {
      this.$confirm("是否确认收货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/zUser/updateStatus", {
            id: row.id,
            orderStatus: 4,
          }).then((res) => {
            if (res.data.code === 200) {
              this.queryData()
              this.$message({
                type: "success",
                message: "收货成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消收货",
          });
        });
    },
    // 产品列表
    queryGoodList(id) {
      localStorage.setItem("rowId", id);
      this.showGoods = true;
    },
    sendGoods(row) {
      this.showSend = true;
      this.rowId = row.id;
    },
    comfirmSend () {
      // this.$refs.form.validate(valid => {
      //   if (valid) {
          this.post('/zUser/updateStatus', {
            kdName: this.form.deliver,
            kdNum: this.form.deliNum,
            orderStatus: 3,
            id: this.rowId
          }).then( res => {
            if(res.data.code === 200) {
              this.showSend = false 
              this.showSuccess()
              this.queryData()
            } else {
              this.$message.error(res.data.message);
                this.loading = false
            }
          })
      //   }
      // })
    },
    // 处理查询条件时间
    changeTime() {
      this.condition.time[0] = this.condition.time[0] + " " + "00:00:00";
      this.condition.time[1] = this.condition.time[1] + " " + "23:59:59";
    },
    closed() {
      this.showGoods = false;
      this.showSend = false
      this.queryData();
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
.el-form-item {
  margin-left: 10px;
}
</style>