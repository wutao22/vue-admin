<!-- 盲果分类 -->
<template>
    <el-card>
        <!-- 搜索条件 -->
        <div class="flex justify-between">
            <el-form ref="condition" :model="condition" class="flex padding-top margin-right" label-position="left">
                <el-form-item label="商品名称" label-width="80px">
                    <el-input size="small" v-model="condition.name" placeholder="请输入商品名"></el-input>
                </el-form-item>
                <el-form-item label="价格区间" class="margin-lr flex align-center justify-start">
                    <el-input size="small" v-model="condition.moneyMin" placeholder="请输入最小金额"
                        style="width: 130px;"></el-input>
                    <span class="margin-lr">----</span>
                    <el-input style="width: 130px;" size="small" v-model="condition.moneyMax"
                        placeholder="请输入最大金额"></el-input>
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
        <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()" @open="queryUser()">
            <div>
                <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
                <!-- <el-form-item label="用户" label-width="90px" prop="userId">
                        <el-select placeholder="请选择" v-model="form.userId" clearable>
                            <el-option :label="item.nickname" :value="item.id" v-for="(item, index) in userList"
                                :key="index"></el-option>
                            <el-pagination @size-change="handleSelectSizeChange" @current-change="handleSelectCurrentChange"
                                :current-page="selectCurrent" :page-sizes="[5, 10, 20, 40]" :page-size="selectSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="selectTotal">
                            </el-pagination>
                        </el-select>
                        </el-form-item> -->
                    <el-form-item label="礼物名称" label-width="90px" prop="name">
                        <el-input placeholder="请输入礼物名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="礼物价格" label-width="90px" prop="price">
                        <el-input placeholder="请输入礼物价格" v-model="form.price"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closed">取 消</el-button>
                <el-button type="primary" @click="confirmAdd()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑文件框 -->
        <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()" @open="queryUser()">
            <div>
                <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
                <!-- <el-form-item label="用户" label-width="90px" prop="userId">
                        <el-select placeholder="请选择" v-model="form.userId" clearable>
                            <el-option :label="item.nickname" :value="item.id" v-for="(item, index) in userList"
                                :key="index"></el-option>
                            <el-pagination @size-change="handleSelectSizeChange" @current-change="handleSelectCurrentChange"
                                :current-page="selectCurrent" :page-sizes="[5, 10, 20, 40]" :page-size="selectSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="selectTotal">
                            </el-pagination>
                        </el-select>
                        </el-form-item> -->
                    <el-form-item label="礼物名称" label-width="90px" prop="name">
                        <el-input placeholder="请输入礼物名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="礼物价格" label-width="90px" prop="price">
                        <el-input placeholder="请输入礼物价格" v-model="form.price"></el-input>
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
import axios from 'axios'
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
                    label: "礼物名称",
                },
                {
                    key: "price",
                    props: "price",
                    label: "礼物价格",
                },
                {
                    key: "createTime",
                    props: "createTime",
                    label: "添加时间",
                    render: (h, params) => {
                        return h("div", this.dateTimeFormat(params.row.createTime));
                    },
                },
                {
                    slot: "operation",
                    label: "操作"
                },
            ],
            data: [],
            showAdd: false,
            showEdit: false,
            userList: [], // 充值用户列表
            form: {
                name: '',
                price: ''
            },
            condition: {
                moneyMin: null,
                moneyMax: null,
                name: "",
                time: [],
            },
            // 校验规则
            rules: {
                name: [
                    { required: true, message: "请输入礼物名称", trigger: "blur" },
                ],
                price: [
                    { required: true, message: "请输入盒子价值", trigger: "blur" },
                ]
            },
            rowId: "", // 编辑一列的id
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
            selectCurrent: 1,
            selectSize: 10,
            selectTotal: 0,
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
                url: "/api/zGift/queryGiftList",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    beginNum: this.page.current,
                    queryNum: this.page.size,
                    name: this.condition.name,
                    moneyMin: parseInt(this.condition.moneyMin),
                    moneyMax: parseInt(this.condition.moneyMax),
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
        // 查询充值用户
        queryUser() {
            axios({
                method: 'post',
                url: '/api/zUser/queryRechargeUser',
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    beginNum: this.selectCurrent,
                    queryNum: this.selectSize
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.userList = res.data.data.records
                    this.selectTotal = res.data.data.total
                }
            })
        },
        // 处理查询条件时间
        changeTime() {
            this.condition.time[0] = this.condition.time[0] + " " + "00:00:00";
            this.condition.time[1] = this.condition.time[1] + " " + "23:59:59";
        },
        // 外部修改新增框关闭
        closed() {
            this.showEdit = false
            this.showAdd = false
            this.form.price = ''
            this.form.name = ''
            this.disabled = false
        },
        // 删除
        deleteItem(idList) {
            this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.post("/zGift/deleteGift", {
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
            this.showEdit = true;
            this.form = this.copy(row)
            this.rowId = row.id;
        },
        // 新增
        addFile(val) {
            this.showAdd = val;
        },
        // 查询条件重置
        reset() {
            this.condition.moneyMin = null;
            this.condition.moneyMax = null;
            this.condition.name = "";
            this.condition.time = [];
            this.queryData();
        },
        // 点击确认按钮
        confirmAdd() {
            this.disabled = true
            this.$refs.forms.validate(valid => {
                if (valid) {
                    axios({
                        method: "post",
                        url: "/api/zGift/addGift",
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
            this.$refs.forms.validate(valid => {
                if (valid) {
                    axios({
                        method: "post",
                        url: "/api/zGift/updateGift",
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
        handleSelectSizeChange(val) {
            this.selectSize = val
            this.queryUser()
        },
        handleSelectCurrentChange(val) {
            this.selectCurrent = val
            this.queryUser()
        }
    },
};
</script>
    
<style>
.form .el-input,
.form .el-select {
    width: 300px !important;
}
</style>
    