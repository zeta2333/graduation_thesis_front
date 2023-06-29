<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <h3> 欢迎您，{{ name }}</h3>
      您的身份为：{{ role }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  // role:"",
  computed: {
    ...mapGetters(["name","role","userId"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
