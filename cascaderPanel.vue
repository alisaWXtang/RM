
<!--使用-->
<cascader-panel
  v-if="cascaderPanelShow"
  ref="cascaderPanel"
  :visible="cascaderPanelShow"
  :data-selected="selectedResourceTypes"
  :options="cascaderPanelData"
  @change="getcascaderChang"
  @close="getClose"
/>
<!--methodes-->
getcascaderChang(data) {
  this.oldCode = this.demandBaseInfo.demandType
  this.panelValue = data
  this.selectedResourceTypes = data.handledData
  this.showTypesForTable = true
  this.cascaderPanelShow = false
  if (data.handledData && data.handledData.length) {
    this.demandBaseInfo.budgetAmount = 0
    this.demandBaseInfo.hasSonTableData = data.handledData.map(item => ({
      ...item,
      sourceType: `${this.oneLevelTile}>${item.pathTexts}`,
      budgetCode: '',
      budgetDept: '',
      budgetFee: '',
      resourceTypeId: `${this.cascaderSelectedId},${item.pathNodesArr.join(',')}`,
      typeName: item.currntNodeData.label,
      typeCode: item.currntNodeData.code
    }))
  }
},

getClose(val) {
  this.cascaderPanelShow = false
  this.demandBaseInfo.demandType = this.oldCode
},





<!-- 组件内容 -->
<template>
  <el-popover
    v-model="popoverShow"
    placement="bottom-start"
    popper-class="cascader-popper"
    trigger="manual"
  >
    <!-- popover内容    -->
    <div v-clickoutside="clickoutside">
      <div class="list-content">
        <el-cascader-panel
          ref="cascader"
          v-model="checkedValue"
          :options="options"
          :props="{ multiple: true }"
          @change="getSelectData($event)"
        />
        <!-- 已选择 -->
        <div class="item-ct c000" style="min-width:215px;">
          <el-scrollbar style="height:100%">
            <div>
              <div class="line"></div>
              <div class="item-title has-delete">已选择（{{ selectData.length }}）
                <span class="delete-handle tc poi" :class="{ 'readonly':disableClear }" @click="deteleChecked('',true)">清空</span>
              </div>
              <ul class="item-wrap has-title">
                <li v-for="item in selectData" :key="item.value" class="item-node has-delete">
                  <span :title="item.pathTexts">{{ item.label }}</span>
                  <span class="delete-handle tc"><i class="item-node-icon el-icon-delete" @click="deteleChecked(item)"></i></span>
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <!-- 底部 -->
      <div class="foot-btn">
        <div class="r">
          <el-button type="primary" size="mini" :disabled="!selectData.length" @click="confim">确定</el-button>
          <el-button size="mini" plain type="primary" @click="close">关闭</el-button>
        </div>
      </div>
    </div>

    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
import clickoutside from 'element-ui/src/utils/clickoutside'
export default {
  name: 'CascaderPeople',
  directives: { clickoutside },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    dataSelected: {
      // 上次选中的数据
      type: Array,
      default: function() {
        return []
      }
    },
    // value: {
    //   // 选中数据集
    //   type: Array,
    //   default: function() {
    //     return []
    //   }
    // },
    options: {
      // 数据集
      type: Array,
      default: function() {
        return []
      }
    },
    visible: { // 显示隐藏
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedValue: [],
      selectData: [],
      value: []
    }
  },
  computed: {
    popoverShow: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    disableClear() {
      return !this.checkedValue.length
    }
  },
  watch: {
    value: {
      handler(n, o) {
        this.setSelectData()
      },
      deep: true
    },
    options: {
      handler(n, o) {},
      deep: true
    }
  },
  mounted() {
    if (this.dataSelected && this.dataSelected.length) {
      try {
        this.value = [...this.dataSelected]
      } catch (e) {
        console.log(e)
      }
    }
  },
  created() {
  },
  methods: {
    setSelectData() {
      const checkedValue = []
      this.value.forEach(element => {
        if (element.path) {
          checkedValue.push(element.path)
        }
      })
      this.checkedValue = checkedValue
      this.$nextTick(() => {
        this.getSelectData()
      })
    },
    getSelectData(e) {
      const nodes = this.$refs.cascader.getCheckedNodes()
      const selectData = []
      nodes.forEach(node => {
        if (node.isLeaf) {
          selectData.push({
            label: node.label,
            value: node.value,
            path: node.path,
            pathLabels: node.pathLabels,
            pathNodes: node.pathNodes,
            node: node,
            pathTexts: node.pathLabels.join('>')
          })
        }
      })
      this.selectData = selectData
    },
    clickoutside() {
      this.popoverShow = false
    },
    deteleChecked(item, flg) {
      if (flg) {
        this.$refs.cascader.clearCheckedNodes()
      } else {
        item.node.doCheck(false)
        console.log(this.$refs.cascader.calculateMultiCheckedValue, 'refs')
        this.$refs.cascader.calculateMultiCheckedValue()
      }
    },
    confim() {
      const value = []
      this.selectData.forEach(element => {
        let currntNodeData, parentNodeData
        if (element.node && element.node.data) {
          currntNodeData = element.node.data
        }
        if (element.node && element.node.parent && element.node.parent.data) {
          parentNodeData = element.node.parent.data
        }
        let pathNodesArr
        if (element.pathNodes) {
          pathNodesArr = element.pathNodes.map((item) => {
            return item.value
          })
        }
        value.push({
          path: element.path,
          pathLabels: element.pathLabels,
          currntNodeData,
          parentNodeData,
          pathTexts: element.pathTexts,
          id: element.value,
          pathNodesArr
        })
      })
      this.$emit('change', {
        handledData: value
      })
      this.popoverShow = false
    },
    close() {
      this.$emit('close', this.selectData)
    }
  }
}
</script>
<style lang="scss">
.cascader-popper {
  &.el-popover {
    border: none;
    background: #ffffff;
    padding: 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    outline: none;
  }
  .popper__arrow {
    // left: 40px !important;
    &::after {
      border-bottom-color: #f8f8f8 !important;
    }
  }
}
.el-alert__closebtn {
  color: #f56c6c !important;
}
</style>
<style lang='scss' scoped>
.c666 {
  color: #666;
}
.select-warp {
  display: block;
  width: 100%;
  position: relative;
}
.select-input {
  display: block;
  line-height: 1;
  min-height: 32px;
  position: relative;
  font-size: 0;
  width: 100%;
  border: 1px solid #dfdfdf;
  padding: 0 15px;
  border-radius: 6px;
  outline: none;
  outline-color: transparent;
  .add-people {
    position: absolute;
    line-height: 20px;
    top: 6px;
    right: -10px;
    font-size: 14px;
    transform: translateX(100%);
    cursor: pointer;
  }
}
.select__suffix {
  position: absolute;
  height: 100%;
  right: 5px;
  top: 0;
  text-align: center;
  color: #dfdfdf;
  transition: all 0.3s;
  pointer-events: none;
  .is-reverse {
    transform: rotate(180deg);
  }
}
.select__icon {
  width: 25px;
  line-height: 38px;
  transition: transform 0.3s;
  text-align: center;
  font-size: 14px;
}
.select-cascader__tags {
  .select-tag {
    display: inline-block;
    max-width: 100%;
    margin: 3px 8px 3px 0;
    text-overflow: ellipsis;
    background: rgba(248, 248, 248, 1);
    border-radius: 13px;
    line-height: 24px;
    padding: 0 10px;
    font-size: 12px;
    color: #000;
  }
  .select-tag__close {
    font-size: 14px;
    margin-left: 7px;
    user-select: none;
    cursor: pointer;
    color: rgba(204, 204, 204, 1);
    &.disabled {
      cursor: not-allowed;
    }
  }
}
.foot-btn /deep/ {
  background-color: #f8f8f8;
  line-height: 40px;
  height: 40px;
  padding: 0 20px;
  .el-button--mini {
    font-size: 12px;
    padding: 5px 15px;
  }
}
.error-tip {
  color:$danger;
  font-size: 12px;
}
.c666{
  color: #666;
}
.readonly{
  color: #999;
  cursor: not-allowed;
}
.list-content /deep/{
  background-color: #fff;
  white-space: nowrap;
  height: 187px;
  display: flex;
  font-size: 0;
  .el-cascader-menu__wrap{
    height: 100%;
  }
  .el-cascader-panel.is-bordered{
    border:none;
    border-radius: 0px;
  }
  .el-cascader-menu:last-child{
    border-right: solid 1px #e4e7ed;
  }
  .el-cascader-node{
      padding: 0 0 0 10px;
      font-size: 12px;
      line-height: 19px;
      height: 24px;
  }
  .el-cascader-node__label{
    padding-left: 0;
  }
  .el-checkbox{
    margin-right: 6px;
    .el-checkbox__inner{
      border-color: #dfdfdf;
      width: 12px;
      height: 12px;
      border-radius: 0;
      &::after{
        top: 0;
        height: 6px;
        left: 3px;
      }
    }
    &.is-checked .el-checkbox__inner{
      border-color: #1AA696;
    }
  }
  .item-ct{
    position: relative;
    display: inline-block;
    height: 100%;
    min-width: 80px;
    vertical-align: top;
    overflow: hidden;
    &+.item-ct{
      border-left: 1px solid #F1F1F1;
    }
    .item-title{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 2px 10px;
      font-size: 12px;
      line-height: 19px;
      background-color: #fff;
      z-index: 5;
      &.has-delete{
        padding-right: 84px;
      }
    }
    .item-wrap{
      position: relative;
      padding-left: 0;
      &.has-title{
        padding-top: 24px;
      }
    }
    .delete-handle{
      width: 74px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      line-height: 24px;
      &:hover{
        color: $themeColor;
      }
      &.readonly{
        color: #999;
        &:hover{
          color: #999;
        }
      }
    }
    .line{
      position: absolute;
      top: 0;
      right: 74px;
      width: 1px;
      height: 100%;
      background-color: #e4e7ed;
      z-index: 6;
    }
    .item-node{
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
      padding: 2px 10px;
      font-size: 12px;
      line-height: 19px;
      min-height: 24px;
      &.has-delete{
        padding-right: 84px;
        max-width:274px;
      }
      &:hover{
        background-color: #f5f7fa;
      }
      .item-node-icon{
        font-size: 14px;
        cursor: pointer;
        &:hover{
          color: $themeColor;
        }
      }
      .readonly{
        .item-node-icon{
          cursor: not-allowed;
          &:hover{
            color: #999;
          }
        }
      }
      &.has-child{
        padding-right: 30px;
        .item__postfix{
          position: absolute;
          top: 2px;
          right: 0;
          bottom: 0;
          text-align: center;
          width: 30px;
          line-height: 19px;
          cursor: pointer;
        }
      }
    }
  }
  .no-data{
    text-align: center;
    font-size: 12px;
    padding-top: 14%;
    min-width: 150px;
  }
}
.c000{
  color: #000;
}
</style>
