import request from '@/utils/request.js'

// 获取最新消息
export const fetchLatestNoticeApi = () => {
	return request.get('/notice/new')
}

// 获取消息列表
export const fetchNoticeListApi = (data) => {
	return request.get('/message/list', { params: data })
}

// 文件上传
export const uploadFileApi = (data) => {
	return request.post('/file/upload', data, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
}

// 获取国家列表
export const fetchCountryListApi = () => {
	return request.get('/country/list')
}

// 获取币种间汇率
export const fetchExchangeRateApi = (data) => {
	return request.get('/tokenExchange/getTokenExchange', { params: data })
}
