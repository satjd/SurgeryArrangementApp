<template>
<el-dialog ref="dialog" title="选择护士" 
  @open="getStaffInfo()"
  :fullscreen="false" 
  :show-close="false" 
  :close-on-click-modal="false" 
  :close-on-press-escape="false"
  :visible.sync="isVisible" 
  >
  <el-form ref="form" :model="formData" label-width="80px">
    <el-table
      ref="multipleTable"
      :data="staffList"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
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
        label="是否孕期"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.pregnant }}</template>
      </el-table-column>
      <el-table-column
        prop="vacation"
        label="是否休假"
        show-overflow-tooltip>
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
    <el-button type="primary">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  name: 'staff-select',
  components: {},
  props: {
    isVisible: false
  },
  methods: {
    closeDialog() {
      this.$refs.dialog.$emit('update:visible', false)
    },
    getStaffInfo() {
      console.log('get')
      this.staffList = [
        {
          name: '护士1',
          age: 27,
          pregnant: false,
          vacation: false,
          exp: 'high'
        },
        {
          name: '护士2',
          age: 21,
          pregnant: false,
          vacation: true,
          exp: 'mid'
        },
        {
          name: '护士3',
          age: 30,
          pregnant: true,
          vacation: false,
          exp: 'low'
        }
      ]
    }
  },
  data() {
    return {
      staffList: [],
      formData: {
        selectedStaffIndex: []

      }
    }
  }
}
</script>