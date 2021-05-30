<template>
  <div id="contractManagementChange" v-loading.fullscreen.lock="fullscreenLoading">
    <el-card class="serach-card">
      <el-form
        ref="requestForm"
        :model="requestForm"
        label-suffix="："
        class="serach-from"
        label-width="95px"
      >
        <!--第一行-->
        <el-row>
          <ul class="tab-group-btn dib" style="margin-bottom:10px">
            <li
              v-for="item in demandStageData"
              :key="item.id"
              :class="{'active':activedLi(item)}"
              @click="switchDemandStage(item.id)"
            >{{ `${item.label}` }}{{ item.Number!==null?`(${item.Number})`:'' }}</li>
          </ul>
        </el-row>
        <el-row :gutter="20">
          <div class="header">
            <el-col :span="6">
              <el-form-item label="变更编号" prop="contractSerialNumber" label-width="87px">
                <el-input
                  v-model="requestForm.contractSerialNumber"
                  placeholder="请输入变更编号"
                  @keyup.enter.native="clickQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号" prop="contractNumber" label-width="87px">
                <el-input
                  v-model="requestForm.contractNumber"
                  placeholder="请输入合同编号"
                  @keyup.enter.native="clickQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="变更方式" prop="changeMode" label-width="87px">
                <el-select
                  v-model="requestForm.changeMode"
                  placeholder="请选择变更方式"
                  collapse-tags
                  multiple
                  @change="contractStatusChange($event,'changeMode')"
                >
                  <el-option
                    v-for="(item) in changeModeOptions"
                    :key="item.id"
                    :label="item.systemValue"
                    :value="item.systemCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="变更状态" prop="contractStatus" label-width="87px">
                <el-select
                  v-model="requestForm.contractStatus"
                  placeholder="请选择变更状态"
                  collapse-tags
                  multiple
                  @change="contractStatusChange($event,'contractStatus')"
                >
                  <el-option
                    v-for="(item) in changapprovelStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <!-- <el-button class="upBtn reset-btn" @click="open">
            <div v-show="isOpen" class="dib">收起</div>
            <div v-show="!isOpen" class="dib">展开</div>
            <i :class="isOpen?'rotate-open el-icon-arrow-down':' el-icon-arrow-down rotate-close'" />
          </el-button> -->
        </el-row>

        <div class="openList p-r-6 fz12">
          <el-row>
            <div class="flex ">
              <span class="screen">当前环节:</span>
              <ul class="lineBreak">
                <li v-for="(item,index) in currentLinkOptions" :key="index" class="fl-lt m-b-10 listStyle m-r-10 links" @click="links(item,index)">{{ item.label }}</li>
              </ul>
            </div>
          </el-row>
          <el-divider />
          <el-row>
            <div class="flex m-t-15">
              <span class="screen">资源类型:</span>
              <ul>
                <li
                  v-for="(item,index) in typeOptions"
                  :key="index"
                  class="fl-lt m-b-10 listStyle m-r-10 resources"
                  @click="resources(item,index)"
                >{{ item.label }}</li>
              </ul>
            </div>
          </el-row>
          <el-divider />
          <el-row>
            <div class="flex  m-t-15">
              <span class="screen">审批状态:</span>
              <ul>
                <li
                  v-for="(item,index) in statusOptions"
                  :key="index"
                  class="fl-lt listStyle m-b-10 m-r-10 approval"
                  @click="approval(item,index)"
                >{{ item.label }}</li>
              </ul>
            </div>
          </el-row>
          <el-divider />
        </div>
      </el-form>
      <div class="tc m-t-10">
        <el-button type="primary" class="fixed-width" @click="clickQuery">查询</el-button>
        <el-button class=" reset-btn fixed-width " plain @click="clickReset">重置</el-button>
      </div>
    </el-card>

    <el-card class="m-t-20-s card-table">
      <el-table v-loading="tableLoading" :data="requestData" border>
        <el-table-column
          prop="contractSerialNumber"
          label="变更编号"
          show-overflow-tooltip
          align="center"
          min-width="160"
        >
          <template slot-scope="scope">
            <div class="titleinTableBlueText">
              <span
                class="link inTableBlueText"
                type="text"
                @click="goSelect(scope.row)"
              >{{ scope.row.contractSerialNumber }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contractNumber" label="合同编号" align="center" min-width="180" />
        <el-table-column prop="contractName" label="合同名称" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column prop="changeMode" label="变更方式" align="center" min-width="150" :formatter="formatterChangeM" />
        <el-table-column prop="founderName" label="申请人" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="taxTotalAmount" label="合同总金额" show-overflow-tooltip align="center" min-width="150">
          <template slot-scope="scope"><span>{{ resetTaxTotalAmount(scope.row) }}</span></template>
        </el-table-column>
        <el-table-column prop="demandDeptName" label="需求部门" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column prop="dealingInfoList" label="当前处理人" :formatter="handlePersonFormat" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column prop="templateName" label="当前环节" show-overflow-tooltip align="center" min-width="150">
          <template slot-scope="scope"><span>{{ scope.row.templateName||'--' }}</span></template>
        </el-table-column>
        <el-table-column prop="companyName" label="交易方" show-overflow-tooltip align="center" min-width="200" />
        <el-table-column prop="contractSubjectName" label="签约主体" show-overflow-tooltip align="center" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" :formatter="createTimeFormat" show-overflow-tooltip align="center" min-width="180" />
        <el-table-column
          prop="contractStatus"
          :formatter="approvelStatusFormat"
          label="变更单状态"
          show-overflow-tooltip
          align="center"
          min-width="130"
        />
        <el-table-column prop="contractStatus" label="操作" align="center" min-width="150" fixed="right">
          <template slot-scope="scope">
            <div class="flex justify-content-center">
              <!-- <div
                v-if="scope.row.contractStatus === '1'||scope.row.contractStatus === '4'||
                  scope.row.contractStatus === '6'"
              > -->
              <!-- v-if="scope.row.btnAuthority.editFlag" -->

              <el-button
                v-if="scope.row.btnAuthority.editFlag"
                type="text"
                class="inTablebutton"
                @click="godEdit(scope.row)"
              >编辑</el-button>
              <!-- v-if="scope.row.btnAuthority.deleteFlag" -->

              <el-button
                v-if="scope.row.btnAuthority.deleteFlag"
                class="redbutton"
                type="text"
                @click="deleteBtn(scope.row)"
              >删除</el-button>
              <!-- </div> -->
              <!-- <div v-if="scope.row.contractStatus === '2'"> -->
              <!-- v-if="scope.row.btnAuthority.approveFlag" -->
              <el-button
                v-if="scope.row.btnAuthority.approveFlag"
                type="text"
                class="inTablebutton"
                @click="view(scope.row,'approve')"
              >审批</el-button>
              <!-- </div> -->
              <!-- v-if="scope.row.contractStatus === '3'||scope.row.contractStatus === '5'" -->
              <!-- <div v-if="scope.row.contractStatus === '3'||scope.row.contractStatus === '5'"> -->
              <!-- v-if="scope.row.btnAuthority.finishFlag" -->
              <!-- <el-button
                type="text"
                class="inTablebutton"
                @click="end(scope.row)"
              >结束</el-button> -->
              <!-- v-if="scope.row.btnAuthority.alterationFlag" -->
              <!-- -->
              <!-- <el-button
                type="text"
                class="inTablebutton"
                @click="contractChange(scope.row)"
              >合同变更</el-button> -->
              <!-- </div> -->
              <!-- <div v-if="scope.row.contractStatus === '7'||scope.row.contractStatus === '9'"> -->
              <!-- v-if="scope.row.btnAuthority.lookOverFlag" -->

              <!-- <el-button

                type="text"
                class="inTablebutton"
                @click="view(scope.row)"
              >查看</el-button> -->
              <!-- </div> -->
              <!-- <div v-if="scope.row.btnAuthority.cancelFlag" class="m-l-10"> -->
              <!-- v-if="scope.row.btnAuthority.cancelFlag" -->
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

      <!-- 合同状态(1：草稿2：已撤回 3：待审批 4：已通过5：已签订 6：已拒绝 7：已终止 8：已结束) -->
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
import { getcontractalterationlist, magAndSearchContract, contractStatisticsNumber } from '@/api/contract'
import { changapprovelStatusOptions } from './selectEnum'
import contractChangeDialog from './components/contractChangeDialog'
import { getSystemQueryList } from '@/api/system'

import { remove, cloneDeep } from 'lodash'

import { mapState } from 'vuex'
export default {
  name: 'ContractManagementChange',
  components: { contractChangeDialog },
  data() {
    return {
      demandStageData: [
        // { label: '全部', id: '', Number: 12 },
        // { label: '待审批', id: '1', Number: 12 },
        // { label: '已通过', id: '2', Number: 12 }
      ],
      fullscreenLoading: false,
      changeModeOptions: [],
      requestForm: {

      },
      changapprovelStatusOptions: changapprovelStatusOptions,
      isOpen: false,
      currentLinkOptions: [],
      typeOptions: [],
      statusOptions: [],
      tableLoading: false,
      requestData: [],
      dialogVisible: false,
      total: 0,
      pageParam: {
        currentPage: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.contract.contractqueryForm
    })
  },
  created() {
    getSystemQueryList({ type: '99', status: '1' })
      .then((res) => {
        this.changeModeOptions = res.data
        this.changeModeOptions.splice(0, 0, {
          systemValue: '全部',
          systemCode: ''
        })
      })
    console.log('this.requestForm', this.form)
    this.requestForm = { ...this.form }
    this.requestForm.pageParam = this.pageParam
    this.getMyRequestList()
    this.getStatisticsNumber()
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
    resetTaxTotalAmount(row) {
      const { taxTotalAmount, incomeExpenditure } = row
      if (taxTotalAmount && incomeExpenditure !== '74') {
        return parseInt(taxTotalAmount).toFixed(2)
      } else {
        return '--'
      }
    },
    formatterChangeM(row) {
      // 变更方式 （0；原始合同，1：补充协议，2：录入信息变更，3：小错误修改，4：终止合同，5：终止合同（需结算））

      if (row.changeMode === '0') { return '原始合同' } else if (row.changeMode === '1') { return '补充协议' } else if (row.changeMode === '2') { return '录入信息变更' } else if (row.changeMode === '3') { return '小错误修改' } else if (row.changeMode === '4') { return '终止合同' } else if (row.changeMode === '5') { return '终止合同（需结算）' } else { return '--' }
    },
    contractStatusChange(val, key) {
      console.log(val, '589')
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
    async getStatisticsNumber() {
      const res = await contractStatisticsNumber({
        flag: '2'
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
      // list.push
      // this.demandStageData = res.data.map(item => {
      //   if (item.demandStageName === '全部') {
      //     return {
      //       label: item.demandStageName,
      //       Number: item.demandStageNumber,
      //       id: ''
      //     }
      //   }
      //   if (item.demandStageName === '待审批') {
      //     return {
      //       label: item.demandStageName,
      //       Number: item.demandStageNumber,
      //       id: '2'
      //     }
      //   }
      //   if (item.demandStageName === '已通过') {
      //     return {
      //       label: item.demandStageName,
      //       Number: item.demandStageNumber,
      //       id: '3'
      //     }
      //   }
      // })
      // console.log(res, 'res=319')
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
    goSelect(scope) {
      if (scope.bizId) {
        // 有需求的编辑或者审批
        if (scope.btnAuthority.editFlag) { // 编辑正确的
          // 有需求合同的编辑页面
          this.$router.push({
            path: '/contractChangeManagement/edit',
            query: { id: scope.bizId, R: scope.demandCode, demandStageId: '3',
              contractId: scope.id, partnerId: scope.partnerId, isEdit: 'C' }
          })
        } else {
          // 有需求的详情页
          this.$router.push({
            path: '/contractChangeManagement/detail',
            query: {
              'contractId': scope.id,
              'demandId': scope.bizId,
              // 'approve': approve,
              'partnerId': scope.partnerId,
              'R': scope.demandCode
            }
          })
        }
      } else {
        if (scope.btnAuthority.editFlag) {
          if (scope.contractStatus === '6' || scope.contractStatus === '4') {
          // 已撤销&已驳回
            this.$router.push({
              path: '/contractChangeManagement/edit',
              query: { id: scope.bizId, R: scope.demandCode, demandStageId: '3',
                contractId: scope.id, partnerId: scope.partnerId, isEdit: 'C' }
            })
          } else {
          // 无需求编辑页面
            this.$router.push({
              name: 'agreementContractEditOnlyContract',
              params: { contractId: scope.id }
            })
          }
        } else {
        // 无需求的详情页
          this.$router.push({
            path: '/contractChangeManagement/detail',
            query: {
              'contractId': scope.id,
              'demandId': scope.bizId,
              // 'approve': approve,
              'partnerId': scope.partnerId,
              'R': scope.demandCode
            }
          })
        }
      }
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
    cancel(row) {
      this.$confirm('是否要撤销', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.fullscreenLoading = true
          const res = await cancelContract({ contractBaseId: row.id })
          console.log(res, '撤销接口')
          if (res.success) {
            this.fullscreenLoading = false
            this.$message({
              message: '撤销成功',
              type: 'success'
            })
            this.getMyRequestList()
          }
        })
        .catch(() => {
          this.fullscreenLoading = false
        })
    },
    view(row, approve) {
      // 详情页
      // if (row.bizId) {
      // 有需求的详情页
      this.$router.push({
        path: '/contractChangeManagement/detail',
        query: {
          'contractId': row.id,
          'demandId': row.bizId,
          'partnerId': row.partnerId,
          'R': row.demandCode
        }
      })
      // }
      // const constLocalPersons = row.dealingInfoList.map(({ userName, userId }) => {
      //   return { userName, userId }
      // })
      // window.localStorage.setItem('currentHandler', JSON.stringify(constLocalPersons))
      // }
      // else {
      //   // 无需求的详情页
      //   // 详情===正确
      //   this.$router.push({
      //     path: '/requirementManagement/list/noIncomeExpenditure',
      //     query: {
      //       'contractId': row.id
      //     }
      //   })
      // }
    },
    contractChange(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.contractChanged.init(row)
      })
    },
    closeContract(flag) {
      this.dialogVisible = false
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
    approval() {

    },
    godEdit(row) {
      if (row.bizId) {
        // 有需求合同的编辑页面
        this.$router.push({
          path: '/contractChangeManagement/edit',
          query: { id: row.bizId, R: row.demandCode, demandStageId: '3',
            contractId: row.id, partnerId: row.partnerId, isEdit: 'C' }
        })
      } else {
        if (row.contractStatus === '6' || row.contractStatus === '4') {
          // 已撤销&已驳回
          this.$router.push({
            path: '/contractChangeManagement/edit',
            query: { id: row.bizId, R: row.demandCode, demandStageId: '3',
              contractId: row.id, partnerId: row.partnerId, isEdit: 'C' }
          })
        } else {
        // 无需求编辑页面
          this.$router.push({
            name: 'agreementContractEditOnlyContract',
            params: { contractId: row.id }
          })
        }
      }
    },
    goToDetail() {

    },
    open() {

    },
    clickReset() {
      this.requestForm.contractSerialNumber = '' // 变更编号
      this.requestForm.contractNumber = '' // 合同编号
      this.requestForm.changeMode = [''] // 变更方式
      this.requestForm.approvelStatus = [''] // 变更状态，
      this.requestForm.contractStatus = [''] // 顶部状态
      this.clickQuery()
    },
    switchDemandStage(value) {
      this.requestForm.contractStatus = [value]
      this.clickQuery()
    },
    approvelStatusFormat(row) {
      if (row.contractStatus === '1') { return '草稿' } else if (row.contractStatus === '2') { return <span class='inTableBlueText'>待审批</span> } else if (row.contractStatus === '3') { return '已通过' } else if (row.contractStatus === '4') { return <span class='inTableRedText'>已驳回</span> } else if (row.contractStatus === '5') { return '已签订' } else if (row.contractStatus === '6') { return <span class='inTableGreyText'>已撤销</span> } else if (row.contractStatus === '7') { return '已终止' } else if (row.contractStatus === '9') { return '已结束' } else { return '--' }
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
    handleClose() {

    },
    returnNullBtn(row) {
      if (!row.editFlag && !row.deleteFlag && !row.approveFlag && !row.alterationFlag && !row.cancelFlag) {
        return true
      }
      return false
    },
    clickQuery() {
      this.requestForm.pageParam.currentPage = 1
      this.getMyRequestList()
      this.$store.commit('contract/setContractQueryForm', this.requestForm)
    },
    async getMyRequestList() {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      try {
        const { contractStatus = [], changeMode = [] } = cloneDeep(this.requestForm)
        remove(contractStatus, item => {
          return item === ''
        })
        remove(changeMode, item => {
          return item === ''
        })
        const params = { ...this.requestForm, contractStatus, changeMode }
        // console.log(params, '点击查询得参数')
        const resData = await getcontractalterationlist(params)
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
    }
  }

}
</script>

<style lang="scss" scoped>
#contractManagementChange{
.inTableBlueText {
  color: #2EC09A;
  user-select: text;
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
  .header{
    width: 100%!important;
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
  .card-table {
    .el-button--medium {
      padding: 0;
    }
  }
  /deep/.el-table{
    .cell {
      height: 21px;
    }
  }
}

</style>
