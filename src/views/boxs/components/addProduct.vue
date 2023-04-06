<template>
  <!-- 增加产品 -->
  <el-dialog
    title="新增产品"
    :visible.sync="show"
    @closed="closed()"
    @open="queryData()"
  >
    <div v-for="(item, index) in levelList" :key="index">
      <!-- 传说 -->
      <div>
        <div class="flex align-center justufy-center margin-left-xxl">
          <div style="font-size: 15px">
            {{
              item.goodsGrade === 1
                ? "传说"
                : item.goodsGrade === 2
                ? "史诗"
                : item.goodsGrade === 3
                ? "稀有"
                : item.goodsGrade === 4
                ? "尊贵"
                : item.goodsGrade === 5
                ? "普通"
                : ""
            }}
          </div>
          <div class="flex justify-between">
            <div style="margin: 0 200px 0 50px">产品ID</div>
            <div>概率</div>
          </div>
        </div>
        <div>
          <el-form
            ref="form"
            :model="form"
            class="flex"
            draggable="true"
            style="height: 36px"
            v-for="(target, index) in item.list"
            :key="index"
          >
            <el-form-item label-width="120px" multiple>
              <el-select
                placeholder="请选择"
                clearable
                size="mini"
                class="margin-left-xl"
                v-model="target.id"
                @visible-change="querySelect(item)"
              >
                <el-option
                  v-for="(opt, index) in item.options"
                  :label="opt.name"
                  :key="index"
                  :value="opt.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="margin-left-xxl">
              <el-input-number
                v-model="target.gradeProbability"
                size="mini"
                controls-position="right"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <i
              class="el-icon-delete margin-top margin-left"
              style="font-size: 18px"
              @click="deleteColums(item, index)"
            ></i>
          </el-form>
        </div>
        <div>
          <el-button
            type="primary"
            size="mini"
            class="margin-left-xxl margin-sm margin-bottom-lg"
            @click="addToColums(item)"
            >追加</el-button
          >
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closed()">取 消</el-button>
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
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
      form: {},
      formItem: { // 追加的数据
        id: "",
        name: "",
        gradeProbability: 0,
      },
      formList: [],
      goodsId: "",
      levelList: [],
    };
  },
  computed: {
    totalGradeProbability() {
      // this.
      let total = 0;
      this.levelList.forEach((item) => {
        item.list.forEach((target) => {
          total += target.gradeProbability;
        });
        return total;
        // for (let i in item.list) {
        //   console.log(i[gradeProbability])
        // }
      });
    },
  },
  methods: {
    queryData() {
      this.get("/friends/queryGoods", {
        id: this.id,
      }).then((res) => {
        if (res.code === 200) {
          if (res.data) {
            this.levelList = res.data;

            let obj = {};
            // 等级
            this.levelList.forEach((item, index) => {
              item.boxId = this.id;
              if (item.goodsGrade === null) {
                item.goodsGrade = index + 1;
              }
            });
            // // 数组重复项合并
            this.levelList.forEach((r, index) => {
              let goodsGrade = r.goodsGrade;
              let boxId = r.boxId;
              if (!obj[goodsGrade]) {
                obj[goodsGrade] = {
                  goodsGrade,
                  list: [],
                  boxId,
                };
              }
              obj[goodsGrade].list.push(r.list[0]);
            });
            this.levelList = Object.values(obj);
          }
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
    // 查询下拉框数据
    querySelect(item) {
      this.get("/friends/query", {
        goodsGrade: item.goodsGrade,
      }).then((r) => {
        this.$set(item, "options", r.data);
      });
    },
    addToColums(target) {
      this.formItem = {};
      target.list.push(this.formItem);
    },
    deleteColums(target, index) {
      target.list.splice(index, 1);
    },
    closed() {
      this.$emit("closed");
    },
    confirm() {
      let data = {};
      let total = 0;
      // 将等级商品概率相加
      this.levelList.forEach((item) => {
        item.list.forEach((target) => {
          total += target.gradeProbability;
        });
        item.total = total;
        total = 0;
      });
      let valid = false; // 判断添加的等级商品是否等于100
      this.levelList.forEach((item) => {
        if (item.total != 100) {
          valid = false;
          this.$message({
            message: `${
              item.goodsGrade === 1
                ? "传说"
                : item.goodsGrade === 2
                ? "史诗"
                : item.goodsGrade === 3
                ? "稀有"
                : item.goodsGrade === 4
                ? "尊贵"
                : item.goodsGrade === 5
                ? "普通"
                : ""
            }等级概率不等于100`,
            type: "error",
          });
        } else {
          valid = true;
        }
      });
      data["boxList"] = this.levelList;
      if (valid) {
        axios({
          method: "POST",
          dataType: "JSON",
          url: "/api/friends/insertProduct",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        }).then((res) => {
          if (res.data.code === 200) {
            this.showSuccess();
            this.$emit("closed");
          }
        });
      }
    },
    cancel() {},
  },
};
</script>

<style scoped>
.el-select {
  width: 150px;
}
</style>