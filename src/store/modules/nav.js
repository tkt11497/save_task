import { defineStore } from 'pinia'

export default defineStore('nav', {
	state: () => ({
		nav: 0,
	}),

	getters: {},

	actions: {
		SET_NAV_DATA(value) {
			this.nav = value
		},
	},
	// 持久化存储
	persist: {
		enabled: true,
		strategies: [{ storage: localStorage }],
	},
})
