<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading.body="listLoading" 
      element-loading-text="Loading">
      <el-table-column
        label="手术日期"
        >
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
        label="手术时间"
        >
        <template slot-scope="scope">
          <el-time-picker
            v-if="scope.row.edit"
            v-model="scope.row.surgeryTime"
            :picker-options="{
            }"
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
  </div>
</template>

<script>

import StaffSelect from '@/components/StaffSelect'
import { getSurgeryList, updateSurgeryList, deleteSurgery } from '@/api/list'

export default {
  name: 'info-list-surgery',
  components: {
    StaffSelect
  },
  props: {
  },
  created() {
    this.getInfoListSurgery()
  },
  methods: {
    getInfoListSurgery() {
      this.listLoading = true
      getSurgeryList().then(response => {
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
        return
      }

      this.editAvilable = false
      updateSurgeryList({}, row).then(response => {
        if (/* response.data.code === 40000*/true) {
          this.$notify.error({
            title: '更新失败',
            message: response.data.msg
          })
          this.editAvilable = true
          return
        } else {
          this.$notify({
            title: '更新成功',
            message: response.data.msg,
            type: 'success',
            duration: 2000
          })
          this.editAvilable = true
          return
        }
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
        deleteSurgery({}, row).then(response => {
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
      editingList: []
    }
  }

}
</script>