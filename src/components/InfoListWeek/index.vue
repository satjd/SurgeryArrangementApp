<template>
  <div>
    <el-date-picker
      v-model="currentDateObject"
      type="week"
      placeholder="选择周"
      :picker-options="{firstDayOfWeek:1}">
    </el-date-picker>
    <el-button type="success" icon="el-icon-circle-plus" @click="handleCreate">添加一个新的周排班（白班）</el-button>
    <el-button type="primary" icon="el-icon-upload" @click="fileImportVisible = true">导入</el-button>
    <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading.body="listLoading" 
      element-loading-text="Loading">
      <el-table-column
        label="人员">
        <template slot-scope="scope">
          <div>
            <span style="margin-left: 10px">{{ scope.row.staffThisWeekday ? scope.row.staffThisWeekday.name : '' }}</span>
            <el-button
            v-if="scope.row.edit"
            size="mini"
            type="warning"
            @click="handleStaffUpdate(scope.$index)"
            >...</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="index in [1,2,3,4,5,6,7]" 
        :key="index.id"
        :label="'W'+index">
        <template slot-scope="scope">
          <div v-if="scope.row.edit">
            <el-checkbox v-model="scope.row.todayDescriptors[index-1].idle">空闲</el-checkbox>
            <div v-if="!scope.row.todayDescriptors[index-1].idle">
              <el-input-number size="mini" v-model="scope.row.todayDescriptors[index-1].start" :min="0" :max="23"></el-input-number>
              <el-input-number size="mini" v-model="scope.row.todayDescriptors[index-1].end"   :min="0" :max="23"></el-input-number>
            </div>
          </div>
          <div v-else>
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-if="scope.row.todayDescriptors[index-1].idle === false">
              {{ scope.row.todayDescriptors[index-1].start + '至' + scope.row.todayDescriptors[index-1].end 
              + ((scope.row.todayDescriptors[index-1].start >= scope.row.todayDescriptors[index-1].end)?"\'":"")}}
            </span>
          </div>    
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!editAvilable"
            @click="handleEdit(scope.$index, scope.row)">{{scope.row.edit === false?'编辑':'确认'}}</el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="!editAvilable"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <staff-select ref="staffSelect" :isVisible="selectDialogVisible" @submit="updateData" @dialogClose="selectDialogVisible = false"></staff-select>
    <file-import ref="fileImport" :isVisible="fileImportVisible" fileType="json" @submit="handleImport" @dialogClose="fileImportVisible = false"></file-import>
  </div>
</template>

<script>
import Vue from 'vue'
import InfoSelectWeek from '@/components/InfoSelectWeek'
import StaffSelect from '@/components/StaffSelect'
import { getWeekList, updateWeekList, deleteWeekArrangement } from '@/api/list'
import FileImport from '@/components/FileImport'
import { export2Json } from '@/utils/export2File'

export default {
  name: 'info-list-week',
  components: {
    InfoSelectWeek,
    StaffSelect,
    FileImport
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.currentDateObject = new Date()
  },
  methods: {
    getInfoListWeek(params) {
      this.listLoading = true
      getWeekList(params).then(response => {
        this.tableData = response.map(v => {
          this.$set(v, 'edit', false)
          for (let i = 1; i <= 7; i++) {
            if (!v.todayDescriptors[i - 1]) {
              v.todayDescriptors[i - 1] = {
                key: {
                  weekArrangementId: response.newId,
                  weekDay: i
                },
                idle: true,
                start: 0,
                end: 0
              }
            }
          }
          return v
        })
      }).catch(() => {
        this.tableData = []
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleCreate() {
      this.editAvilable = false
      updateWeekList({ create: true }).then(response => {
        if (!response.newId) return
        const newObj = {}

        newObj.edit = true
        newObj.weekArrangementId = response.newId
        newObj.todayDescriptors = []
        for (let i = 1; i <= 7; i++) {
          if (!newObj.todayDescriptors[i - 1]) {
            newObj.todayDescriptors[i - 1] = {
              key: {
                weekArrangementId: response.newId,
                weekDay: i
              },
              idle: true,
              start: 0,
              end: 0
            }
          }
        }
        console.log(newObj)
        this.tableData.push(newObj)
      }).catch(() => {

      }).finally(() => {
        this.editAvilable = true
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      // this.$emit('editRow', index, this.tableData)
      // this.infoSelectVisible = true
      if (row.edit === false) {
        row.edit = !row.edit
        this.oldVal[index] = JSON.parse(JSON.stringify(row))
        return
      }
      this.editAvilable = false
      updateWeekList({ create: false }, row).then(response => {
        this.$notify({
          title: '更新成功',
          message: response || '',
          type: 'success',
          duration: 2000
        })
        this.editAvilable = true
        return
      }).catch(() => {
        if (!this.oldVal[index]) return
        this.oldVal[index].edit = false
        Vue.set(this.tableData, index, this.oldVal[index])
      }).finally(() => {
        this.editAvilable = true
      })
      row.edit = !row.edit
    },
    handleDelete(index, row) {
      console.log(index, this.tableData)
      this.$emit('deleteRow', { i: index, tableRef: this.tableData })

      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editAvilable = false
        deleteWeekArrangement({ id: row.weekArrangementId }, {}).then(response => {
          this.tableData.splice(index, 1)
        }).catch(() => {}).finally(() => { this.editAvilable = true })
      })
    },
    handleStaffUpdate(editingArrangementIndex) {
      this.selectDialogVisible = true
      this.editingArrangementIndex = editingArrangementIndex
    },
    updateData() {
      this.tableData[this.editingArrangementIndex].staffThisWeekday = Object.assign({}, this.$refs.staffSelect.formData.selectedStaffIndex[0] || this.tableData[this.editingArrangementIndex])
      this.selectDialogVisible = false
    },
    handleExport() {
      const exportData = {
        date: this.currentDateObject.getTime(),
        tableData: this.tableData
      }

      const exportFileName = 'week' + '_' +
                              (this.currentDateObject.getFullYear()) + '_' +
                              (this.currentDateObject.getMonth() + 1) + '_' +
                              (this.currentDateObject.getDate()) + '.json'

      export2Json(exportData, exportFileName)
    },
    handleImport(fileList) {
      this.fileImportVisible = false
      var reader = new FileReader()
      var obj = {}
      reader.onload = () => {
        obj = JSON.parse(reader.result)
        this.currentDateObject = new Date(obj.date)
        this.noWatch = true // change current date object without trigger watch
        this.tableData = obj.tableData
      }
      reader.onloadend = () => {
        this.noWatch = false
      }
      reader.readAsText(fileList[0])
    },
    dialogConfirm() {
      this.infoSelectVisible = false
    },
    dialogCancel() {
      this.infoSelectVisible = false
    }
  },
  data() {
    return {
      infoSelectVisible: false,
      selectDialogVisible: false,
      listLoading: false,
      editAvilable: true,
      tableData: [],
      oldVal: [],
      currentDateObject: {},
      editingArrangementIndex: 0,
      fileImportVisible: false,
      noWatch: false
    }
  },
  watch: {
    currentDateObject: function(newVal, oldVal) {
      if (newVal === null || this.noWatch) return
      const params = {
        y: newVal.getFullYear(),
        m: newVal.getMonth(),
        d: newVal.getDate()
      }
      console.log(params)
      this.getInfoListWeek(params)
    }
  }

}
</script>