<template>
  <div class="dashboard-container">
    <div style="margin-top: 20px">
      
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="月排班" name="first">
        <info-list-month ref="infoListMonth"></info-list-month>
      </el-tab-pane>
      <el-tab-pane label="周排班" name="second">
        <info-list-week ref="infoListWeek"></info-list-week>
      </el-tab-pane>
      <el-tab-pane label="日排班" name="third">
        <info-list-surgery></info-list-surgery>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InfoListMonth from '@/components/InfoListMonth'
import InfoListWeek from '@/components/InfoListWeek'
import InfoListSurgery from '@/components/InfoListSurgery'
import InfoSelectMonth from '@/components/InfoSelectMonth'
import InfoSelectWeek from '@/components/InfoSelectWeek'

export default {
  components: {
    InfoListMonth,
    InfoListWeek,
    InfoListSurgery,
    InfoSelectMonth,
    InfoSelectWeek
  },
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      activeName: 'first',
      infoSelectVisible: false
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
