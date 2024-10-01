import { defineStore } from 'pinia'

export default defineStore('useWeb3accountStroe', {
	state: () => ({
		web3account: null,
		checkedCurrency: '',
		transaction: {
			transactionHash: '',
		},
		tokenContractInfo: {
			_address: '',
			balance: '',
			token: '',
		},
	}),

	getters: {},
	actions: {
		updateWeb3accountAction(value) {
			this.web3account = value
		},
		updateCheckedCurrencyAction(value) {
			this.checkedCurrency = value
		},
		updateTransactionAction(value) {
			this.transaction = value
		},
		updateTokenContractInfonAction(value) {
			this.tokenContractInfo = value
		},
	},
	// 持久化存储
	persist: {
		enabled: true,
		strategies: [{ storage: localStorage }],
	},
})
