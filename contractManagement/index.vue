<template>
  <list-page>
    <search v-if="listType === 'contractManagementSearch'" />
    <change v-if="listType === 'contractManagementChange'" />
    <!-- <agreement-contract-new v-if="listType === 'agreementContract'" ref="agreementContractNew" />
    <agreement-contract-edit v-if="listType === 'agreementContractEdit'" ref="agreementContractEdit" /> -->
    <!-- All 工作流 更改标题变更审批 -->
    <!-- <contract-search-edit v-if="listType === 'contractSearchEdit'" /> -->
    <!-- All 工作流 -->
    <!-- <contract-search-approval v-if="listType === 'contractSearchApproval'" /> -->
  </list-page>
</template>

<script>
import ListPage from '@/components/ListPage'
import change from './change'
import search from './search'
export default {
  name: 'ContractManagement',
  components: { search, ListPage, change },
  computed: {
    listType() {
      return this.$route.name
    }
  }
}
</script>
