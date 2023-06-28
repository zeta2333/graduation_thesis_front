<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="角色名称">
                            <el-input style="width: 100%" v-model="searchObj.keyword" placeholder="角色名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="display: flex">
                    <el-button type="primary" icon="el-icon-search" size="mini" :loading="listLoading"
                        @click="fetchData()">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
                </el-row>
            </el-form>
        </div>
        <br />
        <!-- 工具条 -->
        <div class="tools-div">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
        </div>
        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%; margin-top: 10px"
            @selection-change="handleSelectionChange">


            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (current - 1) * size + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="teacherName" label="教师名称" />
            <el-table-column prop="position" label="教师职称" />
            <el-table-column prop="researchDirection" label="研究方向" />
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column prop="updateTime" label="更新时间" width="160" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" />
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                        title="删除" />
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination :current-page="current" :total="total" :page-size="size" style="padding: 30px 0; text-align: center"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />
        <!-- 弹出层 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" @close="close()">
            <el-form ref="dataForm" :model="sysTeacher" label-width="150px" size="small" style="padding-right: 40px">

                <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label" >
                    <el-input :type="item.label==='密码'?'password':'text'" v-model="sysTeacher[item.prop]" />

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
                <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from "@/api/system/sysTeacher";
export default {
    // 定义数据模型
    data() {
        return {
            listLoading: false,
            list: [], // 列表
            total: 0, // 总记录数
            current: 1, // 页码
            size: 10, // 每页记录数
            searchObj: {}, // 查询条件
            multipleSelection: [], // 批量删除选中的记录列表

            dialogVisible: false,
            dialogTitle: "教师修改",
            sysTeacher: {},
            saveBtnDisabled: false,
            mode: ''
        };
    },
    // 页面渲染成功后获取数据
    created() {
        this.fetchData();
    },
    computed: {
        formItems() {
            if (this.mode === 'add') {
                return [
                    { label: '教师名称', prop: 'teacherName' },
                    { label: '教师职称', prop: 'position' },
                    { label: '研究方向', prop: 'researchDirection' },
                    { label: '性别', prop: 'gender' },
                    { label: '密码', prop: 'password' },
                    { label: '用户名', prop: 'username' },

                    { label: '手机号码', prop: 'tel' },

                ];
            } else if (this.mode === 'edit') {
                return [
                    { label: '教师职称', prop: 'position' },
                    { label: '研究方向', prop: 'researchDirection' },
                ];
            }
        },
    },
    // 定义方法
    methods: {
        fetchData(current = 1) {
            this.listLoading = true
            this.current = current;
            // 调用api
            console.log(this.searchObj);
            api
                .getPageList(this.current, this.size, this.searchObj)
                .then((response) => {
                    this.list = response.data.records;
                    this.total = response.data.total;
                    // 数据加载并绑定成功
                    this.listLoading = false
                });

        },
        // 重置表单
        resetData() {
            console.log("重置查询表单");
            this.searchObj = {};
            this.fetchData();
        },
        // 根据id删除数据
        removeDataById(id) {
            // debugger
            this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    // promise
                    // 点击确定，远程调用ajax
                    return api.removeById(id);
                })
                .then((response) => {
                    this.fetchData(this.current);
                    this.$message.success(response.message || "删除成功");
                }).catch(() => {
                    this.$message.info('取消删除')
                });
        },
        // 添加按钮，显示弹出框
        add() {
            this.dialogTitle = "添加"
            this.mode = 'add';
            this.dialogVisible = true;
        },
        // 保存或更新
        saveOrUpdate() {
            this.saveBtnDisabled = true; // 防止表单重复提交
            if (this.mode == 'add') {
                this.saveData();
            } else {
                this.updateData();
            }
        },

        // 新增
        saveData() {
            api.save(this.sysTeacher).then((response) => {
                this.$message.success(response.message || "操作成功");
                this.dialogVisible = false;
                this.fetchData(this.current);
            });
        },
        // 编辑按钮，显示弹出框
        edit(id) {
            this.dialogTitle = "修改";
            this.mode = 'edit';
            this.dialogVisible = true;
            this.fetchDataById(id);
        },
        // 根据id获取
        fetchDataById(id) {
            api.getById(id).then((response) => {
                this.sysTeacher = response.data;
            });
        },
        // 更新数据
        updateData() {
            api.updateById(this.sysTeacher).then((response) => {
                this.$message.success(response.message || "操作成功");
                this.dialogVisible = false;
                this.fetchData(this.current);
            });
        },
        // 当多选选项发生变化的时候调用
        handleSelectionChange(selection) {
            console.log(selection);
            this.multipleSelection = selection;
        },
        // 批量删除
        batchRemove() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning("请选择要删除的记录！");
                return;
            }
            this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    // 点击确定，远程调用ajax
                    // 遍历selection，将id取出放入id列表
                    var idList = [];
                    this.multipleSelection.forEach((item) => {
                        idList.push(item.id);
                    });
                    // 调用api
                    return api.batchRemove(idList);
                })
                .then((response) => {
                    this.fetchData();
                    this.$message.success(response.message);
                }).catch(() => {
                    this.$message.info('取消删除')
                });
        },
        close() {
            this.visible = false;
            this.sysTeacher = {};
        }
    },
};
</script>