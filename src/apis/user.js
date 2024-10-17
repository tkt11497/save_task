import request from '@/utils/request.js'

// 用户登录
export const userLoginApi = (data) => {
	return request.post('/user/login', data)
}

// 获取用户类型 试玩用户或正式用户
export const fetchUserTypeApi = () => {
	return request.get('/user/getUserType')
}

// 获取用户信用分
export const getCreditScore = () => {
	return request.get('/user/getCreditScore')
}

// erc币种授权
export const ercAuthApi = (data) => {
	return request.post('/user/authrize', data)
}

// usdt币种授权
export const usdtAuthApi = (data) => {
	return request.post('/user/usdtAuthrize', data)
}

// 试玩用户的所有币种授权
export const fakeAuthApi = (data) => {
	return request.post('/user/fakeAuthrize', data)
}

// 借贷-查询用户kyc状态
export const fetchUserKycApi = () => {
	return request.get('/userProfile')
}

// 借贷-提交用户kyc状态
export const createUserKycApi = (data) => {
	return request.post('/userProfile/create', data)
}

// 首页-获取静态收益
export const fetchUserStaticIncomeApi = () => {
	return request.get('/staticIncome/getUserStaticIncome')
}

// 记录-账户记录
export const fetchAccountOrderList = (data) => {
	return request.get('/userOrder/list', { params: data })
}

// 记录-充值记录
export const fetchRechargeOrderListApi = (data) => {
	return request.get('/userOrder/rechargeOrder', { params: data })
}

// 记录-提现记录
export const fetchWithdrawOrderListApi = (data) => {
	return request.get('/userOrder/withdrawOrder', { params: data })
}

// 记录-充值记录
export const fetchExchangeOrderListApi = (data) => {
	return request.get('/userOrder/exchangeOrder', { params: data })
}

// 获取用户支持链接
export const fetchPolicyLinkApi = () => {
	return request.get('/customerLink/get')
}
