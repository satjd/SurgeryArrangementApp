<template>
  <div class="dashboard-container">
    <div style="margin-top: 20px">
      
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="月排班" name="first">
        <el-button type="success" icon="el-icon-circle-plus" @click="appendClick('month')">添加一个新的月排班（夜班）</el-button>
        <info-list-month ref="infoListMonth" @deleteRow="deleteRow"></info-list-month>
      </el-tab-pane>
      <el-tab-pane label="周排班" name="second">
        <el-button type="success" icon="el-icon-circle-plus" @click="appendClick('week')">添加一个新的周排班（白班）</el-button>
        <info-list-week ref="infoListWeek"></info-list-week>
      </el-tab-pane>
      <el-tab-pane label="日排班" name="third">
        <info-list-surgery></info-list-surgery>
      </el-tab-pane>
    </el-tabs>
    <info-select-month ref="infoSelectMonth" :isVisible="infoSelectVisible == 'month'" @confirm="dialogMonthConfirm" @cancel="dialogMonthCancel"></info-select-month>
    <info-select-week ref="infoSelectWeek" :isVisible="infoSelectVisible == 'week'" @confirm="dialogWeekConfirm" @cancel="dialogWeekCancel"></info-select-week>
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
    },
    appendClick(option) {
      this.infoSelectVisible = option
    },
    deleteClick() {
      this.tableData.pop()
    },
    dialogMonthConfirm(formData) {
      this.$refs.infoListMonth.tableData.push(formData)
      this.infoSelectVisible = false
    },
    dialogMonthCancel() {
      this.infoSelectVisible = false
    },
    dialogWeekConfirm(formData) {
      this.$refs.infoListWeek.tableData.push(formData)
      this.infoSelectVisible = false
    },
    dialogWeekCancel() {
      this.infoSelectVisible = false
    },
    deleteRow(data) {
      data.tableRef.splice(data.i, 1)
    },
    editRow() {

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
