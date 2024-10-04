import request from '@/utils/request.js'

// 首页 获取交易对列表
export const fetchTradingPairListApi = () => {
	return request.get('/symbol/list')
}

// 获取交易对详情
export const fetchTradingPairDetailApi = (symbolId) => {
	return request.get(`/symbol/${symbolId}`)
}

// 获取分页币种k线历史
export const fetchKlineListApi = (data) => {
	return request.get('/kline/list', { params: data })
}

// 获取期权产品配置列表
export const fetchOptionsProduceListApi = (symbolId) => {
	return request.get(`/option/product/${symbolId}`)
}

// 购买期权
export const buyOptionApi = (data) => {
	return request.post('/option/order/create', data)
}

// 获取期权ID
export const getOptionDetailApi = (orderId) => {
	return request.get(`/option/order/${orderId}`)
}

// 获取期权列表
export const fetchOptionsListApi = (data) => {
	return request.get('/option/order/list', { params: data })
}
