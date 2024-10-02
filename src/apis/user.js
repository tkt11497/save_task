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
