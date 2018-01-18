<template>
    <div>
        <el-dialog title="添加月排班（夜班）" 
        @close="curStep = 1"
        :fullscreen="true" 
        :show-close="false" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false" 
        :visible.sync="isVisible">
          <el-steps :active="curStep">
            <el-step title="步骤 1" description="请选择排班日期"></el-step>
            <el-step title="步骤 2" description="夜班护士选择"></el-step>
            <el-step title="步骤 3" description="候补夜班护士选择"></el-step>
          </el-steps>
          <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item v-if="curStep >= 1" label="时间">
              <el-date-picker
              v-model="formData.date"
              type="date"
              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="curStep >= 2" label="夜班护士">
              <el-button
                type="warning"
                @click="selectDialogNightVisible = true"
                >...</el-button>
              <staff-select :isVisible="selectDialogNightVisible" ref="staffSelectNight" 
                @dialogClose="selectDialogNightVisible = false" :selectableFilter="staffSelectNightFilter"
                @submit="staffSelectNightSubmitHandler"></staff-select>
              <el-tag v-for="staff in formData.night" :key="staff.id">{{staff.name}}</el-tag>
            </el-form-item>
            <el-form-item v-if="curStep >= 3" label="候补护士">
              <el-button
                type="warning"
                @click="selectDialogNightStandbyVisible = true"
                >...</el-button>
              <staff-select :isVisible="selectDialogNightStandbyVisible" ref="staffSelectNightStandby" 
                @dialogClose="selectDialogNightStandbyVisible = false" :selectableFilter="staffSelectNightStandbyFilter"
                @submit="staffSelectNightStandbySubmitHandler"></staff-select>
              <el-tag v-for="staff in formData.nightStandby" :key="staff.id">{{staff.name}}</el-tag>
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

const MAX_STAFF_AMOUNT = 3

export default {
  name: 'info-select-month',
  components: {
    StaffSelect
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    nurseList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    confirmButtonClicked: function() {
      if (this.curStep === 3) {
        this.$emit('confirm', this.formData)
      } else this.curStep++
    },
    cancelButtonClicked: function() {
      this.$emit('cancel')
    },
    select: function() {
      this.selecting = true
    },
    staffSelectNightFilter: function(row, index) {
      // TODO: ie support
      if (this.$refs.staffSelectNight.formData.selectedStaffIndex.includes(row)) return true
      return this.$refs.staffSelectNight.formData.selectedStaffIndex.length < MAX_STAFF_AMOUNT
    },
    staffSelectNightStandbyFilter: function(row, index) {
      // TODO: ie support
      if (this.$refs.staffSelectNightStandby.formData.selectedStaffIndex.includes(row)) return true
      return this.$refs.staffSelectNightStandby.formData.selectedStaffIndex.length < MAX_STAFF_AMOUNT
    },
    staffSelectNightSubmitHandler: function() {
      this.formData.night = this.$refs.staffSelectNight.formData.selectedStaffIndex
      this.selectDialogNightVisible = false
    },
    staffSelectNightStandbySubmitHandler: function() {
      this.formData.nightStandby = this.$refs.staffSelectNightStandby.formData.selectedStaffIndex
      this.selectDialogNightStandbyVisible = false
    }

  },
  data() {
    return {
      curStep: 1,
      selectDialogNightVisible: false,
      selectDialogNightStandbyVisible: false,
      formData: {
        date: '',
        night: [],
        nightStandby: []
      }
    }
  }
}
</script>