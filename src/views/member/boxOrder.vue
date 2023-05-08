<!-- 盲果分类 -->
<template>
    <el-card>
        <!-- 搜索条件 -->
        <div class="flex justify-between">
            <el-form ref="condition" :model="condition" class="flex padding-top " label-position="left">
                <el-form-item label="订单号" label-width="60px">
                    <el-input size="small" v-model="condition.orderSn" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="第三方订单号" label-width="120px" class="margin-lr">
                    <el-input size="small" v-model="condition.otherSn" placeholder="请输入三方订单号"></el-input>
                </el-form-item>
                <el-form-item label="状态" label-width="60px">
                    <el-select placeholder="请选择" v-model="condition.payStatus" clearable size="small">
                        <el-option value="待支付">待支付</el-option>
                        <el-option value="已支付">已支付</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" label-width="60px" class="margin-lr">
                    <el-select placeholder="请选择" v-model="condition.payType" clearable size="small">
                        <el-option value="微信">微信</el-option>
                        <el-option value="支付宝">支付宝</el-option>
                        <el-option value="苹果支付">苹果支付</el-option>
                    </el-select>
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
                    <el-form-item label="订单号" label-width="90px" prop="orderSn">
                        <el-input placeholder="请输入订单号" v-model="form.orderSn"></el-input>
                    </el-form-item>
                    <el-form-item label="三方订单" label-width="90px" prop="otherSn">
                        <el-input placeholder="请输入三方订单号" v-model="form.otherSn"></el-input>
                    </el-form-item>
                    <el-form-item label="充值用户" label-width="90px" prop="userId">
                        <el-select placeholder="请选择" v-model="form.userId" clearable>
                            <el-option :label="item.nickname" :value="item.id" v-for="(item, index) in userList"
                                :key="index"></el-option>
                            <div class="margin-lr">
                                <el-pagination @size-change="handleSelectSizeChange"
                                    @current-change="handleSelectCurrentChange" :current-page="selectCurrent"
                                    :page-sizes="[5, 10, 20, 40]" :page-size="selectSize"
                                    layout="total, sizes, prev, pager, next, jumper" :total="selectTotal">
                                </el-pagination>
                            </div>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="盒子产品" label-width="90px" prop="boxId">
                        <el-input placeholder="请输入盒子产品" v-model="form.boxId"></el-input>
                    <!-- <el-select placeholder="请选择" v-model="form.boxId" clearable>
                                            </el-select> -->
                    </el-form-item>
                    <el-form-item label="数量" label-width="90px" prop="num">
                        <el-input placeholder="请输入数量" v-model="form.num"></el-input>
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
                    <el-form-item label="折扣价" label-width="90px" prop="discountPrice">
                        <el-input placeholder="请输入折扣价" v-model="form.discountPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" label-width="90px" prop="payStatus">
                        <el-select placeholder="请选择" v-model="form.payStatus" clearable>
                            <el-option value="1">待支付</el-option>
                            <el-option value="2">已支付</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" label-width="90px" prop="payType">
                        <el-select placeholder="请选择" v-model="form.payType" clearable>
                            <el-option value="1">微信</el-option>
                            <el-option value="2">支付宝</el-option>
                            <el-option value="3">苹果支付</el-option>
                        </el-select>
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
                    <el-form-item label="订单号" label-width="90px" prop="orderSn">
                        <el-input placeholder="请输入订单号" v-model="form.orderSn"></el-input>
                    </el-form-item>
                    <el-form-item label="三方订单" label-width="90px" prop="otherSn">
                        <el-input placeholder="请输入三方订单号" v-model="form.otherSn"></el-input>
                    </el-form-item>
                    <el-form-item label="充值用户" label-width="90px" prop="userId">
                        <el-select placeholder="请选择" v-model="form.userId" clearable>
                            <el-option :label="item.nickname" :value="item.id" v-for="(item, index) in userList"
                                :key="index"></el-option>
                            <el-pagination @size-change="handleSelectSizeChange" @current-change="handleSelectCurrentChange"
                                :current-page="selectCurrent" :page-sizes="[5, 10, 20, 40]" :page-size="selectSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="selectTotal">
                            </el-pagination>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="盒子产品" label-width="90px" prop="boxId">
                        <el-input placeholder="请输入盒子产品" v-model="form.boxId"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" label-width="90px" prop="num">
                        <el-input placeholder="请输入数量" v-model="form.num"></el-input>
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
                    <el-form-item label="折扣价" label-width="90px" prop="discountPrice">
                        <el-input placeholder="请输入折扣价" v-model="form.discountPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" label-width="90px" prop="payStatus">
                        <el-select placeholder="请选择" v-model="form.payStatus" clearable>
                            <el-option value="1">待支付</el-option>
                            <el-option value="2">已支付</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" label-width="90px" prop="payType">
                        <el-select placeholder="请选择" v-model="form.payType" clearable>
                            <el-option value="1">微信</el-option>
                            <el-option value="2">支付宝</el-option>
                            <el-option value="3">苹果支付</el-option>
                        </el-select>
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
                    key: "orderSn",
                    props: "orderSn",
                    label: "订单号",
                    width: 100,
                },
                {
                    key: "otherSn",
                    props: "otherSn",
                    label: "三方订单",
                },
                {
                    key: "nickName",
                    props: "nickName",
                    label: "充值用户",
                },
                {
                    key: "boxName",
                    props: "boxName",
                    label: "盒子产品",
                },
                {
                    key: "num",
                    props: "num",
                    label: "数量",
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
                    key: "discountPrice",
                    props: "discountPrice",
                    label: "折扣价",
                },
                {
                    key: "payType",
                    props: "payType",
                    label: "类型", //1wx 2zfb 3iphone
                    render: (h, params) => {
                        if (params.row.payType === 1) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'success'
                                    },
                                }, '微信')
                            ])
                        } else if (params.row.payType === 2) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'primary'
                                    },
                                }, '支付宝')
                            ])
                        } else {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'warning'
                                    },
                                }, '苹果支付')
                            ])
                        }

                    }
                },
                {
                    key: "payStatus",
                    props: "payStatus",
                    label: "状态", //1待支付 2已支付
                    render: (h, params) => {
                        if (params.row.payStatus === 1) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'danger'
                                    },
                                }, '待支付')
                            ])
                        } else if (params.row.payStatus === 2) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'success'
                                    },
                                }, '已支付')
                            ])
                        }
                    }
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
                    label: "操作"
                },
            ],
            data: [],
            showAdd: false,
            showEdit: false,
            userList: [], // 充值用户列表
            form: {
                orderSn: '',
                otherSn: '',
                userId: '',
                boxId: '',
                num: '',
                boxNum: '',
                price: '',
                discount: '',
                discountPrice: '',
                payType: '',
                payStatus: ''
            },
            condition: {
                orderSn: '',
                otherSn: '',
                payType: '',
                payStatus: '',
                time: [],
            },
            // 校验规则
            rules: {
                orderSn: [
                    { required: true, message: "请输入订单号", trigger: "blur" },
                ],
                otherSn: [{ required: true, message: "请输入三方订单号", trigger: "blur" }],
                userId: [
                    { required: true, message: "请选择充值用户", trigger: "change" },
                ],
                boxId: [
                    { required: true, message: "请输入盒子产品", trigger: "blur" },
                ],
                num: [
                    { required: true, message: "请输入数量", trigger: "blur" },
                ],
                boxNum: [
                    { required: true, message: "请输入盒子数量", trigger: "blur" },
                ],
                price: [
                    { required: true, message: "请输入盒子价值", trigger: "blur" },
                ],
                discount: [
                    { required: true, message: "请输入折扣", trigger: "blur" },
                ],
                discountPrice: [
                    { required: true, message: "请输入折扣价", trigger: "blur" },
                ],
                payStatus: [
                    { required: true, message: "请选择支付状态", trigger: "change" },
                ],
                payType: [{ required: true, message: "请选择支付类型", trigger: "change" }],
            },
            buttonType: "", // 1为编辑 2为新增
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
                url: "/api/zUser/queryBoxOrderList",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    beginNum: this.page.current,
                    queryNum: this.page.size,
                    startTime: this.condition.time[0],
                    endTime: this.condition.time[1],
                    orderSn: this.condition.orderSn,
                    otherSn: this.condition.otherSn,
                    payStatus: this.condition.payStatus,
                    payType: this.condition.payType
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
            this.form.orderSn = ''
            this.form.otherSn = ''
            this.form.userId = ''
            this.form.boxId = ''
            this.form.num = ''
            this.form.boxNum = ''
            this.form.price = ''
            this.form.discount = ''
            this.form.discountPrice = ''
            this.form.payStatus = ''
            this.form.payType = ''
        },
        // 删除
        deleteItem(idList) {
            this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.post("/zUser/deleteBoxOrder", {
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
            // this.form.name = row.name;
            // this.form.imgUrl = row.image;
            // this.form.faId = row.pid;
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
            this.condition.orderSn = ''
            this.condition.otherSn = ''
            this.condition.payStatus = ''
            this.condition.payType = ''
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
                        url: "/api/zUser/addBoxOrder",
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
                        url: "/api/zUser/updateBoxOrder",
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
    