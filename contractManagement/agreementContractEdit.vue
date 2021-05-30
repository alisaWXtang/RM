<template>
  <div id="agreementContractEdit" v-loading.fullscreen="approvalLoading">
    <steps
      :steps="steps.stepData"
      :active-id="steps.templateType"
    />
    <div class="demandmainBox">
      <div class="editHeadName">
        <span>合同审批 (进行中)</span>
      </div>
      <el-form
        ref="form"
        :show-message="false"
        label-width="90px"
        :model="form"
        :rules="rules"
        @validate="onFormValid"
      >
        <!-- 合同基本信息 -->
        <contract-base-info
          ref="contractBaseInfo"
          :contract-base-info="form.contractBaseInfo"
          :form-error-msg="formErrorMsg"
          :searcher-remote-method-options="contractExtUsersOptions"

          @vaildAloneItem="vaildAloneItem"
          @updataActivePerson="updataActivePerson"
        />
        <!-- 合同文本 -->
        <contract-text
          ref="contractText"
          :contract-text="form.contractText"
          :form-error-msg="formErrorMsg"
          :chapter-type="chapterType"
          :secret-level="secretLevel"
        />
        <!-- 合同附件 -->
        <contract-enclosure
          ref="contractEnclosure"
          :contract-enclosures="form.contractEnclosure"
          :form-error-msg="formErrorMsg"
          :rules="rules"
          :currency-tax="currencyTax"
          :chapter-type="chapterType"
          :secret-level="secretLevel"
        />
        <!--审批记录-->
        <approval-information
          :other-show-tips="otherShowTips"
          class="approvalInformation m-l-7"
          :operatorrecode-data="operatorrecodeData"
          :step-data="stepData"
          :is-admin="isAdmin"
          :page-param="pageParam"
          :operator-total="operatorTotal"
          @addUserHandler="addUserHandler"
          @getOperatorrecode="getOperatorrecode"
        />
        <!-- 底部按钮 -->
        <div class="buttonBox flex-row-center m-t-50">
          <el-button class="return-button" @click="back">返回</el-button>
          <el-button
            class="m-l-50 agree-button"
            @click="submitData"
          >提交</el-button>
          <el-button
            class="m-l-50 save-button"
            @click="saveData"
          >保存</el-button>
          <el-button
            v-if="isShowDelete"
            class="delete-button m-l-50"
            @click="deleteBtn"
          >删除</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { queryContractInfoDetail, getOperatorRecodeList } from '@/api/requirementManagement'
import ApprovalInformation from '@/components/ApprovalInformation'
import { mapGetters } from 'vuex'
import { magAndSearchContract } from '@/api/contract'

import contractBaseInfo from './components/contractBaseInfo'
import contractText from './components/contractText'
import contractEnclosure from './components/contractEnclosure'
import Steps from '@/components/Steps'
import goBack from '@/utils/goBack'
import {
  noAgreement,
  queryContractActivityUserInfoNoDemandId,
  // getBudgetInfo,
  getQueryalllist,
  submitContract,
  dropDownItem,
  getContractCContractStampDutyList,
  saveContract,
  getContractTaxRateList
} from '@/api/contract'
import { goAnchorSort } from './selectEnum'

export default {
  name: 'AgreementContract',
  components: { Steps, ApprovalInformation, contractBaseInfo, contractText, contractEnclosure },
  data() {
    const validateMoney = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('含税总金额不能为空'))
      } else if (isNaN(value) || Number(value) < 0 || Number(value) > 9999999999.99) {
        return callback(new Error('金额为0-9999999999.99之间的数字'))
      }
      callback()
    }
    return {
      formErrorMsg: {},
      otherShowTips: false,
      rules: {
        'contractBaseInfo.contractName': [
          { required: true, message: '合同名称不能为空', trigger: 'blur' },
          { min: 0, max: 250, message: '长度不超过250个字符', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.signatureType': [
          { required: true, message: '签署类型不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.contractNature': [
          { required: true, message: '合同性质不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.incomeExpenditure': [
          { required: true, message: '收支类型不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.contractTypeNameLable': [
          { required: true, message: '合同类型不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.agenter': [
          { required: true, message: '经办人不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.supervisor': [
          { required: true, message: '监督人不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.demandDept': [
          { required: true, message: '需求部门不能为空', trigger: ['blur', 'change'] }
        ],
        // 'contractBaseInfo.selectContractParticipantInfos': [
        //   { required: true, message: '交易方不能为空', trigger: ['blur', 'change'] }
        // ],
        'contractBaseInfo.contractExtUsers': [
          { required: true, message: '查阅人不能为空', trigger: 'blur' }
        ],
        'contractBaseInfo.contractSubjectName': [
          { required: true, message: '签约主体不能为空', trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.contractPerformancePerson': [
          { required: true, message: '合同履约责任人不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.contractContent': [
          { required: true, message: '合同内容不能为空', trigger: 'blur' },
          { min: 0, max: 1000, message: '长度不超过1000个字符', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.currencyName': [
          { required: true, message: '币种不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.taxTotalAmount': [
          { required: true, validator: validateMoney, trigger: ['blur', 'change'] }
        ],
        'contractBaseInfo.signingAgreement': [
          { required: true, message: '数据使用协议签署方式不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.stampDuty': [
          { required: true, message: '印花税不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.postponed': [
          { required: true, message: '是否顺延不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.foreignExchangeTax': [
          { required: true, message: '是否外汇付税不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.personalDataInvolved': [
          { required: true, message: '是否涉及个人数据不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.taxRate': [
          { required: true, message: '税率不能为空', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.name': [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 0, max: 20, message: '长度不超过20个字符', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.certificateNumber': [
          { required: true, message: '证件号不能为空', trigger: 'blur' },
          { min: 0, max: 50, message: '长度不超过50个字符', trigger: ['change', 'blur'] }
        ],
        'contractBaseInfo.businessDirector': [
          { required: true, message: '业务负责人不能为空', trigger: 'blur' }
        ],
        // 'contractBaseInfo.relationContractName': [
        //   { required: true, message: '关联合同名称不能为空', trigger: 'blur' }
        // ],
        payName: [
          { required: true, message: '款项名称不能为空', trigger: ['blur', 'change'] }
        ],
        planTime: [
          { required: true, message: '计划时间不能为空', trigger: ['blur', 'change'] }
        ],
        payType: [
          { required: true, message: '收付类型不能为空', trigger: ['blur', 'change'] }
        ],
        'contractText.confidentialityLevel': [
          { required: true, message: '保密级别不能为空', trigger: ['blur', 'change'] }
        ],
        confidentialityLevel: [
          { required: true, message: '保密级别不能为空', trigger: ['blur', 'change'] }
        ],
        usageSealType: [
          { required: true, message: '用章类型不能为空', trigger: ['blur', 'change'] }
        ],
        'contractText.usageSealType': [
          { required: true, message: '用章类型不能为空', trigger: ['blur', 'change'] }
        ],
        needFile: [
          { required: true, message: '需要存档不能为空', trigger: ['blur', 'change'] }
        ],
        planAmount: [
          { required: false, type: 'number', message: '请输入数字' }
        ]
      },
      executeType: [],
      contractStateList: [],
      appointState: [],
      currencyTax: [],
      executeWay: [],
      chapterType: [],
      secretLevel: [],
      paymentsname: [],
      payTypeList: [],
      isAdmin: false,
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      contractExtUsersOptions: [],
      steps: {
        stepData: [],
        templateType: 0
      },
      // templateId: '',
      // activitiId: '',
      ProcessOperateRecordVOList: [], // 审批信息
      operatorTotal: 0,
      operatorrecodeData: [], // 操作信息
      stepData: [], // 审批信息人
      addUser: {}, // 添加审批人
      isFunBtnBack: false,
      form: {
        contractBaseInfo: {
          supervisor: '', // 监督人
          contractName: '', // 合同名称
          signatureType: '53', // 签署类型
          signatureTypeName: '协议类', // 签署类型展示
          contractNature: '61', // 合同性质
          contractNatureName: '普通合同', // 合同性质展示
          contractStatus: '1', // 合同状态
          contractStatusDisplay: '新建', // 合同状态展示
          incomeExpenditure: '74', // 收支类型
          incomeExpenditureName: '无收无支', // 收支类型展示
          typeCodeObj: '无收无支',
          performanceStatus: '1', // 履约状态
          performanceStatusDisplay: '正常', // 履约状态展示
          agenter: '', // 经办人
          selectContractParticipantInfos: [], // 交易方选中
          selectContractParticipantInfosCopy: [],
          selectContractExtUsers: [], // 查阅人
          contractExtUsersNameList: [], // 查阅人v-model
          userName: [], // 使用人
          userNameList: [], // 使用人v-model
          demandDept: '',
          contractSubjectName: '', // 签约主体
          contractContent: '', // 合同内容
          foreignExchangeTax: '', // 是否外汇附税
          personalDataInvolved: '', // 是否涉及个人数据
          contractSerialNumber: '', // 合同流水号
          contractNumber: '', // 合同编号
          contractTypeNameLable: '', // 合同类型
          violationsResponsibility: '', // 违约责任
          effectiveTimeEnd: '', // 有效时间止
          effectiveTimeStart: '', // 有效时间起
          relationContractNumber: '', // 关联合同编号
          name: '', // 名称
          businessDirector: '',
          postponed: '', // 是否顺延
          certificateNumber: '', // 证件号
          relationContractName: ''// 关联合同名称
        },
        contractText: {
          usageSealType: '', // 用章类型
          textName: '', // 文本名称
          textStatus: '', // 文本状态
          textNumber: '', // 文本编号
          confidentialityLevel: '', // 保密级别
          // contractTextAttachments: [] // 合同文本的附件 字符串
          // textName:'', //文本名称
          contractTextAttachmentsls: ''

        },
        contractEnclosure: [
          {
            annexName: '', // 附件名称
            contractAttachmentStatus: '1', // 状态
            needFile: '', // 需要存档
            usageSealType: '', // 用章类型
            confidentialityLevel: '' // 保密级别
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    routeParams() {
      return this.$route.params
    },
    isShowDelete() {
      const contractStatus = this.form.contractBaseInfo.contractStatus
      return contractStatus === '1' || contractStatus === '4' || contractStatus === '6'
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isFunBtnBack) {
      this.$confirm('是否要保存当前页面信息？', {
        distinguishCancelAndClose: true
      })
        .then(async() => {
          if (!this.form.contractBaseInfo.contractName.trim()) {
            this.$message({
              message: '标题不能为空',
              type: 'warning'
            })
            return
          }
          await this.saveData('indexNoBack')
          next()
        })
        .catch(action => {
          if (action === 'cancel') {
            next()
          }
        })
    } else {
      next()
    }
  },
  created() {
    this.queryContractInfoDetail()
  },
  mounted() {
    console.log('mounted', this.$route)
    this.getOperatorrecode()
    this.getBaseData()
  },
  methods: {
    // 获取操作记录
    async getOperatorrecode() {
      const params = {
        bizId: this.$route.params.contractId,
        pageParam: { ...this.pageParam }
      }
      await getOperatorRecodeList(params).then(result => {
        this.operatorrecodeData = result.data.list || []
        this.operatorTotal = result.data.total
      }).catch(err => { console.log(err) })
    },
    // 获取合同详情
    async  queryContractInfoDetail() {
      try {
        const { data } = await queryContractInfoDetail({ contractId: this.routeParams.contractId, superAdmin: this.isAdmin })
        // this.form.contractBaseInfo = JSON.parse(JSON.stringify(data.contractBaseInfoDetailVo))
        // this.form.contractBaseInfo = data.contractBaseInfoDetailVo
        Object.assign(this.form.contractBaseInfo, data.contractBaseInfoDetailVo)
        const contractBaseInfoDetailVo = data.contractBaseInfoDetailVo
        // 经办人 给需要合并的对象赋值，特别是搜索组件
        if (contractBaseInfoDetailVo.agenterName || contractBaseInfoDetailVo.agenter) {
          this.form.contractBaseInfo.agenter = contractBaseInfoDetailVo.agenterName + '(' + contractBaseInfoDetailVo.agenter + ')' // 经办人
          this.form.contractBaseInfo.agenterId = contractBaseInfoDetailVo.agenter // 用于获取审批信息或环节
          this.$refs.contractBaseInfo.paramsNeedAssgin.agenterName = contractBaseInfoDetailVo.agenterName
          this.$refs.contractBaseInfo.paramsNeedAssgin.agenter = contractBaseInfoDetailVo.agenter
        }

        // 业务负责人
        if (contractBaseInfoDetailVo.businessDirector && contractBaseInfoDetailVo.businessDirectorName) {
          this.form.contractBaseInfo.businessDirector = contractBaseInfoDetailVo.businessDirectorName + '(' + contractBaseInfoDetailVo.businessDirector + ')' // 业务负责人
          this.form.contractBaseInfo.businessDirectorId = this.form.contractBaseInfo.businessDirectorId// 用于获取审批信息或环节
          this.$refs.contractBaseInfo.paramsNeedAssgin.businessDirectorName = contractBaseInfoDetailVo.businessDirectorName
          this.$refs.contractBaseInfo.paramsNeedAssgin.businessDirector = contractBaseInfoDetailVo.businessDirector
        }

        // 监督人
        if (contractBaseInfoDetailVo.supervisorName && contractBaseInfoDetailVo.supervisor) {
          this.form.contractBaseInfo.supervisor = contractBaseInfoDetailVo.supervisorName + '(' + contractBaseInfoDetailVo.supervisor + ')' // 监督人
          this.$refs.contractBaseInfo.paramsNeedAssgin.supervisor = contractBaseInfoDetailVo.supervisor
          this.$refs.contractBaseInfo.paramsNeedAssgin.supervisorName = contractBaseInfoDetailVo.supervisorName
        }

        // 需求部门
        if (contractBaseInfoDetailVo.demandDeptName && contractBaseInfoDetailVo.demandDept) {
          this.form.contractBaseInfo.demandDept = contractBaseInfoDetailVo.demandDeptName + '-' + contractBaseInfoDetailVo.demandDept
          this.form.contractBaseInfo.demandDeptId = contractBaseInfoDetailVo.demandDept // 用于获取审批信息或环节
          this.$refs.contractBaseInfo.paramsNeedAssgin.demandDeptName = contractBaseInfoDetailVo.demandDeptName
          this.$refs.contractBaseInfo.paramsNeedAssgin.demandDept = contractBaseInfoDetailVo.demandDept
        }

        this.form.contractBaseInfo.contractPerformancePerson = contractBaseInfoDetailVo.contractPerformancePersonName + '(' + contractBaseInfoDetailVo.contractPerformancePerson + ')'
        this.form.contractBaseInfo.contractStatus = this.form.contractBaseInfo.contractStatus // 合同状态
        this.form.contractBaseInfo.contractStatusDisplay = '新建' // 合同状态展示
        this.form.contractBaseInfo.contractTypeNameLable = this.form.contractBaseInfo.contractTypeName // 合同类型展示
        this.form.contractBaseInfo.contractTypeCode = this.form.contractBaseInfo.contractTypeCode // 合同类型code
        this.form.contractBaseInfo.performanceStatus = this.form.contractBaseInfo.performanceStatus // 履约状态
        this.form.contractBaseInfo.performanceStatusDisplay = '正常'// 履约状态展示
        // 000000000000000000000000000000
        console.log('执行到===390')
        if (data.contractParticipantInfos.length > 0) { // 交易方数据
          this.form.contractBaseInfo.selectContractParticipantInfos = data.contractParticipantInfos.map(i => {
            return i.companyName
          })
          this.form.contractBaseInfo.selectContractParticipantInfosCopy = data.contractParticipantInfos.map(({ companyCode, companyName }) => {
            return {
              companyCode,
              companyName

            }
          })
          // console.log(this.form.contractBaseInfo.selectContractParticipantInfos, 'this.form.contractBaseInfo.selectContractParticipantInfos-1')
        }
        if (data.contractExtUsers.length > 0) { // 查阅人使用人数据
          this.form.contractBaseInfo.selectContractExtUsers = data.contractExtUsers.filter(i => { return i.userType === '1' })
          this.form.contractBaseInfo.contractExtUsersNameList = this.form.contractBaseInfo.selectContractExtUsers.map(v => { return v.userName })
          this.form.contractBaseInfo.userName = data.contractExtUsers.filter(i => { return i.userType === '2' })
          this.form.contractBaseInfo.userNameList = this.form.contractBaseInfo.userName.map(v => { return v.userName })
        } else {
          this.form.contractBaseInfo.contractExtUsers = [] // 查阅人
          this.form.contractBaseInfo.userName = [] // 使用人
        }
        // console.log('执行到===413')
        this.form.contractText = {
          confidentialityLevel: data.contractTextDetailVo.confidentialityLevel || '', // 保密级别
          textName: data.contractTextDetailVo.textName || '', // 文本名称
          textNumber: data.contractTextDetailVo.textNumber || '', // 文本编号
          textStatus: '1', // 文本状态
          textStatusDisplay: '新建',
          contractTextAttachmentsls: data.contractTextDetailVo.attachments.length ? data.contractTextDetailVo.attachments[0].attachmentId : '',
          usageSealType: data.contractTextDetailVo.usageSealType || '', // 用章类型
          openUrl: data.contractTextDetailVo.attachments.length ? data.contractTextDetailVo.attachments[0].fileUrl : ''
        }
        if (data.contractTextDetailVo.attachments && data.contractTextDetailVo.attachments.length > 0) {
          this.$refs.contractText.contractTextAttachments = data.contractTextDetailVo.attachments.map(file => file.attachmentId)
          this.$refs.contractText.contractTextAttachmentsFileList = data.contractTextDetailVo.attachments.map(file => {
            return {
              name: file.fileName,
              url: file.fileUrl
            }
          })
        }
        // console.log('执行到===433')
        // contractAttachmentDetailVos 合同附件
        if (data.contractAttachmentDetailVos && data.contractAttachmentDetailVos.length > 0) {
          this.form.contractEnclosure = data.contractAttachmentDetailVos.map(t => {
            return {
              annexName: t.fileName, // 附件名称
              confidentialityLevel: t.confidentialityLevel, // 保密级别
              contractAttachmentLink: t.contractAttachmentLink, // 合同附件id
              contractAttachmentStatus: '1', // 附件状态
              needFile: t.needFile, // 是否需要存档
              orderNo: '', // 序号
              usageSealType: t.usageSealType, // 用章类型
              openUrl: t.fileUrl // 下载链接
            }
          })
          this.$refs.contractEnclosure.contractAttachmentLink = data.contractAttachmentDetailVos.map(f => {
            return {
              name: f.fileName,
              url: f.fileUrl
            }
          })
        }
        // console.log('执行到===453')
        // 费用承担信息遍历id保存到push 到this.deptList  把名字
        this.form.templateId = data.processBizInfo.templateId
        this.form.activitiId = data.processBizInfo.activitiId
        this.form.contractNature = this.form.contractBaseInfo.contractNature // '合同性质'
        this.form.incomeExpenditure = this.form.contractBaseInfo.incomeExpenditure // '收支类型'
        this.form.signatureType = this.form.contractBaseInfo.signatureType // '合同签署类型',
        this.activitiModelCode = data.processBizInfo.activitiModelCode
        this.getDemandInformation()
        // console.log('执行到===462')
      } catch (err) {
        console.log(err)
      }
    },

    chageTemplate() {

    },
    async getAgreementHeaad(contractTypechangeParams = {}) {
      try {
        const res = await noAgreement({
          processType: '3',
          ...contractTypechangeParams
        })
        const stepData = res.data[0].processTemplateListByBizIdVo.processTemplateList
        const templateType = stepData.findIndex(item => {
          return item.isPassFlag !== 'N'
        })
        this.steps.stepData = stepData
        if (templateType < 0) this.steps.templateType = templateType
      } catch (error) {
        console.log(error)
      }
    },
    onFormValid(propFiled, vaild, msg) {
      this.$set(this.formErrorMsg, propFiled, msg)
    },
    // 进入页面的合同系统基础数据查询
    async getBaseData() {
      try {
        // 获取下拉枚举
        dropDownItem({ types: '4,5,6,8,10,11,12,17,14,15' }).then(res => {
          res.data.map(item => {
            switch (item.type) {
              case '4':
                this.executeType = item.commonSystemSettingList
                break
              case '5':
                this.contractStateList = item.commonSystemSettingList.map(i => {
                  if (i.systemCode === '1') {
                    i.systemValue = '新建'
                  }
                  return i
                })
                break
              case '6':
                this.appointState = item.commonSystemSettingList
                break
              case '8':
                this.currencyTax = item.commonSystemSettingList
                break
              case '10':
                this.executeWay = item.commonSystemSettingList
                break
              case '11':
                this.chapterType = item.commonSystemSettingList
                break
              case '12':
                this.secretLevel = item.commonSystemSettingList
                break
              case '17':
                this.paymentsname = item.commonSystemSettingList
                break
              // case '14':
              //   this.secretLevel = item.commonSystemSettingList
              //   break
              case '15':
                this.payTypeList = item.commonSystemSettingList
                break
            }
          })
        }).catch(err => {
          console.log(err)
        })

        // 印花税下拉查询
        const res = await getContractCContractStampDutyList()
        this.printingTax = res.data
        // 查询税率列表
        getContractTaxRateList().then(result => {
          this.taxRateOptions = result.data
        })
        this.list = await getQueryalllist({ pid: 0, type: 2 })
        this.executeType = this.list.data.map(item => {
          return {
            systemValue: item.value,
            systemCode: item.code
          }
        })

        // 联动款项名称
        const payName = await getQueryalllist({ pid: 0, type: 3 })
        this.paymentsType = payName.data
      } catch (err) {
        console.log(err)
      }
    },

    deleteBtn(row) {
      this.$confirm('是否要删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.approvalLoading = true
          const res = await magAndSearchContract({ contractBaseId: this.routeParams.contractId })
          if (res.success) {
            this.approvalLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            goBack()
          } else {
            this.approvalLoading = false
            this.$message('删除失败')
            goBack()
          }
          this.isFunBtnBack = true
        })
        .catch(() => {
        })
    },

    saveData() {
      this.$refs['form'].validateField('contractBaseInfo.contractName', err => {
        if (err === '') {
          this.packageApproval()
          const params = this.packageData()
          this.approvalLoading = true
          saveContract(params).then(res => {
            if (res.success && res.status === '0000') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              goBack()
            } else {
              this.$message('保存失败')
              goBack()
            }
            this.approvalLoading = false
          }).catch(err => {
            console.log(err)
            this.approvalLoading = false
            goBack()
          })
          this.isFunBtnBack = true
        } else {
          this.goAnchor('contractBaseInfo.contractName', 'contractBaseInfo')
        }
      })
    },
    goAnchor(dom, str) {
      if (str) {
        this.$refs[str].$refs[dom].$el.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      }
    },
    getselec(data) { // 1合同类型,2签约主体, 3币种  ----弹框选中传值
      switch (this.type) {
        case '1':
          this.$set(this.form.contractBaseInfo, 'contractTypeNameLable', data.parentCategoryName)
          // this.contractBaseInfo.contractTypeNameLable = data.parentCategoryName || '' // 合同大类名称
          this.contractBaseInfo.contractTypeName = data.categoryName || '' // 合同小类名称
          this.contractBaseInfo.contractTypeCode = data.categoryNumber || ''// 合同小类code
          break
        case '2':
          this.contractBaseInfo.contractSubjectName = data.entityName
          this.contractBaseInfo.contractSubjectCode = data.entityCode
          this.contractBaseInfo.contractSubjectDocfscFlag = data.fscFlag
          this.$forceUpdate()
          break
        case '3':
          break
      }
    },
    // 操作审批信息 子组件传过来的数据
    addUserHandler(val) {
      const addUserHandler = []
      val.addUserHandler.forEach(item => {
        addUserHandler.push(
          {
            userName: item.split('_')[0],
            userId: item.split('_')[1],
            deptId: item.split('_')[2],
            isAddFlag: '3',
            currentOperatorType: '3'
          })
      })
      this.addUser[val.activitiId] = addUserHandler
    },

    // 提交信息
    submitData() {
      this.$refs['form'].validate((errorMessage, val) => {
        if (errorMessage) {
          this.packageApproval()
          const peopleNull = this.ProcessOperateRecordVOList.some((item) => {
            return item.processOperateUserVOList.length === 0
          })
          if (!peopleNull) {
            const params = this.packageData()
            this.approvalLoading = true
            submitContract(params).then(res => {
              if (res.success && res.status === '0000') {
                this.approvalLoading = false
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                goBack()
              } else {
                this.approvalLoading = false
                this.$message('提交失败')
              }
            }).catch(err => {
              this.approvalLoading = false
              console.log(err)
              goBack()
            })
            this.isFunBtnBack = true
          } else {
            this.$message('处理人不能为空')
          }
        } else {
          // 调至校验未通过处
          this.submitGoAnchor(val)
        }
      })
    },
    vaildAloneItem(val) {
      // val
      this.$refs['form'].clearValidate(['val'])
      this.$refs['form'].validateField(val, err => {
        console.log(err, '验证查阅人=====459contractBaseInfo.contractExtUsers')
      })
    },
    submitGoAnchor(val) {
      let isFirstOne = ''
      goAnchorSort.forEach(item => {
        Object.keys(val).forEach(i => {
          if (i.includes(item) && !isFirstOne) {
            isFirstOne = i
          }
        })
      })
      this.goAnchor(isFirstOne, isFirstOne.split('.')[0])
    },
    packageData() {
      let contractBaseInfo = {} // 合同基本信息
      let ParamscontractAttachments = {} // 合同附件
      let contractText = {} // 合同文本
      let contractTextAttachments = [] // 合同文本的上传文件数据
      contractBaseInfo = this.$refs.contractBaseInfo.$options.propsData.contractBaseInfo // 获取子组件props数据符合接口
      const contractBaseInfoparamsNeedAssgin = { ...this.$refs.contractBaseInfo.paramsNeedAssgin,
        founderName: this.user.name, founder: this.user.id } // 需要被合并的联想组件的数据
      const {
        certificateNumber, // 证件号
        contractContent, // 合同内容
        contractName, // 合同名称
        contractNature, // 合同性质
        contractNatureName, // 合同性质
        contractNumber, // 合同编号
        contractSerialNumber, // 合同流水编号
        contractStatus, // 合同状态
        contractSubjectCode, // 签约主体code
        contractSubjectName, // 签约主体名称
        contractTypeCode, // 合同小类code
        contractTypeName, // 合同小类型名称
        // currencyName, // 币种名称
        // currencyCode, // 币种code
        effectiveTimeEnd, // 有效期至
        effectiveTimeStart, // 有效期从
        incomeExpenditure, // 收支类型
        incomeExpenditureName, // 收支类型展示
        name, // 名称
        performanceStatus, // 履约状态
        postponed, // 是否沿顺
        relationContractName, // 关联合同名称,
        relationContractNumber, // 关联合同编号，
        signatureType, // 签署类型
        signatureTypeName, // 签署类型展示
        signingTime, // 签订时间
        id,
        violationsResponsibility, // 违约责任
        contractExtUsers // 查阅人
        // agenter // 经办人
      } = this.$refs.contractBaseInfo.$options.propsData.contractBaseInfo
      contractBaseInfoparamsNeedAssgin
      Object.assign(contractBaseInfoparamsNeedAssgin, {
        id,
        certificateNumber, // 证件号
        contractContent, // 合同内容
        contractName, // 合同名称
        contractNature, // 合同性质
        contractNatureName, // 合同性质
        contractNumber, // 合同编号
        contractSerialNumber, // 合同流水编号
        contractStatus, // 合同状态
        contractSubjectCode, // 签约主体code
        contractSubjectName, // 签约主体名称
        contractTypeCode, // 合同小类code
        contractTypeName, // 合同小类型名称
        // currencyName, // 币种名称
        // currencyCode, // 币种code
        effectiveTimeEnd, // 有效期至
        // agenter, // 经办人
        effectiveTimeStart, // 有效期从
        incomeExpenditure, // 收支类型
        incomeExpenditureName, // 收支类型展示
        name, // 名称
        performanceStatus, // 履约状态
        postponed, // 是否沿顺
        relationContractName, // 关联合同名称,
        relationContractNumber, // 关联合同编号，
        signatureType, // 签署类型
        signatureTypeName, // 签署类型展示
        signingTime, // 签订时间
        violationsResponsibility, // 违约责任
        contractExtUsers // 查阅人
      })
      ParamscontractAttachments = this.$refs.contractEnclosure.$options.propsData.contractEnclosures
      contractText = this.$refs.contractText.$options.propsData.contractText
      contractTextAttachments = this.$refs.contractText.contractTextAttachments

      // let contractExtUsersList = []
      // let userNamList = []
      // if (contractBaseInfo.contractExtUsers.length > 0) {
      //   contractExtUsersList = contractBaseInfo.contractExtUsers.map(i => {
      //     return {
      //       userCode: i.match(/\(([^)]*)\)/)[1],
      //       userName: i.split('(')[0],
      //       userType: '1'// 扩展人员类型（1 查阅人
      //     }
      //   })
      // }
      // if (contractBaseInfo.userName.length > 0) {
      //   userNamList = contractBaseInfo.userName.map(v => {
      //     return {
      //       userCode: v.match(/\(([^)]*)\)/)[1],
      //       userName: v.split('(')[0],
      //       userType: '2'// 扩展人员类型（2 使用人
      //     }
      //   })
      // }
      // console.log(contractBaseInfo, 'contractBaseInfo====提交数据----755')

      const contractExtUsersParams = contractBaseInfo.userName.concat(contractBaseInfo.selectContractExtUsers)
      const params = {
        contractBaseInfo: contractBaseInfoparamsNeedAssgin, // 合同基本信息
        sendFscFlag: 'N',
        contractAttachments: ParamscontractAttachments, // 合同附件
        contractText: contractText, // 合同文本
        contractTextAttachments: contractTextAttachments, // 合同上传的文件
        contractCostInfoDatas: [],
        contractCostInfo: {},
        contractExtUsers: contractExtUsersParams,
        contractParticipantInfos: contractBaseInfo.selectContractParticipantInfosCopy, // 交易方
        ProcessOperateRecordVOList: this.ProcessOperateRecordVOList,
        templateId: this.form.templateId,
        activitiId: this.form.activitiId
      }
      params.contractNature = contractNature // '合同性质'
      params.incomeExpenditure = incomeExpenditure // '收支类型'
      params.signatureType = signatureType // '合同签署类型',
      params.contractTypeCode = contractTypeCode // '合同小类型',

      return params
    },
    // 打包审批信息
    packageApproval() {
      const stepData = []
      this.stepData.forEach(item => {
        if (item.dataType === '2') {
          const processOperateUserVOList = []
          item.processOperateUserVOList.forEach(it => {
            processOperateUserVOList.push(
              {
                userId: it.userId,
                isAddFlag: '1'
              }
            )
          })
          stepData.push(
            {
              templateId: item.templateId,
              activitiId: item.activitiId,
              processOperateUserVOList: processOperateUserVOList
            }
          )
        }
      })
      Object.keys(this.addUser).forEach(item => {
        const index = stepData.findIndex(it => {
          return it.activitiId === item
        })
        stepData[index].processOperateUserVOList = stepData[index].processOperateUserVOList.concat(this.addUser[item])
      })
      this.ProcessOperateRecordVOList = stepData
    },

    back() {
      this.$confirm('是否要保存当前页面信息？', {
        distinguishCancelAndClose: true
      })
        .then(() => {
          if (!this.form.contractBaseInfo.contractName.trim()) {
            this.$message({
              message: '标题不能为空',
              type: 'warning'
            })
            return
          }
          this.saveData()
        })
        .catch(action => {
          if (action === 'cancel') {
            this.isFunBtnBack = true
            goBack()
          }
        })
    },
    // 获取审批信息
    async getDemandInformation() { // 编辑初始获取
      // const obj = {
      //   signatureType: '53', // 合同签署类型 (1：新合同 2：对账/结算单 3：保密协议 ) 待定参数
      //   contractNature: '61', // 合同性质
      //   incomeExpenditure: '74', // 收支类型
      //   processType: '3', // 类型
      //   // contractId: this.$route.params.contractId,
      //   contractTypeCode: this.form.contractBaseInfo.contractTypeCode
      // }
      // const fetStep = { // 查环节图
      //   contractTypeCode: this.$refs.contractBaseInfo.$options.propsData.contractBaseInfo.contractTypeCode, // 合同小类code
      //   contractNature: '61', // 合同性质
      //   incomeExpenditure: '74', // 收支类型
      //   taxTotalAmount: '', //
      //   signatureType: '53' // 用章类型
      // }
      // this.getAgreementHeaad(fetStep) // 选择合同类型的时候需要加参数重新获取头部环节

      const res = await noAgreement({
        contractId: this.routeParams.contractId,
        processType: '3'
      })
      // console.log(res, '无需求的res')
      // contractChangeSteps = res.data[0]

      this.steps.stepData = res.data[0].processTemplateListByBizIdVo.processTemplateList
      const templateTypeList = this.steps.stepData.map(i => {
        return i.isPassFlag
      })
      const templateType = templateTypeList.lastIndexOf('Y')
      // console.log(templateType, 'templateType===945')
      this.steps.templateType = templateType

      const parmas = {
        // templateParam: obj,
        // demandDept: this.form.contractBaseInfo.demandDeptId,
        // businessDirector: this.form.contractBaseInfo.businessDirectorId,
        // agenter: this.form.contractBaseInfo.agenterId
        templateParam: { activitiModelCode: this.activitiModelCode },
        contractId: this.routeParams.contractId
      }

      queryContractActivityUserInfoNoDemandId(parmas).then((result) => {
        this.stepData = result.data
        this.approvalLoading = false
      }).catch((err) => {
        console.log(err)
        this.approvalLoading = false
      })
    },
    updataActivePerson(objFlag) {
      // console.log(objFlag, 'objFlag')
      if (objFlag.isChangeContract) {
        // 合同变更需要更新头部环节
        const fetStep = { // 查环节图
          contractTypeCode: objFlag.contractTypeCode, // 合同小类code
          contractNature: '61', // 合同性质
          incomeExpenditure: '74', // 收支类型
          taxTotalAmount: '', //
          signatureType: '53' // 用章类型
        }
        this.getAgreementHeaad(fetStep) // 选择合同类型的时候需要加参数重新获取头部环节
      }
      const templateParam = {
        processType: '3',
        signatureType: '53', // 合同签署类型 (1：新合同 2：对账/结算单 3：保密协议 ) 待定参数
        contractNature: '61', // 合同性质
        incomeExpenditure: '74', // 收支类型
        contractTypeCode: objFlag.contractTypeCode // 合同类型
        // contractId: this.routeParams.contractId,
        // processType: '3'
      }
      const parmas = {
        templateParam,
        demandDept: objFlag.demandDept,
        agenter: objFlag.agenter,
        businessDirector: objFlag.businessDirector
      }
      // 选择合同类型获取审批信息
      queryContractActivityUserInfoNoDemandId(parmas).then((result) => {
        this.stepData = result.data
        this.approvalLoading = false
      }).catch((err) => {
        console.log(err)
        this.approvalLoading = false
      })
    }

  }

}
</script>

<style lang="scss" scoped>
#agreementContractEdit{
  padding-left: 10px;
  padding-right: 10px;
  // background: #ffffff;
  @media screen and (max-width: $small-adaptation) {
    /deep/.el-input__inner {
      font-size: 12px;
      line-height: 32px;
      height: 32px !important;
    }
    /deep/.el-form-item__label {
      font-size: 12px;
      line-height: 36px;
      height: 36px !important;
    }
  }
.buttonBox {
    display: flex;
    justify-content: center;
    padding: 40px 0px 90px;
    .return-button{
      display:inline-block;
      width: 96px;
      height: 32px;
      line-height: 9px;
      margin: 0px 30px;
      text-align: center;
      border: 1px solid #dfdfdf;
      border-radius: 8px;
      background: #ffffffff;
      cursor: pointer;
      font-size: 14px;
      color: #666666;
      @media screen and (max-width: 1440px){
        font-size: 12px;
      }
      &:hover{
        border:1px solid #cbfaee;
        background-color: #e1faf6;
        color: #2EC09A;
      }
    }
    .agree-button{
      display:inline-block;
      width: 96px;
      height: 32px;
      line-height: 10px;
      text-align: center;
      background: #2EC09A;
      border-radius: 8px;
      margin: 0px 30px;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      @media screen and (max-width: 1440px){
        font-size: 12px;
      }
      &:hover{
          background-color: #45c7a4;
      }
    }
    .delete-button{
      display:inline-block;
      width: 96px;
      height: 32px;
      line-height: 10px;
      text-align: center;
      // border: 1px solid #E44F4F;
      border-radius: 8px;
      margin: 0px 30px;
      font-size: 14px;
      // color: #E44F4F;
      // background: #ffffffff;
      cursor: pointer;
      background: #fc4040;
      color: #ffffff;
      &:hover{
       background-color: #fc4d4d;
       border:1px solid #ff0000;
      }
      @media screen and (max-width: 1440px){
        font-size: 12px;
      }
    }
     .save-button{
      display:inline-block;
      width: 96px;
      height: 32px;
      line-height: 10px;
      text-align: center;
      border: 1px solid #2EC09A;
      border-radius: 8px;
      margin: 0px 30px;
      font-size: 14px;
      color: #2ad081;
      background: #ffffffff;
      cursor: pointer;
      @media screen and (max-width: 1440px){
        font-size: 12px;
      }
      &:hover{
          background-color: #2EC09A;
          color: #fff;
      }
    }
}
  .demandmainBox{
    margin-top:20px;
    background: white;
    padding: 0 20px;
    .editHeadName{
      padding: 20px 0 12px 0;
      margin: 0 0px 20px 0px;
      border-bottom: 1px solid #dfdfdf;
      text-align: center;
      color: #000;
      font-weight: 600;
      font-size: 14px;
      position: relative;
    }
    .editHeadName span{
      cursor: pointer;
    }
    .editHeadName::after{
      position: absolute;
      content: '';
      display: inline-block;
      height: 2px;
      width: 114px;
      background-color: #2EC09A;
      bottom: -1px;
      left: 50%;
      transform: translate(-57px);
    }
  }
  .baseFlex {
    /deep/.el-form-item__content {
      display: flex;
    }
  }
  .icon-color{
    color: #04B4A5 ;
  }
  .labelLineHeight {
    /deep/.el-form-item__label {
      line-height: 20px !important;
    }
  }
  .bgc-grey {
    padding: 0 10px 1px 0px;
    background-color: #F8F8F8 ;
    margin-bottom: 10px;
  }
  .required {
    /deep/.el-input__inner {
      background-color: #FFF7DE;
    }
    /deep/.el-textarea__inner {
      background-color: #FFF7DE;
    }
    /deep/.el-input__count-inner {
      background-color: #FFF7DE;
    }
    /deep/.el-textarea {
      .el-input__count {
        background-color: #FFF7DE;
      }
    }
  }
  /deep/.el-select {
    width: 100%;
  }
  /deep/.el-date-editor.el-input {
    width: 100%;
  }
  .baseFlex {
    /deep/.el-textarea__inner {
      min-height: 100px !important;
    }
  }

  /deep/.input-width {
    width: 100%;
  }
  /deep/.el-icon-close-tip {
    display: none;
  }
  .cost {
    /deep/.el-input__inner {
      border:1px solid #ccc;
      line-height: 36px;
      height: 36px !important;
      @media screen and (max-width: $small-adaptation) {
        line-height: 32px;
        height: 32px !important;
      }
      &:hover {
        border-color: #c0c4cc;
      }
      &:focus {
      border-color: #2EC09A
      }

    }
  }
  /deep/.el-autocomplete {
    width: 100%;
  }
  .noneFil {
    /deep/.el-upload-list {
      display: none;
    }
  }
  /deep/.el-form-item__label:before {
    display: none;
  }
}
</style>
