import { defineStore,storeToRefs } from 'pinia'
import { postData } from '@/apiService.js'
import {useWeb3Store} from '@/store'

export default defineStore('auth', {
	state: () => ({
		authToken: '',
	}),

	getters: {},

	actions: {
		SET_TOKEN_DATA(value) {
			this.authToken = value
		},
		loginAction() {
			return new Promise((resolve, reject) => {
				const web3Store = useWeb3Store()
				const {address,currentCurrency}=  storeToRefs(web3Store)
				const params = {
					address: address.value,
					chain: 'eth',
					tokenType: currentCurrency.value.currency,
				}
				postData(params)
					.then((res) => {
						this.authToken = res.data.token
						// console.log('postData', res)
						resolve(res)
					})
					.catch(() => {
						resolve({})
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
