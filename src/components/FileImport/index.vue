<template>
<el-dialog ref="dialog" title="导入配置"
  :show-close="false" 
  :close-on-click-modal="false" 
  :close-on-press-escape="false"
  :visible.sync="isVisible" 
  append-to-body>
  <el-upload
    class="upload-demo"
    ref="upload"
    action=""
    :multiple="false"
    :limit="limit"
    :accept="fileType"
    :file-list="fileList"
    :auto-upload="false"
    :before-upload="addToList">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="triggerImport">导入文件</el-button>
    <div slot="tip" class="el-upload__tip">只能上传{{fileType}}文件</div>
    </el-upload>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>

export default {
  name: 'file-import',
  components: {},
  props: {
    isVisible: false,
    fileType: '',
    limit: 1
  },
  methods: {
    triggerImport() {
      this.$refs.upload.submit()
    },
    addToList(file) {
      this.fileList = []
      this.fileList.push(file)
      return false
    },
    closeDialog() {
      this.$emit('dialogClose')
    },
    onSubmit() {
      this.$emit('submit', this.fileList)
    }
  },
  data() {
    return {
      fileList: []
    }
  }
}
</script>