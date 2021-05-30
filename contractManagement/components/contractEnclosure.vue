<template>
  <div id="contractEnclosure">
    <div class="tableStyle label-text">
      <p class="label-text dib div-title lineGreen m-b-20 m-l-21"><i class="dib "></i></p>
      <p v-if="editable && !isAdmin" class="label-text  div-title dib">
        <i class="red-five-pointed-star">*</i></p>
      合同附件:
      <div class="m-l-11">
        <el-table
          :data="contractEnclosure"
          border
          :header-cell-style="setHeaderCellStyle"
          stripe
          class="custom-table-100"
          cell-class-name="cellStyle"
        >
          <el-table-column prop="id" label="序号" align="center" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="annexName"
            label="附件名称"
            align="center"
            min-width="100px"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span> {{ contractEnclosure[scope.$index].annexName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contractAttachmentStatus"
            label="状态"
            align="center"
            min-width="110"
          >
            <span> 新建 </span>
          </el-table-column>
          <el-table-column prop="needFile" label="需要存档" align="center" min-width="110">
            <template slot-scope="scope">
              <!-- {{ contractEnclosure[scope.$index].openUrl }} -->
              <!-- :prop="'contractEnclosure.'+scope.$index+'.needFile'" -->
              <el-form-item
                :ref="'contractEnclosure.'+scope.$index+'.needFile'"
                :prop="'contractEnclosure.'+scope.$index+'.needFile'"
                :rules="contractEnclosure[scope.$index].openUrl? rules.needFile:[{}]"
                label-width="0"
              >
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :disabled="!formErrorMsg[`contractEnclosure.${scope.$index}.needFile`]"
                  :content="formErrorMsg[`contractEnclosure.${scope.$index}.needFile`]"
                >
                  <el-select v-model="scope.row.needFile" placeholder="请选择">
                    <el-option
                      v-for="item in currencyTax"
                      :key="item.systemCode"
                      :label="item.systemValue"
                      :value="item.systemCode"
                    />
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="usageSealType" label="用章类型" align="center" min-width="110">
            <template slot-scope="scope">
              <el-form-item
                :ref="'contractEnclosure.'+scope.$index+'.usageSealType'"
                :prop="'contractEnclosure.'+scope.$index+'.usageSealType'"
                :rules="contractEnclosure[scope.$index].openUrl? rules.usageSealType:[{}]"
                label-width="0"
              >
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :disabled="!formErrorMsg[`contractEnclosure.${scope.$index}.usageSealType`]"
                  :content="formErrorMsg[`contractEnclosure.${scope.$index}.usageSealType`]"
                >
                  <el-select v-model="scope.row.usageSealType" placeholder="请选择">
                    <el-option
                      v-for="item in chapterType"
                      :key="item.systemCode"
                      :label="item.systemValue"
                      :value="item.systemCode"
                    />
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="confidentialityLevel" label="保密级别" align="center" min-width="110">
            <template slot-scope="scope">
              <el-form-item
                :ref="'contractEnclosure.'+scope.$index+'.confidentialityLevel'"
                :prop="'contractEnclosure.'+scope.$index+'.confidentialityLevel'"
                :rules="contractEnclosure[scope.$index].openUrl? rules.confidentialityLevel:[{}]"
                label-width="0"
              >
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :disabled="!formErrorMsg[`contractEnclosure.${scope.$index}.confidentialityLevel`]"
                  :content="formErrorMsg[`contractEnclosure.${scope.$index}.confidentialityLevel`]"
                >
                  <el-select v-model="scope.row.confidentialityLevel" placeholder="请选择">
                    <el-option
                      v-for="item in secretLevel"
                      :key="item.systemCode"
                      :label="item.systemValue"
                      :value="item.systemCode"
                    />
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="280"
            align="center"
          >
            <template slot-scope="scope" width="100%">
              <el-upload
                v-if="editable && !isAdmin"
                class="dib noneFil"
                action="/resource-web/file/uploadsingle"
                :on-success=" (response, file, fileList) =>
                {annexFileSuccess(response, file, fileList,scope.$index)}"
                :on-error="fileFail"

                :on-remove="handleAnnexRemove"
                :before-upload="beforeUpload"
                accept=".docx,.doc,.xls,.xlsx,.pdf,.png,.jpg,.jpeg,.gif "
              >
                <!-- :on-preview="handleSafePreview" -->
                <span class="poi m-r-15">上传附件</span>
              </el-upload>
              <span
                v-if="contractEnclosure[scope.$index].annexName"
                class="poi m-r-15"
                @click="downloadAnnexFile(scope.row.annexName,scope.row.openUrl)"
              >下载附件</span>
              <span
                v-if="contractEnclosure.length>1"
                class="icon-add-delete"
                @click="annexDeleteSourceRow(scope.row,scope.$index,contractEnclosure)"
              >
                <i
                  class="iconfont icon-srm-minus icon-color"
                />
              </span>
              <!-- {{contractEnclosure.length}} -->
              <span
                v-if="scope.$index + 1 === contractEnclosure.length &&
                  contractEnclosure.length <20"
                class="icon-add-delete"
                @click="annexAddSourceRow(scope.row,scope.$index,contractEnclosure)"
              >
                <i
                  class="iconfont icon-srm-puls icon-color m-l-5"
                />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    currencyTax: {
      type: Array,
      default: () => {
        []
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    contractEnclosures: {
      type: Array,
      default() {
        return []
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
      contractAttachmentLink: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    contractEnclosure: {
      // return this.contractEnclosures
      get() {
        return this.contractEnclosures
      },
      set() {

      }
    }
  },
  created() {
    // this.getBaseData()
  },
  mounted() {

  },
  methods: {
    getId() {

    },
    safeFileSuccess(response, file, fileList) {
      if (response.success) {
        this.form.contractText.textName = file.name

        this.form.contractTextAttachments = [response.data.id] // 包装上传数据
        this.contractTextAttachments = []
        this.contractTextAttachments[0] = { name: response.data.name, url: response.data.url }
      } else {
        this.$message.error(response.msg)
      }
    },
    downloadAnnexFile(fileName, filePath) {
      dowloadFile({ fileName, filePath })
    },
    annexAddSourceRow(item, index, list) {
      const newItem = {
        annexName: '', // 附件名称
        confidentialityLevel: '', // 保密级别
        contractAttachmentLink: '', // 合同附件id
        contractAttachmentStatus: '1', // 附件状态
        needFile: '', // 是否需要存档
        orderNo: index, // 序号
        usageSealType: ''// 用章类型
      }
      list.splice(index + 1, 0, newItem)
      this.contractEnclosure = list.map((item, index) => {
        return {
          ...item,
          indexID: index
        }
      })
    },
    annexFileSuccess(response, file, fileList, index) {
      if (response.success) {
        this.contractEnclosure[index].annexName = file.name
        this.contractEnclosure[index].contractAttachmentLink = response.data.id
        this.contractEnclosure[index].openUrl = response.data.url
      } else {
        this.$message.error(response.msg)
      }
    },
    annexDeleteSourceRow(item, index, list) {
      list.splice(index, 1)
      this.contractAttachmentLink = list.map((item, index) => {
        return {
          ...item,
          indexID: index
        }
      })
    },
    handleAnnexRemove(file, fileList) {
      this.contractTextAttachments = this.contractTextAttachments.filter(item => {
        return item.attachmentId !== file.attachmentId
      })
      this.form.contractTextAttachments = fileList
      // this.validateFieldMethod('fileSafeList')
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
      this.form.contractText.textName = ''
      this.form.contractTextAttachments = []
    },
    fileFail(err, file, fileList) {
      console.log('err', err)
    },
    handleSafePreview(file) { // 点击文件下载
      window.open(file.fileUrl)
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

    },
    // 动态设置表格样式
    setHeaderCellStyle() {
      const style = {
        background: '#E1F5F0',
        // 'background': '#F8F8F8',
        'color': ' #666',
        'text-align': 'center',
        'font-weight': 'normal'
      }
      if (document.body.clientWidth > 1440) {
        return {
          ...style,
          'font-size': ' 14px'
        }
      } else {
        return {
          ...style,
          'font-size': ' 12px'
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
#contractEnclosure{
  .bgc-grey {
    padding: 0 10px 1px 0px;
    background-color: #F8F8F8 ;
    margin-bottom: 10px;
  }
/deep/.cellStyle{
  padding:0 !important;
    .cell{
      padding-left:0;
      padding-right:0;
      height: 53px;
      line-height: 53px;
      .el-input,.el-select,.el-textarea,.el-textarea,.el-form-item__content,.el-form-item{
        width: 100%!important;
        height: 100%!important;
      }
      .el-input__inner,.el-textarea__inner{
        height: 100%;
      }
    }
  }
  .noneFil {
    /deep/.el-upload-list {
      display: none;
    }
  }
  .icon-color{
    color: #04B4A5 ;
  }
}
</style>

