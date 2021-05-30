<template>
  <div id="contractManagementSearch">
    <el-card class="serach-card">
      <el-form
        ref="requestForm"
        :model="requestForm"
        label-suffix="："
        class="serach-from"
        label-width="95px"
      >
        <!--第一行-->
        <div class="m-b-20 flex justify-content-between ">
          <ul class="tab-group-btn dib">
            <li
              v-for="item in demandStageData"
              :key="item.id"
              :class="{'active':activedLi(item)}"
              @click="switchDemandStage(item.id)"
            >{{ `${item.label}` }}{{ item.Number!==null?`(${item.Number})`:'' }}</li>
          </ul>
          <!-- :class="{'active':requestForm.demandStageId===item.id}" -->

          <div class="title-button">
            <!-- <el-button type="primary" size="small" @click="godDetail()"> -->

            <el-button type="primary" size="small" @click="goNewAgreeContract()">
              创建合同
            </el-button>
            <!-- excelLoading -->
            <!-- :loading="true" -->
            <el-button type="primary" size="small" @click="getExcel()">
              导出
            </el-button>
            <!-- <el-button type="primary" size="small" :loading="exportLoading" @click="listExport()"> -->
            <!-- <el-button type="primary" size="small">
              导出列表
            </el-button> -->
          </div>
        </div>
        <el-row :gutter="10">
          <div class="header">
            <el-col :span="6">
              <el-form-item label="合同名称" prop="contractName" label-width="85px">
                <el-input
                  v-model="requestForm.contractName"
                  class="input-width"
                  placeholder="请输入合同名称"
                  @keyup.enter.native="clickQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号" prop="contractNumber" label-width="85px">
                <el-input
                  v-model="requestForm.contractNumber"
                  class="input-width"
                  placeholder="请输入合同编号"
                  @keyup.enter.native="clickQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同流水号" prop="contractSerialNumber">
                <el-input
                  v-model="requestForm.contractSerialNumber"
                  class="input-width"
                  placeholder="请输入合同流水号"
                  @keyup.enter.native="clickQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同状态" prop="contractStatus" label-width="85px">
                <el-select
                  v-model="requestForm.contractStatus"
                  multiple
                  placeholder="请选择合同状态"
                  collapse-tags
                  @change="contractStatusChange($event,'contractStatus')"
                >
                  <el-option
                    v-for="(item,index) in contractStatusOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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

        <div class="openList fz12" :class="isOpen?'upOpenList':'downOpenList'">
          <el-row :gutter="10">
            <div class="header">
              <el-col :span="6">
                <el-form-item label="签署类型" prop="signatureType" label-width="85px">
                  <el-select
                    v-model="requestForm.signatureType"
                    multiple
                    placeholder="请选择签署类型"
                    class="input-width"
                    collapse-tags
                    @change="contractStatusChange($event,'signatureType')"
                  >
                    <el-option
                      v-for="(item,index) in signatureTypeOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同性质" prop="contractNature" label-width="85px">
                  <el-select
                    v-model="requestForm.contractNature"
                    multiple
                    placeholder="请选择合同性质"
                    class="input-width"
                    collapse-tags
                    @change="contractStatusChange($event,'contractNature')"
                  >
                    <el-option
                      v-for="(item,index) in contractNatureOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收支类型" prop="incomeExpenditure">
                  <el-select
                    v-model="requestForm.incomeExpenditure"
                    multiple
                    placeholder="请选择收支类型"
                    class="input-width"
                    collapse-tags
                    @change="contractStatusChange($event,'incomeExpenditure')"
                  >
                    <el-option
                      v-for="(item,index) in incomeExpenditureOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- ok -->
              <el-col :span="6">
                <el-form-item label="合同类型" prop="contractTypeCode" label-width="85px">
                  <el-select
                    v-model="requestForm.contractTypeCode"
                    multiple
                    class="contractTypeCodeCss"
                    collapse-tags
                    @change="contractStatusChange($event,'contractTypeCode')"
                  >
                    <el-option
                      v-for="(item) in contractTypeCodeOptions"
                      :key="item.categoryId"
                      :label="item.parentCategoryName"
                      :value="item.categoryId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <!-- 展开第二行 -->
          <el-row :gutter="10">
            <div class="header">
              <el-col :span="6">
                <el-form-item label="交易方" prop="companyName" label-width="85px">
                  <el-input
                    v-model="requestForm.companyName"
                    class="input-width"
                    placeholder="请输入交易方"
                    @keyup.enter.native="clickQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="签约主体" prop="contractSubjectName" label-width="85px">
                  <el-input
                    v-model="requestForm.contractSubjectName"
                    class="input-width"
                    placeholder="请输入签约主体"
                    @keyup.enter.native="clickQuery"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="创建人" prop="founder">
                  <auto-completes
                    v-model="requestForm.founder"
                    :no-clear="false"
                    class="input-width"
                    placeholder="请输入创建人"
                    @idSelect="getFounderName"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="创建时间" prop="creatTimePick" label-width="85px">
                  <el-date-picker
                    v-model="requestForm.creatTimePick"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                    range-separator="—"
                    start-placeholder="起始时间"
                    end-placeholder="截止时间"
                    :default-time="['00:00:01', '23:59:59']"
                    :editable="false"
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <!-- 展开第三行 -->
          <el-row :gutter="10">
            <div class="header">
              <el-col :span="6">
                <el-form-item label="经办人" prop="agenter" label-width="85px">
                  <auto-completes
                    v-model="requestForm.agenter"
                    class="input-width"
                    placeholder="请输入经办人"
                    @idSelect="getAgenterName"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="有效期" prop="effectiveTimePick" label-width="85px">
                  <el-date-picker
                    v-model="requestForm.effectiveTimePick"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                    class="input-width"
                    type="daterange"
                    range-separator="—"
                    start-placeholder="起始时间"
                    end-placeholder="截止时间"
                    :default-time="['00:00:01', '23:59:59']"
                    :editable="false"
                  >
                    <!-- value-format="yyyy-MM-dd HH:mm:ss" -->

                  </el-date-picker></el-form-item>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-form>
      <div class="tc m-t-10">
        <el-button type="primary" class="fixed-width" @click="clickQuery">查询</el-button>
        <el-button class=" reset-btn fixed-width" plain @click="clickReset">重置</el-button>
      </div>
    </el-card>

    <el-card class="m-t-20-s card-table">
      <el-table v-loading="tableLoading" :data="requestData" border>
        <el-table-column prop="contractSerialNumber" label="合同流水号" align="center" min-width="180" />
        <el-table-column prop="contractNumber" label="合同编号" align="center" min-width="150" />
        <el-table-column
          prop="contractName"
          label="合同名称"
          show-overflow-tooltip
          align="center"
          min-width="180"
        >
          <template slot-scope="scope">
            <div class="titleinTableBlueText">
              <span
                class="link inTableBlueText"
                type="text"
                @click="goSelect(scope.row)"
              >{{ scope.row.contractName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="founderName" label="创建人" align="center" min-width="150" />
        <el-table-column prop="agenterName" label="经办人" show-overflow-tooltip align="center" min-width="150" />
        <el-table-column prop="demandDeptName" label="需求部门" align="center" min-width="160" show-overflow-tooltip />
        <el-table-column prop="signatureType" label="签署类型" :formatter="signatureTypeFormat" align="center" min-width="160" show-overflow-tooltip />
        <el-table-column prop="contractNature" label="合同性质" :formatter="contractNatureFormat" align="center" min-width="160" show-overflow-tooltip />
        <el-table-column prop="incomeExpenditure" label="收支类型" :formatter="incomeExpenditureFormat" align="center" min-width="160" show-overflow-tooltip />
        <el-table-column prop="dealingInfoList" :formatter="handlePersonFormat" label="当前处理人" align="center" min-width="180" show-overflow-tooltip />
        <el-table-column prop="templateName" label="当前环节" show-overflow-tooltip align="center" min-width="160" />
        <el-table-column prop="taxTotalAmount" label="合同金额" show-overflow-tooltip align="center" min-width="160">
          <template slot-scope="scope"><span>{{ resetTaxTotalAmount(scope.row) }}</span></template>
        </el-table-column>
        <el-table-column prop="companyName" label="交易方" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column prop="contractSubjectName" label="签约主体" show-overflow-tooltip align="center" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" :formatter="createTimeFormat" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column prop="effectiveTimeStart" label="有效期从" :formatter="effectiveTimeStartFormat" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column prop="effectiveTimeEnd" label="有效期至" :formatter="effectiveTimeEndFormat" show-overflow-tooltip align="center" min-width="180" />

        <el-table-column prop="contractStatus" :formatter="handlecontractStatusFormat" label="合同状态" show-overflow-tooltip align="center" min-width="120" />

        <el-table-column prop="contractStatus" label="操作" align="center" min-width="150" fixed="right" class="flex">
          <template slot-scope="scope" class="flex">
            <div class="flex justify-content-center">
              <!-- <div
                v-if="scope.row.contractStatus === '1'||scope.row.contractStatus === '4'||
                  scope.row.contractStatus === '6'"
              > -->
              <!-- ok -->

              <el-button
                v-if="scope.row.btnAuthority.editFlag"
                type="text"
                class="inTablebutton"
                @click="godEdit(scope.row)"
              >编辑</el-button>
              <!-- ok -->

              <el-button
                v-if="scope.row.btnAuthority.deleteFlag"
                class="redbutton"
                type="text"
                @click="deleteBtn(scope.row)"
              >删除</el-button>
              <!-- </div>
              <div v-if="scope.row.contractStatus === '2'"> -->
              <!-- ok -->

              <el-button
                v-if="scope.row.btnAuthority.approveFlag"
                type="text"
                class="inTablebutton"
                @click="approval(scope.row)"
              >审批</el-button>
              <!-- </div> -->
              <!-- <div v-if="scope.row.contractStatus === '3'||scope.row.contractStatus === '5'"> -->
              <!-- v-if="scope.row.btnAuthority.finishFlag" -->
              <!-- <div v-if="scope.row.contractStatus === '3'||scope.row.contractStatus === '5'"> -->
              <!-- <el-button
                type="text"
                class="inTablebutton"
                @click="end(scope.row)"
              >结束</el-button> -->
              <!-- v-if="scope.row.btnAuthority.alterationFlag" -->
              <!-- ok -->
              <el-button
                v-if="scope.row.btnAuthority.alterationFlag"
                type="text"
                class="inTablebutton"
                @click="contractChange(scope.row)"
              >合同变更</el-button>
              <!-- </div>
              <div v-if="scope.row.contractStatus === '7'||scope.row.contractStatus === '9'"> -->
              <!-- v-if="scope.row.btnAuthority.lookOverFlag" -->

              <!-- <el-button
                type="text"
                class="inTablebutton"
                @click="view(scope.row)"
              >查看</el-button> -->
              <!-- </div> -->
              <!-- {{ scope.row.btnAuthority  v-if="scope.row.btnAuthority.cancelFlag"}} -->
              <!-- <div v-if="scope.row.btnAuthority.cancelFlag" class="m-l-10"> -->
              <!-- ok -->
              <el-button
                v-if="scope.row.btnAuthority.cancelFlag"
                type="text"
                class="inTablebutton"
                @click="cancel(scope.row)"
              >撤销</el-button>
              <!-- </div> -->
              <div v-if="returnNullBtn(scope.row.btnAuthority)" class="treeLine"><span> -- </span> </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="tc p-t-20 p-b-20">
        <el-pagination
          :current-page="requestForm.pageParam.currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="requestForm.pageParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handlePrev"
          @next-click="handleNext"
        />
      </div>
      <contract-change-dialog v-if="dialogVisible" ref="contractChanged" @close="closeContract" />

    </el-card>
  </div>
</template>

<script>
import { cancelContract } from '@/api/requirementManagement'
import contractChangeDialog from './components/contractChangeDialog'
import AutoCompletes from '@/components/AutoComplete/index1' // 加人
import moment from 'moment'
import { getcontractmanagelist, magAndSearchContract, getContractCategoryList, contractStatisticsNumber, getcontractmanagelistexcel } from '@/api/contract'
import { contractNatureOptions, contractStatusOptions, signatureTypeOptions, incomeExpenditureOptions } from './selectEnum'
import { mapState } from 'vuex'
import { getcontractalterationflag } from '@/api/contract'
import { cloneDeep, remove } from 'lodash'
export default {
  name: 'ContractManagementChange',
  components: { contractChangeDialog, AutoCompletes },
  data() {
    return {
      demandStageData: [
      ],
      searchedParams: {}, // 点击查询之后form里面的参数，用于导出
      contractTypeCodeOptions: [],
      contractStatusOptions: contractStatusOptions,
      signatureTypeOptions: signatureTypeOptions,
      contractNatureOptions: contractNatureOptions,
      incomeExpenditureOptions: incomeExpenditureOptions,
      requestForm: {},
      currentLinkOptions: [],
      typeOptions: [],
      statusOptions: [],
      tableLoading: false,
      excelLoading: false,
      requestData: [],
      dialogVisible: false,
      total: 0,
      contractTypeCodeOption: [
        {
          label: '全部',
          value: '',
          id: 0
        },
        {
          label: 'A',
          value: 'A',
          id: 1
        },
        {
          label: 'B',
          value: 'A',
          id: 2
        },
        {
          label: 'C',
          value: 'C',
          id: 3
        }
      ],
      isOpen: false,
      pageParam: {
        currentPage: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.contract.contractSearchForm,
      isUp: state => state.contract.requestIsOpen

    })

  },
  created() {
    this.isOpen = this.isUp
    this.requestForm = { ...this.form }
    this.requestForm.pageParam = this.pageParam
    this.clickQuery()
    this.getContractType()
    this.getStatisticsNumber()
    // console.log(this.requestForm, 'this.requestForm===created')
  },
  mounted() {

  },

  methods: {
    activedLi(item) {
      const { contractStatus = [] } = this.requestForm
      if (contractStatus && (contractStatus.length > 1 || contractStatus.length === 0) && item.id === '') {
        return true
      } else if (contractStatus && contractStatus.length === 1) {
        if (contractStatus[0] !== '2' && contractStatus[0] !== '3' && item.id === '') {
          return true
        } else if (item.id === contractStatus[0]) {
          return true
        }
      } else {
        return false
      }
    },
    handlecontractStatusFormat(row) {
      if (row.contractStatus === '1') { return '草稿' } else if (row.contractStatus === '2') { return <span class='inTableBlueText'>待审批</span> } else if (row.contractStatus === '3') { return '已通过' } else if (row.contractStatus === '4') { return <span class='inTableRedText'>已驳回</span> } else if (row.contractStatus === '5') { return '已签订' } else if (row.contractStatus === '6') { return <span class='inTableGreyText'>已撤销</span> } else if (row.contractStatus === '7') { return '已终止' } else if (row.contractStatus === '8') { return '已中止' } else if (row.contractStatus === '9') { return '已结束' } else { return '--' }
    },
    returnNullBtn(row) {
      if (!row.editFlag && !row.deleteFlag && !row.approveFlag && !row.alterationFlag && !row.cancelFlag) {
        return true
      }
      return false
    },
    async getStatisticsNumber() {
      const res = await contractStatisticsNumber({
        flag: '1'
      })
      const list = []
      if (res.data) {
        res.data.forEach(item => {
          const { demandStageName: label, demandStageNumber: Number } = item
          const cell = { label, Number }
          if (label === '全部') {
            cell.id = ''
          } else if (label === '待审批') {
            cell.id = '2'
          }
          list.push(cell)
        })
        list.push(
          {
            label: '已通过',
            Number: null,
            id: '3'
          }
        )
      }
      this.demandStageData = list
      // console.log(res, 'res=319')
    },
    // 合同类型
    async getContractType() {
      const res = await getContractCategoryList({
        parentName: '',
        subName: '',
        inOutTypeCode: '',
        pageSize: 1000,
        pageNum: 1
      })
      //       :label="item.parentCategoryName"
      // :value="item.categoryNumber"
      this.contractTypeCodeOptions = res.data.list
      this.contractTypeCodeOptions.splice(0, 0, {
        parentCategoryName: '全部',
        categoryId: '',
        categoryNumber: ''
      })
    },
    goSelect(scope) {
      if (scope.bizId) {
        // 有需求的编辑或者审批
        if (scope.btnAuthority.editFlag) { // 编辑正确的
          // this.$router.push(
          //   {
          //     path: '/requirementManagement/list/workflow',
          //     query: { id: scope.bizId, R: scope.demandCode, demandStageId: '3', contractId: scope.id,
          //       partnerId: scope.partnerId, isEdit: 'T' }
          //   })
          this.$router.push(
            {
              path: '/contractmanagement/search/contractSearchEdit',
              query: { id: scope.bizId, R: scope.demandCode, demandStageId: '3', contractId: scope.id,
                partnerId: scope.partnerId, isEdit: 'T' }
            })
        } else {
          this.approval(scope) // 没有编辑的都进查看
        }
      } else {
      //  没有需求的编辑或者审批
        if (scope.btnAuthority.editFlag) {
          // 编辑===正确的
          this.$router.push({
            name: 'agreementContractEditOnlyContract',
            params: { contractId: scope.id }
          })
        } else {
          // 详情===正确
          this.$router.push({
            path: '/contractmanagement/search/noIncomeExpenditure',
            query: {
              'contractId': scope.id
            }
          })
        }
      }
    },
    contractStatusChange(val, key) {
      // console.log(val, '589')
      if (val[val.length - 1] === '') {
        this.requestForm[key] = ['']
      } else {
        val.forEach((element, index) => {
          if (element === '') {
            this.requestForm[key].splice(index, 1)
          }
        })
      }
    },
    approval(scope) {
      if (scope.bizId) {
        this.$router.push({ path: '/contractmanagement/search/contractSearchApproval',
          query: { id: scope.bizId, R: scope.demandCode, demandStageId: '3',
            partnerId: scope.partnerId, contractId: scope.id }
        })
      } else {
        this.$router.push({
          // path: '/requirementManagement/list/noIncomeExpenditure',
          path: '/contractmanagement/search/noIncomeExpenditure',
          query: {
            'contractId': scope.id
          }
        })
      }
    },
    godEdit(row) {
      if (row.bizId) {
        this.$router.push(
          {
            path: '/contractmanagement/search/contractSearchEdit',
            query: { id: row.bizId, R: row.demandCode, demandStageId: '3', contractId: row.id,
              partnerId: row.partnerId, isEdit: 'T' }
          })
      } else {
        this.$router.push({
          name: 'agreementContractEditOnlyContract',
          params: { contractId: row.id }
        })
      }
    },
    cancel(row) {
      this.$confirm('是否要撤销', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await cancelContract({ contractBaseId: row.id })
          if (res.success) {
            this.$message({
              message: '撤销成功',
              type: 'success'
            })
            this.getMyRequestList()
          }
        })
        .catch(() => {
        })
    },
    goNewAgreeContract() {
      // this.$router.push('/contractmanagement/agreementContract')search
      this.$router.push('/contractmanagement/search/agreementContract')
    },
    handlePersonFormat(row) {
      if (row.dealingInfoList) {
        const nameArr = row.dealingInfoList.map((item) => {
          return item.userName
        })
        return nameArr.join(', ')
      }
      return '--'
    },
    signatureTypeFormat(val) {
      if (val.signatureType === '51') {
        return '新合同'
      } else if (val.signatureType === '52') {
        return '对账/结算单'
      } else if (val.signatureType === '53') {
        return '协议类'
      } else {
        return '--'
      }
    },
    // 合同性质(61：普通合同 62：框架合同无单价 63：框架合同有单价 )
    contractNatureFormat(val) {
      if (val.contractNature === '61') {
        return '普通合同'
      } else if (val.contractNature === '62') {
        return '框架合同有单价'
      } else if (val.contractNature === '63') {
        return '框架合同无单价'
      } else {
        return '--'
      }
    },
    incomeExpenditureFormat(val) {
      if (val.incomeExpenditure === '71') {
        return '收入类'
      } else if (val.incomeExpenditure === '72') {
        return '支出类'
      } else if (val.incomeExpenditure === '73') {
        return '有收有支'
      } else if (val.incomeExpenditure === '74') {
        return '无收无支'
      } else {
        return '--'
      }

      // 收支类型(71：收入类 72：支出类 73：有收有支 74：无收无支
    },
    deleteBtn(row) {
      this.$confirm('是否要删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await magAndSearchContract({ contractBaseId: row.id })
          if (res.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMyRequestList()
          }
        })
        .catch(() => {
        })
    },
    view(scope) {
      this.$router.push({ path: '/requirementManagement/list/workflow',
        query: { id: scope.bizId, R: scope.demandCode, demandStageId: '3',
          partnerId: scope.partnerId, contractId: scope.id }
      })
    },
    closeContract(flag) {
      this.dialogVisible = false
    },
    contractChange(row) {
      getcontractalterationflag({
        contractNumber: row.contractNumber
      }).then(res => {
        if (res && res.data) {
          this.$message.warning('有变更未完成不可发起变更')
        } else {
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.contractChanged.init(row)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    end() {
      this.$confirm('合同关闭后不能再发起收付款申请，请确认是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    getAgenterName(val) {
      this.requestForm.agenterId = val.employeeNumber
    },
    getFounderName(val) {
      this.requestForm.founderId = val.employeeNumber
    },
    goToDetail() {

    },
    open() {
      this.isOpen = !this.isOpen
      this.$store.commit('contract/setRequestIsOpen', this.isOpen)
    },

    clickReset() {
      const arr = [
        'contractName',
        'contractNumber',
        'contractSerialNumber',
        'contractStatus',

        'signatureType',
        // 第一行

        'companyName',
        // 第二行
        'contractSubjectName', // 合同性质
        'founder', // 合同类型,
        'agenter',
        'agenterId'
      ]
      for (const key in this.requestForm) {
        if (arr.includes(key)) {
          this.requestForm[key] = ''
        }
      }
      this.requestForm.effectiveTimePick = null
      this.requestForm.creatTimePick = null
      this.requestForm.contractStatus = ['']
      this.requestForm.signatureType = ['']
      this.requestForm.contractNature = ['']
      this.requestForm.incomeExpenditure = ['']
      this.requestForm.contractTypeCode = ['']
      this.clickQuery()
    },
    switchDemandStage(value) {
      this.requestForm.contractStatus = [value]
      this.clickQuery()
    },
    approvelStatusFormat(row) {
      // 审批状态1：草稿、2：待审批、3：已驳回、4：已结束 5：已撤销 6：已删除 7：待申请）
      if (row.contractTypeCode === '1') { return '草稿' } else if (row.approvelStatus === '2') { return '待审批' } else if (row.approvelStatus === '3') { return '已驳回' } else if (row.approvelStatus === '4') { return '已结束' } else if (row.approvelStatus === '5') { return '已撤销' } else if (row.approvelStatus === '6') { return '已删除' } else if (row.approvelStatus === '7') { return '待申请' } else { return '--' }
    },
    // 时间格式转换
    createTimeFormat(val) {
      if (!val.createTime) { return '--' }
      const date = new Date(val.createTime)
      const YY = date.getFullYear() + '-'
      const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
      const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return YY + MM + DD + ' ' + hh + mm + ss
    },
    effectiveTimeStartFormat(val) {
      if (!val.effectiveTimeStart) { return '--' }
      return moment(val.effectiveTimeStart).format('YYYY-MM-DD')
    },
    effectiveTimeEndFormat(val) {
      if (!val.effectiveTimeEnd) { return '--' }
      return moment(val.effectiveTimeEnd).format('YYYY-MM-DD')
    },
    clickQuery() {
      this.requestForm.pageParam.currentPage = 1
      this.getMyRequestList()
      this.$store.commit('contract/setcontractSearchForm', this.requestForm)
    },
    async getMyRequestList() {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      this.searchedParams = cloneDeep(this.requestForm)
      try {
        let data = this.resetExcelData(this.searchedParams)
        data = { ...data, pageParam: this.requestForm.pageParam }
        const resData = await getcontractmanagelist(data)
        if (resData.success && resData.data.list) {
          this.requestData = resData.data.list
          this.total = resData.data.total
        }
        this.total = resData.data.total
      } catch (error) {
        console.log(error)
      }
      this.tableLoading = false
    },
    // 分页
    handleSizeChange(val) {
      this.requestForm.pageParam.currentPage = 1
      this.requestForm.pageParam.pageSize = val
      this.getMyRequestList()
    },
    handleCurrentChange(val) {
      this.requestForm.pageParam.currentPage = val
      this.getMyRequestList()
    },
    handlePrev(val) {
      this.requestForm.pageParam.currentPage = val
      this.getMyRequestList()
    },
    handleNext(val) {
      this.requestForm.pageParam.currentPage = val
      this.getMyRequestList()
    },
    getExcel() {
      const params = this.resetExcelData(this.searchedParams)
      try {
        this.excelLoading = true
        getcontractmanagelistexcel(params).then(res => {
          this.excelLoading = false
        }, rej => { this.excelLoading = false })
      } catch (error) {
        this.excelLoading = false
        console.log('getcontractmanagelistexcel==>error', error)
      }
    },
    // 处理查询参数
    resetExcelData(params) {
      let contractTypeCode = []
      contractTypeCode = this.contractTypeCodeOptions.filter(item => {
        return params.contractTypeCode.indexOf(item.categoryId) !== -1
      })
      contractTypeCode = contractTypeCode.map(item => {
        return item.categoryNumber
      })
      const {
        contractStatus = [],
        signatureType = [],
        contractNature = [],
        incomeExpenditure = [],
        // contractTypeCode = [],
        effectiveTimePick = [],
        creatTimePick = [],
        agenterId = '',
        founderId = ''
      } = params
      // 把多选数组里面的空字符串删除
      remove(contractStatus, item => { return item === '' })
      remove(signatureType, item => { return item === '' })
      remove(contractNature, item => { return item === '' })
      remove(incomeExpenditure, item => { return item === '' })
      remove(contractTypeCode, item => { return item === '' })
      // 时间获取
      const effectiveTimeStart = effectiveTimePick && effectiveTimePick[0] ? effectiveTimePick[0] : ''
      const effectiveTimeEnd = effectiveTimePick && effectiveTimePick[1] ? effectiveTimePick[1] : ''
      const createStartTime = creatTimePick && creatTimePick[0] ? creatTimePick[0] : ''
      const createEndTime = creatTimePick && creatTimePick[1] ? creatTimePick[1] : ''
      const data = {
        ...params,
        createStartTime: createStartTime ? createStartTime - 1000 : '',
        createEndTime,
        effectiveTimeStart: effectiveTimeStart ? effectiveTimeStart - 1000 : '',
        effectiveTimeEnd,
        agenter: agenterId,
        founder: founderId
      }
      Object.assign(data, { contractTypeCode })
      return data
    },
    resetTaxTotalAmount(row) {
      const { taxTotalAmount, incomeExpenditure } = row
      if (taxTotalAmount && incomeExpenditure !== '74') {
        return parseInt(taxTotalAmount).toFixed(2)
      } else {
        return '--'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#contractManagementSearch{
  .title-button{
    .el-button{
      height: 100%;
    }
  }
  .contractTypeCodeCss /deep/ .el-select__tags-text{
    display: inline-block;
    max-width: 43px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .contractTypeCodeCss /deep/ .el-tag__close.el-icon-close {
    top: -7px;
  }

  .inTableGreyText {
    color: #999;
    font-size: 14px;
      @media screen and (max-width: $small-adaptation) {
    font-size: 12px;
  }

}
.inTableBlueText {
    font-size: 14px;
    color: #2EC09A;
    user-select: text;
  @media screen and (max-width: $small-adaptation) {
    font-size: 12px;
  }
  }
  .inTableRedText {
  font-size: 14px;
  color: #ea3447;
  @media screen and (max-width: $small-adaptation) {
    font-size: 12px;
  }
}
.titleinTableBlueText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2EC09A;
}
// .inTableBlueText {
//   color: #2EC09A;
//   user-select: text;
// }
  /deep/.el-button--small {
    border-radius: 7px;
    line-height: 4px;
  }
  .input-width{
    width: 100%;
    @media screen and (max-width: $small-adaptation) {
      width: 100%;
    }
  }
  // .fixed-width350{
  //   width: 350px;
  // }
  .upOpenList {
    height: 190px;
  }
  .downOpenList{
    height: 0px;
  }
  .inTablebutton {
    text-decoration: none;
    font-size: 14px;
    color: #2EC09A;
    i {
      text-decoration: none;
    }
    @media screen and (max-width: $small-adaptation) {
      font-size: 12px;
    }
  }
  .redbutton{
    text-decoration: none;
    font-size: 14px;
    color: red;
    i {
      text-decoration: none;
    }
    @media screen and (max-width: $small-adaptation) {
      font-size: 12px;
    }
  }
  .titleinTableBlueText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #2EC09A;
  }
  .text-status-green {
    color: #2EC09A;
  }
  /deep/.el-pagination__editor{
    .el-input__inner {
      font-size: 12px;
      line-height: 28px;
    }
  }
  .el-col{
    height: 57px;
    @media screen and (max-width: $small-adaptation) {
      height: 42px;
    }
  }
  /deep/.el-table .cell {
    white-space: nowrap;
  }
  /deep/.serach-from .el-range-editor--medium .el-range-input{
  @media screen and (max-width: 1440px){
      width: 100%;
    }
  }
  /deep/.el-form-item__label {
    padding: 0 9px 0 0
  }

  /deep/.el-range-input {
    width: 100%;
    overflow: hidden;
  }
  .el-col {
  padding-left: 0 !important;
  @media screen and (max-width: $small-adaptation) {
    padding-right: 0 !important;
  }
}
}
/deep/.el-table{
  .cell {
    height: 21px;
  }
}
.card-table {
  .el-button--medium {
    padding: 0;
  }
}
</style>
