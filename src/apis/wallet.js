import request from '@/utils/request.js'

// 连接页面/钱包页面-获取平台代币列表
export const getAllCoinTypeApi = () => {
	return request.get('/wallet/getAllToken')
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
	return request.post('wallet/getSingleChainTokenBalance', { walletToken })
}

// 质押页面-获取质押收益金额
export const fetchStakeIncomeApi = () => {
	return request.get('/wallet/stake/eth')
}

// 理财页面-获取理财质押收益金额
export const fetchFinancialStakeIncomeApi = () => {
	return request.get('/wallet/stake/financial')
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

// 获取钱包全局配置-充值收款地址：collectionAddress  合约地址：contractAddress  单笔最大借款：dufaultBorrowLimit
export const fetchWalletConfig = () => {
	return request.get('/wallet/getGlobalConfig')
}
