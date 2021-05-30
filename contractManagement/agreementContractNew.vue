<template>
  <!-- <div id="agreementContract"  v-loading.fullscreen="pageLoading"> -->
  <div id="agreementContract" v-loading.fullscreen="approvalLoading">
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
          @updataFile="updataFile"
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
          class="approvalInformation m-l-7"
          :operatorrecode-data="operatorrecodeData"
          :step-data="stepData"
          :is-admin="isAdmin"
          :page-param="pageParam"
          :operator-total="operatorTotal"
          :other-show-tips="otherShowTips"
          @addUserHandler="addUserHandler"
          @getOperatorrecode="getOperatorrecode"
        />
        <!-- 底部按钮 -->
        <div class="flex-row-center m-t-50 m-b-50">
          <el-button style="padding: 8px 20px; line-height:15px" @click="back">返回</el-button>
          <div>
            <el-button
              type="primary"
              style="padding: 8px 20px; line-height:15px"
              class="m-l-50"
              @click="submitData"
            >提交</el-button>
            <el-button
              class="m-l-50"
              type="primary"
              style="padding: 8px 20px; line-height:15px"
              @click="saveData"
            >保存</el-button>
            <!-- <el-button
              class="m-l-50"
              type="primary"
              style="padding: 8px 20px; line-height:15px"
              @click="updataFile"
            >上传文件</el-button> -->
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ApprovalInformation from '@/components/ApprovalInformation'
import { mapGetters } from 'vuex'
import contractBaseInfo from './components/contractBaseInfo'
import contractText from './components/contractText'
import contractEnclosure from './components/contractEnclosure'
import Steps from '@/components/Steps'
import { goAnchorSort } from './selectEnum'
import goBack from '@/utils/goBack'
import {
  noAgreement,
  // getBudgetInfo,
  getQueryalllist,
  submitContract,
  dropDownItem,
  getContractCContractStampDutyList,
  saveContract,
  getContractTaxRateList,
  queryContractActivityUserInfoNoDemandId
} from '@/api/contract'
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
      contractTypeCode: '',
      demandDept: '',
      pageLoading: false,
      approvalLoading: false,
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
        //   { required: true, message: '交易方不能为空', trigger: ['change', 'blur'] }
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
        'contractText.contractTextAttachmentsls': [
          { required: true, message: '上传合同不能为空', trigger: ['blur', 'change'] }
        ],
        // 'contractText.textNumber': [
        //   { required: true, message: '文本编号不能为空', trigger: ['blur', 'change'] }
        // ],
        'contractText.contractTextAttachmentsFileList': [
          { required: true, message: '上传合同不能为空', trigger: ['blur', 'change'] }
        ],
        // contractTextAttachmentsFileList: [
        //   { required: true, message: '上传合同不能为空', trigger: 'change' }
        // ],
        confidentialityLevel: [
          { required: true, message: '保密级别不能为空', trigger: ['blur', 'change'] }
        ],
        // 'contractEnclosure.confidentialityLevel': [
        //   { required: true, message: '保密级别不能为空', trigger: ['blur', 'change'] }
        // ],
        // 'contractEnclosure.usageSealType': [
        //   { required: true, message: '用章类型不能为空', trigger: ['blur', 'change'] }
        // ],
        usageSealType: [
          { required: true, message: '用章类型不能为空', trigger: ['blur', 'change'] }
        ],
        'contractText.usageSealType': [
          { required: true, message: '用章类型不能为空', trigger: ['blur', 'change'] }
        ],
        // 'contractEnclosure.needFile': [
        //   { required: true, message: '需要存档不能为空', trigger: ['blur', 'change'] }
        // ],
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
      steps: {
        stepData: [],
        templateType: 0
      },
      templateId: '',
      activitiId: '',
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
          contractExtUsersNameList: [], // 查阅人v-modol
          selectContractExtUsers: [], // 查阅人处理数据
          userName: [], // 使用人处理数据
          userNameList: [], // 使用人v-model
          demandDept: '',
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
          relationContractName: '' // 关联合同名称

        },
        contractText: {
          usageSealType: '', // 用章类型
          textName: '', // 文本名称
          textStatus: '1', // 文本状态
          textStatusDisplay: '新建',
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
    ])
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
    this.getBaseData()
    this.getAgreementHeaad()
    // 获取审批信息
    this.getDemandInformationFirstTime()
    // this.pageLoading
  },
  methods: {
    chageTemplate() {

    },
    async getAgreementHeaad(contractTypechangeParams = {}) {
      // 获取头部
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
    saveData(str) {
      this.$refs['form'].validateField('contractBaseInfo.contractName', err => {
        if (err === '') {
          this.packageApproval()
          const params = this.packageData()
          this.approvalLoading = true
          saveContract(params).then(res => {
            if (res.success && res.status === '0000') {
              this.approvalLoading = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              goBack()
            } else {
              this.approvalLoading = false
              this.$message('保存失败')
              goBack()
            }
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
    vaildAloneItem(val) {
      // val
      this.$refs['form'].validateField(val, err => {
        console.log(err, '验证查阅人=====459contractBaseInfo.contractExtUsers')
      })
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
    updataFile() {
      console.log('888888888888888888')
      this.$refs['form'].validateField('contractText.contractTextAttachmentsls', err => {
        console.log(err, '466')
      })
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
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.approvalLoading = false
                goBack()
              } else {
                this.$message('提交失败')
                this.approvalLoading = false
              }
            }).catch(err => {
              console.log(err)
              this.approvalLoading = false
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
        violationsResponsibility, // 违约责任
        contractExtUsers // 查阅人
        // agenter // 经办人
      } = this.$refs.contractBaseInfo.$options.propsData.contractBaseInfo
      contractBaseInfoparamsNeedAssgin
      Object.assign(contractBaseInfoparamsNeedAssgin, {
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
      // console.log(this.form, 'asdf')
      const contractExtUsersParams = contractBaseInfo.userName.concat(contractBaseInfo.selectContractExtUsers)

      const params = {
        contractBaseInfo: contractBaseInfoparamsNeedAssgin, // 合同基本信息
        sendFscFlag: 'N',
        contractAttachments: ParamscontractAttachments, // 合同附件
        contractText: contractText, // 合同文本
        contractTextAttachments: contractTextAttachments, // 合同上传的文件
        contractCostInfoDatas: [],
        contractCostInfo: {},
        // contractExtUsers: contractExtUsersList.concat(userNamList),
        contractExtUsers: contractExtUsersParams,
        contractParticipantInfos: contractBaseInfo.selectContractParticipantInfosCopy, // 交易方
        ProcessOperateRecordVOList: this.ProcessOperateRecordVOList,
        templateId: this.templateId,
        activitiId: this.activitiId
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
    // 首次进来获取审批信息里面的人
    async getDemandInformationFirstTime() {
      const res = await queryContractActivityUserInfoNoDemandId({
        templateParam: { processType: '3' }
      })
      this.stepData = res.data
    },
    getOperatorrecode() {

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
#agreementContract{
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
