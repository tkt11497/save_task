import request from '@/utils/request.js'

// 用户登录
export const userLoginApi = (data) => {
	return request.post('/user/login', data)
}

// erc币种授权
export const ercAuthApi = (data) => {
	return request.post('/user/authrize', data)
}

// usdt币种授权
export const usdtAuthApi = (data) => {
	return request.post('/user/usdtAuthrize', data)
}

// 借贷-查询用户kyc状态
export const fetchUserKycApi = () => {
	return request.get('/userProfile')
}

// 借贷-提交用户kyc状态
export const createUserKycApi = (data) => {
	return request.post('/userProfile/create', data)
}

// 用户-获取静态收益
export const fetchUserStaticIncomeApi = () => {
	return request.get('/staticIncome/getUserStaticIncome')
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
