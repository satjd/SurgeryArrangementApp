<template>
  <div>
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
  </div>
</template>

<script>
import InfoSelectMonth from '@/components/InfoSelectMonth'
import StaffSelect from '@/components/StaffSelect'
import { getMonthList, updateMonthList, deleteMonthArrangement } from '@/api/list'

export default {
  name: 'info-list-month',
  components: {
    InfoSelectMonth,
    StaffSelect
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  created: function() {
    this.getInfoListMonth()
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
      // this.$emit('editRow', index, this.tableData)
      // this.editIndex = index
      // this.infoSelectVisible = true

      if (row.edit === false) {
        row.edit = !row.edit
        return
      } else {
        this.editAvilable = false
        updateMonthList({}, row).then(response => {
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
    dialogConfirm(formData) {
      this.tableData.splice(this.editIndex, 1, formData)
      this.infoSelectVisible = false
    },
    dialogCancel() {
      this.infoSelectVisible = false
    },
    getInfoListMonth() {
      this.listLoading = true
      getMonthList().then(response => {
        this.tableData = response.data.items.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listLoading = false
      })
    }
  },
  data() {
    return {
      infoSelectVisible: false,
      selectDialogVisible: false,
      editAvilable: true,
      editIndex: 0,
      listLoading: false,
      tableData: [],
      editingList: []
    }
  }

}
</script>