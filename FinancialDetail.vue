<template>
  <div id="financial-detail">
    <el-page-header content="账务详情页面" class="page-header" @back="goBack" />

    <el-card>
      <p class="thisItem m-b-30 m-t-30">交易信息</p>
      <el-card class="m-t-20 card-table">

        <el-table
          id="finCenter-detail-table"
          ref="finCenterTable"
          :data="rowTableData"
          width="100%"
        >
          <el-table-column prop="transactionDate" label="交易日期" min-width="120" align="center" />
          <el-table-column prop="oppositeAccountName" label="对方户名" align="center" show-overflow-tooltip />
          <el-table-column prop="oppositeAccountNo" label="对方银行账号" align="center" show-overflow-tooltip />
          <el-table-column prop="innerAccountName" label="我方户名" align="center" show-overflow-tooltip />
          <el-table-column prop="internalAccountNo" label="我方银行账号" align="center" />
          <el-table-column prop="transactionType" label="账务类型" align="center" :formatter="transactionTypeF" />
          <el-table-column prop="purpose" label="用途" align="center" />
          <el-table-column prop="transactionAmount" label="交易金额" align="center" />
          <el-table-column prop="transactionAmount" label="交易余额" align="center" />
          <el-table-column prop="confirmAmount" label="已确认" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.confirmAmount ? scope.row.confirmAmount : 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unConfirmAmount" label="未确认" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unConfirmAmount ? scope.row.unConfirmAmount : 0 }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-card>

      <el-form ref="detailForm" :inline="true" class="m-t-30">
        <el-row>
          <el-col :span="4">待匹配应收结算</el-col>
          <el-col :span="10">
            <el-form-item label="本次结算金额" prop="min">
              <el-input
                v-model.number="detailForm.min"
                placeholder="最小金额 "
              />
            </el-form-item>
            <span>-</span>
            <el-form-item prop="max">
              <el-input
                v-model.number="detailForm.max"
                placeholder="最大金额 "
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务类别" prop="businessType">
              <el-cascader
                v-model="detailForm.businessType"
                :options="businessTypeOptions"
                class="input-width"
                collapse-tags
                :props="props"
                @change="changeCascaderType($event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="medium" @click="clickQuery">查询</el-button>
            <el-button plain size="medium" @click="clickReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-card class="m-t-20 card-table">
        <el-table
          ref="finCenterTable"
          :data="checkoutTableData"
          @select="selectRow"
          @select-all="selectAll"
        >
          <el-table-column type="selection" width="55" align="center" min-width="30" />
          <el-table-column label="序号" min-width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="settlementNo" label="结算流水号" min-width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="订单号" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="appCode" label="业务类别" min-width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="customerCompanyName" label="对方公司名称" min-width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="customerBankAccount" label="对方银行账号" min-width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="effectiveTime" label="结算周期" min-width="90" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.effectiveTime | formatTime }} - {{ scope.row.expirationTime | formatTime }}
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请日期" min-width="110" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.applyTime | formatTime }}
            </template>
          </el-table-column>
          <el-table-column prop="confirmAmount" label="本次结算金额" width="120" align="center" />
          <el-table-column prop="amount" label="结算单金额" min-width="110" align="center" />
          <el-table-column prop="unConfirmAmount" label="未结算金额" min-width="110" align="center" />
          <el-table-column prop="applyUserId" label="申请人" min-width="80" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.applyUserName +' ' + scope.row.applyUserId }}
            </template>
          </el-table-column>
        </el-table>
        <div class="tr m-t-20">
          <!--          <el-button class="fixed-width reset-btn" plain @click="clickCancle">取消</el-button>-->
          <el-button type="primary" class="fixed-width" @click="confirmMatchFn">确认匹配</el-button>

        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import { getfinacialDetail, confirmMatch, getfinacial } from '@/api/finacialCenter'
import { getQueryTreeRequest } from '@/api/utils'
// import detailData from './detailData'
export default {
  name: 'FinancialDetail',
  data() {
    return {
      props: { multiple: true },
      type: this.$route.query.type,
      detailForm: {
        min: '',
        max: '',
        businessType: [''] // 业务类别
      },
      rowTableData: [],
      checkoutTableData: [],
      id: this.$route.params.id,
      transactionAmount: 100,
      businessTypeOptions: [], // 这个数据需要发请求
      last: true
    }
  },
  mounted() {
    this.getTopTableData()
    this.getBusinessList()
    this.getMatchTableData()
  },

  methods: {
    async getTopTableData() {
      const res = await getfinacial({ id: this.id })
      const list = res.data.accountCenterInfoPageInfo.list
      list[0].confirmAmount = 0
      list[0].unConfirmAmount = 0
      this.rowTableData = list
    },
    async getBusinessList() {
      const res = await getQueryTreeRequest()
      this.businessTypeOptions = res.data.map(item => {
        if (item.businessList && item.businessList.length > 0) {
          const children = item.businessList.map(childItem => {
            return { label: childItem.businessName, value: childItem.businessCode }
          })
          // children.splice(0, 0, { value: '', label: '全部' })
          return { label: item.type, value: item.type, children }
        } else {
          return { label: item.type, value: item.type }
        }
      })

      this.businessTypeOptions.splice(0, 0, { value: '', label: '全部' })
    },
    async getMatchTableData() {
      const res = await getfinacialDetail({ id: this.id })
      // const res = detailData
      this.checkoutTableData = res.data.list
    },
    clickQuery() {
      this.getMatchTableData()
    },
    async confirmMatchFn() {
      const confirmAmount = this.rowTableData[0].confirmAmount
      const list = this.$refs.finCenterTable.selection.map(item => {
        return {
          id: item.id,
          settlementNo: item.settlementNo,
          amount: item.amount,
          confirmAmount: item.confirmAmount,
          unConfirmAmount: item.unConfirmAmount
        }
      })
      const res = await confirmMatch({
        confirmAmount, id: this.id, list
      })
      if (res.success) {
        this.getTopTableData()
        this.getBusinessList()
        this.getMatchTableData()
      }
    },
    clickReset() {
      // this.$refs['detailForm'].resetFields() // 又不生效 。。。
      this.detailForm.min = ''
      this.detailForm.max = ''
      this.detailForm.businessType = ['']
      this.$refs.finCenterTable.clearSelection()
      this.rowTableData[0].confirmAmount = 0
      this.rowTableData[0].unConfirmAmount = 0
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
    goBack() {
      window.history.back(-1)
    },
    selectAll(selection) {
      if (selection.length) {
        let total = 0
        selection.forEach((item, index) => {
          if (this.transactionAmount > total) {
            if (this.transactionAmount - total > item.unConfirmAmount) {
              this.checkoutTableData[index].confirmAmount = this.checkoutTableData[index].unConfirmAmount
            } else {
              this.checkoutTableData[index].confirmAmount = this.transactionAmount - total
            }
            total += item.confirmAmount
          } else {
            selection = selection.splice(index, selection.length - 1)
          }
        })
        this.rowTableData[0].confirmAmount = total
        this.rowTableData[0].unConfirmAmount = this.rowTableData[0].transactionUnConfirmAmount - total // TODO 要改成交易金额
      } else {
        this.checkoutTableData.forEach((item, index) => {
          this.checkoutTableData[index].confirmAmount = 0
        })
        this.rowTableData[0].confirmAmount = 0
        this.rowTableData[0].unConfirmAmount = this.rowTableData[0].transactionUnConfirmAmount // TODO 等于交易余额
      }
    },
    selectRow(selection, row) {
      console.log(selection, 'selection')
      console.log(row, 'row')
      if (selection.length) {
        let total = 0
        const data = selection.find(item => item.settlementNo === row.settlementNo)
        if (data) {
          console.log('勾选--------')
          selection.forEach(item => {
            if (total >= this.transactionAmount) {
              alert('不可以再勾选了')
              this.$refs.finCenterTable.toggleRowSelection(row)
              this.checkoutTableData.forEach((item, index) => {
                if (item.settlementNo === row.settlementNo) {
                  this.checkoutTableData[index].confirmAmount = 0
                }
              })
            } else {
              this.checkoutTableData.forEach((item, index) => {
                if (item.settlementNo === row.settlementNo) {
                  if (this.transactionAmount - total < row.unConfirmAmount) {
                    this.checkoutTableData[index].confirmAmount = this.transactionAmount - total // 金额不足时 本次结算金额 = 剩余金额
                  } else {
                    this.checkoutTableData[index].confirmAmount = row.unConfirmAmount // 金额足时 本次结算金额 = 结算单金额
                  }
                }
              })
              total += item.confirmAmount
            }
          })
        } else {
          console.log('取消勾选--------')
          selection.forEach(item => {
            total += item.confirmAmount
          })

          console.log('total-after', total)
          this.checkoutTableData.forEach((item, index) => {
            if (item.settlementNo === row.settlementNo) {
              this.checkoutTableData[index].confirmAmount = 0 // 本次结算金额 = 0
            }
          })

          // 不需要匹配的那些数据之和
          let tempTotal = 0
          let data
          selection.forEach(item => {
            if (item.unConfirmAmount !== item.confirmAmount) {
              data = item
            } else {
              tempTotal += item.confirmAmount
            }
          })
          if (data) {
            if (data.unConfirmAmount > this.transactionAmount - tempTotal) {
              data.confirmAmount = this.transactionAmount - tempTotal
            } else {
              data.confirmAmount = data.unConfirmAmount
            }
          }
        }
        console.log('total-----', total)
        this.rowTableData[0].confirmAmount = total
        this.rowTableData[0].unConfirmAmount = this.rowTableData[0].transactionUnConfirmAmount - total // TODO 要改成交易金额
      } else {
        console.log('最后一次取消选择')
        this.checkoutTableData.forEach((item, index) => {
          if (item.settlementNo === row.settlementNo) {
            this.checkoutTableData[index].confirmAmount = 0 // 本次结算金额 = 0
          }
        })
        this.rowTableData[0].confirmAmount = 0
        this.rowTableData[0].unConfirmAmount = this.rowTableData[0].transactionUnConfirmAmount // TODO 等于交易余额
      }
    },
    changeCascaderType(value) {
      const find = value.find(v => v.length === 1 && v[0] === '')
      const curr = !!find // 等价 find ? true : false
      let copy
      const update = (last) => {
        // 更新last
        this.last = last
        // 由于this.orderForm.businessType.shift() 不能导致页面刷新，以下方法重新赋值
        copy = JSON.parse(JSON.stringify(this.detailForm.businessType))
        this.detailForm.businessType = []
        this.$nextTick(() => {
          this.detailForm.businessType = copy
          console.log(this.detailForm.businessType)
        })
      }
      if (this.last) {
        if (curr) {
          // 如果上次选中，这次选中，代表点击的其它
          this.detailForm.businessType.shift()
          update(false)
        } else {
          // 如果上次选中,这次没选中，代表点击的全选
          this.detailForm.businessType = ['']
          update(true)
        }
      } else {
        if (curr) {
          // 如果上次没选中，这次选中，代表点击的全选
          this.detailForm.businessType = ['']
          update(true)
        } else {
          // 如果上次没选中，这次没选中，代表点击的其它
          // 不操作
          update(false)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#financial-detail{
  /deep/ .el-page-header__content {
    @media screen and (max-width: $small-adaptation) {
      font-size: 16px;
    }
  }
  .page-header{
    padding-bottom: 20px;
    @media screen and (max-width: $small-adaptation) {
      padding-bottom: 10px;
    }
  }
}

</style>
