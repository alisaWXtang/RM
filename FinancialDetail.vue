<template>
  <div id="financial-detail">
    <el-page-header content="订单详情页面" class="page-header" @back="goBack" />

    <h3 class="thisItem m-b-30 m-t-30">交易信息</h3>
    <el-card class="m-t-20 card-table">

      <el-table
        id="finCenter-detail-table"
        ref="finCenterTable"
        :data="rowTableData"
        width="100%"
      >
        <el-table-column prop="transactionAmount" label="交易金额" min-width="100" align="center" />
        <el-table-column prop="remainSum" label="交易余额" min-width="100" align="center" />
        <el-table-column prop="confirmAmount" label="已确认" min-width="80" align="center" />
        <el-table-column prop="unconfirmAmount" label="未确认" min-width="80" align="center" />
        <el-table-column prop="transactionDate" label="交易日期" min-width="110" align="center" />
        <el-table-column prop="oppositeAccountName" label="对方户名" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="oppositeAccountNo" label="对方银行账号" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="innerAccountName" label="我方户名" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="internalAccountNo" label="我方银行账号" min-width="120" align="center" />
        <el-table-column prop="transactionType" label="账务类型" min-width="80" align="center" :formatter="transactionTypeF" />
        <el-table-column prop="purpose" label="用途" min-width="120" align="center" />

      </el-table>
    </el-card>
    <div class="flex align-center justify-content-between  m-b-30 m-t-30">
      <h3 class="thisItem">待匹配应收结算</h3>
      <div class="flex align-center justify-content-end">
        <div class="m-r-10">本次结算金额</div>
        <div class="twoInput">
          <el-input
            v-model="formInline.min"
            size="small"
            placeholder="最小金额 "
            class="hoverInput-min inputWidth50"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            @change="minchange"
          />
          <span>-</span>
          <el-input v-model="formInline.max" oninput="value=value.replace(/[^0-9.]/g,'')" size="small" placeholder="最大金额 " class="inputOuter" />
        </div>
        <div class="m-r-10 m-l-10">业务类别</div>
        <el-cascader
          :options="options"
          collapse-tags
          clearable
          @remove-tag="removeTag"
        />
        <div class="tr m-l-10">
          <el-button type="primary" size="medium" @click="clickQuery">查询</el-button>
          <el-button plain size="medium" @click="clickReset">重置</el-button>
        </div>
      </div>
    </div>
    <el-card class="m-t-20 card-table">
      <el-table
        ref="finCenterTable"
        :data="checkoutTableData"
        @select="Rowcheck"
      >
        <el-table-column type="selection" width="55" align="center" min-width="30" />
        <el-table-column label="序号" min-width="60" align="center">
          <template slot-scope="scope">
            {{ (FinCenterForm.currentPage - 1) * FinCenterForm.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="结算单金额" min-width="110" align="center" />
        <el-table-column prop="confirmAmount" label="本次结算金额" min-width="120" align="center" />
        <el-table-column prop="unConfirmAmount" label="未结算金额" min-width="110" align="center" />
        <el-table-column prop="settlementNo" label="结算流水号" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="orderNo" label="订单号" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="appCode" label="业务类别" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="customerCompanyName" label="对方公司名称" min-width="90" align="center" show-overflow-tooltip />
        <el-table-column prop="customerBankAccount" label="对方银行账号" min-width="90" align="center" show-overflow-tooltip />
        <el-table-column prop="effectiveTime" label="结算周期" min-width="90" align="center" show-overflow-tooltip :formatter="formatterbillingT" />
        <el-table-column prop="applyTime" label="申请日期" min-width="110" align="center" :formatter="formatterT" />
        <el-table-column prop="applyUserId" label="申请人" min-width="80" align="center" :formatter="formatterapplyUser" />

      </el-table>
      <div class="tr m-t-20">
        <el-button class="fixed-width reset-btn" plain @click="clickReset()">取消</el-button>
        <el-button type="primary" class="fixed-width" @click="confirmMatchFn">确认匹配</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
import { getfinacialDetail, confirmMatch } from '@/api/finacialCenter'
import moment from 'moment'

export default {
  name: 'FinancialDetail',
  data() {
    return {
      options: [[]],
      formInline: {
        min: '',
        max: ''
      },
      FinCenterForm: {
        currentPage: 1,
        pageSize: 30
      },
      dialogFormVisible: false,
      dialogTitle: '',
      model: 1,
      rowTableData: [],
      checkoutTableData: [],
      prevVal: [],
      totalMoney: 100,
      isOverSize: false
    }
  },
  watch: {
  },
  created() {
    this.init()
  },
  methods: {
    formatterapplyUser(row) {
      return `${row.applyUserName} ${row.applyUserId}`
    },
    formatterT(row) {
      return moment(row.applyTime).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterbillingT(row) {
      return `${moment(row.effectiveTime).format('YYYY-MM-DD HH:mm:ss')}${moment(row.expirationTime).format('YYYY-MM-DD HH:mm:ss')}`
    },
    clickQuery() {
      // console.log(
      this.checkoutTableData[0].amount = 44444 //, '改变原来表格的数据'

      // )
    },
    async confirmMatchFn() {
      // 已确认金额confirmAmount
      // 列表进来的id
      const confirmAmount = 30000000
      const id = this.$route.params.row.id
      const list = this.$refs.finCenterTable.selection.map(item => {
        return { id: item.id, settlementNo: item.settlementNo, settlementAmount: item.settlementAmount,
          ThisSettlementAmount: item.ThisSettlementAmount, remainSettlementAmount: item.remainSettlementAmount
        }
      })
      console.log(this.checkoutTableData, 'checkoutTableData')
      const res = await confirmMatch({
        confirmAmount, id, list
      })
      console.log(res, 'res')
    },
    removeTag() {
      console.log('removeTag')
    },
    minchange() {

      // console.log(this.formInline.min, 'formInline.min')
    },
    clickReset() {
      this.$refs.finCenterTable.toggleAllSelection()
      console.log(this.$refs.finCenterTable, 'finCenterTable=================refs')
    },
    transactionTypeF(row, column, cellValue, index) {
      if (cellValue === 1) {
        return '存入'
      } else {
        return '支出'
      }
    },
    matchStatusF(row, column, cellValue, index) {
      if (cellValue === 1) {
        return '未匹配'
      } else {
        return '已匹配'
      }
    },
    async init() {
      const rowData = this.$route.params.row
      rowData.confirmAmount = 0
      rowData.unconfirmAmount = 0
      rowData.leftover = 0
      const rowArr = []
      rowArr.push(rowData)
      this.rowTableData = rowArr
      console.log(this.$route.params, 'this.$route.params')
      const res = await getfinacialDetail({ id: rowData.id })
      // console.log(res, '财务详情')
      res.data.list.forEach(item => {
        item.confirmAmount = 0
      })
      this.checkoutTableData = res.data.list
    },
    // 重置表单
    reset() {
      this.dialogFormVisible = false
    },
    adminFormSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addUser()
        }
      })
    },
    async addUser() {
      this.$emit('refreshDataList')
    },
    goBack() {
      window.history.back(-1)
    },
    onSubmit() {},
    Rowcheck(selection, row) {
      //   结算单金额      未结算金额        本次结算金额
      //   billingM: 80,  notM: 60,         amount
      //   amount         unConfirmAmount   confirmAmount
      console.log(selection, 'selection')
      if (selection.length) {
        selection.forEach(item => {
          if (item.settlementNo === row.settlementNo) {
            console.log('勾选--------')
            let total = 0
            selection.forEach(item => {
              if (total >= 100) {
                alert('不可以再勾选了')
                this.$refs.finCenterTable.toggleRowSelection(row)
                this.checkoutTableData.forEach((item, index) => {
                  if (item.settlementNo === row.settlementNo) {
                    this.checkoutTableData[index].confirmAmount = 0
                    this.checkoutTableData[index].unConfirmAmount = row.amount
                  }
                })
              } else {
                this.checkoutTableData.forEach((item, index) => {
                  if (item.settlementNo === row.settlementNo) {
                    if (100 - total < row.amount) {
                      this.checkoutTableData[index].confirmAmount = 100 - total // 金额不足时 本次结算金额 = 剩余金额
                    } else {
                      this.checkoutTableData[index].confirmAmount = row.amount // 金额足时 本次结算金额 = 结算单金额
                    }
                    this.checkoutTableData[index].unConfirmAmount = this.checkoutTableData[index].amount - this.checkoutTableData[index].confirmAmount // 未结算金额 = 结算单金额 - 本次结算金额
                  }
                })
              }
              total += item.amount
            })
          } else {
            console.log('取消勾选--------')

            this.checkoutTableData.forEach((item, index) => {
              if (item.settlementNo === row.settlementNo) {
                this.checkoutTableData[index].confirmAmount = 0 // 本次结算金额 = 0
                this.checkoutTableData[index].unConfirmAmount = row.amount // 未结算金额 = 结算单金额
              }
            })
            if (selection.length === 1) {
              this.checkoutTableData.forEach((item, index) => {
                if (item.settlementNo === selection[0].settlementNo) {
                  this.checkoutTableData[index].confirmAmount = this.checkoutTableData[index].amount // 本次结算金额 = 结算单金额
                  this.checkoutTableData[index].unConfirmAmount = 0 // 未结算金额 = 0
                }
              })
            }
          }
        })
      } else {
        console.log('最后一次取消选择')
        this.checkoutTableData.forEach((item, index) => {
          if (item.settlementNo === row.settlementNo) {
            this.checkoutTableData[index].confirmAmount = 0 // 本次结算金额 = 0
            this.checkoutTableData[index].unConfirmAmount = this.checkoutTableData[index].amount // 未结算金额 = 计算单金额
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
#financial-detail{
.twoInput{
  width: 30%;
  display: flex;
  border:#dcdfe6 1px solid;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  background: #fff;
  .hoverInput-min,.inputOuter{
    /deep/input{
      border: none;
    }

  }
    &:hover{
      border-radius: 4px;
      border:#c0c4cc 1px solid;
    }
    &:focus{
      border:red 1px solid;

    }
}

}

</style>
