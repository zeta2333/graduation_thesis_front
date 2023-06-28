<template>
    <div class="app-container">
        <el-card header="流程管理">
            <!-- 表格 -->
            <el-table :data="list" stripe border style="width: 100%; margin-top: 10px">
                <el-table-column prop="studentName" label="姓名" />
                <el-table-column prop="projectName" label="课题名" />
                <el-table-column label="论文状态" prop="paperStatus">
                    <template slot-scope="{ row }">
                        <el-badge
                            :value="row.paperStatus === 0 ? '未提交' : row.paperStatus === 1 ? '开题报告' : row.paperStatus === 2 ? '期中小结' : '论文初稿'"
                            :type="row.paperStatus === 0 ? 'warning' : 'success'"></el-badge>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <form method="post" enctype="multipart/form-data">
                            <el-upload class="upload-demo" action :http-request="uploadFile" :on-success="uploadSuccess"
                                ref="upload" :file-list="fileList" :before-upload="beforeUpload" :show-file-list="false"
                                :headers="headers"><!-- 添加isUploadDisable变量 -->

                                <el-button class="btn"><i class="el-icon-paperclip"></i>{{ scope.row.paperStatus === 3 ?
                                    "重新上传" : "上传文件" }}</el-button>

                            </el-upload>
                        </form>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分页组件 -->
        <el-pagination :current-page="current" :total="total" :page-size="size" style="padding: 30px 0; text-align: center"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />
    </div>
</template>
<script>
import apiStudent from "@/api/system/sysStudent";
import { mapGetters } from "vuex";
export default {
    // 定义数据模型
    data() {
        return {
            list: [
            ], // 列表
            total: 0, // 总记录数
            current: 1, // 页码
            size: 10, // 每页记录数
            //上传后的文件列表
            fileList: [],
            // 允许的文件类型
            fileType: ["pdf", "doc", "docx", "txt"],
            // 运行上传文件大小，单位 M
            fileSize: 50,
            //请求头
            headers: {
                "Content-Type": "multipart/form-data"
            },
            isUploadDisable: false, // 在data中添加isUploadDisable控制上传按钮是否禁用的状态变量

        };
    },
    computed: {
        ...mapGetters(["userId"]),
        isDisabled() {
            return (row) => row.state === '3'; // 判断行的状态是否为2
        }
    },
    // 页面渲染成功后获取数据
    created() {
        this.fetchData();
    },
    // 定义方法
    methods: {
        fetchData(current = 1) {
            this.current = current;
            // 调用api

            console.log(this.searchObj);
            apiStudent

                .getByUserId(this.userId)
                .then((response) => {
                    this.list = [response.data];
                    console.log("list值为：")
                    console.log(this.list)

                    // this.total = response.data.total;
                    // 数据加载并绑定成功
                });

        },
        uploadSuccess() {
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
            this.isUploadDisable = true;
            //上传文件的需要formdata类型;所以要转
            const formData = new FormData();
            formData.append('file', item.file);
            formData.append('userId', this.userId);
            apiStudent.upload(formData, this.headers).then((response) => {

                if (response.code == "200");

                this.$message.success('文件上传成功!');
            });;
        },
    },
};


</script>