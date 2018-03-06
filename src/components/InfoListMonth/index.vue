<template>
  <div>
    <el-date-picker
      v-model="currentDateObject"
      type="month"
      placeholder="选择月">
    </el-date-picker>
    <el-button type="success" icon="el-icon-circle-plus">添加一个新的月排班（夜班）</el-button>
    <el-button type="primary" icon="el-icon-upload" @click="fileImportVisible = true">导入</el-button>
    <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading.body="listLoading" 
      element-loading-text="Loading">
      <el-table-column
        label="班次"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="值班人员">
        <template slot-scope="scope">
          <el-popover v-for="item in scope.row.night" :key="item.id" trigger="hover" placement="top">
            <p>姓名: {{ item.name }}</p>
            <p>资历: {{ item.exp }}</p>
            <span slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ item.name }}</el-tag>
            </span>
          </el-popover>
          <el-button
            v-if="scope.row.edit"
            size="mini"
            type="warning"
            @click="handleStaffUpdate(scope.row.night)"
            >...</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="候补人员">
        <template slot-scope="scope">
          <el-popover v-for="item in scope.row.nightStandby" :key="item.id" trigger="hover" placement="top">
            <p>姓名: {{ item.name }}</p>
            <p>资历:{{item.exp}}</p>
            <span slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ item.name }}</el-tag>
            </span>
          </el-popover>
          <el-button
            v-if="scope.row.edit"
            size="mini"
            type="warning"
            @click="handleStaffUpdate(scope.row.nightStandby)"
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
import Vue from 'vue'
import InfoSelectMonth from '@/components/InfoSelectMonth'
import StaffSelect from '@/components/StaffSelect'
import FileImport from '@/components/FileImport'
import { getMonthList, updateMonthList, deleteMonthArrangement } from '@/api/list'
import { export2Json } from '@/utils/export2File'

export default {
  name: 'info-list-month',
  components: {
    InfoSelectMonth,
    StaffSelect,
    FileImport
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  created: function() {
    this.currentDateObject = new Date()
  },
  methods: {
    getInfoListMonth(params) {
      this.listLoading = true
      getMonthList(params).then(response => {
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
      // this.editIndex = index
      // this.infoSelectVisible = true
      if (row.edit === false) {
        row.edit = !row.edit
        this.oldVal[index] = JSON.parse(JSON.stringify(row))
        return
      } else {
        this.editAvilable = false
        updateMonthList({}, row).then(response => {
          if (/* response.data.code === 40000*/true) {
            this.$notify.error({
              title: '更新失败',
              message: response.data.msg
            })
            this.oldVal[index].edit = false
            Vue.set(this.tableData, index, this.oldVal[index])
          } else {
            this.$notify({
              title: '更新成功',
              message: response.data.msg,
              type: 'success',
              duration: 2000
            })
          }
          this.editAvilable = true
          return
        })
        row.edit = !row.edit
      }
    },
    handleDelete(index, row) {
      console.log(index, this.tableData)
      // this.$emit('deleteRow', { i: index, tableRef: this.tableData })

      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editAvilable = false
        deleteMonthArrangement({}, row).then(response => {
          if (/* response.data.code === 40000*/true) {
            this.$notify.error({
              title: '删除失败',
              message: response.data.msg
            })
            this.editAvilable = true
            return
          } else {
            this.$notify({
              title: '删除成功!',
              type: 'success',
              duration: 2000
            })
            this.tableData.splice(index, 1)
            this.editAvilable = true
            return
          }
        })
      }).catch(() => {
      })
    },
    handleStaffUpdate(list) {
      this.selectDialogVisible = true
      this.editingList = list
    },
    updateData() {
      this.editingList.splice(0)
      Array.prototype.push.apply(this.editingList, this.$refs.staffSelect.formData.selectedStaffIndex)
      this.selectDialogVisible = false
    },
    handleExport() {
      const exportData = {
        date: this.currentDateObject,
        tableData: this.tableData
      }

      const exportFileName = 'month' + '_' +
                              (this.currentDateObject.getFullYear()) + '_' +
                              (this.currentDateObject.getMonth() + 1) + '.json'

      export2Json(exportData, exportFileName)
    },
    handleImport(fileList) {
      console.log(fileList[0])
      this.fileImportVisible = false
      var reader = new FileReader()
      var obj = {}
      reader.onload = () => {
        obj = JSON.parse(reader.result)
        this.currentDateObject = new Date(obj.date)
        this.noWatch = true
        this.tableData = obj.tableData
      }
      reader.onloadend = () => {
        this.noWatch = false
      }
      reader.readAsText(fileList[0])
    }
  },
  data() {
    return {
      infoSelectVisible: false,
      selectDialogVisible: false,
      fileImportVisible: false,
      editAvilable: true,
      editIndex: 0,
      listLoading: false,
      tableData: [],
      oldVal: [],
      currentDateObject: new Date(),
      editingList: [],
      noWatch: false
    }
  },
  watch: {
    currentDateObject: function(newVal, oldVal) {
      if (newVal === null || this.noWatch) return
      const params = {
        y: newVal.getFullYear(),
        m: newVal.getMonth()
      }
      this.getInfoListMonth(params)
    }
  }
}
</script>