<template>
  <div class="dashboard-container">
    <div style="margin-top: 20px">
      
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="月排班" name="first">
        <el-button type="success" icon="el-icon-circle-plus" @click="appendClick('month')">添加一个新的月排班（夜班）</el-button>
        <info-list-month :tableData="tableDataMonth" @deleteRow="deleteRow"></info-list-month>
      </el-tab-pane>
      <el-tab-pane label="周排班" name="second">
        <el-button type="success" icon="el-icon-circle-plus" @click="appendClick('week')">添加一个新的周排班（白班）</el-button>
        <info-list-week :tableData="tableDataWeek"></info-list-week>
      </el-tab-pane>
      <el-tab-pane label="日排班" name="third">
        <info-list-surgery :tableData="tableDataSurgery"></info-list-surgery>
      </el-tab-pane>
    </el-tabs>
    <info-select-month :isVisible="infoSelectVisible == 'month'" @confirmButtonClicked="dialogConfirm" @cancelButtonClicked="dialogCancel"></info-select-month>
    <info-select-week :isVisible="infoSelectVisible == 'week'" @confirmButtonClicked="dialogConfirm" @cancelButtonClicked="dialogCancel"></info-select-week>
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
      activeName: 'second',
      infoSelectVisible: false,
      tableDataMonth: [{
        date: '2017-12-21',
        night: [
          {
            name: '夜班护士1  鼠标移到上面可以看到护士资历',
            exp: 'high',
            status: 'normal'
          }
        ],
        nightStandby: [
          {
            name: '候补护士1',
            exp: 'mid',
            status: 'pregnant'
          }
        ]
      },
      {
        date: '2017-12-22',
        night: [
          {
            name: '夜班护士1',
            exp: 'high',
            status: 'normal'
          }
        ],
        nightStandby: [
          {
            name: '候补护士1',
            exp: 'mid',
            status: 'pregnant'
          }
        ]
      }
      ],
      tableDataWeek: [{
        name: '白班护士1',
        arrangements: [
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() }

        ]
      },
      {
        name: '白班护士2',
        arrangements: [
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() }

        ]
      },
      {
        name: '白班护士3',
        arrangements: [
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() },
          { start: new Date().getHours(), end: new Date().getHours() }

        ]
      }],
      tableDataDay: [{
        date: '2017-12-21',
        name: '手术护士1',
        exp: 'high',
        status: 'normal'
      }]
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
    dialogConfirm() {
      this.infoSelectVisible = false
    },
    dialogCancel() {
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
