<template>
  <div id="financial-detail">
    <el-page-header content="订单详情页面" class="page-header" @back="goBack" />

    <h3 class="thisItem m-b-20 m-t-20">交易信息</h3>
    <el-card class="m-t-20 card-table">

      <el-table
        id="finCenter-detail-table"
        ref="finCenterTable"
        :data="tableData"
        width="100%"
      >
        <el-table-column prop="transactionDate" label="交易日期" min-width="100" align="center" />
        <el-table-column prop="oppositeAccountName" label="对方户名" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="oppositeAccountNo" label="对方银行账号" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="innerAccountName" label="我方户名" min-width="120" align="center" />
        <el-table-column prop="internalAccountNo" label="我方银行账号" min-width="100" align="center" />
        <el-table-column prop="transactionType" label="账务类型" min-width="100" align="center" :formatter="transactionTypeF" />
        <el-table-column prop="transactionAmount" label="交易金额" min-width="110" align="center" />
        <el-table-column prop="transactionAmount" label="交易余额" min-width="110" align="center" />
        <el-table-column prop="purpose" label="用途" min-width="110" align="center" />
        <el-table-column prop="matchStatus" label="状态" min-width="110" align="center" :formatter="matchStatusF" />
        <el-table-column prop="matchStatus" label="已确认" min-width="110" align="center" :formatter="matchStatusF" />
        <el-table-column prop="matchStatus" label="未确认" min-width="110" align="center" :formatter="matchStatusF" />
      </el-table>
    </el-card>
    <div class="flex align-center justify-content-between">
      <h3 class="thisItem m-b-20 m-t-20">待匹配应收结算</h3>
      <div class="flex align-center justify-content-end">
        <div class="m-r-10">本次结算金额</div>
        <div class="twoInput">
          <el-input v-model="formInline.min" size="small" placeholder="最小金额 " class="hoverInput-min inputWidth50" />
          <span>-</span>
          <el-input v-model="formInline.max" size="small" placeholder="最大金额 " class="inputOuter" />
        </div>
        <div class="m-r-10 m-l-10">业务类别</div>
        <el-cascader
          :options="options"
          collapse-tags
          clearable
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" min-width="30" />
        <el-table-column label="序号" min-width="60" align="center">
          <template slot-scope="scope">
            {{ (FinCenterForm.currentPage - 1) * FinCenterForm.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="结算流水号" min-width="100" align="center" />
        <el-table-column prop="orderNo" label="订单号" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="bussinessType" label="业务类别" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="customerCompanyName" label="对方公司名称" min-width="120" align="center" />
        <el-table-column prop="customerBankAccount" label="对方银行账号" min-width="100" align="center" />
        <el-table-column prop="accountDuring" label="结算周期" min-width="100" align="center" :formatter="transactionTypeF" />
        <el-table-column prop="applyDate" label="申请日期" min-width="110" align="center" />
        <el-table-column prop="amount" label="本次结算金额" min-width="110" align="center" :formatter="thisBillingM" />
        <el-table-column prop="billingM" label="结算单金额" min-width="110" align="center" :formatter="matchStatusF" />
        <el-table-column prop="notM" label="未结算金额" min-width="110" align="center" :formatter="matchStatusF" />
        <el-table-column prop="applyP" label="申请人" min-width="110" align="center" :formatter="matchStatusF" />

      </el-table>
    </el-card>
  </div>
</template>

<script>
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
      tableData: [],
      checkoutTableData: [
        { id: 'IFS123456', orderNo: '222222',
          bussinessType: '金融', customerCompanyName: '阿里',
          customerBankAccount: '222', accountDuring: '2019-2020',
          applyDate: '2010/1/3-2022/5/5', amount: '33333',
          billingM: 30, notM: '44444', applyP: 'who'
        },
        { id: 'IFS123456', orderNo: '222222',
          bussinessType: '金融', customerCompanyName: '阿里',
          customerBankAccount: '222', accountDuring: '2019-2020',
          applyDate: '2010/1/3-2022/5/5', amount: '33333',
          billingM: 20, notM: '44444', applyP: 'who'
        },
        { id: 'IFS123456', orderNo: '222222',
          bussinessType: '金融', customerCompanyName: '阿里',
          customerBankAccount: '222', accountDuring: '2019-2020',
          applyDate: '2010/1/3-2022/5/5', amount: '33333',
          billingM: 10, notM: '44444', applyP: 'who'
        },
        { id: 'IFS123456', orderNo: '222222',
          bussinessType: '金融', customerCompanyName: '阿里',
          customerBankAccount: '222', accountDuring: '2019-2020',
          applyDate: '2010/1/3-2022/5/5', amount: '33333',
          billingM: 50, notM: '44444', applyP: 'who'
        }
      ],
      totalMoney: 50,
      isOverSize: false
    }
  },
  methods: {
    thisBillingM(row, column, cellValue, index) {
      console.log(row, column, cellValue, index)
      if (this.isOverSize) {
        return '33333333'
      }
    },
    clickQuery() {

    },
    clickReset() {

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
    init(row, params) {
      if (params === '匹配') {
        console.log(row, '进来详情带过来的这一行数据')
        this.tableData = [{ ...row }]
        this.dialogTitle = ''
      }
      //  else {

      // }
      this.dialogFormVisible = true
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
    handleSelectionChange(val) {
      console.log(val, '表格选中的')
      let total = 0
      let flag = true
      val.forEach(item => {
        total += item.billingM
        if (total > this.totalMoney) {
          flag = false
        }
      })
      if (!flag) {
        alert('操过了')
        this.isOverSize = true
      }
      this.$refs.finCenterTable.doLayout()
      console.log(total, '选中表单综合')
      // this.$nextTick(() => {
      setTimeout(() => {
        this.checkoutTableData = val
      }, 8000)
      // })

      this.$refs.finCenterTable.doLayout()
    }

  }
}
</script>

<style scoped lang="scss">
#financial-detail{
.twoInput{
  width: 30%;
  display: flex;
  border:transparent 1px solid;
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
