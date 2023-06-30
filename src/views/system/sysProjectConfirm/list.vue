<template>
    <div class="app-container">
        <!--查询表单-->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="关 键 词">
                            <el-input style="width: 100%" v-model="searchObj.keyword" placeholder="教师姓名/课题名称/课题描述"></el-input>
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
        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%; margin-top: 10px">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (current - 1) * size + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="projectName" label="课题名" />
            <el-table-column prop="description" label="课题描述" />
            <el-table-column prop="teacherName" label="所属教师" />
            <el-table-column prop="status" label="课题状态">
                <template slot-scope="scope">

                    {{ scope.row.status === 0 ? '待审核' : scope.row.status === 1 ? '审核通过待选择' : '已经有人选择' }}

                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 0" :type="'primary'" size="mini" :disabled="scope.row.status != 0"
                        @click="updateStatus(scope.row.id)">
                        {{ '待审核' }}
                    </el-button>
                    <el-button v-if="scope.row.status !== 0" icon="el-icon-check" :type="'success'" size="mini"
                        :disabled="true">
                        {{ "已过审" }}
                    </el-button>


                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination :current-page="current" :total="total" :page-size="size" style="padding: 30px 0; text-align: center"
            layout="total, prev, pager, next, jumper" @current-change="fetchData" />
        <!-- 弹出层 -->
    </div>
</template>
<script>
import api from "@/api/system/sysProject";
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
            sysProject: {}
        };
    },
    // 页面渲染成功后获取数据
    created() {
        this.fetchData();
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

        // 根据id获取
        fetchDataById(id) {
            api.getById(id).then((response) => {
                this.sysProject = response.data;
            });
        },
        updateStatus(id) {

            console.log(this.sysProject);
            api.getById(id).then((response) => {
                this.sysProject = response.data;
                this.sysProject.status = 1; // 1代表审核通过
                api.updateById(this.sysProject).then((response) => {
                    if (response.code == 200) {
                        this.$message.success("审核通过！")
                        this.fetchData();
                    }
                });

            });
        }
    },
};
</script>