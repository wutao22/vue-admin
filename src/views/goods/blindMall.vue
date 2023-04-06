<!-- 盲果商城 -->
<template>
    <el-card>
        <!-- 搜索条件 -->
        <div class="flex justify-between">
            <el-form ref="condition" :model="condition" class="flex padding-top margin-right flex-wrap align-center"
                label-position="left">
                <el-form-item label="一级分类" label-width="80px" multiple prop="type">
                    <el-select placeholder="请选择" v-model="condition.cidOne" clearable @change="queryconditionTwo()"
                        size="small" style="width: 200px">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupOne"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" label-width="80px" multiple prop="type">
                    <el-select placeholder="请选择" v-model="condition.cidTwo" clearable size="small">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupTwo"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称" label-width="80px" class="margin-lr">
                    <el-input size="small" v-model="condition.name" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item label="添加时间" label-width="80px">
                    <el-date-picker v-model="condition.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" size="small" style="width: 250px"
                        @change="changeTime()">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="上/下架" label-width="80px">
                    <el-select placeholder="请选择" v-model="condition.status" @change="queryData()" clearable size="small">
                        <el-option label="上架" value="2"></el-option>
                        <el-option label="下架" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="推荐状态" label-width="80px">
                    <el-select placeholder="请选择状态" v-model="condition.recommendStatus" @change="queryData()" clearable
                        size="small">
                        <el-option label="推荐" value="2"></el-option>
                        <el-option label="不推荐" value="1"></el-option>
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
            <template v-slot:carouselImage>
                <el-table-column label="盲盒产品轮播图" min-width="180px">
                    <template slot-scope="scope">
                        <span class="flex flex-wrap">
                            <img :src="item" class="margin-lr-sm margin-tb-sm" style="width: 40px; height: 40px"
                                v-for="(item, index) in scope.row.carouselImage.split(',')" :key="index"
                                @click="previewImg(item)" />
                        </span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:operation>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" slot="reference"
                            @click="deleteItem(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:status>
                <el-table-column label="上/下架">
                    <template slot-scope="scope">
                        <el-switch :value="scope.row.status" :active-value="2" :inactive-value="1"
                            @change="changeStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:recommendStatus>
                <el-table-column label="推荐状态">
                    <template slot-scope="scope">
                        <el-switch :value="scope.row.recommendStatus" :active-value="2" :inactive-value="1"
                            @change="changeReStatus(scope.row)"></el-switch>
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
        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="showAdd" @closed="closed()" @open="queryGoods()">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="一级分类" label-width="90px" multiple prop="cidOne">
                    <el-select placeholder="请选择" v-model="form.cidOne" clearable style="width: 300px" @change="queryTwo()">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupOne"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" label-width="90px" multiple prop="cidTwo">
                    <el-select placeholder="请选择" v-model="form.cidTwo" clearable style="width: 300px">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupTwo"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称" label-width="90px" prop="name">
                    <el-input v-model="form.name" style="width: 300px"></el-input>
                </el-form-item>
                <div>
                    <div class="flex">
                        <el-form-item label="产品缩略图" class="flex" prop="thumbnailImage">
                            <el-input v-model="form.thumbnailImage" style="width: 300px"></el-input>
                        </el-form-item>
                        <div class="margin-left">
                            <input type="file" ref="file" style="display: none" v-on:change="uploadFile($event, 1)" />
                            <el-button type="primary" @click="$refs.file.click()">上传</el-button>
                        </div>
                        <div class="margin-left">
                            <el-button type="info" @click="chooseGoods(1)">选择</el-button>
                        </div>
                    </div>
                    <div style="margin-left: 13%">
                        <img v-if="form.thumbnailImage" :src="form.thumbnailImage" alt=""
                            style="width: 100px; height: 100px" />
                    </div>
                </div>

                <div>
                    <div class="flex">
                        <el-form-item label="产品轮播图" class="flex" prop="carouselImage">
                            <el-input v-model="form.carouselImage" style="width: 300px"></el-input>
                        </el-form-item>
                        <div class="margin-left">
                            <input type="file" ref="files" style="display: none" multiple="multiple"
                                v-on:change="uploadFile($event, 2)" />
                            <el-button type="primary" @click="$refs.files.click()">上传</el-button>
                        </div>
                        <div class="margin-left">
                            <el-button type="info" @click="chooseGoods(2)">选择</el-button>
                        </div>
                    </div>
                    <div class="flex align-center flex-wrap" style="margin-left: 10% !important">
                        <div class="flex margin-lr-sm" style="align-items: baseline" v-for="(item, index) in fileListImg"
                            :key="index">
                            <div class="flex flex-direction">
                                <img v-if="item" :src="item" class="" alt="" style="width: 100px; height: 100px" />
                                <div style="
                              background-color: #409eff;
                              opacity: 0.6;
                              width: 100px;
                              height: 20px;
                              margin-bottom: 10px;
                              border-radius: 4px;
                            " class="flex justify-center align-center" @click="removeImage(item, index)">
                                    <i class="el-icon-delete" style="color: white; text-align: center" />
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- <div style="margin-left: 13%">
              <img
                v-if="form.carouselImage"
                :src="form.carouselImage"
                alt=""
                style="width: 100px; height: 100px"
              />
                    </div> -->
                </div>

                <el-form-item label="规格">
                    <div class="flex justify-around w6 margin-left-xl">
                        <div>
                            规格ID
                            <span style="color: #ed4343e6; font-size: 12px">(规格ID不可重复)</span>
                        </div>
                        <div>参考价格</div>
                        <div>盒子数量</div>
                        <div>库存</div>
                    </div>
                    <div class="flex justify-around w6" style="margin-left: 85px" v-for="(item, index) in specList"
                        :key="index">
                        <el-input v-model="item.spec" size="small" class="margin-lr-sm"></el-input>
                        <el-input v-model="item.price" size="small" class="margin-lr-sm"></el-input>
                        <el-input v-model="item.box_num" size="small" class="margin-lr-sm"></el-input>
                        <el-input v-model="item.stock" size="small" class="margin-lr-sm"></el-input>
                        <div class="flex">
                            <i class="el-icon-delete margin-top margin-left" style="font-size: 18px"
                                @click="deleteColums(item, index)"></i>
                        </div>
                    </div>
                    <div>
                        <el-button type="primary" size="mini" class="margin-sm" style="margin-left: 90px"
                            @click="addToColums()">追加</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="图文详情" prop="content">
                    <quill-editor ref="text" v-model="form.content" class="editor margin-left-xxl" style="height: 300px" />
                </el-form-item>
                <el-form-item label="上/下架" class="margin-top-xxl">
                    <el-radio v-model="form.status" :label="1">下架</el-radio>
                    <el-radio v-model="form.status" :label="2">上架</el-radio>
                </el-form-item>
                <el-form-item label="推荐状态">
                    <el-radio v-model="form.recommendStatus" :label="1">不推荐</el-radio>
                    <el-radio v-model="form.recommendStatus" :label="2">推荐</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer margin-top-xl">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="confirm()" :disabled="disabled">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="showEdit" @closed="closed()" @open="queryGoods()">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="一级分类" label-width="90px" multiple prop="cidOne">
                    <el-select placeholder="请选择" v-model="form.cidOne" clearable style="width: 300px" @change="queryTwo()">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupOne"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" label-width="90px" multiple prop="cidTwo">
                    <el-select placeholder="请选择" v-model="form.cidTwo" clearable style="width: 300px">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in groupTwo"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称" label-width="90px" prop="name">
                    <el-input v-model="form.name" style="width: 300px"></el-input>
                </el-form-item>
                <div>
                    <div class="flex">
                        <el-form-item label="产品缩略图" class="flex" prop="thumbnailImage">
                            <el-input v-model="form.thumbnailImage" style="width: 300px"></el-input>
                        </el-form-item>
                        <div class="margin-left">
                            <input type="file" ref="file" style="display: none" v-on:change="uploadFile($event, 1)" />
                            <el-button type="primary" @click="$refs.file.click()">上传</el-button>
                        </div>
                        <div class="margin-left">
                            <el-button type="info" @click="chooseGoods(1)">选择</el-button>
                        </div>
                    </div>
                    <div style="margin-left: 13%">
                        <img v-if="form.thumbnailImage" :src="form.thumbnailImage" alt=""
                            style="width: 100px; height: 100px" />
                    </div>
                </div>

                <div>
                    <div class="flex">
                        <el-form-item label="产品轮播图" class="flex" prop="carouselImage">
                            <el-input v-model="form.carouselImage" style="width: 300px"></el-input>
                        </el-form-item>
                        <div class="margin-left">
                            <input type="file" ref="files" multiple="multiple" style="display: none"
                                v-on:change="uploadFile($event, 2)" />
                            <el-button type="primary" @click="$refs.files.click()">上传</el-button>
                        </div>
                        <div class="margin-left">
                            <el-button type="info" @click="chooseGoods(2)">选择</el-button>
                        </div>
                    </div>
                    <div class="flex align-center flex-wrap" style="margin-left: 10% !important">
                        <div class="flex margin-lr-sm" style="align-items: baseline" v-for="(item, index) in fileListImg"
                            :key="index">
                            <div class="flex flex-direction">
                                <img v-if="item" :src="item" class="" alt="" style="width: 100px; height: 100px" />
                                <div style="
                              background-color: #409eff;
                              opacity: 0.6;
                              width: 100px;
                              height: 20px;
                              margin-bottom: 10px;
                              border-radius: 4px;
                            " class="flex justify-center align-center" @click="removeImage(item, index)">
                                    <i class="el-icon-delete" style="color: white; text-align: center" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <el-form-item label="规格">
                    <div class="flex justify-around w6 margin-left-xl">
                        <div class="spec">规格ID</div>
                        <div>参考价格</div>
                        <div>盒子数量</div>
                        <div>库存</div>
                    </div>
                    <div class="flex justify-around w6" style="margin-left: 85px" v-for="(item, index) in editSpec"
                        :key="index">
                        <el-input v-model="item.spec" size="small" class="margin-lr-sm"></el-input>
                        <el-input v-model="item.price" size="small" class="margin-lr-sm"></el-input>
                        <el-input v-model="item.box_num" size="small" class="margin-lr-sm"></el-input>
                        <el-input v-model="item.stock" size="small" class="margin-lr-sm"></el-input>
                        <div class="flex">
                            <i class="el-icon-delete margin-top margin-left" style="font-size: 18px"
                                @click="deleteEditColums(item, index)"></i>
                        </div>
                    </div>
                    <div>
                        <el-button type="primary" size="mini" class="margin-sm" style="margin-left: 90px"
                            @click="addToEditColums()">追加</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="图文详情" prop="content">
                    <quill-editor ref="text" v-model="form.content" class="editor margin-left-xxl" style="height: 300px" />
                </el-form-item>
                <el-form-item label="上/下架" class="margin-top-xxl">
                    <el-radio v-model="form.status" :label="1">下架</el-radio>
                    <el-radio v-model="form.status" :label="2">上架</el-radio>
                </el-form-item>
                <el-form-item label="推荐状态">
                    <el-radio v-model="form.recommendStatus" :label="1">不推荐</el-radio>
                    <el-radio v-model="form.recommendStatus" :label="2">推荐</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer margin-top-xl">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="confirm()" :disabled="disabled">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 预览图片 -->
        <imageModal :show="preview" :url="url" @closed="closed"></imageModal>
        <!-- 子表格 -->
        <chooseTable :show="showChooseModal" @close="close" @selectItem="selectItem"></chooseTable>
    </el-card>
</template>
      
<script>
import axios from "axios";
import chooseTable from "@/components/ChooseTable";
export default {
    components: {
        chooseTable,
    },
    data() {
        return {
            colums: [
                {
                    key: "id",
                    props: "id",
                    label: "ID",
                    width: 80,
                },
                {
                    key: "cidOne",
                    props: "cidOne",
                    label: "一级分类",
                    width: 100,
                    render: (h, params) => {
                        let name = "";
                        this.groupOne.forEach((item) => {
                            if (params.row.cidOne === item.id) {
                                name = item.name;
                            }
                        });
                        return h("div", name);
                    },
                },
                {
                    key: "categoryName",
                    props: "categoryName",
                    label: "二级分类",
                },
                {
                    key: "name",
                    props: "name",
                    label: "产品名称",
                },
                {
                    key: "thumbnailImage",
                    props: "thumbnailImage",
                    label: "产品缩略图",
                    render: (h, params) => {
                        return h("div", [
                            h("img", {
                                domProps: {
                                    src: params.row.thumbnailImage,
                                },
                                style: {
                                    width: "40px",
                                    height: "40px",
                                },
                                on: {
                                    click: () => {
                                        this.previreImg(params.row.thumbnailImage);
                                    },
                                },
                            }),
                        ]);
                    },
                },
                {
                    slot: "carouselImage",
                },
                {
                    slot: "status",
                },
                {
                    slot: "recommendStatus",
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
            file: null,
            files: [], // 轮播图文件
            filesList: [], // 轮播图回显
            fileListImg: [],
            imgType: 1, // 1为缩略图 2为轮播图
            showAdd: false,
            showEdit: false,
            preview: false,
            url: "", // 预览图片链接
            showChooseModal: false,
            specList: [
                {
                    spec: "",
                    price: "",
                    box_num: "",
                    stock: "", // 规格列表
                },
            ],
            formItem: {
                spec: "",
                price: "",
                box_num: "",
                stock: "", // 追加规格
            },
            condition: {
                id: "",
                cidOne: "",
                cidTwo: "",
                name: "",
                time: [],
                status: "",
                recommendStatus: "",
            },
            form: {
                thumbnailImage: "",
                carouselImage: "",
                cidOne: "",
                cidTwo: "",
                name: "",
                startTime: "",
                endTime: "",
                content: "",
                status: 1,
                recommendStatus: 1,
            },
            groupOne: [], // 一级分类
            groupTwo: [], // 二级分类
            editSpec: [], // 编辑时规格
            // 校验规则
            rules: {
                cidOne: [
                    { required: true, message: "请选择一级分类", trigger: "change" },
                ],
                cidTwo: [
                    { required: true, message: "请选择二级分类", trigger: "change" },
                ],
                name: [{ required: true, message: "请填写产品名称", trigger: "blur" }],
                thumbnailImage: [
                    { required: true, message: "请上传产品缩略图", trigger: "blur" },
                ],
                carouselImage: [
                    { required: true, message: "请上传产品轮播图", trigger: "blur" },
                ],
            },
            buttonType: "", // 1为编辑 2为新增
            rowId: "", // 编辑一列的id
            page: {
                current: 1,
                size: 10,
                total: 0,
            },
            disabled: false,
        };
    },
    mounted() {
        this.queryData();
        this.queryGoods();
    },
    methods: {
        // 查询首页数据
        queryData() {
            this.get("/goodsManagement/queryZBlindFruitByPage", {
                beginNum: this.page.current,
                queryNum: this.page.size,
                cidOne: this.condition.cidOne,
                cidTwo: this.condition.cidTwo,
                status: this.condition.status,
                recommendStatus: this.condition.recommendStatus,
                name: this.condition.name,
                startTime: this.condition.time[0],
                endTime: this.condition.time[1],
            }).then((res) => {
                this.data = res.data.records;
                this.page.total = res.data.total;
            });
        },
        // 查询一级分类
        queryGoods() {
            this.get("/goodsManagement/queryPids").then((res) => {
                if (res.data) {
                    this.groupOne = res.data;
                    //   this.queryEditTwo();
                }
            });
        },
        // 查询二级分类
        queryTwo() {
            this.get("/goodsManagement/queryZBlindFruitCidTwo", {
                id: this.form.cidOne,
            }).then((res) => {
                this.groupTwo = res.data;
            });
        },
        queryconditionTwo() {
            this.get("/goodsManagement/queryZBlindFruitCidTwo", {
                id: this.condition.cidOne,
            }).then((res) => {
                this.groupTwo = res.data;
            });
        },
        // 处理查询条件时间
        changeTime() {
            this.condition.time[0] = this.condition.time[0] + " " + "00:00:00";
            this.condition.time[1] = this.condition.time[1] + " " + "23:59:59";
        },
        // 上传图片
        uploadFile(e, flag) {
            if (flag === 1) {
                this.file = e.target.files[0];
                this.form.thumbnailImage = window.URL.createObjectURL(this.file);
            } else {
                this.files = e.target.files;
                this.fileListImg = [];
                let list = e.target.files;
                list.forEach((element) => {
                    this.filesList.push(element);
                });
                this.files = this.filesList;
                this.filesList.forEach((item) => {
                    let url = window.URL.createObjectURL(item);
                    this.fileListImg.push(url);
                });
                this.form.carouselImage = this.fileListImg.join(",");
            }
        },
        // 预览图片
        previewImg(row) {
            this.url = row;
            this.preview = true;
        },
        // 删除批量上传图片
        removeImage(item, index) {
            this.fileListImg.splice(index, 1);
            this.filesList.splice(index, 1);
            this.files.splice(index, 1);
        },
        // 预览查看图片
        previreImg(row) {
            this.url = row;
            this.preview = true;
        },
        // 选择
        chooseGoods() {
            this.showChooseModal = true;
        },
        // 选择子表格框dialog关闭回调
        close() {
            this.showChooseModal = false;
        },
        // 外部添加编辑修改框关闭
        closed() {
            this.preview = false;
            this.url = "";
            this.form.thumbnailImage = "";
            this.form.carouselImage = "";
            this.form.cidOne = "";
            this.form.cidTwo = "";
            this.form.name = "";
            this.form.startTime = "";
            this.form.endTime = "";
            this.form.content = "";
            this.form.status = 1;
            this.form.recommendStatus = 1;
            this.files = [];
            this.fileListImg = [];
            this.filesList = [];
        },
        // 删除
        deleteItem(idList) {
            this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.post("/goodsManagement/deleteZBlindFruit", {
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
        // 选择文件
        chooseGoods(val) {
            this.imgType = val;
            this.showChooseModal = true;
        },
        // 新增
        addFile(val) {
            this.showAdd = val;
        },
        // 追加
        addToColums() {
            this.formItem = {};
            this.specList.push(this.formItem);
        },
        // 删除规格
        deleteColums(item, index) {
            this.specList.splice(index, 1);
        },
        // 编辑追加规格列表
        addToEditColums(item) {
            this.formItem = {};
            this.editSpec.push(this.formItem);
        },
        // 编辑删除规格列表
        deleteEditColums(item, index) {
            this.editSpec.splice(index, 1);
        },
        // 修改状态
        changeStatus(row) {
            this.post("/goodsManagement/updateZBlindFruitStatus", {
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
        changeReStatus(row) {
            this.post("/goodsManagement/updateBRecommendStatus", {
                id: row.id,
                recommendStatus: row.recommendStatus,
            }).then((res) => {
                if (res.data.code === 200) {
                    this.showSuccess();
                    this.queryData();
                }
            });
        },
        // 编辑
        editItem(row) {
            this.buttonType = 2;
            this.showEdit = true;
            this.form = this.copy(row);
            this.fileListImg = this.form.carouselImage.split(",");
            this.rowId = row.id;
            let jsonobj = JSON.parse(row.specs);
            const map = new Map();
            for (const k of Object.keys(jsonobj)) {
                map.set(k, jsonobj[k]);
                // console.log(map)
                this.editSpec = [...map.values()];
            }
        },
        // 新增
        addFile(val) {
            this.showAdd = val;
            this.buttonType = 1;
        },
        cancel() {
            this.showAdd = false;
            this.showEdit = false;
        },
        // 查询条件重置
        reset() {
            this.condition.id = "";
            this.condition.cidOne = "";
            this.condition.cidTwo = "";
            this.condition.name = "";
            this.condition.time = [];
            this.condition.status = "";
            this.condition.recommendStatus = "";
            this.queryData();
        },
        // 点击确认按钮
        confirm() {
            // 1 为新增 2 为编辑
            this.disabled = true;
            // 新增确认
            if (this.buttonType === 1) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let specMap = new Map();
                        for (let i in this.specList) {
                            specMap.set(i, this.specList[i]);
                        }
                        // 转为字符串
                        var obj = {};
                        for (let [key, value] of specMap) {
                            obj[key] = value;
                        }
                        let data = new FormData();
                        if (this.file) {
                            data.append("file", this.file);
                        } else {
                            data.append("thumbnailImage", this.form.thumbnailImage);
                        }
                        if (this.files) {
                            for (const file of this.files) {
                                data.append("files", file);
                            }
                        }
                        let img = [];
                        this.fileListImg.forEach((item, index) => {
                            if (item.substring(0, 4) !== "blob") {
                                img.push(item);
                            }
                        });
                        if (img.length != 0) {
                            data.append("carouselImage", img.join(","));
                        }
                        data.append("cidOne", this.form.cidOne);
                        data.append("cidTwo", this.form.cidTwo);
                        data.append("name", this.form.name);
                        data.append("specs", JSON.stringify(obj));
                        data.append("content", this.form.content);
                        data.append("status", this.form.status);
                        data.append("recommendStatus", this.form.recommendStatus);
                        axios({
                            method: "POST",
                            url: "/api/goodsManagement/addZBlindFruit",
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                            data: data,
                        }).then((res) => {
                            if (res.data.code === 200) {
                                this.showSuccess();
                                this.queryData();
                                this.showAdd = false;
                                this.disabled = false;
                            }
                        });
                    }
                });
            } else if (this.buttonType === 2) {
                // 编辑确认
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let specMap = new Map();
                        for (let i in this.editSpec) {
                            specMap.set(i, this.editSpec[i]);
                        }
                        // 转为字符串
                        var obj = {};
                        for (let [key, value] of specMap) {
                            obj[key] = value;
                        }
                        let data = new FormData();
                        if (this.file) {
                            data.append("file", this.file);
                        } else {
                            data.append("thumbnailImage", this.form.thumbnailImage);
                        }
                        if (this.files) {
                            for (const file of this.files) {
                                data.append("files", file);
                            }
                        }
                        let img = [];
                        this.fileListImg.forEach((item, index) => {
                            if (item.substring(0, 4) !== "blob") {
                                img.push(item);
                            }
                        });
                        if (img.length != 0) {
                            data.append("carouselImage", img.join(","));
                        }
                        data.append("id", this.rowId);
                        data.append("cidOne", this.form.cidOne);
                        data.append("cidTwo", this.form.cidTwo);
                        data.append("name", this.form.name);
                        data.append("specs", JSON.stringify(obj));
                        data.append("content", this.form.content);
                        data.append("status", this.form.status);
                        data.append("recommendStatus", this.form.recommendStatus);
                        axios({
                            method: "POST",
                            url: "/api/goodsManagement/updateZBlindFruit",
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                            data: data,
                        }).then((res) => {
                            if (res.data.code === 200) {
                                this.showSuccess();
                                this.queryData();
                                this.showEdit = false;
                                this.disabled = false;
                            }
                        });
                    }
                });
            }
        },
        // 选中子表格数据
        selectItem(url) {
            if (this.imgType === 1) {
                this.form.thumbnailImage = url;
            } else {
                this.fileListImg.push(url);
                this.form.carouselImage = this.fileListImg.join(",");
            }
            this.showChooseModal = false;
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
      
<style >
.el-form-item {
    margin-left: 20px;
}

.spec::after {
    content: "(规格ID不可重复)";
    position: absolute;
    font-size: 12px;
    color: red;
    top: 14px;
    left: 10%;
}
</style>
      