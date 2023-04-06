<template>
  <div>
    <el-dialog :visible.sync="showModal" append-to-body @close="close()">
      <el-card class="">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="全部" name="1"> </el-tab-pane>
          <el-tab-pane label="分类一" name="2"></el-tab-pane>
          <el-tab-pane label="分类二" name="3"></el-tab-pane>
          <el-tab-pane label="自定义" name="4"></el-tab-pane>
          <el-tab-pane label="未归类" name="5"></el-tab-pane>
        </el-tabs>
        <!-- 表格 -->
        <Table :tableData="chooseData" :colums="chooseColums">
          <template v-slot:operation>
            <el-table-column
              label="操作"
              fixed="right"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click="chooseItem(scope.row)"
                  type="text"
                  size="small"
                  >选择</el-button
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
      </el-card>
    </el-dialog>
    <!-- 预览图片 -->
    <imageModal :show="preview" :url="url" @closed="previewClose"></imageModal>
  </div>
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
      activeName: "1",
      chooseData: [],
      preview: false,
      url: "", // 预览图片链接
      chooseColums: [
        {
          key: "id",
          props: "id",
          label: "ID",
          width: 60,
        },
        {
          key: "classify",
          props: "classify",
          label: "类别",
          width: 100,
          render: (h, params) => {
            switch (params.row.classify) {
              case '1':
                return h("div", "分类一");
                break;
              case '2':
                return h("div", "分类二");
                break;
              case '3':
                return h("div", "自定义");
                break;
              case '4':
                return h("div", "未归类");
                break;
            }
          },
        },
        {
          key: "otherId",
          label: "预览",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.row.url,
                },
                style: {
                  width: "100px",
                  height: "50px",
                },
                on: {
                  click: () => {
                    this.previewImg(params.row.url);
                  },
                },
              }),
            ]);
          },
        },
        {
          key: "filename",
          props: "filename",
          label: "文件名",
          width: 150
        },
        {
          key: "filesize",
          props: "filesize",
          label: "文件大小",
        },
        {
          key: "imagewidth",
          props: "imagewidth",
          label: "宽度",
        },
        {
          key: "imageheight",
          props: "imageheight",
          label: "高度",
        },
        {
          key: "imagetype",
          props: "imagetype",
          label: "图片类型",
        },
        // {
        //   props: "",
        //   label: "存储引擎",
        // },
        {
          key: "mimetype",
          props: "mimetype",
          label: "Mime类型",
        },
        {
          slot: "operation",
        },
      ],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  computed: {
    showModal: {
      get() {
        return this.show;
      },
      set(v) {
        return v;
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.get("/zAttachment/all", {
        startNumber: this.page.current,
        queryNumber: this.page.size,
      }).then((r) => {
        this.chooseData = r.data.records;
        this.page.total = r.data.total;
      });
    },
    handleClick(tab, event) {
      if (tab.index == 0) {
        this.getData();
      } else {
        this.get("/zAttachment/typeFlag", {
          typeFlag: tab.index,
          startNumber: this.page.current,
          queryNumber: this.page.size,
        }).then((res) => {
          this.chooseData = res.data.records;
        });
      }
    },
    // 预览图片
    previewImg(row) {
      this.url = row;
      this.preview = true;
    },
    previewClose() {
      // console.log('11')
      this.url = "";
      this.preview = false;
    },
    close() {
      this.$emit("close");
      this.showModal = false;
    },
    chooseItem(row) {
      this.$emit("selectItem", row.url);
      this.close();
    },
    // 分页
    handleSizeChange(val) {
      this.page.size = val;
      if (this.activeName === "1") {
        this.getData();
      } else {
        this.getTabData(this.activeName);
      }
    },
    getTabData(index) {
      this.get("/zAttachment/typeFlag", {
        typeFlag: index,
        startNumber: this.page.current,
        queryNumber: this.page.size,
      }).then((res) => {
        this.chooseData = res.data.records;
        this.page.total = res.data.total;
      });
    },
    handleCurrentChange(val) {
      this.page.current = val;
      if (this.activeName === "1") {
        this.getData();
      } else {
        this.getTabData(this.activeName);
      }
    },
  },
};
</script>

<style>
</style>