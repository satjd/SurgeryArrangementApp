<template>
  <div>
    <info-select-week :isVisible="infoSelectVisible" @confirm="dialogConfirm" @cancel="dialogCancel"></info-select-week>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="人员"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="index in [1,2,3,4,5,6,7]" 
        :key="index.id"
        :label="'W'+index"
        >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px" >{{ scope.row.arrangements[index-1].start + '至' + scope.row.arrangements[index-1].end }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import InfoSelectWeek from '@/components/InfoSelectWeek'

export default {
  name: 'info-list-week',
  components: {
    InfoSelectWeek
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
      // this.$emit('editRow', index, this.tableData)
      this.infoSelectVisible = true
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
    }
  },
  data() {
    return {
      infoSelectVisible: false
    }
  }

}
</script>