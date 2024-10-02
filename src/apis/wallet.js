import request from '@/utils/request.js'

// 获取连接币种列表
export const getAllChainApi = () => {
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
export const getSingleChainTokenBalanceApi = (data) => {
	return request.post('wallet/getSingleChainTokenBalance', data)
}
