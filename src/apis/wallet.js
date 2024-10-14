import request from '@/utils/request.js'

// 连接页面/钱包页面-获取平台代币列表
export const getAllCoinTypeApi = (data) => {
	return request.get('/wallet/getAllToken', { params: data })
}

// 获取所有链上钱包余额
export const getAllChainTokenBalanceApi = () => {
	return request.get('/wallet/getAllChainTokenBalance')
}

// 获取平台代币余额
export const getAllPlatformTokenBalanceApi = () => {
	return request.get('/wallet/getAllPlatformTokenBalance')
}

// 获取链上单一token余额
export const getSingleChainTokenBalanceApi = (walletToken) => {
	return request.post('/wallet/getSingleChainTokenBalance', { walletToken })
}

// 质押页面-获取质押收益金额
export const fetchStakeIncomeApi = () => {
	return request.get('/wallet/stake/eth')
}

// 理财页面-获取理财质押收益金额
export const fetchFinancialStakeIncomeApi = () => {
	return request.get('/wallet/stake/financial')
}

// 用户页面-获取理财质押收益
export const fetchUserStakeIncomeApi = () => {
	return request.post('/wallet/stake/getUserWaller')
}

// 钱包-快捷充值
export const walletSpeedRechargeApi = (data) => {
	return request.post('/wallet/speedRecharge', data)
}

// 钱包-充值
export const walletRechargeApi = (data) => {
	return request.post('/wallet/recharge', data)
}

// 钱包-提现
export const walletWithdrawApi = (data) => {
	return request.post('/wallet/withdraw', data)
}

// 钱包-兑换
export const walletExchangeApi = (data) => {
	return request.post('/wallet/exchange', data)
}

// 合约地址：contractAddress
export const fetchWalletConfig = () => {
	return request.get('/wallet/getGlobalConfig')
}

// 获取充值地址
export const fetchWithdrawalAddressApi = () => {
	return request.get('/collection/address/get')
}
