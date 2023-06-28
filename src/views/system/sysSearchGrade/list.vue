<template>
    <div class="app-container">

        <!-- 表格 -->
        <el-card header="流程管理">
            <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%; margin-top: 10px">
                <el-table-column prop="studentName" label="学生姓名" />
                <el-table-column prop="projectName" label="课题名称" />
                <el-table-column prop="subjectName" label="专业名称" />
                <el-table-column prop="paperTitle" label="提交文件" :formatter="formatFile" />
                <el-table-column prop="projectScore" label="成绩" :formatter="formatScore" />
            </el-table>
        </el-card>
    </div>
</template>
<script>
import api from "@/api/system/sysStudent";
import { mapGetters } from "vuex";

export default {
    // 定义数据模型
    data() {
        return {
            listLoading: false,
            list: [], // 列表


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
            this.listLoading = true
            this.current = current;
            // 调用api
            console.log(this.searchObj);

            api.getByUserId(this.userId)
                .then((response) => {
                    this.list = [response.data];

                    this.listLoading = false
                });

        },

        formatScore(row) {
            const scoreMap = {
                0: '未评分',
                1: '不及格',
                2: '及格',
                3: '中等',
                4: '良好',
                5: '优秀'
            };
            return scoreMap[row.projectScore] || '';
        },
        formatFile(row) {
            return row.paperTitle == null ? "未提交文件": row.paperTitle
        }

    },
};
</script>
