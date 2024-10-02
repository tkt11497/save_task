import { defineStore,storeToRefs } from 'pinia'
import { userLoginApi } from '@/apis/user.js'
import {useWeb3Store} from '@/store'

export default defineStore('auth', {
	state: () => ({
		authToken: '',
		userInfo: {}
	}),

	getters: {},

	actions: {
		async loginAction() {
			try {
				console.log('loginAction')
				const web3Store = useWeb3Store()
				const {address,currentCurrency}=  storeToRefs(web3Store)

				const response = await userLoginApi({
					walletAddress: address.value,
					// chain: 'eth',
					defaultToken: currentCurrency.value.tokenName,
					inviteCode: ''
				})

				this.userInfo = response.data
				console.log('用户登录成功', response)
			} catch (e) {
				console.log('用户登录错误', e)
				throw e
			}
		}
	},
	// 持久化存储
	persist: {
		enabled: true,
		strategies: [{ storage: localStorage }],
	},
})
