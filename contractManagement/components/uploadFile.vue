<!--  -->
<template>
  <div :class="{'no-but':limit<=fileList.length,'dib':true}">
    <el-upload
      action="/resource-web/file/uploadsingle"
      :file-list="fileList"
      :limit="limit"
      :show-file-list="loading"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
    >
      <slot v-if="limit>=fileList.length"><el-button size="small" type="primary">点击上传</el-button></slot>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  components: {},
  model: {
    prop: 'fileId',
    event: 'getId'
  },
  props: {
    limit: {
      type: Number,
      default() {
        return 1
      }
    },
    fileType: {
      // 支持的文件类型，默认全部支持，通过后缀名判断
      type: Array,
      default: function() {
        return []
      }
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      file: {},
      loading: true
    }
  },
  methods: {
    beforeUpload() {
      this.loading = false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(files, fileList) {
      this.fileList.forEach((item, index) => {
        if (item.id === files.id) {
          this.fileList.splice(index, 1)
        }
      })
      this.handleChange()
    },
    handleSuccess(file, res) {
      const { response } = res
      const { data = null, status = '0' } = response
      if (status === '0000') {
        this.fileList.push(data)
        this.loading = true
        this.handleChange()
      }
    },
    handleChange() {
      this.$emit('updateList', this.fileList)
    }
  }
}

</script>
<style lang='scss' scoped>
.no-but{
  /deep/.el-upload{
    display:none
  }
  /deep/.el-upload-list__item{
    line-height:32px;
    margin-top:0 !important;
    margin-bottom:10px;
  }
}
.delete {
  color: #006ee6;
}
</style>
