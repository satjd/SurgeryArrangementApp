<template>
    <div>
        <el-dialog title="添加周排班（日班）" 
        @close="curStep = 1"
        :fullscreen="true" 
        :show-close="false" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false" 
        :visible.sync="isVisible">
          <el-steps :active="curStep">
            <el-step title="步骤 1" description="请选择护士"></el-step>
            <el-step title="步骤 2" description="请选择日期"></el-step>
            <el-step title="步骤 3" description="请选择起止时间"></el-step>
          </el-steps>
          <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item v-if="curStep >= 1" label="护士">
              <el-button
                type="warning"
                @click="selectDialogVisible = true"
                >...</el-button>
              <staff-select :isVisible="selectDialogVisible" ref="staffSelectWeek" 
                @dialogClose="selectDialogVisible = false" :selectableFilter="staffSelectWeekFilter"
                @submit="staffSelectWeekSubmitHandler"></staff-select>
              <el-tag v-for="staff in formData.staff" :key="staff.id">{{staff.name}}</el-tag>
            </el-form-item>
            <el-form-item v-if="curStep >= 2" label="日期">
              <el-date-picker
              v-model="formData.date"
              type="date"
              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="curStep >= 3" label="时间段">
                <el-time-picker
                  v-model="formData.start"
                  :picker-options="{
                  }"
                  placeholder="任意时间点">
                </el-time-picker>
                <el-time-picker
                  arrow-control
                  v-model="formData.end"
                  :picker-options="{
                  }"
                  placeholder="任意时间点">
                </el-time-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelButtonClicked">取 消</el-button>
            <el-button type="primary" @click="confirmButtonClicked">{{curStep==3?'提交':'下一步'}}</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import StaffSelect from '@/components/StaffSelect'

const MAX_STAFF_AMOUNT = 1

export default {
  name: 'info-select-week',
  components: {
    StaffSelect
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    confirmButtonClicked: function() {
      if (this.curStep === 3) {
        this.$emit('confirm')
      } else this.curStep++
    },
    cancelButtonClicked: function() {
      this.$emit('cancel')
    },
    select: function() {
      this.selecting = true
    },
    staffSelectWeekFilter: function(row, index) {
      // TODO: ie support
      if (this.$refs.staffSelectWeek.formData.selectedStaffIndex.includes(row)) return true
      return this.$refs.staffSelectWeek.formData.selectedStaffIndex.length < MAX_STAFF_AMOUNT
    },
    staffSelectWeekSubmitHandler: function() {
      this.formData.staff = this.$refs.staffSelectWeek.formData.selectedStaffIndex
      this.selectDialogVisible = false
    }

  },
  data() {
    return {
      curStep: 1,
      selectDialogVisible: false,
      formData: {
        staff: [],
        weekArrangements: []
      }
    }
  }
}
</script>