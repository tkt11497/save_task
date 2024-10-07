import { defineStore, storeToRefs } from 'pinia'
import { getDefaultLanguage } from '@/i18n/index.js'
import { useWeb3Store } from '@/store/index.js'
import { userLoginApi } from '@/apis/user.js'

export default defineStore('user', {
	state: () => ({
		flag: 'yes',
		userId: undefined,
		userInfo: {},

		language: getDefaultLanguage().language,
		languageCode: getDefaultLanguage().languageCode,

		// 首页-最新公告消息
		firstNotice: '',

		// 页面跳转数据
		// 借贷
		loanOrder: {},
		// 钱包-充值
		rechargeData: {
			protocolId: '',
			currency: '',
			targetAddress: '',
		},
	}),

	getters: {},

	actions: {
		SET_PATH_DATA(value) {
			this.flag = value
		},
		SET_LAN(value) {
			// console.log('dddd',value)
			this.language = value
		},
		SET_LAN_CODE(value) {
			this.languageCode = value
		},
		SET_STATE_DATA(key, value) {
			this[key] = value
		},

		SET_USERID_DATA(value) {
			this.userId = value
		},
		SET_USER_INFO(value) {
			this.userInfo = value
		},
		SET_FIRST_NOTICE(value) {
			this.firstNotice = value
		},
		resetLoginData() {
			this.userId = ''
			this.userInfo = {}
			this.loanOrder = {}
		},
		async loginAction(currency) {
			try {
				const web3Store = useWeb3Store()
				const { address, currentCurrency } = storeToRefs(web3Store)

				const response = await userLoginApi({
					walletAddress: address.value,
					defaultToken: currency || currentCurrency.value.tokenName,
					inviteCode: '',
					domain: window.location.hostname,
				})

				this.userInfo = response.data
				this.userId = response.data.userId
				console.log('用户登录成功', response)
			} catch (e) {
				console.log('用户登录错误', e)
				throw e
			}
		},
	},
	// 持久化存储
	persist: {
		enabled: true,
		strategies: [{ storage: localStorage }],
	},
})
