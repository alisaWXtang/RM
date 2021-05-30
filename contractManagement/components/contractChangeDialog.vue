<template>
  <div id="contractdialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :title="dialogTitle"
      :close-on-click-modal="false"
      center
      @close="reset"
    >
      <el-form ref="contractForm" :model="form" label-width="133px" :rules="formRule" label-suffix="：">
        <el-form-item label="请选择变更类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" class="fillWidth">
            <el-option
              v-for="item in contractChangeType"
              :key="item.id"
              :label="item.systemValue"
              :value="item.systemValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请输入变更原因" prop="remark" class="dialogTextarea">
          <el-input
            v-model="form.remark"
            maxlength="800"
            show-word-limit
            type="textarea"
            :autosize="{minRows: 8,maxRows: 12 }"
            placeholder="请输入变更原因"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="clickCancel()">取 消</el-button>
        <el-button type="primary" @click="clickSure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSystemQueryList } from '@/api/system'
export default {
  name: 'ContractDialog',
  data() {
    return {
      dialogVisible: false,
      form: {
        type: '',
        remark: ''
      },
      rowData: '',
      contractChangeType: [],
      dialogTitle: '',
      formRule: {
        type: [
          { required: true, message: '变更类型不能为空', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '变更原因不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    init(row) {
      // console.log(row, 'rowdata')
      this.rowData = row
      this.dialogVisible = true
      getSystemQueryList({ type: '99', status: '1' })
        .then((res) => {
          this.contractChangeType = res.data
        })
    },
    clickSure() {
      this.$refs['contractForm'].validate((valid) => {
        if (valid) {
          this.save()
          this.goPage()
          this.reset()
        }
      })
    },
    goPage() {
      this.$router.push({
        path: '/contractChangeManagement/edit', // 原
        query: { id: this.rowData.bizId, R: this.rowData.demandCode, demandStageId: '3',
          contractId: this.rowData.id, partnerId: this.rowData.partnerId, isEdit: 'G' } })
    },
    save() {
      const obj = this.form
      const selectItem = this.contractChangeType.find((item) => {
        return this.form.type === item.systemValue
      })
      obj.code = selectItem.systemCode
      window.localStorage.setItem('contractChang', JSON.stringify(obj))
    },
    clickCancel() {
      this.reset()
    },
    reset() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
  #contractdialog{
    .fillWidth{
      width: 100%;
    }
  }
</style>
