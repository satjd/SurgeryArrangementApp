<template>
  <div>
    <info-select-week :isVisible="infoSelectVisible" @confirm="dialogConfirm" @cancel="dialogCancel"></info-select-week>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading.body="listLoading" 
      element-loading-text="Loading">
      <el-table-column
        label="人员"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
          <el-button
            v-if="scope.row.edit"
            size="mini"
            type="warning"
            @click="selectDialogVisible = true"
            >...</el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-for="index in [1,2,3,4,5,6,7]" 
        :key="index.id"
        :label="'W'+index"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.edit">
            <el-checkbox v-model="scope.row.arrangements[index-1].idle">空闲</el-checkbox>
            <div>
              <el-input-number size="mini" v-model="scope.row.arrangements[index-1].start" :min="0" :max="23" :disabled="scope.row.arrangements[index-1].idle"></el-input-number>
              <el-input-number size="mini" v-model="scope.row.arrangements[index-1].end"   :min="0" :max="23" :disabled="scope.row.arrangements[index-1].idle"></el-input-number>
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
            @click="handleEdit(scope.$index, scope.row)">{{scope.row.edit == false?'编辑':'确认'}}</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <staff-select :isVisible="selectDialogVisible" @dialogClose="selectDialogVisible = false"></staff-select>
  </div>
</template>

<script>
import InfoSelectWeek from '@/components/InfoSelectWeek'
import StaffSelect from '@/components/StaffSelect'
import { getWeekList } from '@/api/table'

export default {
  name: 'info-list-week',
  components: {
    InfoSelectWeek,
    StaffSelect
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getInfoListWeek()
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
      // this.$emit('editRow', index, this.tableData)
      // this.infoSelectVisible = true
      row.edit = !row.edit
    },
    handleDelete(index, row) {
      console.log(index, this.tableData)
      this.$emit('deleteRow', { i: index, tableRef: this.tableData })
    },
    dialogConfirm() {
      this.infoSelectVisible = false
    },
    dialogCancel() {
      this.infoSelectVisible = false
    },
    getInfoListWeek() {
      this.listLoading = true
      getWeekList().then(response => {
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
      listLoading: false,
      tableData: []
    }
  }

}
</script>