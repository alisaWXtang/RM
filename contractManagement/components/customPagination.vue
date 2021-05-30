<template>
  <el-pagination
    :current-page="pageParam.currentPage"
    :page-sizes="pageSizes"
    :page-size="pageParam.pageSize"
    :layout="layout"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'CustomPagination',
  props: {
    pageParam: {
      type: Object,
      default() {
        return {
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30]
      }
    },
    layout: {
      type: String,
      default() {
        return 'total, sizes, prev, pager, next, jumper'
      }
    },
    total: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('changePage', {
        currentPage: 1,
        pageSize: val
      })
    },
    handleCurrentChange(val) {
      this.$emit('changePage', {
        currentPage: val,
        pageSize: this.pageParam.pageSize
      })
    }
  }
}
</script>

<style>

</style>
