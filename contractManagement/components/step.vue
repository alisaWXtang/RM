<template>
  <div ref="part-steps-N" class="part-steps-N">
    <ul ref="partstepsul" class="part-steps-ul">
      <li v-for="(item,index) in steps" ref="partstepsid" :key="index">
        <div style="min-width:120px;padding: 8px 0;" @click="chageTemplate(item.processTypeCode,index,item.isPassFlag);">
          <div class="title-point">
            <div :class="['circle-point',{'circle-point-three':item.isPassFlag==='N'}, {'circle-point-one':templateTypeCopy===index},{'click-point':item.isPassFlag!=='N'}]"></div>
            <div v-if="index!==0" :class="['line-left-point', 'line-point',{'line-point-grey':item.isPassFlag==='N'}]"></div>
            <div v-if="(templateTypeCopy!==index && index !== (steps.length-1)) || (templateTypeCopy===index && !item.processTemplateListByBizIdVo && index !== (steps.length-1))" :class="['line-right-point', 'line-point',{'line-point-grey':(item.isPassFlag==='N'||steps[index+1].isPassFlag==='N')}]"></div>
          </div>
          <div class="title-content">
            {{ item.processTypeName }}
          </div>
        </div>
        <div v-if="templateTypeCopy===index && item.processTemplateListByBizIdVo" class="chilren-point">
          <ul>
            <li v-for="(im,idx) in item.processTemplateListByBizIdVo.processTemplateList" :key="idx">
              <div style="min-width:120px">
                <div class="title-point">
                  <div :class="['circle-point','circle-point-two',{'circle-point-three':im.isPassFlag==='N'}]"></div>
                  <div v-if="idx!==0" class="line-left-point line-point"></div>
                  <div v-if="idx!==item.processTemplateListByBizIdVo.processTemplateList.length-1" class="line-right-point line-point"></div>
                </div>
                <div class="title-content">{{ im.templateName }}</div>
              </div>
            </li>

          </ul>
        </div>

      </li>
    </ul>
    <div v-if="showArrows" :class="['part-steps-left-add',{'grey':!showLeftArrows}]" @click="leftShift"> &lt; </div>
    <div v-if="showArrows" :class="['part-steps-right-add',{'grey':!showRightArrows}]" @click="rightShift"> &gt; </div>
  </div>
</template>
<script>
export default {
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    templateType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showArrows: false,
      showLeftArrows: true,
      showRightArrows: true,
      liWidths: 0,
      differenceTotal: 0,
      stepsData: [],
      templateTypeCopy: ''
    }
  },
  watch: {
    templateType: {
      immediate: true,
      handler(val) {
        this.templateTypeCopy = val
      }

    }
  },

  mounted() {
    const that = this
    const timer = setInterval(function() {
      if (that.$refs.partstepsid) {
        that.clientChange()
        clearInterval(timer)
      }
    }, 300)
    window.onresize = () => {
      return (() => {
        this.clientChange()
      })()
    }
  },
  methods: {
    clientChange() {
      if (!this.$refs.partstepsid || !this.$refs['part-steps-N']) {
        return
      }

      this.$refs.partstepsul.style['margin-left'] = '0'
      this.liWidths = 0
      this.$refs.partstepsid.forEach(item => {
        this.liWidths += item.offsetWidth
      })
      this.differenceTotal = this.$refs['part-steps-N'].clientWidth - this.liWidths
      this.showArrows = this.liWidths > this.$refs['part-steps-N'].clientWidth
      this.showRightArrows = false
      this.showLeftArrows = true
    },
    leftShift() {
      if (!this.showLeftArrows) {
        return
      }

      // this.$refs.partstepsul.style['margin-left'] = '-' + (this.liWidths - parseInt(this.$refs.partstepsul.offsetWidth)) + 'px'
      if (parseInt(this.$refs.partstepsul.style['margin-left'])) {
        const value = parseInt(this.$refs.partstepsul.style['margin-left']) - 80
        if (value < this.differenceTotal) {
          this.$refs.partstepsul.style['margin-left'] = this.differenceTotal + 'px'
          this.showLeftArrows = false
          this.showRightArrows = true
        } else {
          this.$refs.partstepsul.style['margin-left'] = (parseInt(this.$refs.partstepsul.style['margin-left']) - 80) + 'px'
          this.showRightArrows = true
          this.showLeftArrows = true
        }
      } else {
        this.$refs.partstepsul.style['margin-left'] = '-80px'
      }
    },
    rightShift() {
      if (!this.showRightArrows) {
        return
      }

      if (parseInt(this.$refs.partstepsul.style['margin-left'])) {
        const value = parseInt(this.$refs.partstepsul.style['margin-left']) + 80
        if (value > 0) {
          this.$refs.partstepsul.style['margin-left'] = '0px'
          this.showRightArrows = false
        } else {
          this.$refs.partstepsul.style['margin-left'] = (parseInt(this.$refs.partstepsul.style['margin-left']) + 80) + 'px'
          this.showRightArrows = true
          this.showLeftArrows = true
        }
      }
    },
    clickPoint(index, isPassFlag) {
      if (isPassFlag === 'N') {
        return
      }
      this.templateTypeCopy = index
      this.clientChange()
    },
    chageTemplate(processTypeCode, index, isPassFlag) {
      if (isPassFlag === 'N') {
        return
      }
      this.templateTypeCopy = index
      this.clientChange()

      this.$emit('chageTemplate', processTypeCode)
    }

  }
}
</script>
<style lang="scss" scoped>
.part-steps-N {
  position: relative;
  //margin-top:10px;
  //padding: 24px;
  background-color: #fff;
  overflow: hidden;
  .part-steps-ul{
    display:-webkit-box;
    display:-ms-flexbox;
    justify-content: center;
    font-size: 12px;
    .click-point{
      cursor: pointer;
    }
    li{
      min-width: 120px;
      display: flex;
      //flex-direction: column;
      justify-content: center;
      align-items: center;
      .title-point{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: relative;
      }
      .circle-point{
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid #2EC09A;
        background: #D3FFF4;
      }
      .circle-point-one{
        width: 15px;
        height: 15px;
        border: 3px solid #abe6d7;
        background-color: #2EC09A;
      }
      .circle-point-three{
        background: #FFFFFF;
        border: 1px solid #CCCCCC;
      }
      .line-point{
       position: absolute;
       width: calc(51% - 18px );
       right: 0;
       border-top: 1px solid #2EC09A;
      }
      .line-point-grey{
       border-top: 1px solid #DFDFDF;
      }
      .line-right-point{
       right: 0;
      }
      .line-left-point{
       left: 0;
      }
      .title-content{
        width:100%;
        text-align: center;
        padding: 6px;
      }
      .chilren-point{
        background: #E1F5F0;
      }
      .chilren-point>ul{
        display: flex;
        margin:0 10px 0 0;
        position: relative;
        &::before{
          position: absolute;
          top:10px;
          left:-12px;
          content:'';
          width:0;
          height:0;
          border-top:6px solid transparent;
          border-bottom:6px solid transparent;
          border-right:12px solid #E1F5F0;
        }
        li{
          padding: 12px 0;
          .circle-point-two{
            width: 8px;
            height: 8px;
            background: #2EC09A;
          }
          .circle-point-three{
            width: 8px;
            height: 8px;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
          }
        }
      }

    }
  }
  .part-steps-left-add,.part-steps-right-add{
      cursor: pointer;
      position:absolute;
      top:0;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #2EC09A;
      background-color: #fff;
      padding:0 6px;
  }
  .part-steps-right-add{
    right:0;
  }
  .grey{
    color:#dad3d3;
  }
}
</style>
