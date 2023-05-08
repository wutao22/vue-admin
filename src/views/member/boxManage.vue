<!-- 盲果分类 -->
<template>
    <el-card>
        <!-- 搜索条件 -->
        <div class="flex justify-between">
            <el-form ref="condition" :model="condition" class="flex padding-top margin-right" label-position="left">
                <el-form-item label="盒子名称" label-width="80px">
                    <el-input size="small" v-model="condition.name" placeholder="请输入盒子名称"></el-input>
                </el-form-item>
                <el-form-item label="盒子数量" label-width="80px" class="margin-lr">
                    <el-input size="small" v-model="condition.boxNum" placeholder="请输入盒子数量"></el-input>
                </el-form-item>
                <el-form-item label="添加时间" label-width="80px">
                    <el-date-picker v-model="condition.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" size="small" @change="changeTime()"
                        style="width: 250px">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="flex justify-center align-center">
                <el-button type="primary" size="small" @click="queryData()">搜索</el-button>
                <el-button type="info" size="small" @click="reset()">重置</el-button>
            </div>
        </div>
        <Table :tableData="data" :colums="colums" :showFresh="true" :showAdd="true" :showDelete="true"
            @deleteItem="deleteItem" @addFile="addFile" @fresh="queryData">
            <template v-slot:operation>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" slot="reference"
                            @click="deleteItem(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </template>
        </Table>
        <div class="block margin-top flex justify-end">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="page.current" :page-sizes="[5, 10, 20, 40]" :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper" :total="page.total">
            </el-pagination>
        </div>
        <!-- 新增文件框 -->
        <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()">
            <div>
                <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
                    <el-form-item label="盒子名称" label-width="90px" prop="name">
                        <el-input placeholder="请输入盒子名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="盒子数量" label-width="90px" prop="boxNum">
                        <el-input placeholder="请输入盒子数量" v-model="form.boxNum"></el-input>
                    </el-form-item>
                    <el-form-item label="盒子价值" label-width="90px" prop="price">
                        <el-input placeholder="请输入盒子价值" v-model="form.price"></el-input>
                    </el-form-item>
                    <el-form-item label="折扣" label-width="90px" prop="discount">
                        <el-input placeholder="请输入折扣" v-model="form.discount"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closed">取 消</el-button>
                <el-button type="primary" @click="confirmAdd()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑文件框 -->
        <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()">
            <div>
                <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
                    <el-form-item label="盒子名称" label-width="90px" prop="name">
                        <el-input placeholder="请输入盒子名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="盒子数量" label-width="90px" prop="boxNum">
                        <el-input placeholder="请输入盒子数量" v-model="form.boxNum"></el-input>
                    </el-form-item>
                    <el-form-item label="盒子价值" label-width="90px" prop="price">
                        <el-input placeholder="请输入盒子价值" v-model="form.price"></el-input>
                    </el-form-item>
                    <el-form-item label="折扣" label-width="90px" prop="discount">
                        <el-input placeholder="请输入折扣" v-model="form.discount"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closed">取 消</el-button>
                <el-button type="primary" @click="confirmEdit()" :disabled="disabled">确 定</el-button>
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
                // {
                //   type: 'selection'
                // },
                {
                    key: "id",
                    props: "id",
                    label: "ID",
                    width: 80,
                },
                {
                    key: "name",
                    props: "name",
                    label: "盒子名称",
                    width: 100,
                },
                {
                    key: "boxNum",
                    props: "boxNum",
                    label: "盒子数量",
                },
                {
                    key: "price",
                    props: "price",
                    label: "盒子价值",
                },
                {
                    key: "discount",
                    props: "discount",
                    label: "折扣",
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
                    prop: "updateTime",
                    key: "updateTime",
                    label: "更新时间",
                    render: (h, params) => {
                        return h("div", this.dateTimeFormat(params.row.updateTime));
                    },
                },
                {
                    slot: "operation",
                    label: "操作",
                },
            ],
            data: [],
            showAdd: false,
            showEdit: false,
            faList: [], // 查询的父类id
            form: {
                name: "",
                boxNum: "",
                discount: "",
                price: "", // 新增编辑表单数据
            },
            condition: {
                name: "",
                boxNum: "",
                time: [],
            },
            // 校验规则
            rules: {
                name: [
                    { required: true, message: "请输入盒子名称", trigger: "blur" },
                ],
                boxNum: [{ required: true, message: "请输入盒子数量", trigger: "blur" }],
                price: [
                    { required: true, message: "请输入价值", trigger: "blur" },
                ],
                discount: [
                    { required: true, message: "请输入折扣", trigger: "blur" },
                ],
            },
            buttonType: "", // 1为编辑 2为新增
            rowId: "", // 编辑一列的id
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
            disabled: false
        };
    },
    mounted() {
        this.queryData();
    },
    methods: {
        // 查询首页数据
        queryData() {
            axios({
                method: "POST",
                url: "/api/zUser/queryBoxProductList",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    beginNum: this.page.current,
                    queryNum: this.page.size,
                    name: this.condition.name,
                    boxNum: this.condition.boxNum,
                    startTime: this.condition.time[0],
                    endTime: this.condition.time[1]
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.data = res.data.data.records
                    this.page.total = res.data.data.total
                }
            });
        },
        // 处理查询条件时间
        changeTime() {
            this.condition.time[0] = this.condition.time[0] + " " + "00:00:00";
            this.condition.time[1] = this.condition.time[1] + " " + "23:59:59";
        },
        // 外部修改新增框关闭
        closed() {
            this.form.name = "";
            this.form.discount = "";
            this.form.boxNum = "";
            this.form.price = "";
            this.showEdit = false
            this.showAdd = false
        },
        // 删除
        deleteItem(idList) {
            this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.post("/zUser/deleteBoxProduct", {
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
        // 编辑
        editItem(row) {
            this.buttonType = 1;
            this.showEdit = true;
            this.form = this.copy(row)
            this.rowId = row.id;
        },
        // 新增
        addFile(val) {
            this.showAdd = val;
            this.showAdd = true;
            this.buttonType = 2;
        },
        cancel() {
            this.showAdd = false;
        },
        // 查询条件重置
        reset() {
            this.condition.name = "";
            this.condition.boxNum = "";
            this.condition.time = [];
            this.queryData();
        },
        // 添加点击确认按钮
        confirmAdd() {
            this.disabled = true
            this.$refs.forms.validate(valid => {
                if (valid) {
                    axios({
                        method: "post",
                        url: "/api/zUser/addBoxProduct",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: this.form
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.showAdd = false
                            this.showSuccess()
                            this.queryData()
                        }
                    })
                }
            })
        },
        // 编辑确认按钮
        confirmEdit() {
            this.disabled = true
            // /zUser/addBoxProduct
            this.$refs.forms.validate(valid => {
                if (valid) {
                    axios({
                        method: "post",
                        url: "/api/zUser/updateBoxProduct",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: this.form
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.showEdit = false
                            this.showSuccess()
                            this.queryData()
                        }
                    })
                }
            })
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
.form .el-input,
.form .el-select {
    width: 300px !important;
}
</style>
    