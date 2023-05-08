<template>
  <el-card>
    <!-- 搜索条件 -->
    <div class="flex justify-between align-center">
      <el-form ref="condition" :model="form" label-width="80px" class="flex align-center padding-top-lg">
        <el-form-item label="状态">
          <el-select placeholder="请选择状态" v-model="condition.status" @change="queryData()" clearable size="small">
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-center align-center">
        <el-button type="primary" @click="queryData()" size="small">搜索</el-button>
        <el-button type="info" @click="reset()" size="small">重置</el-button>
      </div>
    </div>
    <Table :tableData="data" :colums="colums" :showFresh="true" :showDelete="true" @deleteItem="deleteItem"
      @fresh="queryData">
      <template v-slot:operation>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openComment(scope.row)">查看评论</el-button>
            <el-button type="text" size="small" slot="reference" @click="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-slot:mideaUrl>
        <el-table-column label="视频/图片url" max-width="500px" align="center">
          <template slot-scope="scope">
            <div class="flex flex-wrap">
              <div v-for="(item, index) in scope.row.url.split(',')" @click.stop="openVideo(item)" :key="index"
                class="flex flex-wrap">
                <el-input type="text" suffix-icon="el-icon-video-camera" :value="item"
                  v-if="item.substring(item.length - 3, item.length) === 'mp4'" size="small" disabled />
                <img :src="item" alt="" class="margin-sm" v-else style="width: 40px; height: 40px" />
                <!-- <video :src="item" v-if="item.substring(item.length -3, item.length) === 'mp4'"></video> -->
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
      <template v-slot:status>
        <el-table-column label="状态" width="100px" align="center">
          <template slot-scope="scope">
            <el-switch :value="scope.row.status" :active-value="1" :inactive-value="2"
              @change="changeStatus(scope.row)"></el-switch>
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
    <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()">
      <el-form>
        <el-form-item label="所属组别" label-width="120px" multiple>
          <el-select placeholder="请选择" v-model="form.group" clearable>
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 视频预览 -->
    <el-dialog title="预览" :visible.sync="showMedia" @closed="closed()">
      <video :src="videoUrl" v-if="videoUrl" autoplay style="height: 600px; width: 800px"></video>
      <img :src="mediaUrl" v-if="mediaUrl" alt="" style="width: 100%; height: 100%" />
    </el-dialog>
    <!-- 查看评论 -->
    <commentModal :show="showComment" :id="rowId" @closed="closed"></commentModal>
  </el-card>
</template>
  
<script>
import commentModal from "./components/commentModal.vue";
export default {
  components: {
    commentModal,
  },
  data() {
    return {
      showAdd: false,
      showMedia: false,
      showComment: false,
      preview: false,
      url: "",
      mediaUrl: "",
      imgUrl: "",
      videoUrl: "",
      rowId: 0,
      colums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 80,
        },
        {
          key: "avatar",
          props: "avatar",
          label: "发布人头像",
          width: 100,
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
          label: "发布人昵称",
        },
        {
          key: "textDescribe",
          props: "textDescribe",
          label: "动态描述",
          render: (h, params) => {
            return h('div', {
              style: {
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'display': '-webkit-box',
                '-webkit-box-orient': 'vertical',
                '-webkit-line-clamp': '2'
              }
            }, params.row.textDescribe)
          }
        },
        {
          slot: "mideaUrl",
          label: "视频/图片url",
        },
        {
          slot: "status",
          label: "状态",
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
          slot: "operation",
        },
      ],
      condition: {
        status: "",
      },
      data: [],
      form: {},
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
      this.get("/task/zUserTrends", {
        beginNum: this.page.current,
        queryNum: this.page.size,
        status: this.condition.status,
      }).then((res) => {
        this.data = res.data.records;
        this.page.total = res.data.total;
      });
    },
    // 查看视频
    openVideo(item) {
      if (item.substring(item.length - 3, item.length) === "mp4") {
        this.videoUrl = item;
      } else {
        this.mediaUrl = item;
      }
      this.showMedia = true;
    },
    // 查看评论
    openComment(row) {
      this.rowId = row.id;
      this.showComment = true;
    },
    changeStatus(row) {
      this.post("/task/updateStatus", {
        id: row.id,
        status: row.status,
      }).then((res) => {
        if (res.data.code === 200) {
          this.showSuccess();
          this.queryData();
        }
      });
    },
    // 删除
    deleteItem(idList) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.post("/task/deleteTrends", {
            idList: idList,
          }).then((res) => {
            this.queryData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    reset() {
      this.condition.status = "";
      this.queryData();
    },
    closed() {
      this.showMedia = false;
      this.showAdd = false;
      this.showEdit = false;
      this.showComment = false;
      this.videoUrl = ''
      this.mediaUrl = ''
    },
    // 预览图片
    previewImg(row) {
      this.mediaUrl = row;
      this.showMedia = true;
    },
    cancel() {
      this.showAdd = false;
      this.showEdit = false;
    },
    // 点击确认按钮
    confirm() { },
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