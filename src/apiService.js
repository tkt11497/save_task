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

export const fetchLanguageAll = async () => {
	try {
		const response = await apiClient.get('/system/language/all')
		return response.data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

export default apiClient
