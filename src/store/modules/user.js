// import Lang from '@/views/user/components/lang.vue'
import { useRequest } from '@/hooks/fetch.js'
import { defineStore } from 'pinia'
import { fetchUserInfo, platformaccountClientListApi } from '@/apiService'
import { getDefaultLanguage } from '@/i18n/index.js'

export const useUserStore = defineStore('new-user', () => {
	const { response: userInfo } = useRequest({
		url: '/system/tuser/clientGetInfo',
		method: 'get',
		initialValues: {
			createBy: '',
			createTime: '',
			updateBy: '',
			updateTime: null,
			remark: '',
			id: 0,
			sysUserId: 0,
			parentId: 0,
			userName: '',
			agentPassword: null,
			phone: null,
			email: null,
			idBackImg: null,
			idFrontImg: null,
			invitationCode: '',
			status: 0,
			walletAddress: '',
			currency: '',
			chain: '',
			userType: 0,
			upwardAdjustmentAmount: null,
			agentType: '',
			totalLoanAmount: null,
			registerTime: '',
			registerTimeStart: null,
			registerTimeEnd: null,
			maximumStrategyCount: null,
			membershipStatus: false,
			fundsFreeze: false,
			creditScore: null,
			referringDomain: '',
			accountType: null,
			amount: null,
			kycApprovalStatus: null,
			loanApprovalStatus: null,
			firstName: null,
			lastName: null,
			birthday: null,
			country: null,
			detailAddress: null,
			areaCode: null,
			approvalTime: null,
			reviewer: null,
			handheldIdCardPhoto: null,
			delFlag: '',
			secureKey: null,
			totalRevenue: null,
			todayRevenue: null,
			todayProfit: null,
			profitCurrency: null,
			earnInterestAccount: null,
			earnInterestAccountCurrency: null,
			proofStakeAccount: null,
			proofStakeAccountCurrency: null,
			earnInterestAccountTodayProfitCurrency: null,
			earnInterestAccountTodayProfit: 0,
			proofStakeAccountTodayProfitCurrency: null,
			proofStakeAccountTodayProfit: 0,
		},
	})

	return {
		userInfo,
	}
})

export default defineStore('user', {
	state: () => ({
		flag: 'yes',
		userId: 1,
		userInfo: {},
		language: getDefaultLanguage().language,
		languageCode: getDefaultLanguage().languageCode,
		loanOrder: {},
	}),

	getters: {},

	actions: {
		SET_PATH_DATA(value) {
			this.flag = value
		},
		SET_USERID_DATA(value) {
			this.userId = value
		},
		SET_USER_INFO(value) {
			this.userInfo = value
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
		fetchUserInfoAction() {
			return new Promise((resolve, reject) => {
				fetchUserInfo()
					.then((res) => {
						let temp = res.data
						if (temp) {
							this.userId = temp.id
							this.userInfo = temp
						}
						console.log('fetchUserInfo', res)
						resolve(res)
					})
					.catch(() => {
						resolve({})
					})
			})
		},
		// 获取当前登录币种的平台账户
		fetchPlatformAccount(coinCode) {
			return new Promise((resolve, reject) => {
				// balance
				platformaccountClientListApi()
					.then((res) => {
						let arr = res.data

						const data = arr.find((item) => {
							if (item.coinCode) {
								return coinCode.toLowerCase() === item.coinCode.toLowerCase()
							}
						})
						if (data) {
							console.log(`获取当前币种【${coinCode}】的账户信息，【balance：${data.balance}，balanceToUsdt：${data.balanceToUsdt}】`)
							resolve(data)
						} else {
							console.log(`无法匹配当前币种【${coinCode}】的账户信息`)
							resolve({ balance: 0, balanceToUsdt: 0 })
						}
					})
					.catch(() => {
						reject({ balance: 0 })
					})
			})
		},
	},
	// 持久化存储
	persist: {
		enabled: true,
		strategies: [{ storage: localStorage }],
	},
})
