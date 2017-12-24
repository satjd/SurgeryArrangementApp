<template>
  <div>
    <info-select-month :isVisible="infoSelectVisible" @confirmButtonClicked="dialogConfirm" @cancelButtonClicked="dialogCancel"></info-select-month>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="班次"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="人员"
        >
        <template slot-scope="scope">
          <el-collapse>
            <el-collapse-item title="夜班护士" name="1">
              <el-popover v-for="item in scope.row.night" :key="item.id" trigger="hover" placement="top">
                <p>姓名: {{ item.name }}</p>
                <p>资历: {{ item.exp }}</p>
                <p>状态: {{ item.status }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ item.name }}</el-tag>
                </div>
              </el-popover>
            </el-collapse-item>
            <el-collapse-item title="候补护士" name="2">
              <el-popover v-for="item in scope.row.nightStandby" :key="item.id" trigger="hover" placement="top">
                <p>姓名: {{ item.name }}</p>
                <p>资历:{{item.exp}}</p>
                <p>状态: {{ item.status }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ item.name }}</el-tag>
                </div>
              </el-popover>
            </el-collapse-item>
          </el-collapse>
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
import InfoSelectMonth from '@/components/InfoSelectMonth'

export default {
  name: 'info-list-month',
  components: {
    InfoSelectMonth
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