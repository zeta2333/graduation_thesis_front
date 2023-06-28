<template>
    <div>
        <div>
            <el-card header="选题列表">
                <el-button class="new-btn" type="success" icon="el-icon-plus" @click="add()">
                    新增选题
                </el-button>
                <el-row :gutter="24">
                    <el-col :lg="8" :md="12" :sm="24" :xs="24" v-for="(item, index) in list" :key="item.id">
                        <template>
                            <el-card class="box-card" style="width: 420px; height: 300px; position: relative;">
                                <div>
                                    <div slot="header" class="clearfix">{{ item.projectName }}</div>
                                    <el-divider></el-divider>
                                    <div class="text">{{ item.description }}</div>
                                </div>
                                <div class="card-actions" style="position: absolute; bottom: 0px; left: 30px; right: 30px;">
                                    <el-button style="float: left;" type="text" @click="edit(item.id)">编辑</el-button>
                                    <el-button style="float: right;" type="text"
                                        @click="removeDataById(item.id)">删除</el-button>
                                </div>
                            </el-card>
                        </template>

                    </el-col>
                </el-row>
            </el-card>

        </div>
        <div>
            <el-dialog :visible.sync="visible" title="选题信息填写" @close="close()">
                <el-form :rules="rules" ref="formRef" :model="form" label-width="80px">
                    <el-form-item label="选题名">
                        <el-input v-model="form.projectName" placeholder="请输入选题名称" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="选题详细信息">
                        <el-input type="textarea" v-model="form.description" placeholder="请输入选题详细信息" autocomplete="off" />
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="close()">取消</el-button>
                    <el-button type="primary" @click="save()">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import api from "@/api/system/sysProject";
import { mapGetters } from "vuex";
export default {
    name: "sysRepository",
    data() {
        return {
            list: [], // 列表
            total: 0, // 总记录数
            current: 1, // 页码
            size: 10, // 每页记录数
            // 弹窗显示开关
            visible: false,
            // 弹窗左上角的标题
            title: "",
            // 是否为编辑按钮
            isEdit: false,
            // 表单对象,用来获取整个表单组件
            formRef: null,
            // 表单内的值所绑定的对象，数据都在这里边
            form: { "userId": this.userId },
            // 表单校验规则
            rules: {
                // userAccount规则名，数组里的每个对象是有几条校验规则，每个都回跑一遍，
                projectName: [
                    // required是否为必填项，非必填时可以不写
                    // message是不满足条件时的提示信息
                    // trigger是触发方式:blur失焦
                    { required: true, message: "请输入选题名", trigger: "blur" },
                    { min: 5, message: "长度不少于 6 个字符", trigger: "blur" }
                    //validator自定义校验规则函数，一般提示需要必填就足够用了，不开这个
                    // { validator: this.validatePassword }
                ],
                projectDescribe: [
                    { required: true, message: "请输入选题详细描述", trigger: "blur" },
                    { max: 50, message: "长度不多于 50 个字符", trigger: "blur" }
                ],
                projectFromId: [
                    { required: true, message: "请选择选题来源", trigger: "blur" },

                ]
            },
            action: "",
            project: {}
        }
    },
    computed: {
        ...mapGetters(["userId"]),
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData(current = 1) {
            this.listLoading = true
            this.current = current;
            // 调用api
            api
                .getByUserId(this.userId)
                .then((response) => {
                    this.list = response.data;
                    this.total = response.data.total;
                    // 数据加载并绑定成功
                    this.listLoading = false
                });

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
        edit(id) {
            this.fetchDataById(id);
            this.dialogTitle = "修改"
            this.visible = true;
            this.action = "edit";
        },
        // 根据id获取
        fetchDataById(id) {
            api.getById(id).then((response) => {
                this.form = response.data;
                this.project = response.data;
            });
        },
        // 更新数据
        updateData() {
            api.updateById(this.form).then((response) => {
                this.$message.success(response.message || "操作成功");
                this.dialogVisible = false;
                this.fetchData(this.current);
            });
        },
        close() {
            this.form = { "userId": this.userId };
            this.visible = false;
        },
        save() {
            if (this.action == "add") {
                let datas = { "userId": this.userId, "projectName": this.form.projectName, "description": this.form.description }
                api.save(datas).then((response) => {
                    this.$message.success(response.message || "操作成功");
                    this.visible = false;
                    this.fetchData(this.current);
                });
            }
            if (this.action == "edit") {
                let datas = { "id": this.project.id, "projectName": this.form.projectName, "description": this.form.description }
                api.updateById(datas).then((response) => {
                    this.$message.success(response.message || "操作成功");
                    this.visible = false;
                    this.fetchData(this.current);
                });
            }
        },
        add() {
            this.visible = true;
            this.action = "add"
        }

    },
};
</script>