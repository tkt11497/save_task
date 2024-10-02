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