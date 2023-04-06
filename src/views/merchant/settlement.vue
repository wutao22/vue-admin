<template>
    <div>
        <el-card>
            <!-- 搜索条件 -->
            <div class="flex justify-between align-center">
                <el-form ref="form" :model="condition" label-width="80px" style="flex-wrap: wrap;"
                    class="flex align-center padding-top-lg">
                    <el-form-item label="审核状态">
                        <el-select placeholder="请选择状态" v-model="condition.status" @change="queryData()" clearable
                            size="small">
                            <el-option label="待审核" value="0"></el-option>
                            <el-option label="审核通过" value="1"></el-option>
                            <el-option label="审核拒绝" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="flex justify-center align-center">
                    <el-button type="primary" @click="queryData()" size="small">搜索</el-button>
                    <el-button type="info" @click="reset()" size="small">重置</el-button>
                </div>
            </div>
            <Table :tableData="data" :colums="colums" :showFresh="true" @fresh="queryData">
                <template v-slot:oparetion>
                    <el-table-column label="操作" fixed="right" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="approve(scope.row)"
                                v-if="scope.row.verify === '0'">通过审核</el-button>
                            <el-button type="text" size="small" @click="reject(scope.row)"
                                v-if="scope.row.verify === '0'">拒绝审核</el-button>
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
        </el-card>
        <!-- 预览图片 -->
        <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: [],
            colums: [
                {
                    key: "id",
                    props: "id",
                    label: "ID",
                    width: 80,
                },
                {
                    key: "id",
                    props: "id",
                    label: "商家入驻ID",
                    width: 100,
                },
                {
                    prop: "business",
                    key: "business",
                    label: "商家名称",
                },
                {
                    prop: "product",
                    key: "product",
                    label: "主打产品",
                },
                {
                    prop: "trade",
                    key: "trade",
                    label: "行业",
                },
                {
                    prop: "phone",
                    key: "phone",
                    label: "联系方式",
                },
                {
                    prop: "contacts",
                    key: "contacts",
                    label: "联系人",
                },
                {
                    prop: "showImg",
                    key: "showImg",
                    label: "店铺展示图",
                    render: (h, params) => {
                        return h("div", [
                            h("img", {
                                domProps: {
                                    src: params.row.showImg,
                                },
                                style: {
                                    width: "40px",
                                    height: "40px",
                                },
                                on: {
                                    click: () => {
                                        this.previewImg(params.row.showImg);
                                    },
                                },
                            }),
                        ]);
                    },
                },
                {
                    prop: "license",
                    key: "license",
                    label: "营业执照",
                    render: (h, params) => {
                        return h("div", [
                            h("img", {
                                domProps: {
                                    src: params.row.license,
                                },
                                style: {
                                    width: "40px",
                                    height: "40px",
                                },
                                on: {
                                    click: () => {
                                        this.previewImg(params.row.license);
                                    },
                                },
                            }),
                        ]);
                    },
                },
                {
                    key: "verify",
                    label: "审核状态",
                    render: (h, params) => {
                        if (params.row.verify === '0') {
                            return h('div', '待审核')
                        } else if (params.row.verify === '1') {
                            return h('div', '审核通过')
                        } else {
                            return h('div', '审核拒绝')
                        }
                    },
                },
                {
                    prop: "makeTime",
                    key: "makeTime",
                    label: "洽淡时间",
                    render: (h, params) => {
                        return h("div", this.dateTimeFormat(params.row.makeTime));
                    },
                },
                {
                    slot: "oparetion",
                    label: "操作",
                },
            ],
            condition: {
                status: ''
            },
            url: '',
            preview: false,
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
        }
    },
    mounted() {
        this.queryData()
    },
    methods: {
        // 查询数据
        queryData() {
            this.get("/merchant/queryMerchantSettlement", {
                beginNum: this.page.current,
                queryNum: this.page.size,
                verifyFlag: this.condition.status
            }).then((res) => {
                this.data = res.data.records;
                this.page.total = res.data.total;
            });
        },
        // 审核通过
        approve(row) {
            this.$confirm("是否确认通过该商家入驻审核?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.post("/merchant/merchantSettlementVerify", {
                        id: row.id,
                        verifyFlag: 1,
                    }).then((res) => {
                        if (res.data.code === 200) {
                            this.queryData()
                            this.$message({
                                type: "success",
                                message: "执行成功!",
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消审核",
                    });
                });
        },
        // 审核拒绝
        reject(row) {
            this.$confirm("是否确认拒绝该商家入驻审核?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    this.post("/merchant/merchantSettlementVerify", {
                        id: row.id,
                        verifyFlag: 2,
                    }).then((res) => {
                        if (res.data.code === 200) {
                            this.queryData()
                            this.$message({
                                type: "success",
                                message: "执行成功!",
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消拒绝审核",
                    });
                });
        },
        // 查看图片
        previewImg(row) {
            this.url = row;
            this.preview = true;
        },
        // 重置搜索条件
        reset() {
            this.condition.status = ''
            this.queryData()
        },
        // 关闭
        closed() {
            this.url = ''
            this.preview = false
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
}
</script>
<style></style>