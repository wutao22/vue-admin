<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form ref="form" :model="form" label-width="80px" class="flex align-center padding-top-lg">
        <el-form-item label="手机号">
          <el-input size="small" v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input size="small" v-model="form.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择状态" v-model="form.status" @change="queryData()" clearable size="small">
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐状态">
          <el-select placeholder="请选择推荐状态" v-model="form.recommend" @change="queryData()" clearable size="small">
            <el-option label="推荐" value="1"></el-option>
            <el-option label="不推荐" value="2"></el-option>
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
      <template v-slot:imgs>
        <el-table-column label="照片" min-width="150px" align="center">
          <template slot-scope="scope">
            <span class="flex flex-wrap">
              <img :src="item" class="margin-lr-sm margin-tb-sm" style="width: 30px; height: 30px"
                v-for="(item, index) in scope.row.images.split(',')" :key="index" @click="previewImg(item)" />
            </span>
          </template>
        </el-table-column>
      </template>
      <template v-slot:status>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.status" :active-value="1" :inactive-value="2"
              @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </template>
      <template v-slot:recomed>
        <el-table-column label="推荐" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.recommend" :active-value="1" :inactive-value="2"
              @change="changeRecommed(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </template>
      <template v-slot:video>
        <el-table-column label="视频" width="150px" align="center">
          <template slot-scope="scope">
            <div @click.stop="openVideo(scope.row)">
              <el-input size="mini" disabled suffix-icon="el-icon-video-camera" v-model="scope.row.video"
                style="width: 130px;">
              </el-input>
            </div>
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
    <!-- 视频预览 -->
    <el-dialog title="预览" :visible.sync="showVideo" @closed="closed()">
      <video :src="videoUrl" v-if="videoUrl" autoplay style="height: 100%; width:300px;object-fit: scale-down;"></video>
      <img :src="url" v-if="url" alt="" style="width: 100%;height: 100%;" />
    </el-dialog>
  </el-card>
</template>
    
<script>
export default {
  data() {
    return {
      showVideo: false,
      videoUrl: "",
      url: "",
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 60,
        },
        {
          key: "sex",
          props: "sex",
          label: "性别",
          width: 70,
          render: (h, params) => {
            if (params.row.sex == 1) {
              return h("div", "男");
            } else {
              return h("div", "女");
            }
          },
        },
        {
          key: "avatar",
          props: "avatar",
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
          key: "nickname",
          props: "nickname",
          label: "昵称",
          width: 100,
        },
        {
          slot: "imgs",
          label: "照片",
        },
        {
          prop: "age",
          key: "age",
          label: "年龄",
          width: 80,
        },
        {
          prop: "mobile",
          key: "mobile",
          label: "联系电话",
        },
        {
          prop: "province",
          key: "province",
          label: "省",
          width: 80,
        },
        {
          prop: "city",
          key: "city",
          label: "市",
          width: 80,
        },
        {
          prop: "area",
          key: "area",
          label: "区",
          width: 80,
        },
        {
          prop: "address",
          key: "address",
          label: "详细地址",
        },
        {
          prop: "friendshipDeclaration",
          key: "friendshipDeclaration",
          label: "交友宣言",
        },
        {
          slot: "video",
        },
        {
          slot: "status",
          label: "状态",
          width: 100
        },
        {
          slot: 'recomed'
        },
        {
          prop: "createTime",
          key: "createTime",
          label: "添加时间",
          fixed: "right",
          render: (h, params) => {
            return h("div", this.dateTimeFormat(params.row.createTime));
          },
        },
      ],
      form: {
        nickName: "",
        mobile: "",
        status: "",
        recommend: null
      },
      data: [],
      showGoods: false,
      showSend: false,
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
      this.get("/friends/blind", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        nickName: this.form.nickName,
        mobile: this.form.mobile,
        status: this.form.status,
        recommendStatus: this.form.recommend
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.showVideo = true;
    },
    // 查看视频
    openVideo(row) {
      this.showVideo = true;
      this.videoUrl = row.video;
    },
    closed() {
      this.showGoods = false;
      this.videoUrl = "";
      this.url = "";
      this.queryData();
    },
    reset() {
      this.form.nickName = "";
      this.form.mobile = "";
      this.form.status = "";
      this.form.recommend = null
      this.queryData();
    },
    // 修改状态
    changeStatus(row) {
      this.post("/friends/updateFriendStatus", {
        id: row.id,
        status: row.status,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
    },
    // 修改推荐状态
    changeRecommed(row) {
      this.post("friends/updateFriendRecommendStatus", {
        id: row.id,
        recommendStatus: row.recommend.toFixed(),
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
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
    
<style scoped></style>