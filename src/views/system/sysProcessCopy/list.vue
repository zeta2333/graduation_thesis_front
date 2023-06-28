<template>
    <div class="app-container">
        <el-card header="流程管理">
            <!-- 表格 -->
            <el-table :data="list" stripe border style="width: 100%; margin-top: 10px">
                <el-table-column prop="studentName" label="学生姓名" />
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
                        <el-button type="primary" icon="el-icon-download" :disabled="scope.row.paperStatus == 0"
                            @click="downloadFile(scope.row)">下载文件</el-button>
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
import api from "@/api/system/sysStudent";
import { mapGetters } from "vuex";
export default {
    // 定义数据模型
    data() {
        return {
            list: [
                {
                    name: '张三',
                    courseName: '前端开发基础',
                    state: '已通过',
                    downloadUrl: '123'
                },
            ], // 列表
            total: 0, // 总记录数
            current: 1, // 页码
            size: 10, // 每页记录数
            //上传后的文件列表
            fileList: [],
            // 允许的文件类型
            fileType: ["pdf", "doc", "docx"],
            // 运行上传文件大小，单位 M
            fileSize: 50,
            //请求头
            headers: { "Content-Type": "multipart/form-data" },
            isUploadDisable: false, // 在data中添加isUploadDisable控制上传按钮是否禁用的状态变量

        };
    },
    // 页面渲染成功后获取数据
    created() {
        this.fetchData();
    },
    computed: {
        ...mapGetters(["userId"])
    },
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
                    // this.total = response.data.total;
                    // 数据加载并绑定成功
                });

        },
        downloadFile(row) {
            this.$message.success('文件下载成功!');
            let url = "http://localhost:6815/system/sysFile/download?filename=" + row.paperPath;
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href);
        },





    },
};
</script>