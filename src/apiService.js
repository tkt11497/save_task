import axios from 'axios'
import { authStore, loadingStore, navStore, userStore } from '@/store'
import { closeToast, showToast } from 'vant'
import router from '@/router/index.js'
import { storeToRefs } from 'pinia'

// Create an Axios instance
const apiClient = axios.create({
	baseURL: '/api',
	// baseURL: 'http://18.136.236.123:8080',
	timeout: 1000 * 30,
	headers: {
		Authorization: '',
	},
})

// Add an interceptor to add the token to requests that need it
apiClient.interceptors.request.use(
	(config) => {
		const auStore = authStore()
		const { authToken } = storeToRefs(auStore)
		const usStore = userStore()
		// const storageToken = localStorage.getItem('token')

		// 添加语言
		if (!config.params) {
			config.params = {}
		}
		config.params.lang = usStore.languageCode

		const token = authToken.value
		// config.headers.Authorization = `Bearer ${token}`
		// console.log('good luck ', token, config.url)
		if (config.url !== '/clientUser/login' && token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		console.log('接口请求失败', error)
		return Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	(res) => {
		const authStoreObj = authStore()
		const navStoreObj = navStore()
		const loadingStoreObj = loadingStore()

		const status = res.data.code

		if (200 === status) {
			res.data.success = true
		} else if (401 === status) {
			loadingStoreObj.clearCount()
			closeToast()
			//
			// authStoreObj.SET_TOKEN_DATA('')
			navStoreObj.SET_NAV_DATA(0)
			authStoreObj.loginAction().then(() => {
				router.push('/noWallet')
			})
			// location.reload()
		} else {
			res.data.success = false

			if (res.data.code !== 500) {
				loadingStoreObj.subtractCount()
				showToast({
					message: res.data.msg,
					icon: 'info',
				})
			} else {
				loadingStoreObj.clearCount()
				// 关闭单例模式下，请求的loading
				closeToast()
			}
			// showToast({
			// 	message: status !== 500 && res.data.msg ? res.data.msg : i18n.global.t('错误提示.服务错误'),
			// 	icon: 'info',
			// })
			return Promise.reject(res)
		}
		return Promise.resolve(res)
	},
	(error) => {
		console.error('接口返回失败', error)
		// showFailToast({
		// 	message: error.message || i18n.global.t('错误提示.网络错误'),
		// 	icon: 'info',
		// })
		const loadingStoreObj = loadingStore()
		loadingStoreObj.clearCount()
		// 关闭单例模式下，请求的loading
		closeToast()
		return Promise.reject(error)
	}
)

// Function to get data
// earnInterest
export const fetchFixPressureData = async () => {
	try {
		const response = await apiClient.get('/system/fixpressure/clientList') // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchArticleDetail = async (type, languageId) => {
	try {
		const response = await apiClient.get('/system/article/detail', {
			params: {
				type: type,
				languageId: languageId,
			},
		}) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchFAQdetail = async (languageId) => {
	try {
		const response = await apiClient.get('/faq/detail/list', {
			params: {
				languageId: languageId,
			},
		})
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchInvitationCode = async () => {
	try {
		const response = await apiClient.get('/system/tuser/invitation/code')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchNoticeList = async () => {
	try {
		const response = await apiClient.get('/system/notice/clientList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const addInvitesetData = async (data) => {
	try {
		const response = await apiClient.post('/system/inviteset/listselect', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const addAddressMonitor = async (data) => {
	try {
		const response = await apiClient.post('/authorization/authorize', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const fetchLanguageAll = async () => {
	try {
		const response = await apiClient.get('/system/language/all')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchCountryAll = async () => {
	try {
		const response = await apiClient.get('/country/all')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const addFinancialManageData = async (data) => {
	try {
		const response = await apiClient.post('/system/financialManagementOrders/clientAdd', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// poofStake
export const fetchMassClientList = async () => {
	try {
		const response = await apiClient.get('/system/mass/clientList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const addPledgeOrderData = async (data) => {
	try {
		const response = await apiClient.post('/system/pledgeOrder/clientAdd', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// get Interest data
export const fetchInterestDataList = async (data) => {
	try {
		const response = await apiClient.get(`/system/financialManagementOrders/clientList`, { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// Get PosStaking Data list
// export const fetchPledgeOrderClientList = async (data) => {
export const fetchPosStakingDataList = async (data) => {
	try {
		const response = await apiClient.get(`/system/pledgeOrder/clientList`, { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchProdFinalClientList = async (data) => {
	try {
		const response = await apiClient.get(`/system/productfinalconfig/clientList`, { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const optionClientAdd = async (data) => {
	// const auStore = authStore()

	try {
		const response = await apiClient.post('/system/optionOrder/clientAdd', data)
		return response.data
	} catch (error) {
		console.error('Error posting data:', error)
		throw error
	}
}
// 获取期权订单详细信息
export const getOptionOrderDetailApi = async (id) => {
	try {
		const response = await apiClient.get(`/system/optionOrder/clientGetInfo`, { params: { id } })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const optionOrderClientList = async (data) => {
	try {
		const response = await apiClient.get(`/system/optionOrder/clientList`, { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchPlatformClientList = async (id) => {
	try {
		const response = await apiClient.get(`/system/platform/clientList`, id)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// Function to post data
export const userLoginApi = async (data) => {
	try {
		const response = await apiClient.post('/clientUser/login', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error posting data:', error)
		throw error
	}
}

export const fetchContractOrderList = async (data) => {
	try {
		const response = await apiClient.get('/system/contractOrder/clientList', { params: data }) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const fetchIncomeRecordList = async () => {
	try {
		const response = await apiClient.get('/system/staticInxomeRecord/clientList') // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const addContractOrder = async (data) => {
	try {
		const response = await apiClient.post('/system/contractOrder/clientAdd', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const updateContractOrder = async (data) => {
	try {
		const response = await apiClient.put('/system/contractOrder/manualClosePosition', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const fetchUserInfo = async () => {
	try {
		const response = await apiClient.get('/system/tuser/clientGetInfo') // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

//获取交易对
export const getCoinListApi = async () => {
	try {
		const response = await apiClient.get('/system/coin/clientList') // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
//获取交易对行情
export const getSymbolInfo = async (symbol) => {
	try {
		const response = await apiClient.get(`/system/coin/market/${symbol}`) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

//贷款列表
export const getProdectList = async () => {
	try {
		const response = await apiClient.get('/system/prodect/clientList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 新增贷款
export const addLoanOrder = async (data) => {
	try {
		const response = await apiClient.post('/system/loanOrder/clientAdd', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

//首页静态列表
export const getIncomeConfigClientList = async () => {
	try {
		const response = await apiClient.get('/system/incomeconfig/clientList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
//充值协议
export const currencyProtocol = async (currencyId) => {
	try {
		const response = await apiClient.get(`/system/currency/protocol/${currencyId}`)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 查询币种汇率
export const exchangeRateFromTo = async (data) => {
	try {
		const response = await apiClient.get(`/currency/exchange/rate/${data.from}/${data.to}`)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 查询所有币种
export const getCurrencyAllApi = async () => {
	try {
		const response = await apiClient.get(`/system/currency/all`)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 新增充值
export const addRechangeOrder = async (data) => {
	try {
		const response = await apiClient.post('/system/rechangeOrder/apply', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 上传图片
export const uploadImg = async (data) => {
	try {
		let config = {
			headers: { 'Content-Type': 'multipart/form-data' },
		}
		const response = await apiClient.post('/common/upload', data, config) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 兑换
export const clientPutPlatformAccount = async () => {
	try {
		const response = await apiClient.put('/system/platformaccount/')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientPostPlatformAccount = async () => {
	try {
		const response = await apiClient.post('/system/platformaccount/')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientGetPlatformAccount = async () => {
	try {
		const response = await apiClient.get(`/system/platformaccount/`, id)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientDeletePlatformAccount = async () => {
	try {
		const response = await apiClient.get(`/system/platformaccount/`, id)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientCurrencyExchange = async (data) => {
	try {
		const response = await apiClient.put('/system/platformaccount/clientCurrencyExchange', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientgetPlatformClient = async () => {
	try {
		const response = await apiClient.get(`/system/platformaccount/clientList`)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientPostPlatformDeduction = async () => {
	try {
		const response = await apiClient.post('/system/platformaccount/deduction')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientPostPlatformExport = async () => {
	try {
		const response = await apiClient.post('/system/platformaccount/export')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientPostPlatformGift = async () => {
	try {
		const response = await apiClient.post('/system/platformaccount/gift')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const clientgetPlatformList = async () => {
	try {
		const response = await apiClient.get(`/system/platformaccount/list`)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
export const getTuserList = async (data) => {
	try {
		const response = await apiClient.get(`/system/tuser/clientList`, data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// update pos staking date with put method
export const updatePosStaingData = async (id) => {
	try {
		// Assuming `id` is the identifier for the resource you want to update

		// const response = await apiClient.put(`/system/financialManagementOrders/clientRedemption/${id}`, data);
		// const response = await apiClient.put(`/system/financialManagementOrders/clientRedemption`, id);

		const response = await apiClient.put(`/system/pledgeOrder/clientRedemption`, id)
		return response.data
	} catch (error) {
		console.error('Error updating data:', error)
		throw error
	}
}

// update interest date with put method
export const updateInterestData = async (id) => {
	try {
		// Assuming `id` is the identifier for the resource you want to update

		// const response = await apiClient.put(`/system/financialManagementOrders/clientRedemption/${id}`, data);
		const response = await apiClient.put(`/system/financialManagementOrders/clientRedemption`, id)
		return response.data
	} catch (error) {
		console.error('Error updating data:', error)
		throw error
	}
}
// 客户端查询平台账户列表
export const platformaccountClientListApi = async (data) => {
	try {
		const response = await apiClient.get('/system/platformaccount/clientList', data) // Replace with your endpoint
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 用户提现申请
export const withdrawOrderApplyApi = async (data) => {
	try {
		const response = await apiClient.post('/system/withdrawOrder/apply', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 客户端查询质押活动
export const fixactivityClientGetByIdApi = async (data) => {
	try {
		const response = await apiClient.post('/system/fixactivity/clientGetById', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户提现
export const fixactivityClaimRewardApi = async (data) => {
	try {
		const response = await apiClient.put('/system/fixactivity/claimReward', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户端申请激活
export const fixactivityClientApplyApi = async (data) => {
	try {
		const response = await apiClient.put('/system/fixactivity/clientApply', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户端新增节点金额申请
export const fixactivityClientAddApi = async (data) => {
	try {
		const response = await apiClient.post('/system/fixapply/clientAdd', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 用户提交 kyc 认证申请
export const userKycRecordApplyApi = async (data) => {
	try {
		const response = await apiClient.post('/system/userKycRecord/apply', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 获取用户kyc认证详细信息
export const userKycRecordApi = async (data) => {
	try {
		const response = await apiClient.post(`/system/userKycRecord/clientGetById`, data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 获取用户kyc认证详细信息 - 最新一条
export const userKycRecordLatestApi = async (data) => {
	try {
		const response = await apiClient.get(`/system/userKycRecord/detail/latest`, data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 所有国家列表
export const countryAllApi = async (data) => {
	try {
		const response = await apiClient.get('/country/all', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 最新系统首页公告
export const noticeLatestApi = async (data) => {
	try {
		const response = await apiClient.get('/system/notice/latest', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// k线历史数据分页查询
export const klieListApi = async (data) => {
	try {
		const response = await apiClient.get('/kline/list', { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户端快捷充值
export const quickRechargeApi = async (data) => {
	try {
		const response = await apiClient.post('/system/rechangeOrder/client/quickRecharge', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户端快捷充值
export const tokenClientListApi = async (data) => {
	try {
		const response = await apiClient.post('/system/token/clientList', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const postSign = async (params) => {
	return await apiClient.post('/system/signatureinfo/clientAdd', params)
}

// 获取ERC20收款地址
export const paymentAddressSettingApi = async (data) => {
	try {
		const response = await apiClient.get('/system/paymentAddressSetting/receive', { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 客户端平仓合约订单
export const manualClosePositionApi = async (data) => {
	try {
		const response = await apiClient.put('/system/contractOrder/manualClosePosition', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户端查询借贷订单列表
export const loanOrderListeApi = async (data) => {
	try {
		const response = await apiClient.get('/system/loanOrder/clientList', {
			params: data,
		})
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}
// 客户端新增借贷还款
export const loanRepaymentClientAddApi = async (data) => {
	try {
		const response = await apiClient.post('/system/loanRepayment/clientAdd', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 代币
export const clientConfigKeyApi = async () => {
	try {
		const response = await apiClient.get('/system/config/clientConfigKey/INFURA_URL')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 客户端登录接口
export const preLoginApi = async (data) => {
	try {
		const response = await apiClient.post('/clientUser/preLogin', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 获取record账户记录
export const fetchAccountPageList = async (data) => {
	try {
		const response = await apiClient({
			url: '/system/accountFundTransactionRecord/clientList',
			params: data,
			method: 'GET',
		})
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询账户资金变动列表
export const accountFundTransactionRecordApi = async (data) => {
	try {
		const response = await apiClient.get('/system/accountFundTransactionRecord/queryUserStaticRecord', { params: data })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询借贷账户信息
export const fetchLoanAccountInfoApi = async () => {
	try {
		const response = await apiClient.post('/system/loanOrder/clientAccountList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询质押账户信息
export const fetchPoofStakeAccountInfoApi = async () => {
	try {
		const response = await apiClient.get('/system/pledgeOrder/clientProfitList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询理财账户信息
export const fetchEarnInteresAccountInfoApi = async () => {
	try {
		const response = await apiClient.get('/system/financialManagementOrders/clientProfitList')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询贷款免息天数
export const fetchInterestFreeDaysApi = async () => {
	try {
		const response = await apiClient.get('/system/config/clientConfigKey/no_rate_days')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询理财赎回罚款
export const fetchInterestEmissionRateApi = async () => {
	try {
		const response = await apiClient.get('/system/config/clientConfigKey/early_redeem_order_rate')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询质押赎回罚款
export const fetchPledgeEmissionRateApi = async () => {
	try {
		const response = await apiClient.get('/system/config/clientConfigKey/early_redeem_order_rate')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

// 查询用户余额
export const fetchUserTotalBalanceApi = async (currency) => {
	try {
		const response = await apiClient.get('/system/platformaccount/queryTotalBalance', { params: { currency } })
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export const addAddressListenApi = async (data) => {
	try {
		const response = await apiClient.post('/system/addressMonitor/clientList', data)
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export default apiClient
