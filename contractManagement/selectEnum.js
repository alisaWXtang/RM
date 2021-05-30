const changeModeOptions = [

  {
    value: '0',
    label: '原始合同'
  },
  {
    value: '1',
    label: '补充协议'
  },
  {
    value: '2',
    label: '录入信息变更'
  },
  {
    value: '3',
    label: '小错误修改'
  },
  {
    value: '4',
    label: '终止合同'
  },
  {
    value: '5',
    label: '终止合同（需结算）'
  }
]

const approvelStatusOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '草稿'
  },
  {
    value: '2',
    label: '待审批'
  },
  {
    value: '3',
    label: '已通过'
  },
  {
    value: '4',
    label: '已拒绝'
  },
  {
    value: '5',
    label: '已签订'
  },
  {
    value: '6',
    label: '已撤回'
  },
  {
    value: '7',
    label: '已终止'
  },
  {
    value: '9',
    label: '已结束'
  }
]

const changapprovelStatusOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '草稿'
  },
  {
    value: '2',
    label: '待审批'
  },
  {
    value: '3',
    label: '已通过'
  },
  {
    value: '4',
    label: '已驳回'
  },
  // {
  //   value: '5',
  //   label: '已签订'
  // },
  {
    value: '6',
    label: '已撤销'
  }
  // {
  //   value: '7',
  //   label: '已终止'
  // },
  // {
  //   value: '9',
  //   label: '已结束'
  // }
]

const contractTypeCodeOptions = [
  {
    value: '1',
    label: '合同类型-1'
  },
  {
    value: '2',
    label: '合同类型-2'
  },
  {
    value: '3',
    label: '合同类型-3'
  }
]

const contractStatusOptions = [
  // 1 草稿  2 待审批  3 已通过  4 已拒绝  5 已签订 6 已撤回  7 已终止 9 已结束
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '草稿'
  },
  {
    value: '2',
    label: '待审批'
  },
  {
    value: '3',
    label: '已通过'
  },
  {
    value: '4',
    label: '已驳回'
  },
  {
    value: '5',
    label: '已签订'
  },
  {
    value: '6',
    label: '已撤销'
  },
  {
    value: '7',
    label: '已终止'
  },
  {
    value: '9',
    label: '已结束'
  }
]

const contractChangeType = [
  {
    value: '1',
    label: '补充协议'
  },
  {
    value: '2',
    label: '录入信息变更'
  },
  {
    value: '3',
    label: '小错误修改'
  },
  {
    value: '4',
    label: '终止合同'
  },
  {
    value: '5',
    label: '终止合同（需结算）'
  }
]

// 签署类型(51：新合同 52：对账/结算单 53：保密协议 )
const signatureTypeOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '51',
    label: '新合同'
  },
  {
    value: '52',
    label: '对账/结算单'
  },
  {
    value: '53',
    label: '协议类'
  }
]
// 合同性质(61：普通合同 62：框架合同无单价 63：框架合同有单价 )
const contractNatureOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '61',
    label: '普通合同'
  },
  {
    value: '62',
    label: '框架合同有单价'
  },
  {
    value: '63',
    label: '框架合同无单价'
  }
]

// 收支类型(71：收入类 72：支出类 73：有收有支 74：无收无支 )
const incomeExpenditureOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '71',
    label: '收入类'
  },
  {
    value: '72',
    label: '支出类'
  },
  {
    value: '74',
    label: '无收无支'
  }
]

const goAnchorSort = [
  'contractName', // 合同名称
  'contractTypeNameLable', // 合同类型
  'agenter', // 经办人
  'supervisor', // 监督人
  'demandDept', // 需求部门
  'selectContractParticipantInfos', // 交易方
  'contractSubjectName', // 签约主体
  'postponed', // 是否顺延
  'name', // 名称
  'certificateNumber', // 证件号
  'contractContent', // 合同内容
  'businessDirector', // 业务负责人
  'usageSealType', // 用章类型
  'confidentialityLevel', // 保密级别
  'contractTextAttachmentsls', // 上传合同
  'needFile' // 需要存档
]
export {
  changeModeOptions,
  contractTypeCodeOptions,
  contractStatusOptions,
  contractChangeType,
  goAnchorSort,
  approvelStatusOptions,
  signatureTypeOptions,
  changapprovelStatusOptions,
  contractNatureOptions,
  incomeExpenditureOptions
}
