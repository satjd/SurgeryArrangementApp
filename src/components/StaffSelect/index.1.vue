<template>
<el-dialog ref="dialog" title="选择护士" 
  @open="getStaffList()"
  :fullscreen="false" 
  :show-close="false" 
  :close-on-click-modal="false" 
  :close-on-press-escape="false"
  :visible.sync="isVisible" 
  append-to-body 
  >
  <div>
    <el-checkbox label="过滤孕期" v-model="pregnantFilterEnabled"></el-checkbox>
    <el-checkbox label="过滤休假" v-model="vacationFilterEnabled"></el-checkbox>
    <div>
      年龄范围
      <el-input-number size="mini"></el-input-number>
      至
      <el-input-number size="mini"></el-input-number>
    </div>
  </div>
  <el-form ref="form" :model="formData" label-width="80px">
    <el-table
      ref="staffList"
      :data="staffList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading.body="listLoading" 
      element-loading-text="Loading">
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectableFilter">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pregnant"
        label="是否孕期"
        show-overflow-tooltip
        :filters="[{ text: '孕期', value: true }, { text: '非孕期', value: false }]"
        :filter-method="filterPregnant"
        filter-placement="bottom-end"
        :filtered-value="filteredValuePregnant">
        <template slot-scope="scope">{{ scope.row.pregnant }}</template>
      </el-table-column>
      <el-table-column
        prop="vacation"
        label="是否休假"
        show-overflow-tooltip
        :filters="[{ text: '休假', value: true }, { text: '非休假', value: false }]"
        :filter-method="filterVacation"
        filter-placement="bottom-end"
        :filtered-value="filteredValueVacation">
        <template slot-scope="scope">{{ scope.row.vacation }}</template>
      </el-table-column>
      <el-table-column
        prop="exp"
        label="资历"
        show-overflow-tooltip>
      </el-table-column>

    </el-table>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import { getStaff } from '@/api/staff'

export default {
  name: 'staff-select',
  components: {},
  props: {
    isVisible: false,
    selectableFilter: {
      type: Function,
      default: function(row, index) { return true }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('dialogClose')
    },
    onSubmit() {
      this.$emit('submit')
    },
    getStaffList() {
      this.listLoading = true
      getStaff().then(response => {
        this.staffList = response.data.items
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      console.log(this.formData.selectedStaffIndex)
      this.formData.selectedStaffIndex = val
    },
    filterPregnant(value, row) {
      return row.pregnant === value
    },
    filterVacation(value, row) {
      return row.vacation === value
    }
  },
  data() {
    return {
      listLoading: false,
      staffList: [],
      pregnantFilterEnabled: false,
      vacationFilterEnabled: false,
      filteredValuePregnant: [],
      filteredValueVacation: [],
      formData: {
        selectedStaffIndex: []
      }
    }
  }
}
</script>