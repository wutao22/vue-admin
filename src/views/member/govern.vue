<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form ref="form" :model="form" label-width="80px" style="flex-wrap: wrap;"
        class="flex align-center padding-top-lg">
        <el-form-item label="手机号">
          <el-input size="small" v-model="form.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input size="small" v-model="form.name" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择状态" v-model="form.status" @change="queryData()" clearable size="small">
            <el-option label="正常" value="normal"></el-option>
            <el-option label="冻结" value="hidden"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注销状态">
          <el-select placeholder="请选择注销状态" v-model="form.cancelStatus" @change="queryData()" clearable size="small">
            <el-option label="已注销" value="2"></el-option>
            <el-option label="未注销" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否股东">
          <el-select size="small" placeholder="请选择" v-model="form.isStocker" clearable @change="queryData()">
            <el-option label="是" value="2"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" @click="queryData()" size="small">搜索</el-button>
        <el-button type="info" @click="reset()" size="small">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <Table :tableData="data" :colums="colums" :showFresh="true" @fresh="queryData">
      <!-- 表格插槽 -->
      <template v-slot:status>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch :value="scope.row.status" active-value='normal' inactive-value='hidden'
              @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </template>
      <template v-slot:stockholderStatus>
        <el-table-column label="是否股东">
          <template slot-scope="scope">
            <el-switch :value="scope.row.stockholderStatus" :active-value="2" :inactive-value="1"
              @change="changeStockerStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </template>
      <template v-slot:logoff>
        <el-table-column label="注销状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.cancellationStatus === 1">未注销</el-tag>
            <el-tag type="info" v-else>已注销</el-tag>
          </template>
        </el-table-column>
      </template>
      <template v-slot:oparetion>
        <el-table-column label="操作" fixed="right" width="380" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="queryMoney(scope.row.id)">余额明细</el-button>
            <el-button type="text" size="small" slot="reference" @click="queryBox(scope.row.id)">盒子明细</el-button>
            <el-button type="text" size="small" @click="queryBlind(scope.row.id)">盲果明细</el-button>
            <el-button type="text" size="small" @click="queryFreze(scope.row.id)">冻结盲果明细</el-button>
            <el-button type="text" size="small" @click="changeBox(scope.row)">冻结盲果变更</el-button>
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
    <!-- 余额明细 -->
    <moneyDetail :show="showMoney" @closed="closed"></moneyDetail>
    <!-- 盒子明细 -->
    <boxDetail :show="showBox" @closed="closed"></boxDetail>
    <!-- 盲果明细 -->
    <blindFruit :show="showBlind" @closed="closed"></blindFruit>
    <!-- 冻结盲果数量 -->
    <frezzFruit :show="showFreBlind" @closed="closed"></frezzFruit>
    <!-- 变更冻结盲盒 -->
    <changeBox :show="showChange" @closed="closed" :fruit="fruit"></changeBox>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
  </el-card>
</template>
  
<script>
import moneyDetail from "./components/moneyDetail.vue";
import boxDetail from "./components/boxDetail.vue";
import frezzFruit from "./components/frezzFruit.vue";
import blindFruit from "./components/blindFruit.vue";
import changeBox from "./components/changeFrezeBox.vue";
export default {
  components: {
    moneyDetail,
    boxDetail,
    frezzFruit,
    blindFruit,
    changeBox,
  },
  data() {
    return {
      showMoney: false,
      showBox: false,
      showBlind: false,
      showFreBlind: false,
      showChange: false,
      preview: false,
      url: "",
      fruit: 0,
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "nickname",
          props: "nickname",
          label: "昵称",
          width: 100,
        },
        {
          key: "gender",
          props: "gender",
          label: "性别",
          width: 60,
          render: (h, params) => {
            if (params.row.gender === 0) {
              return h("div", "男");
            }
          },
        },
        {
          key: "mobile",
          props: "mobile",
          label: "手机号",
          width: 100,
        },
        {
          key: "avatar",
          label: "头像",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.avatar,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.avatar);
                  },
                },
              }),
            ]);
          },
        },
        {
          prop: "status",
          key: "status",
          label: "用户身份",
          width: 100,
          render: (h, params) => {
            if (params.row.status === "normal") {
              return h("div", "普通用户");
            }
          },
        },
        {
          prop: "money",
          key: "money",
          label: "余额",
        },
        {
          prop: "boxNum",
          key: "boxNum",
          label: "盒子数量",
        },
        {
          prop: "freezeBox",
          key: "freezeBox",
          label: "冻结盲盒数量",
        },
        {
          prop: "blindFruit",
          key: "blindFruit",
          label: "盲果数量",
        },
        {
          prop: "freezeBlindFruit",
          key: "freezeBlindFruit",
          label: "冻结盲果数量",
        },
        {
          slot: "status",
          label: "状态",
          render: (h, params) => {
            let arr = [];
            if (params.row.status == "normal") {
              arr.push(
                h("el-switch", {
                  props: { value: true },
                })
              );
            }
            return h("div", arr);
          },
        },
        {
          slot: "logoff",
          label: "注销状态",
        },
        {
          slot: "stockholderStatus",
          label: "是否股东"
        },
        {
          prop: "name",
          key: "name",
          label: "真实姓名",
        },
        {
          prop: "idcard",
          key: "idcard",
          label: "身份证号",
        },
        {
          key: "idcardZImage",
          label: "身份证正面",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.idcardZImage,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.idcardZImage);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "idcardFImage",
          label: "身份证反面",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.idcardFImage,
                },
                style: {
                  width: "40px",
                  height: "40px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.idcardFImage);
                  },
                },
              }),
            ]);
          },
        },
        {
          slot: "oparetion",
          label: "操作",
        },
      ],
      data: [],
      form: {
        tel: "",
        status: "",
        cancelStatus: "",
        nickName: '',
        isStocker: "",
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
      this.get("/zUser/all", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        mobile: this.form.tel,
        nickname: this.form.name,
        stockholderStatus: this.form.isStocker,
        cancellationStatus: this.form.cancelStatus,
        status: this.form.status
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 余额明细
    queryMoney(id) {
      // this.rowId = id
      localStorage.setItem("rowId", id);
      this.showMoney = true;
    },
    // 盒子明细
    queryBox(id) {
      localStorage.setItem("rowId", id);
      this.showBox = true;
    },
    // 盲盒明细
    queryBlind(id) {
      localStorage.setItem("rowId", id);
      this.showBlind = true;
    },
    // 冻结盲果明细
    queryFreze(id) {
      localStorage.setItem("rowId", id);
      this.showFreBlind = true;
    },
    // 变更
    changeBox(row) {
      this.fruit = row.freezeBlindFruit;
      localStorage.setItem("rowId", row.id);
      this.showChange = true;
    },
    // 查看图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
    },
    // 更改状态
    changeStatus(row) {
      this.post("/zUser/updateUserStatus", {
        id: row.id,
        status: row.status,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
    },
    // 更改股东状态
    changeStockerStatus(row) {
      this.post("/zUser/updateStockholderStatus", {
        id: row.id,
        status: row.stockholderStatus,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess(res.data.message);
          this.queryData();
        }
      });
    },
    closed() {
      this.showMoney = false;
      this.showBox = false;
      this.showBlind = false;
      this.showFreBlind = false;
      this.showChange = false;
      this.preview = false;
      this.queryData();
    },
    reset() {
      this.form.tel = "",
        this.form.status = "",
        this.form.cancelStatus = "",
        this.form.name = "",
        this.form.isStocker = ""
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