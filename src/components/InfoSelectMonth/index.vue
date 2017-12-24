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
              <el-transfer  v-model="formData.night" :data="nurseList" filterable filter-placeholder="搜索护士"
              :titles="['备选护士', '已选择']" :button-texts="['选择护士', '退到备选']"></el-transfer>
            </el-form-item>
            <el-form-item v-if="curStep >= 3" label="候补护士">
              <el-transfer v-model="formData.nightStandby" :data="nurseList"  filterable filter-placeholder="搜索护士"
              :titles="['备选护士', '已选择']" :button-texts="['选择护士', '退回到备选']"></el-transfer>
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
export default {
  name: 'info-select-month',
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
    },
    formData: {
      type: Object,
      default: function() {
        return {
          date: '',
          night: [],
          nightStandby: []
        }
      }
    }
  },
  methods: {
    confirmButtonClicked: function() {
      if (this.curStep === 3) {
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
      curStep: 1
    }
  }
}
</script>