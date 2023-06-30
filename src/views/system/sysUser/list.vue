<template>
    <div class="app-container">

        <!-- 搜索栏 -->
        <div class="search-div">
            <el-form label-width="70px" size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="关 键 词">
                            <el-input style="width: 95%" v-model="searchObj.keyword"
                                placeholder="用户名/姓名/手机号码/性别"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作时间">
                            <el-date-picker v-model="createTimes" type="datetimerange" range-separator="至"
                                start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"
                                style="margin-right: 10px;width: 100%;" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="display:flex">
                    <el-button type="primary" icon="el-icon-search" size="mini" :loading="listLoading"
                        @click="fetchData()">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
                </el-row>
            </el-form>
        </div>
        <br>
        <!-- 工具条 -->
        <div class="tools-div">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
        </div>

        <!-- 列表 -->
        <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%;margin-top: 10px;">

            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="realName" label="姓名" />
            <el-table-column prop="tel" label="手机号码" width="110" />
            <el-table-column prop="gender" label="性别" width="70"/>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    {{ getRoleNameByRoleId(scope.row.roleId) }}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="postName" label="岗位" width="100" />
            <el-table-column prop="deptName" label="部门" width="100" />
            <el-table-column label="所属角色" width="130">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.roleList" :key="item.id" style="margin-right: 10px;">{{ item.roleName
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status === 1" @change="switchStatus(scope.row)">
                    </el-switch>
                </template>
            </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column prop="updateTime" label="更新时间" width="160" />

            <el-table-column label="操作" width="140" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" />
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                        title="删除" />
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="page" :total="total" :page-size="limit" :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            style="padding: 30px 0; text-align: center;" layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @current-change="fetchData" @size-change="changeSize" />

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <el-form ref="dataForm" :model="sysUser" label-width="100px" size="small" style="padding-right: 40px;">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="sysUser.username" />
                </el-form-item>
                <el-form-item v-if="!sysUser.id" label="密码" prop="password">
                    <el-input v-model="sysUser.password" type="password" />
                </el-form-item>
                <el-form-item label="姓名" prop="realName">
                    <el-input v-model="sysUser.realName" />
                </el-form-item>
                <el-form-item label="手机号码" prop="tel">
                    <el-input v-model="sysUser.tel" />
                </el-form-item>
                <el-form-item v-if="!sysUser.id" label="性别" prop="gender">
                    <el-input v-model="sysUser.gender" />
                </el-form-item>
                <el-form-item label="角色" prop="roleId">                   
                    <el-select v-model="sysUser.roleId" placeholder="请选择角色">
                        <el-option v-for="role in allRoleList" :key="role.id" :label="role.description" :value="role.id">
                        </el-option>
                    </el-select>
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
import api from '@/api/system/sysUser'
import roleApi from '@/api/system/sysRole'
const defaultForm = {
    id: '',
    username: '',
    password: '',
    realName: '',
    tel: '',
    roleId: ''
}
export default {
    data() {
        return {
            listLoading: true, // 数据是否正在加载
            list: null, // banner列表
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 10, // 每页记录数
            searchObj: {}, // 查询表单对象
            allRoleList: [],

            createTimes: [],

            dialogVisible: false,
            dialogTitle: "",
            sysUser: defaultForm,
            saveBtnDisabled: false,
        }
    },

    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
        console.log('list created......')
        this.fetchData();
        this.getAllRoles();
    },

    // 生命周期函数：内存准备完毕，页面渲染成功
    mounted() {
        console.log('list mounted......')
    },

    methods: {
        // 当页码发生改变的时候
        changeSize(size) {
            console.log(size)
            this.limit = size
            this.fetchData(1)
        },

        // 加载banner列表数据
        fetchData(page = 1) {
            // debugger
            this.page = page
            console.log('翻页。。。' + this.page)

            if (this.createTimes && this.createTimes.length == 2) {
                this.searchObj.createTimeBegin = this.createTimes[0]
                this.searchObj.createTimeEnd = this.createTimes[1]
            }

            api.getPageList(this.page, this.limit, this.searchObj).then(
                response => {
                    //this.list = response.data.list
                    this.list = response.data.records
                    this.total = response.data.total

                    // 数据加载并绑定成功
                    this.listLoading = false
                }
            )
        },

        // 重置查询表单
        resetData() {
            this.listLoading = true
            console.log('重置查询表单')
            this.searchObj = {}
            this.createTimes = []
            this.fetchData()
        },

        // 根据id删除数据
        removeDataById(id) {
            // debugger
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // promise
                // 点击确定，远程调用ajax
                return api.removeById(id)
            }).then((response) => {
                this.fetchData(this.page)
                this.$message.success(response.message || '删除成功')
            }).catch(() => {
                this.$message.info('取消删除')
            })
        },

        // -------------
        add() {
            this.dialogTitle = "添加"
            this.dialogVisible = true
            this.sysUser = Object.assign({}, defaultForm)
        },

        edit(id) {
            this.dialogTitle = "修改"
            this.dialogVisible = true
            this.fetchDataById(id)
        },

        fetchDataById(id) {
            api.getById(id).then(response => {
                this.sysUser = response.data
            })
        },

        saveOrUpdate() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.saveBtnDisabled = true // 防止表单重复提交
                    if (!this.sysUser.id) {
                        this.saveData()
                    } else {
                        this.updateData()
                    }
                }
            })
        },

        // 新增
        saveData() {
            api.save(this.sysUser).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.fetchData(this.page)
            })
        },

        // 根据id更新记录
        updateData() {
            api.updateById(this.sysUser).then(response => {
                this.$message.success(response.message || '操作成功')
                this.dialogVisible = false
                this.fetchData(this.page)
            })
        },
        // 获取所有角色
        getAllRoles() {
            roleApi.findAll().then((response) => {
                this.allRoleList = response.data
                console.log(this.allRoleList);
            })
        },
        // 根据roleId获取roleName
        getRoleNameByRoleId(roleId) {
            var roleDesc;
            this.allRoleList.forEach(curRole => {
                if (curRole.id == roleId) {
                    roleDesc = curRole.description
                }
            });
            return roleDesc
        }
    }
}
</script>