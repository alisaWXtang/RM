<template>
  <div id="contractText">
    <div class=" label-text bgc-grey">
      <p class="label-text dib div-title lineGreen m-b-20 m-l-10"><i class="dib "></i></p>
      <p v-if="editable && !isAdmin" class="label-text  div-title dib">
        <i class="red-five-pointed-star">*</i></p>
      合同文本:
      <el-row :gutter="40" class="m-b-15 m-l-0">
        <el-col class="baseFlex" :span="6">
          <el-form-item
            ref="contractText.usageSealType"
            prop="contractText.usageSealType"
            label="用章类型："
            class="flex-grow-1 "
            :show-message="false"
          >
            <el-tooltip
              :disabled="!formErrorMsg['contractText.usageSealType']"
              class="item"
              effect="dark"
              :content="formErrorMsg['contractText.usageSealType']"
              placement="top-start"
            >
              <el-select v-model="contractText.usageSealType" placeholder="请选择">
                <el-option
                  v-for="item in chapterType"
                  :key="item.systemCode"
                  :label="item.systemValue"
                  :value="item.systemCode"
                />
              </el-select>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col class="baseFlex " :span="6">
          <el-form-item
            ref="contractText.textName"
            prop="contractText.textName"
            label="文本名称："
            class="flex-grow-1 "
            :show-message="false"
          >
            <el-input v-model="contractText.textName" v-trim placeholder="" class="" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col class="baseFlex " :span="6">
          <el-form-item
            ref="contractText.textStatusDisplay"
            prop="contractText.textStatusDisplay"
            label="文本状态："
            class="flex-grow-1 "
            :show-message="false"
          >
            <el-input v-model="contractText.textStatusDisplay" v-trim placeholder="请输入文本状态" class="" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col class="baseFlex" :span="6">
          <el-form-item
            ref="contractText.textNumber"
            prop="contractText.textNumber"
            label="文本编号："
            class="flex-grow-1"
            :show-message="false"
          >
            <el-input v-model="contractText.textNumber" v-trim disabled class="" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40" class="m-b-15 m-l-0">
        <el-col class="baseFlex" :span="6">
          <el-form-item
            ref="contractText.confidentialityLevel"
            prop="contractText.confidentialityLevel"
            label="保密级别："
            class="flex-grow-1"
            :show-message="false"
          >
            <el-tooltip
              effect="dark"
              placement="top"
              :disabled="!formErrorMsg['contractText.confidentialityLevel']"
              :content="formErrorMsg['contractText.confidentialityLevel']"
            >
              <el-select v-model="contractText.confidentialityLevel" placeholder="请选择">
                <el-option
                  v-for="item in secretLevel"
                  :key="item.systemCode"
                  :label="item.systemValue"
                  :value="item.systemCode"
                />
              </el-select>
              <!-- <el-input v-model="contractText.confidentialityLevel" /> -->
            </el-tooltip>
          </el-form-item>
        </el-col>

        <el-col class="baseFlex" :span="18">
          <el-form-item
            ref="contractText.contractTextAttachmentsls"
            prop="contractText.contractTextAttachmentsls"
            label="上传合同："
            class="flex-grow-1 cost"
            :show-message="false"
          >
            <el-input v-show="false" v-model="contractText.contractTextAttachmentsls" />
            <el-upload
              action="/resource-web/file/uploadsingle"
              :on-success="safeFileSuccess"
              :on-error="fileFail"
              :on-remove="handleSafeRemove"
              :before-upload="beforeUpload"
              :file-list="contractTextAttachmentsFileList"
              accept=".docx,.doc,.xls,.xlsx,.pdf,.png,.jpg,.jpeg,.gif "
            >
              <!-- :on-preview="handleSafePreview" -->

              <el-button
                type="primary"
                style="padding:
               8px 20px; line-height:15px"
              >选择</el-button>
              <span class="m-l-10">支持的文件类型为 .docx,.doc,
                .xls,.xlsx,.pdf,.png,.jpg,.jpeg,.gif</span>
            </el-upload>
            <span>
              <el-button
                v-if="contractTextAttachmentsFileList.length>0"
                type="primary"
                style="padding: 8px 20px;
                 line-height:15px"
                class="m-l-20"
                @click="downloadFile"
              >下载</el-button>
              <el-button
                v-if="contractTextAttachmentsFileList.length>0"
                type="primary"
                style="padding: 8px 20px; line-height:15px"
                class="m-l-20"
                @click="preview"
              >预览</el-button>
            </span>
            <span v-if="contractTextAttachmentsFileList.length===0" class="red-five-pointed-star">（上传合同为必填）</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dowloadFile } from '@/api/contract'
export default {
  name: 'ContractText',
  components: {
    // AutoComplete,
    // AutoCompletes
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    contractText: {
      type: Object,
      default() {
        return {}
      }
    },
    formErrorMsg: {
      type: Object,
      default() {
        return {}
      }
    },
    chapterType: {
      type: Array,
      default() {
        return []
      }
    },
    secretLevel: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      contractTextAttachments: [],
      contractTextAttachmentsFileList: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getId() {

    },
    downloadFile() { // 下载
      dowloadFile({ fileName: this.contractTextAttachmentsFileList[0].name, filePath: this.contractTextAttachmentsFileList[0].url })
    },
    preview() { // 预览
      window.open(this.contractTextAttachmentsFileList[0].url)
    },

    safeFileSuccess(response, file, fileList) {
      if (response.success) {
        this.contractText.textName = file.name
        this.contractText.openUrl = response.data.url
        this.contractTextAttachments = [response.data.id] // 包装上传数据
        this.contractText.contractTextAttachmentsls = response.data.id
        this.contractTextAttachmentsFileList = []
        this.contractTextAttachmentsFileList[0] = { name: response.data.name, url: response.data.url }
        this.$forceUpdate()
        this.$emit('updataFile')
      } else {
        this.$message.error(response.msg)
      }
    },
    beforeUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const typeList = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
      // .docx,.doc,.xls,.xlsx,.pdf,.png,.jpg,.jpeg,.gif
      if (typeList.indexOf(fileType) < 0) {
        this.$message.error(`上传文件格式不支持${fileType}`)
        return false
      }
      if (file.size / 1024 / 1024 > 50) {
        this.$message.warning('附件不能超过50M')
        return false
      }
      return true
    },
    handleSafeRemove(file, fileList) {
      this.contractText.textName = ''
      this.contractTextAttachmentsFileList = []
      this.contractText.contractTextAttachmentsls = ''
    },
    fileFail(err, file, fileList) {
      console.log('err', err)
    },
    handleSafePreview(file) { // 点击文件下载
      console.log('000000')
      // window.open(file.fileUrl)
    },
    handleVisChange() {

    },
    incomeExpenditureChange() {

    },
    removeTag() {

    },
    searcherRemoteMethod() {

    },
    searcherUsersListChange() {

    },
    userNameRemoteMethod() {

    },
    UsersListChange() {

    }
  }

}
</script>

<style lang="scss" scoped>
#contractText{
  .bgc-grey {
    padding: 0 10px 0px 0px;
    background-color: #F8F8F8 ;
    margin-bottom: 10px;
  }
  .baseFlex {
    /deep/.el-form-item__content {
      display: flex;
    }
  }
}
</style>
<style lang="scss">
.popperClass{
  display: none;
}
</style>
