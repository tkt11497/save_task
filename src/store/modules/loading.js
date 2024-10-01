import { defineStore } from 'pinia'

export default defineStore('loading', {
	state: () => ({
		loadingCount: 0,
	}),

	getters: {},

	actions: {
		addCount() {
			this.loadingCount++
		},
		subtractCount() {
			if (this.loadingCount) {
				this.loadingCount--
			}
		},
		clearCount() {
			this.loadingCount = 0
		},
	},
})
