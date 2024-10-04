import request from '@/utils/request.js'

// 质押页面-个人质押配置信息
export const fetchPersonalStakeListApi = () => {
	return request.get('/stake/person')
}

// 质押页面-联合质押配置信息
export const fetchJointStakeListApi = () => {
	return request.get('/stake/union')
}

// 理财页面-理财质押配置信息
export const fetchFinancialStakeListApi = () => {
	return request.get('/stake/financial')
}

// 首页-智能合约 固定质押信息
export const fetchFixStakeApi = () => {
	return request.get('stake/fix')
}

// 添加 理财质押订单、联合质押订单、个人质押订单
export const addStakeOrder = (data) => {
	return request.post('/stakeOrder/add', data)
}

// 添加固定质押订单
export const addFixStakeOrderApi = (data) => {
	return request.post('/stakeOrder/add/fix', data)
}

// 固定质押-申请节点金额
export const addNodeAmountApi = (data) => {
	return request.post('/nodeOrder/add', data)
}

// 获取分页质押订单
export const fetchStakeOrderListApi = (data) => {
	return request.post('/stakeOrder/list', data)
}

// 提前赎回质押
export const pledgeRedemptionApi = (data) => {
	return request.get('/stakeOrder/cancel', { params: data })
}

// 领取质押奖励
export const claimRewardsApi = (data) => {
	return request.get('/stakeOrder/receive', { params: data })
}
