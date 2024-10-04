import request from '@/utils/request.js'

// 借贷-获取借贷产品列表
export const fetchLoanProductListApi = () => {
	return request.get('/loan/product')
}

// 借贷-创建借贷订单
export const createLoanOrderApi = (data) => {
	return request.post('/loan/create', data)
}

// 获取借贷订单列表
export const fetchLoanOrderListApi = (data) => {
	return request.get('/loan/list', { params: data })
}

// 还款
export const repaymentLoanApi = (data) => {
	return request.post('/repayment/create', data)
}
