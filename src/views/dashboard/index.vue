<template>
  <div class="dashboard-container">
    <div style="margin-top: 20px">
      <el-button size="mini" @click='appendClick'>添加</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="月排班" name="first"><info-list :tableData="tableDataMonth" @deleteRow="deleteRow"></info-list></el-tab-pane>
      <el-tab-pane label="周排班" name="second"><info-list :tableData="tableDataWeek" @deleteRow="deleteRow"></info-list></el-tab-pane>
      <el-tab-pane label="日排班" name="third"><info-list :tableData="tableDataDay" @deleteRow="deleteRow"></info-list></el-tab-pane>
    </el-tabs>
    <info-select :isVisible="infoSelectVisible" @confirmButtonClicked="dialogConfirm" @cancelButtonClicked="dialogCancel"></info-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InfoList from '@/components/InfoList'
import InfoSelect from '@/components/InfoSelect'

export default {
  components: {
    InfoList,
    InfoSelect
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
      infoSelectVisible: false,
      tableDataMonth: [{
        date: '2017-12-21',
        name: '夜班护士1',
        exp: 'high',
        status: 'normal'
      },
      {
        date: '2017-12-22',
        name: '夜班护士2',
        exp: 'mid',
        status: 'pregnant'
      },
      {
        date: '2017-12-23',
        name: '护士3',
        exp: 'low',
        status: 'agent'
      }],
      tableDataWeek: [{
        date: '2017-12-21',
        name: '周护士1',
        exp: 'high',
        status: 'normal'
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
    appendClick() {
      // this.tableData.push({
      //   date: '2016-05-03',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // })
      this.infoSelectVisible = true
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
