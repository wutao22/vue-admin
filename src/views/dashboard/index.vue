<template>
  <div class="dashboard-container">
    <el-card>
      <dataView></dataView>
    </el-card>
  </div>
</template>
<script>
import dataView from './components/dataView.vue'
import Table from '@/components/Table'
export default {
  name: "Dashboard",
  components: {
    dataView, Table
  },
  data() {
    return {
    };
  }
};
</script>
