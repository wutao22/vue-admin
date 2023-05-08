<!-- app版本管理-->
<template>
    <el-card>
        <!-- 搜索条件 -->
        <div class="flex justify-between">
            <el-form ref="condition" :model="condition" class="flex padding-top " label-position="left">
                <el-form-item label="安卓序号" label-width="80px">
                    <el-input size="small" v-model="condition.versionCode" placeholder="请输入安卓序号"></el-input>
                </el-form-item>
                <el-form-item label="强制更新" label-width="80px" class="margin-lr">
                    <el-select placeholder="请选择" v-model="condition.coerce" clearable size="small">
                        <el-option label="强制" :value="2"></el-option>
                        <el-option label="不强制" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" label-width="60px" class="margin-lr">
                    <el-select placeholder="请选择" v-model="condition.type" clearable size="small">
                        <el-option :value="1" label="IOS"></el-option>
                        <el-option :value="2" label="安卓"></el-option>
                    </el-select>
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
            <template v-slot:downloadurl>
                <el-table-column label="下载地址" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div class="flex flex-wrap">
                            <div class="flex flex-wrap">
                                <a :href="scope.row.downloadurl">
                                    <el-input type="text" suffix-icon="el-icon-link" :value="scope.row.downloadurl"
                                        size="small" disabled />
                                </a>
                            </div>
                        </div>
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
                    <el-form-item label="类型" label-width="90px" prop="type">
                        <el-select placeholder="请选择" v-model="form.type" clearable>
                            <el-option :value="1" label="IOS"></el-option>
                            <el-option :value="2" label="安卓"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="旧版本号" label-width="90px" prop="oldversion">
                        <el-input placeholder="请输入旧版本号" v-model="form.oldversion"></el-input>
                    </el-form-item>
                    <el-form-item label="新版本号" label-width="90px" prop="newversion">
                        <el-input placeholder="请输入新版本号" v-model="form.newversion"></el-input>
                    </el-form-item>
                    <el-form-item label="包大小" label-width="90px" prop="packagesize">
                        <el-input placeholder="请输入包大小" v-model="form.packagesize"></el-input>
                    </el-form-item>
                    <el-form-item label="升级内容" label-width="90px" prop="content">
                        <el-input placeholder="请输入升级内容" v-model="form.content"></el-input>
                    </el-form-item>
                    <el-form-item label="下载地址" label-width="90px" prop="downloadurl">
                        <el-input placeholder="请输入下载地址" v-model="form.downloadurl"></el-input>
                    </el-form-item>
                    <el-form-item label="安卓序号" label-width="90px" prop="versionCode">
                        <el-input placeholder="请输入安卓序号" v-model="form.versionCode"></el-input>
                    </el-form-item>
                    <el-form-item label="强制更新" label-width="90px" prop="coerce">
                        <el-select placeholder="请选择" v-model="form.coerce" clearable>
                            <el-option label="强制" :value="2"></el-option>
                            <el-option label="不强制" :value="1"></el-option>
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
        <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()">
            <div>
                <el-form ref="forms" :model="form" :rules="rules" label-width="90px" class="form">
                    <el-form-item label="类型" label-width="90px" prop="type">
                        <el-select placeholder="请选择" v-model="form.type" clearable>
                            <el-option :value="1" label="IOS"></el-option>
                            <el-option :value="2" label="安卓"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="旧版本号" label-width="90px" prop="oldversion">
                        <el-input placeholder="请输入旧版本号" v-model="form.oldversion"></el-input>
                    </el-form-item>
                    <el-form-item label="新版本号" label-width="90px" prop="newversion">
                        <el-input placeholder="请输入新版本号" v-model="form.newversion"></el-input>
                    </el-form-item>
                    <el-form-item label="包大小" label-width="90px" prop="packagesize">
                        <el-input placeholder="请输入包大小" v-model="form.packagesize"></el-input>
                    </el-form-item>
                    <el-form-item label="升级内容" label-width="90px" prop="content">
                        <el-input placeholder="请输入升级内容" v-model="form.content"></el-input>
                    </el-form-item>
                    <el-form-item label="下载地址" label-width="90px" prop="downloadurl">
                        <el-input placeholder="请输入下载地址" v-model="form.downloadurl"></el-input>
                    </el-form-item>
                    <el-form-item label="安卓序号" label-width="90px" prop="versionCode">
                        <el-input placeholder="请输入安卓序号" v-model="form.versionCode"></el-input>
                    </el-form-item>
                    <el-form-item label="强制更新" label-width="90px" prop="coerce">
                        <el-select placeholder="请选择" v-model="form.coerce" clearable>
                            <el-option label="强制" :value="2"></el-option>
                            <el-option label="不强制" :value="1"></el-option>
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
                    key: "type",
                    props: "type",
                    label: "类型", 
                    width: 80,
                    render: (h, params) => {
                        if (params.row.type === 1) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'success'
                                    },
                                }, 'IOS')
                            ])
                        } else if (params.row.type === 2) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'primary'
                                    },
                                }, '安卓')
                            ])
                        }
                    }
                },
                {
                    key: "oldversion",
                    props: "oldversion",
                    label: "旧版本号",
                },
                {
                    key: "newversion",
                    props: "newversion",
                    label: "新版本号",
                },
                {
                    key: "packagesize",
                    props: "packagesize",
                    label: "包大小",
                    width: 80,
                },
                {
                    key: "content",
                    props: "content",
                    label: "升级内容",
                },
                {
                    slot: 'downloadurl',
                    label: "下载地址",
                },
                {
                    key: "versionCode",
                    props: "versionCode",
                    label: "安卓序号",
                    width: 80,
                },
                {
                    key: "coerce",
                    props: "coerce",
                    label: "强制更新",
                    render: (h, params) => {
                        if (params.row.coerce === 1) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'success'
                                    },
                                }, '不强制')
                            ])
                        } else if (params.row.coerce === 2) {
                            return h('div', [
                                h('el-tag', {
                                    props: {
                                        type: 'primary'
                                    },
                                }, '强制更新')
                            ])
                        }
                    }
                },
                {
                    prop: "createtime",
                    key: "createtime",
                    label: "创建时间",
                    width: 200,
                    render: (h, params) => {
                        return h("div", this.dateTimeFormat(params.row.createtime));
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
            form: {
                coerce: '',
                content: '',
                downloadurl: '',
                newversion: '',
                oldversion: '',
                packagesize: '',
                type: null,
                versionCode: null
            },
            condition: {
                type: '',
                coerce: '',
                versionCode: '',
            },
            // 校验规则
            rules: {
                coerce: [
                    { required: true, message: "请选择是否强制更新", trigger: "change" },
                ],
                content: [{ required: true, message: "请输入升级内容", trigger: "blur" }],
                type: [
                    { required: true, message: "请选择类型", trigger: "change" },
                ],
                downloadurl: [
                    { required: true, message: "请输入下载地址", trigger: "blur" },
                ],
                packagesize: [
                    { required: true, message: "请输入包大小", trigger: "blur" },
                ],
                newversion: [
                    { required: true, message: "请输入新版本号", trigger: "blur" },
                ],
                oldversion: [
                    { required: true, message: "请输入旧版本号", trigger: "blur" },
                ],
                versionCode: [
                    { required: true, message: "请输入安卓序号", trigger: "blur" },
                ]
            },
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
                url: "/api/app/queryAppVersionInfo",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    beginNum: this.page.current,
                    queryNum: this.page.size,
                    type: this.condition.type,
                    versionCode: this.condition.versionCode,
                    coerce: this.condition.coerce,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.data = res.data.data.records
                    this.page.total = res.data.data.total
                }
            });
        },
        // 外部修改新增框关闭
        closed() {
            this.showEdit = false
            this.showAdd = false
            this.form.coerce = ''
            this.form.type = ''
            this.form.oldversion = ''
            this.form.newversion = ''
            this.form.packagesize = ''
            this.form.content = ''
            this.form.downloadurl = ''
            this.form.versionCode = ''
        },
        // 删除
        deleteItem(idList) {
            this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.post("/app/deleteAppVersionInfo", {
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
            this.showAdd = true;
        },
        // 查询条件重置
        reset() {
            this.condition.coerce = ''
            this.condition.versionCode = ''
            this.condition.type = ''
            this.queryData();
        },
        // 点击确认按钮
        confirmAdd() {
            this.disabled = true
            this.$refs.forms.validate(valid => {
                if (valid) {
                    axios({
                        method: "post",
                        url: "/api/app/addAppVersionInfo",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: this.form
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.showAdd = false
                            this.showSuccess()
                            this.queryData()
                            this.disabled = false
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
                        url: "/api/app/updateAppVersionInfo",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: this.form
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.showEdit = false
                            this.showSuccess()
                            this.queryData()
                            this.disabled = false
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
    