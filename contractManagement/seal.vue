<template>
  <div>
    <el-card class="serach-card">
      <el-form
        ref="requestForm"
        :model="requestForm"
        label-suffix="："
        class="serach-from"
        label-width="90px"
      >
        <el-row :gutter="20">
          <div class="header">
            <el-col :span="6">
              <el-form-item label="合同名称" prop="contractName">
                <el-input
                  v-model="requestForm.contractName"
                  placeholder="请输入合同名称"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号" prop="contractNumber">
                <el-input
                  v-model="requestForm.contractNumber"
                  placeholder="请输入合同编号"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同流水号" prop="contractSerialNumber">
                <el-input
                  v-model="requestForm.contractSerialNumber"
                  placeholder="请输入合同流水号"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文本编号" prop="textNumber">
                <el-input
                  v-model="requestForm.textNumber"
                  placeholder="请输入文本编号"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
          </div>
          <el-button class="upBtn reset-btn" @click="open">
            <div v-show="isOpen" class="dib">收起</div>
            <div v-show="!isOpen" class="dib">展开</div>
            <i
              :class="isOpen?'rotate-open el-icon-arrow-down':
                ' el-icon-arrow-down rotate-close'"
            />
          </el-button>
        </el-row>
        <el-row v-if="isOpen" :gutter="20">
          <div class="header">
            <el-col :span="6">
              <el-form-item label="用章类型" prop="usageSealType">
                <el-select
                  v-model="requestForm.usageSealType"
                  placeholder="请选择用章类型"
                  :clearable="true"
                >
                  <template v-for="item in sealTypeList">
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文本状态" prop="textStatus">
                <el-select
                  v-model="requestForm.textStatus"
                  placeholder="请选择文本状态"
                  :clearable="true"
                >
                  <template v-for="item in textStatusList">
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文本名称" prop="textName">
                <el-input
                  v-model="requestForm.textName"
                  placeholder="请输入文本名称"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人" prop="founderLable">
                <auto-completes v-model="requestForm.founderLable" placeholder="请输入创建人" @idSelect="changeFounderName" />
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-row v-if="isOpen" :gutter="20">
          <div class="header">
            <el-col :span="6">
              <el-form-item label="交易方" prop="companyName">
                <el-input
                  v-model="requestForm.companyName"
                  placeholder="请输入交易方"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="签约主体" prop="contractSubjectName">
                <el-input
                  v-model="requestForm.contractSubjectName"
                  placeholder="请输入签约主体"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>
      <div class="tc m-t-10">
        <el-button type="primary" class="fixed-width" @click="handleSreach">查询</el-button>
        <el-button class=" reset-btn fixed-width " plain @click="handleReset('requestForm')">重置</el-button>
      </div>
    </el-card>

    <el-card class="m-t-20-s card-table">
      <el-row v-if="hasPermission(paralegal.split(','))" class="table-but-top">
        <el-button type="primary" class="fixed-width" @click="handleOurSeal('1')">我方用章</el-button>
      </el-row>
      <el-table ref="sealTable" v-loading="tableLoading" border :data="dataList" :class="[disableSelAll?'':'disable-selall']" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="selableStatu"
        />
        <template v-for="item in tabelPropsList">
          <el-table-column
            v-if="item.prop!=='contractTextName'"
            :key="item.label"
            :porp="item.prop"
            :label="item.label"
            show-overflow-tooltip
            align="center"
            min-width="160"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop]||'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.label"
            :porp="item.prop"
            :label="item.label"
            show-overflow-tooltip
            align="center"
            min-width="160"
            class-name="down-bth"
          >
            <template slot-scope="scope">
              <a @click="handleScanDownload(scope.row)">{{ scope.row[item.prop]||'--' }}</a>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="180"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 法务助理 -->
            <!-- {{ scope.row.paralegal }} -->
            <span v-if="scope.row.optionType.indexOf('1')>=0" class="text-success poi" type="text" size="small" @click="handleOurSeal(2,scope.row)">我方用章</span>
            <!-- 拟制人/使用人 -->
            <span v-if="scope.row.optionType.indexOf('2')>=0" class="text-success poi" type="text" size="small" @click="handleScanUpload(scope.row)">扫描件上传</span>
            <!--  -->
            <span v-if="scope.row.optionType.indexOf('3')>=0" class="text-success poi" type="text" size="small" @click="handleDowloadFileByFileId(scope.row)">扫描件下载</span>
            <span v-if="scope.row.optionType.length===0" class="text-success poi" :style="{cursor: 'none'}" type="text" size="small">--</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 合同状态(1：草稿2：已撤回 3：待审批 4：已通过5：已签订 6：已拒绝 7：已终止 8：已结束) -->
      <div class="tc p-t-20 p-b-20">
        <CustomPagination :page-param="pageParam" :total="total" @changePage="changePage" />
      </div>
      <el-dialog v-if="downLoadShow" center :title="activeObj.fileType&&activeObj.fileType===1?'上传合同文本':'上传合同附件'" :visible.sync="downLoadShow" custom-class="custom-dialog seal-dialog" v-on="$listeners" @close="onClose">
        <el-form ref="scanDownLoad" :model="scanDownLoadForm" :rules="scanDownloadRules" size="mini" label-width="74px">
          <el-form-item label="签订时间:" prop="signingTime">
            <el-date-picker
              v-model="scanDownLoadForm.signingTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{width: '100%'}"
              placeholder="请选择签订时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="有效日期:" prop="effectiveTime">
            <el-date-picker
              v-model="scanDownLoadForm.effectiveTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{width: '100%'}"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            />
          </el-form-item>
          <el-form-item label="上传附件:" prop="files">
            <UploadFile @updateList="updateDownloadList">
              <slot><span class="update-but">选择</span></slot>
            </UploadFile>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="handelConfirm('scanDownLoad')">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import store from '@/store'
import moment from 'moment'
import CustomPagination from './components/customPagination'
import UploadFile from './components/uploadFile'
import AutoCompletes from '@/components/AutoComplete/index1'
import { getContractUsageSealTextList, getDownloadWatermarkFile, getFileUploadUpdateStatus, updateMyContractUsageSealTextStatus, dowloadFileByFileId } from '@/api/contract'
// {
//   label: '无需用章', value: '3'
// }
export default {
  name: 'ContractManagementSeal',
  components: { CustomPagination, UploadFile, AutoCompletes },
  data() {
    return {
      isOpen: false,
      sealTypeList: [
        {
          label: '双方用章（或我方用章）', value: '1'
        },
        {
          label: '仅需对方用章', value: '2' }
      ],
      textStatusList: [
        {
          label: '已通过', value: '4'
        },
        {
          label: '内部已用章', value: '2'
        },
        {
          label: '用章完成', value: '3'
        }
      ],
      requestForm: {
        contractName: '',
        contractNumber: '',
        contractSerialNumber: '',
        textNumber: '',
        usageSealType: '',
        textStatus: '',
        textName: '',
        founderLable: '',
        founder: '',
        companyName: '',
        contractSubjectName: ''
      },
      scanDownLoadForm: {
        signingTime: null,
        effectiveTime: null,
        files: []
      },
      scanDownloadRules: {
        files: [{ required: true, message: '请选择文件', trigger: 'change' }],
        signingTime: [],
        effectiveTime: []
      },
      activeObj: null,
      tableLoading: false,
      dataList: [],
      tabelPropsList: [
        { label: '合同编号', prop: 'contractNumber' },
        { label: '合同名称', prop: 'contractName' },
        { label: '合同流水号', prop: 'contractSerialNumber' },
        { label: '用章确认人', prop: 'sealConfirmUserName' },
        { label: '申请人', prop: 'founderName' },
        { label: '文件类型', prop: 'fileTypeData' },
        { label: '用章类型', prop: 'usageSealTypeData' },
        { label: '文本状态', prop: 'textStatusData' },
        { label: '文本编号', prop: 'textNumber' },
        { label: '合同文本名称', prop: 'contractTextName' },
        { label: '交易方', prop: 'companyName' },
        { label: '签约主体', prop: 'contractSubjectName' },
        { label: '内部完成用章时间', prop: 'finishUsageSealTimeData' },
        { label: '合同批准时间', prop: 'contractApproveTimeData' }
      ],
      selList: [],
      paralegal: '', // 法务助理字符串
      total: 0,
      pageParam: {
        currentPage: 1,
        pageSize: 20
      },
      downLoadShow: false,
      disableSelAll: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.tableLoading) { return }
      this.tableLoading = true
      const params = {
        ...this.requestForm,
        pageParam: this.pageParam
      }
      try {
        getContractUsageSealTextList(params).then(res => {
          this.resetList(res.data)
          this.tableLoading = false
        }, rej => {
          this.tableLoading = false
        })
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    resetList(data) {
      const { total = 0, list = [] } = data
      this.disableSelAll = false
      this.dataList = list.map((item, index) => {
        if (index === 0) {
          this.paralegal = item.paralegal || ''
        }
        item.fileTypeData = item.fileType === 1 ? '文本' : '附件'
        item.contractApproveTimeData = item.contractApproveTime ? moment(item.contractApproveTime).format('YYYY-MM-DD HH:mm:ss') : null
        item.finishUsageSealTimeData = item.finishUsageSealTime ? moment(item.finishUsageSealTime).format('YYYY-MM-DD') : null
        const usageSealType = this.sealTypeList.find(cell => {
          return cell.value === item.usageSealType
        })
        const textStatus = this.textStatusList.find(cell => {
          return cell.value === item.textStatus
        })
        item.usageSealTypeData = usageSealType && usageSealType.label ? usageSealType.label : null
        item.textStatusData = textStatus && textStatus.label ? textStatus.label : null
        item.optionType = this.getOptionType(item)
        if (item.optionType.indexOf('1') >= 0) {
          this.disableSelAll = true
        }
        return item
      })
      // console.log('this.disableSelAll', this.disableSelAll)
      this.total = total
    },
    handleSreach() {
      this.pageParam.currentPage = 1
      this.getList()
    },
    handleReset(formName) {
      this.pageParam.currentPage = 1
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.requestForm.founder = ''
        this.getList()
      })
    },
    hasPermission(users = []) { // 判断是否有使用权限
      return users.includes(store.getters.user.id)
    },
    getOptionType(item) {
      // 根据文本状态和用章类型，得到可以操作的按钮列表
      // textStatus文本状态(1:新建；2:内部已用章；3:用章完成；4:已通过；)
      // usageSealType	用章类型(1：双方用章(或我方用章) 2：仅需对方用章 3：无需用章）
      const list = []
      const { textStatus = null, usageSealType = null, paralegal = '', founder, enduser } = item
      const isParalegal = this.hasPermission(paralegal.split(',')) // 是否法务助理
      const isFounderAndEnduser = this.hasPermission([founder, enduser]) // 是否合同拟制人/使用人
      const optionType = {
        '3': ['3,1', '3,2'] // 下载
      }
      if (isParalegal) optionType['1'] = ['4,1'] // 用章
      if (isFounderAndEnduser) optionType['2'] = ['2,1', '3,1', '4,2', '3,2'] // 上传
      Object.keys(optionType).forEach(key => {
        const types = optionType[key]
        if (types.includes(`${textStatus},${usageSealType}`)) {
          list.push(key)
        }
      })
      return list
    },
    changePage(pageParam) {
      const { currentPage = 0, pageSize = 0 } = pageParam
      if (!currentPage || !pageSize) {
        return
      }
      this.pageParam = {
        ...pageParam
      }
      this.getList()
    },
    selableStatu(row, index) {
      const list = this.getOptionType(row)
      if (list.indexOf('1')) {
        return false
      } else {
        return true
      }
    },
    handleOurSeal(type, row) {
      // 分多选和单选
      let list = []
      if (type === '1') {
        if (this.selList.length <= 0) {
          this.$message.error('请至少选择一条数据')
          return
        }
        list = this.selList
      } else {
        list = [row]
      }
      const contractTextIds = []
      const contractAttachmentIds = []
      list.forEach(item => {
        if (item.fileType === 1) {
          contractTextIds.push(item.contractTextOrAttachmentId)
        } else if (item.fileType === 2) {
          contractAttachmentIds.push(item.contractTextOrAttachmentId)
        }
      })
      const params = {
        contractTextIds: contractTextIds.join(','), contractAttachmentIds: contractAttachmentIds.join(',')
      }
      try {
        updateMyContractUsageSealTextStatus(params).then(res => {
          this.$message({
            message: '更新我方用章成功',
            type: 'success'
          })
          this.getList()
        })
      } catch (error) {
        console.log('handleOurSeal', error)
      }
    },
    handleScanUpload(row) {
      this.activeObj = row
      this.downLoadShow = true
    },
    onClose() {
      this.scanDownLoadForm = {
        signingTime: null,
        effectiveTime: null,
        files: []
      }
      // this.$refs.scanDownLoad.resetFields()
      this.activeObj = null
      this.downLoadShow = false
    },
    updateDownloadList(list) {
      this.$set(this.scanDownLoadForm, 'files', list)
      this.$refs.scanDownLoad.validate((valid) => {
        if (!valid) {
          return false
        }
      })
    },
    handelConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.uploadUpdateStatus(valid)
        } else {
          return false
        }
      })
    },
    uploadUpdateStatus(valid) {
      this.downLoadShow = false
      const { contractId = null, contractTextId = null, contractAttachmentId = null, fileType, contractTextOrAttachmentId = null } = this.activeObj
      const params = { contractId, contractTextId, contractAttachmentId }
      const { files = [], effectiveTime = null, signingTime } = this.scanDownLoadForm
      if (fileType === 1) {
        params.contractTextId = contractTextOrAttachmentId
      } else {
        params.contractAttachmentId = contractTextOrAttachmentId
      }
      params.scanFileId = files.length > 0 ? files[0].id : null
      if (signingTime) {
        params.signingTime = Date.parse(signingTime)
      }
      if (effectiveTime && effectiveTime[0]) {
        params.effectiveTimeStart = Date.parse(effectiveTime[0])
      }
      if (effectiveTime && effectiveTime[1]) {
        params.effectiveTimeEnd = Date.parse(effectiveTime[1])
      }
      try {
        getFileUploadUpdateStatus(params).then(res => {
          this.onClose()
          this.getList()
        }, rej => {
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleScanDownload(row) {
      const { contractNumber, textNumber, fileId } = row

      const params = {
        fileId,
        contractNumber, textNumber
      }
      try {
        getDownloadWatermarkFile(params).then(res => {
        }, rej => {})
      } catch (error) {
        console.log('handleScanDownload', error)
      }
    },
    handleDowloadFileByFileId(row) {
      const { scanFileId = null, contractNumber, textNumber } = row
      const params = {
        fileId: scanFileId,
        contractNumber, textNumber
      }
      try {
        dowloadFileByFileId(params).then(res => {
        }, rej => {})
      } catch (error) {
        console.log('handleScanDownload', error)
      }
    },
    handleSelectionChange(val) {
      this.selList = val
    },
    open() {
      this.isOpen = !this.isOpen
    },
    changeFounderName(item) {
      this.$set(this.requestForm, 'founderLable', item.value)
      this.$set(this.requestForm, 'founder', item.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-but-top{
  margin:10px 10px 10px;
  text-align:right;
}
.card-table {
  .el-table{
    .text-success{
      display:inline-block;
      margin-left:10px;
      &:first-child{
        margin-left:0;
      }
    }
    .el-button{
      font-size:12px;
    }
  }
  /deep/td.down-bth{
     .cell{
      cursor: pointer;
      color: #04B4A5;
      a{
        color: #04B4A5;
      }
    }

  }
  // /deep/.el-table--medium{
  //   td{
  //     padding:0px 0;
  //   }
  // }
}
.disable-selall{
  /deep/.el-table__header{
    .el-checkbox__inner{
      background-color: #edf2fc;
      border-color: #dfdfdf;
      cursor: not-allowed;
    }
  }
}
@media screen and (max-width: 1440px){
  .el-button--small {
    padding: 10px 4px;
  }
}
</style>

<style lang="scss">
.seal-dialog{
  /dee/.el-range-separator{
    line-height:24px;
  }
  .update-but{
    font-size: 12px;
    color: rgb(46, 192, 154);
    line-height: 32px;
    display: inline-block;
  }
  .el-upload-list__item.is-success.focusing .el-icon-close-tip{display:none !important}
}
</style>
