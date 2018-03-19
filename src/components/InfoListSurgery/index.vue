<template>
  <div>
    <el-date-picker
      v-model="currentDateObject"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    <el-button type="primary" icon="el-icon-upload" @click="fileImportVisible = true">导入</el-button>
    <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading.body="listLoading" 
      element-loading-text="Loading">
      <el-table-column
        label="手术日期">
        <template slot-scope="scope">
          <el-date-picker
            v-if="scope.row.edit"
            v-model="scope.row.surgeryDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span v-else>{{ scope.row.surgeryDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手术时间">
        <template slot-scope="scope">
          <el-time-picker
            v-if="scope.row.edit"
            v-model="scope.row.surgeryTime"
            placeholder="任意时间点">
          </el-time-picker>
          <span v-else>{{ scope.row.surgeryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手术间"
        >
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="scope.row.surgeryRoom" placeholder="手术间"></el-input>
          <span v-else>{{ scope.row.surgeryRoom }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="台次"
        >
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="scope.row.surgeryOrder" placeholder="台次"></el-input>
          <span v-else>{{ scope.row.surgeryOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手术名称"
        >
        <template slot-scope="scope">
          <span>{{ scope.row.surgeryName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="器械护士">
        <template slot-scope="scope">
          <span v-for="item in scope.row.instNurse" :key="item.id">{{ "("+item.name+")" }}</span>
          <el-button
            v-if="scope.row.edit"
            size="mini"
            type="warning"
            @click="handleStaffUpdate(scope.row.instNurse)"
            >...</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="巡回护士">
        <template slot-scope="scope">
          <span v-for="item in scope.row.rovNurse" :key="item.id">{{ "("+item.name+")" }}</span>
          <el-button
            v-if="scope.row.edit"
            size="mini"
            type="warning"
            @click="handleStaffUpdate(scope.row.rovNurse)"
            >...</el-button>
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

import StaffSelect from '@/components/StaffSelect'
import { getSurgeryList, updateSurgeryList, deleteSurgery } from '@/api/list'
import Vue from 'vue'
import FileImport from '@/components/FileImport'
import { export2Json } from '@/utils/export2File'

export default {
  name: 'info-list-surgery',
  components: {
    StaffSelect,
    FileImport
  },
  props: {
  },
  created() {
    this.currentDateObject = new Date()
  },
  methods: {
    getInfoListSurgery(params) {
      this.listLoading = true
      getSurgeryList(params).then(response => {
        this.tableData = response.data.items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listLoading = false
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      // this.$emit('editRow', index, this.tableData)
      if (row.edit === false) {
        row.edit = !row.edit
        this.oldVal[index] = JSON.parse(JSON.stringify(row))
        return
      }
      this.editAvilable = false
      updateSurgeryList({}, row).then(response => {
        this.$notify({
          title: '更新成功',
          message: response.data.msg,
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.oldVal[index].edit = false
        Vue.set(this.tableData, index, this.oldVal[index])
      }).finally(() => {
        this.editAvilable = true
        row.edit = !row.edit
      })
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
        deleteSurgery({}, { surgeryId: row.surgeryId }).then(response => {
          this.tableData.splice(index, 1)
        }).catch(() => {}).finally(() => { this.editAvilable = true })
      }).catch(() => {
      })
    },
    handleStaffUpdate(list) {
      this.selectDialogVisible = true
      this.editingList = list
    },
    handleExport() {
      const exportData = {
        date: this.currentDateObject.getTime(),
        tableData: this.tableData
      }

      const exportFileName = 'day' + '_' +
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
    updateData() {
      this.editingList.splice(0)
      Array.prototype.push.apply(this.editingList, this.$refs.staffSelect.formData.selectedStaffIndex)
      this.selectDialogVisible = false
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
      listLoading: false,
      editAvilable: true,
      selectDialogVisible: false,
      tableData: [],
      oldVal: [],
      editingList: [],
      currentDateObject: {},
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
      this.getInfoListSurgery(params)
    }
  }

}
</script>