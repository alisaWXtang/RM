<template>
  <div id="contractBaseInfo">
    <!-- <div ref="sunref" class="sunrefs">asdasdf</div> -->
    <el-row :gutter="10">
      <el-col :span="11">
        <el-row class="baseFlex">
          <el-form-item
            ref="contractBaseInfo.contractName"
            prop="contractBaseInfo.contractName"
            label="合同名称："
            class="flex-grow-1"
            :show-message="false"
          >
            <el-tooltip
              :disabled="!formErrorMsg['contractBaseInfo.contractName']"
              effect="dark"
              :content="formErrorMsg['contractBaseInfo.contractName']"
              placement="top-start"
            >
              <el-input v-model="contractBaseInfo.contractName" v-trim placeholder="请输入合同名称" class="required" />
            </el-tooltip>
          </el-form-item>
        </el-row>
        <el-row :gutter="5" class="required">
          <el-col class="baseFlex" :span="12">
            <el-form-item ref="contractBaseInfo.signatureType" prop="contractBaseInfo.signatureType" label="签署类型：" class="flex-grow-1" :show-message="false">
              <el-tooltip :disabled="!formErrorMsg['contractBaseInfo.signatureType']" effect="dark" :content="formErrorMsg['contractBaseInfo.signatureType']" placement="top-start">
                <el-input v-model="contractBaseInfo.signatureTypeName" disabled />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="contractBaseInfo.contractNature" prop="contractBaseInfo.contractNature" label="合同性质：" class="flex-grow-1" :show-message="false">
              <el-tooltip :disabled="!formErrorMsg['contractBaseInfo.contractNature']" effect="dark" :content="formErrorMsg['contractBaseInfo.contractNature']" placement="top-start">
                <el-input v-model="contractBaseInfo.contractNatureName" disabled />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5" class="required">
          <el-col class="baseFlex" :span="12">
            <el-form-item
              ref="contractBaseInfo.contractStatus"
              prop="contractBaseInfo.contractStatus"
              label="合同状态："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-input v-model="contractBaseInfo.contractStatusDisplay" disabled />
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item
              ref="contractBaseInfo.performanceStatus"
              v-trim
              prop="contractBaseInfo.performanceStatus"
              label="履约状态："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-input v-model="contractBaseInfo.performanceStatusDisplay" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5" class="required">
          <el-col class="baseFlex" :span="12">
            <el-form-item
              ref="founder"
              prop="contractBaseInfo.founder"
              label="创建人："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-input class="" :disabled="true" :value="user.name+'('+user.id+')'" />
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="contractBaseInfo.agenter" prop="contractBaseInfo.agenter" label="经办人：" class="flex-grow-1" :show-message="false">
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.agenter']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.agenter']"
                placement="top-start"
              >
                <auto-completes
                  v-model="contractBaseInfo.agenter"
                  :no-clear="false"
                  class="input-width"
                  placeholder="请输入经办人"
                  @idSelect="getAgenterName"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- {{ contractBaseInfo.selectContractParticipantInfos }} -->
        <el-row class="baseFlex">
          <el-form-item
            ref="contractBaseInfo.selectContractParticipantInfos"
            prop="contractBaseInfo.selectContractParticipantInfos"
            label="交易方："
            class="flex-grow-1"
            :show-message="false"
          >
            <el-tooltip
              :disabled="!formErrorMsg['contractBaseInfo.selectContractParticipantInfos']"
              effect="dark"
              :content="formErrorMsg['contractBaseInfo.selectContractParticipantInfos']"
              placement="top-start"
            >
              <el-select
                v-model="contractBaseInfo.selectContractParticipantInfos"
                multiple
                placeholder="请选择"
                popper-class="popperClass"
                @visible-change="handleVisChange"
                @remove-tag="removeTag"
              />
            </el-tooltip>
          </el-form-item>
        </el-row>
        <!-- {{ contractBaseInfo.contractExtUsers }} -->
        <el-row class="baseFlex">
          <el-form-item
            ref=""
            prop=""
            label="查阅人："
            class="flex-grow-1"
            :show-message="false"
          >
            <!-- <el-select
              ref="handleSearch"
              v-model="contractBaseInfo.contractExtUsers"
              multiple
              filterable
              remote
              reserve-keyword
              :multiple-limit="50"
              :remote-method="searcherRemoteMethod"
              placeholder="请输入员工姓名"
              :loading="businessUsersListRemoteLoading"
              @change="searcherUsersListChange"
            >
              <el-option
                v-for="item in searcherRemoteMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-select
              v-model="contractBaseInfo.contractExtUsersNameList"
              clearable
              multiple
              placeholder="请选择员工"
              popper-class="popperClass"
              @clear="clearreadPeopleList"
              @remove-tag="readPeopleRemove"
              @focus="staffVisible = true,staffType = 1"
            />

          </el-form-item>
        </el-row>
        <el-row class="baseFlex">
          <el-form-item ref="" prop="" label="使用人：" class="flex-grow-1" :show-message="false">
            <!-- <el-select
              ref="handleSearch"
              v-model="contractBaseInfo.userName"
              multiple
              filterable
              remote
              reserve-keyword
              :multiple-limit="50"
              placeholder="请输入员工姓名"
              :remote-method="userNameRemoteMethod"
              :loading="businessUsersListRemoteLoading"
              @change="UsersListChange"
            >
              <el-option
                v-for="item in userNameRemoteMethodOptions"
                :key="item.id"
                :label="item.name+'('+item.id+')'"
                :value="item.name+'('+item.id+')'"
              />
            </el-select> -->
            <el-select
              v-model="contractBaseInfo.userNameList"

              multiple
              placeholder="请选择员工"
              popper-class="popperClass"
              @clear="clearUserNameList"
              @remove-tag="userPeopleRemove"
              @focus="staffVisible = true,staffType = 2"
            />
            <!-- @focus="staffVisible = true,staffType = 2" -->
          </el-form-item>
        </el-row>
        <el-row class="baseFlex required">
          <el-form-item
            ref="contractBaseInfo.contractContent"
            prop="contractBaseInfo.contractContent"
            label="合同内容："
            class="flex-grow-1"
            :show-message="false"
          >
            <el-tooltip
              :disabled="!formErrorMsg['contractBaseInfo.contractContent']"
              effect="dark"
              :content="formErrorMsg['contractBaseInfo.contractContent']"
              placement="top-start"
            >
              <el-input
                v-model="contractBaseInfo.contractContent"
                v-trim
                :placeholder="'1.合同标的：2.合同金额：3.合同期限：'"
                class=""
                type="textarea"
                maxlength="1000"
                show-word-limit
              />
            </el-tooltip>
          </el-form-item>
        </el-row>
        <el-row class="baseFlex">
          <el-form-item ref="violationsResponsibility" prop="contractBaseInfo.violationsResponsibility" label="违约责任：" class="flex-grow-1" :show-message="false" maxlength="1000">
            <el-input v-model="contractBaseInfo.violationsResponsibility" v-trim placeholder="请填写合同当事人不履行合同义务或者履行合同义务不符合合同约定而依法应当承担的民事责任（最多1000字）" class="" type="textarea" maxlength="1000" show-word-limit />
          </el-form-item>
        </el-row>
      </el-col>
      <!-- 右边 -->
      <el-col :span="13">
        <el-row :gutter="10">
          <el-col class="baseFlex" :span="12">
            <el-form-item ref="contractSerialNumber" prop="contractBaseInfo.contractSerialNumber" label="合同流水号：" class="flex-grow-1" :show-message="false">
              <el-input v-model="contractBaseInfo.contractSerialNumber" v-trim class="" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="contractNumber" prop="contractBaseInfo.contractNumber" label="合同编号：" class="flex-grow-1" :show-message="false">
              <el-input v-model="contractBaseInfo.contractNumber" v-trim placeholder="如果要使用交易方的合同编号，请填写！" class="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="required">
          <el-col class="baseFlex " :span="12">
            <el-form-item
              ref="contractBaseInfo.incomeExpenditure"
              prop="contractBaseInfo.incomeExpenditure"
              label="收支类型："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.incomeExpenditure']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.incomeExpenditure']"
                placement="top-start"
              >
                <el-input v-model="contractBaseInfo.incomeExpenditureName" disabled />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item
              ref="contractBaseInfo.contractTypeNameLable"
              prop="contractBaseInfo.contractTypeNameLable"
              label="合同类型："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.contractTypeNameLable']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.contractTypeNameLable']"
                placement="top-start"
              >
                <el-input
                  v-model="contractBaseInfo.contractTypeNameLable"
                  v-trim
                  placeholder="请输入合同类型"
                  class=" "
                  @focus="type='1',visible=true"
                >
                  <i slot="suffix" class="el-icon-search" @click="type='1',visible=true" />
                </el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="baseFlex" :span="12">
            <el-form-item
              ref="contractBaseInfo.effectiveTimeStart"
              prop="contractBaseInfo.effectiveTimeStart"
              label="有效日期从："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-date-picker
                v-model="contractBaseInfo.effectiveTimeStart"
                format="yyyy-MM-dd"
                value-format="timestamp"
                type="date"
                placeholder="选择日期"
                @change="contractBaseInfo.effectiveTimeEnd=''"
              />
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="contractBaseInfo.effectiveTimeEnd" prop="contractBaseInfo.effectiveTimeEnd" label="有效日期至：" class="flex-grow-1" :show-message="false">
              <el-date-picker
                v-model="contractBaseInfo.effectiveTimeEnd"
                format="yyyy-MM-dd"
                value-format="timestamp"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="required">
          <el-col class="baseFlex" :span="12">
            <el-form-item
              ref="contractBaseInfo.supervisor"
              prop="contractBaseInfo.supervisor"
              label="监督人："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.supervisor']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.supervisor']"
                placement="top-start"
              >
                <auto-completes
                  v-model="contractBaseInfo.supervisor"
                  :no-clear="false"
                  class="input-width"
                  placeholder="请输入监督人"
                  @idSelect="getsupervisor"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item
              ref="contractBaseInfo.demandDept"
              prop="contractBaseInfo.demandDept"
              label="需求部门："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.demandDept']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.demandDept']"
                placement="top-start"
              >
                <auto-complete
                  v-model="contractBaseInfo.demandDept"
                  :no-clear="false"
                  query-type="2"
                  class="input-width"
                  placeholder="请输入需求部门"
                  @idSelect="getdemandDept"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- {{ contractBaseInfo.contractSubjectName }} -->
        <el-row :gutter="10" class="required">
          <el-col class="baseFlex" :span="12">
            <el-form-item
              ref="contractBaseInfo.contractSubjectName"
              prop="contractBaseInfo.contractSubjectName"
              label="签约主体："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.contractSubjectName']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.contractSubjectName']"
                placement="top-start"
              >
                <el-input
                  v-model="contractBaseInfo.contractSubjectName"
                  v-trim
                  placeholder="请输入签约主体"
                  class=""
                  @focus="type='2',visible=true"
                >
                  <i slot="suffix" class="el-icon-search" @click="type='2',visible=true" />
                </el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="contractBaseInfo.postponed" prop="contractBaseInfo.postponed" label="是否顺延：" class="flex-grow-1" :show-message="false">
              <el-tooltip :disabled="!formErrorMsg['contractBaseInfo.postponed']" effect="dark" :content="formErrorMsg['contractBaseInfo.postponed']" placement="top-start">
                <el-select
                  v-model="contractBaseInfo.postponed"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in currencyTax"
                    :key="item.systemCode"
                    :label="item.systemValue"
                    :value="item.systemCode"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="baseFlex labelLineHeight" :span="12">
            <el-form-item
              ref="actualSigningTime"
              prop="contractBaseInfo.actualSigningTime"
              label="实际签订时间："
              class="flex-grow-1 m-l-10"
              :show-message="false"
              label-width="80px"
            >
              <el-date-picker
                v-model="contractBaseInfo.actualSigningTime"
                format="yyyy-MM-dd"
                value-format="timestamp"
                type="date"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="signingTime" prop="contractBaseInfo.signingTime" label="签订时间：" class="flex-grow-1" :show-message="false">
              <el-date-picker
                v-model="contractBaseInfo.signingTime"
                format="yyyy-MM-dd"
                value-format="timestamp"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="required">
          <el-col class="baseFlex " :span="12">
            <el-form-item
              ref="contractBaseInfo.name"
              prop="contractBaseInfo.name"
              label="对方名称："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.name']"
                class="item"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.name']"
                placement="top-start"
              >
                <el-input v-model="contractBaseInfo.name" v-trim placeholder="请输入对方名称" class="" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col class="baseFlex " :span="12">
            <el-form-item ref="contractBaseInfo.certificateNumber" prop="contractBaseInfo.certificateNumber" label="对方证件号：" class="flex-grow-1" :show-message="false">
              <el-tooltip :disabled="!formErrorMsg['contractBaseInfo.certificateNumber']" class="item" effect="dark" :content="formErrorMsg['contractBaseInfo.certificateNumber']" placement="top-start">
                <el-input v-model="contractBaseInfo.certificateNumber" v-trim placeholder="请输入对方证件号" class="" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="10">
          <el-col class="baseFlex labelLineHeight" :span="12">
            <el-form-item
              ref="relationContractName"
              prop="contractBaseInfo.relationContractName"
              label="关联合同名称："
              class="flex-grow-1 m-l-10"
              :show-message="false"
              label-width="80px"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.relationContractName']"
                class="item"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.relationContractName']"
                placement="top-start"
              >
                <el-input
                  v-model="contractBaseInfo.relationContractName"
                  v-trim
                  placeholder="请输入关联合同名称"
                  class=""
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col class="baseFlex labelLineHeight" :span="12">
            <el-form-item ref="relationContractNumber" prop="contractBaseInfo.relationContractNumber" label="关联合同编号：" class="flex-grow-1 m-l-10" :show-message="false" label-width="80px">
              <el-input v-model="contractBaseInfo.relationContractNumber" v-trim placeholder="请输入关联合同编号" class="" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="10">
          <el-col class="baseFlex required" :span="12">
            <el-form-item
              ref="contractBaseInfo.businessDirector"
              prop="contractBaseInfo.businessDirector"
              label="业务负责人："
              class="flex-grow-1"
              :show-message="false"
            >
              <el-tooltip
                :disabled="!formErrorMsg['contractBaseInfo.businessDirector']"
                effect="dark"
                :content="formErrorMsg['contractBaseInfo.businessDirector']"
                placement="top-start"
              >
                <auto-completes
                  v-model="contractBaseInfo.businessDirector"
                  :no-clear="false"
                  class="input-width"
                  placeholder="请输入业务负责人"
                  @idSelect="getIdbusinessDirector"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <Dialog
      :type-code="typeCodeObj"
      :select-type="type"
      :dialog-visible="visible"
      @getMultipleData="getMultipleDataList"
      @changeDialogVisible="isShow"
      @getData="getselec"
    />
    <staff-dialog :select-type="staffType" :dialog-visible="staffVisible" @changeDialogVisible="staffDialogShow" @getStaffData="getStaffData" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Dialog from '@/components/Dialog'
import staffDialog from '@/components/Dialog/components/staffDialog.vue'
import AutoComplete from '@/components/AutoComplete' // 部门查询
import AutoCompletes from '@/components/AutoComplete/index1' // 加人
import { queryUser } from '@/api/utils'
import {
  getBudgetInfo,
  getQueryalllist,
  dropDownItem
} from '@/api/contract'
export default {
  name: 'ContractBaseInfo',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    AutoComplete,
    AutoCompletes,
    staffDialog,
    Dialog
  },
  props: {
    contractBaseInfo: {
      type: Object,
      default: () => {}
    },
    formErrorMsg: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      paramsNeedAssgin: {
        // founderName: this.user.name
        agenter: '',
        agenterName: '',
        supervisor: '',
        supervisorName: '',
        demandDeptName: '',
        demandDept: '',
        businessDirector: '',
        businessDirectorName: ''
      },
      staffType: 1,
      staffVisible: false,
      typeCodeObj: '74',
      type: '', // 弹框的显示
      visible: false,
      businessUsersListRemoteLoading: false,
      executeType: [], // 签署类型-4 { label: '新合同', value: '51' },
      // { label: '对账/结算单', value: '52' }, { label: '保密协议', value: '53' }
      list: [],
      // formErrorMsg: {}, // 表单错误对象
      contractNature: [], // 合同性质 { label: '普通合同', value: '61' }, { label: '框架合同无单价', value: '63' }, { label: '框架合同有单间', value: '62' }
      appointState: [], // 履约状态-6
      searcherRemoteMethodOptions: [], // 查阅人,
      contractStateList: [], // 合同状态-5
      userNameRemoteMethodOptions: [], // 使用人
      currencyTax: [], // 是否类下拉-8
      payTypeList: [{ label: '收入类', value: '1' }, { label: '支出类', value: '2' }, { label: '有收有支', value: '3' },
        { label: '无收无支类', value: '4' }], // 收支类型-15
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7// 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      pickerOptions1: { disabledDate: time => {
        return time.getTime() < this.contractBaseInfo.effectiveTimeStart
      } },
      executeWay: [{ label: '不确定', value: '1' }, { label: '合同附件', value: '2' }, { label: '主合同条款', value: '3' }] // 数据使用协议签署方式-10
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.getBaseData()
  },
  mounted() {
    console.log(this.contractBaseInfo, 'mounted===contractBaseInfo')
  },
  methods: {
    clearUserNameList() {
      // console.log('使用人清空')
      this.form.userName = []
    },
    // 查阅人
    clearreadPeopleList() {
      this.contractBaseInfo.selectContractExtUsers = []
    },
    readPeopleRemove(val) { // 查阅人删除
      const idx = this.contractBaseInfo.selectContractExtUsers.findIndex(v => v.userName === val)
      this.contractBaseInfo.selectContractExtUsers.splice(idx, 1)
    },
    userPeopleRemove(val) { // 使用人删除
      const idx = this.contractBaseInfo.userName.findIndex(v => v.userName === val)
      this.contractBaseInfo.userName.splice(idx, 1)
    },
    staffDialogShow(val) {
      this.staffVisible = val
    },

    getStaffData(item) { // 查阅人传值
      const { contractExtUsersNameList, selectContractExtUsers, userNameList, userName } = this.contractBaseInfo
      if (this.staffType === 1) {
        const tempInfos = item.filter(i => !contractExtUsersNameList.includes(i.name)).map((i) => ({
          userCode: i.id,
          userName: i.name,
          userType: '1'// 扩展人员类型（1 查阅人，2 使用人
        }))
        this.contractBaseInfo.selectContractExtUsers = [
          ...selectContractExtUsers,
          ...tempInfos
        ]
        this.contractBaseInfo.contractExtUsersNameList = this.contractBaseInfo.selectContractExtUsers.map(i => {
          return i.userName
        })
      } else {
        const userPeopleInfos = item.filter(i => !userNameList.includes(i.name)).map((i) => ({
          userCode: i.id,
          userName: i.name,
          userType: '2'// 扩展人员类型（1 查阅人，2 使用人
        }))

        this.contractBaseInfo.userName = [
          ...userName,
          ...userPeopleInfos
        ]
        this.contractBaseInfo.userNameList = this.contractBaseInfo.userName.map(i => {
          return i.userName
        })
        // console.log(this.contractBaseInfo.userName, this.contractBaseInfo.userNameList, 'this.contractBaseInfo.userNameList===690')
      }
    },
    // 进入页面的合同系统基础数据查询
    async getBaseData() {
      try {
        // 获取下拉枚举
        dropDownItem({ types: '4,5,6,8,10,11,12,17,14,15' }).then(res => {
          console.log(res, '536')
          res.data.map(item => {
            switch (item.type) {
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
              case '15':
                this.payTypeList = item.commonSystemSettingList
                break
            }
          })
          console.log(this.appointState)
        }).catch(err => {
          console.log(err)
        })

        // 印花税下拉查询
        // const res = await getContractCContractStampDutyList()
        // this.printingTax = res.data
        // 查询税率列表
        // getContractTaxRateList().then(result => {
        //   console.log(result, '税率')
        //   this.taxRateOptions = result.data
        // })
        this.list = await getQueryalllist({ pid: 0, type: 2 })
        this.executeType = this.list.data.map(item => {
          return {
            systemValue: item.value,
            systemCode: item.code
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    isShow(val) {
      // 获取弹框传过来的信息v type
      this.visible = val
      console.log(val)
    },
    // 交易方多选下拉
    handleVisChange(val) {
      // console.log(this.contractBaseInfo, '739contractBaseInfo.selectContractParticipantInfos')
      if (val) {
        this.type = '4'
        this.visible = true
      }
    },
    async userNameRemoteMethod(query) { // 使用人远程搜索
      if (query !== '') {
        this.businessUsersListRemoteLoading = true
        await queryUser({ keyword: query }).then(result => {
          this.businessUsersListRemoteLoading = false
          this.userNameRemoteMethodOptions = result.data.list
        }).catch(() => {})
      } else {
        this.userNameRemoteMethodOptions = []
      }
    },
    async searcherRemoteMethod(query) { // 查阅人远程搜索
      console.log(query, 'query===查阅人')
      if (query !== '') {
        this.businessUsersListRemoteLoading = true
        await queryUser({ keyword: query }).then(result => {
          this.businessUsersListRemoteLoading = false

          // :label="item.name+'('+item.id+')'"
          // :value="item.name+'('+item.id+')'"

          this.searcherRemoteMethodOptions = result.data.list.map((item) => {
            return {
              label: `${item.name}(${item.id})`,
              value: `${item.name}(${item.id})`,
              id: item.id
            }
          })
        }).catch(() => {})
      } else {
        this.searcherRemoteMethodOptions = []
      }
    },

    async getMultipleDataList(item) { // 交易方传值
      if (!this.isEdit) {
        let tempInfos = item.filter(i => !this.contractBaseInfo.selectContractParticipantInfos.includes(i.name))
        // 把输入框已有的和选中的比较添加新的
        tempInfos = tempInfos.map(i => {
          return {
            companyCode: i.code,
            companyName: i.name
          }
        })
        this.contractBaseInfo.selectContractParticipantInfos = [...this.contractBaseInfo.selectContractParticipantInfosCopy, ...tempInfos].map(i => i.companyName)
        this.contractBaseInfo.selectContractParticipantInfosCopy = [...this.contractBaseInfo.selectContractParticipantInfosCopy, ...tempInfos] // 接口传参格式化
      }
      this.$forceUpdate()
    },
    getselec(data) { // 1合同类型,2签约主体, 3币种  ----弹框选中传值
      switch (this.type) {
        case '1':
          this.$set(this.contractBaseInfo, 'contractTypeNameLable', data.parentCategoryName)
          this.contractBaseInfo.contractTypeName = data.categoryName || '' // 合同小类名称
          this.contractBaseInfo.contractTypeCode = data.categoryNumber || ''// 合同小类code
          this.$emit('updataActivePerson', {
            agenter: this.paramsNeedAssgin.agenter, // 经办人
            businessDirector: this.paramsNeedAssgin.businessDirector, // 业务负责人
            contractTypeCode: this.contractBaseInfo.contractTypeCode, // 合同类型
            demandDept: this.paramsNeedAssgin.demandDept,
            isChangeContract: true
          })
          break
        case '2':
          this.$set(this.contractBaseInfo, 'contractSubjectName', data.entityName)
          this.contractBaseInfo.contractSubjectCode = data.entityCode
          this.contractBaseInfo.contractSubjectDocfscFlag = data.fscFlag
          break
        case '3':
          // this.contractBaseInfo.currencyName = data.currencyName
          // this.contractBaseInfo.currencyCode = data.currencyCode
          break
      }
    },
    // 费用
    getBudgetInfo() {
      getBudgetInfo({ demandId: '7542809539be446cbb8d9fbac9e99931' }).then(result => {
        console.log(result)
      })
    },
    // 经办人
    getAgenterName(val) {
      this.paramsNeedAssgin.agenterName = val.name
      this.paramsNeedAssgin.agenter = val.employeeNumber
      this.$emit('updataActivePerson', {
        agenter: this.paramsNeedAssgin.agenter, // 经办人
        businessDirector: this.paramsNeedAssgin.businessDirector, // 业务负责人
        contractTypeCode: this.contractBaseInfo.contractTypeCode, // 合同类型
        demandDept: this.paramsNeedAssgin.demandDept,
        isChangeContract: false
      })
    },
    // 监督人
    getsupervisor(val) {
      this.paramsNeedAssgin.supervisor = val.employeeNumber
      this.paramsNeedAssgin.supervisorName = val.name
    },
    // 需求部门
    getdemandDept(val) {
      console.log(val, '需求部门', val.value.split('-')[0])
      this.paramsNeedAssgin.demandDeptName = val.value.split('-')[0]
      this.paramsNeedAssgin.demandDept = val.id
      this.$emit('updataActivePerson', {
        agenter: this.paramsNeedAssgin.agenter, // 经办人
        businessDirector: this.paramsNeedAssgin.businessDirector, // 业务负责人
        contractTypeCode: this.contractBaseInfo.contractTypeCode, // 合同类型
        demandDept: this.paramsNeedAssgin.demandDept,
        isChangeContract: false
      })
    },
    // 业务负责人
    getIdbusinessDirector(val) {
      console.log(val, 'val===业务负责人')
      this.paramsNeedAssgin.businessDirector = val.employeeNumber
      this.paramsNeedAssgin.businessDirectorName = val.name
      this.$emit('updataActivePerson', {
        agenter: this.paramsNeedAssgin.agenter, // 经办人
        businessDirector: this.paramsNeedAssgin.businessDirector, // 业务负责人
        contractTypeCode: this.contractBaseInfo.contractTypeCode, // 合同类型
        demandDept: this.paramsNeedAssgin.demandDept,
        isChangeContract: false
      })
    },
    getId() {

    },
    incomeExpenditureChange() {

    },
    removeTag(val) {
      const idx = this.contractBaseInfo.selectContractParticipantInfosCopy.findIndex(c => c.companyName === val)
      this.contractBaseInfo.selectContractParticipantInfosCopy.splice(idx, 1)
      this.$forceUpdate()
    },
    searcherUsersListChange(val) {
      console.log(val)
      this.contractBaseInfo.contractExtUsers = val
      this.$forceUpdate()
      // this.$emit('vaildAloneItem', 'contractBaseInfo.contractExtUsers')
    },
    UsersListChange(val) {
      this.contractBaseInfo.userName = val
      this.$forceUpdate()
    }
  }

}
</script>

<style lang="scss" scoped>
#contractBaseInfo{
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
  .baseFlex {
    /deep/.el-form-item__content {
      display: flex;
    }
    /deep/.el-textarea__inner {
      min-height: 100px !important;
    }
  }
  .labelLineHeight {
    /deep/.el-form-item__label {
      line-height: 20px !important;
    }
  }
}
</style>
<style lang="scss">
.popperClass{
  display: none;
}
</style>
