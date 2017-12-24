<template>
    <div>
        <el-dialog title="添加排班" :fullscreen="true" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="isVisible">
          <el-steps :active="curStep">
            <el-step title="步骤 1" description="请选择排班日期"></el-step>
            <el-step title="步骤 2" description="夜班护士选择"></el-step>
            <el-step title="步骤 3" description="候补夜班护士选择"></el-step>
          </el-steps>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item v-if="curStep >= 1" label="时间">
              <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="curStep >= 2" label="夜班护士">
              <el-transfer v-model="form.night" :data="nurseList"></el-transfer>
            </el-form-item>
            <el-form-item v-if="curStep >= 3" label="候补护士">
              <el-transfer v-model="form.nightStandby" :data="nurseList"></el-transfer>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelButtonClicked">取 消</el-button>
            <el-button type="primary" @click="confirmButtonClicked">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible="selecting">
          <el-col :span="12">

          </el-col>
          <el-col :span="12">

          </el-col>
          <div slot="footer" class="dialog-footer">
            <el-button @click="selecting=false">取 消</el-button>
            <el-button type="primary" @click="selecting=false">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'info-select',
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
        this.curStep = 1
        this.$emit('confirmButtonClicked')
      } else this.curStep++
    },
    cancelButtonClicked: function() {
      this.$emit('cancelButtonClicked')
    },
    select: function() {
      this.selecting = true
    }
  },
  data() {
    return {
      selecting: false,
      curStep: 1,
      form: {
        date: '',
        night: [],
        nightStandby: []
      }
    }
  }
}
</script>