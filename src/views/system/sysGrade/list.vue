<template>
    <div class="app-container">
        <el-card header="成绩评定">
            <!-- 表格 -->
            <el-table :data="list" stripe border style="width: 100%; margin-top: 10px">
                <el-table-column prop="userId" label="学生ID" />
                <el-table-column prop="studentName" label="姓名" />
                <el-table-column prop="projectScore" label="成绩" />
                <el-table-column label="课题状态" prop="projectStatus">
                    <template slot-scope="{ row }">
                        <el-badge
                            :value="row.projectStatus === 0 ? '未提交' : row.projectStatus === 1 ? '开题报告' : row.projectStatus === 2 ? '期中小结' : '论文初稿'"
                            :type="row.projectStatus === 0 ? 'warning' : 'success'"></el-badge>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-download" :disabled="scope.row.projectScore != 0"
                            @click="showDialog(scope.row)">评定成绩</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分页组件 -->
        <el-pagination :current-page="current" :total="total" :page-size="size" style="padding: 30px 0; text-align: center"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />

        <el-dialog :visible.sync="dialogVisible" title="评定成绩" @closed="resetForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="论文成绩" prop="score">
                    <el-select v-model="form.score">
                        <el-option label="优" value="5"></el-option>
                        <el-option label="良" value="4"></el-option>
                        <el-option label="中" value="3"></el-option>
                        <el-option label="及格" value="2"></el-option>
                        <el-option label="不及格" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from "@/api/system/sysStudent";
import { mapGetters } from "vuex";
export default {
    // 定义数据模型
    data() {
        return {
            list: [], // 列表
            total: 0, // 总记录数
            current: 1, // 页码
            size: 10, // 每页记录数
            //上传后的文件列表
            fileList: [],
            student: {},
            // 允许的文件类型
            fileType: ["pdf", "doc", "docx"],
            // 运行上传文件大小，单位 M
            fileSize: 50,
            dialogVisible: false,
            //请求头
            headers: { "Content-Type": "multipart/form-data" },
            isUploadDisable: false, // 在data中添加isUploadDisable控制上传按钮是否禁用的状态变量
            rules: {
                score: [
                    { required: true, message: '请选择论文成绩', trigger: 'change' }
                ]
            },
            form : {}

        };
    },
    // 页面渲染成功后获取数据
    created() {
        this.fetchData();
    },

    computed: {
        ...mapGetters(["userId"])
    }
    ,
    // 定义方法
    methods: {
        fetchData(current = 1) {
            this.current = current;
            // 调用api
            console.log(this.searchObj);
            api
                .listByTeacherUserId(this.userId)
                .then((response) => {
                    this.list = response.data;
                    // 数据加载并绑定成功
                });

        },
        uploadSuccess(id) {
            this.$message('文件上传成功!!!!!!');
        },
        //上传文件之前
        beforeUpload(file) {
            if (file.type != "" || file.type != null || file.type != undefined) {
                //截取文件的后缀，判断文件类型
                const FileExt = file.name.replace(/.+\./, "").toLowerCase();
                //计算文件的大小
                const isLt5M = file.size / 1024 / 1024 < 50; //这里做文件大小限制
                //如果大于50M
                if (!isLt5M) {
                    this.$showMessage('上传文件大小不能超过 50MB!');
                    return false;
                }
                //如果文件类型不在允许上传的范围内
                if (this.fileType.includes(FileExt)) {
                    return true;
                }
                else {
                    this.$message.error("上传文件格式不正确!");
                    return false;
                }
            }
        },
        uploadFile(item) {
            if (this.isUploadDisable) {
                this.$message.error('不能再上传了！');
                return false;
            }
            this.isUploadDisable = true;
            this.$message('文件上传中........');
            //上传文件的需要formdata类型;所以要转
            let FormDatas = new FormData()
            FormDatas.append('file', item.file);

        },
        resetForm() {
            this.form = {};
        },
        handleSubmit() {
            api.updateAssessGrade(this.student.id,this.form.score).then(
                (response) => {
                    if(response.code == 200) {
                        this.form = {}
                        this.student = {}
                        this.$message.success("评分成功");
                    }
                }
            )
            this.dialogVisible = false;
            this.fetchData();
        },
        showDialog(row) {
            this.dialogVisible = true;
            api.getById(row.id).then(
                (response) => {
                    this.student = response.data;
                }
            )
        },

    },
};
</script>