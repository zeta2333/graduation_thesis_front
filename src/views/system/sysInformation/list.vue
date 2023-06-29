<template>
  <div>
    <el-card header="用户信息" shadow="never">
      <el-row style="margin-bottom: 20px">
        <el-col :xs="8" :sm="6" :md="4" :lg="3">
          <p>姓名：</p>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21">
          <p>{{ list.realName }}</p>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-col :xs="8" :sm="6" :md="4" :lg="3">
          <p>角色：</p>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21">
          <p>{{ role }}</p>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-col :xs="8" :sm="6" :md="4" :lg="3">
          <p>电话：</p>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21">
          <p>{{ list.tel }}</p>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-col :xs="8" :sm="6" :md="4" :lg="3">
          <p>性别：</p>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21">
          <p>{{ list.gender }}</p>
        </el-col>
      </el-row>
      <!-- <el-row style="margin-bottom: 20px">
        <el-col :xs="8" :sm="6" :md="4" :lg="3">
          <p>信息：</p>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21">
          <p>{{ list.teacherData.teacherDescribe }}</p>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-col :xs="8" :sm="6" :md="4" :lg="3">
          <p>职称：</p>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="21">
          <p>{{ list.teacherData.zhicheng }}</p>
        </el-col>
      </el-row> -->
    </el-card>
  </div>
</template>

<script>
import api from "@/api/system/sysUser";
import { mapGetters } from "vuex";
export default {
  name: "THome",
  data() {
    return {
      list: []
    }
  }
  ,
  computed: {
        ...mapGetters(["userId","role"]),
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
        .getById(this.userId)
        .then((response) => {
          this.list = response.data;
        });

    },

  }

}
</script>

<style scoped></style>
