<template>
  <div class="page-home">
    <div :class="{'fixation':(['05','16'].indexOf(activitiId)===-1)}">
      <div class="fixation-before"></div>
      <link-index
        class="fixation-content"
        :steps="steps"
        :template-type="parseInt(demandStageId)-1"
        @chageTemplate="chageTemplate"
      />
      <!--<workflow-steps class="fixation-content" :current-budget-amount="currentBudgetAmount" :demand-system-id="demandSystemId" />-->
    </div>
    <!--<div v-if="processType === '2'" class="m-t-40">
      <workflow-check @statusTransmit="getAcceptanceCode" />
    </div>-->
    <!--<span
      v-clipboard:copy="locationUrl"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
      class="workflow-tab-copy"
    >
      <i :style="{backgroundImage: 'url('+copySvg+')'}"></i>
      复制链接
    </span>-->
    <!--<div v-if="showArrow">左</div>-->
    <el-card class="workflow-tab">

      <div v-if="demandUserList.length>0" class="workflow-tab-title">
        <span>当前环节处理人：</span>
        <div :class="['workflow-tab-name',{'workflow-tab-popper-hover':demandUserListLength>16}]">{{ demandUserList.length>0?demandUserList.join(','):'' }}
          <div v-if="demandUserListLength>16 " class="workflow-tab-popper">
            <p v-for="(item,index) in demandUserList" :key="index">{{ item }}</p>
          </div>
        </div>
      </div>
      <div v-if="demandCode" class="workflow-tab-demandCode">
        <span>需求编号：</span><span style="color:#2EC09A">{{ demandCode }}</span>
      </div>

      <el-tabs v-model="activeName" :class="{'changeTransform':tabs.length<3}" @tab-click="changeTab">
        <el-tab-pane v-for="(item,index) in tabs" :key="index" :label="item.requirementTabName" :name="index.toString()" class="mt-30">
          <workflow-requirement-new
            v-if="item.demandStageId ==='1' "
            :save-action="isReuirementGoToSave"
            @statusTransmit="getTemplateId"
            @saveButton="setSaveButton"
            @clickSaveBtn="clickSave"
            @currentBudgetAmount="updateSteps"
            @saveFalg="setSaveFalg"
            @setDownTemplateType="setCooperationType"
            @setDemandUser="getDemandUserList"
          />
          <div
            v-if="item.demandStageId ==='2'"
            class="mt-30"
          >
            <workflow-provider
              :save-action="isProviderGoToSave"
              :url="urlForProvider"
              :activiti-id="activitiId"
              :security-type="securityCooperationType"
              @statusTransmit="getProviderTemplateId"
              @tabName="getProviderTabName"
              @editable="providerEditable"
              @clickSaveBtn="clickSave"
              @saveButton="setSaveButton"
              @partnerStatus="setPartnerStatus"
              @saveFalg="setSaveFalg"
              @setDemandUser="getDemandUserList"
              @chageTemplate="chageTemplate"
            />
          </div>
          <contract-approval
            v-if="demandStageId ==='3' && contractIsEdit && (activeName === index.toString())"
            :save-action="isContractSave"
            :is-edit="item.isEdit"
            :props-contract-id="item.id"
            @getTemplateData="getTemplateDataObj"
            @setDemandUser="getDemandUserList"
          />
          <card-contract-detail
            v-if="demandStageId ==='3' && !contractIsEdit && (activeName === index.toString())"
            :props-contract-id="item.id"
            @setDemandUser="getDemandUserList"
          />
        </el-tab-pane>
      </el-tabs>
      <div v-if="showTip " style="text-align: center;line-height: 200px;">无查看权限</div>
    </el-card>
  </div>
</template>

<script>
import { getProcessTemplate, getProcessTemplateC, queryContractBaseInfoList, queryParam } from '@/api/workflow'
import LinkIndex from '@/components/Steps/linkIndex'
// import ContractApproval from '@/views/error-page/contract-approval'
import { Message } from 'element-ui'
import {
  // WorkflowCheck,
  WorkflowProvider,
  WorkflowRequirementNew,
  ContractApproval,
  CardContractDetail
  // WorkflowSteps
} from '@/views/workflow/components'
import {
  getDocPermission, getDocPermissionContract, queryContractPresentPersonnelInfoById
} from '@/api/requirementManagement'
import copySvg from '@/assets/images/copy.svg'
export default {
  name: 'Workflow',
  components: {
    // WorkflowCheck,
    WorkflowProvider,
    WorkflowRequirementNew,
    LinkIndex,
    ContractApproval,
    CardContractDetail
  },
  data: vm => ({
    showArrow: false,
    tabs: [],
    ContractBaseInfoList: [],
    contractSave: false,
    approvelStatus: '',
    activeNames: {
      '1': 'requirement',
      '2': 'provider',
      '3': 'contract',
      '4': 'contract1'

    },
    requirementTabNames: {
      '1': '需求发起（进行中）',
      '2': '合作方引入（进行中）',
      '3': '合同审批（进行中）',
      '4': 'payment',
      '6': '需求发起（已完成）',
      '7': '合作方引入（已完成）',
      '8': '合同审批（已完成）'
    },
    contractIsEdit: false,
    demandStageId: '1',
    steps: [],
    handler: false,
    partnerStatus: '',
    currentUserIn: false,
    demandCode: '',
    demandSystemId: '',
    currentBudgetAmount: '',
    saveButton: false,
    saveMark: '', // 需求的activitiId
    currentUser: [],
    activitiId: '', // 需求的templateCode
    copySvg: copySvg,
    processType: vm.$route.query.processType || '1',
    requirementTemplateCode: '', // 发起需求流程当前环节值，当前环节 01需求申请 02专业评审 03商务评估 04商务分配 05合作方选择 06会签 07主管审批 08发起验收 09验收审批10合作评价
    providerTemplateId: '', // 合作方流程当前环节id
    acceptanceTemplateId: '', // 验收流程当前环节id
    providerTabName: '',
    requirementTabName: '',
    activeName: '0',
    isProviderEditable: false,
    isClickSaveBtn: true,
    isProviderGoToSave: false,
    isReuirementGoToSave: false,
    isContractGoToSave: false,
    isContractSave: false,
    urlForProvider: '',
    demandUserList: [],
    demandUserListLength: 0,
    demandUserListShow: false,
    locationUrl: location.href,
    isSaveFalg: true,
    securityCooperationType: ''
  }),
  computed: {
    stepActiveId() {
      switch (this.processType.toString()) {
        case '1':
        case '4':
        case '5':
          return this.requirementTemplateCode
        case '2':
        case '3':
          return this.acceptanceTemplateId
        default:
          return ''
      }
    },
    showTip() {
      return this.tabs.length <= 0
    }

  },
  watch: {

    /* isShowProvider(nv, ov) {
      this.activeName = nv ? 'provider' : 'requirement'
    }*/
  },
  async created() {
    let { id, R, demandStageId, contractId, partnerId } = { ...this.$route.query }
    if (!this.$route.query.demandStageId) {
      await queryParam({ id, R, demandStageId, contractId, partnerId }).then(result => {
        id = result.data.id
        R = result.data.R
        demandStageId = result.data.demandStageId
        contractId = result.data.contractId
        partnerId = result.data.partnerId
        this.$router.push({ path: this.$route.path, query: { id, R, demandStageId, contractId, partnerId } })
      })
    }
    this.demandStageId = this.$route.query.demandStageId

    this.contractIsEdit = this.$route.query.demandStageId === '3' && this.$route.query.isEdit
    this.demandCode = this.$route.query.R
    this.changeTabs(this.$route.query.demandStageId)
    this.getSteps()
    this.setRequirementTabName()
    // TODO
  },
  mounted() {

  },
  async beforeRouteEnter(to, from, next) {
    const { id, R, demandStageId, contractId, partnerId } = { ...to.query }
    if (from.path === '/' && to.query.c) {
      let url = ''
      let bizId = id
      if (demandStageId === '3') {
        url = getDocPermissionContract
        bizId = contractId
      } else {
        url = getDocPermission
        bizId = id
      }
      await url({ bizId }).then((result) => {
        const { isAdmin, isBusiness } = { ...result.data }
        if (isBusiness && isAdmin) {
          next()
        }
        if (isBusiness) {
          if (to.name === 'RequirementWorkflow') {
            next()
          } else {
            next({ path: '/requirementManagement/list/workflow', query: { id, R, demandStageId, contractId, partnerId } })
          }
        } else {
          if (isAdmin) {
            if (to.name === 'administratorDetail') {
              next({ query: { id, R, demandStageId, contractId, partnerId } })
            } else {
              next({ path: '/administrator/detail', query: { id, R, demandStageId, contractId, partnerId, approve: '&' } })
            }
          }
        }
        if (!isBusiness && !isAdmin) {
          Message({
            message: '单据无权限查看',
            type: 'warning'
          })
          next({ path: '/requirementManagement/list/', query: { id, R, demandStageId, contractId, partnerId } })
        }
      })
    } else {
      next({ query: { id, R, demandStageId, contractId, partnerId } })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.$route.query.approve && this.isProviderEditable && this.isClickSaveBtn) {
      this.$confirm('是否要保存当前页面信息？', { distinguishCancelAndClose: true, showCancelButton: true, closeOnClickModal: false, closeOnPressEscape: false }).then(() => {
        this.isProviderGoToSave = true
        this.urlForProvider = to.path
      }).catch(action => {
        if (action !== 'close') {
          next()
        }
      })
    } else if (!this.$route.query.approve && !this.isProviderEditable && this.partnerStatus !== '4' && this.handler && this.isSaveFalg && !this.approvelStatus) {
      this.$confirm('是否要保存当前页面信息？', { distinguishCancelAndClose: true }).then(() => {
        if (!this.saveMark) {
          this.isProviderGoToSave = true
        } else {
          this.isReuirementGoToSave = true
        }
      }).catch(action => {
        if (action !== 'close') {
          next()
        }
      })
    } else if (!this.$route.query.approve && this.approvelStatus !== '4' && this.contractSave) {
      this.$confirm('是否要保存当前页面信息？', { distinguishCancelAndClose: true }).then(() => {
        this.isContractGoToSave = true
      }).catch(action => {
        if (action !== 'close') {
          next()
        }
      })
    } else if (this.$route.query.isEdit) {
      this.$confirm('是否要保存当前页面信息？', { distinguishCancelAndClose: true }).then(() => {
        this.isContractSave = true
      }).catch(action => {
        if (action !== 'close') {
          next()
        }
      })
    } else {
      next()
    }
  },
  methods: {
    changeTab(tab, event) {
      const contractId = this.tabs[Number(this.activeName)].id
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, contractId }
      })
      if (this.demandStageId === '3') {
        this.contractIsEdit = false

        if (['1', '3', '5', '7'].indexOf(this.tabs[Number(this.activeName)].approvelStatus) !== -1 && !this.$route.query.approve) {
          queryContractPresentPersonnelInfoById({ contractId }).then(result => {
            this.contractIsEdit = result.data
          }).catch()
        }
        this.getSteps(contractId)
      }
    },
    changeTabs() {
      // 如果是合同审批查询合同审批列表头
      if (this.demandStageId === '3' && !this.contractIsEdit) {
        const params = {
          demandBaseInfoId: this.$route.query.id,
          id: this.$route.query.contractId,
          superAdmin: !!this.$route.query.approve
        }
        queryContractBaseInfoList(params).then(result => {
          this.ContractBaseInfoList = result.data
          this.tabs = result.data.map((item, index) => {
            return this.setTab(index, item.approvelStatus, item.id)
          })
        })
      } else {
        this.tabs.push(this.setTab())
      }
    },
    // 设置tab值
    setTab(index, value, id) {
      const tab = {
        demandStageId: this.demandStageId,
        approvelStatus: value || '',
        requirementTabName: this.requirementTabNames[ this.demandStageId]

      }

      tab.isEdit = value && !this.$route.query.approve ? 'T' : this.$route.query.isEdit

      if (this.demandStageId === '1' && this.saveMark === '4') {
        tab.requirementTabName = '需求发起（已完成）'
      }
      if (this.demandStageId === '2' && this.partnerStatus === '4') {
        tab.requirementTabName = '合作方引入（已完成）'
      }
      if (this.demandStageId === '3' && (value === '4')) {
        tab.requirementTabName = '合同审批（已完成）'
      }
      if (this.demandStageId === '3') {
        tab.id = id
      }
      return tab
    },
    setRequirementTabName() {
      if (this.saveMark && this.demandStageId === '1' && this.saveMark === '4') {
        this.requirementTabName = this.requirementTabNames['6']
        return
      }
      if (this.partnerStatus && this.demandStageId === '2' && this.partnerStatus === '4') {
        this.requirementTabName = this.requirementTabNames['7']
        return
      }
      if (this.approvelStatus && this.demandStageId === '3' && this.approvelStatus === '3') {
        this.requirementTabName = this.requirementTabNames['8']
        return
      }
      this.requirementTabName = this.requirementTabNames[this.demandStageId]
    },
    setCooperationType(val) {
      this.securityCooperationType = val
    },
    setSaveFalg(val) {
      this.isSaveFalg = val
    },
    setPartnerStatus(val) {
      this.partnerStatus = val
    },
    setSaveButton() {
      this.saveButton = true
    },
    clickSave(boolean) {
      this.isClickSaveBtn = boolean
    },
    providerEditable(boolean) {
      this.isProviderEditable = boolean
    },
    getTemplateId(templateId) {
      this.requirementTemplateCode = templateId
    },
    getProviderTemplateId(templateId) {
      this.providerTemplateId = templateId
    },
    getAcceptanceCode(code) {
      this.acceptanceTemplateId = code
    },
    getProviderTabName(name) {
      this.providerTabName = name
    },

    getDemandUserList(value) {
      this.activitiId = value.activitiId || ''
      this.saveMark = value.saveMark || ''
      this.demandSystemId = value.demandSystemId || ''
      this.approvelStatus = value.approvelStatus || ''
      this.contractSave = value.contractSave || ''
      this.demandUserList = []
      if (value.DemandUserList && value.DemandUserList.length > 0) {
        const obj = {}
        this.currentUser = []
        const currentUser = []
        const that = this
        this.demandUserList = value.DemandUserList.reduce(function(item, next) {
          if (!obj[next.operatorId]) {
            obj[next.operatorId] = true
            item.push(next.operatorName + '-' + next.operatorId)
            currentUser.push(next.operatorId)
          }

          if (next.operatorId === that.$store.state.user.user.id) {
            that.handler = true
          }

          return item
        }, [])
        this.currentUser = JSON.parse(JSON.stringify(currentUser))
        this.demandUserListLength = this.demandUserList.join(',').length
      }
      if (this.demandStageId === '1' && this.saveMark === '4') {
        this.tabs[this.activeName].requirementTabName = '需求发起（已完成）'
      }
      if (this.demandStageId === '2' && this.partnerStatus === '4') {
        this.tabs[this.activeName].requirementTabName = '合作方引入（已完成）'
      }
      if (this.demandStageId === '3' && this.approvelStatus === '4') {
        this.tabs[this.activeName].requirementTabName = '合同审批（已完成）'
      }

      this.currentUserIn = true
    },
    getRequirementTabName(name) {
      this.requirementTabName = name
    },
    changePopper() {
      this.demandUserListShow = true
    },
    updateSteps(val) {
      this.currentBudgetAmount = val
    },
    chageTemplate(params) {
      const demandStageId = params
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, demandStageId }
      })
      this.contractIsEdit = this.$route.query.demandStageId === '3' && this.$route.query.isEdit
      this.demandStageId = params
      this.processType = params

      this.tabs = []
      this.activeName = '0'
      this.changeTabs(params)
      this.getSteps()
    },

    getTemplateDataObj(val) {
      // 查环节图

      this.templateData = val
      this.getSteps()
    },
    // 获取步骤数据
    async getSteps(id) {
      const urls = {
        '1': getProcessTemplate,
        '2': getProcessTemplate,
        '3': getProcessTemplateC
      }
      // const demandStageId = this.$route.query.isEdit === 'G' || this.$route.query.isEdit === 'C' ? 'contract-minor-mistake' : this.demandStageId
      const params = {
        demandId: this.$route.query.id,
        processType: this.demandStageId,
        partnerId: this.$route.query.partnerId,
        contractId: id || this.$route.query.contractId,
        ...this.templateData

      }
      const res = await urls[params.processType](params)
      res.data.forEach((item, index) => {
        if (!this.$route.query.contractId && !this.$route.query.isEdit && item.isPassFlag === 'Y' && index === 2) {
          item.isPassFlag = 'N'
        }
      })
      this.steps = res.data
    }
  }

}

</script>

<style lang="scss" scoped>
.mt-30{
  margin-top: 30px;;
}
  .changeTransform /deep/ .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
  /deep/ .el-tabs__nav-scroll {
    padding-left: 20px;
  }
  /deep/.el-tabs__item{
    padding: 0 140px;
  }
  /deep/.el-tabs__item.is-active {
    color: #000;
    font-weight: 600;
  }
  /deep/.el-tabs__header {
     margin: 0;
     .el-tabs__nav-wrap{
       /*@media screen and (max-width: 1680px){
          padding-right:50px;
        }*/
        padding: 0 290px 0 280px;

        .el-tabs__nav-next{
          margin-right:270px;
          color: #2EC09A;
        }
        .el-tabs__nav-prev{
          margin-left:260px;
          color: #2EC09A;
        }
        /deep/.el-icon-arrow-left,/deep/.el-icon-arrow-right{
          border-radius: 50%;
          background: #2EC09A;
          color: #fff;
          padding: 2px;
        }
     }

  }
  /deep/.el-tabs__nav-wrap::after {
    height: 1px;
  }
  /deep/.el-tabs__item:hover {
    color: #000;
    font-weight: 600;
  }
  /deep/.el-card__body{
    padding:0;

  }
  /deep/.el-tabs__item{
    height:50px;
    line-height: 50px;
  }
  .workflow-tab{
    position:relative;
    font-size: 14px;
    margin-top:20px;
    //white-space: nowrap;
    font-weight: normal;
    .workflow-tab-title{
      z-index:100;
      position:absolute;
      top:17px;
      right:20px;
      color: #666666;
      .workflow-tab-popper-hover:hover{
        cursor: default;
        div{
          display: block;
        }
      }
      .workflow-tab-popper{
        color:#000;
        display: none;
        width: 180px;
        line-height: 26px;
        padding: 6px;
        white-space: break-spaces;
        word-break: break-all;
        position: absolute;
        top: 28px;
        left: 80px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
        z-index: 100;
        &::before{
          content: '';
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid #fff;
          position: absolute;
          top: -10px;
          left: 86px;
        }
        p{
          border-bottom: 1px dotted #ebeef5;
        }
      }
    }
    .workflow-tab-demandCode{
        position: absolute;
        top: 18px;
        left: 34px;
        z-index: 200;
    }
    .workflow-tab-name{
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 135px;
        color:#000;
        vertical-align: bottom;
        white-space: nowrap;
      }

  }
  .page-home{
    position: relative;
    .fixation{
      margin-top:-10px;
      position: sticky;
      top:0;
      z-index: 1000;
      .fixation-before{
        height: 10px;
        background-color: #f8f8f8;
      }
      .fixation-content{
        box-shadow: 0 4px 10px 2px rgba(0,0,0,0.04);
      }
    }
    /*/deep/.el-tabs__nav-wrap{
      display: flex;
      justify-content: center;
      .el-tabs__nav-scroll{
        width: 70%;
      }
    }*/
/*.workflow-tab-copy{
      position: absolute;
      top: -28px;
      right: 20px;
      z-index: 100;
      border: 1px solid #2AD081;
      border-radius: 4px;
      width: 80px;
      height: 28px;
      //line-height: 28px;
      //text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #2AD081;
      cursor: pointer;
      i{
        background-repeat:no-repeat;
        background-size: cover;
        width: 11px;
        height: 12px;
        display: inline-block;
        margin-right: 3px;
      }
    }*/
  }

</style>
