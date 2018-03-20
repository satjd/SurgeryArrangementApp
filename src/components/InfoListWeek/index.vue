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
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="index in [1,2,3,4,5,6,7]" 
        :key="index.id"
        :label="'W'+index">
        <template slot-scope="scope">
          <div v-if="scope.row.edit">
            <el-checkbox v-model="scope.row.arrangements[index-1].idle">空闲</el-checkbox>
            <div v-if="!scope.row.arrangements[index-1].idle">
              <el-input-number size="mini" v-model="scope.row.arrangements[index-1].start" :min="0" :max="23"></el-input-number>
              <el-input-number size="mini" v-model="scope.row.arrangements[index-1].end"   :min="0" :max="23"></el-input-number>
            </div>
          </div>
          <div v-else>
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-if="scope.row.arrangements[index-1].idle === false">
              {{ scope.row.arrangements[index-1].start + '至' + scope.row.arrangements[index-1].end 
              + ((scope.row.arrangements[index-1].start >= scope.row.arrangements[index-1].end)?"\'":"")}}
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
    <staff-select :isVisible="selectDialogVisible" @dialogClose="selectDialogVisible = false"></staff-select>
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
        const newObj = Object.assign({}, this.tableData[0] || {})

        newObj.edit = true
        newObj.id = response.newId
        newObj.name = null
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
          message: response.data.msg,
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
        deleteWeekArrangement({ id: row.id }, {}).then(response => {
          this.tableData.splice(index, 1)
        }).catch(() => {}).finally(() => { this.editAvilable = true })
      })
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