<template>
  <div>
    <div class="flex justify-between">
      <div class="flex align-center margin-bottom">
        <el-button type="info" icon="el-icon-refresh-right" size="mini" v-if="showFresh" @click="fresh()"></el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" v-if="showAdd" @click="addFile()">添加</el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini" v-if="showEdit" @click="editItem()"
          :disabled="multipleSelection.length === 0">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" v-if="showDelete"
          :disabled="multipleSelection.length === 0" @click="deleteData()">删除</el-button>
        <el-button type="primary" icon="el-icon-right" size="mini" v-if="showGroup"
          :disabled="multipleSelection.length === 0" @click="groupClassify()">归类</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" v-bind="$attrs" :data="tableData" border tooltip-effect="dark"
      :row-key="(row) => row.id" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <template v-for="(item, index) in colums">
        <slot v-if="item.slot" :name="item.slot" />
        <el-table-column :key="index" v-bind="item" :prop="item.key" :sortable="item.sortable" :fixed="item.fixed" align="center">
          <template slot-scope="scope">
            <ex-slot v-if="item.render" :render="item.render" :row="scope.row" :index="scope.$index" :column="item" />
            <span v-else>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
  
<script>
var exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index,
    };
    if (data.props.column) params.column = data.props.column;
    return data.props.render(h, params);
  },
};
export default {
  components: { exSlot },
  props: {
    selectData: {
      type: Array,
    },
    tableData: {
      type: Array,
      require: true,
    },
    colums: {
      type: Array,
      require: true,
    },
    showFresh: {
      type: Boolean,
    },
    showAdd: {
      type: Boolean,
    },
    showEdit: {
      type: Boolean,
    },
    showDelete: {
      type: Boolean,
    },
    showGroup: {
      type: Boolean,
    },
  },
  data() {
    return {
      multipleSelection: [],
    };
  },
  mounted() {
    // this.$nextTick(function () {
    //   this.selectData.forEach((key) => {
    //     this.tableData.forEach((row) => {
    //       if (row.id === key) {
    //         this.$refs.multipleTable.toggleRowSelection(row, true);
    //       }
    //     });
    //   });
    // });
  },
  methods: {
    // 切换选中
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 选中数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selectItem", this.multipleSelection);
    },
    deleteData() {
      let ids = [];
      this.multipleSelection.map((item) => {
        ids.push(item.id);
      });
      let idList = ids.join(",");
      this.$emit("deleteItem", idList);
    },
    fresh() {
      this.$emit("fresh");
    },
    addFile() {
      this.$emit("addFile", true);
    },
    groupClassify() {
      let ids = [];
      this.multipleSelection.map((item) => {
        ids.push(item.id);
      });
      let idList = ids.join(",");
      this.$emit("groupClassify", idList);
    },
  },
};
</script>